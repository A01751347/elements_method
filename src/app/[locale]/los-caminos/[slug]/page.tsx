import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, Quote, Sparkles } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  findProgram,
  programDetails,
  rootsArc as staticRootsArc,
  elementImages as staticElementImages,
  elements as staticElements,
  type ElementKey,
} from "@/data/content";
import { findProgramDetail } from "@/modules/content/programDetails";
import { getRootsArc } from "@/modules/content/siteSections";
import { getElements, getElementImages } from "@/modules/content/elements";
import { getPathPrice } from "@/modules/content/pathPricing";
import { getRequiredDocs } from "@/modules/content/requiredDocs";
import { CheckoutButton } from "@/components/forms/CheckoutButton";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const revalidate = 60;

/**
 * Detail page for individual programs.
 * Content sourced VERBATIM from elements-website-content.pptx slides 9-17.
 * Routes: /los-caminos/{raices|corriente|fuente|soulfull}
 */

export function generateStaticParams() {
  return programDetails.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const program = (await findProgramDetail(slug)) ?? findProgram(slug);
  if (!program) return { title: "Programa" };
  const title = locale === "en" ? program.nameEn : program.nameEs;
  return { title };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  // Fetch program detail + supporting content from the DB, with static fallback.
  const [dbProgram, dbRootsArc, dbElements, dbElementImages, price, requiredDocs] =
    await Promise.all([
      findProgramDetail(slug),
      getRootsArc(),
      getElements(),
      getElementImages(),
      getPathPrice(slug),
      getRequiredDocs("persona"),
    ]);
  const program = dbProgram ?? findProgram(slug);
  if (!program) notFound();

  const rootsArc = dbRootsArc.length > 0 ? dbRootsArc : staticRootsArc;
  const elements = dbElements.length > 0 ? dbElements : staticElements;
  const elementImages =
    Object.keys(dbElementImages).length > 0 ? dbElementImages : staticElementImages;

  const dict = getDictionary(locale);
  const elementInfo = elements.find((e) => e.key === program.primaryElement);
  const heroImage =
    elementImages[program.primaryElement as ElementKey] ?? elementImages.tierra;

  const headerKicker = locale === "es" ? program.headerKickerEs : program.headerKickerEn;
  const name = locale === "es" ? program.nameEs : program.nameEn;
  const tagline = locale === "es" ? program.taglineEs : program.taglineEn;
  const includesHeading =
    locale === "es" ? program.includesHeadingEs : program.includesHeadingEn;
  const whoForHeading =
    locale === "es" ? program.whoForHeadingEs : program.whoForHeadingEn;
  const cta = locale === "es" ? program.ctaEs : program.ctaEn;
  const cadenceHeading =
    locale === "es" ? program.cadenceHeadingEs : program.cadenceHeadingEn;
  const closingTitle =
    locale === "es" ? program.closingTitleEs : program.closingTitleEn;
  const closingBody =
    locale === "es" ? program.closingBodyEs : program.closingBodyEn;
  const closingNote =
    locale === "es" ? program.closingNoteEs : program.closingNoteEn;
  const comparativa =
    locale === "es" ? program.comparativaEs : program.comparativaEn;

  return (
    <>
      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[70vh] flex items-end overflow-hidden -mt-20 pt-20 text-[var(--color-paper)]"
      >
        <div className="absolute inset-0 -z-20">
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-ink)]/45 via-[var(--color-ink)]/70 to-[var(--color-ink)]/92" />
        <div className="absolute inset-0 -z-10 film-grain" />

        <Container className="relative pb-16 md:pb-24">
          <Link
            href={`/${locale}/${locale === "es" ? "los-caminos" : "paths"}`}
            className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-paper)]/90 hover:text-[var(--color-paper)] transition-colors mb-8"
          >
            ← {locale === "es" ? "Todos los programas" : "All programs"}
          </Link>

          <div className="eyebrow text-[var(--color-paper)]/95 mb-8 flex items-center gap-3">
            <span aria-hidden className="h-px w-12 bg-[var(--color-paper)]/40" />
            {headerKicker}
          </div>

          <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[20ch]">
            {name}
          </h1>
          <p className="lead mt-8 max-w-3xl text-[var(--color-paper)]/95 italic">
            {tagline}
          </p>

          {/* URL pill — from pptx */}
          {program.url && (
            <div className="mt-8 inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-paper)]/80">
              <span aria-hidden className="h-px w-6 bg-[var(--color-paper)]/30" />
              {program.url}
            </div>
          )}
        </Container>
      </section>

      {/* ─── STATS RAIL ─────────────────────────────────────────────── */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div
          className={`grid sm:grid-cols-2 lg:grid-cols-${Math.min(program.stats.length, 5)} gap-px bg-[var(--color-line)] border border-[var(--color-line)]`}
          style={{ gridTemplateColumns: `repeat(${Math.min(program.stats.length, 5)}, minmax(0, 1fr))` }}
        >
          {program.stats.map((s, i) => (
            <div
              key={`${s.value}-${i}`}
              className="bg-[var(--color-paper)] p-6 md:p-7"
            >
              <div className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-[var(--color-ink)]">
                {s.value}
              </div>
              <div className="text-xs uppercase tracking-wide text-[var(--color-muted)] mt-2">
                {locale === "es" ? s.labelEs : s.labelEn}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── ROOTS-ONLY: 5-MONTH ARC ────────────────────────────────── */}
      {program.slug === "raices" && (
        <Section spacing="default">
          <div className="grid lg:grid-cols-12 gap-12 mb-12">
            <div className="lg:col-span-6">
              <Eyebrow className="mb-6">
                {locale === "es" ? "Tu programa de cinco meses" : "Your five-month program"}
              </Eyebrow>
              <h2 className="display-2 text-balance">
                {locale === "es"
                  ? "Un viaje de cinco meses por los cuatro elementos, cerrando con la integración de todos en tu núcleo."
                  : "A five-month journey through the four elements, closing by integrating all of them into your core."}
              </h2>
            </div>
            <div className="lg:col-span-6 lg:pt-4">
              <p className="lead text-pretty">
                {locale === "es"
                  ? "Las actividades serán publicadas en cada inmersión por individual. Lo que no cambia es el patrón: naturaleza, metodología, experiencia inmersiva, reflexión por elemento."
                  : "Activities will be published per individual immersion. What does not change is the pattern: nature, methodology, immersive experience, reflection per element."}
              </p>
            </div>
          </div>

          <div className="border border-[var(--color-line)] divide-y divide-[var(--color-line)] bg-[var(--color-paper)]">
            {rootsArc.map((row) => {
              const el = elements.find((e) => e.key === row.elementKey);
              return (
                <div
                  key={row.month}
                  className="grid grid-cols-[60px_120px_1fr] md:grid-cols-[80px_220px_1fr] gap-4 md:gap-6 p-5 md:p-7 items-baseline"
                >
                  <span className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-muted)]/60 tabular-nums">
                    {String(row.month).padStart(2, "0")}
                  </span>
                  <span
                    className="font-[family-name:var(--font-display)] text-xl tracking-tight"
                    style={{ color: el?.accent ?? "var(--color-ink)" }}
                  >
                    {(() => {
                      const label =
                        row.elementKey === "eter"
                          ? locale === "es"
                            ? "Núcleo · Integración"
                            : "Core · Integration"
                          : locale === "es"
                            ? el?.nameEs ?? ""
                            : el?.nameEn ?? "";
                      return locale === "es"
                        ? `Mes ${row.month} · ${label}`
                        : `Month ${row.month} · ${label}`;
                    })()}
                  </span>
                  <p className="text-[var(--color-ink-soft)] leading-relaxed">
                    {locale === "es" ? row.titleEs : row.titleEn}
                  </p>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* ─── CURRENT-ONLY: COMPARATIVA ──────────────────────────────── */}
      {program.slug === "corriente" && comparativa && (
        <Section spacing="default">
          <div className="grid lg:grid-cols-12 gap-12 mb-12">
            <div className="lg:col-span-6">
              <Eyebrow className="mb-6">
                {locale === "es" ? "Fluir vs Momentum" : "Flow vs Momentum"}
              </Eyebrow>
              <h2 className="display-2 text-balance">
                {includesHeading}
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
            <div className="bg-[var(--color-paper)] p-8 md:p-10">
              <div className="eyebrow text-[var(--color-muted)] mb-6">
                {locale === "es" ? "Fluir · Flow" : "Flow"}
              </div>
              <ul className="space-y-3 text-[var(--color-ink-soft)]">
                {comparativa.left.map((line, i) => (
                  <li
                    key={`${line}-${i}`}
                    className="flex items-start gap-3"
                  >
                    <span className="h-1 w-3 bg-[var(--color-earth)] mt-3 shrink-0" />
                    <span className="leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[var(--color-paper-warm)] p-8 md:p-10">
              <div className="eyebrow text-[var(--color-fire)] mb-6">
                Momentum ✦
              </div>
              <ul className="space-y-3 text-[var(--color-ink-soft)]">
                {comparativa.right.map((line, i) => (
                  <li
                    key={`${line}-${i}`}
                    className="flex items-start gap-3"
                  >
                    <span className="h-1 w-3 bg-[var(--color-fire)] mt-3 shrink-0" />
                    <span className="leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      )}

      {/* ─── INCLUDES BLOCK ─────────────────────────────────────────── */}
      {program.includesBlocks.length > 0 && (
        <Section
          spacing="default"
          tone={program.slug === "corriente" ? "warm" : "paper"}
        >
          <div className="grid lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-6">
              <Eyebrow className="mb-6">
                {locale === "es" ? "Incluye" : "Includes"}
              </Eyebrow>
              <h2 className="display-2 text-balance">{includesHeading}</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
            {program.includesBlocks.map((block, idx) => (
              <article
                key={`${block.titleEs}-${idx}`}
                className="bg-[var(--color-paper)] p-7 md:p-9 hover:bg-[var(--color-paper-warm)] transition-colors min-h-[280px] flex flex-col"
              >
                <div className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-gold-deep)]/30 mb-4">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-tight mb-4">
                  {locale === "es" ? block.titleEs : block.titleEn}
                </h3>
                <p className="text-[var(--color-ink-soft)] leading-relaxed text-sm">
                  {locale === "es" ? block.bodyEs : block.bodyEn}
                </p>
              </article>
            ))}
          </div>
        </Section>
      )}

      {/* ─── TYPICAL MONTH CADENCE ──────────────────────────────────── */}
      {program.cadence && program.cadence.length > 0 && (
        <Section
          spacing="default"
          tone={program.slug === "fuente" ? "warm" : "ink"}
        >
          <div className="grid lg:grid-cols-12 gap-12 mb-12">
            <div className="lg:col-span-6">
              <Eyebrow
                inverted={program.slug !== "fuente"}
                className="mb-6"
              >
                {locale === "es" ? "Cadencia" : "Cadence"}
              </Eyebrow>
              <h2
                className={`display-2 text-balance ${
                  program.slug === "fuente" ? "" : "text-[var(--color-paper)]"
                }`}
              >
                {cadenceHeading}
              </h2>
            </div>
          </div>

          <div
            className={`grid md:grid-cols-2 lg:grid-cols-4 gap-px ${
              program.slug === "fuente"
                ? "bg-[var(--color-line)] border border-[var(--color-line)]"
                : "bg-[var(--color-paper)]/15"
            }`}
          >
            {program.cadence.map((wk) => (
              <article
                key={wk.label}
                className={`p-6 md:p-7 min-h-[260px] flex flex-col ${
                  program.slug === "fuente"
                    ? "bg-[var(--color-paper)]"
                    : "bg-[var(--color-ink)]"
                }`}
              >
                <div
                  className={`text-[0.62rem] tracking-[0.22em] uppercase mb-3 ${
                    program.slug === "fuente"
                      ? "text-[var(--color-muted)]"
                      : "text-[var(--color-paper)]/80"
                  }`}
                >
                  {wk.label}
                </div>
                <h3
                  className={`font-[family-name:var(--font-display)] text-xl tracking-tight mb-5 ${
                    program.slug === "fuente"
                      ? ""
                      : "text-[var(--color-paper)]"
                  }`}
                >
                  {locale === "es" ? wk.titleEs : wk.titleEn}
                </h3>
                <ul className="space-y-2 flex-1">
                  {(locale === "es" ? wk.bulletsEs : wk.bulletsEn).map((b, i) => (
                    <li
                      key={`${b}-${i}`}
                      className={`text-sm flex items-start gap-2.5 ${
                        program.slug === "fuente"
                          ? "text-[var(--color-ink-soft)]"
                          : "text-[var(--color-paper)]/95"
                      }`}
                    >
                      <span
                        className={`h-1 w-2.5 mt-2 shrink-0 ${
                          program.slug === "fuente"
                            ? "bg-[var(--color-gold-deep)]"
                            : "bg-[var(--color-gold)]"
                        }`}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>
      )}

      {/* ─── WHO FOR ────────────────────────────────────────────────── */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Para quién" : "Who this is for"}
            </Eyebrow>
            <h2 className="display-2 text-balance">{whoForHeading}</h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {program.whoForItems.map((item, idx) => (
            <article
              key={`${item.titleEs}-${idx}`}
              className="bg-[var(--color-paper)] p-7 md:p-9 hover:bg-[var(--color-paper-warm)] transition-colors min-h-[240px] flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="font-[family-name:var(--font-display)] text-2xl"
                  style={{ color: elementInfo?.accent ?? "var(--color-ink)" }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <Check
                  className="h-4 w-4"
                  strokeWidth={1.5}
                  style={{ color: elementInfo?.accent ?? "var(--color-ink)" }}
                />
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-xl tracking-tight mb-3">
                {locale === "es" ? item.titleEs : item.titleEn}
              </h3>
              <p className="text-[var(--color-ink-soft)] leading-relaxed text-sm">
                {locale === "es" ? item.bodyEs : item.bodyEn}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* ─── CLOSING NOTE (Source-specific) ─────────────────────────── */}
      {closingTitle && closingBody && (
        <Section spacing="default" tone="warm">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-2 lg:flex lg:justify-end">
              <Quote
                className="h-12 w-12 text-[var(--color-gold-deep)]/40"
                aria-hidden
              />
            </div>
            <div className="lg:col-span-10">
              <Eyebrow className="mb-6">{closingTitle}</Eyebrow>
              <p className="font-[family-name:var(--font-display)] text-[clamp(1.25rem,2vw,1.75rem)] leading-snug text-[var(--color-ink-soft)] max-w-3xl">
                {closingBody}
              </p>
            </div>
          </div>
        </Section>
      )}

      {/* ─── FINAL CTA ──────────────────────────────────────────────── */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <Eyebrow inverted className="mb-6">
              {locale === "es" ? "Siguiente paso" : "Next step"}
            </Eyebrow>
            {closingNote ? (
              <h2 className="display-2 text-[var(--color-paper)] text-balance">
                {closingNote}
              </h2>
            ) : (
              <h2 className="display-2 text-[var(--color-paper)] text-balance">
                {cta}
              </h2>
            )}
          </div>
          <div className="lg:col-span-4">
            <div className="space-y-3 mb-8">
              <a
                href="mailto:hello@elementsmethod.com"
                className="block text-[var(--color-paper)] hover:text-[var(--color-gold-soft)] transition-colors"
              >
                hello@elementsmethod.com
              </a>
              <a
                href="https://www.elementsmethod.com"
                className="block text-[var(--color-paper)]/90 hover:text-[var(--color-paper)] transition-colors text-sm"
              >
                www.elementsmethod.com
              </a>
            </div>

            {price && (
              <div className="mb-6">
                <div className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-paper)]/80 mb-1">
                  {locale === "es" ? "Inversión" : "Investment"}
                </div>
                <div className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-paper)] mb-4">
                  ${price.priceMxn.toLocaleString("es-MX")} MXN
                </div>
                <CheckoutButton
                  locale={locale}
                  pathSlug={price.productSlug}
                  productName={
                    locale === "es" ? program.nameEs : program.nameEn
                  }
                  amountMxn={price.priceMxn}
                  label={locale === "es" ? "Inscribirme y pagar" : "Enroll and pay"}
                  requiredDocs={requiredDocs.map((d) => ({
                    slug: d.slug,
                    nameEs: d.nameEs,
                    nameEn: d.nameEn,
                  }))}
                />
              </div>
            )}

            <Button
              href="mailto:hello@elementsmethod.com"
              size="lg"
              trailingArrow
              className={
                price
                  ? "bg-transparent border border-[var(--color-paper)]/40 text-[var(--color-paper)] hover:bg-[var(--color-paper)]/10 w-full"
                  : "bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)] w-full"
              }
            >
              {locale === "es"
                ? program.slug === "fuente" || program.slug === "soulfull"
                  ? "Solicitar discovery call"
                  : "Aplicar ahora"
                : program.slug === "fuente" || program.slug === "soulfull"
                  ? "Request discovery call"
                  : "Apply now"}
            </Button>
            <p className="mt-4 text-xs text-[var(--color-paper)]/80 leading-relaxed">
              {cta}
            </p>
          </div>
        </div>

        {/* Other programs nav */}
        <div className="mt-16 pt-8 border-t border-[var(--color-paper)]/15">
          <div className="eyebrow text-[var(--color-paper)]/80 mb-6">
            {locale === "es" ? "Otros programas" : "Other programs"}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programDetails
              .filter((p) => p.slug !== program.slug && p.slug !== "soulfull")
              .map((p) => (
                <Link
                  key={p.slug}
                  href={`/${locale}/${locale === "es" ? "los-caminos" : "paths"}/${p.slug}`}
                  className="group flex items-baseline justify-between gap-4 py-4 border-b border-[var(--color-paper)]/15 hover:border-[var(--color-paper)]/40 transition-colors"
                >
                  <span className="font-[family-name:var(--font-display)] text-xl text-[var(--color-paper)] group-hover:text-[var(--color-gold-soft)] transition-colors">
                    {locale === "es" ? p.nameEs : p.nameEn}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-[var(--color-paper)]/80 group-hover:text-[var(--color-paper)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </Link>
              ))}
          </div>
        </div>
      </Section>
    </>
  );
}
