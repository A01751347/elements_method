import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPaths } from "@/modules/products/queries";
import { getUpcomingRetreats } from "@/modules/retreats/queries";
import { HeroSection } from "@/components/sections/HeroSection";
import { NatureLexicon } from "@/components/sections/NatureLexicon";
import { PhilosophyStrip } from "@/components/sections/PhilosophyStrip";
import { ElementsShowcase } from "@/components/sections/ElementsShowcase";
import { PracticesGallery } from "@/components/sections/PracticesGallery";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { MantraDivider } from "@/components/sections/MantraDivider";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { PathsPreview } from "@/components/sections/PathsPreview";
import { SeasonsRhythm } from "@/components/sections/SeasonsRhythm";
import { StatsBand } from "@/components/sections/StatsBand";
import { RetreatsShowcase } from "@/components/sections/RetreatsShowcase";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { CompaniesCta } from "@/components/sections/CompaniesCta";
import { JournalPreview } from "@/components/sections/JournalPreview";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCta } from "@/components/sections/FinalCta";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const [paths, retreats] = await Promise.all([
    getPaths().catch(() => []),
    getUpcomingRetreats({ limit: 4 }).catch(() => []),
  ]);

  return (
    <>
      <HeroSection locale={locale} dict={dict} />
      <NatureLexicon locale={locale} />
      <PhilosophyStrip locale={locale} />
      <ElementsShowcase locale={locale} dict={dict} />
      <PracticesGallery locale={locale} />
      <LocationsSection locale={locale} />
      <MantraDivider locale={locale} />
      <ProcessSteps locale={locale} />
      <PathsPreview locale={locale} dict={dict} paths={paths} />
      <SeasonsRhythm locale={locale} />
      <StatsBand locale={locale} />
      <RetreatsShowcase locale={locale} dict={dict} retreats={retreats} />
      <TestimonialsCarousel locale={locale} dict={dict} />
      <CompaniesCta locale={locale} dict={dict} />
      <JournalPreview locale={locale} dict={dict} />
      <FAQ locale={locale} />
      <FinalCta locale={locale} />
    </>
  );
}
