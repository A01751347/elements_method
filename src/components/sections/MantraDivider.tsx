"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Droplets, Flame, Wind, Mountain } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { mantraEs, mantraEn } from "@/data/content";
import { Container } from "@/components/ui/Container";

/**
 * Mantra divider — purely typographic, no imagery.
 * A slowly rotating compass with the four elements anchors the bottom.
 * Differentiated from Hero and FinalCta (both full-bleed photo + parallax).
 */
export function MantraDivider({
  locale,
  mantra,
}: {
  locale: Locale;
  mantra?: { es: string; en: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const compassRotate = useTransform(scrollYProgress, [0, 1], [-45, 45]);
  const phraseY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  const effectiveMantra = mantra ?? { es: mantraEs, en: mantraEn };
  const sentence = locale === "es" ? effectiveMantra.es : effectiveMantra.en;
  const parts = sentence.split(" — ");

  return (
    <section
      ref={ref}
      className="relative bg-[var(--color-paper-warm)] py-32 md:py-48 overflow-hidden paper-grain"
    >
      {/* Decorative compass — left side, large, low opacity */}
      <motion.div
        aria-hidden
        style={{ rotate: compassRotate }}
        className="absolute -left-32 top-1/2 -translate-y-1/2 pointer-events-none w-[640px] h-[640px] opacity-[0.07]"
      >
        <svg viewBox="0 0 600 600" fill="none">
          <circle cx="300" cy="300" r="290" stroke="var(--color-ink)" strokeWidth="1" />
          <circle cx="300" cy="300" r="220" stroke="var(--color-ink)" strokeWidth="1" strokeDasharray="2 6" />
          <circle cx="300" cy="300" r="150" stroke="var(--color-ink)" strokeWidth="1" />
          <line x1="10" y1="300" x2="590" y2="300" stroke="var(--color-ink)" strokeWidth="0.6" />
          <line x1="300" y1="10" x2="300" y2="590" stroke="var(--color-ink)" strokeWidth="0.6" />
        </svg>
      </motion.div>

      <Container className="relative">
        <motion.div style={{ y: phraseY }} className="max-w-5xl">
          <div className="eyebrow mb-10 flex items-center gap-3">
            <span aria-hidden className="h-px w-12 bg-[var(--color-ink)]/30" />
            {locale === "es" ? "Insight" : "Insight"}
          </div>

          <blockquote className="font-[family-name:var(--font-display)] text-[clamp(2rem,5.5vw,4.75rem)] leading-[1.05] tracking-tight text-balance text-[var(--color-ink)]">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {parts[0]}
              {parts.length > 1 && " —"}
            </motion.span>
            {parts[1] && (
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="block italic font-light text-[var(--color-moss-700)] mt-3"
              >
                {parts[1]}
              </motion.span>
            )}
          </blockquote>

          {/* Four element marks at the bottom */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 flex items-center gap-6 md:gap-10 flex-wrap"
          >
            <div className="flex items-center gap-3">
              <Mountain className="h-4 w-4 text-[var(--color-earth-ink)] anim-earth" strokeWidth={1.5} />
              <span className="text-[0.72rem] tracking-[0.22em] uppercase text-[var(--color-muted)]">
                Tierra · ROOTS
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Flame className="h-4 w-4 text-[var(--color-fire-ink)] anim-fire" strokeWidth={1.5} />
              <span className="text-[0.72rem] tracking-[0.22em] uppercase text-[var(--color-muted)]">
                Fuego · IGNITE
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Droplets className="h-4 w-4 text-[var(--color-water-ink)] anim-water" strokeWidth={1.5} />
              <span className="text-[0.72rem] tracking-[0.22em] uppercase text-[var(--color-muted)]">
                Agua · FLOW
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Wind className="h-4 w-4 text-[var(--color-air-ink)] anim-air" strokeWidth={1.5} />
              <span className="text-[0.72rem] tracking-[0.22em] uppercase text-[var(--color-muted)]">
                Aire · CLEAR
              </span>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
