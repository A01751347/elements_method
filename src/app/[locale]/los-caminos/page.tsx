import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Check,
  X,
  ArrowUpRight,
  Pause,
  ShieldCheck,
  Layers3,
  CalendarDays,
  Users,
} from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { paths } from "@/data/content";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { formatPriceMXN, formatPriceUSD } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "The paths" : "Los caminos" };
}

export default async function PathsPage({
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
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=2400&q=85&auto=format&fit=crop"
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
            {dict.paths.eyebrow}
          </div>
          <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[15ch]">
            {dict.paths.title}
          </h1>
          <p className="lead mt-8 max-w-2xl text-[var(--color-paper)]/85">
            {dict.paths.lead}
          </p>
        </Container>
      </section>

      {/* PATH DETAILS */}
      <Section spacing="default" contained={false}>
        <div className="border-t border-[var(--color-line)]">
          {paths.map((p, idx) => {
            const name = locale === "es" ? p.nameEs : p.nameEn;
            const short = locale === "es" ? p.shortEs : p.shortEn;
            const long = locale === "es" ? p.longEs : p.longEn;
            const includes = locale === "es" ? p.includesEs : p.includesEn;
            const modality = locale === "es" ? p.modalityEs : p.modalityEn;
            const duration = locale === "es" ? p.durationEs : p.durationEn;

            return (
              <div
                key={p.slug}
                className="border-b border-[var(--color-line)] group hover:bg-[var(--color-paper-warm)]/40 transition-colors"
              >
                <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20 grid lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-2 flex lg:flex-col items-start gap-4">
                    <span className="font-[family-name:var(--font-display)] text-5xl lg:text-6xl text-[var(--color-ink)]/15 group-hover:text-[var(--color-moss-500)]/60 transition-colors">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="lg:col-span-6">
                    <h2 className="display-2 mb-3">{name}</h2>
                    <p className="text-[var(--color-ink-soft)] text-lg italic mb-6">
                      {short}
                    </p>
                    <p className="text-[var(--color-ink-soft)] leading-relaxed max-w-xl">
                      {long}
                    </p>

                    <div className="mt-10 flex flex-wrap gap-6 text-sm">
                      <Meta
                        label={locale === "es" ? "Duración" : "Duration"}
                        value={duration}
                      />
                      <Meta
                        label={locale === "es" ? "Modalidad" : "Format"}
                        value={modality}
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="bg-[var(--color-paper)] border border-[var(--color-line)] p-8">
                      <div className="eyebrow text-[var(--color-muted)] mb-5">
                        {locale === "es" ? "Incluye" : "Includes"}
                      </div>
                      <ul className="space-y-3">
                        {includes.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-sm text-[var(--color-ink-soft)]"
                          >
                            <Check className="h-4 w-4 mt-0.5 text-[var(--color-moss-500)] shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8 pt-6 border-t border-[var(--color-line)]">
                        <div className="text-xs text-[var(--color-muted)] uppercase tracking-wide">
                          {locale === "es" ? "Inversión" : "Investment"}
                        </div>
                        <div className="mt-2 flex items-end gap-3 flex-wrap">
                          <span className="font-[family-name:var(--font-display)] text-3xl">
                            {formatPriceMXN(p.priceMxn)}
                          </span>
                          <span className="text-sm text-[var(--color-muted)]">
                            / {formatPriceUSD(p.priceUsd)}
                          </span>
                        </div>
                        <p className="mt-1 text-[0.7rem] uppercase tracking-wide text-[var(--color-muted)]">
                          {dict.common.noVat}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        <Button
                          href={`/${locale}/${locale === "es" ? "los-caminos" : "paths"}/${p.slug}`}
                          size="sm"
                          variant="primary"
                          trailingArrow
                        >
                          {dict.common.book}
                        </Button>
                        <Link
                          href="#"
                          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ink)] border-b border-[var(--color-ink)]/30 hover:border-[var(--color-ink)] pb-0.5"
                        >
                          {locale === "es" ? "Conversar" : "Talk to us"}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* DECISION MATRIX */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Layers3 className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Decisión" : "Decision"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "¿Cuál camino te corresponde?"
                : "Which path is yours?"}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-3">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Comparativa honesta. Sin upsell — la decisión correcta nos importa más que la decisión más cara."
                : "Honest comparison. No upsell — the right decision matters more to us than the most expensive one."}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto -mx-5 sm:-mx-8 px-5 sm:px-8">
          <table className="w-full border border-[var(--color-line)] bg-[var(--color-paper)] text-sm min-w-[760px]">
            <thead>
              <tr className="border-b border-[var(--color-line)] bg-[var(--color-paper-warm)]">
                <th className="text-left p-5 font-normal text-[var(--color-muted)] eyebrow w-1/4">
                  {locale === "es" ? "Criterio" : "Criterion"}
                </th>
                {paths.map((p) => (
                  <th
                    key={p.slug}
                    className="text-left p-5 font-[family-name:var(--font-display)] text-xl tracking-tight"
                  >
                    {locale === "es" ? p.nameEs : p.nameEn}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(locale === "es"
                ? [
                    {
                      k: "Intensidad",
                      v: ["Moderada · sostenible", "Alta · acelerada", "Total · individual"],
                    },
                    {
                      k: "Horas / semana",
                      v: ["3-5 h", "5-7 h", "6-8 h"],
                    },
                    {
                      k: "Modalidad principal",
                      v: ["Grupal", "Grupal pequeño", "1:1"],
                    },
                    {
                      k: "Personalización",
                      v: ["Media", "Media", "Total"],
                    },
                    {
                      k: "Ideal para",
                      v: [
                        "Quien quiere transformación profunda con calendario realista",
                        "Quien tiene tres meses de ventana y quiere todo el método",
                        "Líder con agenda ejecutiva y exigencia de confidencialidad",
                      ],
                    },
                    {
                      k: "Comunidad de egresados",
                      v: [true, true, "Prioritaria"],
                    },
                  ]
                : [
                    {
                      k: "Intensity",
                      v: ["Moderate · sustainable", "High · accelerated", "Total · individual"],
                    },
                    {
                      k: "Hours / week",
                      v: ["3-5 h", "5-7 h", "6-8 h"],
                    },
                    {
                      k: "Main format",
                      v: ["Group", "Small group", "1:1"],
                    },
                    {
                      k: "Customization",
                      v: ["Medium", "Medium", "Total"],
                    },
                    {
                      k: "Ideal for",
                      v: [
                        "Those wanting deep change with realistic calendar",
                        "Those with a 3-month window who want the whole method",
                        "Leaders with executive agenda and confidentiality needs",
                      ],
                    },
                    {
                      k: "Alumni community",
                      v: [true, true, "Priority"],
                    },
                  ]
              ).map((row) => (
                <tr key={row.k} className="border-b border-[var(--color-line)] last:border-0">
                  <td className="p-5 align-top text-[var(--color-muted)]">{row.k}</td>
                  {row.v.map((cell, i) => (
                    <td
                      key={i}
                      className="p-5 align-top text-[var(--color-ink-soft)]"
                    >
                      {cell === true ? (
                        <Check className="h-4 w-4 text-[var(--color-moss-500)]" />
                      ) : cell === false ? (
                        <X className="h-4 w-4 text-[var(--color-fire)]" />
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* TYPICAL WEEK */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Una semana en Raíces" : "A week in Roots"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Así se ve un mes del método en tu calendario."
                : "Here's what a method-month looks like on your calendar."}
            </h2>
            <p className="mt-6 lead text-pretty">
              {locale === "es"
                ? "Tres a cinco horas semanales en sesiones programadas, más prácticas autoguiadas. Encajable en cualquier agenda exigente — pero sin huecos."
                : "Three to five weekly hours of scheduled sessions, plus self-guided practices. Fits any demanding agenda — without holes."}
            </p>
            <div className="mt-8">
              <Button
                href={`/${locale}/${locale === "es" ? "empresas/cotizar" : "companies/quote"}`}
                variant="secondary"
                trailingArrow
              >
                {locale === "es" ? "Agendar 30 min" : "Schedule 30 min"}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ol className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
              {(locale === "es"
                ? [
                    { day: "Lun", time: "07:00 · 30 min", what: "Práctica autoguiada · breathwork" },
                    { day: "Mar", time: "19:00 · 60 min", what: "Coaching individual · 1:1" },
                    { day: "Mié", time: "—", what: "Reposo · lectura asignada" },
                    { day: "Jue", time: "20:00 · 90 min", what: "Sesión grupal virtual · elemento del mes" },
                    { day: "Vie", time: "07:00 · 30 min", what: "Práctica autoguiada · contacto con tierra" },
                    { day: "Sáb", time: "—", what: "Día libre" },
                    { day: "Dom", time: "—", what: "Día libre · journal opcional" },
                  ]
                : [
                    { day: "Mon", time: "07:00 · 30 min", what: "Self-guided practice · breathwork" },
                    { day: "Tue", time: "19:00 · 60 min", what: "Individual coaching · 1:1" },
                    { day: "Wed", time: "—", what: "Rest · assigned reading" },
                    { day: "Thu", time: "20:00 · 90 min", what: "Virtual group session · month's element" },
                    { day: "Fri", time: "07:00 · 30 min", what: "Self-guided practice · earthing" },
                    { day: "Sat", time: "—", what: "Free day" },
                    { day: "Sun", time: "—", what: "Free day · optional journal" },
                  ]
              ).map((row) => (
                <li
                  key={row.day}
                  className="py-5 grid grid-cols-[60px_140px_1fr] gap-4 items-center"
                >
                  <span className="font-[family-name:var(--font-display)] text-xl text-[var(--color-moss-700)]">
                    {row.day}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-[var(--color-muted)] tabular-nums">
                    {row.time}
                  </span>
                  <span className="text-[var(--color-ink-soft)]">{row.what}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-xs text-[var(--color-muted)]">
              {locale === "es"
                ? "Una vez al mes: inmersión presencial de 3-4 días (incluida)."
                : "Once a month: 3-4 day in-person immersion (included)."}
            </p>
          </div>
        </div>
      </Section>

      {/* COMMITMENT POLICIES */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-6">
            <Eyebrow inverted className="mb-6 flex items-center gap-3">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Compromiso" : "Commitment"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)] text-balance">
              {locale === "es"
                ? "Garantías y políticas claras."
                : "Clear guarantees and policies."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-4">
            <p className="text-lg text-[var(--color-paper)]/75 leading-relaxed text-pretty">
              {locale === "es"
                ? "Operamos como negocio serio. Sin letras chiquitas. Lo que firmas es lo que recibes."
                : "We operate as a serious business. No fine print. What you sign is what you get."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[var(--color-paper)]/15">
          {[
            {
              icon: Pause,
              t: locale === "es" ? "Política de pausa" : "Pause policy",
              b:
                locale === "es"
                  ? "Hasta 60 días de pausa sin penalización por situación de fuerza mayor. Retomas con tu mismo coach."
                  : "Up to 60 days of penalty-free pause for force majeure. You resume with the same coach.",
            },
            {
              icon: ShieldCheck,
              t: locale === "es" ? "Garantía de calce" : "Fit guarantee",
              b:
                locale === "es"
                  ? "Si tras las primeras dos sesiones el camino no es para ti, devolvemos el 80% sin preguntas."
                  : "If after the first two sessions the path isn't for you, we refund 80% without questions.",
            },
            {
              icon: Users,
              t: locale === "es" ? "Cohortes pequeñas" : "Small cohorts",
              b:
                locale === "es"
                  ? "Máximo 12 personas por cohorte. La intimidad del grupo es parte del método."
                  : "Maximum 12 people per cohort. Group intimacy is part of the method.",
            },
          ].map((row) => {
            const Icon = row.icon;
            return (
              <div
                key={row.t}
                className="bg-[var(--color-ink)] p-8 md:p-10 min-h-[260px] flex flex-col"
              >
                <Icon
                  className="h-5 w-5 text-[var(--color-paper)]/70 mb-6"
                  strokeWidth={1.5}
                />
                <h3 className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--color-paper)] mb-3">
                  {row.t}
                </h3>
                <p className="text-sm text-[var(--color-paper)]/70 leading-relaxed flex-1">
                  {row.b}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ELEMENTS LOOSE */}
      <Section spacing="default" tone="warm">
        <div className="max-w-3xl">
          <Eyebrow className="mb-4">
            {locale === "es" ? "Elementos sueltos" : "Individual elements"}
          </Eyebrow>
          <h2 className="display-2 text-balance">
            {locale === "es"
              ? "¿No estás para un programa largo?"
              : "Not ready for a long program?"}
          </h2>
          <p className="lead mt-6 text-pretty">
            {locale === "es"
              ? "Puedes contratar cualquier elemento por separado: agua, fuego, aire o tierra. Sin compromiso anual, sin orden obligatorio. Útil cuando ya conoces el método y sabes qué necesitas trabajar."
              : "You can contract any element individually: water, fire, air or earth. No annual commitment, no mandatory order. Useful when you already know the method and know what to work on."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              href={`/${locale}/${locale === "es" ? "el-metodo" : "method"}`}
              variant="secondary"
              trailingArrow
            >
              {locale === "es" ? "Ver los elementos" : "See the elements"}
            </Button>
            <Button
              href={`/${locale}/${locale === "es" ? "retiros" : "retreats"}`}
              variant="ghost"
              trailingArrow
            >
              {locale === "es" ? "Ver retiros" : "See retreats"}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-[var(--color-muted)] uppercase tracking-wide">
        {label}
      </div>
      <div className="mt-1 text-[var(--color-ink)]">{value}</div>
    </div>
  );
}
