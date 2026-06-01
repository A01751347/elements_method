"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {
  Sunrise,
  Sun,
  Sunset,
  TreePine,
  Droplets,
  Flame,
  Wind,
  Mountain,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import { seasons, type ElementKey } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const SEASON_ICONS = [TreePine, Sunrise, Sun, Sunset];

const ELEMENT_ICONS: Record<ElementKey, LucideIcon> = {
  agua: Droplets,
  fuego: Flame,
  aire: Wind,
  tierra: Mountain,
};

const ELEMENT_COLORS: Record<ElementKey, string> = {
  agua: "var(--color-water)",
  fuego: "var(--color-fire)",
  aire: "var(--color-air)",
  tierra: "var(--color-earth)",
};

export function SeasonsRhythm({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <section
      ref={ref}
      className="py-24 md:py-36 bg-[var(--color-ink)] text-[var(--color-paper)] relative overflow-hidden"
    >
      {/* Atmospheric glow */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 40% at 20% 30%, rgba(184,196,168,0.3) 0%, transparent 70%), radial-gradient(40% 40% at 80% 70%, rgba(180,71,31,0.15) 0%, transparent 70%)",
        }}
      />

      <Container className="relative">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16 md:mb-24">
          <div className="lg:col-span-7">
            <Eyebrow inverted className="mb-6 flex items-center gap-3">
              <TreePine className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Ritmo del año" : "Year's rhythm"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)] text-balance">
              {locale === "es"
                ? "El liderazgo también tiene estaciones."
                : "Leadership also has seasons."}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-lg text-[var(--color-paper)]/75 leading-relaxed text-pretty">
              {locale === "es"
                ? "El método se mueve con el año. Cada estación pesa distinto: lo que se cultiva en invierno no se fuerza en primavera."
                : "The method moves with the year. Each season weighs differently: what's cultivated in winter isn't forced in spring."}
            </p>
          </div>
        </div>

        {/* Rotating compass background */}
        <div className="relative">
          <motion.div
            aria-hidden
            style={{ rotate }}
            className="absolute -top-20 -right-20 md:-top-32 md:-right-32 pointer-events-none"
          >
            <svg
              width="500"
              height="500"
              viewBox="0 0 500 500"
              fill="none"
              className="opacity-[0.06]"
            >
              <circle cx="250" cy="250" r="240" stroke="var(--color-paper)" strokeWidth="1" />
              <circle cx="250" cy="250" r="180" stroke="var(--color-paper)" strokeWidth="1" strokeDasharray="2 6" />
              <circle cx="250" cy="250" r="120" stroke="var(--color-paper)" strokeWidth="1" />
              <line x1="10" y1="250" x2="490" y2="250" stroke="var(--color-paper)" strokeWidth="0.5" />
              <line x1="250" y1="10" x2="250" y2="490" stroke="var(--color-paper)" strokeWidth="0.5" />
              <line x1="80" y1="80" x2="420" y2="420" stroke="var(--color-paper)" strokeWidth="0.5" />
              <line x1="420" y1="80" x2="80" y2="420" stroke="var(--color-paper)" strokeWidth="0.5" />
            </svg>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-paper)]/10 relative">
            {seasons.map((s, idx) => {
              const SIcon = SEASON_ICONS[idx];
              const EIcon = ELEMENT_ICONS[s.elementKey];
              const color = ELEMENT_COLORS[s.elementKey];
              return (
                <motion.div
                  key={s.titleEs}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: idx * 0.1 }}
                  className="group bg-[var(--color-ink)] p-8 md:p-10 min-h-[340px] flex flex-col justify-between hover:bg-[var(--color-moss-900)] transition-colors duration-500"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <SIcon className="h-6 w-6 text-[var(--color-paper)]/70" strokeWidth={1.5} />
                      <EIcon className="h-5 w-5" strokeWidth={1.5} style={{ color }} />
                    </div>
                    <div className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-paper)]/50 mb-3">
                      {locale === "es" ? s.monthsEs : s.monthsEn}
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-tight text-[var(--color-paper)] mb-4 leading-tight">
                      {locale === "es" ? s.titleEs : s.titleEn}
                    </h3>
                  </div>

                  <p className="text-sm text-[var(--color-paper)]/70 leading-relaxed text-pretty">
                    {locale === "es" ? s.bodyEs : s.bodyEn}
                  </p>

                  <div
                    className={cn(
                      "mt-6 h-px origin-left scale-x-50 group-hover:scale-x-100 transition-transform duration-700",
                    )}
                    style={{ background: color }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
