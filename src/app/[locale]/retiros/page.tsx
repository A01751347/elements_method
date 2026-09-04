import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { elements } from "@/data/content";
import { calendarRetreats as staticCalendarRetreats } from "@/data/launchData";
import {
  findExperienceBySlug,
  isEarlyAccessActive,
  type L,
} from "@/data/experiences";
import { getCalendarRetreats } from "@/modules/content/calendarRetreats";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "Upcoming experiences" : "Próximas experiencias" };
}

const mxn = (n: number) => `$${n.toLocaleString("es-MX")} MXN`;

export default async function RetreatsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = (l: L) => (locale === "en" ? l.en : l.es);
  const localeKey = locale === "es" ? "Es" : "En";

  // DB first (admin-editable), static calendar as fallback.
  const dbRetreats = await getCalendarRetreats();
  const upcoming = dbRetreats.length > 0 ? dbRetreats : staticCalendarRetreats;

  const detailBase = `/${locale}/${locale === "es" ? "retiros" : "retreats"}`;

  const STATUS_LABEL: Record<string, string> = {
    open: dict.retreats.status.open,
    waitlist: locale === "es" ? "Lista de espera" : "Waitlist",
    closed: dict.retreats.status.closed,
    sold: dict.retreats.status.sold,
  };

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92svh] flex items-end overflow-hidden -mt-20 pt-32 md:pt-40 text-[var(--color-paper)]">
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

        <Container className="relative pb-12 md:pb-14">
          <div className="eyebrow text-[var(--color-paper)]/95 mb-6 flex items-center gap-3">
            <span aria-hidden className="h-px w-12 bg-[var(--color-paper)]/40" />
            {dict.retreats.eyebrow}
          </div>
          <h1 className="display-hero text-balance text-[var(--color-paper)]">
            {dict.retreats.title}
          </h1>
          <p className="lead mt-7 max-w-xl text-[var(--color-paper)]/95">
            {dict.retreats.lead}
          </p>
        </Container>
      </section>

      {/* UPCOMING EXECUTIVE EXPERIENCES — driven by the calendar (DB-first),
       *  enriched with the full landing data when the slug matches an
       *  experience from docs/productos. */}
      <Section spacing="default">
        <div className="mb-12">
          <Eyebrow className="mb-4 flex items-center gap-3">
            <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />
            {locale === "es" ? "Calendario 2026" : "2026 calendar"}
          </Eyebrow>
          <h2 className="display-2 text-balance">
            {locale === "es"
              ? "Tres experiencias. Tres fechas."
              : "Three experiences. Three dates."}
          </h2>
        </div>

        <div className="space-y-8">
          {upcoming.map((r) => {
            const exp = findExperienceBySlug(r.slug);
            const el = elements.find((x) => x.key === r.elementKey);
            const accentInk = el?.accentInk ?? "#2C2C2A";
            const accentSoft = el?.accentSoft ?? "#C9A96E";
            const earlyActive = exp ? isEarlyAccessActive(exp) : false;
            const status = STATUS_LABEL[r.status] ?? r.status;

            return (
              <article
                key={r.slug}
                className="border border-[var(--color-line)] bg-[var(--color-paper)] hover:bg-[var(--color-paper-warm)]/40 transition-colors"
              >
                <div
                  className="h-1.5 w-full"
                  style={{ background: accentSoft }}
                  aria-hidden
                />
                {exp && (
                  <div className="relative aspect-[21/9] md:aspect-[24/7] overflow-hidden bg-[var(--color-paper-warm)]">
                    <Image
                      src={exp.image}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 1100px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="grid lg:grid-cols-12 gap-8 p-7 md:p-10">
                  <div className="lg:col-span-7">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span
                        className="text-[0.7rem] tracking-[0.22em] uppercase font-medium"
                        style={{ color: accentInk }}
                      >
                        {r[`dateLabel${localeKey}`]}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[0.65rem] tracking-[0.18em] uppercase text-[var(--color-muted)]">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            background:
                              r.status === "open" ? "#4C7A4E" : "#A3A097",
                          }}
                        />
                        {status}
                      </span>
                    </div>

                    <h3 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-tight mb-2">
                      {exp ? exp.title : r[`theme${localeKey}`]}
                    </h3>
                    {exp && (
                      <p
                        className="font-[family-name:var(--font-display)] text-lg mb-4"
                        style={{ color: accentInk }}
                      >
                        {t(exp.tagline)}
                      </p>
                    )}
                    <p className="text-[var(--color-ink-soft)] leading-relaxed max-w-2xl">
                      {r[`summary${localeKey}`]}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-sm">
                      <ListingMeta
                        icon={MapPin}
                        label={locale === "es" ? "Lugar" : "Venue"}
                        value={r[`venueLabel${localeKey}`]}
                      />
                      {exp && (
                        <ListingMeta
                          icon={Clock}
                          label={locale === "es" ? "Duración" : "Duration"}
                          value={t(exp.duration)}
                        />
                      )}
                      <ListingMeta
                        icon={Users}
                        label={locale === "es" ? "Modalidad" : "Format"}
                        value={
                          exp
                            ? t(exp.modality)
                            : locale === "es"
                              ? "Presencial"
                              : "In person"
                        }
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex flex-col justify-between gap-6 lg:border-l lg:border-[var(--color-line)] lg:pl-8">
                    <div>
                      <div className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-muted)] mb-2">
                        {locale === "es" ? "Inversión" : "Investment"}
                      </div>
                      {exp && exp.priceMxn != null ? (
                        earlyActive && exp.earlyPriceMxn != null ? (
                          <>
                            <div className="flex items-baseline gap-3">
                              <span className="font-[family-name:var(--font-display)] text-3xl">
                                {mxn(exp.earlyPriceMxn)}
                              </span>
                              <span className="text-sm text-[var(--color-muted)] line-through">
                                {mxn(exp.priceMxn)}
                              </span>
                            </div>
                            {exp.earlyLabel && (
                              <div
                                className="mt-1 text-[0.7rem] tracking-[0.14em] uppercase font-medium"
                                style={{ color: accentInk }}
                              >
                                {t(exp.earlyLabel)}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="font-[family-name:var(--font-display)] text-3xl">
                            {mxn(exp.priceMxn)}
                          </div>
                        )
                      ) : (
                        <div className="font-[family-name:var(--font-display)] text-xl">
                          {r[`investmentLabel${localeKey}`]}
                        </div>
                      )}
                      {exp && (
                        <p className="mt-3 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                          {locale === "es" ? "Incluye: " : "Includes: "}
                          {t(exp.includes)}
                        </p>
                      )}
                    </div>

                    <div>
                      <Button
                        href={`${detailBase}/${r.slug}`}
                        size="sm"
                        variant="primary"
                        trailingArrow
                        className="w-full"
                      >
                        {exp
                          ? exp.ctaMode === "checkout"
                            ? locale === "es"
                              ? "Ver experiencia y reservar"
                              : "View experience & reserve"
                            : locale === "es"
                              ? "Ver experiencia y aplicar"
                              : "View experience & apply"
                          : locale === "es"
                            ? "Ver detalle"
                            : "View details"}
                      </Button>
                      <p className="pt-2 text-center text-[0.7rem] text-[var(--color-muted)]">
                        {locale === "es"
                          ? "Cupo limitado para preservar una experiencia íntima."
                          : "Limited seats to preserve an intimate experience."}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* THE METHOD BEHIND */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6">
              {locale === "es" ? "El método detrás" : "The method behind"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Una misma arquitectura elemental."
                : "One same elemental architecture."}
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Cada experiencia está construida sobre Elements Method: los cuatro elementos como dimensiones naturales del ser y su integración en el núcleo — la persona misma. Contenido, entorno y ritmo forman parte de una sola narrativa."
                : "Every experience is built on Elements Method: the four elements as natural dimensions of being and their integration into the core — the person themselves. Content, environment and rhythm are part of a single narrative."}
            </p>
            <Link
              href={`/${locale}/${locale === "es" ? "el-metodo" : "method"}`}
              className="group mt-6 inline-flex items-center gap-2 text-sm text-[var(--color-ink)] border-b border-[var(--color-ink)]/30 pb-1 hover:border-[var(--color-ink)] transition-colors"
            >
              {locale === "es"
                ? "Conocer el método a fondo"
                : "Explore the method in depth"}
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Eyebrow inverted className="mb-6">
              {locale === "es" ? "¿Cuál es para ti?" : "Which one is for you?"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)] text-balance">
              {locale === "es"
                ? "Una pausa diseñada para quienes lideran."
                : "A pause designed for those who lead."}
            </h2>
            <p className="lead mt-6 text-[var(--color-paper)]/90 text-pretty max-w-2xl">
              {locale === "es"
                ? "Si dudas entre EQUINOX, Elements Awakening o SOUL Discovery, escríbenos y te orientamos según tu momento. También diseñamos experiencias a la medida para equipos y organizaciones."
                : "If you're deciding between EQUINOX, Elements Awakening or SOUL Discovery, write to us and we'll help you choose for your moment. We also design bespoke experiences for teams and organizations."}
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="space-y-3">
              <Button
                href={`/${locale}/${locale === "es" ? "el-metodo" : "method"}`}
                size="lg"
                trailingArrow
                className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)] w-full"
              >
                {locale === "es" ? "Comparar experiencias" : "Compare experiences"}
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

function ListingMeta({
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
