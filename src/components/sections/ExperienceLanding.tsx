import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock,
  MapPin,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
  CheckoutButton,
  type RequiredDocLite,
} from "@/components/forms/CheckoutButton";
import { elements } from "@/data/content";
import {
  isEarlyAccessActive,
  type Experience,
  type ExperienceSection,
  type L,
} from "@/data/experiences";

/**
 * Landing page template for the Executive Experiences (EQUINOX, Elements
 * Awakening, SOUL Discovery). Entirely data-driven from src/data/experiences.ts
 * so the three offerings share one carefully designed layout.
 */

const mxn = (n: number) => `$${n.toLocaleString("es-MX")} MXN`;

export function ExperienceLanding({
  experience: e,
  locale,
  requiredDocs = [],
}: {
  experience: Experience;
  locale: Locale;
  requiredDocs?: RequiredDocLite[];
}) {
  const t = (l: L) => (locale === "en" ? l.en : l.es);
  const el = elements.find((x) => x.key === e.elementKey);
  const accentInk = el?.accentInk ?? "#2C2C2A";
  const accentSoft = el?.accentSoft ?? "#C9A96E";
  const earlyActive = isEarlyAccessActive(e);
  const applyHref = `/${locale}/${locale === "es" ? "aplicar" : "apply"}?retreat=${e.slug}`;

  const cta =
    e.ctaMode === "checkout" && e.productSlug ? (
      <CheckoutButton
        locale={locale}
        retreatSlug={e.slug}
        productSlug={e.productSlug}
        label={t(e.heroCta)}
        requiredDocs={requiredDocs}
      />
    ) : (
      <Button
        href={applyHref}
        size="sm"
        variant="solidLight"
        trailingArrow
        className="w-full"
      >
        {t(e.heroCta)}
      </Button>
    );

  return (
    <>
      {/* HERO */}
      <section
        className="relative min-h-[85vh] flex items-end overflow-hidden -mt-20 pt-20 text-[var(--color-paper)]"
        style={{
          background: `linear-gradient(135deg, ${accentInk} 0%, var(--color-ink) 60%)`,
        }}
      >
        <div className="absolute inset-0 -z-10 opacity-30">
          <Image
            src="/images/heroes/retiros.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 film-grain pointer-events-none" />

        <Container className="relative pb-16 md:pb-24">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-6">
                <Link
                  href={`/${locale}/${locale === "es" ? "retiros" : "retreats"}`}
                  className="eyebrow text-[var(--color-paper)]/90 hover:text-[var(--color-paper)] flex items-center gap-3"
                >
                  <span aria-hidden className="h-px w-10 bg-[var(--color-paper)]/40" />
                  {locale === "es" ? "Calendario" : "Calendar"}
                </Link>
                <span className="eyebrow text-[var(--color-paper)]/40">·</span>
                <span className="eyebrow text-[var(--color-paper)]/90">
                  {t(e.brand)}
                </span>
              </div>

              <div
                className="text-[0.7rem] tracking-[0.22em] uppercase font-medium mb-4"
                style={{ color: accentSoft }}
              >
                {t(e.dateLabel)}
              </div>

              <h1 className="display-1 text-balance text-[var(--color-paper)]">
                {e.title}
              </h1>
              <p
                className="font-[family-name:var(--font-display)] text-xl md:text-2xl mt-4"
                style={{ color: accentSoft }}
              >
                {t(e.tagline)}
              </p>

              <p className="lead mt-8 max-w-2xl text-[var(--color-paper)]/95 text-pretty">
                {t(e.lead)}
              </p>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[var(--color-paper)]/8 backdrop-blur-sm border border-[var(--color-paper)]/15 p-6">
                <dl className="space-y-3 text-sm">
                  <HeroMeta
                    label={locale === "es" ? "Fecha" : "Date"}
                    value={t(e.dateLabel)}
                    icon={CalendarDays}
                  />
                  <HeroMeta
                    label={locale === "es" ? "Duración" : "Duration"}
                    value={t(e.duration)}
                    icon={Clock}
                  />
                  <HeroMeta
                    label={locale === "es" ? "Lugar" : "Venue"}
                    value={t(e.location)}
                    icon={MapPin}
                  />
                  <HeroMeta
                    label={locale === "es" ? "Modalidad" : "Format"}
                    value={t(e.modality)}
                    icon={Users}
                  />
                </dl>

                <div className="mt-6 pt-5 border-t border-[var(--color-paper)]/15">
                  <div className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-paper)]/80 mb-1">
                    {locale === "es" ? "Inversión" : "Investment"}
                  </div>
                  {e.priceMxn == null ? (
                    <div className="font-[family-name:var(--font-display)] text-lg text-[var(--color-paper)]">
                      {locale === "es" ? "Por confirmar" : "To be confirmed"}
                    </div>
                  ) : earlyActive && e.earlyPriceMxn != null ? (
                    <>
                      <div className="flex items-baseline gap-3">
                        <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-paper)]">
                          {mxn(e.earlyPriceMxn)}
                        </span>
                        <span className="text-sm text-[var(--color-paper)]/60 line-through">
                          {mxn(e.priceMxn)}
                        </span>
                      </div>
                      {e.earlyLabel && (
                        <div
                          className="mt-1 text-[0.7rem] tracking-[0.14em] uppercase"
                          style={{ color: accentSoft }}
                        >
                          {t(e.earlyLabel)}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-paper)]">
                      {mxn(e.priceMxn)}
                    </div>
                  )}
                  <div className="mt-2 text-xs text-[var(--color-paper)]/80 leading-relaxed">
                    {locale === "es" ? "Incluye: " : "Includes: "}
                    {t(e.includes)}
                  </div>
                </div>

                <div className="mt-5 space-y-2">{cta}</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* INTRO */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6">
            <h2 className="display-2 text-balance">{t(e.intro.headline)}</h2>
          </div>
          <div className="lg:col-span-6 lg:pt-3 space-y-5">
            {e.intro.paragraphs?.map((p, i) => (
              <p key={i} className={i === 0 ? "lead text-pretty" : "text-[var(--color-ink-soft)] leading-relaxed text-pretty"}>
                {t(p)}
              </p>
            ))}
          </div>
        </div>
      </Section>

      {/* ABOUT */}
      <Section spacing="default" tone="warm">
        <div className="max-w-3xl">
          <Eyebrow className="mb-6 flex items-center gap-3">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
            {t(e.about.headline)}
          </Eyebrow>
          <div className="space-y-5">
            {e.about.paragraphs?.map((p, i) => (
              <p key={i} className={i === 0 ? "lead text-pretty" : "text-[var(--color-ink-soft)] leading-relaxed text-pretty"}>
                {t(p)}
              </p>
            ))}
          </div>
        </div>
      </Section>

      {/* ARCHITECTURE + PHASES */}
      <Section spacing="default">
        <div className="mb-12">
          {e.architecture.eyebrow && (
            <Eyebrow className="mb-4">{t(e.architecture.eyebrow)}</Eyebrow>
          )}
          <h2 className="display-2 text-balance max-w-[24ch]">
            {t(e.architecture.headline)}
          </h2>
          {e.architecture.paragraphs?.map((p, i) => (
            <p key={i} className="lead mt-6 max-w-2xl text-pretty">
              {t(p)}
            </p>
          ))}
          {e.architecture.note && (
            <div
              className="mt-8 inline-block border px-5 py-3 text-[0.7rem] tracking-[0.2em] uppercase font-medium"
              style={{ borderColor: accentSoft, color: accentInk }}
            >
              {t(e.architecture.note)}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {e.phases.map((phase, idx) => {
            const phaseEl = phase.elementKey
              ? elements.find((x) => x.key === phase.elementKey)
              : undefined;
            const ink = phaseEl?.accentInk ?? accentInk;
            const soft = phaseEl?.accentSoft ?? accentSoft;
            return (
              <div key={phase.key} className="bg-[var(--color-paper)] p-6 flex flex-col">
                <div
                  className="text-[0.6rem] tracking-[0.22em] uppercase font-medium mb-4"
                  style={{ color: ink }}
                >
                  {String(idx + 1).padStart(2, "0")}
                  <span
                    aria-hidden
                    className="ml-3 inline-block h-px w-8 align-middle"
                    style={{ background: soft }}
                  />
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-xl mb-1.5">
                  {t(phase.name)}
                </h3>
                <p
                  className="text-sm font-medium mb-3"
                  style={{ color: ink }}
                >
                  {t(phase.tagline)}
                </p>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                  {t(phase.body)}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* OUTCOMES */}
      <Section spacing="default" tone="warm">
        <div className="grid lg:grid-cols-12 gap-12 mb-10">
          <div className="lg:col-span-5">
            <h2 className="display-2 text-balance">{t(e.outcomes.headline)}</h2>
          </div>
          <div className="lg:col-span-7 lg:pt-3">
            {e.outcomes.paragraphs?.map((p, i) => (
              <p key={i} className="lead text-pretty">
                {t(p)}
              </p>
            ))}
          </div>
        </div>
        <ul className="grid md:grid-cols-2 gap-x-10 gap-y-4">
          {e.outcomes.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                style={{ background: accentSoft }}
              >
                <Check className="h-3 w-3" strokeWidth={2.5} style={{ color: accentInk }} />
              </span>
              <span className="text-[var(--color-ink-soft)] leading-relaxed">
                {t(item)}
              </span>
            </li>
          ))}
        </ul>
        {e.outcomes.note && (
          <p className="mt-10 font-[family-name:var(--font-display)] text-xl md:text-2xl max-w-3xl text-pretty">
            {t(e.outcomes.note)}
          </p>
        )}
      </Section>

      {/* FORMAT */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <h2 className="display-2 text-balance">{t(e.format.headline)}</h2>
            {e.format.paragraphs?.map((p, i) => (
              <p key={i} className="lead mt-6 text-pretty">
                {t(p)}
              </p>
            ))}
          </div>
          <div className="lg:col-span-7 lg:pt-3">
            <ul className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
              {e.format.items?.map((item, i) => (
                <li key={i} className="flex items-start gap-4 py-4">
                  <span
                    className="text-[0.65rem] tracking-[0.2em] uppercase font-medium tabular-nums mt-1"
                    style={{ color: accentInk }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[var(--color-ink-soft)] leading-relaxed">
                    {t(item)}
                  </span>
                </li>
              ))}
            </ul>
            {e.format.note && (
              <p className="mt-6 text-sm text-[var(--color-muted)] leading-relaxed text-pretty">
                {t(e.format.note)}
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* EXTRAS */}
      {e.extras?.map((extra, idx) => (
        <Section key={idx} spacing="default" tone={idx % 2 === 0 ? "warm" : undefined}>
          <ExtraBlock section={extra} t={t} accentInk={accentInk} accentSoft={accentSoft} />
        </Section>
      ))}

      {/* VENUE */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "La sede" : "The venue"}
            </Eyebrow>
            <h2 className="display-2 text-balance">{t(e.venue.headline)}</h2>
            <p
              className="mt-4 font-[family-name:var(--font-display)] text-xl"
              style={{ color: accentInk }}
            >
              {t(e.location)}
            </p>
          </div>
          <div className="lg:col-span-7 lg:pt-3 space-y-5">
            {e.venue.paragraphs?.map((p, i) => (
              <p key={i} className="text-[var(--color-ink-soft)] leading-relaxed text-pretty">
                {t(p)}
              </p>
            ))}
            {e.venue.pending && (
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {locale === "es"
                  ? "Sede por confirmar · se anunciará a las personas inscritas."
                  : "Venue to be confirmed · it will be announced to registered participants."}
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* FACILITATORS */}
      <Section spacing="default" tone="warm">
        <div className="mb-12">
          <Eyebrow className="mb-4">
            {locale === "es" ? "Quiénes guían la experiencia" : "Who guides the experience"}
          </Eyebrow>
          <h2 className="display-2 text-balance">Guided by experience.</h2>
        </div>
        <div className="space-y-16">
          {e.facilitators.map((f, idx) => (
            <div
              key={f.name}
              className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start"
            >
              <div className={`lg:col-span-4 ${idx % 2 === 1 ? "lg:order-last" : ""}`}>
                {f.image && (
                  <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-paper)]">
                    <Image
                      src={f.image}
                      alt={f.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="lg:col-span-8">
                <h3 className="font-[family-name:var(--font-display)] text-3xl mb-1">
                  {f.name}
                </h3>
                <div
                  className="text-[0.7rem] tracking-[0.2em] uppercase font-medium mb-6"
                  style={{ color: accentInk }}
                >
                  {t(f.role)}
                </div>
                <div className="space-y-4">
                  {f.paragraphs.map((p, i) => (
                    <p key={i} className="text-[var(--color-ink-soft)] leading-relaxed text-pretty">
                      {t(p)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DUO */}
        <div className="mt-16 border border-[var(--color-line)] bg-[var(--color-paper)] p-8 md:p-10">
          <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl mb-6">
            {t(e.duo.headline)}
          </h3>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {e.duo.items?.map((line, i) => (
              <p
                key={i}
                className="font-[family-name:var(--font-display)] text-lg"
                style={{ color: accentInk }}
              >
                {t(line)}
              </p>
            ))}
          </div>
          {e.duo.paragraphs?.map((p, i) => (
            <p key={i} className="text-[var(--color-ink-soft)] leading-relaxed text-pretty max-w-3xl">
              {t(p)}
            </p>
          ))}
        </div>
      </Section>

      {/* FACT SHEET */}
      <Section spacing="default">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {e.facts.map((fact, i) => (
            <div key={i} className="bg-[var(--color-paper)] p-6">
              <div className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-muted)] mb-2">
                {t(fact.label)}
              </div>
              <div className="text-[var(--color-ink)] leading-relaxed">
                {t(fact.value)}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section spacing="default" tone="warm">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-4">FAQ</Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es" ? "Preguntas frecuentes" : "Frequently asked questions"}
            </h2>
          </div>
          <div className="lg:col-span-8">
            <div className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
              {e.faqs.map((faq, i) => (
                <details key={i} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-[family-name:var(--font-display)] text-lg">
                    {t(faq.q)}
                    <ArrowUpRight
                      className="h-4 w-4 mt-1 shrink-0 text-[var(--color-muted)] transition-transform group-open:rotate-90"
                      strokeWidth={1.5}
                    />
                  </summary>
                  <p className="mt-3 text-[var(--color-ink-soft)] leading-relaxed text-pretty">
                    {t(faq.a)}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* CLOSING CTA */}
      <section
        className="relative overflow-hidden text-[var(--color-paper)]"
        style={{
          background: `linear-gradient(135deg, var(--color-ink) 30%, ${accentInk} 100%)`,
        }}
      >
        <div className="absolute inset-0 film-grain pointer-events-none" />
        <Container className="relative py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="eyebrow text-[var(--color-paper)]/80 mb-6">
              {t(e.brand)}
            </div>
            <h2 className="display-2 text-balance text-[var(--color-paper)]">
              {t(e.closing.headline)}
            </h2>
            {e.closing.paragraphs?.map((p, i) => (
              <p key={i} className="lead mt-6 text-[var(--color-paper)]/95 text-pretty">
                {t(p)}
              </p>
            ))}
            <div
              className="mt-8 text-[0.7rem] tracking-[0.22em] uppercase font-medium"
              style={{ color: accentSoft }}
            >
              {t(e.closing.metaLine)}
            </div>
            <div className="mt-8 max-w-md">
              {e.ctaMode === "checkout" && e.productSlug ? (
                <CheckoutButton
                  locale={locale}
                  retreatSlug={e.slug}
                  productSlug={e.productSlug}
                  label={t(e.closing.cta)}
                  requiredDocs={requiredDocs}
                />
              ) : (
                <Button href={applyHref} size="lg" variant="solidLight" trailingArrow>
                  {t(e.closing.cta)}
                </Button>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function ExtraBlock({
  section,
  t,
  accentInk,
  accentSoft,
}: {
  section: ExperienceSection;
  t: (l: L) => string;
  accentInk: string;
  accentSoft: string;
}) {
  return (
    <div className="grid lg:grid-cols-12 gap-12">
      <div className="lg:col-span-5">
        <h2 className="display-2 text-balance">{t(section.headline)}</h2>
        {section.paragraphs?.map((p, i) => (
          <p key={i} className="lead mt-6 text-pretty">
            {t(p)}
          </p>
        ))}
      </div>
      <div className="lg:col-span-7 lg:pt-3">
        {section.items && (
          <ul className="space-y-4">
            {section.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ background: accentSoft }}
                >
                  <Check
                    className="h-3 w-3"
                    strokeWidth={2.5}
                    style={{ color: accentInk }}
                  />
                </span>
                <span className="text-[var(--color-ink-soft)] leading-relaxed">
                  {t(item)}
                </span>
              </li>
            ))}
          </ul>
        )}
        {section.note && (
          <p className="mt-6 text-sm text-[var(--color-muted)] leading-relaxed">
            {t(section.note)}
          </p>
        )}
      </div>
    </div>
  );
}

function HeroMeta({
  label,
  value,
  icon: I,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-start gap-3">
      <I
        className="h-4 w-4 text-[var(--color-paper)]/80 mt-0.5 shrink-0"
        strokeWidth={1.5}
      />
      <div className="min-w-0">
        <div className="text-[0.6rem] tracking-[0.22em] uppercase text-[var(--color-paper)]/80">
          {label}
        </div>
        <div className="text-[var(--color-paper)] mt-0.5">{value}</div>
      </div>
    </div>
  );
}
