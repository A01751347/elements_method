"use client";

import { motion } from "motion/react";
import type { Locale } from "@/i18n/config";
import { communitySection } from "@/data/content";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";

/**
 * Community section — elements-web-content.docx Section 7.
 * Aspirational, not transactional. Sits near the bottom of the homepage.
 * The 5 Circles of Impact ("The Ripple") already live in SeasonsRhythm.
 */
export function CommunitySection({
  locale,
  section,
}: {
  locale: Locale;
  section?: typeof communitySection;
}) {
  const s = section ?? communitySection;
  const es = locale === "es";
  const paragraphs = (es ? s.bodyEs : s.bodyEn).split("\n\n");
  return (
    <section className="bg-[var(--color-ink)] text-[var(--color-paper)] py-28 md:py-40 relative overflow-hidden">
      {/* Un círculo real de gente al fondo: la sección hablaba de comunidad
       *  sin mostrar una sola persona. La foto se queda a la derecha y muy
       *  velada — el texto sigue cayendo sobre tinta casi plena. */}
      <div aria-hidden className="absolute inset-y-0 right-0 w-full lg:w-[62%] pointer-events-none">
        <Image
          src="/images/sections/comunidad.jpg"
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 62vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[var(--color-ink)]/86" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-ink)] via-[var(--color-ink)]/70 to-transparent" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 55% at 70% 40%, rgba(107,91,149,0.35) 0%, transparent 70%)",
        }}
      />
      <Container className="relative">
        <div className="max-w-4xl">
          <Eyebrow inverted className="mb-8">
            {es ? s.eyebrowEs : s.eyebrowEn}
          </Eyebrow>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="font-[family-name:var(--font-display)] text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.1] tracking-tight text-balance text-[var(--color-paper)]"
          >
            {es ? s.headlineEs : s.headlineEn}
          </motion.h2>
          <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-3xl">
            {paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                className="text-[var(--color-paper)]/90 leading-relaxed text-pretty"
              >
                {p}
              </motion.p>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
