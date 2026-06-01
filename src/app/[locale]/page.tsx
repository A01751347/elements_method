import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { HeroSection } from "@/components/sections/HeroSection";
import { LogosMarquee } from "@/components/sections/LogosMarquee";
import { PhilosophyStrip } from "@/components/sections/PhilosophyStrip";
import { ElementsShowcase } from "@/components/sections/ElementsShowcase";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { PathsPreview } from "@/components/sections/PathsPreview";
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

  return (
    <>
      <HeroSection locale={locale} dict={dict} />
      <LogosMarquee locale={locale} dict={dict} />
      <PhilosophyStrip locale={locale} />
      <ElementsShowcase locale={locale} dict={dict} />
      <ProcessSteps locale={locale} />
      <PathsPreview locale={locale} dict={dict} />
      <StatsBand locale={locale} />
      <RetreatsShowcase locale={locale} dict={dict} />
      <TestimonialsCarousel locale={locale} dict={dict} />
      <CompaniesCta locale={locale} dict={dict} />
      <JournalPreview locale={locale} dict={dict} />
      <FAQ locale={locale} />
      <FinalCta locale={locale} />
    </>
  );
}
