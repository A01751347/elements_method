import { desc, eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { blogComments, blogPosts } from "@/shared/db/schema/blog";
import {
  Boton,
  Cifra,
  CifraGrid,
  Conteo,
  EstadoVacio,
  Filtros,
  Insignia,
  PageHeader,
  Tabla,
  Td,
  Th,
} from "../_components/ui";
import { BotonPendiente, ConfirmarAccion } from "../_components/client";
import { COMMENT_STATUS, estado } from "../_lib/status";
import { fechaHora } from "../_lib/format";
import { approveComment, marcarSpam, rejectComment } from "./actions";

export const dynamic = "force-dynamic";

/** Trim body text for the list view; the full comment lives in the DB. */
function truncar(texto: string, max: number): string {
  if (texto.length <= max) return texto;
  return `${texto.slice(0, max).trimEnd()}…`;
}

async function loadComments() {
  try {
    const rows = await db
      .select({
        id: blogComments.id,
        authorName: blogComments.authorName,
        authorEmail: blogComments.authorEmail,
        content: blogComments.content,
        status: blogComments.status,
        createdAt: blogComments.createdAt,
        postSlug: blogPosts.slug,
        postTitleEs: blogPosts.titleEs,
      })
      .from(blogComments)
      .leftJoin(blogPosts, eq(blogComments.postId, blogPosts.id))
      .orderBy(desc(blogComments.createdAt))
      .limit(300);

    // Pendientes primero, luego fecha desc (el orderBy de arriba ya deja el
    // resto en ese orden y Array#sort es estable).
    return [...rows].sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      return 0;
    });
  } catch (e) {
    console.error("[admin/comentarios] DB read failed", e);
    return [];
  }
}

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado: estadoFiltro } = await searchParams;
  const all = await loadComments();

  const counts = {
    todos: all.length,
    pending: all.filter((c) => c.status === "pending").length,
    approved: all.filter((c) => c.status === "approved").length,
    rejected: all.filter((c) => c.status === "rejected").length,
    spam: all.filter((c) => c.status === "spam").length,
  };

  const list =
    estadoFiltro && estadoFiltro !== "todos" ? all.filter((c) => c.status === estadoFiltro) : all;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Comentarios"
        subtitle="Moderación de los comentarios del blog. Los pendientes van primero."
      />

      <CifraGrid>
        <Cifra label="Pendientes" value={counts.pending} tone="alerta" note="Esperan tu revisión" />
        <Cifra label="Aprobados" value={counts.approved} tone="ok" note="Visibles en el blog" />
        <Cifra label="Rechazados" value={counts.rejected} tone="peligro" note="No se muestran" />
        <Cifra label="Spam" value={counts.spam} note="Fuera de la cola" />
      </CifraGrid>

      <Filtros
        items={[
          { href: "/admin/comentarios", label: "Todos", count: counts.todos, active: !estadoFiltro },
          {
            href: "/admin/comentarios?estado=pending",
            label: "Pendientes",
            count: counts.pending,
            active: estadoFiltro === "pending",
          },
          {
            href: "/admin/comentarios?estado=approved",
            label: "Aprobados",
            count: counts.approved,
            active: estadoFiltro === "approved",
          },
          {
            href: "/admin/comentarios?estado=rejected",
            label: "Rechazados",
            count: counts.rejected,
            active: estadoFiltro === "rejected",
          },
          {
            href: "/admin/comentarios?estado=spam",
            label: "Spam",
            count: counts.spam,
            active: estadoFiltro === "spam",
          },
        ]}
      />

      <Conteo n={list.length} singular="comentario encontrado" plural="comentarios encontrados" />

      {list.length === 0 ? (
        <EstadoVacio
          title="No hay comentarios."
          body="Cuando alguien comente un artículo, aparecerá aquí para moderarlo."
        />
      ) : (
        <Tabla>
          <thead>
            <tr>
              <Th>Fecha</Th>
              <Th>Autor</Th>
              <Th>Artículo</Th>
              <Th>Comentario</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => {
              const e = estado(COMMENT_STATUS, c.status);
              return (
                <tr key={c.id}>
                  <Td>{fechaHora(c.createdAt)}</Td>
                  <Td>
                    {c.authorName}
                    <p className="pista">{c.authorEmail}</p>
                  </Td>
                  <Td>
                    {c.postSlug ? (
                      <Boton tone="texto" href={`/admin/blog/${c.postSlug}`} className="sobre-fila">
                        {c.postTitleEs}
                      </Boton>
                    ) : (
                      "—"
                    )}
                  </Td>
                  <Td className="max-w-md">{truncar(c.content, 240)}</Td>
                  <Td>
                    <Insignia tone={e.tone}>{e.label}</Insignia>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2 sobre-fila">
                      <form action={approveComment}>
                        <input type="hidden" name="id" value={c.id} />
                        <BotonPendiente tone="primario" className="boton-chico" pendingLabel="Aprobando…">
                          Aprobar
                        </BotonPendiente>
                      </form>
                      <ConfirmarAccion
                        trigger="Rechazar"
                        title="Rechazar comentario"
                        body="El comentario no se muestra en el blog. El autor no recibe aviso."
                        confirmLabel="Sí, rechazar el comentario"
                        pendingLabel="Rechazando…"
                        action={rejectComment}
                        tone="peligro"
                        size="chico"
                        hidden={[{ name: "id", value: c.id }]}
                      />
                      <ConfirmarAccion
                        trigger="Spam"
                        title="Marcar como spam"
                        body="Se marca como spam y desaparece de la cola."
                        confirmLabel="Sí, marcar como spam"
                        pendingLabel="Marcando…"
                        action={marcarSpam}
                        tone="peligro"
                        size="chico"
                        hidden={[{ name: "id", value: c.id }]}
                      />
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Tabla>
      )}
    </div>
  );
}
