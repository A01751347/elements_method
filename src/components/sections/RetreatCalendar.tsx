"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  CalendarDays,
  MapPin,
  Users,
  ArrowUpRight,
  Droplets,
  Flame,
  Wind,
  Mountain,
  Sparkles,
  Atom,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import { Section, Eyebrow } from "@/components/ui/Section";
import { calendarRetreats as staticCalendarRetreats, type CalendarRetreat } from "@/data/launchData";
import { elements, type ElementKey } from "@/data/content";

const ICONS: Record<ElementKey, LucideIcon> = {
  agua: Droplets,
  fuego: Flame,
  aire: Wind,
  tierra: Mountain,
  eter: Atom, // legacy `eter` key = the Núcleo
};

const STATUS_LABEL: Record<
  CalendarRetreat["status"],
  { es: string; en: string; dotClass: string }
> = {
  open: {
    es: "Aplicaciones abiertas",
    en: "Applications open",
    dotClass: "bg-emerald-500",
  },
  waitlist: {
    es: "Lista de espera",
    en: "Waitlist",
    dotClass: "bg-amber-500",
  },
  closed: { es: "Cerrado", en: "Closed", dotClass: "bg-zinc-400" },
  sold: { es: "Sin cupo", en: "Sold out", dotClass: "bg-zinc-500" },
};

const VENUE_STATE_LABEL: Record<
  CalendarRetreat["venueState"],
  { es: string; en: string }
> = {
  confirmed: { es: "Sede confirmada", en: "Venue confirmed" },
  tentative: { es: "Sede tentativa", en: "Tentative venue" },
  tbd: { es: "Sede por confirmar", en: "Venue TBD" },
};

export function RetreatCalendar({
  locale,
  retreats,
}: {
  locale: Locale;
  retreats?: CalendarRetreat[];
}) {
  const calendarRetreats =
    retreats && retreats.length > 0 ? retreats : staticCalendarRetreats;
  return (
    <Section spacing="default" tone="warm" className="paper-grain">
      <div className="grid lg:grid-cols-12 gap-12 mb-12">
        <div className="lg:col-span-6">
          <Eyebrow className="mb-6 flex items-center gap-3">
            <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />
            {locale === "es" ? "Calendario 2026-2027" : "2026-2027 Calendar"}
          </Eyebrow>
          <h2 className="display-2 text-balance">
            {locale === "es"
              ? "Nueve inmersiones. Un arco de dos años."
              : "Nine immersions. A two-year arc."}
          </h2>
        </div>
        <div className="lg:col-span-6 lg:pt-3 space-y-4">
          <p className="lead text-pretty">
            {locale === "es"
              ? "Cada retiro se ancla en un elemento, una temporada y una pregunta del año. Comenzamos en octubre de 2026 con el aterrizaje del último trimestre."
              : "Each retreat is anchored in an element, a season and a question of the year. We begin in October 2026 with the landing of the final quarter."}
          </p>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            {locale === "es"
              ? "Las sedes se confirman 60 días antes del retiro."
              : "Venues are confirmed 60 days before each retreat."}
          </p>
        </div>
      </div>

      <div className="border border-[var(--color-line)] divide-y divide-[var(--color-line)] bg-[var(--color-paper)]">
        {calendarRetreats.map((r, idx) => {
          const el = elements.find((e) => e.key === r.elementKey);
          const Icon = ICONS[r.elementKey];
          const status = STATUS_LABEL[r.status];
          const venueState = VENUE_STATE_LABEL[r.venueState];
          const localeKey = locale === "es" ? "Es" : "En";
          return (
            <motion.div
              key={r.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.04 }}
            >
              <Link
                href={`/${locale}/${locale === "es" ? "retiros" : "retreats"}/${r.slug}`}
                className="group block hover:bg-[var(--color-paper-warm)] transition-colors duration-300"
              >
                <div className="grid grid-cols-[60px_1fr_auto] md:grid-cols-[80px_60px_1.5fr_1.5fr_auto] gap-4 md:gap-6 p-5 md:p-7 items-start">
                  <span className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-[var(--color-muted)]/50 tabular-nums">
                    {String(r.orderIdx).padStart(2, "0")}
                  </span>

                  <span
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full"
                    style={{ background: el?.accentSoft ?? "#e7e1d4" }}
                  >
                    <Icon
                      className="h-4 w-4"
                      strokeWidth={1.5}
                      style={{ color: el?.accentInk }}
                    />
                  </span>

                  <div className="col-span-2 md:col-span-1 min-w-0">
                    <div
                      className="text-[0.65rem] tracking-[0.22em] uppercase font-medium mb-2"
                      style={{ color: el?.accentInk }}
                    >
                      {locale === "es" ? r.dateLabelEs : r.dateLabelEn}
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] text-xl md:text-2xl tracking-tight text-[var(--color-ink)] group-hover:text-[var(--color-gold-deep)] transition-colors">
                      {r[`theme${localeKey}`]}
                    </h3>
                    <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mt-3 max-w-prose">
                      {r[`summary${localeKey}`]}
                    </p>
                  </div>

                  <div className="hidden md:flex flex-col gap-3 text-sm">
                    <div className="flex items-start gap-2 text-[var(--color-muted)]">
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={1.5} />
                      <div>
                        <div className="text-[0.6rem] tracking-[0.22em] uppercase">
                          {venueState[locale]}
                        </div>
                        <div className="text-[var(--color-ink-soft)]">
                          {r[`venueLabel${localeKey}`]}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-[var(--color-muted)]">
                      <Users className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={1.5} />
                      <div>
                        <div className="text-[0.6rem] tracking-[0.22em] uppercase">
                          {locale === "es" ? "Cupo" : "Capacity"}
                        </div>
                        <div className="text-[var(--color-ink-soft)]">
                          {r.seatsLeft} / {r.capacity}{" "}
                          <span className="text-[var(--color-muted)]">
                            ({locale === "es" ? "disponibles" : "left"})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`}
                      />
                      <span className="text-[var(--color-ink-soft)]">
                        {status[locale]}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--color-muted)] tabular-nums">
                      {r[`investmentLabel${localeKey}`]}
                    </div>
                    <ArrowUpRight
                      className="h-4 w-4 text-[var(--color-muted)] group-hover:text-[var(--color-gold-deep)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Mobile-only status/venue rail */}
                  <div className="md:hidden col-span-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--color-ink-soft)] pt-1">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`}
                      />
                      {status[locale]}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" strokeWidth={1.5} />
                      {r[`venueLabel${localeKey}`]}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3 w-3" strokeWidth={1.5} />
                      {r.seatsLeft}/{r.capacity}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
