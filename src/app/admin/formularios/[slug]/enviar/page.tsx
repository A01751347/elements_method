import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { forms } from "@/shared/db/schema/forms";
import {
  AdminPageHeader,
  AdminSecondaryButton,
  PlaceholderNote,
} from "../../../_components/admin-ui";
import { MintTokenForm } from "./MintTokenForm";

export default async function MintTokenPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let f: { id: string; titleEs: string; titleEn: string | null } | null = null;
  try {
    const rows = await db
      .select({ id: forms.id, titleEs: forms.titleEs, titleEn: forms.titleEn })
      .from(forms)
      .where(eq(forms.slug, slug))
      .limit(1);
    f = rows[0] ?? null;
  } catch (e) {
    console.error("[admin/forms/enviar] DB read failed", e);
  }
  if (!f) notFound();

  return (
    <>
      <AdminPageHeader
        title={`Enviar: ${f.titleEs}`}
        subtitle={`Genera un enlace de un solo uso para un participante específico.`}
        action={
          <AdminSecondaryButton href={`/admin/formularios/${slug}`}>← Volver</AdminSecondaryButton>
        }
      />
      <PlaceholderNote />

      <MintTokenForm formSlug={slug} formTitle={f.titleEs} />
    </>
  );
}
