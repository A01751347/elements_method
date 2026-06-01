import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/Container";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { LogosMarquee } from "@/components/sections/LogosMarquee";
import {
  ArrowUpRight,
  ClipboardList,
  Layers,
  Target,
  ShieldCheck,
} from "lucide-react";

const ICONS = [ClipboardList, Layers, Target, ShieldCheck];

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
      <Section spacing="loose">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6">{dict.companies.eyebrow}</Eyebrow>
            <h1 className="display-1">{dict.companies.title}</h1>
          </div>
          <div className="lg:col-span-5">
            <p className="lead">{dict.companies.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href={`/${locale}/${locale === "es" ? "empresas/cotizar" : "companies/quote"}`}
                size="lg"
                trailingArrow
              >
                {dict.companies.cta}
              </Button>
              <Button href="#contact" size="lg" variant="secondary">
                {locale === "es" ? "Hablar con nosotros" : "Talk to us"}
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section spacing="default" contained={false} tone="warm">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-line)]">
            {dict.companies.benefits.map((b, idx) => {
              const Icon = ICONS[idx] ?? ClipboardList;
              return (
                <div
                  key={b.title}
                  className="bg-[var(--color-paper-warm)] p-8 md:p-10 hover:bg-[var(--color-paper)] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Icon className="h-5 w-5 text-[var(--color-moss-700)]" />
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

      <LogosMarquee locale={locale} dict={dict} />

      <Section id="contact" spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6">
              {locale === "es" ? "Siguiente paso" : "Next step"}
            </Eyebrow>
            <h2 className="display-2 max-w-2xl">
              {locale === "es"
                ? "Construye una cotización transparente en minutos."
                : "Build a transparent quote in minutes."}
            </h2>
            <p className="lead mt-6 max-w-xl">
              {locale === "es"
                ? "Sin compromiso. La calculadora muestra el desglose completo en tiempo real, en MXN y USD, con IVA explícito."
                : "No commitment. The calculator shows the full breakdown in real time, in MXN and USD, with explicit VAT."}
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-[var(--color-paper-warm)] border border-[var(--color-line)] p-8">
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
