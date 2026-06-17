import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { HeroSection } from "@/components/sections/HeroSection";
import { NatureLexicon } from "@/components/sections/NatureLexicon";
import { PhilosophyStrip } from "@/components/sections/PhilosophyStrip";
import { ElementsShowcase } from "@/components/sections/ElementsShowcase";
import { ImmersionExperiences } from "@/components/sections/ImmersionExperiences";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { MantraDivider } from "@/components/sections/MantraDivider";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { PathsPreview } from "@/components/sections/PathsPreview";
import { SeasonsRhythm } from "@/components/sections/SeasonsRhythm";
import { StatsBand } from "@/components/sections/StatsBand";
import { RetreatsShowcase } from "@/components/sections/RetreatsShowcase";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { CompaniesCta } from "@/components/sections/CompaniesCta";
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
      <NatureLexicon locale={locale} />
      <PhilosophyStrip locale={locale} />
      <ElementsShowcase locale={locale} dict={dict} />
      <ImmersionExperiences locale={locale} dict={dict} />
      <LocationsSection locale={locale} />
      <MantraDivider locale={locale} />
      <ProcessSteps locale={locale} />
      <PathsPreview locale={locale} dict={dict} />
      <SeasonsRhythm locale={locale} />
      <StatsBand locale={locale} />
      <RetreatsShowcase locale={locale} dict={dict} />
      <TestimonialsCarousel locale={locale} dict={dict} />
      <CompaniesCta locale={locale} dict={dict} />
      <FAQ locale={locale} />
      <FinalCta locale={locale} />
      {/* DISABLED FOR BISECTION:
      <SeasonsRhythm locale={locale} />
      <StatsBand locale={locale} />
      <RetreatsShowcase locale={locale} dict={dict} />
      <TestimonialsCarousel locale={locale} dict={dict} />
      <CompaniesCta locale={locale} dict={dict} />
      <FAQ locale={locale} />
      <FinalCta locale={locale} />
      */}
    </>
  );
}
