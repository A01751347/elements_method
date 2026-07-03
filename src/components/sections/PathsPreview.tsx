"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Check, Sparkles, Clock, Compass, Waves, User } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { paths as staticPaths, type PathInfo } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// One icon per program, in display order (Fluir, Momentum, Raíz, Brújula, Oneness).
// `?? Sparkles` guards against any future program with no assigned icon.
const PATH_ICONS = [Waves, Sparkles, Clock, Compass, User];

export function PathsPreview({
  locale,
  dict,
  paths: pathsProp,
}: {
  locale: Locale;
  dict: Dict;
  paths?: PathInfo[];
}) {
  // Home preview shows the three group programs (the grid is 3-wide); the full
  // five-program list lives on /los-caminos. An explicit prop overrides this.
  const paths = pathsProp && pathsProp.length > 0 ? pathsProp : staticPaths.slice(0, 3);
  const [hovered, setHovered] = React.useState<number | null>(null);

  return (
    <section className="py-24 md:py-36 bg-[var(--color-paper-warm)] paper-grain relative">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6">{dict.paths.eyebrow}</Eyebrow>
            <h2 className="display-2 text-balance">{dict.paths.title}</h2>
          </div>
          <div className="lg:col-span-5">
            <p className="lead text-pretty">{dict.paths.lead}</p>
          </div>
        </div>

        <div
          className="grid md:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)]"
          onMouseLeave={() => setHovered(null)}
        >
          {paths.map((p, idx) => {
            const name = locale === "es" ? p.nameEs : p.nameEn;
            const short = locale === "es" ? p.shortEs : p.shortEn;
            const includes = locale === "es" ? p.includesEs : p.includesEn;
            const duration = locale === "es" ? p.durationEs : p.durationEn;
            const Icon = PATH_ICONS[idx] ?? Sparkles;
            const isHovered = hovered === idx;
            const isDim = hovered !== null && hovered !== idx;

            return (
              <motion.article
                key={p.slug}
                onMouseEnter={() => setHovered(idx)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                animate={{ opacity: isDim ? 0.4 : 1 }}
                className={cn(
                  "group bg-[var(--color-paper)] p-8 md:p-10 flex flex-col justify-between min-h-[560px] transition-colors duration-500",
                  isHovered && "bg-[var(--color-ink)] text-[var(--color-paper)]",
                )}
              >
                <div>
                  <div className="flex items-start justify-between mb-10">
                    <span
                      className={cn(
                        "font-[family-name:var(--font-display)] text-5xl transition-colors",
                        isHovered ? "text-[var(--color-paper)]/30" : "text-[var(--color-ink)]/15",
                      )}
                    >
                      0{idx + 1}
                    </span>
                    <Icon
                      className={cn(
                        "h-6 w-6 transition-colors",
                        isHovered ? "text-[var(--color-paper)]" : "text-[var(--color-moss-700)]",
                      )}
                      strokeWidth={1.5}
                    />
                  </div>

                  <h3
                    className={cn(
                      "font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-tight mb-3",
                      isHovered ? "text-[var(--color-paper)]" : "text-[var(--color-ink)]",
                    )}
                  >
                    {name}
                  </h3>
                  <p
                    className={cn(
                      "italic mb-8 text-pretty",
                      isHovered ? "text-[var(--color-paper)]/90" : "text-[var(--color-ink-soft)]",
                    )}
                  >
                    {short}
                  </p>

                  <ul className="space-y-2.5">
                    {includes.slice(0, 4).map((item) => (
                      <li
                        key={item}
                        className={cn(
                          "flex items-start gap-2 text-sm leading-relaxed transition-colors",
                          isHovered ? "text-[var(--color-paper)]/95" : "text-[var(--color-ink-soft)]",
                        )}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4 mt-0.5 shrink-0",
                            isHovered ? "text-[var(--color-paper-warm)]" : "text-[var(--color-moss-500)]",
                          )}
                          strokeWidth={1.5}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={cn(
                    "mt-10 pt-6 border-t transition-colors flex items-end justify-between gap-4",
                    isHovered ? "border-[var(--color-paper)]/20" : "border-[var(--color-line)]",
                  )}
                >
                  <div>
                    <div
                      className={cn(
                        "text-[0.65rem] uppercase tracking-wide mb-1",
                        isHovered ? "text-[var(--color-paper)]/85" : "text-[var(--color-muted)]",
                      )}
                    >
                      {duration}
                    </div>
                    <div className="font-[family-name:var(--font-display)] text-xl italic text-[var(--color-muted)]">
                      {locale === "es" ? "Inversión a confirmar" : "Investment TBD"}
                    </div>
                  </div>

                  <Link
                    href={`/${locale}/${locale === "es" ? "los-caminos" : "paths"}/${p.slug}`}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-sm border-b pb-0.5 transition-colors",
                      isHovered
                        ? "text-[var(--color-paper)] border-[var(--color-paper)]/50 hover:border-[var(--color-paper)]"
                        : "text-[var(--color-ink)] border-[var(--color-ink)]/30 hover:border-[var(--color-ink)]",
                    )}
                  >
                    {locale === "es" ? "Detalle" : "Detail"}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            href={`/${locale}/${locale === "es" ? "los-caminos" : "paths"}`}
            variant="secondary"
            trailingArrow
          >
            {locale === "es" ? "Comparar los caminos" : "Compare paths"}
          </Button>
        </div>
      </Container>
    </section>
  );
}
