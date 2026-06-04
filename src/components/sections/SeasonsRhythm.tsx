"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {
  Atom,
  Users,
  Building,
  Globe2,
  HeartHandshake,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import { impactCircles } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const LEVEL_ICONS = [Atom, HeartHandshake, Users, Building, Globe2];

/**
 * Five Circles of Impact — the Nucleus model from the presentation (p.6).
 * Filename kept as SeasonsRhythm for backwards compat.
 */
export function SeasonsRhythm({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);

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
            "radial-gradient(50% 40% at 50% 50%, rgba(184,196,168,0.4) 0%, transparent 70%)",
        }}
      />

      <Container className="relative">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16 md:mb-24">
          <div className="lg:col-span-7">
            <Eyebrow inverted className="mb-6 flex items-center gap-3">
              <Atom className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Los cinco círculos de impacto" : "The five circles of impact"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)] text-balance">
              {locale === "es"
                ? "Cambia el núcleo y todo lo demás se reorganiza."
                : "Change the nucleus and everything else reorganizes."}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-lg text-[var(--color-paper)]/75 leading-relaxed text-pretty">
              {locale === "es"
                ? "La mayoría de los programas de liderazgo trabajan de afuera hacia adentro. Elements trabaja de adentro hacia afuera: cuando el núcleo está saludable, los círculos siguientes se reorganizan solos."
                : "Most leadership programs work from the outside in. Elements works from the inside out: when the nucleus is healthy, the surrounding circles reorganize on their own."}
            </p>
          </div>
        </div>

        <div className="relative">
          {/* Rotating circles background */}
          <motion.div
            aria-hidden
            style={{ rotate, scale }}
            className="absolute -top-20 -right-20 md:-top-32 md:-right-32 pointer-events-none"
          >
            <svg
              width="600"
              height="600"
              viewBox="0 0 600 600"
              fill="none"
              className="opacity-[0.07]"
            >
              <circle cx="300" cy="300" r="280" stroke="var(--color-paper)" strokeWidth="1" />
              <circle cx="300" cy="300" r="220" stroke="var(--color-paper)" strokeWidth="1" strokeDasharray="3 8" />
              <circle cx="300" cy="300" r="160" stroke="var(--color-paper)" strokeWidth="1" />
              <circle cx="300" cy="300" r="100" stroke="var(--color-paper)" strokeWidth="1" strokeDasharray="3 8" />
              <circle cx="300" cy="300" r="40" stroke="var(--color-paper)" strokeWidth="1.5" fill="var(--color-paper)" fillOpacity="0.05" />
            </svg>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[var(--color-paper)]/10 relative">
            {impactCircles.map((circle, idx) => {
              const Icon = LEVEL_ICONS[idx];
              const isNucleus = idx === 0;
              return (
                <motion.div
                  key={circle.level}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: idx * 0.08 }}
                  className={cn(
                    "group bg-[var(--color-ink)] p-7 md:p-8 min-h-[340px] flex flex-col justify-between hover:bg-[var(--color-moss-900)] transition-colors duration-500",
                    isNucleus && "lg:bg-[var(--color-moss-900)]",
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          isNucleus ? "text-[var(--color-paper)]" : "text-[var(--color-paper)]/70",
                        )}
                        strokeWidth={1.5}
                      />
                      <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-paper)]/30">
                        {circle.level}
                      </span>
                    </div>
                    <div className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-paper)]/55 mb-3">
                      {locale === "es" ? circle.whoEs : circle.whoEn}
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--color-paper)] mb-4 leading-tight">
                      {locale === "es" ? circle.titleEs : circle.titleEn}
                    </h3>
                  </div>

                  <p className="text-sm text-[var(--color-paper)]/75 leading-relaxed text-pretty">
                    {locale === "es" ? circle.bodyEs : circle.bodyEn}
                  </p>

                  <div
                    className={cn(
                      "mt-6 h-px origin-left transition-transform duration-700",
                      isNucleus ? "scale-x-100 bg-[var(--color-paper)]" : "scale-x-50 bg-[var(--color-paper)]/40 group-hover:scale-x-100",
                    )}
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
