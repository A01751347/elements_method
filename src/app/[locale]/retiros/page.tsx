import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Section, Eyebrow } from "@/components/ui/Section";
import { RetreatsShowcase } from "@/components/sections/RetreatsShowcase";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "Retreats" : "Retiros" };
}

export default async function RetreatsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <Section spacing="loose">
        <div className="max-w-4xl">
          <Eyebrow className="mb-6">{dict.retreats.eyebrow}</Eyebrow>
          <h1 className="display-1">{dict.retreats.title}</h1>
          <p className="lead mt-8 max-w-2xl">{dict.retreats.lead}</p>
        </div>
      </Section>

      <RetreatsShowcase locale={locale} dict={dict} hideHeader />
    </>
  );
}
