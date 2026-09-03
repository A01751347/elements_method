"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Droplets,
  Flame,
  Wind,
  Mountain,
  Atom,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import type { ElementKey } from "@/data/content";
import {
  experiences as staticExperiences,
  isEarlyAccessActive,
  type Experience,
  type L,
} from "@/data/experiences";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const ELEMENT_ICONS: Record<ElementKey, LucideIcon> = {
  agua: Droplets,
  fuego: Flame,
  aire: Wind,
  tierra: Mountain,
  eter: Atom,
};

const mxn = (n: number) => `$${n.toLocaleString("es-MX")} MXN`;

/**
 * Executive Experiences preview — the three real 2026 experiences
 * (EQUINOX · ELEMENTS AWAKENING · SOUL Discovery). Replaces the legacy
 * five-"caminos" preview: those programs no longer exist. Cards link to the
 * landing at /retiros/[slug], which is where the checkout lives.
 */
export function ExperiencesPreview({
  locale,
  dict,
  experiences: experiencesProp,
}: {
  locale: Locale;
  dict: Dict;
  experiences?: Experience[];
}) {
  const list =
    experiencesProp && experiencesProp.length > 0
      ? experiencesProp
      : staticExperiences;
  const [hovered, setHovered] = React.useState<number | null>(null);
  const t = (l: L) => (locale === "en" ? l.en : l.es);
  const detailBase = `/${locale}/${locale === "es" ? "retiros" : "retreats"}`;

  return (
    <section className="py-24 md:py-36 bg-[var(--color-paper-warm)] paper-grain relative">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6">{dict.paths.eyebrow}</Eyebrow>
            <h2 className="display-2 text-balance">{dict.paths.title}</h2>
          </div>
          <div className="lg:col-span-5">
            <p className="lead text-pretty">{dict.paths.lead}</p>
          </div>
        </div>

        <div
          className="grid md:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)]"
          onMouseLeave={() => setHovered(null)}
        >
          {list.map((e, idx) => {
            const Icon = ELEMENT_ICONS[e.elementKey] ?? Atom;
            const earlyActive = isEarlyAccessActive(e);
            const isHovered = hovered === idx;
            const isDim = hovered !== null && hovered !== idx;

            return (
              <motion.article
                key={e.slug}
                onMouseEnter={() => setHovered(idx)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                animate={{ opacity: isDim ? 0.4 : 1 }}
                className={cn(
                  "group bg-[var(--color-paper)] p-8 md:p-10 flex flex-col justify-between min-h-[560px] transition-colors duration-500",
                  isHovered && "bg-[var(--color-ink)] text-[var(--color-paper)]",
                )}
              >
                <div>
                  <div className="flex items-start justify-between mb-10">
                    <span
                      className={cn(
                        "font-[family-name:var(--font-display)] text-5xl transition-colors",
                        isHovered ? "text-[var(--color-paper)]/30" : "text-[var(--color-ink)]/15",
                      )}
                    >
                      0{idx + 1}
                    </span>
                    <Icon
                      className={cn(
                        "h-6 w-6 transition-colors",
                        isHovered ? "text-[var(--color-paper)]" : "text-[var(--color-moss-700)]",
                      )}
                      strokeWidth={1.5}
                    />
                  </div>

                  <h3
                    className={cn(
                      "font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-tight mb-3",
                      isHovered ? "text-[var(--color-paper)]" : "text-[var(--color-ink)]",
                    )}
                  >
                    {e.title}
                  </h3>
                  <p
                    className={cn(
                      "italic mb-8 text-pretty",
                      isHovered ? "text-[var(--color-paper)]/90" : "text-[var(--color-ink-soft)]",
                    )}
                  >
                    {t(e.tagline)}
                  </p>

                  <ul className="space-y-2.5">
                    <Fact icon={CalendarDays} text={t(e.dateLabel)} isHovered={isHovered} />
                    <Fact icon={Clock} text={t(e.duration)} isHovered={isHovered} />
                    <Fact icon={MapPin} text={t(e.location)} isHovered={isHovered} />
                    <Fact
                      icon={Users}
                      text={
                        e.ctaMode === "checkout"
                          ? locale === "es"
                            ? `${e.seats} lugares · compra directa`
                            : `${e.seats} seats · direct purchase`
                          : locale === "es"
                            ? `${e.seats} lugares · por invitación`
                            : `${e.seats} seats · by invitation`
                      }
                      isHovered={isHovered}
                    />
                  </ul>

                  <p
                    className={cn(
                      "mt-6 text-sm leading-relaxed",
                      isHovered ? "text-[var(--color-paper)]/90" : "text-[var(--color-ink-soft)]",
                    )}
                  >
                    {t(e.lead)}
                  </p>
                </div>

                <div
                  className={cn(
                    "mt-10 pt-6 border-t transition-colors flex items-end justify-between gap-4",
                    isHovered ? "border-[var(--color-paper)]/20" : "border-[var(--color-line)]",
                  )}
                >
                  <div>
                    <div
                      className={cn(
                        "text-[0.65rem] uppercase tracking-wide mb-1",
                        isHovered ? "text-[var(--color-paper)]/85" : "text-[var(--color-muted)]",
                      )}
                    >
                      {locale === "es" ? "Inversión" : "Investment"}
                    </div>
                    {e.priceMxn == null ? (
                      <div className="font-[family-name:var(--font-display)] text-xl italic text-[var(--color-muted)]">
                        {locale === "es" ? "Por confirmar" : "To be confirmed"}
                      </div>
                    ) : earlyActive && e.earlyPriceMxn != null ? (
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-[family-name:var(--font-display)] text-xl">
                          {mxn(e.earlyPriceMxn)}
                        </span>
                        <span
                          className={cn(
                            "text-xs line-through",
                            isHovered ? "text-[var(--color-paper)]/60" : "text-[var(--color-muted)]",
                          )}
                        >
                          {mxn(e.priceMxn)}
                        </span>
                      </div>
                    ) : (
                      <div className="font-[family-name:var(--font-display)] text-xl">
                        {mxn(e.priceMxn)}
                      </div>
                    )}
                  </div>

                  <Link
                    href={`${detailBase}/${e.slug}`}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-sm border-b pb-0.5 transition-colors shrink-0",
                      isHovered
                        ? "text-[var(--color-paper)] border-[var(--color-paper)]/50 hover:border-[var(--color-paper)]"
                        : "text-[var(--color-ink)] border-[var(--color-ink)]/30 hover:border-[var(--color-ink)]",
                    )}
                  >
                    {e.ctaMode === "checkout"
                      ? locale === "es"
                        ? "Reservar"
                        : "Reserve"
                      : locale === "es"
                        ? "Aplicar"
                        : "Apply"}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            href={`/${locale}/${locale === "es" ? "retiros" : "retreats"}`}
            variant="secondary"
            trailingArrow
          >
            {locale === "es" ? "Ver el calendario completo" : "See the full calendar"}
          </Button>
        </div>
      </Container>
    </section>
  );
}

function Fact({
  icon: I,
  text,
  isHovered,
}: {
  icon: LucideIcon;
  text: string;
  isHovered: boolean;
}) {
  return (
    <li
      className={cn(
        "flex items-start gap-2 text-sm leading-relaxed transition-colors",
        isHovered ? "text-[var(--color-paper)]/95" : "text-[var(--color-ink-soft)]",
      )}
    >
      <I
        className={cn(
          "h-4 w-4 mt-0.5 shrink-0",
          isHovered ? "text-[var(--color-paper-warm)]" : "text-[var(--color-moss-500)]",
        )}
        strokeWidth={1.5}
      />
      <span>{text}</span>
    </li>
  );
}
