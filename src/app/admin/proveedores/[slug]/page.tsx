import { notFound } from "next/navigation";
import { providersInventory } from "@/data/launchData";
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
  return providersInventory.map((p) => ({ slug: p.slug }));
}

export default async function AdminProviderEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = providersInventory.find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <>
      <AdminPageHeader
        title={`Proveedor: ${p.disciplineEs}`}
        subtitle={p.disciplineEn}
        action={
          <div className="flex gap-2">
            <AdminSecondaryButton href="/admin/proveedores">
              ← Volver
            </AdminSecondaryButton>
            <AdminPrimaryButton>Guardar</AdminPrimaryButton>
          </div>
        }
      />
      <PlaceholderNote />

      <form className="space-y-8 max-w-3xl">
        <FormSection title="Disciplina">
          <FormRow label="Slug">
            <Input name="slug" defaultValue={p.slug} />
          </FormRow>
          <FormRow label="Nombre ES">
            <Input name="disciplineEs" defaultValue={p.disciplineEs} />
          </FormRow>
          <FormRow label="Nombre EN">
            <Input name="disciplineEn" defaultValue={p.disciplineEn} />
          </FormRow>
          <FormRow label="Elemento">
            <Select name="elementAffinity" defaultValue={p.elementAffinity}>
              <option value="tierra">Tierra</option>
              <option value="fuego">Fuego</option>
              <option value="agua">Agua</option>
              <option value="aire">Aire</option>
              <option value="eter">Éter</option>
            </Select>
          </FormRow>
          <FormRow label="Descripción ES">
            <Textarea name="descriptionEs" defaultValue={p.descriptionEs} />
          </FormRow>
          <FormRow label="Descripción EN">
            <Textarea name="descriptionEn" defaultValue={p.descriptionEn} />
          </FormRow>
        </FormSection>

        <FormSection title="Proveedor / Facilitador">
          <FormRow label="Nombre">
            <Input name="providerName" defaultValue={p.providerName} />
          </FormRow>
          <FormRow label="Contacto">
            <Input name="providerContact" defaultValue={p.providerContact} />
          </FormRow>
          <FormRow label="Status">
            <Select name="status" defaultValue={p.status}>
              <option value="confirmed">Confirmado</option>
              <option value="in-contact">En conversación</option>
              <option value="pending">Pendiente</option>
              <option value="researching">En búsqueda</option>
            </Select>
          </FormRow>
          <FormRow label="Notas ES">
            <Textarea name="notesEs" defaultValue={p.notesEs} />
          </FormRow>
          <FormRow label="Notas EN">
            <Textarea name="notesEn" defaultValue={p.notesEn} />
          </FormRow>
        </FormSection>

        <FormSection title="Placeholders activos">
          <div className="flex items-start gap-3">
            <PlaceholderBadge fields={p.placeholderFields} />
            <p className="text-xs text-amber-800">
              Campos placeholder de este proveedor.
            </p>
          </div>
        </FormSection>
      </form>
    </>
  );
}
