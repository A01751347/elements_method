import { notFound } from "next/navigation";
import { subscriptionTiers } from "@/data/launchData";
import {
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  PlaceholderBadge,
  PlaceholderNote,
} from "../../_components/admin-ui";
import { FormSection, FormRow, Input, Textarea } from "../../_components/form";

export function generateStaticParams() {
  return subscriptionTiers.map((t) => ({ slug: t.slug }));
}

export default async function AdminTierEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = subscriptionTiers.find((x) => x.slug === slug);
  if (!t) notFound();

  return (
    <>
      <AdminPageHeader
        title={`Membresía: ${t.nameEs}`}
        subtitle={t.taglineEs}
        action={
          <div className="flex gap-2">
            <AdminSecondaryButton href="/admin/membresias">← Volver</AdminSecondaryButton>
            <AdminPrimaryButton>Guardar</AdminPrimaryButton>
          </div>
        }
      />
      <PlaceholderNote />

      <form className="space-y-8 max-w-3xl">
        <FormSection title="Identidad">
          <FormRow label="Slug">
            <Input name="slug" defaultValue={t.slug} />
          </FormRow>
          <FormRow label="Nombre ES">
            <Input name="nameEs" defaultValue={t.nameEs} />
          </FormRow>
          <FormRow label="Nombre EN">
            <Input name="nameEn" defaultValue={t.nameEn} />
          </FormRow>
          <FormRow label="Tagline ES">
            <Textarea name="taglineEs" defaultValue={t.taglineEs} rows={2} />
          </FormRow>
          <FormRow label="Tagline EN">
            <Textarea name="taglineEn" defaultValue={t.taglineEn} rows={2} />
          </FormRow>
        </FormSection>

        <FormSection title="Cadencia y precio">
          <FormRow label="Cadencia ES">
            <Input name="cadenceEs" defaultValue={t.cadenceEs} />
          </FormRow>
          <FormRow label="Cadencia EN">
            <Input name="cadenceEn" defaultValue={t.cadenceEn} />
          </FormRow>
          <FormRow label="Precio (MXN)">
            <Input name="priceLabelMxn" defaultValue={t.priceLabelMxn} />
          </FormRow>
          <FormRow label="Precio (USD)">
            <Input name="priceLabelEn" defaultValue={t.priceLabelEn} />
          </FormRow>
        </FormSection>

        <FormSection title="Incluye (uno por línea)">
          <FormRow label="ES">
            <Textarea
              name="includesEs"
              defaultValue={t.includesEs.join("\n")}
              rows={6}
            />
          </FormRow>
          <FormRow label="EN">
            <Textarea
              name="includesEn"
              defaultValue={t.includesEn.join("\n")}
              rows={6}
            />
          </FormRow>
        </FormSection>

        <FormSection title="Placeholders activos">
          <div className="flex items-start gap-3">
            <PlaceholderBadge fields={t.placeholderFields} />
            <p className="text-xs text-amber-800">Campos placeholder de este tier.</p>
          </div>
        </FormSection>
      </form>
    </>
  );
}
