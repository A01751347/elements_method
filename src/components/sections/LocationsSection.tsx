"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Mountain, Wind, Droplets, Flame, Compass } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { locations, type ElementKey } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const ELEMENT_ICONS: Record<ElementKey, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  agua: Droplets,
  fuego: Flame,
  aire: Wind,
  tierra: Mountain,
};

export function LocationsSection({ locale }: { locale: Locale }) {
  const [active, setActive] = React.useState(0);
  const current = locations[active];
  const Icon = ELEMENT_ICONS[current.primaryElement];

  return (
    <section className="bg-[var(--color-paper)] py-24 md:py-36 relative overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Compass className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Geografía del método" : "Method geography"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Tres territorios. Tres conversaciones distintas con la naturaleza."
                : "Three territories. Three distinct conversations with nature."}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Cada locación se eligió por lo que enseña. No es decorado: el lugar trabaja contigo."
                : "Each location was chosen for what it teaches. It's not decor — the place works with you."}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-0 border border-[var(--color-line)]">
          {/* Image */}
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
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-ink)]/30 via-transparent to-[var(--color-ink)]/50" />
              </motion.div>
            </AnimatePresence>

            {/* Top overlay: coords */}
            <div className="absolute top-6 left-6 right-6 flex items-start justify-between text-[var(--color-paper)]">
              <div className="bg-[var(--color-ink)]/40 backdrop-blur-sm px-3 py-2">
                <div className="text-[0.6rem] tracking-[0.22em] uppercase opacity-70">
                  {locale === "es" ? "Coordenadas" : "Coordinates"}
                </div>
                <div className="text-xs tabular-nums mt-1">
                  {current.coordinatesLabel}
                </div>
              </div>
              <div className="bg-[var(--color-ink)]/40 backdrop-blur-sm px-3 py-2 text-right">
                <div className="text-[0.6rem] tracking-[0.22em] uppercase opacity-70">
                  {locale === "es" ? "Altitud" : "Altitude"}
                </div>
                <div className="text-xs tabular-nums mt-1">{current.altitude}</div>
              </div>
            </div>

            {/* Bottom overlay: location name */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-[var(--color-paper)] gap-4">
              <div>
                <div className="flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase opacity-80 mb-2">
                  <MapPin className="h-3 w-3" strokeWidth={1.5} />
                  {locale === "es" ? current.regionEs : current.regionEn}
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl leading-none">
                  {locale === "es" ? current.nameEs : current.nameEn}
                </h3>
              </div>
              <div className="h-14 w-14 rounded-full bg-[var(--color-paper)]/95 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Icon className="h-6 w-6 text-[var(--color-ink)]" strokeWidth={1.5} />
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
                  className="flex-1"
                >
                  <div className="eyebrow text-[var(--color-muted)] mb-4">
                    {locale === "es" ? "Elemento principal" : "Main element"}
                  </div>
                  <h4 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-tight mb-8">
                    {locale === "es" ? current.elementEs : current.elementEn}
                  </h4>
                  <p className="text-[var(--color-ink-soft)] leading-relaxed text-pretty">
                    {locale === "es" ? current.narrativeEs : current.narrativeEn}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Location switcher */}
            <div className="grid grid-cols-3 border-t border-[var(--color-line)]">
              {locations.map((loc, idx) => (
                <button
                  key={loc.slug}
                  type="button"
                  onClick={() => setActive(idx)}
                  className={cn(
                    "p-5 text-left border-r last:border-r-0 border-[var(--color-line)] transition-colors duration-300",
                    active === idx
                      ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "bg-[var(--color-paper-warm)] hover:bg-[var(--color-paper)]",
                  )}
                >
                  <div
                    className={cn(
                      "text-[0.6rem] tracking-[0.22em] uppercase mb-1",
                      active === idx ? "text-[var(--color-paper)]/70" : "text-[var(--color-muted)]",
                    )}
                  >
                    0{idx + 1}
                  </div>
                  <div className="font-[family-name:var(--font-display)] text-lg leading-tight">
                    {loc.nameEs}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
