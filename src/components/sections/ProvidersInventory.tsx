"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Layers,
  Droplets,
  Flame,
  Wind,
  Mountain,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import { Section, Eyebrow } from "@/components/ui/Section";
import { providersInventory, type ProviderInfo } from "@/data/launchData";
import { elements, type ElementKey } from "@/data/content";

const ICONS: Record<ElementKey, LucideIcon> = {
  agua: Droplets,
  fuego: Flame,
  aire: Wind,
  tierra: Mountain,
  eter: Sparkles,
};

const STATUS_LABEL: Record<
  ProviderInfo["status"],
  { es: string; en: string; dotClass: string }
> = {
  confirmed: { es: "Confirmado", en: "Confirmed", dotClass: "bg-emerald-500" },
  "in-contact": {
    es: "En conversación",
    en: "In conversation",
    dotClass: "bg-amber-500",
  },
  pending: { es: "Pendiente", en: "Pending", dotClass: "bg-orange-500" },
  researching: {
    es: "En búsqueda",
    en: "Researching",
    dotClass: "bg-zinc-400",
  },
};

const ELEMENT_FILTERS: { key: ElementKey | "all"; es: string; en: string }[] = [
  { key: "all", es: "Todas", en: "All" },
  { key: "tierra", es: "Tierra", en: "Earth" },
  { key: "fuego", es: "Fuego", en: "Fire" },
  { key: "agua", es: "Agua", en: "Water" },
  { key: "aire", es: "Aire", en: "Air" },
  { key: "eter", es: "Éter", en: "Éter" },
];

export function ProvidersInventory({ locale }: { locale: Locale }) {
  const [filter, setFilter] = useState<ElementKey | "all">("all");
  const list =
    filter === "all"
      ? providersInventory
      : providersInventory.filter((p) => p.elementAffinity === filter);

  return (
    <Section spacing="default">
      <div className="grid lg:grid-cols-12 gap-12 mb-12">
        <div className="lg:col-span-6">
          <Eyebrow className="mb-6 flex items-center gap-3">
            <Layers className="h-3.5 w-3.5" strokeWidth={1.5} />
            {locale === "es" ? "Disciplinas del campo" : "Field disciplines"}
          </Eyebrow>
          <h2 className="display-2 text-balance">
            {locale === "es"
              ? "Dieciséis disciplinas curadas alrededor de los cuatro elementos."
              : "Sixteen disciplines curated around the four elements."}
          </h2>
        </div>
        <div className="lg:col-span-6 lg:pt-3">
          <p className="lead text-pretty">
            {locale === "es"
              ? "Cada inmersión integra entre tres y cinco de estas disciplinas. La selección la define el elemento dominante del retiro y la estación del año."
              : "Each immersion integrates three to five of these disciplines. The selection is defined by the dominant element of the retreat and the season."}
          </p>
        </div>
      </div>

      {/* FILTER PILLS */}
      <div className="flex flex-wrap gap-2 mb-10">
        {ELEMENT_FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.18em] border transition-colors ${
                active
                  ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                  : "border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)]"
              }`}
            >
              {f[locale]}
            </button>
          );
        })}
      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
        {list.map((p, idx) => {
          const el = elements.find((e) => e.key === p.elementAffinity);
          const Icon = ICONS[p.elementAffinity];
          const status = STATUS_LABEL[p.status];
          const localeKey = locale === "es" ? "Es" : "En";
          return (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: idx * 0.03 }}
              className="bg-[var(--color-paper)] p-6 md:p-7 hover:bg-[var(--color-paper-warm)] transition-colors min-h-[240px] flex flex-col"
            >
              <div className="flex items-start justify-between mb-5">
                <span
                  className="inline-flex items-center justify-center h-9 w-9 rounded-full"
                  style={{ background: el?.accentSoft ?? "#e7e1d4" }}
                >
                  <Icon
                    className="h-4 w-4"
                    strokeWidth={1.5}
                    style={{ color: el?.accentInk }}
                  />
                </span>
                <span
                  className="text-[0.6rem] tracking-[0.22em] uppercase font-medium"
                  style={{ color: el?.accentInk }}
                >
                  {el ? (locale === "es" ? el.nameEs : el.nameEn) : ""}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-lg tracking-tight mb-3 text-[var(--color-ink)]">
                {p[`discipline${localeKey}`]}
              </h3>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed flex-1">
                {p[`description${localeKey}`]}
              </p>
              <div className="mt-5 pt-4 border-t border-[var(--color-line)] flex items-center justify-between text-[0.65rem] tracking-[0.18em] uppercase">
                <span className="flex items-center gap-1.5 text-[var(--color-muted)]">
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`} />
                  {status[locale]}
                </span>
                <span className="text-[var(--color-muted)]">
                  {p.providerName === "Proveedor por confirmar" ||
                  p.providerName === "TBD"
                    ? locale === "es"
                      ? "Proveedor TBD"
                      : "Provider TBD"
                    : p.providerName}
                </span>
              </div>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}
