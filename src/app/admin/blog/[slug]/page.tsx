import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { blogPosts } from "@/shared/db/schema/blog";
import { Boton, FichaHeader, Insignia, SeccionEtiqueta } from "../../_components/ui";
import { ConfirmarAccion } from "../../_components/client";
import { BLOG_STATUS, estado } from "../../_lib/status";
import { fechaCorta } from "../../_lib/format";
import { BlogForm } from "../BlogForm";
import { deletePost } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);
  if (!post) notFound();

  const e = estado(BLOG_STATUS, post.status);

  return (
    <div className="flex flex-col gap-8">
      <FichaHeader
        back={{ href: "/admin/blog", label: "Blog" }}
        kicker={`Artículo · ${e.label}`}
        title={post.titleEs}
        badge={<Insignia tone={e.tone}>{e.label}</Insignia>}
        meta={`${post.slug} · ${post.author ?? "Sin autor"} · ${fechaCorta(post.updatedAt)}`}
        aside={{ label: "Publicado", value: post.publishedAt ? fechaCorta(post.publishedAt) : "—" }}
      />

      <div className="ficha-columnas">
        <BlogForm post={post} />

        <div className="ficha-trabajo">
          <div className="flex flex-col gap-3">
            <SeccionEtiqueta>Público</SeccionEtiqueta>
            <div className="flex flex-col items-start gap-2">
              <Boton tone="texto" href={`/es/blog/${post.slug}`} external>
                Ver en el sitio (ES)
              </Boton>
              <Boton tone="texto" href={`/en/journal/${post.slug}`} external>
                Ver en el sitio (EN)
              </Boton>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <SeccionEtiqueta>Zona de riesgo</SeccionEtiqueta>
            <ConfirmarAccion
              trigger="Eliminar artículo"
              title="Eliminar artículo"
              body={`Se borra «${post.titleEs}» y sus comentarios. La URL pública deja de existir.`}
              confirmLabel="Sí, eliminar el artículo"
              pendingLabel="Eliminando…"
              action={deletePost}
              tone="peligro"
              hidden={[{ name: "slug", value: post.slug }]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
