import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { forms } from "@/shared/db/schema/forms";
import { PageHeader, Volver } from "../../../_components/ui";
import { MintTokenForm } from "./MintTokenForm";

export const dynamic = "force-dynamic";

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
    console.error("[admin/formularios/enviar] DB read failed", e);
  }
  if (!f) notFound();

  return (
    <div className="flex flex-col gap-8">
      <Volver href={`/admin/formularios/${slug}`}>{f.titleEs}</Volver>
      <PageHeader
        title={`Enviar: ${f.titleEs}`}
        subtitle="Genera enlaces de un solo uso para uno o varios participantes."
      />
      <MintTokenForm formSlug={slug} formTitle={f.titleEs} />
    </div>
  );
}
