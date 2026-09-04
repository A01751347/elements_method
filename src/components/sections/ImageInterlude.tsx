"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

/**
 * Full-bleed cinematic image band with parallax — used as a breathing,
 * "chapter divider" between text-heavy sections to give the page visual rhythm.
 * Carries an AAA text-protection scrim so the overlaid line stays readable over
 * any photo. The quote/eyebrow strings are passed already localized.
 */
export function ImageInterlude({
  image,
  eyebrow,
  quote,
  height = "tall",
  scrim = "normal",
}: {
  image: string;
  eyebrow?: string;
  quote: string;
  height?: "tall" | "medium";
  /** "strong" para fotos muy claras (un mar de nubes se come el texto blanco). */
  scrim?: "normal" | "strong";
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["-14%", "14%"],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [1, 1] : [1.18, 1],
  );

  return (
    <section
      ref={ref}
      className={cn(
        "relative overflow-hidden flex items-center justify-center text-[var(--color-paper)]",
        height === "tall" ? "min-h-[78vh]" : "min-h-[56vh]",
      )}
    >
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 -z-20 will-change-transform"
      >
        <Image src={image} alt="" fill sizes="100vw" className="object-cover" />
      </motion.div>

      {/* AAA scrim — uniform base + center-weighted radial so large text clears
          contrast while the photo still breathes at the edges */}
      <div
        className={cn(
          "absolute inset-0 -z-10",
          scrim === "strong"
            ? "bg-[var(--color-ink)]/70"
            : "bg-[var(--color-ink)]/55",
        )}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse 80% 65% at 50% 50%, color-mix(in srgb, var(--color-ink) ${
            scrim === "strong" ? 60 : 55
          }%, transparent) 0%, transparent 72%)`,
        }}
      />
      <div className="absolute inset-0 -z-10 film-grain pointer-events-none" />

      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          {eyebrow && (
            <div className="eyebrow text-[var(--color-paper)] mb-7 flex items-center justify-center gap-3">
              <span
                aria-hidden
                className="h-px w-10 bg-[var(--color-paper)]/50"
              />
              {eyebrow}
              <span
                aria-hidden
                className="h-px w-10 bg-[var(--color-paper)]/50"
              />
            </div>
          )}
          <p className="font-[family-name:var(--font-display)] italic font-light text-[clamp(1.75rem,4vw,3.5rem)] leading-[1.18] text-balance text-[var(--color-paper)]">
            “{quote}”
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
