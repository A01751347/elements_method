"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
  Calendar,
  Droplets,
  Flame,
  Wind,
  Mountain,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=2400&q=85&auto=format&fit=crop";

export function HeroSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  const base = `/${locale}`;
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.15]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.7], [0.55, 0.85]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-end overflow-hidden -mt-20 pt-20 text-[var(--color-paper)]"
    >
      {/* Background image with parallax */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 -z-20 will-change-transform"
      >
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Dark overlay */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-ink)]/40 via-[var(--color-ink)]/55 to-[var(--color-ink)]"
      />

      {/* Film grain */}
      <div className="absolute inset-0 -z-10 film-grain pointer-events-none" />

      {/* Top side label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="absolute top-28 right-6 hidden md:flex items-center gap-3 text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-paper)]/70 rotate-90 origin-right translate-x-8"
      >
        <span aria-hidden className="h-px w-10 bg-[var(--color-paper)]/40" />
        Water · Fire · Air · Earth
      </motion.div>

      <Container className="relative pb-16 md:pb-24 z-10">
        <motion.div style={{ y: contentY, opacity: contentOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="eyebrow flex items-center gap-3 mb-8 text-[var(--color-paper)]/80"
          >
            <span aria-hidden className="h-px w-12 bg-[var(--color-paper)]/40" />
            {dict.home.eyebrow}
          </motion.div>

          <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[18ch]">
            <WordReveal
              words={
                locale === "es"
                  ? ["Mejor", "pensamiento.", "Mejores", "decisiones.", "Mejor", "liderazgo."]
                  : ["Better", "thinking.", "Better", "decisions.", "Better", "leadership."]
              }
              italicIndices={[2, 3]}
              accentIndices={[2, 3]}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-10 max-w-xl text-lg leading-relaxed text-[var(--color-paper)]/80 text-pretty"
          >
            {dict.home.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Button
              href={`${base}/${locale === "es" ? "los-caminos" : "paths"}`}
              size="lg"
              trailingArrow
              className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)]"
            >
              {dict.home.primaryCta}
            </Button>
            <Button
              href={`${base}/${locale === "es" ? "retiros" : "retreats"}`}
              size="lg"
              variant="outlineLight"
            >
              {dict.home.secondaryCta}
            </Button>
          </motion.div>

          {/* Elements quick row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px max-w-3xl border-t border-[var(--color-paper)]/15"
          >
            {[
              { icon: Droplets, label: locale === "es" ? "Agua" : "Water", anim: "anim-water" },
              { icon: Flame, label: locale === "es" ? "Fuego" : "Fire", anim: "anim-fire" },
              { icon: Wind, label: locale === "es" ? "Aire" : "Air", anim: "anim-air" },
              { icon: Mountain, label: locale === "es" ? "Tierra" : "Earth", anim: "anim-earth" },
            ].map((el, idx) => {
              const Icon = el.icon;
              return (
                <Link
                  key={el.label}
                  href={`${base}/${locale === "es" ? "el-metodo" : "method"}`}
                  className="group flex items-center gap-3 py-5 px-4 border-r last:border-r-0 border-[var(--color-paper)]/15 hover:bg-[var(--color-paper)]/5 transition-colors"
                >
                  <Icon
                    className={`h-4 w-4 text-[var(--color-paper)]/70 group-hover:text-[var(--color-paper)] transition-colors ${el.anim}`}
                    strokeWidth={1.5}
                  />
                  <span className="text-[0.78rem] tracking-[0.2em] uppercase text-[var(--color-paper)]/80 group-hover:text-[var(--color-paper)] transition-colors">
                    {String(idx + 1).padStart(2, "0")} {el.label}
                  </span>
                </Link>
              );
            })}
          </motion.div>
        </motion.div>
      </Container>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-6 inset-x-0 z-10"
      >
        <Container className="flex items-center justify-between gap-6 text-[var(--color-paper)]/70">
          <div className="flex items-center gap-3 text-[0.72rem] tracking-[0.2em] uppercase">
            <ArrowDown className="h-3.5 w-3.5 animate-bounce" aria-hidden />
            {locale === "es" ? "Desplázate" : "Scroll"}
          </div>
          <Link
            href={`${base}/${locale === "es" ? "retiros" : "retreats"}`}
            className="group hidden md:inline-flex items-center gap-2 text-[0.78rem] tracking-[0.2em] uppercase hover:text-[var(--color-paper)] transition-colors"
          >
            <Calendar className="h-3.5 w-3.5" />
            {locale === "es" ? "Próximo retiro · Feb 2026" : "Next retreat · Feb 2026"}
            <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </Container>
      </motion.div>
    </section>
  );
}

function WordReveal({
  words,
  italicIndices = [],
  accentIndices = [],
}: {
  words: string[];
  italicIndices?: number[];
  accentIndices?: number[];
}) {
  return (
    <span className="inline-block">
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em] last:mr-0">
          <motion.span
            initial={{ y: "115%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 1,
              delay: 0.18 + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`inline-block ${
              italicIndices.includes(i) ? "italic font-light" : ""
            } ${accentIndices.includes(i) ? "text-[var(--color-paper-warm)]" : ""}`}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
