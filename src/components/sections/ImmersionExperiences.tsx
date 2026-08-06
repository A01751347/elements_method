"use client";

import { motion } from "motion/react";
import { Droplets, Flame, Wind, Mountain, Sparkles } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { elements as staticElements, type ElementInfo } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";

/**
 * Immersion Experiences section — verbatim from
 * elements-website-content.pptx slide 5:
 *
 *   The Immersion Experience
 *   Activities will vary and will be different in each retreat generation event.
 *   · Water Element — Riverine Reflection & Deep Listening
 *   · Fire Element — Vision Ceremony
 *   · Air Element — Summit Perspective
 *   · Earth Element — Forest Grounding & Roots Ritual
 *
 * Visually distinct from PracticesGallery (editorial index of 8 exercises)
 * and from RetreatsShowcase (image cards). Uses minimal letterpress layout.
 */
export function ImmersionExperiences({
  locale,
  dict,
  elements,
}: {
  locale: Locale;
  dict: Dict;
  elements?: ElementInfo[];
}) {
  const effectiveElements =
    elements && elements.length > 0 ? elements : staticElements;
  return (
    <section className="py-24 md:py-36 bg-[var(--color-paper-warm)] paper-grain relative overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6">{dict.home.experienceEyebrow}</Eyebrow>
            <h2 className="display-2 text-balance">
              {dict.home.experienceTitle}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="lead text-pretty">{dict.home.experienceLead}</p>
          </div>
        </div>

        {/* Vertical stacked entries with element accent — all five elements */}
        <div className="border-y-2 border-[var(--color-ink)]/15">
          {effectiveElements.map((el, idx) => {
            const Icon =
              el.key === "agua"
                ? Droplets
                : el.key === "fuego"
                  ? Flame
                  : el.key === "aire"
                    ? Wind
                    : el.key === "tierra"
                      ? Mountain
                      : Sparkles;
            const name = locale === "es" ? el.nameEs : el.nameEn;
            const experience =
              locale === "es" ? el.experienceEs : el.experienceEn;
            const quote = locale === "es" ? el.quoteEs : el.quoteEn;
            return (
              <motion.article
                key={el.key}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group border-b border-[var(--color-line)] last:border-b-0 py-10 md:py-12 grid grid-cols-[40px_1fr] md:grid-cols-[80px_240px_minmax(0,1fr)_60px] gap-x-6 md:gap-x-10 items-start hover:bg-[var(--color-paper)]/50 transition-colors"
              >
                {/* Index */}
                <div className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-[var(--color-ink)]/15 group-hover:text-[var(--color-ink)]/30 transition-colors tabular-nums">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                {/* Element name + framework */}
                <div className="col-span-2 md:col-span-1">
                  <div className="flex items-center gap-2.5 mb-2">
                    <Icon
                      className={`h-4 w-4 ${el.animClass}`}
                      strokeWidth={1.5}
                      style={{ color: el.accentInk }}
                    />
                    <span
                      className="text-[0.65rem] tracking-[0.22em] uppercase font-medium"
                      style={{ color: el.accentInk }}
                    >
                      {locale === "es" ? `Elemento ${name}` : `${name} Element`}
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,2.5vw,2.25rem)] tracking-tight leading-tight italic">
                    {experience}
                  </h3>
                </div>

                {/* Quote */}
                <blockquote className="col-span-2 md:col-span-1 text-[var(--color-ink-soft)] leading-relaxed italic font-[family-name:var(--font-display)] text-lg md:text-xl max-w-md mt-2">
                  “{quote}”
                </blockquote>

                {/* Framework badge */}
                <div className="hidden md:flex justify-end text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-muted)] pt-3">
                  {el.framework}
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
