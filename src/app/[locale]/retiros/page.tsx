import Image from "next/image";
import { notFound } from "next/navigation";
import { Wind, Flame, Sparkles, Droplets, Mountain, Atom } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { RetreatsShowcase } from "@/components/sections/RetreatsShowcase";
import { PracticesGallery } from "@/components/sections/PracticesGallery";
import { RetreatCalendar } from "@/components/sections/RetreatCalendar";
import { ProvidersInventory } from "@/components/sections/ProvidersInventory";
import {
  processSteps as staticProcessSteps,
  elements as staticElements,
  onlyElements,
} from "@/data/content";
import { getElements } from "@/modules/content/elements";
import { getProcessSteps } from "@/modules/content/processSteps";
import { getCalendarRetreats } from "@/modules/content/calendarRetreats";
import { getProviders } from "@/modules/content/providers";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "Experience" : "Experiencia" };
}

export default async function RetreatsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const [dbElements, dbProcessSteps, calendarRetreatsData, providersData] =
    await Promise.all([
      getElements(),
      getProcessSteps(),
      getCalendarRetreats(),
      getProviders(),
    ]);
  // Only the four elements — the Núcleo is the leader, not an immersion.
  const elements = onlyElements(dbElements.length > 0 ? dbElements : staticElements);
  const processSteps = dbProcessSteps.length > 0 ? dbProcessSteps : staticProcessSteps;

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden -mt-20 pt-20 text-[var(--color-paper)]">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/heroes/retiros.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-ink)]/40 via-[var(--color-ink)]/55 to-[var(--color-ink)]" />
        <div className="absolute inset-0 -z-10 film-grain" />

        <Container className="relative pb-16 md:pb-24">
          <div className="eyebrow text-[var(--color-paper)]/95 mb-8 flex items-center gap-3">
            <span aria-hidden className="h-px w-12 bg-[var(--color-paper)]/40" />
            {dict.retreats.eyebrow}
          </div>
          <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[15ch]">
            {dict.retreats.title}
          </h1>
          <p className="lead mt-8 max-w-2xl text-[var(--color-paper)]/95">
            {dict.retreats.lead}
          </p>
        </Container>
      </section>

      {/* IMMERSION EXPERIENCE — verbatim from pptx slide 5 */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "La experiencia de inmersión" : "The immersion experience"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Múltiples experiencias por elemento."
                : "Multiple experiences per element."}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="lead text-pretty italic">
              {locale === "es"
                ? "Cada elemento se puede trabajar de muchas maneras. Las actividades se diseñan según el retiro, el grupo y el venue — y son diferentes en cada generación."
                : "Every element can be worked in many ways. The activities are designed around the retreat, the group and the venue — and differ in every generation."}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {elements.map((el) => {
            const Icon =
              el.key === "agua" ? Droplets
              : el.key === "fuego" ? Flame
              : el.key === "aire" ? Wind
              : el.key === "tierra" ? Mountain
              : Atom;
            return (
              <article
                key={el.key}
                className="bg-[var(--color-paper)] p-7 md:p-8 hover:bg-[var(--color-paper-warm)] transition-colors duration-500 min-h-[260px] flex flex-col"
              >
                <div className="flex items-start justify-between mb-6">
                  <span
                    className="inline-flex items-center justify-center h-11 w-11 rounded-full"
                    style={{ background: el.accentSoft }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} style={{ color: el.accentInk }} />
                  </span>
                  <span
                    className="text-[0.65rem] tracking-[0.22em] uppercase font-medium"
                    style={{ color: el.accentInk }}
                  >
                    {el.framework}
                  </span>
                </div>
                <div className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-muted)] mb-2">
                  {locale === "es" ? `Elemento ${el.nameEs}` : `${el.nameEn} Element`}
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-xl tracking-tight mb-3">
                  {locale === "es" ? el.qualityEs : el.qualityEn}
                </h3>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mt-auto">
                  {locale === "es"
                    ? "Varias experiencias posibles. Elegimos las que mejor sirven al grupo y al entorno de cada inmersión."
                    : "Several possible experiences. We choose the ones that best serve the group and the setting of each immersion."}
                </p>
              </article>
            );
          })}
        </div>
      </Section>

      {/* GRID OF MODULES */}
      <RetreatsShowcase locale={locale} dict={dict} hideHeader />

      {/* DISCONNECTION PROTOCOL — 6 phases from master doc */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Wind className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Protocolo de Desconexión" : "Disconnection Protocol"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Seis fases por inmersión."
                : "Six phases per immersion."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-4">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Cada experiencia comienza con una entrevista de descubrimiento profunda. A partir de ahí se diseñan las metodologías a aplicar por elemento, las locaciones y el programa de coaching. Cada mes es diferente. Cada inmersión, irrepetible."
                : "Every experience begins with a deep discovery interview. From there we design the methodologies to apply per element, the locations and the coaching program. Each month is different. Every immersion, unrepeatable."}
            </p>
          </div>
        </div>

        <div className="border border-[var(--color-line)] divide-y divide-[var(--color-line)] bg-[var(--color-paper)]">
          {processSteps.map((step) => (
            <div
              key={step.n}
              className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_220px_120px_1fr] gap-4 md:gap-6 p-5 md:p-7 items-start hover:bg-[var(--color-paper-warm)] transition-colors"
            >
              <span className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-[var(--color-gold-deep)]">
                {step.n}
              </span>
              <span className="font-[family-name:var(--font-display)] text-lg md:text-xl tracking-tight col-span-1">
                {locale === "es" ? step.titleEs : step.titleEn}
              </span>
              <span className="text-xs uppercase tracking-wide text-[var(--color-muted)] md:text-right tabular-nums col-span-1">
                {locale === "es" ? step.durationEs : step.durationEn}
              </span>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed col-span-2 md:col-span-1">
                {locale === "es" ? step.bodyEs : step.bodyEn}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* CALENDAR — 9 retreats (Oct 2026 → Q4 2027) */}
      <RetreatCalendar locale={locale} retreats={calendarRetreatsData} />

      {/* PROVIDERS — 16 field disciplines with element affinity + status */}
      <ProvidersInventory locale={locale} providers={providersData} />

      {/* PRACTICES GALLERY — editorial index of all documented field practices. */}
      <PracticesGallery locale={locale} />

      {/* CTA — apply to a program */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Eyebrow inverted className="mb-6">
              {locale === "es" ? "Aplica" : "Apply"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)] text-balance">
              {locale === "es"
                ? "Las inmersiones viven dentro de un programa."
                : "Immersions live within a program."}
            </h2>
            <p className="lead mt-6 text-[var(--color-paper)]/90 text-pretty max-w-2xl">
              {locale === "es"
                ? "No se ofrecen como módulos sueltos. Se acceden a través de Fluir, Momentum, Raíz, Brújula u Oneness — o de Origin para organizaciones."
                : "They are not offered as standalone modules. You access them through Flow, Momentum, Root, Compass or Oneness — or Origin for organizations."}
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="space-y-3">
              <Button
                href={`/${locale}/${locale === "es" ? "los-caminos" : "paths"}`}
                size="lg"
                trailingArrow
                className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)] w-full"
              >
                {locale === "es" ? "Ver programas" : "See programs"}
              </Button>
              <Button
                href="mailto:hello@elementsmethod.com"
                size="lg"
                variant="outlineLight"
                className="w-full"
              >
                {locale === "es" ? "Solicitar información" : "Request information"}
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
