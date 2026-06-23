import { notFound } from "next/navigation";
import { legalDocs, findLegalDoc } from "@/data/launchData";
import {
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  PlaceholderBadge,
  PlaceholderNote,
} from "../../_components/admin-ui";
import { FormSection, FormRow, Input, Textarea } from "../../_components/form";

export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}

export default async function AdminLegalDocEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = findLegalDoc(slug);
  if (!d) notFound();

  return (
    <>
      <AdminPageHeader
        title={d.titleEs}
        subtitle={`Documento legal · slug ${d.slug}`}
        action={
          <div className="flex gap-2">
            <AdminSecondaryButton href="/admin/documentos">← Volver</AdminSecondaryButton>
            <AdminPrimaryButton>Guardar borrador</AdminPrimaryButton>
          </div>
        }
      />
      <PlaceholderNote />

      <form className="space-y-8 max-w-4xl">
        <FormSection title="Identificación">
          <FormRow label="Slug">
            <Input name="slug" defaultValue={d.slug} />
          </FormRow>
          <FormRow label="Título ES">
            <Input name="titleEs" defaultValue={d.titleEs} />
          </FormRow>
          <FormRow label="Título EN">
            <Input name="titleEn" defaultValue={d.titleEn} />
          </FormRow>
          <FormRow label="Resumen ES">
            <Textarea name="summaryEs" defaultValue={d.summaryEs} rows={2} />
          </FormRow>
          <FormRow label="Resumen EN">
            <Textarea name="summaryEn" defaultValue={d.summaryEn} rows={2} />
          </FormRow>
        </FormSection>

        <FormSection title="Cuerpo (markdown)">
          <FormRow label="Cuerpo ES">
            <Textarea name="bodyEs" defaultValue={d.bodyEs} rows={20} />
          </FormRow>
          <FormRow label="Cuerpo EN">
            <Textarea name="bodyEn" defaultValue={d.bodyEn} rows={20} />
          </FormRow>
        </FormSection>

        <FormSection title="Tokens placeholder">
          <div className="flex items-start gap-3">
            <PlaceholderBadge fields={d.placeholderFields} />
            <p className="text-xs text-amber-800">
              Tokens <code className="font-mono">{`{{TOKEN}}`}</code> que se sustituyen al
              generar el PDF firmable por participante.
            </p>
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {d.placeholderFields.map((f) => (
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
