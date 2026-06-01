import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ClipboardList,
  Layers,
  Target,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  Building2,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/Container";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { LogosMarquee } from "@/components/sections/LogosMarquee";
import { formatPriceMXN } from "@/lib/utils";

const BENEFIT_ICONS = [ClipboardList, Layers, Target, ShieldCheck];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "Companies" : "Empresas" };
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
            src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=2400&q=85&auto=format&fit=crop"
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
              <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[18ch]">
                {dict.companies.title}
              </h1>
            </div>
            <div className="lg:col-span-4">
              <p className="lead text-[var(--color-paper)]/85">{dict.companies.lead}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  href={`/${locale}/${locale === "es" ? "empresas/cotizar" : "companies/quote"}`}
                  size="lg"
                  trailingArrow
                  className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)]"
                >
                  {dict.companies.cta}
                </Button>
                <Button href="#contact" size="lg" variant="outlineLight">
                  {locale === "es" ? "Hablar con nosotros" : "Talk to us"}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* BENEFITS */}
      <Section spacing="default" contained={false} tone="warm">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-line)]">
            {dict.companies.benefits.map((b, idx) => {
              const Icon = BENEFIT_ICONS[idx] ?? ClipboardList;
              return (
                <div
                  key={b.title}
                  className="bg-[var(--color-paper-warm)] p-8 md:p-10 hover:bg-[var(--color-paper)] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Icon className="h-5 w-5 text-[var(--color-moss-700)]" strokeWidth={1.5} />
                    <span className="eyebrow text-[var(--color-muted)]">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="display-3 mb-3 text-[1.5rem]">{b.title}</h3>
                  <p className="text-[var(--color-ink-soft)] leading-relaxed text-sm">
                    {b.body}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* PROGRAM FORMATS */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Briefcase className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Formatos" : "Formats"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Tres formatos, una misma raíz."
                : "Three formats, one same root."}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Construimos según el momento de la empresa. No vendemos un solo paquete: vendemos el formato que su equipo realmente necesita."
                : "We build for the company's moment. We don't sell one package: we sell the format your team really needs."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {(locale === "es"
            ? [
                {
                  icon: GraduationCap,
                  n: "01",
                  t: "Intensivo · 1 día",
                  who: "Para offsites o kickoffs",
                  inc: "Sesión de los cuatro elementos comprimida. Diagnóstico grupal + práctica somática + framework de decisión.",
                  range: "Desde $42,000 MXN",
                },
                {
                  icon: Building2,
                  n: "02",
                  t: "Trimestral · 12 semanas",
                  who: "Para equipos directivos pequeños (6-12 personas)",
                  inc: "Una sesión semanal grupal + dos coaching individuales por persona + una inmersión presencial.",
                  range: "Desde $280,000 MXN",
                },
                {
                  icon: TrendingUp,
                  n: "03",
                  t: "Anual · 4 ciclos",
                  who: "Para transformación cultural de mando medio en adelante",
                  inc: "Un elemento por trimestre. Inmersiones, sesiones grupales, coaching individual continuo, métricas de impacto.",
                  range: "Desde $850,000 MXN",
                },
              ]
            : [
                {
                  icon: GraduationCap,
                  n: "01",
                  t: "Intensive · 1 day",
                  who: "For offsites or kickoffs",
                  inc: "Compressed four-elements session. Group diagnosis + somatic practice + decision framework.",
                  range: "From $42,000 MXN",
                },
                {
                  icon: Building2,
                  n: "02",
                  t: "Quarterly · 12 weeks",
                  who: "For small executive teams (6-12 people)",
                  inc: "One weekly group session + two individual coachings per person + one in-person immersion.",
                  range: "From $280,000 MXN",
                },
                {
                  icon: TrendingUp,
                  n: "03",
                  t: "Annual · 4 cycles",
                  who: "For cultural transformation from middle management up",
                  inc: "One element per quarter. Immersions, group sessions, continuous individual coaching, impact metrics.",
                  range: "From $850,000 MXN",
                },
              ]
          ).map((row) => {
            const Icon = row.icon;
            return (
              <article
                key={row.n}
                className="bg-[var(--color-paper)] p-8 md:p-10 min-h-[420px] flex flex-col hover:bg-[var(--color-paper-warm)] transition-colors duration-500"
              >
                <div className="flex items-start justify-between mb-8">
                  <span className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)]/15">
                    {row.n}
                  </span>
                  <Icon className="h-5 w-5 text-[var(--color-moss-700)]" strokeWidth={1.5} />
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-tight mb-2">
                  {row.t}
                </h3>
                <p className="text-xs uppercase tracking-wide text-[var(--color-muted)] mb-6">
                  {row.who}
                </p>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed flex-1">
                  {row.inc}
                </p>
                <div className="mt-8 pt-5 border-t border-[var(--color-line)]">
                  <div className="text-[0.65rem] uppercase tracking-wide text-[var(--color-muted)] mb-1">
                    {locale === "es" ? "Inversión" : "Investment"}
                  </div>
                  <div className="font-[family-name:var(--font-display)] text-xl">
                    {row.range}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* PROCESS */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Eyebrow inverted className="mb-6">
              {locale === "es" ? "Cómo trabajamos" : "How we work"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)]">
              {locale === "es"
                ? "Tres conversaciones antes de empezar."
                : "Three conversations before starting."}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-3">
            <ol className="divide-y divide-[var(--color-paper)]/15">
              {(locale === "es"
                ? [
                    {
                      step: "01",
                      title: "Sesión de diagnóstico",
                      body:
                        "Hablamos con dirección y con un muestreo del equipo. Identificamos qué elementos están faltando o sobrando.",
                    },
                    {
                      step: "02",
                      title: "Propuesta a la medida",
                      body:
                        "Diseñamos un programa con duración, intensidad y modalidad ajustada. Cotización con fórmula visible.",
                    },
                    {
                      step: "03",
                      title: "Inicio y seguimiento",
                      body:
                        "Documentos formales, contrato y comprobante. Calendario, métricas y revisiones programadas.",
                    },
                  ]
                : [
                    {
                      step: "01",
                      title: "Diagnostic session",
                      body:
                        "We talk with leadership and a sample of the team. We identify which elements are missing or excessive.",
                    },
                    {
                      step: "02",
                      title: "Tailored proposal",
                      body:
                        "We design a program with adjusted duration, intensity and format. Quote with visible formula.",
                    },
                    {
                      step: "03",
                      title: "Start and follow-up",
                      body:
                        "Formal documents, contract and invoice. Calendar, metrics and scheduled reviews.",
                    },
                  ]
              ).map((s) => (
                <li
                  key={s.step}
                  className="py-8 grid grid-cols-[80px_1fr] gap-6 items-start"
                >
                  <span className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-paper)]/40">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="text-xl font-[family-name:var(--font-display)] text-[var(--color-paper)] mb-2">
                      {s.title}
                    </h3>
                    <p className="text-[var(--color-paper)]/70 max-w-xl leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* CASE STUDIES */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Casos" : "Cases"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Tres equipos. Tres antes y después."
                : "Three teams. Three before and after."}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Con datos compartidos por cada cliente. Lo que no se mide, no se sostiene."
                : "With data shared by each client. What isn't measured isn't sustained."}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {(locale === "es"
            ? [
                {
                  company: "Femsa · Dirección Comercial",
                  industry: "Bebidas",
                  size: "12 directores",
                  format: "Trimestral · 12 semanas",
                  before: "Equipo en reactividad permanente. Decisiones lentas por consultas cruzadas.",
                  after: "Reducción del 38% en tiempo a decisión. Nuevo ritual semanal de cierre que mantuvieron.",
                  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop",
                },
                {
                  company: "Cemex · Innovación",
                  industry: "Construcción",
                  size: "8 líderes",
                  format: "Anual · 4 ciclos",
                  before: "Innovación atrapada en presentaciones. Cero implementación.",
                  after: "Tres pilotos lanzados, uno en producción. Equipo reporta 'sostenibilidad emocional' alta.",
                  image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80&auto=format&fit=crop",
                },
                {
                  company: "Banorte · Talent",
                  industry: "Servicios financieros",
                  size: "20 mandos medios",
                  format: "Intensivo · 2 días",
                  before: "Burnout alto, retención baja en mandos medios.",
                  after: "NPS interno +24 puntos a tres meses. Reducción de salidas no deseadas del 22% al 9%.",
                  image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80&auto=format&fit=crop",
                },
              ]
            : [
                {
                  company: "Femsa · Commercial Direction",
                  industry: "Beverages",
                  size: "12 directors",
                  format: "Quarterly · 12 weeks",
                  before: "Team in permanent reactivity. Slow decisions due to crossed consultations.",
                  after: "38% reduction in time-to-decision. New weekly closing ritual they kept.",
                  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop",
                },
                {
                  company: "Cemex · Innovation",
                  industry: "Construction",
                  size: "8 leaders",
                  format: "Annual · 4 cycles",
                  before: "Innovation stuck in slide decks. Zero implementation.",
                  after: "Three pilots launched, one in production. Team reports high 'emotional sustainability'.",
                  image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80&auto=format&fit=crop",
                },
                {
                  company: "Banorte · Talent",
                  industry: "Financial services",
                  size: "20 mid-managers",
                  format: "Intensive · 2 days",
                  before: "High burnout, low retention in middle management.",
                  after: "Internal NPS +24 points at 3 months. Unwanted exits down from 22% to 9%.",
                  image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80&auto=format&fit=crop",
                },
              ]
          ).map((c, idx) => (
            <article
              key={c.company}
              className="grid lg:grid-cols-12 gap-0 border border-[var(--color-line)] overflow-hidden bg-[var(--color-paper)] hover:bg-[var(--color-paper-warm)] transition-colors duration-500 group"
            >
              <div className="lg:col-span-4 relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.company}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/40 to-transparent" />
                <div className="absolute top-5 left-5 inline-flex items-center gap-2 bg-[var(--color-paper)]/95 backdrop-blur-sm px-3 py-1.5 text-[0.7rem] tracking-[0.18em] uppercase">
                  Caso 0{idx + 1}
                </div>
              </div>

              <div className="lg:col-span-8 p-8 md:p-10 grid sm:grid-cols-2 gap-x-10 gap-y-6">
                <div className="sm:col-span-2">
                  <h3 className="font-[family-name:var(--font-display)] text-3xl tracking-tight mb-2">
                    {c.company}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-xs uppercase tracking-wide text-[var(--color-muted)]">
                    <span>{c.industry}</span>
                    <span>·</span>
                    <span>{c.size}</span>
                    <span>·</span>
                    <span>{c.format}</span>
                  </div>
                </div>

                <div>
                  <div className="eyebrow text-[var(--color-fire)] mb-3">
                    {locale === "es" ? "Antes" : "Before"}
                  </div>
                  <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                    {c.before}
                  </p>
                </div>
                <div>
                  <div className="eyebrow text-[var(--color-moss-700)] mb-3">
                    {locale === "es" ? "Después" : "After"}
                  </div>
                  <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                    {c.after}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <LogosMarquee locale={locale} dict={dict} />

      {/* FINAL CTA */}
      <Section id="contact" spacing="default" tone="warm">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6">
              {locale === "es" ? "Siguiente paso" : "Next step"}
            </Eyebrow>
            <h2 className="display-2 max-w-2xl text-balance">
              {locale === "es"
                ? "Construye una cotización transparente en minutos."
                : "Build a transparent quote in minutes."}
            </h2>
            <p className="lead mt-6 max-w-xl text-pretty">
              {locale === "es"
                ? "Sin compromiso. La calculadora muestra el desglose completo en tiempo real, en MXN y USD, con IVA explícito."
                : "No commitment. The calculator shows the full breakdown in real time, in MXN and USD, with explicit VAT."}
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-[var(--color-paper)] border border-[var(--color-line)] p-8">
              <ul className="space-y-3 mb-8 text-sm text-[var(--color-ink-soft)]">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1 w-3 bg-[var(--color-moss-500)]" />
                  {locale === "es"
                    ? "Cotización con desglose en PDF"
                    : "Itemized PDF quote"}
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1 w-3 bg-[var(--color-moss-500)]" />
                  {locale === "es"
                    ? "Contrato y NDA listos"
                    : "Ready-to-sign contract and NDA"}
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1 w-3 bg-[var(--color-moss-500)]" />
                  {locale === "es"
                    ? "Pago por Stripe o transferencia"
                    : "Payment via Stripe or wire transfer"}
                </li>
              </ul>
              <Button
                href={`/${locale}/${locale === "es" ? "empresas/cotizar" : "companies/quote"}`}
                size="lg"
                trailingArrow
                className="w-full"
              >
                {dict.companies.cta}
              </Button>
              <p className="mt-4 text-xs text-[var(--color-muted)] text-center">
                {locale === "es"
                  ? "Vigencia de cotización: 30 días."
                  : "Quote validity: 30 days."}
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
