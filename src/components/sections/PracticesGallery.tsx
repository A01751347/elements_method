"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  Waves,
  Flame,
  Wind,
  Mountain,
  Sun,
  Moon,
  Footprints,
  Leaf,
  Snowflake,
  Sparkles,
  Eye,
  MessageCircle,
  PenLine,
  Trees,
  Cloud,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import { practices, type PracticeInfo, type ElementKey } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";

const ICONS = {
  Waves,
  Flame,
  Wind,
  Mountain,
  Sun,
  Moon,
  Footprints,
  Leaf,
  Snowflake,
  Sparkles,
  Eye,
  MessageCircle,
  PenLine,
  Trees,
  Cloud,
};

const ELEMENT_COLOR: Record<ElementKey, string> = {
  agua: "var(--color-water)",
  fuego: "var(--color-fire)",
  aire: "var(--color-air)",
  tierra: "var(--color-earth)",
};

const ELEMENT_LABEL: Record<ElementKey, { es: string; en: string }> = {
  agua: { es: "Agua · FLOW", en: "Water · FLOW" },
  fuego: { es: "Fuego · IGNITE", en: "Fire · IGNITE" },
  aire: { es: "Aire · CLEAR", en: "Air · CLEAR" },
  tierra: { es: "Tierra · ROOTS", en: "Earth · ROOTS" },
};

/**
 * Practices gallery — editorial index style.
 * Replaces the previous grid-of-cards with a long-form numbered list, each
 * exercise rendered as an indexed entry. Differentiates visually from
 * ProcessSteps (5 horizontal cards) and ImpactCircles (concentric stack).
 */
export function PracticesGallery({ locale }: { locale: Locale }) {
  return (
    <section className="py-24 md:py-36 bg-[var(--color-paper-warm)] paper-grain relative overflow-hidden">
      {/* Decorative side number */}
      <div
        aria-hidden
        className="absolute -top-8 -right-8 md:-right-16 pointer-events-none select-none opacity-[0.04] font-[family-name:var(--font-display)] text-[22rem] leading-none font-light"
      >
        08
      </div>

      <Container className="relative">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16 md:mb-24">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Ejercicios documentados" : "Documented exercises"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Ocho prácticas con protocolo, entorno y duración."
                : "Eight practices with protocol, environment and duration."}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Cada ejercicio ha sido probado en el campo y documentado. Su efecto no depende del facilitador — depende de la secuencia."
                : "Each exercise has been field-tested and documented. Its effect doesn't depend on the facilitator — it depends on the sequence."}
            </p>
          </div>
        </div>

        {/* Editorial index */}
        <div className="border-y-2 border-[var(--color-ink)]/20">
          {practices.map((p, idx) => (
            <PracticeRow key={p.titleEs} p={p} locale={locale} idx={idx} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function PracticeRow({
  p,
  locale,
  idx,
}: {
  p: PracticeInfo;
  locale: Locale;
  idx: number;
}) {
  const Icon = ICONS[p.iconName];
  const color = ELEMENT_COLOR[p.element];
  const elementLabel = ELEMENT_LABEL[p.element][locale];

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (idx % 4) * 0.05 }}
      className="group border-b border-[var(--color-line)] last:border-b-0 hover:bg-[var(--color-paper)] transition-colors duration-500"
    >
      <div className="grid grid-cols-[60px_1fr] md:grid-cols-[100px_minmax(280px,1fr)_2fr_140px] gap-x-6 md:gap-x-10 gap-y-3 py-8 md:py-10 px-2 md:px-4 items-baseline">
        {/* Index number */}
        <div className="font-[family-name:var(--font-display)] text-4xl md:text-6xl text-[var(--color-ink)]/15 group-hover:text-[var(--color-ink)]/35 transition-colors tabular-nums">
          {String(idx + 1).padStart(2, "0")}
        </div>

        {/* Title block with element tag + icon */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <Icon className="h-4 w-4" strokeWidth={1.5} style={{ color }} />
            <span
              className="text-[0.65rem] tracking-[0.22em] uppercase font-medium"
              style={{ color }}
            >
              {elementLabel}
            </span>
          </div>
          <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-[2rem] leading-tight tracking-tight">
            {locale === "es" ? p.titleEs : p.titleEn}
          </h3>
        </div>

        {/* Body — column 3 */}
        <p className="text-[var(--color-ink-soft)] leading-relaxed text-sm md:text-[0.95rem] col-span-2 md:col-span-1 max-w-2xl">
          {locale === "es" ? p.bodyEs : p.bodyEn}
        </p>

        {/* Duration — column 4 */}
        <div className="text-right col-span-2 md:col-span-1">
          <div className="text-[0.62rem] tracking-[0.22em] uppercase text-[var(--color-muted)] mb-1">
            {locale === "es" ? "Protocolo" : "Protocol"}
          </div>
          <div className="font-[family-name:var(--font-display)] text-base tabular-nums text-[var(--color-ink)]">
            {locale === "es" ? p.durationEs : p.durationEn}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
