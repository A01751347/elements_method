import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Wind,
  Eye,
  PenLine,
  MessageCircle,
  Flame,
  Sparkles,
  Compass,
} from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { RetreatsShowcase } from "@/components/sections/RetreatsShowcase";
import { singleModulePricing } from "@/data/content";
import { formatPriceMXN } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "Modules" : "Módulos" };
}

export default async function RetreatsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden -mt-20 pt-20 text-[var(--color-paper)]">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/heroes/retiros.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-ink)]/40 via-[var(--color-ink)]/55 to-[var(--color-ink)]" />
        <div className="absolute inset-0 -z-10 film-grain" />

        <Container className="relative pb-16 md:pb-24">
          <div className="eyebrow text-[var(--color-paper)]/80 mb-8 flex items-center gap-3">
            <span aria-hidden className="h-px w-12 bg-[var(--color-paper)]/40" />
            {dict.retreats.eyebrow}
          </div>
          <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[15ch]">
            {dict.retreats.title}
          </h1>
          <p className="lead mt-8 max-w-2xl text-[var(--color-paper)]/85">
            {dict.retreats.lead}
          </p>
        </Container>
      </section>

      {/* FORMAT — verbatim from proyecto.md */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6">
              {locale === "es" ? "Formato" : "Format"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Cuatro módulos. Un día al mes cada uno."
                : "Four modules. One day per month each."}
            </h2>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
            {[
              {
                k: locale === "es" ? "Módulos independientes" : "Independent modules",
                v: "4",
              },
              {
                k: locale === "es" ? "Frecuencia" : "Frequency",
                v: locale === "es" ? "1 día al mes" : "1 day per month",
              },
              {
                k: locale === "es" ? "Cupo por módulo" : "Per-module capacity",
                v: locale === "es" ? "15 participantes" : "15 participants",
              },
              {
                k: locale === "es" ? "Tipo" : "Type",
                v: locale === "es" ? "Formato intensivo" : "Intensive format",
              },
            ].map((row) => (
              <div key={row.k} className="bg-[var(--color-paper)] p-6">
                <div className="eyebrow text-[var(--color-muted)] mb-2">
                  {row.k}
                </div>
                <div className="font-[family-name:var(--font-display)] text-3xl">
                  {row.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* GRID OF MODULES */}
      <RetreatsShowcase locale={locale} dict={dict} hideHeader />

      {/* DISCONNECTION PROTOCOL — verbatim from presentation page 8 */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Wind className="h-3.5 w-3.5" strokeWidth={1.5} />
              Disconnection Protocol
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Cinco fases por módulo."
                : "Five phases per module."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-4">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Cada inmersión de Elements Method está diseñada alrededor de un arco cuidadosamente secuenciado de desconexión-reconexión."
                : "Every Elements Method immersion is designed around a carefully sequenced disconnection-reconnection arc."}
            </p>
          </div>
        </div>

        <div className="border border-[var(--color-line)] divide-y divide-[var(--color-line)] bg-[var(--color-paper)]">
          {(locale === "es"
            ? [
                {
                  n: "01",
                  phase: "Release · Liberar",
                  duration: "0–60 min",
                  body: "Llegar físicamente. Soltar los dispositivos. Dejar que el sistema nervioso comience a aterrizar. El silencio es bienvenido.",
                },
                {
                  n: "02",
                  phase: "Encounter · Encontrar",
                  duration: "1–3 hrs",
                  body: "Encuentro con el elemento — a través de experiencia sensorial directa, observación facilitada y presencia somática.",
                },
                {
                  n: "03",
                  phase: "Reflection · Reflejar",
                  duration: "30–60 min",
                  body: "Journaling individual y reflexión en silencio. El elemento como espejo. ¿Qué me muestra sobre mi liderazgo?",
                },
                {
                  n: "04",
                  phase: "Dialogue · Dialogar",
                  duration: "60–90 min",
                  body: "Conversación grupal facilitada. ¿Qué emergió? ¿Qué sorprendió? ¿Cuál es el filo que este elemento revela?",
                },
                {
                  n: "05",
                  phase: "Integration · Integrar",
                  duration: "30–60 min",
                  body: "Ritual de cierre ligado al elemento. Un compromiso. Una intención. El puente de regreso a la vida organizacional.",
                },
              ]
            : [
                {
                  n: "01",
                  phase: "Release",
                  duration: "0–60 min",
                  body: "Physically arrive. Put down devices. Let the nervous system begin to settle. Silence is welcome.",
                },
                {
                  n: "02",
                  phase: "Encounter",
                  duration: "1–3 hrs",
                  body: "Meet the element — through direct sensory experience, facilitated observation, and somatic presence.",
                },
                {
                  n: "03",
                  phase: "Reflection",
                  duration: "30–60 min",
                  body: "Individual journaling and silent reflection. The element as mirror. What is it showing me about my leadership?",
                },
                {
                  n: "04",
                  phase: "Dialogue",
                  duration: "60–90 min",
                  body: "Facilitated group conversation. What emerged? What surprised? What is the edge this element reveals?",
                },
                {
                  n: "05",
                  phase: "Integration",
                  duration: "30–60 min",
                  body: "Closing ritual tied to the element. One commitment. One intention. The bridge back to organizational life.",
                },
              ]
          ).map((row) => (
            <div
              key={row.n}
              className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_220px_120px_1fr] gap-4 md:gap-6 p-5 md:p-7 items-start hover:bg-[var(--color-paper-warm)] transition-colors"
            >
              <span className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-[var(--color-moss-700)]">
                {row.n}
              </span>
              <span className="font-[family-name:var(--font-display)] text-lg md:text-xl tracking-tight col-span-1">
                {row.phase}
              </span>
              <span className="text-xs uppercase tracking-wide text-[var(--color-muted)] md:text-right tabular-nums col-span-1">
                {row.duration}
              </span>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed col-span-2 md:col-span-1">
                {row.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* SAMPLE EXERCISES — verbatim from presentation */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Ejercicios del campo" : "Field exercises"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Un ejercicio destacado por elemento."
                : "One featured exercise per element."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-4">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Estos son ejercicios documentados del programa — cada uno con su entorno, su duración y su por qué."
                : "These are documented program exercises — each with its environment, duration and rationale."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {(locale === "es"
            ? [
                {
                  icon: Compass,
                  el: "Tierra · ROOTS",
                  t: "The Root Contact",
                  b: "Descalzo sobre tierra de bosque, 30 minutos en silencio. Una instrucción: notar dónde sí y dónde no sientes el suelo en tu cuerpo. Earthing documentado reduce inflamación y regula cortisol.",
                },
                {
                  icon: Flame,
                  el: "Fuego · IGNITE",
                  t: "The Fire Council",
                  b: "Círculo alrededor del fuego sin agenda los primeros 60 minutos. Dos preguntas: ¿cuál es la visión que cargas y no has hablado? ¿Cuál es el fuego que has mantenido demasiado pequeño?",
                },
                {
                  icon: Eye,
                  el: "Agua · FLOW",
                  t: "The River Witness",
                  b: "Solo, junto a agua en movimiento, mínimo 20 minutos en silencio. Activa el Default Mode Network. Tres preguntas para integrar lo que el río mostró.",
                },
                {
                  icon: PenLine,
                  el: "Aire · CLEAR",
                  t: "The 100-Word Truth",
                  b: "Escribe exactamente 100 palabras sobre tu desafío más importante. Luego 10. Luego 1. La compresión revela la palabra brújula de los meses siguientes.",
                },
              ]
            : [
                {
                  icon: Compass,
                  el: "Earth · ROOTS",
                  t: "The Root Contact",
                  b: "Barefoot on forest soil, 30 minutes in silence. One instruction: notice where in your body you feel the ground — and where you don't. Documented earthing reduces inflammation and regulates cortisol.",
                },
                {
                  icon: Flame,
                  el: "Fire · IGNITE",
                  t: "The Fire Council",
                  b: "Circle around fire with no agenda for the first 60 minutes. Two questions: what's the vision you carry and haven't spoken? What's the fire you've kept too small?",
                },
                {
                  icon: Eye,
                  el: "Water · FLOW",
                  t: "The River Witness",
                  b: "Alone, beside moving water, minimum 20 minutes in silence. Activates the Default Mode Network. Three questions to integrate what the river showed.",
                },
                {
                  icon: PenLine,
                  el: "Air · CLEAR",
                  t: "The 100-Word Truth",
                  b: "Write exactly 100 words about your most important challenge. Then 10. Then 1. Compression reveals the compass word of the months ahead.",
                },
              ]
          ).map((row) => {
            const Icon = row.icon;
            return (
              <article
                key={row.t}
                className="bg-[var(--color-paper)] p-7 md:p-8 hover:bg-[var(--color-paper-warm)] transition-colors min-h-[320px] flex flex-col"
              >
                <div className="flex items-start justify-between mb-6">
                  <Icon className="h-5 w-5 text-[var(--color-moss-700)]" strokeWidth={1.5} />
                  <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-muted)]">
                    {row.el}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-xl tracking-tight mb-3">
                  {row.t}
                </h3>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed flex-1">
                  {row.b}
                </p>
              </article>
            );
          })}
        </div>
      </Section>

      {/* PRICING */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Eyebrow inverted className="mb-6">
              {locale === "es" ? "Inversión por módulo" : "Per-module investment"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)] text-balance">
              {locale === "es"
                ? "Tres precios. Aplicabilidad clara."
                : "Three prices. Clear applicability."}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <div className="space-y-4">
              <PricingDark
                label={locale === "es" ? "Precio estándar" : "Standard price"}
                value={formatPriceMXN(singleModulePricing.standardMxn)}
                emphasis
              />
              <PricingDark
                label="Early Bird"
                value={formatPriceMXN(singleModulePricing.earlyBirdMxn)}
              />
              <PricingDark
                label={locale === "es" ? "Grupos (3 o más)" : "Groups (3 or more)"}
                value={formatPriceMXN(singleModulePricing.groupMxn)}
              />
            </div>
            <div className="mt-8">
              <Button
                href="mailto:hello@elementsmethod.com"
                size="lg"
                trailingArrow
                className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)]"
              >
                {locale === "es" ? "Aplicar a un módulo" : "Apply to a module"}
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function PricingDark({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-end justify-between gap-4 py-3 border-b border-[var(--color-paper)]/15 last:border-0">
      <span className="text-[var(--color-paper)]/75">{label}</span>
      <span
        className={`font-[family-name:var(--font-display)] tabular-nums text-[var(--color-paper)] ${
          emphasis ? "text-3xl" : "text-xl text-[var(--color-paper)]/75"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
