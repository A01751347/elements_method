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
  Quote,
} from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/Container";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { testimonials } from "@/data/content";

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
  const testimonial = testimonials[0];

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
              <div className="eyebrow text-[var(--color-paper)]/95 mb-8 flex items-center gap-3">
                <span aria-hidden className="h-px w-12 bg-[var(--color-paper)]/40" />
                {dict.companies.eyebrow}
              </div>
              <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[22ch]">
                {dict.companies.title}
              </h1>
            </div>
            <div className="lg:col-span-4">
              <p className="lead text-[var(--color-paper)]/95">{dict.companies.lead}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  href="mailto:hello@elementsmethod.com"
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

      {/* EXECUTIVE SUMMARY — verbatim from elements-method-presentation.docx */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-6">
              {locale === "es" ? "Resumen ejecutivo" : "Executive Summary"}
            </Eyebrow>
          </div>
          <div className="lg:col-span-8 space-y-6 text-lg leading-relaxed text-[var(--color-ink-soft)]">
            <p className="text-[var(--color-ink)] text-balance font-[family-name:var(--font-display)] text-2xl md:text-3xl leading-snug">
              {locale === "es"
                ? "La variable más importante en cualquier organización es la calidad de su liderazgo. Y, sin embargo, la mayoría de los programas de desarrollo de liderazgo abordan los síntomas — estilos de comunicación, frameworks de decisión, dinámicas de equipo — sin abordar la fuente."
                : "The most important variable in any organization is the quality of its leadership. Yet most leadership development programs address the symptoms — communication styles, decision frameworks, team dynamics — without addressing the source."}
            </p>
            <p className="italic font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)]">
              {locale === "es"
                ? "La fuente es el líder mismo."
                : "The source is the leader themselves."}
            </p>
            <p>
              {locale === "es"
                ? "Elements Method es un programa de inmersión de liderazgo basado en naturaleza, diseñado para devolver a los líderes a su naturaleza esencial — y, al hacerlo, desbloquear el tipo de presencia, claridad y propósito que transforma no solo a los individuos, sino las organizaciones que lideran."
                : "Elements Method is a nature-based leadership immersion program designed to return leaders to their essential nature — and in doing so, unlock the kind of presence, clarity, and purpose that transforms not just individuals, but the organizations they lead."}
            </p>
          </div>
        </div>
      </Section>

      {/* WHO THIS IS FOR */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Para qué organizaciones" : "For which organizations"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Cinco perfiles organizacionales que llegan a Origin."
                : "Five organizational profiles that come to Origin."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-4">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Diseñamos Origin para organizaciones donde el liderazgo es palanca, no solo gestión."
                : "We design Origin for organizations where leadership is leverage, not just management."}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {(locale === "es"
            ? [
                { icon: Building, t: "Empresas invirtiendo en liderazgo", b: "Que entienden el desarrollo de líderes como prioridad estratégica." },
                { icon: GraduationCap, t: "RRHH / L&D", b: "Buscando experiencias y programas diferenciados, de alto impacto." },
                { icon: Users, t: "Equipos directivos", b: "Que necesitan mayor cohesión, conexión y alineación." },
                { icon: Target, t: "Culturas en reset", b: "Que requieren un nuevo significado o un reset cultural." },
                { icon: Sparkles, t: "Cambio o crecimiento", b: "Empresas en procesos de transformación, crecimiento acelerado o un inicio poderoso." },
              ]
            : [
                { icon: Building, t: "Companies investing in leadership", b: "That understand leader development as strategic priority." },
                { icon: GraduationCap, t: "HR / L&D", b: "Looking for differentiated, high-impact experiences and programs." },
                { icon: Users, t: "Executive teams", b: "That need greater cohesion, connection and alignment." },
                { icon: Target, t: "Cultures in reset", b: "That require new meaning or a cultural reset." },
                { icon: Sparkles, t: "Change or growth", b: "Companies in transformation, accelerated growth or a powerful beginning." },
              ]
          ).map((row, idx) => {
            const Icon = row.icon;
            return (
              <div
                key={row.t}
                className="bg-[var(--color-paper-warm)] p-7 md:p-8 hover:bg-[var(--color-paper)] transition-colors min-h-[240px] flex flex-col"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="h-5 w-5 text-[var(--color-gold-deep)]" strokeWidth={1.5} />
                  <span className="eyebrow text-[var(--color-muted)]">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-lg tracking-tight mb-3">
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
                ? "Lo que las organizaciones producen. Lo que los líderes necesitan."
                : "What organizations produce. What leaders need."}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-3">
            <p className="lead text-pretty">
              {locale === "es"
                ? "La vida organizacional moderna desconecta sistemáticamente a los líderes de las cualidades que hacen posible el liderazgo."
                : "Modern organizational life systematically disconnects leaders from the qualities that make leadership possible."}
            </p>
          </div>
        </div>

        {/* BURNOUT STATS — verbatim from elements-method-presentation.docx */}
        <div className="mb-12 grid md:grid-cols-[1fr_1fr_2fr] gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          <div className="bg-[var(--color-paper-warm)] p-8 md:p-10 flex flex-col justify-end">
            <div className="font-[family-name:var(--font-display)] text-6xl md:text-7xl text-[var(--color-fire-ink)] tabular-nums leading-none">
              76%
            </div>
            <p className="mt-4 text-sm text-[var(--color-ink-soft)] leading-relaxed">
              {locale === "es"
                ? "de los líderes reportan sentirse quemados o emocionalmente agotados."
                : "of leaders report feeling burned out or emotionally depleted."}
            </p>
          </div>
          <div className="bg-[var(--color-paper-warm)] p-8 md:p-10 flex flex-col justify-end">
            <div className="font-[family-name:var(--font-display)] text-6xl md:text-7xl text-[var(--color-fire-ink)] tabular-nums leading-none">
              65%
            </div>
            <p className="mt-4 text-sm text-[var(--color-ink-soft)] leading-relaxed">
              {locale === "es"
                ? "de los empleados dicen que su jefe es la principal fuente de estrés en sus vidas."
                : "of employees say their manager is the primary source of stress in their lives."}
            </p>
          </div>
          <div className="bg-[var(--color-paper)] p-8 md:p-10 flex items-center">
            <p className="font-[family-name:var(--font-display)] text-xl md:text-2xl italic leading-snug text-[var(--color-ink)]">
              {locale === "es"
                ? "Y aún así, las organizaciones siguen invirtiendo en programas de liderazgo que añaden más herramientas a manos ya saturadas."
                : "And yet, organizations continue to invest in leadership programs that add more tools to already-full hands."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          <div className="bg-[var(--color-paper)] p-8 md:p-12">
            <div className="eyebrow text-[var(--color-fire-ink)] mb-8">
              {locale === "es" ? "Lo que producen" : "What they produce"}
            </div>
            <ul className="space-y-5">
              {(locale === "es"
                ? ["Sobrecarga cognitiva", "Toma de decisión reactiva", "Presión crónica de desempeño", "Pérdida de motivación intrínseca", "Desconexión del cuerpo", "Sentido de sí mismo encogido"]
                : ["Cognitive overload", "Reactive decision-making", "Chronic performance pressure", "Loss of intrinsic motivation", "Disconnection from the body", "Shrinking sense of self"]
              ).map((line) => (
                <li key={line} className="flex items-start gap-3 text-[var(--color-ink-soft)]">
                  <span className="h-1 w-3 bg-[var(--color-fire)] mt-3 shrink-0" />
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[var(--color-paper-warm)] p-8 md:p-12">
            <div className="eyebrow text-[var(--color-gold-deep)] mb-8">
              {locale === "es" ? "Lo que necesitan" : "What they need"}
            </div>
            <ul className="space-y-5">
              {(locale === "es"
                ? ["Claridad y quietud interna", "Decisiones ancladas en valores", "Energía y presencia sostenibles", "Sentido auténtico de propósito", "Auto-conciencia encarnada", "Identidad fuerte y estable"]
                : ["Clarity and inner quiet", "Grounded, values-led choices", "Sustainable energy and presence", "Authentic sense of purpose", "Embodied self-awareness", "Strong, stable identity"]
              ).map((line) => (
                <li key={line} className="flex items-start gap-3 text-[var(--color-ink-soft)]">
                  <span className="h-1 w-3 bg-[var(--color-gold)] mt-3 shrink-0" />
                  <span className="leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* TESTIMONIAL — Alexandra Reyes verbatim */}
      {testimonial && (
        <Section spacing="default" tone="warm">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-2 lg:flex lg:justify-end">
              <Quote
                className="h-16 w-16 text-[var(--color-gold-deep)]/30"
                aria-hidden
              />
            </div>
            <div className="lg:col-span-10">
              <blockquote className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,3.5vw,2.75rem)] leading-snug text-balance">
                “{locale === "es" ? testimonial.quoteEs : testimonial.quoteEn}”
              </blockquote>
              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm tracking-wide">
                <span className="text-[var(--color-ink)]">
                  {testimonial.authorName}
                </span>
                <span className="text-[var(--color-muted)]">·</span>
                <span className="text-[var(--color-muted)]">
                  {testimonial.authorRole}
                </span>
                <span className="text-[var(--color-muted)]">·</span>
                <span className="text-[var(--color-muted)]">
                  {testimonial.company}
                </span>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* BENEFITS */}
      <Section spacing="default">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {dict.companies.benefits.map((b, idx) => {
            const Icon = BENEFIT_ICONS[idx] ?? ClipboardList;
            return (
              <div
                key={b.title}
                className="bg-[var(--color-paper)] p-8 md:p-10 hover:bg-[var(--color-paper-warm)] transition-colors"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="h-5 w-5 text-[var(--color-gold-deep)]" strokeWidth={1.5} />
                  <span className="eyebrow text-[var(--color-muted)]">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="display-3 mb-3 text-[1.4rem] leading-tight">
                  {b.title}
                </h3>
                <p className="text-[var(--color-ink-soft)] leading-relaxed text-sm">
                  {b.body}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* FINAL CTA — discovery process */}
      <Section id="contact" spacing="default" tone="ink">
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
            <p className="text-lg text-[var(--color-paper)]/90 leading-relaxed text-pretty mb-8">
              {locale === "es"
                ? "Contáctanos para explorar el diseño correcto para tu organización."
                : "Please contact us to explore the right design for your organization."}
            </p>
            <div className="space-y-3 mb-8">
              <a
                href="mailto:hello@elementsmethod.com"
                className="block text-[var(--color-paper)] hover:text-[var(--color-gold-soft)] transition-colors"
              >
                hello@elementsmethod.com
              </a>
              <a
                href="https://www.elementsmethod.com"
                className="block text-[var(--color-paper)]/90 hover:text-[var(--color-paper)] transition-colors text-sm"
              >
                www.elementsmethod.com
              </a>
            </div>
            <Button
              href="mailto:hello@elementsmethod.com"
              size="lg"
              trailingArrow
              className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)] w-full"
            >
              {locale === "es" ? "Iniciar conversación" : "Begin the conversation"}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
