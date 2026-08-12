import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { forms } from "@/shared/db/schema/forms";
import { AdminPageHeader, AdminSecondaryButton } from "../../../_components/admin-ui";
import { FormBuilder, type BuilderField } from "../../FormBuilder";
import { updateForm } from "../../actions";

export default async function AdminFormEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let form;
  try {
    [form] = await db.select().from(forms).where(eq(forms.slug, slug)).limit(1);
  } catch (e) {
    console.error("[admin/forms editar] DB read failed", e);
  }
  if (!form) notFound();

  const boundUpdate = updateForm.bind(null, form.id);

  return (
    <>
      <AdminPageHeader
        title={`Editar · ${form.titleEs}`}
        subtitle={`Slug ${form.slug} — los cambios aplican a los enlaces que se envíen después; las respuestas ya guardadas no se modifican.`}
        action={
          <AdminSecondaryButton href={`/admin/formularios/${form.slug}`}>
            ← Volver
          </AdminSecondaryButton>
        }
      />
      <FormBuilder
        action={boundUpdate}
        submitLabel="Guardar cambios"
        initial={{
          titleEs: form.titleEs,
          titleEn: form.titleEn ?? "",
          descriptionEs: form.descriptionEs ?? "",
          descriptionEn: form.descriptionEn ?? "",
          category: form.category ?? "custom",
          isAnonymous: form.isAnonymous,
          fields: (Array.isArray(form.fields) ? form.fields : []) as BuilderField[],
        }}
      />
    </>
  );
}

export const dynamic = "force-dynamic";
