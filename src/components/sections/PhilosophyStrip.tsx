"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/ui/Container";

export function PhilosophyStrip({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const phrase =
    locale === "es"
      ? "No enseñamos liderazgo. Lo entrenamos como se entrena un cuerpo: con prácticas concretas, con disciplina sostenible, con honestidad."
      : "We don't teach leadership. We train it like a body: with concrete practices, with sustainable discipline, with honesty.";

  const words = phrase.split(" ");

  return (
    <section
      ref={ref}
      className="bg-[var(--color-paper)] py-32 md:py-48 relative paper-grain overflow-hidden"
    >
      {/* Background big number */}
      <motion.div
        style={{
          y: useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]),
        }}
        aria-hidden
        className="absolute -top-12 -right-12 md:-right-24 pointer-events-none select-none opacity-[0.04] font-[family-name:var(--font-display)] text-[28rem] leading-none font-light"
      >
        04
      </motion.div>

      <Container>
        <div className="max-w-5xl">
          <div className="eyebrow mb-10 flex items-center gap-3">
            <span aria-hidden className="h-px w-12 bg-[var(--color-ink)]/30" />
            {locale === "es" ? "Manifiesto" : "Manifesto"}
          </div>
          <p className="font-[family-name:var(--font-display)] text-[clamp(2rem,4.5vw,4rem)] leading-[1.15] tracking-tight text-balance">
            {words.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0.15 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, margin: "-200px 0px -200px 0px" }}
                transition={{ duration: 0.6, delay: i * 0.025, ease: "easeOut" }}
                className="inline-block mr-[0.25em]"
              >
                {w}
              </motion.span>
            ))}
          </p>

          <div className="mt-16 grid sm:grid-cols-3 gap-8 max-w-3xl">
            {(locale === "es"
              ? [
                  { k: "Cuerpo", v: "El nervioso decide antes que la palabra." },
                  { k: "Tiempo", v: "Cuatro meses mínimo. No hay atajos honestos." },
                  { k: "Práctica", v: "Lo simbólico organiza. Lo concreto cambia." },
                ]
              : [
                  { k: "Body", v: "The nervous system decides before the word." },
                  { k: "Time", v: "Four months minimum. No honest shortcuts." },
                  { k: "Practice", v: "Symbol organizes. The concrete changes." },
                ]
            ).map((row, i) => (
              <motion.div
                key={row.k}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="eyebrow text-[var(--color-muted)] mb-3">{row.k}</div>
                <p className="text-[var(--color-ink-soft)] leading-relaxed text-sm">
                  {row.v}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
