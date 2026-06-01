"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {
  MessageCircle,
  ScanSearch,
  Map,
  Repeat,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import { processSteps } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";

const ICONS = [MessageCircle, ScanSearch, Map, Repeat];

export function ProcessSteps({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineScale = useTransform(scrollYProgress, [0.1, 0.85], [0, 1]);

  return (
    <section className="py-24 md:py-36 bg-[var(--color-paper)]">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 mb-16 md:mb-24">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6">
              {locale === "es" ? "Cómo trabajamos" : "How we work"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "De primera conversación a práctica sostenida."
                : "From first conversation to sustained practice."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-4">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Cuatro pasos antes de que tu liderazgo cambie. Nada salta — porque la práctica real no acepta atajos."
                : "Four steps before your leadership shifts. Nothing skips — because real practice doesn't accept shortcuts."}
            </p>
          </div>
        </div>

        <div ref={ref} className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {/* Animated progress line */}
          <motion.div
            style={{ scaleX: lineScale }}
            className="absolute top-0 left-0 right-0 h-px bg-[var(--color-moss-700)] origin-left z-10 hidden lg:block"
          />

          {processSteps.map((step, idx) => {
            const Icon = ICONS[idx];
            return (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="group bg-[var(--color-paper)] p-8 md:p-10 min-h-[280px] flex flex-col justify-between hover:bg-[var(--color-paper-warm)] transition-colors duration-500"
              >
                <div className="flex items-start justify-between">
                  <span className="font-[family-name:var(--font-display)] text-5xl text-[var(--color-ink)]/15 group-hover:text-[var(--color-moss-700)]/40 transition-colors">
                    {step.n}
                  </span>
                  <Icon className="h-5 w-5 text-[var(--color-moss-700)]" strokeWidth={1.5} />
                </div>

                <div className="mt-8">
                  <h3 className="font-[family-name:var(--font-display)] text-xl md:text-2xl mb-3 tracking-tight">
                    {locale === "es" ? step.titleEs : step.titleEn}
                  </h3>
                  <p className="text-[var(--color-ink-soft)] text-sm leading-relaxed">
                    {locale === "es" ? step.bodyEs : step.bodyEn}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
