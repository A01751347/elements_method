"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { testimonials } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";

export function TestimonialsCarousel({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [paused, setPaused] = React.useState(false);
  const hasTestimonials = testimonials.length > 0;

  React.useEffect(() => {
    if (paused || !hasTestimonials) return;
    const t = window.setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % testimonials.length);
    }, 7000);
    return () => window.clearInterval(t);
  }, [paused, hasTestimonials]);

  function go(delta: number) {
    setDirection(delta);
    setIndex((i) => (i + delta + testimonials.length) % testimonials.length);
  }

  if (!hasTestimonials) return null;

  const current = testimonials[index];

  return (
    <section
      className="bg-[var(--color-paper-deep)] py-24 md:py-36 relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 mb-14 md:mb-20 items-end">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6">{dict.home.testimonialsEyebrow}</Eyebrow>
            <h2 className="display-2 text-balance">
              {dict.home.testimonialsTitle}
            </h2>
          </div>
          <div className="lg:col-span-5 flex lg:justify-end items-end gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous"
              className="h-12 w-12 inline-flex items-center justify-center border border-[var(--color-line)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] hover:border-[var(--color-ink)] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next"
              className="h-12 w-12 inline-flex items-center justify-center border border-[var(--color-line)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] hover:border-[var(--color-ink)] transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Photo column */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-paper-warm)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${current.id}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  {current.image && (
                    <Image
                      src={current.image}
                      alt={current.authorName ?? ""}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/40 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Bottom name plate */}
              <div className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between text-[var(--color-paper)]">
                <div>
                  <div className="text-[0.7rem] tracking-[0.22em] uppercase opacity-70 mb-1">
                    {locale === "es" ? "Camino" : "Path"} · {current.pathTaken}
                  </div>
                  <div className="font-[family-name:var(--font-display)] text-2xl">
                    {current.authorName}
                  </div>
                  <div className="text-sm opacity-80">
                    {current.authorRole} · {current.company}
                  </div>
                </div>
              </div>
            </div>

            {/* Indicators */}
            <div className="mt-6 flex items-center gap-3">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  aria-label={`Go to ${i + 1}`}
                  className="group h-6 flex items-center"
                >
                  <span
                    className={`block h-px transition-all ${
                      i === index
                        ? "w-12 bg-[var(--color-ink)]"
                        : "w-6 bg-[var(--color-ink)]/20 group-hover:bg-[var(--color-ink)]/50"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-auto text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-muted)] tabular-nums">
                {String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Quote column */}
          <div className="lg:col-span-7 relative">
            <Quote
              className="absolute -top-6 -left-3 h-16 w-16 text-[var(--color-ink)]/8"
              aria-hidden
            />
            <div className="relative min-h-[360px] flex items-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.figure
                  key={current.id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <blockquote className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,3vw,2.5rem)] leading-snug text-[var(--color-ink)] text-balance">
                    “{locale === "es" ? current.quoteEs : current.quoteEn}”
                  </blockquote>
                </motion.figure>
              </AnimatePresence>
            </div>

            {/* Auto-advance bar */}
            <div className="mt-8 h-px bg-[var(--color-ink)]/10 relative overflow-hidden">
              <motion.div
                key={`bar-${index}-${paused}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: paused ? 0 : 1 }}
                transition={{ duration: paused ? 0 : 7, ease: "linear" }}
                className="absolute inset-0 bg-[var(--color-moss-700)] origin-left"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
