import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Users,
  Droplets,
  Flame,
  Wind,
  Mountain,
  Sparkles,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { isLocale, type Locale } from "@/i18n/config";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
  calendarRetreats,
  findRetreatBySlug,
  sampleItinerary,
  contactInfo,
  type CalendarRetreat,
} from "@/data/launchData";
import { elements, type ElementKey } from "@/data/content";

const ICONS: Record<ElementKey, LucideIcon> = {
  agua: Droplets,
  fuego: Flame,
  aire: Wind,
  tierra: Mountain,
  eter: Sparkles,
};

const PHASE_LABEL: Record<
  string,
  { es: string; en: string; idx: string }
> = {
  liberacion: { es: "Liberación", en: "Release", idx: "01" },
  encuentro: { es: "Encuentro", en: "Encounter", idx: "02" },
  metodologia: { es: "Metodología", en: "Methodology", idx: "03" },
  reflexion: { es: "Reflexión", en: "Reflection", idx: "04" },
  dialogo: { es: "Diálogo", en: "Dialogue", idx: "05" },
  integracion: { es: "Integración", en: "Integration", idx: "06" },
};

export function generateStaticParams() {
  return calendarRetreats.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const r = findRetreatBySlug(slug);
  if (!r) return { title: "Retiro" };
  return {
    title:
      locale === "en" ? `${r.themeEn} — Elements Method` : `${r.themeEs} — Elements Method`,
    description: locale === "en" ? r.summaryEn : r.summaryEs,
  };
}

