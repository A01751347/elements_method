"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { elements, type ElementInfo } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Section, Eyebrow } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

export default function MethodPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const [activeIdx, setActiveIdx] = useState(0);
  const active = elements[activeIdx];

  return (
    <>
      <Section spacing="loose">
        <div className="max-w-4xl">
          <Eyebrow className="mb-6">{dict.method.eyebrow}</Eyebrow>
          <h1 className="display-1">{dict.method.title}</h1>
          <p className="lead mt-8 max-w-2xl">{dict.method.lead}</p>
        </div>
      </Section>

      <Section spacing="default" contained={false} tone="warm" className="paper-grain">
        <Container>
          {/* Element selector */}
          <div className="grid grid-cols-4 gap-2 mb-16 border border-[var(--color-line)]">
            {elements.map((el, idx) => {
              const isActive = activeIdx === idx;
              const name = locale === "es" ? el.nameEs : el.nameEn;
              return (
                <button
                  key={el.key}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={cn(
                    "py-6 px-3 md:py-8 md:px-5 text-left transition-colors duration-300 relative",
                    isActive
                      ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "bg-[var(--color-paper)] hover:bg-[var(--color-paper-warm)]",
                  )}
                >
                  <div
                    className={cn(
                      "eyebrow mb-2",
                      isActive
                        ? "text-[var(--color-paper)]/70"
                        : "text-[var(--color-muted)]",
                    )}
                  >
                    0{idx + 1}
                  </div>
                  <div
                    className={cn(
                      "font-[family-name:var(--font-display)] text-xl md:text-3xl tracking-tight",
                      el.animClass,
                    )}
                  >
                    {name}
                  </div>
                  <div
                    aria-hidden
                    className="absolute bottom-0 left-0 right-0 h-1 transition-transform origin-left"
                    style={{
                      background: el.accent,
                      transform: isActive ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "left",
                    }}
                  />
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <ElementDetail el={active} locale={locale} />
            </motion.div>
          </AnimatePresence>
        </Container>
      </Section>

      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6">
              {locale === "es" ? "Cómo se integra" : "How it integrates"}
            </Eyebrow>
            <h2 className="display-2">
              {locale === "es"
                ? "Cada elemento se entrena. Los cuatro se sostienen."
                : "Each element is trained. The four hold each other."}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-4 space-y-6 text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-2xl">
            <p>
              {locale === "es"
                ? "Empezamos donde haya más resistencia o más necesidad. No hay un orden obligatorio: hay un orden inteligente para cada persona y equipo."
                : "We start wherever there's more resistance or more need. There's no mandatory order: there's an intelligent order for each person and team."}
            </p>
            <p>
              {locale === "es"
                ? "Un programa completo de Elements Method cruza los cuatro. Un elemento individual te permite enfocarte cuando la operación lo pide. Una inmersión los une en una sola experiencia continua."
                : "A full Elements Method program crosses all four. An individual element lets you focus when operations require it. An immersion joins them in one continuous experience."}
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

function ElementDetail({
  el,
  locale,
}: {
  el: ElementInfo;
  locale: "es" | "en";
}) {
  const layers = [
    {
      label: locale === "es" ? "En la naturaleza" : "In nature",
      body: locale === "es" ? el.natureEs : el.natureEn,
    },
    {
      label: locale === "es" ? "En la persona" : "In the person",
      body: locale === "es" ? el.personEs : el.personEn,
    },
    {
      label: locale === "es" ? "Metodología" : "Methodology",
      body: locale === "es" ? el.methodEs : el.methodEn,
    },
    {
      label: locale === "es" ? "Experiencia fisiológica" : "Embodied practice",
      body: locale === "es" ? el.bodyEs : el.bodyEn,
    },
  ];

  return (
    <div className="grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-4">
        <div
          className={cn(
            "aspect-square w-full max-w-md mx-auto relative overflow-hidden",
            el.animClass,
          )}
          style={{
            background: `radial-gradient(circle at 30% 30%, ${el.accentSoft} 0%, var(--color-paper-warm) 70%)`,
          }}
        >
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 w-full h-full"
            aria-hidden
          >
            {el.key === "agua" && (
              <>
                <path
                  d="M50 70 Q 80 50, 100 70 T 150 70"
                  stroke={el.accent}
                  strokeWidth="2"
                  fill="none"
                  opacity="0.6"
                />
                <path
                  d="M40 100 Q 70 80, 100 100 T 160 100"
                  stroke={el.accent}
                  strokeWidth="2"
                  fill="none"
                  opacity="0.5"
                />
                <path
                  d="M50 130 Q 80 110, 100 130 T 150 130"
                  stroke={el.accent}
                  strokeWidth="2"
                  fill="none"
                  opacity="0.4"
                />
              </>
            )}
            {el.key === "fuego" && (
              <path
                d="M100 40 C 80 70, 120 80, 100 110 C 75 90, 85 140, 100 170 C 130 150, 145 110, 135 80 C 125 60, 110 55, 100 40 Z"
                fill={el.accent}
                opacity="0.55"
              />
            )}
            {el.key === "aire" && (
              <>
                <path
                  d="M30 70 H130 C 150 70, 150 95, 130 95"
                  stroke={el.accent}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.65"
                />
                <path
                  d="M30 100 H105"
                  stroke={el.accent}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.55"
                />
                <path
                  d="M30 130 H125 C 150 130, 150 158, 125 158"
                  stroke={el.accent}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.5"
                />
              </>
            )}
            {el.key === "tierra" && (
              <>
                <path
                  d="M30 160 L100 50 L170 160 Z"
                  fill={el.accent}
                  opacity="0.55"
                />
                <path
                  d="M55 160 L100 95 L145 160 Z"
                  fill={el.accent}
                  opacity="0.35"
                />
              </>
            )}
          </svg>

          <div className="absolute bottom-6 left-6">
            <div className="eyebrow text-[var(--color-ink-soft)]">
              {locale === "es" ? "Elemento" : "Element"}
            </div>
            <div className="font-[family-name:var(--font-display)] text-3xl mt-1">
              {locale === "es" ? el.nameEs : el.nameEn}
            </div>
          </div>
        </div>

        <p
          className="mt-6 text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]"
        >
          {locale === "es" ? el.qualityEs : el.qualityEn}
        </p>
      </div>

      <div className="lg:col-span-8 grid sm:grid-cols-2 gap-8">
        {layers.map((l, i) => (
          <div
            key={l.label}
            className="bg-[var(--color-paper)] border border-[var(--color-line)] p-7"
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="font-[family-name:var(--font-display)] text-2xl"
                style={{ color: el.accent }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-sm uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {l.label}
              </h3>
            </div>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              {l.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
