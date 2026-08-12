import { notFound } from "next/navigation";
import { venuesInventory } from "@/data/launchData";
import { getVenueBySlug } from "@/modules/content/venues";
import {
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  PlaceholderBadge,
} from "../../_components/admin-ui";
import {
  FormSection,
  FormRow,
  Input,
  Textarea,
  Select,
} from "../../_components/form";
import { updateVenue, deleteVenue } from "../actions";

export default async function AdminVenueEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v =
    (await getVenueBySlug(slug)) ?? venuesInventory.find((x) => x.slug === slug);
  if (!v) notFound();

  return (
    <>
      <AdminPageHeader
        title={`Locación: ${v.name}`}
        subtitle={v.city}
        action={
          <AdminSecondaryButton href="/admin/locaciones">
            ← Volver
          </AdminSecondaryButton>
        }
      />

      <form action={updateVenue.bind(null, v.slug)} className="space-y-8 max-w-3xl">
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
          <FormRow label="Placeholders (coma)">
            <Input
              name="placeholderFields"
              defaultValue={(v.placeholderFields ?? []).join(", ")}
            />
          </FormRow>
          <div className="flex items-start gap-3">
            <PlaceholderBadge fields={v.placeholderFields} />
            <p className="text-xs text-amber-800">
              Campos placeholder de esta locación.
            </p>
          </div>
        </FormSection>

        <div className="flex items-center gap-3 pt-4 border-t border-zinc-200">
          <AdminPrimaryButton type="submit">Guardar</AdminPrimaryButton>
          <AdminSecondaryButton href="/admin/locaciones">Cancelar</AdminSecondaryButton>
          <button
            formAction={deleteVenue.bind(null, v.slug)}
            className="ml-auto text-sm text-red-700 hover:text-red-900 hover:underline"
          >
            Eliminar
          </button>
        </div>
      </form>
    </>
  );
}
