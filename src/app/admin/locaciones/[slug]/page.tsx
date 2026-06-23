import { notFound } from "next/navigation";
import { venuesInventory } from "@/data/launchData";
import {
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  PlaceholderBadge,
  PlaceholderNote,
} from "../../_components/admin-ui";
import {
  FormSection,
  FormRow,
  Input,
  Textarea,
  Select,
} from "../../_components/form";

export function generateStaticParams() {
  return venuesInventory.map((v) => ({ slug: v.slug }));
}

export default async function AdminVenueEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = venuesInventory.find((x) => x.slug === slug);
  if (!v) notFound();

  return (
    <>
      <AdminPageHeader
        title={`Locación: ${v.name}`}
        subtitle={v.city}
        action={
          <div className="flex gap-2">
            <AdminSecondaryButton href="/admin/locaciones">
              ← Volver
            </AdminSecondaryButton>
            <AdminPrimaryButton>Guardar</AdminPrimaryButton>
          </div>
        }
      />
      <PlaceholderNote />

      <form className="space-y-8 max-w-3xl">
        <FormSection title="Identificación">
          <FormRow label="Slug">
            <Input name="slug" defaultValue={v.slug} />
          </FormRow>
          <FormRow label="Nombre">
            <Input name="name" defaultValue={v.name} />
          </FormRow>
          <FormRow label="Ciudad">
            <Input name="city" defaultValue={v.city} />
          </FormRow>
          <FormRow label="URL">
            <Input name="url" defaultValue={v.url} />
          </FormRow>
        </FormSection>

        <FormSection title="Estado y capacidad">
          <FormRow label="Estado">
            <Select name="state" defaultValue={v.state}>
              <option value="confirmed">Confirmada</option>
              <option value="cotizacion-en-proceso">Cotización en proceso</option>
              <option value="sin-respuesta">Sin respuesta</option>
              <option value="researching">En búsqueda</option>
              <option value="available-2027">Disponible 2027</option>
            </Select>
          </FormRow>
          <FormRow label="Capacidad">
            <Input name="capacity" defaultValue={v.capacity} />
          </FormRow>
          <FormRow label="Rango precio (MXN)">
            <Input name="rangeMxn" defaultValue={v.rangeMxn} />
          </FormRow>
        </FormSection>

        <FormSection title="Notas internas">
          <FormRow label="Notas">
            <Textarea name="notesEs" defaultValue={v.notesEs} rows={6} />
          </FormRow>
        </FormSection>

        <FormSection title="Placeholders activos">
          <div className="flex items-start gap-3">
            <PlaceholderBadge fields={v.placeholderFields} />
            <p className="text-xs text-amber-800">
              Campos placeholder de esta locación.
            </p>
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {v.placeholderFields.map((f) => (
              <code
                key={f}
                className="font-mono text-[0.7rem] bg-amber-50 text-amber-900 px-2 py-1 border border-amber-200"
              >
                {f}
              </code>
            ))}
          </div>
        </FormSection>
      </form>
    </>
  );
}
