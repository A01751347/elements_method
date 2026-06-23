"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Atom } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { impactCircles } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";

/**
 * Five Circles of Impact — concentric layout.
 * Each level rendered as an expanding row that visually grows outward from
 * the nucleus, distinct from grid-of-cards used elsewhere on the home.
 */
export function SeasonsRhythm({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineGrowth = useTransform(scrollYProgress, [0.15, 0.8], [0, 1]);

  return (
    <section
      ref={ref}
      className="py-24 md:py-36 bg-[var(--color-ink)] text-[var(--color-paper)] relative overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          background:
            "radial-gradient(40% 50% at 0% 50%, rgba(184,196,168,0.45) 0%, transparent 70%)",
        }}
      />

      <Container className="relative">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <Eyebrow inverted className="mb-6 flex items-center gap-3">
              <Atom className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Los círculos expansivos de impacto" : "The expanding circles of impact"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)] text-balance">
              {locale === "es"
                ? "Trasforma y eleva el núcleo, y todo lo que orbita a su alrededor cambiará."
                : "Transform and elevate the nucleus, and everything that orbits around it will change."}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-lg text-[var(--color-paper)]/90 leading-relaxed text-pretty">
              {locale === "es"
                ? "En la física, el núcleo es la masa densa y energética desde la que todo lo demás se organiza. En liderazgo, la persona es el núcleo desde el que radían todas las dinámicas del equipo, la cultura y los resultados organizacionales."
                : "In physics, the nucleus is the dense, energetic mass from which everything else is organized. In leadership, the person is the nucleus from which all team dynamics, culture and organizational results radiate."}
            </p>
          </div>
        </div>

        {/* Concentric expanding stack */}
        <div className="relative">
          {/* Vertical guide line (left) */}
          <motion.div
            aria-hidden
            style={{ scaleY: lineGrowth }}
            className="absolute left-0 top-0 bottom-0 w-px bg-[var(--color-paper)]/30 origin-top hidden md:block"
          />

          <ol className="space-y-px">
            {impactCircles.map((circle, idx) => {
              // Each successive level extends visually wider: 60% → 100%
              const widthPct = 60 + idx * 10;
              const isNucleus = idx === 0;

              return (
                <motion.li
                  key={circle.level}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.8,
                    delay: idx * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative group"
                  style={{ width: `min(100%, ${widthPct}%)` }}
                >
                  <div
                    className={`
                      relative bg-[var(--color-ink)] border-t border-[var(--color-paper)]/15
                      ${isNucleus ? "border-l-2 border-l-[var(--color-paper)]" : ""}
                      transition-colors duration-500 hover:bg-[var(--color-moss-900)]
                      pl-6 md:pl-10 pr-6 py-7 md:py-9
                      grid grid-cols-1 md:grid-cols-[80px_220px_1fr] gap-x-8 gap-y-3 items-baseline
                    `}
                  >
                    <span
                      className={`font-[family-name:var(--font-display)] text-3xl md:text-4xl tabular-nums ${
                        isNucleus ? "text-[var(--color-paper)]" : "text-[var(--color-paper)]/40"
                      }`}
                    >
                      {circle.level}
                    </span>

                    <div>
                      <div className="text-[0.62rem] tracking-[0.22em] uppercase text-[var(--color-paper)]/80 mb-1.5">
                        {locale === "es" ? circle.whoEs : circle.whoEn}
                      </div>
                      <h3
                        className={`font-[family-name:var(--font-display)] text-xl md:text-2xl tracking-tight ${
                          isNucleus
                            ? "text-[var(--color-paper)]"
                            : "text-[var(--color-paper)]/90"
                        }`}
                      >
                        {locale === "es" ? circle.titleEs : circle.titleEn}
                      </h3>
                    </div>

                    <p className="text-sm text-[var(--color-paper)]/90 leading-relaxed max-w-2xl">
                      {locale === "es" ? circle.bodyEs : circle.bodyEn}
                    </p>
                  </div>

                  {/* Right-edge tick mark showing expansion */}
                  <span
                    aria-hidden
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-px bg-[var(--color-paper)]/30"
                  />
                </motion.li>
              );
            })}
          </ol>

          {/* Footer caption */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 text-sm italic text-[var(--color-paper)]/80 max-w-md pl-6 md:pl-10"
          >
            {locale === "es"
              ? "Cada nivel se extiende un grado más allá del anterior. El alcance del líder se mide por la salud de su núcleo."
              : "Each level extends one degree beyond the previous. A leader's reach is measured by the health of their nucleus."}
          </motion.p>
        </div>
      </Container>
    </section>
  );
}
