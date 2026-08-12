import {
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
} from "../../_components/admin-ui";
import {
  FormSection,
  FormRow,
  Input,
  Textarea,
  Select,
} from "../../_components/form";
import { createVenue } from "../actions";

export default function AdminVenueNewPage() {
  return (
    <>
      <AdminPageHeader
        title="Nueva locación"
        subtitle="Registra una sede candidata."
        action={
          <AdminSecondaryButton href="/admin/locaciones">← Volver</AdminSecondaryButton>
        }
      />

      <form action={createVenue} className="space-y-8 max-w-3xl">
        <FormSection title="Identificación">
          <FormRow label="Slug">
            <Input name="slug" />
          </FormRow>
          <FormRow label="Nombre">
            <Input name="name" />
          </FormRow>
          <FormRow label="Ciudad">
            <Input name="city" />
          </FormRow>
          <FormRow label="URL">
            <Input name="url" />
          </FormRow>
        </FormSection>

        <FormSection title="Estado y capacidad">
          <FormRow label="Estado">
            <Select name="state" defaultValue="researching">
              <option value="confirmed">Confirmada</option>
              <option value="cotizacion-en-proceso">Cotización en proceso</option>
              <option value="sin-respuesta">Sin respuesta</option>
              <option value="researching">En búsqueda</option>
              <option value="available-2027">Disponible 2027</option>
            </Select>
          </FormRow>
          <FormRow label="Capacidad">
            <Input name="capacity" />
          </FormRow>
          <FormRow label="Rango precio (MXN)">
            <Input name="rangeMxn" />
          </FormRow>
        </FormSection>

        <FormSection title="Notas internas">
          <FormRow label="Notas">
            <Textarea name="notesEs" rows={6} />
          </FormRow>
        </FormSection>

        <div className="flex items-center gap-3 pt-4 border-t border-zinc-200">
          <AdminPrimaryButton type="submit">Crear locación</AdminPrimaryButton>
          <AdminSecondaryButton href="/admin/locaciones">Cancelar</AdminSecondaryButton>
        </div>
      </form>
    </>
  );
}
