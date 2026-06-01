"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Calendar,
  MapPin,
  Users,
  Droplets,
  Flame,
  Wind,
  Mountain,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import {
  retreats,
  retreatStatus,
  type RetreatInfo,
  type ElementKey,
} from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { formatPriceMXN, formatDate, cn } from "@/lib/utils";

const ELEMENT_ICONS: Record<ElementKey, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  agua: Droplets,
  fuego: Flame,
  aire: Wind,
  tierra: Mountain,
};

export function RetreatsShowcase({
  locale,
  dict,
  limit,
  hideHeader,
}: {
  locale: Locale;
  dict: Dict;
  limit?: number;
  hideHeader?: boolean;
}) {
  const list = limit ? retreats.slice(0, limit) : retreats;

  return (
    <section className="py-24 md:py-36 bg-[var(--color-paper)] overflow-hidden">
      <Container>
        {!hideHeader && (
          <div className="grid lg:grid-cols-12 gap-12 items-end mb-16 md:mb-20">
            <div className="lg:col-span-7">
              <Eyebrow className="mb-6">{dict.home.retreatsEyebrow}</Eyebrow>
              <h2 className="display-2 text-balance">
                {dict.home.retreatsTitle}
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="lead text-pretty">{dict.home.retreatsLead}</p>
              <div className="mt-6">
                <Link
                  href={`/${locale}/${locale === "es" ? "retiros" : "retreats"}`}
                  className="group inline-flex items-center gap-2 text-sm text-[var(--color-ink)] border-b border-[var(--color-ink)]/30 pb-1 hover:border-[var(--color-ink)] transition-colors"
                >
                  {locale === "es" ? "Calendario completo" : "Full calendar"}
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {list.map((r, idx) => (
            <RetreatCard
              key={r.id}
              r={r}
              locale={locale}
              dict={dict}
              idx={idx}
              featured={idx === 0}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function RetreatCard({
  r,
  locale,
  dict,
  idx,
  featured,
}: {
  r: RetreatInfo;
  locale: Locale;
  dict: Dict;
  idx: number;
  featured?: boolean;
}) {
  const status = retreatStatus(r);
  const name = locale === "es" ? r.nameEs : r.nameEn;
  const modality = locale === "es" ? r.modalityEs : r.modalityEn;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative bg-[var(--color-paper-warm)] overflow-hidden lift",
        featured && "md:col-span-2 md:flex md:flex-row",
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative overflow-hidden",
          featured ? "aspect-[16/10] md:aspect-auto md:w-1/2 md:min-h-[480px]" : "aspect-[4/3]",
        )}
      >
        <Image
          src={r.image}
          alt={name}
          fill
          sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 50vw"}
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/60 via-[var(--color-ink)]/10 to-transparent" />

        {/* Top metadata */}
        <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
          <span className="inline-flex items-center gap-2 bg-[var(--color-paper)]/90 backdrop-blur-sm px-3 py-1.5 text-[0.7rem] tracking-[0.18em] uppercase text-[var(--color-ink)]">
            {String(idx + 1).padStart(2, "0")} · {modality}
          </span>
          <StatusBadge status={status} dict={dict} />
        </div>

        {/* Bottom title */}
        <div className="absolute bottom-5 left-5 right-5 text-[var(--color-paper)]">
          <div className="text-[0.7rem] tracking-[0.22em] uppercase opacity-80 mb-2">
            {formatDate(r.startDate, locale)} — {formatDate(r.endDate, locale).split(" ").slice(0, 2).join(" ")}
          </div>
          <h3 className={cn("font-[family-name:var(--font-display)] leading-tight", featured ? "text-3xl md:text-4xl" : "text-2xl")}>
            {name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className={cn("p-7 md:p-8", featured && "md:w-1/2 md:flex md:flex-col md:justify-between")}>
        {/* Element icons */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[0.7rem] tracking-[0.18em] uppercase text-[var(--color-muted)]">
            {locale === "es" ? "Elementos" : "Elements"}
          </span>
          <div className="flex items-center gap-1.5">
            {r.elementsCovered.map((k) => {
              const Icon = ELEMENT_ICONS[k];
              return (
                <span
                  key={k}
                  className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-[var(--color-paper)]"
                >
                  <Icon className="h-3.5 w-3.5 text-[var(--color-ink-soft)]" strokeWidth={1.5} />
                </span>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <Row icon={MapPin} text={r.location} />
          <Row icon={Users} text={`${r.sold}/${r.capacity} ${locale === "es" ? "participantes" : "participants"}`} />
          <Row icon={Calendar} text={`${formatDate(r.startDate, locale)} — ${formatDate(r.endDate, locale)}`} />
        </div>

        <div className="flex items-end justify-between gap-4 pt-5 border-t border-[var(--color-line)]">
          <div>
            <div className="text-[0.65rem] uppercase tracking-wide text-[var(--color-muted)]">
              {locale === "es" ? "Desde" : "From"}
            </div>
            <div className="font-[family-name:var(--font-display)] text-2xl mt-0.5">
              {formatPriceMXN(r.priceMxn)}
            </div>
            <div className="text-[0.65rem] uppercase tracking-wide text-[var(--color-muted)] mt-0.5">
              {dict.common.noVat}
            </div>
          </div>

          <Button
            href={`/${locale}/${locale === "es" ? "retiros" : "retreats"}/${r.id}`}
            size="sm"
            trailingArrow
            variant={status.kind === "closed" ? "secondary" : "primary"}
          >
            {status.kind === "closed"
              ? locale === "es"
                ? "Lista de espera"
                : "Waitlist"
              : locale === "es"
                ? "Reservar"
                : "Book"}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

function Row({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; text: string }) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-[var(--color-ink-soft)]">
      <Icon className="h-4 w-4 mt-0.5 text-[var(--color-muted)] shrink-0" strokeWidth={1.5} />
      <span>{text}</span>
    </div>
  );
}

function StatusBadge({
  status,
  dict,
}: {
  status: ReturnType<typeof retreatStatus>;
  dict: Dict;
}) {
  if (status.kind === "open") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-[var(--color-paper)]/90 backdrop-blur-sm px-3 py-1.5 text-[0.7rem] tracking-[0.18em] uppercase text-[var(--color-moss-700)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-moss-500)] animate-pulse" />
        {dict.retreats.status.open}
      </span>
    );
  }
  if (status.kind === "low") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-[var(--color-fire)]/95 backdrop-blur-sm px-3 py-1.5 text-[0.7rem] tracking-[0.18em] uppercase text-[var(--color-paper)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-paper)] animate-pulse" />
        {dict.retreats.status.lowSeats.replace("{n}", String(status.left))}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 bg-[var(--color-ink)]/80 backdrop-blur-sm px-3 py-1.5 text-[0.7rem] tracking-[0.18em] uppercase text-[var(--color-paper)]/80">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-paper)]/60" />
      {dict.retreats.status.closed}
    </span>
  );
}
