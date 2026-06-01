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
  X,
  Check,
  Compass,
  BookMarked,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { elements, type ElementInfo } from "@/data/content";
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

      {/* ORIGIN STRIP */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <BookMarked className="h-3.5 w-3.5" strokeWidth={1.5} /> Origen
            </Eyebrow>
            <h2 className="display-3 text-balance">
              {locale === "es"
                ? "Empezó como una pregunta a la intemperie."
                : "It began as a question in the open air."}
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-6 text-lg leading-relaxed text-[var(--color-ink-soft)] max-w-2xl">
            <p>
              {locale === "es"
                ? "En 2019, después de quince retiros mal hechos y dos burnouts entre socios, Andrés y Ana Michelle se hicieron una pregunta concreta: ¿por qué tantos cursos de liderazgo dejan a la gente igual o peor?"
                : "In 2019, after fifteen poorly-done retreats and two co-founder burnouts, Andrés and Ana Michelle asked a concrete question: why do so many leadership courses leave people the same or worse?"}
            </p>
            <p>
              {locale === "es"
                ? "La hipótesis fue arriesgada: el problema no es de contenido, es de canal. Si el liderazgo se piensa solo con la cabeza, se moldea solo con la cabeza. Y la cabeza ya está saturada."
                : "The hypothesis was risky: the problem isn't content, it's channel. If leadership is thought only with the head, it's shaped only with the head. And the head is already saturated."}
            </p>
            <p>
              {locale === "es"
                ? "Así nació Elements Method: trabajo somático, simbólico y operacional al mismo tiempo. Los cuatro elementos no son adorno — son la única gramática que sostuvo siete años de práctica sin desinflarse."
                : "Elements Method was born: somatic, symbolic and operational work at once. The four elements aren't decoration — they're the only grammar that held seven years of practice without deflating."}
            </p>
            <div className="grid grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)] mt-8">
              {[
                { k: "2019", v: locale === "es" ? "Primer retiro" : "First retreat" },
                { k: "42", v: locale === "es" ? "Inmersiones realizadas" : "Immersions held" },
                { k: "240+", v: locale === "es" ? "Líderes formados" : "Leaders trained" },
              ].map((s) => (
                <div key={s.k} className="bg-[var(--color-paper)] p-5">
                  <div className="font-[family-name:var(--font-display)] text-3xl">{s.k}</div>
                  <div className="text-xs tracking-wide text-[var(--color-muted)] mt-1 uppercase">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ELEMENT SELECTOR */}
      <Section spacing="default" contained={false} tone="warm" className="paper-grain">
        <Container>
          <div className="mb-16 grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <Eyebrow className="mb-6">
                {locale === "es" ? "El mapa simbólico" : "The symbolic map"}
              </Eyebrow>
              <h2 className="display-2 text-balance">
                {locale === "es"
                  ? "Cuatro terrenos. Cada uno con su gramática."
                  : "Four terrains. Each with its grammar."}
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="lead text-pretty">
                {locale === "es"
                  ? "Selecciona un elemento para ver sus cuatro capas: naturaleza, persona, metodología, fisiología. La práctica completa los une, pero estudiarlos por separado revela su geometría."
                  : "Select an element to see its four layers: nature, person, methodology, physiology. Practice unites them, but studying them separately reveals their geometry."}
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

      {/* SCIENCE / PHYSIOLOGY */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <HeartPulse className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Anatomía del cambio" : "Anatomy of change"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "El cuerpo aprende primero. La cabeza después."
                : "The body learns first. The head after."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-4 text-lg leading-relaxed text-[var(--color-ink-soft)]">
            <p>
              {locale === "es"
                ? "Décadas de investigación en neurociencia somática confirman lo que las tradiciones contemplativas sabían: el sistema nervioso decide antes que la corteza. Entrenar al líder solo con palabras es entrenar al 5% del sistema."
                : "Decades of somatic neuroscience confirm what contemplative traditions knew: the nervous system decides before the cortex. Training a leader only with words is training 5% of the system."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {[
            {
              icon: Brain,
              k: locale === "es" ? "Neuroplasticidad" : "Neuroplasticity",
              v:
                locale === "es"
                  ? "Cada práctica somática repetida durante seis semanas reconfigura circuitos de respuesta al estrés. No es esperanza: es bibliografía."
                  : "Each somatic practice repeated over six weeks reconfigures stress-response circuits. Not hope — bibliography.",
              ref: "Porges, Polyvagal Theory · 2011",
            },
            {
              icon: HeartPulse,
              k: locale === "es" ? "Tono vagal" : "Vagal tone",
              v:
                locale === "es"
                  ? "Breathwork, frío y silencio elevan la variabilidad cardíaca. Más HRV es más capacidad de sostener tensión sin reaccionar."
                  : "Breathwork, cold and silence raise heart-rate variability. More HRV means more capacity to hold tension without reacting.",
              ref: "Lehrer, HRV Biofeedback · 2014",
            },
            {
              icon: Activity,
              k: locale === "es" ? "Memoria implícita" : "Implicit memory",
              v:
                locale === "es"
                  ? "Lo aprendido bajo activación corporal se retiene siete veces más que lo aprendido en sesión sentada. El cuerpo recuerda."
                  : "What's learned under bodily activation is retained seven times more than seated-session learning. The body remembers.",
              ref: "van der Kolk · 2014",
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

      {/* WHAT WE ARE / ARE NOT */}
      <Section spacing="default" tone="warm">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Compass className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Diferenciación" : "Differentiation"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Lo que sí somos. Y lo que no."
                : "What we are. What we aren't."}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Para que no haya confusión. El método no es para todas las personas, ni quiere serlo."
                : "So there's no confusion. The method isn't for everyone, nor wants to be."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          <div className="bg-[var(--color-paper)] p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <span className="h-9 w-9 rounded-full bg-[var(--color-moss-500)] text-[var(--color-paper)] inline-flex items-center justify-center">
                <Check className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="eyebrow text-[var(--color-moss-700)]">
                {locale === "es" ? "Sí somos" : "We are"}
              </span>
            </div>
            <ul className="space-y-5">
              {(locale === "es"
                ? [
                    "Práctica somática estructurada con marcos operativos.",
                    "Compromiso de tiempo real: meses, no fines de semana.",
                    "Trabajo con cuerpo, decisión, cuerpo otra vez.",
                    "Honestidad incluso cuando incomoda al equipo y al cliente.",
                    "Pasajes por naturaleza salvaje sin escenografía.",
                  ]
                : [
                    "Structured somatic practice with operational frameworks.",
                    "Real-time commitment: months, not weekends.",
                    "Work with body, decision, body again.",
                    "Honesty even when it inconveniences team and client.",
                    "Passages through wild nature without scenography.",
                  ]
              ).map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-[var(--color-ink-soft)]"
                >
                  <span className="h-1 w-3 bg-[var(--color-moss-500)] mt-3 shrink-0" />
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[var(--color-paper)] p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <span className="h-9 w-9 rounded-full bg-[var(--color-fire)] text-[var(--color-paper)] inline-flex items-center justify-center">
                <X className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="eyebrow text-[var(--color-fire)]">
                {locale === "es" ? "No somos" : "We are not"}
              </span>
            </div>
            <ul className="space-y-5">
              {(locale === "es"
                ? [
                    "Retiro espiritual genérico con incienso de fondo.",
                    "Coaching de positividad que evita lo difícil.",
                    "MBA, taller corporativo o team building.",
                    "Terapia ni sustituto de tratamiento clínico.",
                    "Promesa de resultados rápidos ni atajos.",
                  ]
                : [
                    "Generic spiritual retreat with incense in the background.",
                    "Positivity coaching that avoids the hard.",
                    "MBA, corporate workshop or team building.",
                    "Therapy nor substitute for clinical treatment.",
                    "Quick-result promises or shortcuts.",
                  ]
              ).map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-[var(--color-ink-soft)]"
                >
                  <span className="h-1 w-3 bg-[var(--color-fire)] mt-3 shrink-0" />
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* PROFILE / WHO THIS IS FOR */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Perfil" : "Profile"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "¿Esto es para ti?"
                : "Is this for you?"}
            </h2>
            <p className="mt-6 lead text-pretty">
              {locale === "es"
                ? "Cuatro señales que conviene reconocer antes de entrar."
                : "Four signals worth recognizing before entering."}
            </p>
            <div className="mt-10">
              <Button
                href={`/${locale}/${locale === "es" ? "los-caminos" : "paths"}`}
                trailingArrow
              >
                {locale === "es" ? "Ver los caminos" : "See the paths"}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
            {(locale === "es"
              ? [
                  {
                    n: "01",
                    t: "Decides cosas pesadas",
                    b: "Tu trabajo implica decisiones cuyas consecuencias importan. No quieres tomar decisiones más rápido — quieres tomarlas mejor.",
                  },
                  {
                    n: "02",
                    t: "Ya leíste muchos libros",
                    b: "Sabes la teoría. Lo que no logras es traducirla a movimiento sostenido. El cuerpo es el eslabón faltante.",
                  },
                  {
                    n: "03",
                    t: "Tienes piso suficiente",
                    b: "No vienes de una crisis aguda. Buscas ir más hondo desde un lugar estable, no usar el método como rescate.",
                  },
                  {
                    n: "04",
                    t: "Aguantas la verdad",
                    b: "El método no halaga. Si lo que ves de ti no te gusta, vamos a mirarlo. Si te incomoda el espejo, no es momento.",
                  },
                ]
              : [
                  {
                    n: "01",
                    t: "You decide heavy things",
                    b: "Your work involves decisions whose consequences matter. You don't want to decide faster — you want to decide better.",
                  },
                  {
                    n: "02",
                    t: "You've read many books",
                    b: "You know the theory. What you can't manage is translating it into sustained movement. The body is the missing link.",
                  },
                  {
                    n: "03",
                    t: "You have enough ground",
                    b: "You don't come from acute crisis. You seek to go deeper from a stable place, not use the method as rescue.",
                  },
                  {
                    n: "04",
                    t: "You can take the truth",
                    b: "The method doesn't flatter. If what you see of yourself displeases you, we'll look at it. If the mirror unsettles you, it's not time.",
                  },
                ]
            ).map((row, idx) => (
              <motion.div
                key={row.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-[var(--color-paper-warm)] p-7 border border-[var(--color-line)] hover:bg-[var(--color-paper)] transition-colors duration-500"
              >
                <div className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-moss-700)]/50 mb-4">
                  {row.n}
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-xl tracking-tight mb-3">
                  {row.t}
                </h3>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                  {row.b}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CLOSING NARRATIVE */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Eyebrow inverted className="mb-6">
              {locale === "es" ? "Integración" : "Integration"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)]">
              {locale === "es"
                ? "Cada elemento se entrena. Los cuatro se sostienen."
                : "Each element is trained. The four hold each other."}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-4 space-y-6 text-lg text-[var(--color-paper)]/80 leading-relaxed max-w-2xl">
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
            <div className="pt-8 flex flex-wrap gap-3">
              <Button
                href={`/${locale}/${locale === "es" ? "los-caminos" : "paths"}`}
                variant="primary"
                trailingArrow
                className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)]"
              >
                {locale === "es" ? "Diseñar mi camino" : "Design my path"}
              </Button>
              <Button
                href={`/${locale}/${locale === "es" ? "retiros" : "retreats"}`}
                variant="outlineLight"
              >
                {locale === "es" ? "Ver retiros" : "See retreats"}
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
          <div className="absolute bottom-6 left-6">
            <div className="eyebrow text-[var(--color-ink-soft)]">
              {locale === "es" ? "Elemento" : "Element"}
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
