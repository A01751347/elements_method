import Image from "next/image";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { paths, singleModulePricing } from "@/data/content";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { formatPriceMXN } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "Programs" : "Programas" };
}

export default async function PathsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden -mt-20 pt-20 text-[var(--color-paper)]">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/heroes/caminos.jpg"
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
          <div className="eyebrow text-[var(--color-paper)]/80 mb-8 flex items-center gap-3">
            <span aria-hidden className="h-px w-12 bg-[var(--color-paper)]/40" />
            {dict.paths.eyebrow}
          </div>
          <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[15ch]">
            {dict.paths.title}
          </h1>
          <p className="lead mt-8 max-w-2xl text-[var(--color-paper)]/85">
            {dict.paths.lead}
          </p>
        </Container>
      </section>

      {/* PROGRAM DETAILS — Roots / Current / Source from presentation page 28 */}
      <Section spacing="default" contained={false}>
        <div className="border-t border-[var(--color-line)]">
          {paths.map((p, idx) => {
            const name = locale === "es" ? p.nameEs : p.nameEn;
            const tag = locale === "es" ? p.tagEs : p.tagEn;
            const short = locale === "es" ? p.shortEs : p.shortEn;
            const long = locale === "es" ? p.longEs : p.longEn;
            const includes = locale === "es" ? p.includesEs : p.includesEn;
            const modality = locale === "es" ? p.modalityEs : p.modalityEn;
            const duration = locale === "es" ? p.durationEs : p.durationEn;

            return (
              <div
                key={p.slug}
                className="border-b border-[var(--color-line)] group hover:bg-[var(--color-paper-warm)]/40 transition-colors"
              >
                <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20 grid lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-2 flex lg:flex-col items-start gap-4">
                    <span className="font-[family-name:var(--font-display)] text-5xl lg:text-6xl text-[var(--color-ink)]/15 group-hover:text-[var(--color-moss-500)]/60 transition-colors">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="lg:col-span-6">
                    <div className="eyebrow text-[var(--color-muted)] mb-3">
                      {tag}
                    </div>
                    <h2 className="display-2 mb-3">{name}</h2>
                    <p className="text-[var(--color-ink-soft)] text-lg italic mb-6">
                      {short}
                    </p>
                    <p className="text-[var(--color-ink-soft)] leading-relaxed max-w-xl">
                      {long}
                    </p>

                    <div className="mt-10 flex flex-wrap gap-6 text-sm">
                      <Meta
                        label={locale === "es" ? "Duración" : "Duration"}
                        value={duration}
                      />
                      <Meta
                        label={locale === "es" ? "Formato" : "Format"}
                        value={modality}
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="bg-[var(--color-paper)] border border-[var(--color-line)] p-8">
                      <div className="eyebrow text-[var(--color-muted)] mb-5">
                        {locale === "es" ? "Incluye" : "Includes"}
                      </div>
                      <ul className="space-y-3">
                        {includes.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-sm text-[var(--color-ink-soft)]"
                          >
                            <Check className="h-4 w-4 mt-0.5 text-[var(--color-moss-500)] shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8 pt-6 border-t border-[var(--color-line)]">
                        <div className="text-xs text-[var(--color-muted)] uppercase tracking-wide">
                          {locale === "es" ? "Inversión" : "Investment"}
                        </div>
                        <div className="mt-2 font-[family-name:var(--font-display)] text-xl italic text-[var(--color-muted)]">
                          {locale === "es"
                            ? "A confirmar · contactar"
                            : "TBD · contact us"}
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button
                          href="mailto:hello@elementsmethod.com"
                          size="sm"
                          variant="primary"
                          trailingArrow
                          className="w-full"
                        >
                          {locale === "es" ? "Solicitar información" : "Request information"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* SINGLE MODULES — pricing from proyecto.md */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-4">
              {locale === "es" ? "Módulos sueltos" : "Single modules"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Cuatro módulos independientes. Un día al mes cada uno."
                : "Four independent modules. One day per month each."}
            </h2>
            <p className="lead mt-6 text-pretty max-w-2xl">
              {locale === "es"
                ? "Formato intensivo. Cupo limitado a 15 participantes por módulo."
                : "Intensive format. Capacity capped at 15 participants per module."}
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[var(--color-paper)] border border-[var(--color-line)] p-7">
              <div className="eyebrow text-[var(--color-muted)] mb-4">
                {locale === "es" ? "Inversión por módulo" : "Per-module investment"}
              </div>
              <div className="space-y-3 mb-6">
                <PriceRow
                  label={locale === "es" ? "Precio estándar" : "Standard price"}
                  value={formatPriceMXN(singleModulePricing.standardMxn)}
                  emphasis
                />
                <PriceRow
                  label="Early Bird"
                  value={formatPriceMXN(singleModulePricing.earlyBirdMxn)}
                />
                <PriceRow
                  label={locale === "es" ? "Grupos (3 o más)" : "Groups (3 or more)"}
                  value={formatPriceMXN(singleModulePricing.groupMxn)}
                />
              </div>
              <Button
                href={`/${locale}/${locale === "es" ? "retiros" : "retreats"}`}
                variant="primary"
                trailingArrow
                className="w-full"
              >
                {locale === "es" ? "Ver módulos" : "See modules"}
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <h2 className="display-2 text-[var(--color-paper)] text-balance">
              {locale === "es"
                ? "El liderazgo comienza en la mente que decide."
                : "Leadership begins in the mind that decides."}
            </h2>
          </div>
          <div className="lg:col-span-5 flex lg:items-end">
            <div className="space-y-4">
              <p className="text-[var(--color-paper)]/75 leading-relaxed">
                {locale === "es"
                  ? "Aplica ahora — cupo limitado a 15 participantes por módulo."
                  : "Apply now — capacity capped at 15 participants per module."}
              </p>
              <Button
                href="mailto:hello@elementsmethod.com"
                size="lg"
                trailingArrow
                className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)]"
              >
                {locale === "es" ? "Aplicar ahora" : "Apply now"}
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-[var(--color-muted)] uppercase tracking-wide">
        {label}
      </div>
      <div className="mt-1 text-[var(--color-ink)]">{value}</div>
    </div>
  );
}

function PriceRow({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="flex items-end justify-between gap-4 py-2 border-b border-[var(--color-line)] last:border-0">
      <span className="text-sm text-[var(--color-ink-soft)]">{label}</span>
      <span
        className={`font-[family-name:var(--font-display)] tabular-nums ${
          emphasis ? "text-2xl" : "text-lg text-[var(--color-muted)]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
