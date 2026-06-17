"use client";

import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/ui/Container";

export function PhilosophyStrip({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Brand-line opening from pptx slide 3+7 verbatim
  const phrase =
    locale === "es"
      ? "El Elements Method devuelve a los ejecutivos a su fuente instintiva de poder. A través de experiencias inmersivas en entornos naturales, los líderes descubren las cuatro fuerzas fundamentales que moldean el liderazgo resiliente, auténtico y efectivo."
      : "The Elements Method brings executives back to their instinctive source of power. Through immersive experiences in natural environments, leaders discover the four fundamental forces that shape resilient, authentic, and effective leadership.";

  const closingEs = "Esto no es un retiro. Es un regreso.";
  const closingEn = "This is not a retreat. This is a return.";

  const words = phrase.split(" ");

  return (
    <section
      ref={ref}
      className="bg-[var(--color-paper)] py-32 md:py-48 relative paper-grain overflow-hidden"
    >
      {/* Background big number — the "Núcleo" represented as 01 */}
      <motion.div
        style={{
          y: useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]),
        }}
        aria-hidden
        className="absolute -top-12 -right-12 md:-right-24 pointer-events-none select-none opacity-[0.04] font-[family-name:var(--font-display)] text-[28rem] leading-none font-light"
      >
        01
      </motion.div>

      <Container>
        <div className="max-w-5xl">
          <div className="eyebrow mb-10 flex items-center gap-3">
            <span aria-hidden className="h-px w-12 bg-[var(--color-ink)]/30" />
            {locale === "es" ? "La filosofía" : "The philosophy"}
          </div>

          {/* Headline — the brand tagline */}
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] tracking-tight text-balance mb-12">
            {locale === "es"
              ? "La naturaleza no gestiona. La naturaleza lidera."
              : "Nature doesn't manage. Nature leads."}
          </h2>

          {/* Body — word-by-word reveal */}
          <p className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.25] tracking-tight text-balance text-[var(--color-ink-soft)]">
            {words.map((w, i) => (
              <Fragment key={i}>
                <motion.span
                  initial={{ opacity: 0.15 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false, margin: "-200px 0px -200px 0px" }}
                  transition={{ duration: 0.6, delay: i * 0.018, ease: "easeOut" }}
                  className="inline-block"
                >
                  {w}
                </motion.span>
                {/* real space so words don't run together (and copy/SEO/a11y work) */}
                {i < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </p>

          {/* Closing italic */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 font-[family-name:var(--font-display)] italic text-[clamp(1.5rem,3.5vw,3rem)] text-[var(--color-gold-deep)]"
          >
            {locale === "es" ? closingEs : closingEn}
          </motion.p>

          <div className="mt-16 grid sm:grid-cols-3 gap-8 max-w-3xl">
            {(locale === "es"
              ? [
                  { k: "Insight", v: "La calidad de nuestras decisiones depende del estado interno desde donde pensamos." },
                  { k: "Intervención", v: "No añadimos herramientas. Transformamos el sistema interno desde donde se decide." },
                  { k: "Stack", v: "Neurociencia, NLP, coaching internacional, frameworks estratégicos y práctica somática." },
                ]
              : [
                  { k: "Insight", v: "The quality of our decisions depends on the inner state we think from." },
                  { k: "Intervention", v: "We don't add tools. We transform the inner system you decide from." },
                  { k: "Stack", v: "Neuroscience, NLP, international coaching, strategic frameworks, somatic practice." },
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
