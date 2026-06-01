"use client";

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
  Clock,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import { practices, type PracticeInfo, type ElementKey } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const ICONS = { Waves, Flame, Wind, Mountain, Sun, Moon, Footprints, Leaf, Snowflake, Sparkles };

const ELEMENT_COLORS: Record<ElementKey, string> = {
  agua: "var(--color-water)",
  fuego: "var(--color-fire)",
  aire: "var(--color-air)",
  tierra: "var(--color-earth)",
};

const ELEMENT_SOFT: Record<ElementKey, string> = {
  agua: "var(--color-water-soft)",
  fuego: "var(--color-fire-soft)",
  aire: "var(--color-air-soft)",
  tierra: "var(--color-earth-soft)",
};

export function PracticesGallery({ locale }: { locale: Locale }) {
  return (
    <section className="py-24 md:py-36 bg-[var(--color-paper-warm)] paper-grain relative overflow-hidden">
      {/* Decorative leaf glyphs */}
      <Leaf
        aria-hidden
        className="absolute top-20 right-10 h-32 w-32 text-[var(--color-moss-700)]/5 -rotate-12 pointer-events-none"
        strokeWidth={1}
      />
      <Sparkles
        aria-hidden
        className="absolute bottom-32 left-8 h-24 w-24 text-[var(--color-fire)]/5 rotate-12 pointer-events-none"
        strokeWidth={1}
      />

      <Container className="relative">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Prácticas y rituales" : "Practices & rituals"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Lo que sucede entre amaneceres."
                : "What happens between sunrises."}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Ocho prácticas que viven dentro de cada inmersión. Probadas, secuenciadas, dosificadas por elemento."
                : "Eight practices that live within each immersion. Tested, sequenced, dosed by element."}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {practices.map((p, idx) => (
            <PracticeCard key={p.titleEs} p={p} locale={locale} idx={idx} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function PracticeCard({
  p,
  locale,
  idx,
}: {
  p: PracticeInfo;
  locale: Locale;
  idx: number;
}) {
  const Icon = ICONS[p.iconName];
  const color = ELEMENT_COLORS[p.element];
  const soft = ELEMENT_SOFT[p.element];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (idx % 4) * 0.06 }}
      className="group relative bg-[var(--color-paper-warm)] p-7 md:p-8 min-h-[280px] flex flex-col justify-between overflow-hidden transition-colors duration-500 hover:bg-[var(--color-paper)]"
    >
      {/* Element accent watermark */}
      <div
        aria-hidden
        className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${soft} 0%, transparent 70%)`,
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <span
            className={cn(
              "inline-flex items-center justify-center h-11 w-11 rounded-full transition-transform duration-500 group-hover:scale-110",
            )}
            style={{ background: soft }}
          >
            <Icon
              className="h-5 w-5"
              strokeWidth={1.5}
              style={{ color }}
            />
          </span>
          <span className="text-[0.6rem] tracking-[0.22em] uppercase text-[var(--color-muted)]">
            0{idx + 1}
          </span>
        </div>

        <h3 className="font-[family-name:var(--font-display)] text-xl md:text-[1.4rem] tracking-tight leading-snug mb-3">
          {locale === "es" ? p.titleEs : p.titleEn}
        </h3>
        <p className="text-[var(--color-ink-soft)] text-sm leading-relaxed text-pretty">
          {locale === "es" ? p.bodyEs : p.bodyEn}
        </p>
      </div>

      <div className="relative mt-6 pt-4 border-t border-[var(--color-line)] flex items-center justify-between">
        <span
          className="text-[0.65rem] tracking-[0.22em] uppercase font-medium"
          style={{ color }}
        >
          {p.element}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
          <Clock className="h-3 w-3" strokeWidth={1.5} />
          {locale === "es" ? p.durationEs : p.durationEn}
        </span>
      </div>
    </motion.article>
  );
}
