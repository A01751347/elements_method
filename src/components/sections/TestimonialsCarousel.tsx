"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { testimonials as staticTestimonials, type Testimonial } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";

/**
 * Testimonials — editorial, typographic. No author photos (the brand has few
 * real testimonials; stock portraits read as inauthentic). The quote itself is
 * the hero; attribution is set in type. Carousel controls appear only when
 * there is more than one testimonial.
 *
 * Las citas reales van de 120 a 450 caracteres, así que el tamaño de la cita es
 * moderado (hasta 1.7rem, no 3rem) y las siete se apilan en una sola celda de
 * grid: la altura de la sección la fija la más larga y no cambia al rotar.
 */
export function TestimonialsCarousel({
  locale,
  dict,
  testimonials: testimonialsProp,
}: {
  locale: Locale;
  dict: Dict;
  testimonials?: Testimonial[];
}) {
  const testimonials =
    testimonialsProp && testimonialsProp.length > 0
      ? testimonialsProp
      : staticTestimonials;
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const hasTestimonials = testimonials.length > 0;
  const multiple = testimonials.length > 1;

  React.useEffect(() => {
    if (paused || !multiple) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 8000);
    return () => window.clearInterval(t);
  }, [paused, multiple]);

  function go(delta: number) {
    setIndex((i) => (i + delta + testimonials.length) % testimonials.length);
  }

  if (!hasTestimonials) return null;

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

          {/* Todos los testimonios ocupan la MISMA celda de grid: la altura de
           *  la sección la fija el más largo y ya no salta al cambiar de cita.
           *  Antes era un min-h fijo, que las citas largas desbordaban y las
           *  cortas no llenaban. */}
          <div className="grid">
            {testimonials.map((t, i) => {
              const active = i === index;
              return (
                <motion.figure
                  key={t.id}
                  aria-hidden={!active}
                  initial={false}
                  animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  style={{ pointerEvents: active ? "auto" : "none" }}
                  className="[grid-area:1/1] flex flex-col justify-center"
                >
                  <blockquote className="font-[family-name:var(--font-display)] text-[clamp(1.2rem,1.8vw,1.7rem)] leading-[1.45] tracking-tight text-[var(--color-ink)] text-pretty">
                    {locale === "es" ? t.quoteEs : t.quoteEn}
                  </blockquote>

                  <figcaption className="mt-9 flex flex-col items-center">
                    <span
                      aria-hidden
                      className="block h-px w-10 bg-[var(--color-gold-deep)] mb-5"
                    />
                    <span className="font-[family-name:var(--font-display)] text-lg text-[var(--color-ink)]">
                      {t.authorName}
                    </span>
                    {(t.authorRole || t.company) && (
                      <span className="mt-1 text-sm text-[var(--color-ink-soft)]">
                        {t.authorRole}
                        {t.authorRole && t.company ? " · " : ""}
                        {t.company}
                      </span>
                    )}
                    {t.pathTaken && (
                      <span className="mt-3 text-[0.68rem] tracking-[0.22em] uppercase text-[var(--color-eter-ink)]">
                        {locale === "es" ? "Camino" : "Path"} · {t.pathTaken}
                      </span>
                    )}
                  </figcaption>
                </motion.figure>
              );
            })}
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
                    onClick={() => setIndex(i)}
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
