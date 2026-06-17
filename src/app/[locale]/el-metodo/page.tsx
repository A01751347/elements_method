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
  Brain,
  HeartPulse,
  Activity,
  Shield,
  TestTube,
  BookMarked,
  Atom,
  Sparkles,
  Users,
} from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  elements,
  shadowProfile,
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
            src="https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=2400&q=85&auto=format&fit=crop"
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

      {/* CORE INSIGHT — golden_circle.md + master doc */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <BookMarked className="h-3.5 w-3.5" strokeWidth={1.5} /> Core insight
            </Eyebrow>
            <h2 className="display-3 text-balance">
              {locale === "es"
                ? "Trasforma y eleva el núcleo, y todo lo que orbita a su alrededor cambiará."
                : "Transform and elevate the nucleus, and everything that orbits around it will change."}
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-6 text-lg leading-relaxed text-[var(--color-ink-soft)] max-w-2xl">
            <p>
              {locale === "es"
                ? "Antes de los cuatro elementos existe el Núcleo: el líder mismo. En su estado interior, el líder debe conocer, entender y alinear los ejes mentales, emocionales, físicos y espirituales."
                : "Before the four elements there is the Nucleus: the leader themselves. In their inner state, the leader must know, understand and align the mental, emotional, physical and spiritual axes."}
            </p>
            <p>
              {locale === "es"
                ? "En la física, el núcleo es la masa densa y energética desde la que todo lo demás se organiza. En liderazgo, la persona, expresándose desde su autenticidad y naturaleza, es el núcleo desde el que radían todas las dinámicas del equipo, la cultura y los resultados organizacionales."
                : "In physics, the nucleus is the dense, energetic mass from which everything else is organized. In leadership, the person, expressing themselves from their authenticity and nature, is the nucleus from which all team dynamics, culture and organizational results radiate."}
            </p>
            <p className="italic text-[var(--color-ink)]">
              {locale === "es"
                ? "La naturaleza no gestiona. La naturaleza lidera. Esto no es un retiro — es un regreso."
                : "Nature does not manage. Nature leads. This is not a retreat — it is a return."}
            </p>
          </div>
        </div>
      </Section>

      {/* THE NUCLEUS + ETER */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Atom className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "El Núcleo + Éter" : "The Nucleus + Éter"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "El quinto elemento es la energía del Núcleo."
                : "The fifth element is the energy of the Nucleus."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-4">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Tierra, Fuego, Agua y Aire impactan directamente el núcleo, que es el líder. Y el núcleo del líder tiene como energía principal el Éter — Espíritu — donde se concentra el autoconocimiento, el propósito trascendental, la sabiduría, la intención, la plenitud, la conexión humana, la gratitud, el servicio y el legado."
                : "Earth, Fire, Water and Air directly impact the nucleus, which is the leader. And the leader's nucleus has Éter — Spirit — as its principal energy, where self-knowledge, transcendent purpose, wisdom, intention, plenitude, human connection, gratitude, service and legacy concentrate."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          <div className="bg-[var(--color-paper)] p-8 md:p-12">
            <div className="eyebrow text-[var(--color-fire-ink)] mb-6">
              {locale === "es" ? "De afuera hacia adentro" : "Outside-in"}
            </div>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              {locale === "es"
                ? "La mayoría de los programas de desarrollo de liderazgo trabajan de afuera hacia adentro — intentando mejorar relaciones, cultura o resultados a través de habilidad y estrategia."
                : "Most leadership development programs work from the outside in — trying to improve relationships, culture, or results through skill and strategy."}
            </p>
          </div>
          <div className="bg-[var(--color-paper-warm)] p-8 md:p-12">
            <div className="eyebrow text-[var(--color-gold-deep)] mb-6">
              {locale === "es" ? "De adentro hacia afuera" : "Inside-out"}
            </div>
            <p className="text-[var(--color-ink-soft)] leading-relaxed">
              {locale === "es"
                ? "Elements Method trabaja de adentro hacia afuera: cuando el Núcleo está saludable y el Éter integra los cuatro elementos, todo lo demás se reorganiza naturalmente."
                : "Elements Method works from the inside out: when the Nucleus is healthy and Éter integrates the four elements, everything else reorganizes naturally."}
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

          {/* Only show the 4 trainable elements (Éter handled separately) */}
          <div className="grid grid-cols-4 gap-2 mb-16 border border-[var(--color-line)]">
            {elements.slice(0, 4).map((el, idx) => {
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

      {/* SHADOW PROFILE — from master doc */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Shield className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Perfil de Sombra Elemental" : "Elemental Shadow Profile"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Todo líder tiene un perfil elemental."
                : "Every leader has an elemental profile."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-3">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Un elemento primario (su hogar natural), un secundario (su rango accesible), uno subdesarrollado (su borde de crecimiento) y uno de sombra (el que aparece distorsionado bajo estrés). El método empieza por mapearlo."
                : "A primary element (their natural home), a secondary (their accessible range), an underdeveloped one (their growth edge) and a shadow element (the one that appears distorted under stress). The method begins by mapping it."}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto -mx-5 sm:-mx-8 px-5 sm:px-8">
          <table className="w-full border border-[var(--color-line)] bg-[var(--color-paper)] text-sm min-w-[860px]">
            <thead>
              <tr className="border-b border-[var(--color-line)] bg-[var(--color-paper-warm)]">
                <th className="text-left p-5 font-normal eyebrow text-[var(--color-muted)] w-[120px]">
                  {locale === "es" ? "Elemento" : "Element"}
                </th>
                <th className="text-left p-5 font-normal eyebrow text-[var(--color-muted)]">
                  {locale === "es" ? "En su mejor versión" : "At its best"}
                </th>
                <th className="text-left p-5 font-normal eyebrow text-[var(--color-muted)]">
                  {locale === "es" ? "Bajo estrés" : "Under stress"}
                </th>
                <th className="text-left p-5 font-normal eyebrow text-[var(--color-muted)]">
                  {locale === "es" ? "Don" : "Gift"}
                </th>
                <th className="text-left p-5 font-normal eyebrow text-[var(--color-muted)]">
                  {locale === "es" ? "Sombra" : "Shadow"}
                </th>
              </tr>
            </thead>
            <tbody>
              {shadowProfile.map((row) => {
                const el = elements.find((e) => e.key === row.element)!;
                return (
                  <tr
                    key={row.element}
                    className="border-b border-[var(--color-line)] last:border-0"
                  >
                    <td className="p-5 align-top">
                      <div
                        className="font-[family-name:var(--font-display)] text-xl"
                        style={{ color: el.accentInk }}
                      >
                        {locale === "es" ? el.nameEs : el.nameEn}
                      </div>
                      <div className="text-xs uppercase tracking-wide text-[var(--color-muted)] mt-0.5">
                        {el.framework}
                      </div>
                    </td>
                    <td className="p-5 align-top text-[var(--color-ink-soft)]">
                      {locale === "es" ? row.bestEs : row.bestEn}
                    </td>
                    <td className="p-5 align-top text-[var(--color-fire-ink)]">
                      {locale === "es" ? row.stressEs : row.stressEn}
                    </td>
                    <td className="p-5 align-top text-[var(--color-ink-soft)]">
                      {locale === "es" ? row.giftEs : row.giftEn}
                    </td>
                    <td className="p-5 align-top text-[var(--color-ink-soft)] italic">
                      {locale === "es" ? row.shadowEs : row.shadowEn}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {/* THE SCIENCE OF RECONNECTION — expanded */}
      <Section spacing="default" tone="warm">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <HeartPulse className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "La ciencia de la desconexión" : "The science of disconnection"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "La naturaleza no es escenario. Es la metodología."
                : "Nature isn't a backdrop. It is the methodology."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-4 text-lg leading-relaxed text-[var(--color-ink-soft)]">
            <p>
              {locale === "es"
                ? "Los entornos naturales producen efectos fisiológicos y psicológicos documentados que ningún espacio artificial puede replicar: restauración de la atención, reducción del cortisol, activación del sistema nervioso parasimpático, acceso a estados cerebrales de insight creativo y reflexión profunda."
                : "Natural environments produce documented physiological and psychological effects no artificial space can replicate: attention restoration, cortisol reduction, parasympathetic activation, access to brain states of creative insight and deep reflection."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {[
            {
              icon: Brain,
              k: locale === "es" ? "20 min en naturaleza" : "20 min in nature",
              v: locale === "es" ? "Reduce cortisol 21%" : "Reduces cortisol by 21%",
              ref: "Hunter et al. · 2019",
            },
            {
              icon: TestTube,
              k: locale === "es" ? "2h Shinrin-yoku" : "2h Shinrin-yoku",
              v: locale === "es" ? "Aumenta células NK del sistema inmune 50% (efecto 30 días)" : "Increases NK immune cells 50% (30-day effect)",
              ref: "Li · 2008",
            },
            {
              icon: Activity,
              k: locale === "es" ? "Líderes auto-conscientes" : "Self-aware leaders",
              v: locale === "es" ? "3× mayor engagement del equipo" : "3× higher team engagement",
              ref: "Eurich · Harvard Business Review",
            },
            {
              icon: HeartPulse,
              k: locale === "es" ? "Sistema nervioso regulado" : "Regulated nervous system",
              v: locale === "es" ? "Decisiones más rápidas y precisas" : "Faster, more accurate decisions",
              ref: "van der Kolk · 2014",
            },
            {
              icon: Shield,
              k: locale === "es" ? "Seguridad psicológica" : "Psychological safety",
              v: locale === "es" ? "27% más crecimiento de ingresos" : "27% higher revenue growth",
              ref: "Google · Project Aristotle",
            },
            {
              icon: Brain,
              k: locale === "es" ? "8 semanas de MBSR" : "8 weeks MBSR",
              v: locale === "es" ? "Cambios medibles en materia gris del córtex prefrontal" : "Measurable changes in prefrontal cortex gray matter",
              ref: "Holzel et al. · 2011",
            },
          ].map((row, idx) => {
            const Icon = row.icon;
            return (
              <motion.div
                key={row.k}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: idx * 0.06 }}
                className="group bg-[var(--color-paper)] p-8 md:p-10 hover:bg-[var(--color-paper-warm)] transition-colors duration-500 min-h-[260px] flex flex-col"
              >
                <Icon className="h-6 w-6 text-[var(--color-gold-deep)] mb-6" strokeWidth={1.5} />
                <h3 className="font-[family-name:var(--font-display)] text-xl tracking-tight mb-3">
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

      {/* WHO IT'S FOR */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Para quién" : "Who this is for"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Cinco perfiles que llegan a Elements Method."
                : "Five profiles that come to Elements Method."}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <ul className="border-y border-[var(--color-line)] divide-y divide-[var(--color-line)]">
              {(locale === "es" ? audienceEs : audienceEn).map((row, idx) => (
                <li
                  key={row}
                  className="py-6 grid grid-cols-[80px_1fr] gap-6 items-baseline"
                >
                  <span className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-gold-deep)] tabular-nums">
                    0{idx + 1}
                  </span>
                  <span className="text-[var(--color-ink-soft)] leading-relaxed text-lg">
                    {row}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* RESULTS */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5">
            <Eyebrow inverted className="mb-6 flex items-center gap-3">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Resultados esperados" : "Expected results"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)] text-balance">
              {locale === "es"
                ? "Cuatro indicadores que verás aparecer."
                : "Four indicators you'll see emerge."}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {(locale === "es" ? resultsEs : resultsEn).map((r) => (
                <li
                  key={r}
                  className="flex items-start gap-3 text-[var(--color-paper)] py-2 border-b border-[var(--color-paper)]/15"
                >
                  <span className="h-1 w-3 bg-[var(--color-gold)] mt-3 shrink-0" />
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                href={`/${locale}/${locale === "es" ? "los-caminos" : "paths"}`}
                trailingArrow
                className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)]"
              >
                {locale === "es" ? "Ver programas" : "See programs"}
              </Button>
              <Button
                href={`/${locale}/${locale === "es" ? "retiros" : "retreats"}`}
                variant="outlineLight"
              >
                {locale === "es" ? "Ver experiencia" : "See experience"}
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
      body: locale === "es" ? el.cultivaEs : el.cultivaEn,
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

        <p className="mt-6 italic font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)] max-w-md">
          “{locale === "es" ? el.quoteEs : el.quoteEn}”
        </p>

        <p className="mt-4 text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
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
                style={{ color: el.accentInk }}
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