export default async function RetreatDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const retreat = findRetreatBySlug(slug);
  if (!retreat) notFound();
  const el = elements.find((e) => e.key === retreat.elementKey);
  const Icon = ICONS[retreat.elementKey];

  const localeKey = locale === "es" ? "Es" : "En";
  const otherRetreats = calendarRetreats
    .filter((r) => r.slug !== retreat.slug)
    .slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section
        className="relative min-h-[80vh] flex items-end overflow-hidden -mt-20 pt-20 text-[var(--color-paper)]"
        style={{
          background: `linear-gradient(135deg, ${el?.accentInk ?? "#2C2C2A"} 0%, var(--color-ink) 60%)`,
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
            <div className="lg:col-span-8">
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
                  {locale === "es" ? `Retiro ${String(retreat.orderIdx).padStart(2, "0")}` : `Retreat ${String(retreat.orderIdx).padStart(2, "0")}`}
                </span>
              </div>

              <div
                className="text-[0.7rem] tracking-[0.22em] uppercase font-medium mb-4"
                style={{ color: el?.accentSoft ?? "#C9A96E" }}
              >
                {locale === "es" ? retreat.dateLabelEs : retreat.dateLabelEn} ·{" "}
                {el ? (locale === "es" ? el.nameEs : el.nameEn) : ""}
              </div>

              <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[18ch]">
                {retreat[`theme${localeKey}`]}
              </h1>

              <p className="lead mt-8 max-w-2xl text-[var(--color-paper)]/95 text-pretty">
                {retreat[`summary${localeKey}`]}
              </p>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[var(--color-paper)]/8 backdrop-blur-sm border border-[var(--color-paper)]/15 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full"
                    style={{ background: el?.accentSoft }}
                  >
                    <Icon
                      className="h-5 w-5"
                      strokeWidth={1.5}
                      style={{ color: el?.accentInk }}
                    />
                  </span>
                  <span
                    className="text-xs uppercase tracking-[0.22em] font-medium"
                    style={{ color: el?.accentSoft ?? "#C9A96E" }}
                  >
                    {el?.framework}
                  </span>
                </div>
                <dl className="space-y-3 text-sm">
                  <Meta
                    label={locale === "es" ? "Fechas" : "Dates"}
                    value={retreat[`dateLabel${localeKey}`]}
                    icon={CalendarDays}
                  />
                  <Meta
                    label={locale === "es" ? "Sede" : "Venue"}
                    value={retreat[`venueLabel${localeKey}`]}
                    icon={MapPin}
                  />
                  <Meta
                    label={locale === "es" ? "Cupo" : "Capacity"}
                    value={`${retreat.seatsLeft} / ${retreat.capacity}`}
                    icon={Users}
                  />
                </dl>
                <div className="mt-6 pt-5 border-t border-[var(--color-paper)]/15">
                  <div className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-paper)]/80 mb-1">
                    {locale === "es" ? "Inversión" : "Investment"}
                  </div>
                  <div className="font-[family-name:var(--font-display)] text-lg text-[var(--color-paper)]">
                    {retreat[`investmentLabel${localeKey}`]}
                  </div>
                </div>
                <div className="mt-5 space-y-2">
                  <Button
                    href={`/${locale}/${locale === "es" ? "aplicar" : "apply"}?retreat=${retreat.slug}`}
                    size="sm"
                    variant="solidLight"
                    trailingArrow
                    className="w-full"
                  >
                    {locale === "es" ? "Aplicar ahora" : "Apply now"}
                  </Button>
                  <Button
                    href={contactInfo.whatsappLink}
                    size="sm"
                    variant="outlineLight"
                    className="w-full"
                  >
                    WhatsApp · {contactInfo.phoneDisplayMx}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ITINERARY */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 mb-14">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Itinerario base" : "Base itinerary"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Tres días. Seis fases. Un solo arco."
                : "Three days. Six phases. One single arc."}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-3 space-y-4">
            <p className="lead text-pretty">
              {locale === "es"
                ? "El itinerario sigue el Protocolo de Desconexión de seis fases. Las actividades específicas se adaptan al elemento dominante, la estación y la generación particular del retiro."
                : "The itinerary follows the six-phase Disconnection Protocol. Specific activities adapt to the dominant element, the season and the particular cohort of the retreat."}
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
              {locale === "es"
                ? "Bloques de horario indicativos · confirmación final 14 días antes."
                : "Indicative time blocks · final confirmation 14 days prior."}
            </p>
          </div>
        </div>

        <div className="space-y-10">
          {sampleItinerary.map((day) => {
            const dayEl = elements.find(
              (e) => e.key === day.blocks[0]?.elementKey,
            );
            return (
              <div
                key={day.dayNumber}
                className="border border-[var(--color-line)] bg-[var(--color-paper)]"
              >
                <div
                  className="grid lg:grid-cols-12 gap-8 p-6 md:p-8 border-b border-[var(--color-line)]"
                  style={{
                    background: dayEl?.accentSoft
                      ? `linear-gradient(90deg, ${dayEl.accentSoft} 0%, var(--color-paper-warm) 60%, var(--color-paper) 100%)`
                      : undefined,
                  }}
                >
                  <div className="lg:col-span-4">
                    <div
                      className="font-[family-name:var(--font-display)] text-5xl tabular-nums leading-none"
                      style={{ color: dayEl?.accentInk ?? "#2C2C2A" }}
                    >
                      Día {String(day.dayNumber).padStart(2, "0")}
                    </div>
                    <div className="mt-3 text-sm text-[var(--color-ink-soft)]">
                      {day[`dayLabel${localeKey}`]}
                    </div>
                  </div>
                  <div className="lg:col-span-8">
                    <p className="font-[family-name:var(--font-display)] text-xl md:text-2xl text-[var(--color-ink)] text-pretty leading-snug">
                      {day[`theme${localeKey}`]}
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-[var(--color-line)]">
                  {day.blocks.map((block) => {
                    const blockEl = elements.find(
                      (e) => e.key === block.elementKey,
                    );
                    const phase = PHASE_LABEL[block.phaseKey];
                    return (
                      <div
                        key={`${day.dayNumber}-${block.time}-${block.titleEn}`}
                        className="grid grid-cols-[100px_1fr] md:grid-cols-[120px_140px_1fr] gap-4 md:gap-6 p-5 md:p-6"
                      >
                        <div className="text-sm font-medium text-[var(--color-ink)] tabular-nums">
                          {block.time}
                        </div>
                        <div className="hidden md:block">
                          <div
                            className="text-[0.6rem] tracking-[0.22em] uppercase font-medium"
                            style={{ color: blockEl?.accentInk }}
                          >
                            {phase?.idx} · {phase?.[locale]}
                          </div>
                          <div className="text-[0.6rem] tracking-[0.22em] uppercase text-[var(--color-muted)] mt-1">
                            {blockEl
                              ? locale === "es"
                                ? blockEl.nameEs
                                : blockEl.nameEn
                              : ""}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-[family-name:var(--font-display)] text-lg mb-1.5">
                            {block[`title${localeKey}`]}
                          </h4>
                          <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                            {block[`body${localeKey}`]}
                          </p>
                          <div className="md:hidden mt-2 text-[0.6rem] tracking-[0.22em] uppercase text-[var(--color-muted)]">
                            {phase?.idx} · {phase?.[locale]}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* OTHER RETREATS */}
      <Section spacing="default" tone="warm">
        <div className="mb-10">
          <Eyebrow className="mb-4">
            {locale === "es" ? "Otros retiros del arco" : "Other retreats in the arc"}
          </Eyebrow>
          <h3 className="display-3 text-balance">
            {locale === "es"
              ? "Continúa el calendario."
              : "Continue the calendar."}
          </h3>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {otherRetreats.map((r) => {
            const e = elements.find((x) => x.key === r.elementKey);
            const OIcon = ICONS[r.elementKey];
            return (
              <Link
                key={r.slug}
                href={`/${locale}/${locale === "es" ? "retiros" : "retreats"}/${r.slug}`}
                className="group bg-[var(--color-paper)] p-6 md:p-7 hover:bg-[var(--color-paper-warm)] transition-colors"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="inline-flex items-center justify-center h-9 w-9 rounded-full"
                    style={{ background: e?.accentSoft }}
                  >
                    <OIcon
                      className="h-4 w-4"
                      strokeWidth={1.5}
                      style={{ color: e?.accentInk }}
                    />
                  </span>
                  <span
                    className="text-[0.6rem] tracking-[0.22em] uppercase font-medium"
                    style={{ color: e?.accentInk }}
                  >
                    {locale === "es" ? r.dateLabelEs : r.dateLabelEn}
                  </span>
                </div>
                <h4 className="font-[family-name:var(--font-display)] text-xl tracking-tight mb-2 group-hover:text-[var(--color-gold-deep)] transition-colors">
                  {r[`theme${localeKey}`]}
                </h4>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed line-clamp-3">
                  {r[`summary${localeKey}`]}
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs text-[var(--color-muted)]">
                  <ArrowUpRight
                    className="h-3.5 w-3.5 group-hover:text-[var(--color-gold-deep)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    strokeWidth={1.5}
                  />
                  {locale === "es" ? "Ver detalle" : "View details"}
                </div>
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
}

function Meta({
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
      <I className="h-4 w-4 text-[var(--color-paper)]/80 mt-0.5 shrink-0" strokeWidth={1.5} />
      <div className="min-w-0">
        <div className="text-[0.6rem] tracking-[0.22em] uppercase text-[var(--color-paper)]/80">
          {label}
        </div>
        <div className="text-[var(--color-paper)] mt-0.5">{value}</div>
      </div>
    </div>
  );
}
