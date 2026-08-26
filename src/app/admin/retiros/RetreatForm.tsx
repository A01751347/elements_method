import Link from "next/link";
import type { CalendarRetreat } from "@/data/launchData";
import {
  AdminPrimaryButton,
  AdminSecondaryButton,
} from "../_components/admin-ui";
import { createRetreat, updateRetreat, deleteRetreat } from "./actions";

/**
 * Shared create/edit form for a calendar retreat. When `retreat` is provided it
 * edits (binds updateRetreat with the original slug); otherwise it creates.
 * The <form action={...}> is a real server action, so Save persists to the DB
 * and revalidates the public calendar.
 */
export function RetreatForm({ retreat }: { retreat?: CalendarRetreat }) {
  const isEdit = Boolean(retreat);
  const action = isEdit
    ? updateRetreat.bind(null, retreat!.slug)
    : createRetreat;

  return (
    <form action={action} className="space-y-8 max-w-3xl">
      <Section title="Identidad pública">
        <Row label="Slug">
          <Input name="slug" defaultValue={retreat?.slug} />
        </Row>
        <Row label="Orden">
          <Input
            name="orderIdx"
            type="number"
            defaultValue={String(retreat?.orderIdx ?? 0)}
            className="w-24"
          />
        </Row>
        <Row label="Tema (ES)">
          <Input name="themeEs" defaultValue={retreat?.themeEs} />
        </Row>
        <Row label="Tema (EN)">
          <Input name="themeEn" defaultValue={retreat?.themeEn} />
        </Row>
        <Row label="Elemento">
          <Select name="elementKey" defaultValue={retreat?.elementKey ?? "tierra"}>
            <option value="tierra">Tierra</option>
            <option value="fuego">Fuego</option>
            <option value="agua">Agua</option>
            <option value="aire">Aire</option>
            <option value="eter">Núcleo</option>
          </Select>
        </Row>
        <Row label="Resumen (ES)">
          <Textarea name="summaryEs" defaultValue={retreat?.summaryEs} />
        </Row>
        <Row label="Resumen (EN)">
          <Textarea name="summaryEn" defaultValue={retreat?.summaryEn} />
        </Row>
      </Section>

      <Section title="Fechas">
        <Row label="Inicio (YYYY-MM-DD)">
          <Input type="date" name="startDate" defaultValue={retreat?.startDate} />
        </Row>
        <Row label="Fin (YYYY-MM-DD)">
          <Input type="date" name="endDate" defaultValue={retreat?.endDate} />
        </Row>
        <Row label="Etiqueta de fecha (ES)">
          <Input name="dateLabelEs" defaultValue={retreat?.dateLabelEs} />
        </Row>
        <Row label="Etiqueta de fecha (EN)">
          <Input name="dateLabelEn" defaultValue={retreat?.dateLabelEn} />
        </Row>
      </Section>

      <Section title="Sede y cupo">
        <Row label="Estado de sede">
          <Select name="venueState" defaultValue={retreat?.venueState ?? "tbd"}>
            <option value="confirmed">Confirmada</option>
            <option value="tentative">Tentativa</option>
            <option value="tbd">Por confirmar</option>
          </Select>
        </Row>
        <Row label="Sede (ES)">
          <Input name="venueLabelEs" defaultValue={retreat?.venueLabelEs} />
        </Row>
        <Row label="Sede (EN)">
          <Input name="venueLabelEn" defaultValue={retreat?.venueLabelEn} />
        </Row>
        <Row label="Nota interna">
          <Input name="venueNote" defaultValue={retreat?.venueNote} />
        </Row>
        <Row label="Cupo total">
          <Input
            type="number"
            name="capacity"
            defaultValue={String(retreat?.capacity ?? 0)}
            className="w-24"
          />
        </Row>
        <Row label="Lugares disponibles">
          <Input
            type="number"
            name="seatsLeft"
            defaultValue={String(retreat?.seatsLeft ?? 0)}
            className="w-24"
          />
        </Row>
      </Section>

      <Section title="Comercial">
        <Row label="Status público">
          <Select name="status" defaultValue={retreat?.status ?? "open"}>
            <option value="open">Aplicaciones abiertas</option>
            <option value="waitlist">Lista de espera</option>
            <option value="closed">Cerrado</option>
            <option value="sold">Sin cupo</option>
          </Select>
        </Row>
        <Row label="Etiqueta de inversión (ES)">
          <Input name="investmentLabelEs" defaultValue={retreat?.investmentLabelEs} />
        </Row>
        <Row label="Etiqueta de inversión (EN)">
          <Input name="investmentLabelEn" defaultValue={retreat?.investmentLabelEn} />
        </Row>
        <Row label="Placeholders (separados por coma)">
          <Input
            name="placeholderFields"
            defaultValue={(retreat?.placeholderFields ?? []).join(", ")}
          />
        </Row>
      </Section>

      <div className="flex items-center gap-3 pt-4 border-t border-zinc-200">
        <AdminPrimaryButton type="submit">
          {isEdit ? "Guardar cambios" : "Crear retiro"}
        </AdminPrimaryButton>
        <AdminSecondaryButton href="/admin/retiros">Cancelar</AdminSecondaryButton>
        {isEdit && (
          <Link
            href={`/es/retiros/${retreat!.slug}`}
            target="_blank"
            className="ml-auto inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
          >
            Ver página pública →
          </Link>
        )}
      </div>

      {isEdit && (
        <DeleteButton slug={retreat!.slug} />
      )}
    </form>
  );
}

/** Separate mini-form so delete doesn't submit the edit form. */
function DeleteButton({ slug }: { slug: string }) {
  return (
    <div className="pt-4 border-t border-zinc-200">
      <button
        formAction={deleteRetreat.bind(null, slug)}
        className="text-sm text-red-700 hover:text-red-900 hover:underline"
      >
        Eliminar retiro
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
