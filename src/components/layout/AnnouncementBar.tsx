"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getNextExperience, isEarlyAccessActive } from "@/data/experiences";

/**
 * Announcement bar — the fastest sales path on the site.
 *
 * Fixed above the header (the header sits at `top-10` and `<main>` carries the
 * extra padding, see the locale layout). Always shows the nearest upcoming
 * experience with its date and a direct link to its landing; when the early
 * price is still live it also shows the deadline and a day counter.
 *
 * The counter is computed AFTER mount on purpose: "faltan 3 días" depends on
 * the reader's clock, and rendering it on the server would ship a stale number
 * baked into the static HTML.
 */
export function AnnouncementBar({ locale }: { locale: Locale }) {
  const next = getNextExperience();
  const early = next ? isEarlyAccessActive(next) : false;
  const [daysLeft, setDaysLeft] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!next?.earlyDeadlineIso || !early) return;
    const deadline = new Date(`${next.earlyDeadlineIso}T23:59:59-06:00`).getTime();
    const days = Math.ceil((deadline - Date.now()) / 86_400_000);
    setDaysLeft(days > 0 ? days : 0);
  }, [next?.earlyDeadlineIso, early]);

  if (!next) return null;

  const es = locale === "es";
  const href = `/${locale}/${es ? "retiros" : "retreats"}/${next.slug}`;
  const cta =
    next.ctaMode === "checkout"
      ? es
        ? "Reserva tu lugar"
        : "Reserve your seat"
      : es
        ? "Solicita tu invitación"
        : "Request an invitation";

  const counter =
    daysLeft === null
      ? null
      : daysLeft === 0
        ? es
          ? "último día"
          : "last day"
        : daysLeft === 1
          ? es
            ? "queda 1 día"
            : "1 day left"
          : es
            ? `quedan ${daysLeft} días`
            : `${daysLeft} days left`;

  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-10 bg-[var(--color-ink)] text-[var(--color-paper)] print:hidden">
      <Link
        href={href}
        className="group h-full mx-auto max-w-7xl px-5 sm:px-8 flex items-center justify-center gap-x-3 gap-y-0 text-[0.72rem] sm:text-[0.78rem] hover:bg-[var(--color-ink-soft)]/30 transition-colors"
      >
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-[var(--color-gold-soft)]" strokeWidth={1.5} />

        <span className="font-medium tracking-[0.12em] uppercase shrink-0">
          {next.title}
        </span>

        <span aria-hidden className="hidden sm:inline text-[var(--color-paper)]/35">
          ·
        </span>
        <span className="hidden sm:inline text-[var(--color-paper)]/85 truncate">
          {es ? next.dateLabel.es : next.dateLabel.en}
        </span>

        {early && next.earlyLabel && (
          <>
            <span aria-hidden className="hidden md:inline text-[var(--color-paper)]/35">
              ·
            </span>
            <span className="hidden md:inline text-[var(--color-gold-soft)] truncate">
              {es ? next.earlyLabel.es : next.earlyLabel.en}
              {counter && (
                <span className="ml-2 bg-[var(--color-gold)]/20 px-2 py-0.5 uppercase tracking-[0.12em] text-[0.62rem]">
                  {counter}
                </span>
              )}
            </span>
          </>
        )}

        <span className="ml-1 inline-flex items-center gap-1 shrink-0 border-b border-[var(--color-paper)]/40 group-hover:border-[var(--color-paper)] transition-colors">
          {cta}
          <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
      </Link>
    </div>
  );
}
