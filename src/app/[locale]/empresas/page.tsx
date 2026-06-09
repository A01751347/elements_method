import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ClipboardList,
  Layers,
  Target,
  ShieldCheck,
  Users,
  Building,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/Container";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { LogosMarquee } from "@/components/sections/LogosMarquee";

const BENEFIT_ICONS = [ClipboardList, Layers, Target, ShieldCheck];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "Organizations" : "Organizaciones" };
}

export default async function CompaniesPage({
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
            src="/images/heroes/empresas.jpg"
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
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <div className="eyebrow text-[var(--color-paper)]/80 mb-8 flex items-center gap-3">
                <span aria-hidden className="h-px w-12 bg-[var(--color-paper)]/40" />
                {dict.companies.eyebrow}
              </div>
              <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[22ch]">
                {dict.companies.title}
              </h1>
            </div>
            <div className="lg:col-span-4">
              <p className="lead text-[var(--color-paper)]/85">{dict.companies.lead}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  href={`mailto:hello@elementsmethod.com`}
                  size="lg"
                  trailingArrow
                  className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)]"
                >
                  {dict.companies.cta}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* WHO THIS IS FOR — from presentation page 2 */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Para quién" : "Who this is for"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Cuatro perfiles que llegan a Elements Method."
                : "Four profiles that come to Elements Method."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-4">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Elements Method está diseñado para quienes ya entienden que evolucionar su liderazgo es una ventaja competitiva."
                : "Elements Method is designed for those who already understand that evolving their leadership is a competitive advantage."}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {(locale === "es"
            ? [
                {
                  icon: Building,
                  t: "Ejecutivos senior",
                  b: "Navegando complejidad, transición o crecimiento.",
                },
                {
                  icon: Users,
                  t: "Equipos de liderazgo",
                  b: "Buscando mayor cohesión y cultura compartida.",
                },
                {
                  icon: Target,
                  t: "Organizaciones",
                  b: "Invirtiendo en el desarrollo de largo plazo de su pipeline de liderazgo.",
                },
                {
                  icon: GraduationCap,
                  t: "HR y L&D",
                  b: "Buscando un programa diferenciado y de alto impacto.",
                },
              ]
            : [
                {
                  icon: Building,
                  t: "Senior executives",
                  b: "Navigating complexity, transition or growth.",
                },
                {
                  icon: Users,
                  t: "Leadership teams",
                  b: "Seeking deeper cohesion and shared culture.",
                },
                {
                  icon: Target,
                  t: "Organizations",
                  b: "Investing in the long-term development of their leadership pipeline.",
                },
                {
                  icon: GraduationCap,
                  t: "HR and L&D",
                  b: "Looking for a differentiated, high-impact program.",
                },
              ]
          ).map((row, idx) => {
            const Icon = row.icon;
            return (
              <div
                key={row.t}
                className="bg-[var(--color-paper-warm)] p-8 md:p-10 hover:bg-[var(--color-paper)] transition-colors min-h-[260px] flex flex-col"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="h-5 w-5 text-[var(--color-moss-700)]" strokeWidth={1.5} />
                  <span className="eyebrow text-[var(--color-muted)]">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-xl tracking-tight mb-3">
                  {row.t}
                </h3>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed flex-1">
                  {row.b}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* WHAT ORGANIZATIONS PRODUCE vs WHAT LEADERS NEED — from presentation page 4 */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6">
              {locale === "es" ? "La epidemia de desconexión" : "The disconnection epidemic"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Lo que las organizaciones producen. Lo que los líderes realmente necesitan."
                : "What organizations produce. What leaders actually need."}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-3">
            <p className="lead text-pretty">
              {locale === "es"
                ? "La vida organizacional moderna desconecta sistemáticamente a los líderes de las cualidades que hacen posible el liderazgo."
                : "Modern organizational life systematically disconnects leaders from the very qualities that make leadership possible."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          <div className="bg-[var(--color-paper)] p-8 md:p-12">
            <div className="eyebrow text-[var(--color-fire)] mb-8">
              {locale === "es" ? "Lo que producen" : "What they produce"}
            </div>
            <ul className="space-y-5">
              {(locale === "es"
                ? [
                    "Sobrecarga cognitiva",
                    "Toma de decisión reactiva",
                    "Presión crónica de desempeño",
                    "Pérdida de motivación intrínseca",
                    "Desconexión del cuerpo",
                    "Sentido de sí mismo encogido",
                  ]
                : [
                    "Cognitive overload",
                    "Reactive decision-making",
                    "Chronic performance pressure",
                    "Loss of intrinsic motivation",
                    "Disconnection from the body",
                    "Shrinking sense of self",
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

          <div className="bg-[var(--color-paper-warm)] p-8 md:p-12">
            <div className="eyebrow text-[var(--color-moss-700)] mb-8">
              {locale === "es" ? "Lo que necesitan" : "What they need"}
            </div>
            <ul className="space-y-5">
              {(locale === "es"
                ? [
                    "Claridad y quietud interna",
                    "Decisiones ancladas en valores",
                    "Energía y presencia sostenibles",
                    "Sentido auténtico de propósito",
                    "Auto-conciencia encarnada",
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
        </div>
      </Section>

      {/* ROI / OUTCOMES — from presentation page 9 */}
      <Section spacing="default" tone="warm">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Lo que reportan" : "What they report"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Resultados documentados, individuales y organizacionales."
                : "Documented outcomes, individual and organizational."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-4">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Organizaciones que invierten en desarrollo de liderazgo basado en naturaleza reportan retornos medibles."
                : "Organizations that invest in nature-based leadership development report measurable returns."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          <div className="bg-[var(--color-paper)] p-8 md:p-10">
            <div className="eyebrow text-[var(--color-muted)] mb-6">
              {locale === "es" ? "Resultados individuales" : "Individual outcomes"}
            </div>
            <ul className="space-y-4 text-[var(--color-ink-soft)]">
              {(locale === "es"
                ? [
                    "Regulación emocional y resiliencia frente al estrés significativamente mejoradas",
                    "Mayor auto-conciencia y autenticidad en el liderazgo",
                    "Mayor claridad de valores y brújula personal de liderazgo",
                    "Sentido renovado de propósito y motivación intrínseca",
                    "Mayor presencia física y reducción de indicadores de burnout",
                  ]
                : [
                    "Significantly improved emotional regulation and stress resilience",
                    "Increased self-awareness and leadership authenticity",
                    "Clearer sense of values and personal leadership compass",
                    "Renewed sense of purpose and intrinsic motivation",
                    "Greater physical presence and reduced burnout indicators",
                  ]
              ).map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="h-1 w-3 bg-[var(--color-moss-500)] mt-3 shrink-0" />
                  <span className="leading-relaxed text-sm">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[var(--color-paper)] p-8 md:p-10">
            <div className="eyebrow text-[var(--color-muted)] mb-6">
              {locale === "es" ? "Resultados organizacionales" : "Organizational outcomes"}
            </div>
            <ul className="space-y-4 text-[var(--color-ink-soft)]">
              {dict.companies.benefits.map((b) => (
                <li key={b.title} className="flex items-start gap-3">
                  <span className="h-1 w-3 bg-[var(--color-moss-500)] mt-3 shrink-0" />
                  <span className="leading-relaxed text-sm">
                    <span className="text-[var(--color-ink)]">{b.title}.</span>{" "}
                    <span>{b.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <LogosMarquee locale={locale} dict={dict} />

      {/* FINAL CTA — from presentation pages 28-30 */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <Eyebrow inverted className="mb-6">
              {locale === "es" ? "Para tu organización" : "For your organization"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)] text-balance">
              {locale === "es"
                ? "Los programas corporativos se diseñan a la medida tras un proceso de discovery con HR y senior leadership."
                : "Corporate programs are custom-designed following a discovery process with HR and senior leadership."}
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-lg text-[var(--color-paper)]/75 leading-relaxed text-pretty mb-8">
              {locale === "es"
                ? "Contáctanos para explorar el diseño correcto para tu organización."
                : "Please contact us to explore the right design for your organization."}
            </p>
            <div className="space-y-3">
              <a
                href="mailto:hello@elementsmethod.com"
                className="block text-[var(--color-paper)] hover:text-[var(--color-paper-warm)] transition-colors"
              >
                hello@elementsmethod.com
              </a>
              <a
                href="https://www.elementsmethod.com"
                className="block text-[var(--color-paper)]/70 hover:text-[var(--color-paper)] transition-colors text-sm"
              >
                www.elementsmethod.com
              </a>
            </div>
            <div className="mt-8">
              <Button
                href={`mailto:hello@elementsmethod.com`}
                size="lg"
                trailingArrow
                className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)]"
              >
                {locale === "es" ? "Iniciar conversación" : "Begin the conversation"}
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
