"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Droplets,
  Flame,
  Wind,
  Mountain,
  Sparkles,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { elements, elementImages, type ElementKey } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const ICONS: Record<ElementKey, LucideIcon> = {
  agua: Droplets,
  fuego: Flame,
  aire: Wind,
  tierra: Mountain,
  eter: Sparkles,
};

export function ElementsShowcase({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  // Only the 4 trainable elements are shown in the showcase.
  // Éter is the Nucleus and lives in El Método page, not here.
  const trainable = elements.filter((e) => e.key !== "eter");
  const [active, setActive] = React.useState<ElementKey>("agua");
  const current = trainable.find((e) => e.key === active) ?? trainable[0];

  return (
    <section className="bg-[var(--color-paper-warm)] py-24 md:py-36 relative paper-grain overflow-hidden">
      <Container className="relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-end mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6">{dict.home.elementsEyebrow}</Eyebrow>
            <h2 className="display-2 text-balance">
              {dict.home.elementsTitle}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="lead text-pretty">{dict.home.elementsLead}</p>
          </div>
        </div>

        {/* Element tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-line)] mb-px">
          {trainable.map((el, idx) => {
            const Icon = ICONS[el.key];
            const isActive = active === el.key;
            const name = locale === "es" ? el.nameEs : el.nameEn;
            return (
              <button
                key={el.key}
                type="button"
                onMouseEnter={() => setActive(el.key)}
                onFocus={() => setActive(el.key)}
                onClick={() => setActive(el.key)}
                className={cn(
                  "group relative p-6 md:p-7 text-left transition-all duration-500",
                  isActive
                    ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                    : "bg-[var(--color-paper-warm)] text-[var(--color-ink)] hover:bg-[var(--color-paper)]",
                )}
              >
                <div className="flex items-center justify-between mb-6">
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-transform",
                      isActive ? "text-[var(--color-paper)]" : "text-[var(--color-ink-soft)]",
                      el.animClass,
                    )}
                    strokeWidth={1.5}
                  />
                  <span
                    className={cn(
                      "text-[0.7rem] tracking-[0.22em] uppercase",
                      isActive ? "text-[var(--color-paper)]/90" : "text-[var(--color-muted)]",
                    )}
                  >
                    0{idx + 1}
                  </span>
                </div>
                <div className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-tight">
                  {name}
                </div>
                <div
                  className={cn(
                    "mt-2 text-[0.75rem] tracking-wide",
                    isActive ? "text-[var(--color-paper)]/85" : "text-[var(--color-muted)]",
                  )}
                >
                  {locale === "es" ? el.qualityEs : el.qualityEn}
                </div>
                <motion.span
                  layoutId="element-tab-underline"
                  className={cn(
                    "absolute left-0 bottom-0 h-0.5 right-0 origin-left",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                  style={{ background: el.accent }}
                />
              </button>
            );
          })}
        </div>

        {/* Active element panel */}
        <div className="bg-[var(--color-ink)] text-[var(--color-paper)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid lg:grid-cols-12 gap-0"
            >
              {/* Image side */}
              <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto lg:min-h-[480px] overflow-hidden">
                <Image
                  src={elementImages[current.key]}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 mix-blend-multiply"
                  style={{
                    background: `linear-gradient(135deg, ${current.accent}30 0%, transparent 60%)`,
                  }}
                />
                {/* AAA text-protection scrim — guarantees ≥7:1 for the label below */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 scrim-bottom pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-paper)]/90 mb-1">
                      {locale === "es" ? "Elemento activo" : "Active element"}
                    </div>
                    <div
                      className="font-[family-name:var(--font-display)] text-4xl"
                      style={{ color: "var(--color-paper)" }}
                    >
                      {locale === "es" ? current.nameEs : current.nameEn}
                    </div>
                  </div>
                  <div
                    className={cn("h-12 w-12 rounded-full flex items-center justify-center", current.animClass)}
                    style={{ background: current.accentInk }}
                  >
                    {(() => {
                      const Icon = ICONS[current.key];
                      return <Icon className="h-5 w-5 text-[var(--color-paper)]" strokeWidth={1.5} />;
                    })()}
                  </div>
                </div>
              </div>

              {/* Content side */}
              <div className="lg:col-span-6 p-8 md:p-12 lg:p-16">
                <div className="eyebrow text-[var(--color-paper)]/85 mb-6 flex items-center gap-3">
                  <span aria-hidden className="h-px w-8 bg-[var(--color-paper)]/30" />
                  {locale === "es" ? "Cuatro capas" : "Four layers"}
                </div>

                <h3 className="display-3 mb-8 text-[var(--color-paper)]">
                  {locale === "es" ? current.qualityEs : current.qualityEn}
                </h3>

                <div className="space-y-7">
                  <Row
                    label={locale === "es" ? "En la naturaleza" : "In nature"}
                    body={locale === "es" ? current.natureEs : current.natureEn}
                  />
                  <Row
                    label={locale === "es" ? "En el líder" : "In the leader"}
                    body={locale === "es" ? current.cultivaEs : current.cultivaEn}
                  />
                  <Row
                    label={locale === "es" ? "Metodología" : "Methodology"}
                    body={locale === "es" ? current.methodEs : current.methodEn}
                  />
                  <Row
                    label={locale === "es" ? "Práctica fisiológica" : "Embodied practice"}
                    body={locale === "es" ? current.bodyEs : current.bodyEn}
                  />
                </div>

                <Link
                  href={`/${locale}/${locale === "es" ? "el-metodo" : "method"}`}
                  className="group mt-10 inline-flex items-center gap-2 text-sm text-[var(--color-paper)] border-b border-[var(--color-paper)]/30 pb-1 hover:border-[var(--color-paper)] transition-colors"
                >
                  {locale === "es" ? "Estudiar el método completo" : "Study the full method"}
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}

function Row({ label, body }: { label: string; body: string }) {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-4 pb-5 border-b border-[var(--color-paper)]/10 last:border-0">
      <div className="text-[0.7rem] tracking-[0.18em] uppercase text-[var(--color-paper)]/85 pt-0.5">
        {label}
      </div>
      <p className="text-[var(--color-paper)]/95 text-[0.95rem] leading-relaxed">
        {body}
      </p>
    </div>
  );
}
