"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Heart,
  Activity,
  Wind,
  Droplets,
  Flame,
  Mountain,
  Layers3,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import { modalityAxes, type ElementKey } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const AXIS_ICONS = [Brain, Heart, Activity];

const ELEMENT_ICONS: Record<ElementKey, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  agua: Droplets,
  fuego: Flame,
  aire: Wind,
  tierra: Mountain,
};

/**
 * Modality stack section.
 * Renders the three axes (cognitive · emotional · somatic) that the methodology integrates.
 * (Filename kept as LocationsSection for backwards compat with imports.)
 */
export function LocationsSection({ locale }: { locale: Locale }) {
  const [active, setActive] = React.useState(0);
  const current = modalityAxes[active];
  const ElementIcon = ELEMENT_ICONS[current.primaryElement];

  return (
    <section className="bg-[var(--color-paper)] py-24 md:py-36 relative overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Layers3 className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "El stack metodológico" : "The methodology stack"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Tres ejes que se entrenan al mismo tiempo."
                : "Three axes trained at the same time."}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Cognitivo, emocional y somático. Ningún eje por sí solo cambia el liderazgo — los tres trabajados juntos sí. Esto es lo que separa Elements de un curso o un retiro tradicional."
                : "Cognitive, emotional and somatic. No single axis changes leadership on its own — the three together do. This is what separates Elements from a course or a traditional retreat."}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-0 border border-[var(--color-line)]">
          {/* Image side */}
          <div className="lg:col-span-7 relative aspect-[4/3] lg:aspect-auto lg:min-h-[640px] overflow-hidden bg-[var(--color-ink)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.slug}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={current.image}
                  alt={current.nameEs}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-ink)]/30 via-transparent to-[var(--color-ink)]/55" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute top-6 left-6 right-6 flex items-start justify-between text-[var(--color-paper)]">
              <div className="bg-[var(--color-ink)]/40 backdrop-blur-sm px-3 py-2">
                <div className="text-[0.6rem] tracking-[0.22em] uppercase opacity-70">
                  {locale === "es" ? "Eje" : "Axis"}
                </div>
                <div className="text-xs tabular-nums mt-1">
                  0{active + 1} / 03
                </div>
              </div>
              <div className="bg-[var(--color-ink)]/40 backdrop-blur-sm px-3 py-2 text-right">
                <div className="text-[0.6rem] tracking-[0.22em] uppercase opacity-70">
                  {locale === "es" ? "Elemento ancla" : "Anchor element"}
                </div>
                <div className="text-xs tabular-nums mt-1 capitalize">
                  {current.primaryElement}
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-[var(--color-paper)] gap-4">
              <div>
                <div className="flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase opacity-80 mb-2">
                  {locale === "es" ? current.taglineEs : current.taglineEn}
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl leading-none">
                  {locale === "es" ? current.nameEs : current.nameEn}
                </h3>
              </div>
              <div className="h-14 w-14 rounded-full bg-[var(--color-paper)]/95 backdrop-blur-sm flex items-center justify-center shrink-0">
                <ElementIcon className="h-6 w-6 text-[var(--color-ink)]" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Content + selector */}
          <div className="lg:col-span-5 bg-[var(--color-paper-warm)] flex flex-col">
            <div className="p-8 md:p-10 lg:p-12 flex-1 flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 flex flex-col"
                >
                  <div className="eyebrow text-[var(--color-muted)] mb-4">
                    {locale === "es" ? "Lo que entrena" : "What it trains"}
                  </div>
                  <p className="text-[var(--color-ink-soft)] leading-relaxed text-pretty mb-8">
                    {locale === "es" ? current.bodyEs : current.bodyEn}
                  </p>

                  <div className="eyebrow text-[var(--color-muted)] mb-4">
                    {locale === "es" ? "Modalidades activas" : "Active modalities"}
                  </div>
                  <ul className="space-y-2.5 flex-1">
                    {(locale === "es" ? current.modalitiesEs : current.modalitiesEn).map(
                      (m) => (
                        <li
                          key={m}
                          className="flex items-start gap-2.5 text-sm text-[var(--color-ink-soft)]"
                        >
                          <span className="mt-2 h-1 w-2.5 bg-[var(--color-moss-500)] shrink-0" />
                          <span>{m}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-3 border-t border-[var(--color-line)]">
              {modalityAxes.map((axis, idx) => {
                const Icon = AXIS_ICONS[idx];
                return (
                  <button
                    key={axis.slug}
                    type="button"
                    onClick={() => setActive(idx)}
                    className={cn(
                      "p-5 text-left border-r last:border-r-0 border-[var(--color-line)] transition-colors duration-300 group",
                      active === idx
                        ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                        : "bg-[var(--color-paper-warm)] hover:bg-[var(--color-paper)]",
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          active === idx
                            ? "text-[var(--color-paper)]"
                            : "text-[var(--color-moss-700)]",
                        )}
                        strokeWidth={1.5}
                      />
                      <span
                        className={cn(
                          "text-[0.6rem] tracking-[0.22em] uppercase",
                          active === idx
                            ? "text-[var(--color-paper)]/70"
                            : "text-[var(--color-muted)]",
                        )}
                      >
                        0{idx + 1}
                      </span>
                    </div>
                    <div className="font-[family-name:var(--font-display)] text-lg leading-tight">
                      {locale === "es" ? axis.nameEs : axis.nameEn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
