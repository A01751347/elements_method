import { notFound } from "next/navigation";
import { getCalendarRetreatBySlug } from "@/modules/content/calendarRetreats";
import { findRetreatBySlug } from "@/data/launchData";
import { elements } from "@/data/content";
import { AdminPageHeader, PlaceholderNote } from "../../_components/admin-ui";
import { RetreatForm } from "../RetreatForm";

export default async function AdminRetreatEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = (await getCalendarRetreatBySlug(slug)) ?? findRetreatBySlug(slug);
  if (!r) notFound();
  const el = elements.find((e) => e.key === r.elementKey);

  return (
    <>
      <AdminPageHeader
        title={`Retiro: ${r.themeEs}`}
        subtitle={`${r.dateLabelEs} · ${el?.nameEs ?? r.elementKey}`}
      />
      <PlaceholderNote />
      <RetreatForm retreat={r} />
    </>
  );
}
