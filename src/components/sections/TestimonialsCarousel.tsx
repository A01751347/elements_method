"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { testimonials } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";

/**
 * Testimonials — editorial, typographic. No author photos (the brand has few
 * real testimonials; stock portraits read as inauthentic). The quote itself is
 * the hero; attribution is set in type. Carousel controls appear only when
 * there is more than one testimonial.
 */
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
  const multiple = testimonials.length > 1;

  React.useEffect(() => {
    if (paused || !multiple) return;
    const t = window.setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % testimonials.length);
    }, 8000);
    return () => window.clearInterval(t);
  }, [paused, multiple]);

  function go(delta: number) {
    setDirection(delta);
    setIndex((i) => (i + delta + testimonials.length) % testimonials.length);
  }

  if (!hasTestimonials) return null;

  const current = testimonials[index];

  return (
    <section
      className="bg-[var(--color-paper-deep)] py-24 md:py-36 relative overflow-hidden paper-grain"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow className="mb-9 justify-center">
            {dict.home.testimonialsEyebrow}
          </Eyebrow>

          <Quote
            className="mx-auto h-9 w-9 text-[var(--color-gold)] mb-8"
            strokeWidth={1.25}
            aria-hidden
          />

          <div className="relative min-h-[220px] md:min-h-[260px] flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.figure
                key={current.id}
                custom={direction}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <blockquote className="font-[family-name:var(--font-display)] text-[clamp(1.6rem,3.4vw,3rem)] leading-[1.22] tracking-tight text-[var(--color-ink)] text-balance">
                  {locale === "es" ? current.quoteEs : current.quoteEn}
                </blockquote>

                <figcaption className="mt-10 flex flex-col items-center">
                  <span
                    aria-hidden
                    className="block h-px w-10 bg-[var(--color-gold-deep)] mb-5"
                  />
                  <span className="font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)]">
                    {current.authorName}
                  </span>
                  {(current.authorRole || current.company) && (
                    <span className="mt-1 text-sm text-[var(--color-ink-soft)]">
                      {current.authorRole}
                      {current.authorRole && current.company ? " · " : ""}
                      {current.company}
                    </span>
                  )}
                  {current.pathTaken && (
                    <span className="mt-3 text-[0.68rem] tracking-[0.22em] uppercase text-[var(--color-eter-ink)]">
                      {locale === "es" ? "Camino" : "Path"} · {current.pathTaken}
                    </span>
                  )}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {multiple && (
            <div className="mt-14 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous"
                className="h-11 w-11 inline-flex items-center justify-center border border-[var(--color-ink)]/20 hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] hover:border-[var(--color-ink)] transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2">
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
                          ? "w-10 bg-[var(--color-ink)]"
                          : "w-5 bg-[var(--color-ink)]/25 group-hover:bg-[var(--color-ink)]/50"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next"
                className="h-11 w-11 inline-flex items-center justify-center border border-[var(--color-ink)]/20 hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] hover:border-[var(--color-ink)] transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
