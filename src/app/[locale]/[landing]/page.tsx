import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { pageMetadata, localePath, ROUTES, retreatRoute, type RoutePair } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceJsonLd, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/structuredData";
import { Container } from "@/components/ui/Container";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { FAQ } from "@/components/sections/FAQ";
import { experiences } from "@/data/experiences";
import { t, type L } from "@/data/arco";
import {
  SEO_LANDINGS,
  findLandingBySlug,
  findLandingByKey,
  type SeoLanding,
} from "@/data/seoLandings";

/**
 * Landings por intención de búsqueda ("retiros corporativos en México",
 * "executive retreats"…). Contenido en src/data/seoLandings.ts; esta ruta solo
 * lo renderiza y emite Service + FAQPage + BreadcrumbList para buscadores y
 * motores de respuesta de IA. Todo estático: no lee la base de datos.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    SEO_LANDINGS.map((l) => ({ locale, landing: l.route[locale] })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; landing: string }>;
}) {
  const { locale, landing } = await params;
  if (!isLocale(locale)) return {};
  const page = findLandingBySlug(locale, landing);
  if (!page) return {};
  return pageMetadata({
    locale,
    route: page.route,
    title: t(page.title, locale),
    description: t(page.metaDescription, locale),
    image: page.image,
    imageAlt: t(page.h1, locale),
  });
}

function hrefFor(locale: Locale, link: { key?: SeoLanding["key"]; route?: RoutePair }): string {
  if (link.key) return localePath(locale, findLandingByKey(link.key).route);
  if (link.route) return localePath(locale, link.route);
  return `/${locale}`;
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string; landing: string }>;
}) {
  const { locale, landing } = await params;
  if (!isLocale(locale)) notFound();
  const page = findLandingBySlug(locale, landing);
  if (!page) notFound();

  const es = locale === "es";
  const tt = (l: L) => t(l, locale);
  const url = localePath(locale, page.route);
  const quoteHref = localePath(locale, ROUTES.quote);
  const scheduleHref = localePath(locale, ROUTES.schedule);
  const related = page.related.map(findLandingByKey);
  const upcoming = [...experiences].sort((a, b) => a.startDateIso.localeCompare(b.startDateIso));

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            locale,
            name: tt(page.title),
            serviceType: tt(page.serviceType),
            description: tt(page.definition),
            url,
            image: page.image,
          }),
          faqPageJsonLd(page.faqs.map((f) => ({ q: tt(f.q), a: tt(f.a) }))),
          breadcrumbJsonLd([
            { name: es ? "Inicio" : "Home", path: localePath(locale, ROUTES.home) },
            { name: es ? "Organizaciones" : "Organizations", path: localePath(locale, ROUTES.companies) },
            { name: tt(page.h1), path: url },
          ]),
        ]}
      />

      {/* HERO */}
      <Section spacing="default">
        <Container>
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <Eyebrow className="mb-6">{tt(page.eyebrow)}</Eyebrow>
              <h1 className="display-1 text-balance mb-6">{tt(page.h1)}</h1>
              <p className="lead text-pretty">{tt(page.lead)}</p>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-paper-warm)]">
                <Image
                  src={page.image}
                  alt={tt(page.h1)}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Definición extraíble: la frase que un buscador o un modelo puede citar. */}
          <p className="mt-14 md:mt-20 max-w-4xl border-l-2 border-[var(--color-gold)] pl-6 md:pl-8 text-xl md:text-2xl leading-relaxed text-[var(--color-ink)] text-pretty">
            {tt(page.definition)}
          </p>
        </Container>
      </Section>

      {/* CUERPO */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <Container className="max-w-4xl">
          <div className="space-y-16">
            {page.sections.map((s) => (
              <section key={s.h2.es}>
                <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-tight text-balance mb-6">
                  {tt(s.h2)}
                </h2>
                {s.paragraphs?.map((p) => (
                  <p key={p.es} className="text-lg leading-relaxed text-[var(--color-ink-soft)] text-pretty mb-5">
                    {tt(p)}
                  </p>
                ))}
                {s.bullets && (
                  <ul className="space-y-3 mt-2">
                    {s.bullets.map((b) => (
                      <li key={b.es} className="flex gap-4 text-lg leading-relaxed text-[var(--color-ink-soft)]">
                        <span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold)]" />
                        <span>{tt(b)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.links && (
                  <ul className="mt-6 space-y-2">
                    {s.links.map((l) => (
                      <li key={l.label.es}>
                        <Link
                          href={hrefFor(locale, l)}
                          className="inline-flex items-center gap-2 text-[var(--color-ink)] underline underline-offset-[6px] decoration-[var(--color-gold)] hover:decoration-[var(--color-ink)] transition-colors"
                        >
                          {tt(l.label)}
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </Container>
      </Section>

      {/* OTROS FORMATOS */}
      <Section spacing="default">
        <Container>
          <Eyebrow className="mb-6">{es ? "Otros formatos" : "Other formats"}</Eyebrow>
          <h2 className="display-2 text-balance mb-10 max-w-3xl">
            {es ? "Elige el retiro por el objetivo, no por el nombre." : "Choose the retreat by objective, not by name."}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link
                key={r.key}
                href={localePath(locale, r.route)}
                className="group border border-[var(--color-line)] p-6 hover:border-[var(--color-ink)] transition-colors flex flex-col gap-3"
              >
                <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)]">{tt(r.eyebrow)}</span>
                <span className="font-[family-name:var(--font-display)] text-2xl tracking-tight leading-tight">{tt(r.title)}</span>
                <span className="text-sm text-[var(--color-ink-soft)] leading-relaxed">{tt(r.metaDescription)}</span>
                <span className="mt-auto inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.16em] pt-2">
                  {es ? "Ver" : "View"} <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* EXECUTIVE EXPERIENCES ABIERTAS */}
      <Section spacing="default" tone="warm">
        <Container>
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <Eyebrow className="mb-6">{es ? "Fechas abiertas 2026" : "Open dates 2026"}</Eyebrow>
              <h2 className="display-2 text-balance">
                {es
                  ? "¿Quieres vivir el método antes de llevarlo a tu equipo?"
                  : "Want to experience the method before bringing it to your team?"}
              </h2>
              <p className="mt-6 text-lg text-[var(--color-ink-soft)] leading-relaxed">
                {es
                  ? "Las Executive Experiences son retiros abiertos en grupo reducido. Muchos líderes asisten primero de forma individual y después diseñan un programa para su organización."
                  : "Executive Experiences are open-enrollment, small-group retreats. Many leaders attend individually first and then design a program for their organization."}
              </p>
            </div>
            <ul className="lg:col-span-7 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
              {upcoming.map((e) => (
                <li key={e.slug}>
                  <Link
                    href={localePath(locale, retreatRoute(e.slug))}
                    className="group flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8 py-5 hover:bg-[var(--color-paper)]/60 transition-colors"
                  >
                    <span className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-muted)] sm:w-56 shrink-0">{tt(e.dateLabel)}</span>
                    <span className="font-[family-name:var(--font-display)] text-2xl tracking-tight">{e.title}</span>
                    <span className="text-sm text-[var(--color-ink-soft)] sm:ml-auto">{tt(e.location)} · {tt(e.duration)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* FAQ (mismo componente del home) */}
      <FAQ
        locale={locale}
        faqs={page.faqs.map((f) => ({ qEs: f.q.es, qEn: f.q.en, aEs: f.a.es, aEn: f.a.en }))}
      />

      {/* CTA */}
      <Section spacing="default" tone="ink">
        <Container>
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8">
              <Eyebrow inverted className="mb-6">{es ? "Siguiente paso" : "Next step"}</Eyebrow>
              <h2 className="display-2 text-[var(--color-paper)] text-balance">
                {es
                  ? "Diseñemos el retiro que tu equipo necesita, no el que está de moda."
                  : "Let's design the retreat your team needs, not the one that's trending."}
              </h2>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              <Button href={quoteHref} variant="solidLight" size="lg" trailingArrow className="w-full">
                {es ? "Cotizar en línea" : "Get an online quote"}
              </Button>
              <Button href={scheduleHref} variant="outlineLight" size="lg" className="w-full">
                {es ? "Agendar una llamada" : "Schedule a call"}
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
