import {
  AdminPrimaryButton,
  AdminSecondaryButton,
} from "../_components/admin-ui";
import { createLogo } from "./actions";

/**
 * Create form for a client logo. The <form action={createLogo}> is a real
 * server action, so Save persists to the DB and revalidates the public home
 * marquee surfaces (/es, /en).
 */
export function LogoForm() {
  return (
    <form action={createLogo} className="space-y-8 max-w-3xl">
      <Section title="Logo de cliente">
        <Row label="Empresa">
          <Input name="companyName" />
        </Row>
        <Row label="URL del logo">
          <Input name="logoUrl" type="url" />
        </Row>
        <Row label="Sitio web">
          <Input name="websiteUrl" type="url" />
        </Row>
        <Row label="Activo">
          <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              name="active"
              defaultChecked
              className="h-4 w-4 rounded border-zinc-300"
            />
            Mostrar en el sitio público
          </label>
        </Row>
      </Section>

      <div className="flex items-center gap-3 pt-4 border-t border-zinc-200">
        <AdminPrimaryButton type="submit">Subir logo</AdminPrimaryButton>
        <AdminSecondaryButton href="/admin/logos">Cancelar</AdminSecondaryButton>
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
  type = "text",
  className = "",
}: {
  name: string;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      name={name}
      className={`w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 ${className}`}
    />
  );
}
