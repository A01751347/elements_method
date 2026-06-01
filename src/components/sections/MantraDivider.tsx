"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import type { Locale } from "@/i18n/config";
import { mantraEs, mantraEn } from "@/data/content";
import { Container } from "@/components/ui/Container";

const MANTRA_IMAGE =
  "https://images.unsplash.com/photo-1448375240586-882707db888b?w=2400&q=85&auto=format&fit=crop";

export function MantraDivider({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0, 1, 1, 0]);

  const sentence = locale === "es" ? mantraEs : mantraEn;
  const parts = sentence.split(" — ");

  return (
    <section
      ref={ref}
      className="relative min-h-[80vh] flex items-center text-[var(--color-paper)] overflow-hidden"
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 -z-10 will-change-transform"
      >
        <Image
          src={MANTRA_IMAGE}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-ink)]/70 via-[var(--color-ink)]/65 to-[var(--color-ink)]/80" />
      <div className="absolute inset-0 -z-10 film-grain pointer-events-none" />

      <Container className="relative py-32 md:py-48">
        <motion.div style={{ opacity }} className="max-w-5xl">
          <div className="eyebrow text-[var(--color-paper)]/70 mb-10 flex items-center gap-3">
            <span aria-hidden className="h-px w-12 bg-[var(--color-paper)]/40" />
            {locale === "es" ? "Mantra del método" : "Method mantra"}
          </div>

          <blockquote className="font-[family-name:var(--font-display)] text-[clamp(2rem,5.5vw,4.5rem)] leading-[1.1] tracking-tight text-balance">
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
                className="block italic font-light text-[var(--color-paper-warm)] mt-2"
              >
                {parts[1]}
              </motion.span>
            )}
          </blockquote>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-12 flex items-center gap-4"
          >
            <span className="h-px w-12 bg-[var(--color-paper)]/40" />
            <span className="text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-paper)]/70">
              Elements Method · 2026
            </span>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
