import type { BlogPost } from "@/shared/db/schema/blog";
import { Boton, Campo, Input, Select, SeccionEtiqueta, Textarea } from "../_components/ui";
import { BotonPendiente } from "../_components/client";
import { createPost, updatePost } from "./actions";

/** Pull the plain-text body out of a jsonb content column ({ text }-wrapped). */
function contentText(value: unknown): string {
  if (value && typeof value === "object" && "text" in value) {
    const t = (value as { text?: unknown }).text;
    return typeof t === "string" ? t : "";
  }
  return typeof value === "string" ? value : "";
}

/**
 * Shared create/edit form for a blog post. When `post` is provided it edits
 * (binds updatePost with the original slug); otherwise it creates. The
 * <form action={...}> is a real server action, so Save persists to the DB and
 * revalidates the public blog surfaces.
 */
export function BlogForm({ post }: { post?: BlogPost }) {
  const isEdit = Boolean(post);
  const action = isEdit ? updatePost.bind(null, post!.slug) : createPost;

  return (
    <form action={action} className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <SeccionEtiqueta>Identidad</SeccionEtiqueta>
        <Campo
          label="Slug"
          htmlFor="slug"
          hint={`Se usa en /blog/${post?.slug ?? "{slug}"}. Cambiarlo rompe enlaces compartidos.`}
          required
        >
          <Input id="slug" name="slug" defaultValue={post?.slug} />
        </Campo>
        <Campo label="Título (ES)" htmlFor="titleEs" required>
          <Input id="titleEs" name="titleEs" defaultValue={post?.titleEs} />
        </Campo>
        <Campo label="Título (EN)" htmlFor="titleEn">
          <Input id="titleEn" name="titleEn" defaultValue={post?.titleEn ?? ""} />
        </Campo>
        <Campo label="Autor" htmlFor="author">
          <Input id="author" name="author" defaultValue={post?.author ?? ""} />
        </Campo>
        <Campo
          label="Imagen de portada"
          htmlFor="coverImageUrl"
          hint="URL pública de la imagen que aparece arriba del artículo."
        >
          <Input id="coverImageUrl" name="coverImageUrl" type="url" defaultValue={post?.coverImageUrl ?? ""} />
        </Campo>
      </div>

      <div className="flex flex-col gap-4">
        <SeccionEtiqueta>Extracto</SeccionEtiqueta>
        <Campo label="Extracto (ES)" htmlFor="excerptEs">
          <Textarea id="excerptEs" name="excerptEs" rows={3} defaultValue={post?.excerptEs ?? ""} />
        </Campo>
        <Campo label="Extracto (EN)" htmlFor="excerptEn">
          <Textarea id="excerptEn" name="excerptEn" rows={3} defaultValue={post?.excerptEn ?? ""} />
        </Campo>
      </div>

      <div className="flex flex-col gap-4">
        <SeccionEtiqueta>Contenido</SeccionEtiqueta>
        <Campo
          label="Contenido (ES)"
          htmlFor="contentEs"
          hint="Texto plano o markdown sencillo; se renderiza tal cual en la página."
          required
        >
          <Textarea id="contentEs" name="contentEs" rows={18} defaultValue={contentText(post?.contentEs)} />
        </Campo>
        <Campo
          label="Contenido (EN)"
          htmlFor="contentEn"
          hint="Texto plano o markdown sencillo; se renderiza tal cual en la página."
        >
          <Textarea id="contentEn" name="contentEn" rows={18} defaultValue={contentText(post?.contentEn)} />
        </Campo>
      </div>

      <div className="flex flex-col gap-4">
        <SeccionEtiqueta>SEO</SeccionEtiqueta>
        <Campo label="Meta descripción (ES)" htmlFor="metaDescriptionEs">
          <Textarea
            id="metaDescriptionEs"
            name="metaDescriptionEs"
            rows={2}
            defaultValue={post?.metaDescriptionEs ?? ""}
          />
        </Campo>
        <Campo label="Meta descripción (EN)" htmlFor="metaDescriptionEn">
          <Textarea
            id="metaDescriptionEn"
            name="metaDescriptionEn"
            rows={2}
            defaultValue={post?.metaDescriptionEn ?? ""}
          />
        </Campo>
      </div>

      <div className="flex flex-col gap-4">
        <SeccionEtiqueta>Publicación</SeccionEtiqueta>
        <Campo
          label="Status"
          htmlFor="status"
          hint="Al publicar por primera vez se fija la fecha de publicación."
        >
          <Select id="status" name="status" defaultValue={post?.status ?? "draft"}>
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </Select>
        </Campo>
      </div>

      <div className="flex items-center gap-3">
        <BotonPendiente pendingLabel={isEdit ? "Guardando…" : "Creando…"}>
          {isEdit ? "Guardar cambios" : "Crear artículo"}
        </BotonPendiente>
        <Boton tone="secundario" href="/admin/blog">
          Cancelar
        </Boton>
      </div>
    </form>
  );
}
