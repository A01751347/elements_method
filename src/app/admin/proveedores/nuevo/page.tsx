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
import { createProvider } from "../actions";

export default function AdminProviderNewPage() {
  return (
    <>
      <AdminPageHeader
        title="Nuevo proveedor"
        subtitle="Registra una disciplina o facilitador. Aparecerá en /retiros al guardar."
        action={
          <AdminSecondaryButton href="/admin/proveedores">← Volver</AdminSecondaryButton>
        }
      />

      <form action={createProvider} className="space-y-8 max-w-3xl">
        <FormSection title="Disciplina">
          <FormRow label="Slug">
            <Input name="slug" />
          </FormRow>
          <FormRow label="Nombre ES">
            <Input name="disciplineEs" />
          </FormRow>
          <FormRow label="Nombre EN">
            <Input name="disciplineEn" />
          </FormRow>
          <FormRow label="Elemento">
            <Select name="elementAffinity" defaultValue="tierra">
              <option value="tierra">Tierra</option>
              <option value="fuego">Fuego</option>
              <option value="agua">Agua</option>
              <option value="aire">Aire</option>
              <option value="eter">Núcleo</option>
            </Select>
          </FormRow>
          <FormRow label="Descripción ES">
            <Textarea name="descriptionEs" />
          </FormRow>
          <FormRow label="Descripción EN">
            <Textarea name="descriptionEn" />
          </FormRow>
        </FormSection>

        <FormSection title="Proveedor / Facilitador">
          <FormRow label="Nombre">
            <Input name="providerName" />
          </FormRow>
          <FormRow label="Contacto">
            <Input name="providerContact" />
          </FormRow>
          <FormRow label="Status">
            <Select name="status" defaultValue="researching">
              <option value="confirmed">Confirmado</option>
              <option value="in-contact">En conversación</option>
              <option value="pending">Pendiente</option>
              <option value="researching">En búsqueda</option>
            </Select>
          </FormRow>
          <FormRow label="Notas ES">
            <Textarea name="notesEs" />
          </FormRow>
          <FormRow label="Notas EN">
            <Textarea name="notesEn" />
          </FormRow>
        </FormSection>

        <div className="flex items-center gap-3 pt-4 border-t border-zinc-200">
          <AdminPrimaryButton type="submit">Crear proveedor</AdminPrimaryButton>
          <AdminSecondaryButton href="/admin/proveedores">Cancelar</AdminSecondaryButton>
        </div>
      </form>
    </>
  );
}
