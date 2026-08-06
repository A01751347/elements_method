"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  Brain,
  Heart,
  Activity,
  Layers3,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import { modalityAxes } from "@/data/content";
import type { ModalityAxis } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";

const AXIS_ICONS = [Brain, Heart, Activity];

/**
 * Methodology stack — three vertical pillars.
 * Each axis (cognitive · psychological · somatic) rendered as a tall
 * typographic column with its modalities listed below. No image selector,
 * no horizontal split — visually distinct from ElementsShowcase (tabs + panel).
 */
export function LocationsSection({
  locale,
  axes,
}: {
  locale: Locale;
  axes?: ModalityAxis[];
}) {
  const effectiveAxes = axes && axes.length > 0 ? axes : modalityAxes;
  return (
    <section className="bg-[var(--color-paper)] py-24 md:py-36 relative">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Layers3 className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "El stack metodológico" : "The methodology stack"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Tres ejes. Una sola intervención."
                : "Three axes. One single intervention."}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Integración de neurociencia, NLP, psicología y práctica somática en cada sesión. Trabajo desde adentro hacia afuera — el líder primero, las herramientas después."
                : "Integration of neuroscience, NLP, psychology and somatic practice in every session. Working from the inside out — the leader first, the tools after."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-0 relative">
          {effectiveAxes.map((axis, idx) => {
            const Icon = AXIS_ICONS[idx];
            return (
              <motion.div
                key={axis.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex flex-col py-10 md:py-12 ${
                  idx > 0 ? "md:border-l border-t md:border-t-0 border-[var(--color-line)]" : ""
                }`}
              >
                {/* Top — big number + icon */}
                <div className="flex items-start justify-between px-6 md:px-10 mb-12">
                  <span className="font-[family-name:var(--font-display)] text-[5.5rem] md:text-[7rem] leading-none text-[var(--color-ink)]/12">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <Icon
                    className="h-6 w-6 text-[var(--color-moss-700)] mt-4"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Axis name + tagline */}
                <div className="px-6 md:px-10 mb-10">
                  <div className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-muted)] mb-3">
                    {locale === "es" ? axis.taglineEs : axis.taglineEn}
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,2.2vw,2.5rem)] tracking-tight leading-tight">
                    {locale === "es" ? axis.nameEs : axis.nameEn}
                  </h3>
                  <p className="mt-6 text-sm text-[var(--color-ink-soft)] leading-relaxed max-w-sm">
                    {locale === "es" ? axis.bodyEs : axis.bodyEn}
                  </p>
                </div>

                {/* Modalities list */}
                <div className="px-6 md:px-10 mt-auto pt-8 border-t border-[var(--color-line)]">
                  <div className="eyebrow text-[var(--color-muted)] mb-4">
                    {locale === "es" ? "Modalidades" : "Modalities"}
                  </div>
                  <ul className="space-y-2.5">
                    {(locale === "es" ? axis.modalitiesEs : axis.modalitiesEn).map(
                      (m) => (
                        <li
                          key={m}
                          className="text-[0.8125rem] text-[var(--color-ink-soft)] leading-relaxed"
                        >
                          {m}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
