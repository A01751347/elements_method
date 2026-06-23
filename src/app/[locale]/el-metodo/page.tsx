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
  Droplets,
  Flame,
  Wind,
  Mountain,
  Compass,
} from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  elements,
  elementImages,
  frameworkImages,
  shadowProfile,
  audienceEs,
  audienceEn,
  resultsEs,
  resultsEn,
  dailyScanEs,
  dailyScanEn,
  type ElementInfo,
  type ElementKey,
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
            className="eyebrow text-[var(--color-paper)]/95 mb-8 flex items-center gap-3"
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
            className="lead mt-8 max-w-2xl text-[var(--color-paper)]/95"
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

      {/* DISCONNECTION EPIDEMIC — verbatim from elements-method-presentation.docx
       *  Diagnosis: what modern organizational life produces vs what leaders need.
       *  Lands before The Nucleus so the reader meets the problem before the answer. */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12 mb-14">
          <div className="lg:col-span-5">
            <Eyebrow inverted className="mb-6">
              {locale === "es" ? "La epidemia de desconexión" : "The Disconnection Epidemic"}
            </Eyebrow>
            <h2 className="display-2 text-balance text-[var(--color-paper)]">
              {locale === "es"
                ? "La vida organizacional moderna desconecta sistemáticamente al líder de las cualidades que hacen el liderazgo posible."
                : "Modern organizational life systematically disconnects leaders from the very qualities that make leadership possible."}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-3 space-y-5">
            <p className="text-lg text-[var(--color-paper)]/95 leading-relaxed text-pretty">
              {locale === "es"
                ? "No es una crisis de capacidad. Es una crisis de conexión. Los líderes que trabajamos no carecen de habilidades — carecen de algo más fundamental: una conexión viva y encarnada con quienes realmente son."
                : "It is not a crisis of capability. It is a crisis of connection. The leaders we work with aren't missing skills. They're missing something more fundamental: a living, embodied connection to who they actually are."}
            </p>
            <p className="text-lg italic text-[var(--color-gold-soft)] leading-relaxed text-pretty border-l border-[var(--color-gold-soft)]/30 pl-5">
              {locale === "es"
                ? "76% de los líderes reportan sentirse quemados o emocionalmente agotados. 65% de los empleados dicen que su jefe es la principal fuente de estrés en sus vidas. Y aún así, las organizaciones siguen invirtiendo en programas de liderazgo que añaden más herramientas a manos ya saturadas."
                : "76% of leaders report feeling burned out or emotionally depleted. 65% of employees say their manager is the primary source of stress in their lives. And yet, organizations continue to invest in leadership programs that add more tools to already-full hands."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-[var(--color-paper)]/10 border border-[var(--color-paper)]/15">
          <div className="bg-[var(--color-ink)] p-8 md:p-10">
            <div className="eyebrow text-[var(--color-paper)]/85 mb-6">
              {locale === "es" ? "Lo que las organizaciones producen" : "What organizations produce"}
            </div>
            <ul className="space-y-3 text-[var(--color-paper)]/90">
              {(locale === "es"
                ? [
                    "Sobrecarga cognitiva",
                    "Toma de decisiones reactiva",
                    "Presión de desempeño crónica",
                    "Pérdida de motivación intrínseca",
                    "Desconexión del cuerpo",
                    "Sentido de sí encogido",
                  ]
                : [
                    "Cognitive overload",
                    "Reactive decision-making",
                    "Chronic performance pressure",
                    "Loss of intrinsic motivation",
                    "Disconnection from the body",
                    "Shrinking sense of self",
                  ]
              ).map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden className="mt-2 h-1 w-1 rounded-full bg-[var(--color-paper)]/40 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[var(--color-ink)] p-8 md:p-10">
            <div className="eyebrow text-[var(--color-gold-soft)] mb-6">
              {locale === "es" ? "Lo que los líderes realmente necesitan" : "What leaders actually need"}
            </div>
            <ul className="space-y-3 text-[var(--color-paper)]">
              {(locale === "es"
                ? [
                    "Claridad y quietud interior",
                    "Decisiones arraigadas en valores",
                    "Energía y presencia sostenibles",
                    "Sentido auténtico de propósito",
                    "Auto-consciencia encarnada",
                    "Identidad fuerte y estable",
                  ]
                : [
                    "Clarity and inner quiet",
                    "Grounded, values-led choices",
                    "Sustainable energy and presence",
                    "Authentic sense of purpose",
                    "Embodied self-awareness",
                    "Strong, stable identity",
                  ]
              ).map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden className="mt-2 h-1 w-1 rounded-full bg-[var(--color-gold-soft)] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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

          {/* Only show the 4 trainable elements (Éter handled separately).
           *  Each card surfaces the framework's hero module image with a
           *  scrim that intensifies on the active tab. */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-16">
            {elements.slice(0, 4).map((el, idx) => {
              const isActive = activeIdx === idx;
              const name = locale === "es" ? el.nameEs : el.nameEn;
              const moduleImg = frameworkImages[el.key];
              return (
                <button
                  key={el.key}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={cn(
                    "group relative aspect-[4/5] md:aspect-[3/4] text-left overflow-hidden transition-all duration-500",
                    isActive ? "ring-2" : "ring-0 hover:ring-1",
                  )}
                  style={
                    isActive
                      ? { boxShadow: `0 0 0 2px ${el.accentInk}` }
                      : undefined
                  }
                  aria-pressed={isActive}
                >
                  {moduleImg && (
                    <Image
                      src={moduleImg}
                      alt={`${el.framework} · ${name}`}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className={cn(
                        "object-cover transition-transform duration-700",
                        isActive ? "scale-105" : "scale-100 group-hover:scale-105",
                      )}
                    />
                  )}
                  {/* Scrim — stronger when inactive so the active card visually
                   *  pops via image contrast, not just border. */}
                  <div
                    aria-hidden
                    className={cn(
                      "absolute inset-0 transition-opacity duration-500",
                      isActive
                        ? "bg-gradient-to-t from-[var(--color-ink)]/85 via-[var(--color-ink)]/15 to-transparent"
                        : "bg-gradient-to-t from-[var(--color-ink)]/95 via-[var(--color-ink)]/55 to-[var(--color-ink)]/30",
                    )}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 mix-blend-multiply opacity-50 transition-opacity duration-500"
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${el.accent}00 30%, ${el.accent}40 100%)`
                        : "transparent",
                    }}
                  />
                  <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end text-[var(--color-paper)]">
                    <div
                      className="eyebrow mb-2"
                      style={{
                        color: isActive ? el.accentSoft : "var(--color-paper)",
                      }}
                    >
                      {el.framework}
                    </div>
                    <div
                      className={cn(
                        "font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-tight",
                        el.animClass,
                      )}
                      style={{
                        textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                      }}
                    >
                      {name}
                    </div>
                  </div>
                  {/* Bottom accent rail — colored stripe per element */}
                  <div
                    aria-hidden
                    className="absolute bottom-0 left-0 right-0 h-1 transition-transform duration-500 origin-left"
                    style={{
                      background: el.accent,
                      transform: isActive ? "scaleX(1)" : "scaleX(0.2)",
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

      {/* THE INTEGRATED LEADER — verbatim from master doc §18.
       *  Closes the Shadow Profile: knowing your profile is step one — the
       *  goal is fluid access to all four, and the wisdom of the fifth. */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-12">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Compass className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "El líder integrado" : "The Integrated Leader"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "El objetivo no es ser un líder de un elemento. Es tener acceso fluido a los cuatro."
                : "The goal is not to be a leader of one element. It is to have fluid access to all four."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-3 space-y-5">
            <p className="lead text-pretty">
              {locale === "es"
                ? "El objetivo no es ser un líder de Agua, o de Fuego, o de Tierra. El objetivo es tener acceso fluido a los cuatro — y la sabiduría del quinto para identificar cuál requiere el momento."
                : "The goal is not to be a Water leader, or a Fire leader, or an Earth leader. The goal is to have fluid access to all four — and the wisdom of the fifth to identify which one the moment requires."}
            </p>
            <p className="text-[var(--color-ink-soft)] leading-relaxed text-pretty">
              {locale === "es"
                ? "La integración elemental no es la eliminación de la preferencia o fortaleza natural. Es la expansión del rango. El líder de Agua que puede acceder al Fuego cuando la visión es necesaria. El líder de Tierra que puede subir al Aire cuando el equipo necesita perspectiva estratégica. El líder de Fuego que puede encontrar el Agua cuando la situación pide escucha."
                : "Elemental integration is not the elimination of natural preference or strength. It is the expansion of range. The Water leader who can access Fire when vision is needed. The Earth leader who can rise into Air when the team needs strategic perspective. The Fire leader who can find Water when the situation calls for listening."}
            </p>
          </div>
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
              icon: Brain,
              k: locale === "es" ? "20 min en naturaleza" : "20 min in nature",
              v: locale === "es" ? "Mejora la memoria de trabajo en 20%" : "Improves working memory by 20%",
              ref: "University of Michigan",
            },
            {
              icon: Sparkles,
              k: locale === "es" ? "20 min en naturaleza" : "20 min in nature",
              v: locale === "es" ? "Aumento medible en la resolución creativa de problemas" : "Measurable increase in creative problem-solving",
              ref: "University of Michigan",
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

      {/* ─── 4-ELEMENT DAILY SCAN — verbatim from master doc ─────────── */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-12">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Compass className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "El Escaneo de los 4 Elementos" : "The 4-Element Scan"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Una práctica portátil para cualquier desafío de liderazgo."
                : "A portable practice for any leadership challenge."}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-3">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Para cualquier desafío de liderazgo que enfrentas ahora mismo, los cuatro elementos te dan cuatro preguntas concretas. Con el tiempo, acceder a los cuatro se vuelve instintivo: la marca del líder integrado."
                : "For any leadership challenge you face right now, the four elements give you four concrete questions. Over time, accessing all four becomes instinctive: the mark of the integrated leader."}
            </p>
          </div>
        </div>

        <DailyScanGrid locale={locale} />
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

  const elImage = elementImages[el.key];
  return (
    <div className="grid lg:grid-cols-12 gap-10">
      <div className="lg:col-span-4">
        <div
          className={cn(
            "aspect-square w-full max-w-md mx-auto relative overflow-hidden",
            el.animClass,
          )}
        >
          {elImage && (
            <Image
              src={elImage}
              alt={`${locale === "es" ? el.nameEs : el.nameEn} — ${el.framework}`}
              fill
              sizes="(min-width: 1024px) 360px, 90vw"
              className="object-cover"
            />
          )}
          {/* Color wash to integrate the photo with the brand element palette */}
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-multiply opacity-40"
            style={{
              background: `linear-gradient(160deg, ${el.accent}33 0%, ${el.accentInk}66 100%)`,
            }}
          />
          {/* Bottom scrim so the label is always readable */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[var(--color-ink)]/85 via-[var(--color-ink)]/30 to-transparent"
          />
          <div className="absolute bottom-6 left-6 text-[var(--color-paper)]" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
            <div className="eyebrow" style={{ color: el.accentSoft }}>
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

      <div className="lg:col-span-8 space-y-8">
        <div className="grid sm:grid-cols-2 gap-8">
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

        {/* PARADOX — verbatim from presentation. Surfaces the central tension
         *  of each element so the reader meets it before the competencies. */}
        {el.paradoxEs && el.paradoxEn && (
          <div
            className="relative border-l-2 pl-7 py-4"
            style={{ borderColor: el.accent }}
          >
            <div
              className="eyebrow mb-3"
              style={{ color: el.accentInk }}
            >
              {locale === "es"
                ? `La paradoja del liderazgo de ${el.nameEs}`
                : `The ${el.nameEn} Leadership Paradox`}
            </div>
            <p className="font-[family-name:var(--font-display)] text-xl md:text-2xl leading-[1.4] text-[var(--color-ink)] text-pretty">
              {locale === "es" ? el.paradoxEs : el.paradoxEn}
            </p>
          </div>
        )}

        {/* KEY COMPONENTS — 4 named competencies per element from presentation. */}
        {el.components && (
          <div>
            <div className="eyebrow text-[var(--color-muted)] mb-5">
              {locale === "es"
                ? `Componentes clave del liderazgo de ${el.nameEs}`
                : `Key Components of ${el.nameEn} Leadership`}
            </div>
            <div className="border border-[var(--color-line)] divide-y divide-[var(--color-line)] bg-[var(--color-paper)]">
              {el.components.map((c, i) => (
                <div
                  key={c.nameEn}
                  className="grid grid-cols-[44px_1fr] gap-5 p-5 md:p-6"
                >
                  <span
                    className="font-[family-name:var(--font-display)] text-2xl tabular-nums"
                    style={{ color: el.accentInk }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="font-[family-name:var(--font-display)] text-lg mb-1.5 text-[var(--color-ink)]">
                      {locale === "es" ? c.nameEs : c.nameEn}
                    </h4>
                    <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                      {locale === "es" ? c.bodyEs : c.bodyEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INVITATION — closing question verbatim from master doc media script. */}
        {el.invitationEs && el.invitationEn && (
          <div
            className="text-center py-8 border-t border-b"
            style={{ borderColor: el.accentSoft }}
          >
            <p
              className="font-[family-name:var(--font-display)] text-2xl md:text-3xl italic leading-snug"
              style={{ color: el.accentInk }}
            >
              {locale === "es" ? el.invitationEs : el.invitationEn}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import type { LucideIcon } from "lucide-react";

const DAILY_ICONS: Record<ElementKey, LucideIcon> = {
  agua: Droplets,
  fuego: Flame,
  aire: Wind,
  tierra: Mountain,
  eter: Sparkles,
};

function DailyScanGrid({ locale }: { locale: "es" | "en" }) {
  const rows = locale === "es" ? dailyScanEs : dailyScanEn;
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
      {rows.map((row, idx) => {
        const el = elements.find((e) => e.key === row.element);
        const Icon = DAILY_ICONS[row.element];
        const prompt = locale === "es" ? (row as { promptEs: string }).promptEs : (row as { promptEn: string }).promptEn;
        return (
          <article
            key={row.element}
            className="bg-[var(--color-paper)] p-7 md:p-8 hover:bg-[var(--color-paper-warm)] transition-colors min-h-[280px] flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <span
                className="inline-flex items-center justify-center h-10 w-10 rounded-full"
                style={{ background: el?.accentSoft ?? "#fff" }}
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} style={{ color: el?.accent }} />
              </span>
              <span
                className="text-[0.65rem] tracking-[0.22em] uppercase font-medium"
                style={{ color: el?.accent }}
              >
                {locale === "es" ? el?.nameEs : el?.nameEn} · {el?.framework}
              </span>
            </div>
            <p className="font-[family-name:var(--font-display)] text-lg leading-snug text-[var(--color-ink-soft)] flex-1">
              {prompt}
            </p>
            <div className="mt-6 pt-4 border-t border-[var(--color-line)] text-[0.62rem] tracking-[0.22em] uppercase text-[var(--color-muted)]">
              {String(idx + 1).padStart(2, "0")} / 04
            </div>
          </article>
        );
      })}
    </div>
  );
}
