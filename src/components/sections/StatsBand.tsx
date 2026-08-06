"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { stats as staticStats, type StatInfo } from "@/data/content";
import { Container } from "@/components/ui/Container";

/**
 * Evidence band — every claim is verified against its primary source and
 * links to it. A large metric + a sentence + a clickable citation per row.
 * (Replaces the old animated count-up, which couldn't hold qualitative
 * findings or citations.)
 */
export function StatsBand({
  locale,
  stats,
}: {
  locale: Locale;
  stats?: StatInfo[];
}) {
  const es = locale === "es";
  const effectiveStats = stats && stats.length > 0 ? stats : staticStats;
  return (
    <section className="bg-[var(--color-ink)] text-[var(--color-paper)] py-20 md:py-28 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 30% 40%, rgba(74,86,64,0.4) 0%, transparent 70%)",
        }}
      />

      <Container className="relative">
        <div className="mb-12 md:mb-16 max-w-2xl">
          <div className="eyebrow text-[var(--color-gold-soft)] mb-5">
            {es ? "La evidencia" : "The evidence"}
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1] tracking-tight text-balance">
            {es
              ? "No es intuición. Es lo que la ciencia ya documentó."
              : "Not intuition. What the science already documented."}
          </h2>
        </div>

        <div className="border-t border-[var(--color-paper)]/15">
          {effectiveStats.map((s, idx) => (
            <motion.a
              key={idx}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.3) }}
              className="group grid grid-cols-[100px_1fr] md:grid-cols-[160px_1fr_auto] gap-4 md:gap-8 py-6 md:py-7 border-b border-[var(--color-paper)]/15 items-baseline hover:bg-[var(--color-paper)]/5 transition-colors"
            >
              <span className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-[var(--color-gold-soft)] tabular-nums leading-none">
                {es ? s.metricEs : s.metricEn}
              </span>
              <span className="text-[var(--color-paper)]/95 leading-relaxed text-pretty md:text-lg">
                {es ? s.labelEs : s.labelEn}
              </span>
              <span className="col-span-2 md:col-span-1 flex items-center gap-1.5 text-[0.72rem] tracking-wide uppercase text-[var(--color-paper)]/55 group-hover:text-[var(--color-gold-soft)] transition-colors md:text-right md:justify-end">
                {s.source}
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </motion.a>
          ))}
        </div>
      </Container>
    </section>
  );
}
