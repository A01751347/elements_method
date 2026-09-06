import { desc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { testimonials } from "@/shared/db/schema/testimonials";
import {
  Boton,
  Cifra,
  CifraGrid,
  Conteo,
  EnlaceFila,
  EstadoVacio,
  FilaEnlace,
  Filtros,
  Insignia,
  PageHeader,
  Tabla,
  Td,
  Th,
} from "../_components/ui";
import { BotonPendiente, ConfirmarAccion } from "../_components/client";
import {
  approveTestimonial,
  rejectTestimonial,
  toggleTestimonialPublished,
} from "./actions";

export const dynamic = "force-dynamic";

/** Trim a testimonial phrase for the list view. */
function truncar(texto: string, max: number): string {
  if (texto.length <= max) return texto;
  return `${texto.slice(0, max).trimEnd()}…`;
}

async function loadTestimonials() {
  try {
    return await db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt))
      .limit(300);
  } catch (e) {
    console.error("[admin/testimoniales] DB read failed", e);
    return [];
  }
}

export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado: estadoFiltro } = await searchParams;
  const all = await loadTestimonials();

  const counts = {
    todos: all.length,
    porAprobar: all.filter((t) => !t.approvedByAdmin).length,
    publicados: all.filter((t) => t.published).length,
    sinPublicar: all.filter((t) => !t.published).length,
  };

  const list =
    estadoFiltro === "por-aprobar"
      ? all.filter((t) => !t.approvedByAdmin)
      : estadoFiltro === "publicados"
        ? all.filter((t) => t.published)
        : estadoFiltro === "sin-publicar"
          ? all.filter((t) => !t.published)
          : all;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Testimoniales"
        subtitle="Frases de participantes. Las que vienen de cuestionarios esperan tu aprobación; al aprobarlas se publican en el sitio."
        actions={
          <Boton tone="primario" href="/admin/testimoniales/nuevo">
            + Nuevo testimonial
          </Boton>
        }
      />

      <CifraGrid>
        <Cifra label="Por aprobar" value={counts.porAprobar} tone="alerta" note="Vienen de cuestionarios" />
        <Cifra label="Publicados" value={counts.publicados} tone="ok" note="Visibles en el sitio" />
        <Cifra label="Sin publicar" value={counts.sinPublicar} note="Guardados, no visibles" />
      </CifraGrid>

      <Filtros
        items={[
          { href: "/admin/testimoniales", label: "Todos", count: counts.todos, active: !estadoFiltro },
          {
            href: "/admin/testimoniales?estado=por-aprobar",
            label: "Por aprobar",
            count: counts.porAprobar,
            active: estadoFiltro === "por-aprobar",
          },
          {
            href: "/admin/testimoniales?estado=publicados",
            label: "Publicados",
            count: counts.publicados,
            active: estadoFiltro === "publicados",
          },
          {
            href: "/admin/testimoniales?estado=sin-publicar",
            label: "Sin publicar",
            count: counts.sinPublicar,
            active: estadoFiltro === "sin-publicar",
          },
        ]}
      />

      <Conteo n={list.length} singular="testimonial encontrado" plural="testimoniales encontrados" />

      {list.length === 0 ? (
        <EstadoVacio
          title="Todavía no hay testimoniales."
          body="Cuando un participante responda la pregunta testimonial de una encuesta (y autorice publicarla), aparecerá aquí como pendiente. Al aprobarla se publica directo en la página principal."
        />
      ) : (
        <Tabla>
          <thead>
            <tr>
              <Th>Autor</Th>
              <Th>Frase</Th>
              <Th>Origen</Th>
              <Th>Aprobado</Th>
              <Th>Publicado</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((t) => (
              <FilaEnlace key={t.id}>
                <Td>
                  <EnlaceFila href={`/admin/testimoniales/${t.id}`}>
                    <span style={!t.authorName ? { color: "var(--sutil)" } : undefined}>
                      {t.authorName ?? "Anónimo"}
                    </span>
                  </EnlaceFila>
                  {(t.companyName || t.authorRole) && (
                    <p className="pista">{[t.authorRole, t.companyName].filter(Boolean).join(" · ")}</p>
                  )}
                </Td>
                <Td className="max-w-md italic">
                  {t.quoteEs ? `“${truncar(t.quoteEs, 140)}”` : "—"}
                </Td>
                <Td>
                  <Insignia tone="contorno">{t.sourceFormResponseId ? "Encuesta" : "Manual"}</Insignia>
                </Td>
                <Td>
                  <span className={`texto-12 ${t.approvedByAdmin ? "texto-ok" : "texto-alerta"}`}>
                    {t.approvedByAdmin ? "Sí" : "No"}
                  </span>
                </Td>
                <Td>
                  <Insignia tone={t.published ? "ok" : "neutra"}>
                    {t.published ? "Publicado" : "Sin publicar"}
                  </Insignia>
                </Td>
                <Td>
                  <div className="flex flex-wrap items-center gap-2 sobre-fila">
                    {!t.approvedByAdmin && (
                      <form action={approveTestimonial}>
                        <input type="hidden" name="id" value={t.id} />
                        <BotonPendiente tone="primario" className="boton-chico" pendingLabel="Aprobando…">
                          Aprobar y publicar
                        </BotonPendiente>
                      </form>
                    )}
                    <form action={toggleTestimonialPublished}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="next" value={(!t.published).toString()} />
                      <BotonPendiente tone="secundario" className="boton-chico" pendingLabel="Guardando…">
                        {t.published ? "Despublicar" : "Publicar"}
                      </BotonPendiente>
                    </form>
                    {t.sourceFormResponseId && (
                      <ConfirmarAccion
                        trigger="Rechazar"
                        title="Rechazar testimonial"
                        body="Se borra este testimonial. La frase queda registrada en la respuesta original del cuestionario."
                        confirmLabel="Sí, rechazar el testimonial"
                        pendingLabel="Rechazando…"
                        action={rejectTestimonial}
                        tone="peligro"
                        size="chico"
                        hidden={[{ name: "id", value: t.id }]}
                      />
                    )}
                  </div>
                </Td>
              </FilaEnlace>
            ))}
          </tbody>
        </Tabla>
      )}
    </div>
  );
}
