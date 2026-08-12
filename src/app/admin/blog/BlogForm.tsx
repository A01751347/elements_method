import Link from "next/link";
import type { BlogPost } from "@/shared/db/schema/blog";
import {
  AdminPrimaryButton,
  AdminSecondaryButton,
} from "../_components/admin-ui";
import { createPost, updatePost, deletePost } from "./actions";

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
    <form action={action} className="space-y-8 max-w-3xl">
      <Section title="Identidad">
        <Row label="Slug">
          <Input name="slug" defaultValue={post?.slug} />
        </Row>
        <Row label="Título (ES)">
          <Input name="titleEs" defaultValue={post?.titleEs} />
        </Row>
        <Row label="Título (EN)">
          <Input name="titleEn" defaultValue={post?.titleEn ?? ""} />
        </Row>
        <Row label="Autor">
          <Input name="author" defaultValue={post?.author ?? ""} />
        </Row>
        <Row label="Imagen de portada (URL)">
          <Input name="coverImageUrl" defaultValue={post?.coverImageUrl ?? ""} />
        </Row>
      </Section>

      <Section title="Extracto">
        <Row label="Extracto (ES)">
          <Textarea name="excerptEs" defaultValue={post?.excerptEs ?? ""} />
        </Row>
        <Row label="Extracto (EN)">
          <Textarea name="excerptEn" defaultValue={post?.excerptEn ?? ""} />
        </Row>
      </Section>

      <Section title="Contenido">
        <Row label="Contenido (ES)">
          <Textarea
            name="contentEs"
            rows={10}
            defaultValue={contentText(post?.contentEs)}
          />
        </Row>
        <Row label="Contenido (EN)">
          <Textarea
            name="contentEn"
            rows={10}
            defaultValue={contentText(post?.contentEn)}
          />
        </Row>
      </Section>

      <Section title="Publicación">
        <Row label="Status">
          <Select name="status" defaultValue={post?.status ?? "draft"}>
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </Select>
        </Row>
      </Section>

      <div className="flex items-center gap-3 pt-4 border-t border-zinc-200">
        <AdminPrimaryButton type="submit">
          {isEdit ? "Guardar cambios" : "Crear post"}
        </AdminPrimaryButton>
        <AdminSecondaryButton href="/admin/blog">Cancelar</AdminSecondaryButton>
        {isEdit && (
          <Link
            href={`/es/blog/${post!.slug}`}
            target="_blank"
            className="ml-auto inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
          >
            Ver página pública →
          </Link>
        )}
      </div>

      {isEdit && <DeleteButton slug={post!.slug} />}
    </form>
  );
}

/** Separate submit button so delete doesn't submit the edit form. */
function DeleteButton({ slug }: { slug: string }) {
  return (
    <div className="pt-4 border-t border-zinc-200">
      <button
        formAction={deletePost.bind(null, slug)}
        className="text-sm text-red-700 hover:text-red-900 hover:underline"
      >
        Eliminar post
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <h2 className="text-sm font-medium mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
      <label className="text-xs uppercase tracking-[0.14em] text-zinc-500 pt-2">
        {label}
      </label>
      <div>{children}</div>
    </div>
  );
}

function Input({
  name,
  defaultValue,
  type = "text",
  className = "",
}: {
  name: string;
  defaultValue?: string;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      name={name}
      defaultValue={defaultValue}
      className={`w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 ${className}`}
    />
  );
}

function Textarea({
  name,
  defaultValue,
  rows = 4,
}: {
  name: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <textarea
      name={name}
      defaultValue={defaultValue}
      rows={rows}
      className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
    />
  );
}

function Select({
  name,
  defaultValue,
  children,
}: {
  name: string;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
    >
      {children}
    </select>
  );
}
