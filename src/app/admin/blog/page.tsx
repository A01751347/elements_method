import { desc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { blogPosts } from "@/shared/db/schema/blog";
import {
  Boton,
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
import { BLOG_STATUS, estado } from "../_lib/status";
import { fechaCorta } from "../_lib/format";

export const dynamic = "force-dynamic";

async function loadPosts() {
  try {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.updatedAt)).limit(300);
  } catch (e) {
    console.error("[admin/blog] DB read failed", e);
    return [];
  }
}

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado: estadoFiltro } = await searchParams;
  const all = await loadPosts();

  const counts = {
    todos: all.length,
    published: all.filter((p) => p.status === "published").length,
    draft: all.filter((p) => p.status === "draft").length,
  };

  const list =
    estadoFiltro === "published"
      ? all.filter((p) => p.status === "published")
      : estadoFiltro === "draft"
        ? all.filter((p) => p.status === "draft")
        : all;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Blog"
        subtitle="Notas del campo, bilingües. Cada fila abre el artículo."
        actions={
          <Boton tone="primario" href="/admin/blog/nuevo">
            + Nuevo artículo
          </Boton>
        }
      />

      <Filtros
        items={[
          { href: "/admin/blog", label: "Todos", count: counts.todos, active: !estadoFiltro },
          {
            href: "/admin/blog?estado=published",
            label: "Publicados",
            count: counts.published,
            active: estadoFiltro === "published",
          },
          {
            href: "/admin/blog?estado=draft",
            label: "Borradores",
            count: counts.draft,
            active: estadoFiltro === "draft",
          },
        ]}
      />

      <Conteo n={list.length} singular="artículo encontrado" plural="artículos encontrados" />

      {list.length === 0 ? (
        <EstadoVacio
          title="Todavía no hay artículos."
          body="Escribe el primero; se publica en /blog y /journal cuando lo marques como publicado."
          action={
            <Boton tone="secundario" href="/admin/blog/nuevo">
              + Nuevo artículo
            </Boton>
          }
        />
      ) : (
        <Tabla>
          <thead>
            <tr>
              <Th>Artículo</Th>
              <Th>Autor</Th>
              <Th>Estado</Th>
              <Th>Publicado</Th>
              <Th>Editado</Th>
              <Th>Pública</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => {
              const e = estado(BLOG_STATUS, p.status);
              return (
                <FilaEnlace key={p.id}>
                  <Td>
                    <EnlaceFila href={`/admin/blog/${p.slug}`}>{p.titleEs}</EnlaceFila>
                    <p className="pista">{p.slug}</p>
                  </Td>
                  <Td>{p.author ?? "—"}</Td>
                  <Td>
                    <Insignia tone={e.tone}>{e.label}</Insignia>
                  </Td>
                  <Td>{p.publishedAt ? fechaCorta(p.publishedAt) : "—"}</Td>
                  <Td>{fechaCorta(p.updatedAt)}</Td>
                  <Td>
                    {p.status === "published" ? (
                      <Boton tone="texto" href={`/es/blog/${p.slug}`} external className="sobre-fila">
                        Ver
                      </Boton>
                    ) : (
                      "—"
                    )}
                  </Td>
                </FilaEnlace>
              );
            })}
          </tbody>
        </Tabla>
      )}
    </div>
  );
}
