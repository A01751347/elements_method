import { notFound } from "next/navigation";
import Link from "next/link";
import { findRetreatBySlug, calendarRetreats } from "@/data/launchData";
import { elements } from "@/data/content";
import {
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  PlaceholderBadge,
  PlaceholderNote,
} from "../../_components/admin-ui";

export function generateStaticParams() {
  return calendarRetreats.map((r) => ({ slug: r.slug }));
}

export default async function AdminRetreatEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = findRetreatBySlug(slug);
  if (!r) notFound();
  const el = elements.find((e) => e.key === r.elementKey);

  return (
    <>
      <AdminPageHeader
        title={`Retiro: ${r.themeEs}`}
        subtitle={`${r.dateLabelEs} · ${el?.nameEs}`}
        action={
          <div className="flex gap-2">
            <AdminSecondaryButton href="/admin/retiros">← Volver</AdminSecondaryButton>
            <AdminPrimaryButton>Guardar cambios</AdminPrimaryButton>
          </div>
        }
      />
      <PlaceholderNote />

      <form className="space-y-8 max-w-3xl">
        <Section title="Identidad pública">
          <Row label="Slug">
            <Input name="slug" defaultValue={r.slug} />
          </Row>
          <Row label="Orden">
            <Input name="orderIdx" defaultValue={String(r.orderIdx)} className="w-24" />
          </Row>
          <Row label="Tema (ES)">
            <Input name="themeEs" defaultValue={r.themeEs} />
          </Row>
          <Row label="Tema (EN)">
            <Input name="themeEn" defaultValue={r.themeEn} />
          </Row>
          <Row label="Resumen (ES)">
            <Textarea name="summaryEs" defaultValue={r.summaryEs} />
          </Row>
          <Row label="Resumen (EN)">
            <Textarea name="summaryEn" defaultValue={r.summaryEn} />
          </Row>
        </Section>

        <Section title="Fechas">
          <Row label="Inicio">
            <Input type="date" name="startDate" defaultValue={r.startDate} />
          </Row>
          <Row label="Fin">
            <Input type="date" name="endDate" defaultValue={r.endDate} />
          </Row>
          <Row label="Etiqueta de fecha (ES)">
            <Input name="dateLabelEs" defaultValue={r.dateLabelEs} />
          </Row>
          <Row label="Etiqueta de fecha (EN)">
            <Input name="dateLabelEn" defaultValue={r.dateLabelEn} />
          </Row>
        </Section>

        <Section title="Sede y cupo">
          <Row label="Estado de sede">
            <Select name="venueState" defaultValue={r.venueState}>
              <option value="confirmed">Confirmada</option>
              <option value="tentative">Tentativa</option>
              <option value="tbd">Por confirmar</option>
            </Select>
          </Row>
          <Row label="Sede (ES)">
            <Input name="venueLabelEs" defaultValue={r.venueLabelEs} />
          </Row>
          <Row label="Sede (EN)">
            <Input name="venueLabelEn" defaultValue={r.venueLabelEn} />
          </Row>
          <Row label="Nota interna">
            <Input name="venueNote" defaultValue={r.venueNote} />
          </Row>
          <Row label="Cupo total">
            <Input
              type="number"
              name="capacity"
              defaultValue={String(r.capacity)}
              className="w-24"
            />
          </Row>
          <Row label="Lugares disponibles">
            <Input
              type="number"
              name="seatsLeft"
              defaultValue={String(r.seatsLeft)}
              className="w-24"
            />
          </Row>
        </Section>

        <Section title="Comercial">
          <Row label="Status público">
            <Select name="status" defaultValue={r.status}>
              <option value="open">Aplicaciones abiertas</option>
              <option value="waitlist">Lista de espera</option>
              <option value="closed">Cerrado</option>
              <option value="sold">Sin cupo</option>
            </Select>
          </Row>
          <Row label="Etiqueta de inversión (ES)">
            <Input name="investmentLabelEs" defaultValue={r.investmentLabelEs} />
          </Row>
          <Row label="Etiqueta de inversión (EN)">
            <Input name="investmentLabelEn" defaultValue={r.investmentLabelEn} />
          </Row>
        </Section>

        <Section title="Placeholders activos">
          <div className="flex items-start gap-3">
            <PlaceholderBadge fields={r.placeholderFields} />
            <p className="text-xs text-amber-800 leading-relaxed">
              Cuando reemplaces el valor de un campo placeholder por uno real, elimínalo
              de <code className="font-mono bg-amber-50 px-1">placeholderFields</code> para
              que el badge en /retiros y el dashboard reflejen el estado real.
            </p>
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {r.placeholderFields.map((f) => (
              <code
                key={f}
                className="font-mono text-[0.7rem] bg-amber-50 text-amber-900 px-2 py-1 border border-amber-200"
              >
                {f}
              </code>
            ))}
          </div>
        </Section>

        <div className="flex items-center gap-3 pt-4 border-t border-zinc-200">
          <AdminPrimaryButton type="submit">Guardar cambios</AdminPrimaryButton>
          <Link
            href={`/es/retiros/${r.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
          >
            Ver página pública →
          </Link>
        </div>
      </form>
    </>
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
