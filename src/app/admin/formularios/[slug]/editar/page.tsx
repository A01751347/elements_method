import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { forms } from "@/shared/db/schema/forms";
import { PageHeader, Volver } from "../../../_components/ui";
import { FormBuilder, type BuilderField } from "../../FormBuilder";
import { updateForm } from "../../actions";

export const dynamic = "force-dynamic";

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
    console.error("[admin/formularios editar] DB read failed", e);
  }
  if (!form) notFound();

  const boundUpdate = updateForm.bind(null, form.id);

  return (
    <div className="flex flex-col gap-8">
      <Volver href={`/admin/formularios/${form.slug}`}>{form.titleEs}</Volver>
      <PageHeader
        title={`Editar · ${form.titleEs}`}
        subtitle="Los cambios aplican a los enlaces que se envíen después; las respuestas ya guardadas no se modifican."
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
    </div>
  );
}
