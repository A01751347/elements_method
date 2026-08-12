import {
  AdminPrimaryButton,
  AdminSecondaryButton,
} from "../_components/admin-ui";
import { createTestimonial } from "./actions";

/**
 * Create form for a testimonial. The <form action={createTestimonial}> is a real
 * server action, so Save persists to the DB and revalidates the public surfaces.
 */
export function TestimonialForm() {
  return (
    <form action={createTestimonial} className="space-y-8 max-w-3xl">
      <Section title="Identidad">
        <Row label="Tipo">
          <Select name="type" defaultValue="quote_only">
            <option value="video">Video</option>
            <option value="photo_quote">Foto + quote</option>
            <option value="quote_only">Solo quote</option>
            <option value="company_logo">Logo de empresa</option>
          </Select>
        </Row>
        <Row label="Nombre del autor">
          <Input name="authorName" />
        </Row>
        <Row label="Rol del autor">
          <Input name="authorRole" />
        </Row>
        <Row label="Empresa">
          <Input name="companyName" />
        </Row>
      </Section>

      <Section title="Contenido">
        <Row label="Quote (ES)">
          <Textarea name="quoteEs" />
        </Row>
        <Row label="Quote (EN)">
          <Textarea name="quoteEn" />
        </Row>
        <Row label="Publicado">
          <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              name="published"
              className="h-4 w-4 rounded border-zinc-300"
            />
            Visible en el sitio público
          </label>
        </Row>
      </Section>

      <div className="flex items-center gap-3 pt-4 border-t border-zinc-200">
        <AdminPrimaryButton type="submit">Crear testimonial</AdminPrimaryButton>
        <AdminSecondaryButton href="/admin/testimoniales">
          Cancelar
        </AdminSecondaryButton>
      </div>
    </form>
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

function Textarea({ name, defaultValue }: { name: string; defaultValue?: string }) {
  return (
    <textarea
      name={name}
      defaultValue={defaultValue}
      rows={4}
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
