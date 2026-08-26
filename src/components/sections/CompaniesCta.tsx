"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { calLink, CAL_EVENT_TYPES } from "@/shared/integrations/cal";

/**
 * Companies CTA — narrative band, no imagery.
 * Distinct from FinalCta (full-bleed photo + parallax) and from
 * CompaniesCta-on-companies-page (which has the form card).
 */
export function CompaniesCta({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  const base = `/${locale}`;
  return (
    <section className="py-24 md:py-36 bg-[var(--color-paper-deep)] relative overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-1 flex lg:flex-col items-start"
          >
            <span className="text-[0.7rem] tracking-[0.28em] uppercase text-[var(--color-muted)] lg:rotate-90 lg:origin-bottom-left lg:translate-y-12 whitespace-nowrap">
              {dict.home.companiesEyebrow}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-8"
          >
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.05] tracking-tight text-balance">
              {dict.home.companiesTitle}
            </h2>
            <p className="mt-8 text-lg text-[var(--color-ink-soft)] leading-relaxed text-pretty max-w-3xl">
              {dict.home.companiesLead}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-3 lg:pt-2"
          >
            <Button
              href={calLink(CAL_EVENT_TYPES.discoveryEnterprise)}
              size="lg"
              trailingArrow
              className="w-full"
            >
              {dict.home.companiesCta}
            </Button>
            <a
              href="mailto:hello@elementsmethod.com"
              className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--color-ink)] border-b border-[var(--color-ink)]/30 pb-0.5 hover:border-[var(--color-ink)] transition-colors"
            >
              hello@elementsmethod.com
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        </div>

        {/* Bottom rule with the four element badges as visual signature */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 pt-8 border-t border-[var(--color-line)] flex flex-wrap items-center justify-between gap-6"
        >
          <div className="flex items-center gap-6 text-[0.72rem] tracking-[0.22em] uppercase text-[var(--color-muted)]">
            <span>Water</span>
            <span aria-hidden>·</span>
            <span>Fire</span>
            <span aria-hidden>·</span>
            <span>Air</span>
            <span aria-hidden>·</span>
            <span>Earth</span>
          </div>
          <span className="text-[0.72rem] tracking-[0.22em] uppercase text-[var(--color-muted)]">
            Leadership Immersion Programs
          </span>
        </motion.div>
      </Container>
    </section>
  );
}
