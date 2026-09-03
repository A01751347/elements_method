import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { originProgram as staticOriginProgram, elements } from "@/data/content";
import { experiences, isEarlyAccessActive, type L } from "@/data/experiences";
import { getOriginProgram } from "@/modules/content/siteSections";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "Experiences" : "Experiencias" };
}

const mxn = (n: number) => `$${n.toLocaleString("es-MX")} MXN`;

export default async function PathsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = (l: L) => (locale === "en" ? l.en : l.es);

  const dbOriginProgram = await getOriginProgram();
  const originProgram =
    dbOriginProgram.nameEs || dbOriginProgram.nameEn
      ? dbOriginProgram
      : staticOriginProgram;

  const detailBase = `/${locale}/${locale === "es" ? "retiros" : "retreats"}`;

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
          <div className="eyebrow text-[var(--color-paper)]/95 mb-8 flex items-center gap-3">
            <span aria-hidden className="h-px w-12 bg-[var(--color-paper)]/40" />
            {dict.paths.eyebrow}
          </div>
          <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[15ch]">
            {dict.paths.title}
          </h1>
          <p className="lead mt-8 max-w-2xl text-[var(--color-paper)]/95">
            {dict.paths.lead}
          </p>
        </Container>
      </section>

      {/* EXECUTIVE EXPERIENCES — fuente: docs/productos (mismo contenido que
       *  las landings /retiros/[slug], que es donde vive el checkout). */}
      <Section spacing="default" contained={false}>
        <div className="border-t border-[var(--color-line)]">
          {experiences.map((e, idx) => {
            const el = elements.find((x) => x.key === e.elementKey);
            const accentInk = el?.accentInk ?? "#2C2C2A";
            const earlyActive = isEarlyAccessActive(e);
            const detailHref = `${detailBase}/${e.slug}`;

            return (
              <div
                key={e.slug}
                className="border-b border-[var(--color-line)] group hover:bg-[var(--color-paper-warm)]/40 transition-colors"
              >
                <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20 grid lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-2 flex lg:flex-col items-start gap-4">
                    <span className="font-[family-name:var(--font-display)] text-5xl lg:text-6xl text-[var(--color-ink)]/15 group-hover:text-[var(--color-gold-deep)]/60 transition-colors">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="lg:col-span-6">
                    <div className="eyebrow text-[var(--color-muted)] mb-3">
                      {t(e.brand)}
                    </div>
                    <h2 className="display-2 mb-3">{e.title}</h2>
                    <p className="text-[var(--color-ink-soft)] text-lg italic mb-4">
                      {t(e.tagline)}
                    </p>
                    <p className="text-[var(--color-ink-soft)] leading-relaxed max-w-xl mb-6">
                      {t(e.lead)}
                    </p>
                    {e.about.paragraphs?.[0] && (
                      <p className="text-[var(--color-ink-soft)] leading-relaxed max-w-xl">
                        {t(e.about.paragraphs[0])}
                      </p>
                    )}

                    <div className="mt-10 flex flex-wrap gap-6 text-sm">
                      <Meta
                        icon={CalendarDays}
                        label={locale === "es" ? "Fecha" : "Date"}
                        value={t(e.dateLabel)}
                      />
                      <Meta
                        icon={Clock}
                        label={locale === "es" ? "Duración" : "Duration"}
                        value={t(e.duration)}
                      />
                      <Meta
                        icon={MapPin}
                        label={locale === "es" ? "Lugar" : "Venue"}
                        value={t(e.location)}
                      />
                      <Meta
                        icon={Users}
                        label={locale === "es" ? "Modalidad" : "Format"}
                        value={t(e.modality)}
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="bg-[var(--color-paper)] border border-[var(--color-line)] p-8">
                      <div className="eyebrow text-[var(--color-muted)] mb-5">
                        {locale === "es" ? "Incluye" : "Includes"}
                      </div>
                      <p className="flex items-start gap-2.5 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                        <Check className="h-4 w-4 mt-0.5 text-[var(--color-gold-deep)] shrink-0" />
                        <span>{t(e.includes)}</span>
                      </p>

                      <div className="mt-8 pt-6 border-t border-[var(--color-line)]">
                        <div className="text-xs text-[var(--color-muted)] uppercase tracking-wide">
                          {locale === "es" ? "Inversión" : "Investment"}
                        </div>
                        {e.priceMxn == null ? (
                          <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                            {locale === "es"
                              ? "Por confirmar · acceso por invitación mediante aplicación."
                              : "To be confirmed · access by invitation via application."}
                          </p>
                        ) : (
                          <div className="mt-2">
                            {earlyActive && e.earlyPriceMxn != null ? (
                              <>
                                <div className="flex items-baseline gap-3">
                                  <span className="font-[family-name:var(--font-display)] text-2xl">
                                    {mxn(e.earlyPriceMxn)}
                                  </span>
                                  <span className="text-sm text-[var(--color-muted)] line-through">
                                    {mxn(e.priceMxn)}
                                  </span>
                                </div>
                                {e.earlyLabel && (
                                  <div
                                    className="mt-1 text-[0.7rem] tracking-[0.14em] uppercase font-medium"
                                    style={{ color: accentInk }}
                                  >
                                    {t(e.earlyLabel)}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="font-[family-name:var(--font-display)] text-2xl">
                                {mxn(e.priceMxn)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mt-6 space-y-2">
                        <Button
                          href={detailHref}
                          size="sm"
                          variant="primary"
                          trailingArrow
                          className="w-full"
                        >
                          {e.ctaMode === "checkout"
                            ? locale === "es"
                              ? "Ver experiencia y reservar"
                              : "View experience & reserve"
                            : locale === "es"
                              ? "Ver experiencia y aplicar"
                              : "View experience & apply"}
                        </Button>
                        <p className="pt-1 text-center text-[0.7rem] text-[var(--color-muted)]">
                          {locale === "es"
                            ? "Cupo limitado para preservar una experiencia íntima."
                            : "Limited seats to preserve an intimate experience."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* THE METHOD BEHIND — the elements get explained in full on /el-metodo
       *  (client feedback #58 #59). */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6">
              {locale === "es" ? "El método detrás" : "The method behind"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Cuatro elementos. Un núcleo: tú."
                : "Four elements. One core: you."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-3">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Cada experiencia está construida sobre Elements Method: los cuatro elementos —Tierra, Agua, Fuego y Aire— como dimensiones naturales del ser, y la integración de todos ellos en el núcleo, que es la persona misma. Lo que cambia entre experiencias es el formato, la profundidad y el enfoque."
                : "Every experience is built on Elements Method: the four elements —Earth, Water, Fire and Air— as natural dimensions of being, and the integration of them all into the core, which is the person themselves. What changes between experiences is the format, the depth and the focus."}
            </p>
            <Link
              href={`/${locale}/${locale === "es" ? "el-metodo" : "method"}`}
              className="group mt-6 inline-flex items-center gap-2 text-sm text-[var(--color-ink)] border-b border-[var(--color-ink)]/30 pb-1 hover:border-[var(--color-ink)] transition-colors"
            >
              {locale === "es"
                ? "Conocer los elementos y el método a fondo"
                : "Explore the elements and the method in depth"}
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </Section>

      {/* BESPOKE — the same method, designed around a team */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <Eyebrow inverted className="mb-6">
              {locale === "es" ? "Para líderes y organizaciones" : "For leaders and organizations"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)] text-balance mb-3">
              {locale === "es" ? originProgram.nameEs : originProgram.nameEn}
            </h2>
            <p className="text-lg text-[var(--color-gold-soft)] italic mb-6">
              {locale === "es" ? originProgram.tagEs : originProgram.tagEn}
            </p>
            <p className="text-lg text-[var(--color-paper)]/90 leading-relaxed text-pretty max-w-2xl">
              {locale === "es" ? originProgram.bodyEs : originProgram.bodyEn}
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="space-y-3">
              <a
                href="mailto:hello@elementsmethod.com"
                className="block text-[var(--color-paper)] hover:text-[var(--color-gold-soft)] transition-colors text-lg"
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
            <div className="mt-8">
              <Button
                href="mailto:hello@elementsmethod.com"
                size="lg"
                trailingArrow
                className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)] w-full"
              >
                {locale === "es" ? originProgram.ctaEs : originProgram.ctaEn}
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function Meta({
  icon: I,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <I className="h-4 w-4 mt-0.5 text-[var(--color-muted)]" strokeWidth={1.5} />
      <div>
        <div className="text-xs text-[var(--color-muted)] uppercase tracking-wide">
          {label}
        </div>
        <div className="mt-1 text-[var(--color-ink)]">{value}</div>
      </div>
    </div>
  );
}
