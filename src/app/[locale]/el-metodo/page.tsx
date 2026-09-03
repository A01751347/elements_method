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
  ArrowUpRight,
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
  fourElements,
  elementImages,
  frameworkImages,
  shadowProfile,
  audienceEs,
  audienceEn,
  resultsEs,
  resultsEn,
  dailyScanEs,
  dailyScanEn,
  bibliography,
  type ElementInfo,
  type ElementKey,
} from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { getNextExperience, isEarlyAccessActive } from "@/data/experiences";
import { NextExperienceBand } from "@/components/sections/NextExperienceBand";
import { cn } from "@/lib/utils";

export default function MethodPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  // Only the four elements get a framework card — the Núcleo is the leader,
  // not a fifth tab (client feedback #7 #21).
  const [activeIdx, setActiveIdx] = useState(0);
  const active = fourElements[activeIdx];

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Sales path above the fold: the nearest upcoming experience gets a direct
  // CTA in the hero and a promo band right after it.
  const next = getNextExperience();
  const nextEarly = next ? isEarlyAccessActive(next) : false;
  const experiencesBase = `/${locale}/${locale === "es" ? "retiros" : "retreats"}`;
  const nextHref = next ? `${experiencesBase}/${next.slug}` : experiencesBase;

  return (
    <>
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[80vh] flex items-end overflow-hidden -mt-20 pt-36 md:pt-44 text-[var(--color-paper)]"
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
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            {next && (
              <Button href={nextHref} size="md" variant="solidLight" trailingArrow>
                {locale === "es"
                  ? `Reserva tu lugar · ${next.title}`
                  : `Reserve your seat · ${next.title}`}
              </Button>
            )}
            <Button href={experiencesBase} size="md" variant="outlineLight">
              {locale === "es" ? "Ver calendario" : "View calendar"}
            </Button>
          </motion.div>
        </Container>
      </section>

      {/* NEXT EXPERIENCE — promo band (fast sales path, no scrolling needed) */}
      <NextExperienceBand locale={locale} />

      {/* CORE INSIGHT — golden_circle.md + master doc */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <BookMarked className="h-3.5 w-3.5" strokeWidth={1.5} /> Core insight
            </Eyebrow>
            <h2 className="display-3 text-balance">
              {locale === "es"
                ? "Transforma y eleva el núcleo, y todo lo que orbita a su alrededor cambiará."
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
                ? "En la física, el núcleo es la masa densa y energética desde la que todo lo demás se organiza. En liderazgo, la persona, expresándose desde su autenticidad y naturaleza, es el núcleo desde el que todo se crea y se expande: las dinámicas del equipo, la cultura y los resultados de la organización."
                : "In physics, the nucleus is the dense, energetic mass from which everything else is organized. In leadership, the person, expressing themselves from their authenticity and nature, is the nucleus from which everything is created and expands: team dynamics, culture and the organization's results."}
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
              {locale === "es" ? "Las cargas del líder de hoy" : "The weight leaders carry today"}
            </Eyebrow>
            <h2 className="display-2 text-balance text-[var(--color-paper)]">
              {locale === "es"
                ? "El ritmo de hoy desconecta poco a poco al líder de las cualidades que hacen posible su mejor liderazgo."
                : "Today's pace slowly disconnects leaders from the very qualities that make their best leadership possible."}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-3 space-y-5">
            <p className="text-lg text-[var(--color-paper)]/95 leading-relaxed text-pretty">
              {locale === "es"
                ? "No es una crisis de capacidad. Es una crisis de conexión. Los líderes con quienes trabajamos no carecen de habilidades — simplemente necesitan hacer una conexión viva y encarnada con quienes realmente son."
                : "It is not a crisis of capability. It is a crisis of connection. The leaders we work with aren't missing skills. They're missing something more fundamental: a living, embodied connection to who they actually are."}
            </p>
            <p className="text-lg italic text-[var(--color-gold-soft)] leading-relaxed text-pretty border-l border-[var(--color-gold-soft)]/30 pl-5">
              {locale === "es"
                ? "72% de los líderes se sienten consumidos al final del día. Y su impacto pesa: un manager influye en la salud mental de su gente tanto como su pareja. La respuesta más común es añadir más herramientas a manos ya saturadas — cuando lo que falta no es una herramienta más, sino volver a la fuente."
                : "72% of leaders feel used up at the end of the day. And their impact is heavy: a manager affects their people's mental health as much as their partner does. The usual answer is to add more tools to already-full hands — when what's missing isn't another tool, but a return to the source."}
            </p>
            <p className="text-xs text-[var(--color-paper)]/55 leading-relaxed pl-5">
              {locale === "es"
                ? "DDI, Global Leadership Forecast 2023 · The Workforce Institute (UKG), 2023."
                : "DDI, Global Leadership Forecast 2023 · The Workforce Institute (UKG), 2023."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-[var(--color-paper)]/10 border border-[var(--color-paper)]/15">
          <div className="bg-[var(--color-ink)] p-8 md:p-10">
            <div className="eyebrow text-[var(--color-paper)]/85 mb-6">
              {locale === "es" ? "Lo que el ritmo actual produce" : "What today's pace produces"}
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
                    "Decisiones arraigadas en valores, creencias e identidad",
                    "Energía y presencia sostenibles",
                    "Sentido auténtico de propósito",
                    "Auto-consciencia encarnada",
                    "Una identidad auténtica, humana y coherente",
                  ]
                : [
                    "Clarity and inner quiet",
                    "Choices rooted in values, beliefs and identity",
                    "Sustainable energy and presence",
                    "Authentic sense of purpose",
                    "Embodied self-awareness",
                    "An authentic, human and coherent identity",
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

      {/* THE NÚCLEO — the leader at the centre, the one who integrates the four
       *  elements. There is no fifth element (client feedback #12 #14 #15). */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Atom className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "El Núcleo" : "The Core"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Al centro de los cuatro elementos: Tú."
                : "At the centre of the four elements: You."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-4">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Tierra, Fuego, Agua y Aire impactan directamente el núcleo, que eres tú. Ahí se concentra lo que integra todo lo demás: el autoconocimiento, el propósito, la sabiduría, la intención, la plenitud, la conexión humana, la gratitud, el servicio y el legado."
                : "Earth, Fire, Water and Air directly impact the nucleus, which is you. That's where everything else is integrated: self-knowledge, purpose, wisdom, intention, plenitude, human connection, gratitude, service and legacy."}
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
                ? "Elements Method trabaja de adentro hacia afuera. Tú, como núcleo, eres el centro que balancea y armoniza los cuatro elementos. Un líder sano no elige entre ellos: los integra. Y al integrarlos, todo lo demás se organiza a su alrededor."
                : "Elements Method works from the inside out. You, as the core, are the centre that balances and harmonizes the four elements. A healthy leader doesn't choose between them: they integrate them. And as they integrate them, everything else organizes around them."}
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
                  ? "Cada elemento tiene un framework operativo con competencias específicas que se entrenan y se observan. El líder, que es el núcleo de todo, aprende a identificarlas en sí mismo y a integrarlas."
                  : "Each element has an operational framework with specific competencies that are trained and observed. The leader, who is the core of it all, learns to identify them within and to integrate them."}
              </p>
            </div>
          </div>

          {/* The four elements. Each card surfaces the element's own photograph
           *  — fire for Fuego, a river for Agua, moving air for Aire, forest
           *  floor for Tierra (client feedback #18 #19 #20) — with a scrim that
           *  lifts on the active tab. */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-16">
            {fourElements.map((el, idx) => {
              const isActive = activeIdx === idx;
              const name = locale === "es" ? el.nameEs : el.nameEn;
              const moduleImg = frameworkImages[el.key] ?? elementImages[el.key];
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

      {/* THE INTEGRATED LEADER — closes the Shadow Profile: knowing your
       *  profile is step one; the goal is fluid access to all four, held and
       *  managed from your own núcleo. */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-12">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Compass className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "El líder integrado" : "The Integrated Leader"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Todos tenemos los cuatro elementos. El trabajo es tener acceso fluido a todos."
                : "We all carry the four elements. The work is having fluid access to all of them."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-3 space-y-5">
            <p className="lead text-pretty">
              {locale === "es"
                ? "El objetivo no es ser un líder de Agua, de Fuego, de Aire o de Tierra. El objetivo es tener acceso fluido a los cuatro dentro de ti, para identificar y gestionar el que cada momento requiere."
                : "The goal is not to be a Water, Fire, Air or Earth leader. The goal is to have fluid access to all four within you, so you can identify and manage the one each moment requires."}
            </p>
            <p className="text-[var(--color-ink-soft)] leading-relaxed text-pretty">
              {locale === "es"
                ? "La integración de los elementos conserva íntegra tu preferencia y tu fortaleza natural, y expande tu rango. Es el líder de Agua que además accede al Fuego cuando hace falta visión. El de Tierra que sube al Aire cuando el equipo necesita perspectiva estratégica. El de Fuego que encuentra el Agua cuando la situación pide escucha."
                : "Integrating the elements keeps your natural preference and strength fully intact, and expands your range. It is the Water leader who can also reach Fire when vision is needed. The Earth leader who rises into Air when the team needs strategic perspective. The Fire leader who finds Water when the situation calls for listening."}
            </p>
            <p className="text-[var(--color-ink-soft)] leading-relaxed text-pretty">
              {locale === "es"
                ? "Y al ser consciente de cuál predomina en ti — y de cómo gestionar cada elemento dentro de ti — tu impacto en las demás personas se vuelve mucho más significativo."
                : "And as you become aware of which one predominates in you — and of how to manage each element within yourself — your impact on the people around you becomes far more significant."}
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
              k: locale === "es" ? "4 días en naturaleza" : "4 days in nature",
              v: locale === "es" ? "+50% en desempeño de resolución creativa de problemas" : "+50% on creative problem-solving performance",
              ref: "Atchley et al. · PLoS ONE · 2012",
            },
            {
              icon: TestTube,
              k: locale === "es" ? "2h de Shinrin-yoku (baño de bosque)" : "2h of Shinrin-yoku (forest bathing)",
              v: locale === "es" ? "Aumenta células NK del sistema inmune ~50% (efecto hasta 30 días)" : "Raises NK immune cells ~50% (effect lasting up to 30 days)",
              ref: "Li et al. · 2008",
            },
            {
              icon: Activity,
              k: locale === "es" ? "Auto-consciencia real" : "Genuine self-awareness",
              v: locale === "es" ? "Solo 10–15% de las personas la tienen, aunque ~95% cree tenerla" : "Only 10–15% of people have it, though ~95% believe they do",
              ref: "Eurich · Harvard Business Review · 2018",
            },
            {
              icon: HeartPulse,
              k: locale === "es" ? "Sistema nervioso regulado" : "Regulated nervous system",
              v: locale === "es" ? "El estado del cuerpo condiciona la calidad del pensamiento y de la decisión" : "The state of the body conditions the quality of thought and decision",
              ref: "van der Kolk · The Body Keeps the Score · 2014",
            },
            {
              icon: Shield,
              k: locale === "es" ? "Seguridad psicológica" : "Psychological safety",
              v: locale === "es" ? "El factor nº1 de los equipos de alto desempeño en Google" : "The #1 factor in Google's high-performing teams",
              ref: "Google · Project Aristotle · 2015",
            },
            {
              icon: Brain,
              k: locale === "es" ? "8 semanas de MBSR (Mindfulness-Based Stress Reduction)" : "8 weeks of MBSR (Mindfulness-Based Stress Reduction)",
              v: locale === "es" ? "Cambios medibles en la materia gris del córtex prefrontal" : "Measurable changes in prefrontal cortex gray matter",
              ref: "Hölzel et al. · 2011",
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

      {/* BIBLIOGRAPHY — client feedback #33: "¿tienes bibliografía de esto?
       *  ¿algún estudio, reseña que podamos compartir?". Every figure quoted
       *  above traces to a real, linkable paper here. */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-12">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <BookMarked className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Bibliografía" : "Bibliography"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Cada dato de esta página tiene una fuente."
                : "Every figure on this page has a source."}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-3">
            <p className="lead text-pretty">
              {locale === "es"
                ? "La metodología se apoya en investigación publicada y revisada por pares. Esta es la lista completa, con enlace directo a cada estudio — para leerla, verificarla o compartirla con tu equipo."
                : "The methodology rests on published, peer-reviewed research. This is the full list, with a direct link to every study — to read, to verify, or to share with your team."}
            </p>
          </div>
        </div>

        <ol className="border-t border-[var(--color-line)]">
          {bibliography.map((ref, idx) => (
            <li
              key={ref.url}
              className="border-b border-[var(--color-line)] grid grid-cols-[2.5rem_1fr] md:grid-cols-[3.5rem_1fr_minmax(0,22rem)] gap-x-5 md:gap-x-10 gap-y-2 py-6"
            >
              <span className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-[var(--color-ink)]/20 tabular-nums leading-none pt-1">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="col-span-1">
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-start gap-1.5 font-[family-name:var(--font-display)] text-lg md:text-xl leading-snug text-[var(--color-ink)] hover:text-[var(--color-gold-deep)] transition-colors"
                >
                  <span className="underline decoration-[var(--color-line)] underline-offset-4 group-hover:decoration-[var(--color-gold-deep)]">
                    {ref.title}
                  </span>
                  <ArrowUpRight className="h-4 w-4 mt-1.5 shrink-0" strokeWidth={1.5} />
                </a>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                  {ref.authors} ({ref.year}). <em>{ref.venue}</em>.
                </p>
              </div>
              <p className="col-span-2 md:col-span-1 text-sm text-[var(--color-muted)] leading-relaxed md:text-right">
                {locale === "es" ? ref.claimEs : ref.claimEn}
              </p>
            </li>
          ))}
        </ol>
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
              {locale === "es" ? "El Escaneo de los Elementos" : "The Elemental Scan"}
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
                ? "Para cualquier desafío de liderazgo que enfrentas ahora mismo, los cuatro elementos te dan cuatro preguntas concretas — y tú, como núcleo, una quinta: la que integra cada aspecto de la naturaleza dentro de ti. Con el tiempo, integrarlos se vuelve instintivo: la marca del líder integrado."
                : "For any leadership challenge you face right now, the four elements give you four concrete questions — and you, as the core, a fifth: the one that integrates every aspect of nature within you. Over time, integrating them becomes instinctive: the mark of the integrated leader."}
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
                href={`/${locale}/${locale === "es" ? "retiros" : "retreats"}`}
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
  const layers: {
    label: string;
    body: string;
    /** When present the card typesets the acronym instead of a paragraph. */
    acronym?: ElementInfo["frameworkItems"];
  }[] = [
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
      acronym: el.frameworkItems,
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
              {l.acronym ? (
                /* The acronym reads down the left edge — one big letter per
                 *  competency — so ROOTS / IGNITE / FLOW / CLEAR is legible as
                 *  an acronym and not buried in a sentence (feedback #23). */
                <ul className="divide-y divide-[var(--color-line)]">
                  {l.acronym.map((item, n) => (
                    <li
                      key={`${item.letter}-${n}`}
                      className="grid grid-cols-[2rem_1fr] gap-x-4 py-2.5 first:pt-0 last:pb-0 items-baseline"
                    >
                      <span
                        aria-hidden
                        className="font-[family-name:var(--font-display)] text-2xl leading-none"
                        style={{ color: el.accentInk }}
                      >
                        {item.letter}
                      </span>
                      <span className="text-[var(--color-ink-soft)] leading-snug">
                        <strong className="font-medium text-[var(--color-ink)]">
                          {locale === "es" ? item.nameEs : item.nameEn}
                        </strong>
                        <span className="block text-sm">
                          {locale === "es" ? item.glossEs : item.glossEn}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[var(--color-ink-soft)] leading-relaxed">
                  {l.body}
                </p>
              )}
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
  // legacy `eter` key = the Núcleo (see ElementKey in @/data/content)
  eter: Atom,
};

function DailyScanGrid({ locale }: { locale: "es" | "en" }) {
  const rows = locale === "es" ? dailyScanEs : dailyScanEn;
  const total = String(rows.length).padStart(2, "0");
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
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
                {locale === "es" ? el?.nameEs : el?.nameEn} ·{" "}
                {el?.framework ?? (locale === "es" ? "Integración" : "Integration")}
              </span>
            </div>
            <p className="font-[family-name:var(--font-display)] text-lg leading-snug text-[var(--color-ink-soft)] flex-1">
              {prompt}
            </p>
            <div className="mt-6 pt-4 border-t border-[var(--color-line)] text-[0.62rem] tracking-[0.22em] uppercase text-[var(--color-muted)]">
              {String(idx + 1).padStart(2, "0")} / {total}
            </div>
          </article>
        );
      })}
    </div>
  );
}
