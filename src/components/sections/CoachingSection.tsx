"use client";

import { motion } from "motion/react";
import type { Locale } from "@/i18n/config";
import { coachingSection } from "@/data/content";
import type { CoachingSection as CoachingSectionData } from "@/modules/content/siteSections";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";

/**
 * Coaching section — elements-web-content.docx Section 6.
 * "An immersion opens the door. Sustained coaching is what ensures the leader
 *  crosses." One clean band: headline + body + a row per group program.
 */
export function CoachingSection({
  locale,
  section,
}: {
  locale: Locale;
  section?: CoachingSectionData;
}) {
  const s = section ?? coachingSection;
  const es = locale === "es";
  return (
    <section className="bg-[var(--color-paper)] py-24 md:py-36 paper-grain relative overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6">{es ? s.eyebrowEs : s.eyebrowEn}</Eyebrow>
            <h2 className="display-2 text-balance">
              {es ? s.headlineEs : s.headlineEn}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-3">
            <p className="lead text-pretty text-[var(--color-ink-soft)]">
              {es ? s.bodyEs : s.bodyEn}
            </p>
          </div>
        </div>

        <div className="border-t border-[var(--color-line)]">
          {s.items.map((item, idx) => {
            const [focus, logistics] = (es ? item.bodyEs : item.bodyEn).split(
              "\n\n",
            );
            return (
              <motion.div
                key={item.titleEs}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="grid md:grid-cols-[220px_1fr] gap-4 md:gap-10 py-8 border-b border-[var(--color-line)] items-baseline"
              >
                <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-tight">
                  {es ? item.titleEs : item.titleEn}
                </h3>
                <div className="space-y-2">
                  <p className="text-[var(--color-ink-soft)] leading-relaxed">
                    {focus}
                  </p>
                  {logistics && (
                    <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
                      {logistics}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
