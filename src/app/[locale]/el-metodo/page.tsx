"use client";

import { use, useState, useRef } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "motion/react";
import {
  Activity,
  Brain,
  HeartPulse,
  BookMarked,
  Atom,
  Sparkles,
  Users,
} from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  elements,
  audienceEs,
  audienceEn,
  resultsEs,
  resultsEn,
  type ElementInfo,
} from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
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

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <>
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[80vh] flex items-end overflow-hidden -mt-20 pt-20 text-[var(--color-paper)]"
      >
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 -z-20 will-change-transform"
        >
          <Image
            src="/images/heroes/metodo.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-ink)]/40 via-[var(--color-ink)]/55 to-[var(--color-ink)]" />
        <div className="absolute inset-0 -z-10 film-grain pointer-events-none" />

        <Container className="relative pb-16 md:pb-24 z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="eyebrow text-[var(--color-paper)]/80 mb-8 flex items-center gap-3"
          >
            <span aria-hidden className="h-px w-12 bg-[var(--color-paper)]/40" />
            {dict.method.eyebrow}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="display-1 text-balance text-[var(--color-paper)] max-w-[18ch]"
          >
            {dict.method.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lead mt-8 max-w-2xl text-[var(--color-paper)]/85"
          >
            {dict.method.lead}
          </motion.p>
        </Container>
      </section>

      {/* CORE INSIGHT — verbatim from golden_circle.md + proyecto.md */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <BookMarked className="h-3.5 w-3.5" strokeWidth={1.5} /> Core insight
            </Eyebrow>
            <h2 className="display-3 text-balance">
              {locale === "es"
                ? "La mayoría de las personas intenta cambiar sus resultados sin transformar el sistema interno desde el que los producen."
                : "Most people try to change their results without transforming the inner system that produces them."}
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-6 text-lg leading-relaxed text-[var(--color-ink-soft)] max-w-2xl">
            <p>
              {locale === "es"
                ? "Las decisiones importantes no se toman solo con información. Se toman desde un estado mental específico. La presión, la velocidad y la responsabilidad constante afectan la claridad estratégica del líder moderno."
                : "Important decisions are not made with information alone. They are made from a specific mental state. Pressure, speed and constant responsibility affect the modern leader's strategic clarity."}
            </p>
            <p className="italic text-[var(--color-ink)]">
              {locale === "es"
                ? "Elements interviene ese sistema."
                : "Elements intervenes that system."}
            </p>
            <p>
              {locale === "es"
                ? "Mejor pensamiento. Mejores decisiones. Mejor liderazgo."
                : "Better thinking. Better decisions. Better leadership."}
            </p>
          </div>
        </div>
      </Section>

      {/* THE NUCLEUS — from presentation page 6 */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Atom className="h-3.5 w-3.5" strokeWidth={1.5} />
              The Nucleus
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Cambia el núcleo y todo lo demás cambia."
                : "Change the nucleus, and everything around it changes."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-4">
            <p className="lead text-pretty">
              {locale === "es"
                ? "En física, el núcleo es el centro denso y energético desde el que todo lo demás se organiza. En liderazgo, la persona — sus valores, su presencia, su estado interno — es el núcleo desde el que radían las dinámicas de equipo, la cultura y los resultados organizacionales."
                : "In physics, the nucleus is the dense, energetic center from which everything else is organized. In leadership, the person — their values, their presence, their inner state — is the nucleus from which all team dynamics, culture, and organizational results radiate."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          <div className="bg-[var(--color-paper)] p-8 md:p-12">
            <div className="eyebrow text-[var(--color-fire)] mb-6">
              {locale === "es" ? "De afuera hacia adentro" : "Outside-in"}
            </div>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              {locale === "es"
                ? "La mayoría de los programas de desarrollo de liderazgo trabajan de afuera hacia adentro — intentando mejorar relaciones, cultura o resultados a través de habilidad y estrategia."
                : "Most leadership development programs work from the outside in — trying to improve relationships, culture, or results through skill and strategy."}
            </p>
          </div>
          <div className="bg-[var(--color-paper-warm)] p-8 md:p-12">
            <div className="eyebrow text-[var(--color-moss-700)] mb-6">
              {locale === "es" ? "De adentro hacia afuera" : "Inside-out"}
            </div>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              {locale === "es"
                ? "Elements Method trabaja de adentro hacia afuera: cuando el núcleo está saludable, todo lo demás se reorganiza naturalmente a su alrededor."
                : "Elements Method works from the inside out: when the nucleus is healthy, everything else reorganizes around it naturally."}
            </p>
          </div>
        </div>
      </Section>

      {/* THE FOUR FRAMEWORKS */}
      <Section spacing="default" contained={false} tone="warm">
        <Container>
          <div className="mb-16 grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <Eyebrow className="mb-6">
                {locale === "es" ? "Cuatro elementos, cuatro frameworks" : "Four elements, four frameworks"}
              </Eyebrow>
              <h2 className="display-2 text-balance">
                ROOTS · IGNITE · FLOW · CLEAR
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="lead text-pretty">
                {locale === "es"
                  ? "Cada elemento tiene un framework operativo con competencias específicas que se entrenan y observan."
                  : "Each element has an operational framework with specific competencies that are trained and observed."}
              </p>
            </div>
          </div>

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
                    {el.framework}
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

      {/* THE SCIENCE OF RECONNECTION — verbatim from presentation page 5 */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <HeartPulse className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "La ciencia de la reconexión" : "The science of reconnection"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Líderes regulados, arraigados y auto-conscientes producen resultados medibles."
                : "Regulated, grounded, self-aware leaders produce measurably better outcomes."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-4 text-lg leading-relaxed text-[var(--color-ink-soft)]">
            <p>
              {locale === "es"
                ? "La investigación en neurociencia, psicología y comportamiento organizacional apunta consistentemente en la misma dirección."
                : "Research from neuroscience, psychology, and organizational behavior consistently points in the same direction."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {[
            {
              icon: Brain,
              k: locale === "es" ? "Sistema nervioso regulado" : "Regulated nervous system",
              v:
                locale === "es"
                  ? "Los sistemas nerviosos regulados toman decisiones más rápidas y precisas."
                  : "Regulated nervous systems make faster, more accurate decisions.",
              ref: "van der Kolk, 2014",
            },
            {
              icon: HeartPulse,
              k: locale === "es" ? "20 minutos en naturaleza" : "20 minutes in nature",
              v:
                locale === "es"
                  ? "Reducen cortisol 21% y mejoran memoria de trabajo 20%."
                  : "Reduce cortisol by 21% and improve working memory by 20%.",
              ref: "Univ. of Michigan · Hunter et al. 2019",
            },
            {
              icon: Activity,
              k: locale === "es" ? "Seguridad psicológica" : "Psychological safety",
              v:
                locale === "es"
                  ? "Líderes con culturas de seguridad psicológica generan 27% más crecimiento en revenue."
                  : "Leaders with strong psychological safety cultures generate 27% higher revenue growth.",
              ref: "Google · Project Aristotle",
            },
          ].map((row, idx) => {
            const Icon = row.icon;
            return (
              <motion.div
                key={row.k}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="group bg-[var(--color-paper)] p-8 md:p-10 hover:bg-[var(--color-paper-warm)] transition-colors duration-500 min-h-[340px] flex flex-col"
              >
                <Icon className="h-6 w-6 text-[var(--color-moss-700)] mb-6" strokeWidth={1.5} />
                <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-tight mb-4">
                  {row.k}
                </h3>
                <p className="text-[var(--color-ink-soft)] leading-relaxed text-sm flex-1">
                  {row.v}
                </p>
                <div className="mt-6 pt-4 border-t border-[var(--color-line)] text-[0.7rem] uppercase tracking-wide text-[var(--color-muted)]">
                  {row.ref}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* WHO THIS IS FOR — from proyecto.md "PARA QUIÉN ES" */}
      <Section spacing="default" tone="warm">
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Para quién" : "Who this is for"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Personas que entienden que evolucionar su liderazgo es una ventaja competitiva."
                : "People who understand that evolving their leadership is a competitive advantage."}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <ul className="border-y border-[var(--color-line)] divide-y divide-[var(--color-line)]">
              {(locale === "es" ? audienceEs : audienceEn).map((row, idx) => (
                <li
                  key={row}
                  className="py-6 grid grid-cols-[80px_1fr] gap-6 items-center"
                >
                  <span className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-moss-700)]/60">
                    0{idx + 1}
                  </span>
                  <span className="text-xl font-[family-name:var(--font-display)] tracking-tight">
                    {row}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* RESULTS — verbatim from proyecto.md "RESULTADOS" */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Resultados" : "Results"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Nueve indicadores que esperar."
                : "Nine indicators to expect."}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {(locale === "es" ? resultsEs : resultsEn).map((r) => (
                <li
                  key={r}
                  className="flex items-start gap-3 text-[var(--color-ink)] py-2 border-b border-[var(--color-line)]"
                >
                  <span className="h-1 w-3 bg-[var(--color-moss-500)] mt-3 shrink-0" />
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                href={`/${locale}/${locale === "es" ? "los-caminos" : "paths"}`}
                trailingArrow
              >
                {locale === "es" ? "Ver programas" : "See programs"}
              </Button>
              <Button
                href={`/${locale}/${locale === "es" ? "retiros" : "retreats"}`}
                variant="secondary"
              >
                {locale === "es" ? "Ver módulos" : "See modules"}
              </Button>
            </div>
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
      label: locale === "es" ? "En el líder" : "In the leader",
      body: locale === "es" ? el.personEs : el.personEn,
    },
    {
      label: `Framework · ${el.framework}`,
      body: locale === "es" ? el.methodEs : el.methodEn,
    },
    {
      label: locale === "es" ? "Modalidades aliadas" : "Aligned modalities",
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
          <div className="absolute bottom-6 left-6">
            <div className="eyebrow text-[var(--color-ink-soft)]">
              {el.framework}
            </div>
            <div className="font-[family-name:var(--font-display)] text-3xl mt-1">
              {locale === "es" ? el.nameEs : el.nameEn}
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
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
