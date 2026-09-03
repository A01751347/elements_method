import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { elements as staticElements, elementImages as staticElementImages } from "@/data/content";
import { getElements, getElementImages } from "@/modules/content/elements";
import { getStats } from "@/modules/content/stats";
import { getFaqs } from "@/modules/content/faqs";
import { getProcessSteps } from "@/modules/content/processSteps";
import { getModalityAxes } from "@/modules/content/modalityAxes";
import { getImpactCircles } from "@/modules/content/impactCircles";
// import { getLexicon } from "@/modules/content/lexicon";
import { getMantra, getCoachingSection, getCommunitySection } from "@/modules/content/siteSections";
import { getTestimonials } from "@/modules/content/testimonials";
import { getContactInfo } from "@/modules/content/contact";
import { HeroSection } from "@/components/sections/HeroSection";
import { ImageInterlude } from "@/components/sections/ImageInterlude";
// Léxico del método — sección desactivada (se comenta, no se borra).
// import { NatureLexicon } from "@/components/sections/NatureLexicon";
import { PhilosophyStrip } from "@/components/sections/PhilosophyStrip";
import { ElementsShowcase } from "@/components/sections/ElementsShowcase";
import { ImmersionExperiences } from "@/components/sections/ImmersionExperiences";
import { LocationsSection } from "@/components/sections/LocationsSection";
import { MantraDivider } from "@/components/sections/MantraDivider";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ExperiencesPreview } from "@/components/sections/ExperiencesPreview";
import { CoachingSection } from "@/components/sections/CoachingSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { SeasonsRhythm } from "@/components/sections/SeasonsRhythm";
import { StatsBand } from "@/components/sections/StatsBand";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { CompaniesCta } from "@/components/sections/CompaniesCta";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCta } from "@/components/sections/FinalCta";

/** Revalidate at most once per minute; admin edits also trigger on-demand
 *  revalidation via revalidatePath, so changes surface immediately. */
export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  // Fetch all editorial content from the DB in parallel. Each query falls back
  // to an empty result on an empty DB; the section components fall back to their
  // static content when handed an empty prop, so the page is safe at every stage.
  const [
    elements,
    elementImages,
    stats,
    faqs,
    processSteps,
    modalityAxes,
    impactCircles,
    // lexicon,  ← sección Léxico comentada
    mantra,
    coaching,
    community,
  ] = await Promise.all([
    getElements(),
    getElementImages(),
    getStats(),
    getFaqs(),
    getProcessSteps(),
    getModalityAxes(),
    getImpactCircles(),
    getMantra(),
    getCoachingSection(),
    getCommunitySection(),
  ]);
  const [testimonials, contact] = await Promise.all([
    getTestimonials("home"),
    getContactInfo(),
  ]);

  const elementsList = elements.length > 0 ? elements : staticElements;
  const images = Object.keys(elementImages).length > 0 ? elementImages : staticElementImages;
  const eter = elementsList.find((e) => e.key === "eter") ?? staticElements.find((e) => e.key === "eter")!;
  const air = elementsList.find((e) => e.key === "aire") ?? staticElements.find((e) => e.key === "aire")!;

  return (
    <>
      <HeroSection locale={locale} dict={dict} />
      {/* <NatureLexicon locale={locale} lexicon={lexicon} /> */}
      <PhilosophyStrip locale={locale} />
      <ElementsShowcase locale={locale} dict={dict} elements={elements} />
      <ImmersionExperiences locale={locale} dict={dict} elements={elements} />
      <ImageInterlude
        image={images.tierra}
        eyebrow={locale === "es" ? "El Núcleo" : "The Nucleus"}
        quote={locale === "es" ? eter.quoteEs : eter.quoteEn}
      />
      <LocationsSection locale={locale} axes={modalityAxes} />
      <MantraDivider locale={locale} mantra={mantra} />
      <ProcessSteps locale={locale} steps={processSteps} />
      <ImageInterlude
        image={images.aire}
        eyebrow={locale === "es" ? "Perspectiva" : "Perspective"}
        quote={locale === "es" ? air.quoteEs : air.quoteEn}
        height="medium"
      />
      <ExperiencesPreview locale={locale} dict={dict} />
      <CoachingSection locale={locale} section={coaching} />
      <SeasonsRhythm locale={locale} circles={impactCircles} />
      <CommunitySection locale={locale} section={community} />
      <StatsBand locale={locale} stats={stats} />
      <TestimonialsCarousel locale={locale} dict={dict} testimonials={testimonials} />
      <CompaniesCta locale={locale} dict={dict} />
      <FAQ locale={locale} faqs={faqs} />
      <FinalCta locale={locale} contact={contact ?? undefined} />
    </>
  );
}
