import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Check,
  Droplets,
  Flame,
  Wind,
  Mountain,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  paths as staticPaths,
  originProgram as staticOriginProgram,
  rootsArc as staticRootsArc,
} from "@/data/content";
import { getPaths } from "@/modules/content/paths";
import { getOriginProgram, getRootsArc } from "@/modules/content/siteSections";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "Programs" : "Programas" };
}

const ELEMENT_ICONS: Record<string, LucideIcon> = {
  agua: Droplets,
  fuego: Flame,
  aire: Wind,
  tierra: Mountain,
  eter: Sparkles,
};

const ELEMENT_COLORS: Record<string, string> = {
  agua: "#2B6B8A",
  fuego: "#C4622D",
  aire: "#7A9BAD",
  tierra: "#3D5A3E",
  eter: "#6B5B95",
};

export default async function PathsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const [dbPaths, dbOriginProgram, dbRootsArc] = await Promise.all([
    getPaths(),
    getOriginProgram(),
    getRootsArc(),
  ]);

  const paths = dbPaths.length > 0 ? dbPaths : staticPaths;
  const originProgram =
    dbOriginProgram.nameEs || dbOriginProgram.nameEn
      ? dbOriginProgram
      : staticOriginProgram;
  const rootsArc = dbRootsArc.length > 0 ? dbRootsArc : staticRootsArc;

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden -mt-20 pt-20 text-[var(--color-paper)]">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/heroes/caminos.jpg"
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
          <div className="eyebrow text-[var(--color-paper)]/95 mb-8 flex items-center gap-3">
            <span aria-hidden className="h-px w-12 bg-[var(--color-paper)]/40" />
            {dict.paths.eyebrow}
          </div>
          <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[15ch]">
            {dict.paths.title}
          </h1>
          <p className="lead mt-8 max-w-2xl text-[var(--color-paper)]/95">
            {dict.paths.lead}
          </p>
        </Container>
      </section>

      {/* PROGRAM DETAILS */}
      <Section spacing="default" contained={false}>
        <div className="border-t border-[var(--color-line)]">
          {paths.map((p, idx) => {
            const name = locale === "es" ? p.nameEs : p.nameEn;
            const tag = locale === "es" ? p.tagEs : p.tagEn;
            const headline = locale === "es" ? p.headlineEs : p.headlineEn;
            const short = locale === "es" ? p.shortEs : p.shortEn;
            const long = locale === "es" ? p.longEs : p.longEn;
            const includes = locale === "es" ? p.includesEs : p.includesEn;
            const modality = locale === "es" ? p.modalityEs : p.modalityEn;
            const duration = locale === "es" ? p.durationEs : p.durationEn;
            const cta = locale === "es" ? p.ctaEs : p.ctaEn;

            return (
              <div
                key={p.slug}
                className="border-b border-[var(--color-line)] group hover:bg-[var(--color-paper-warm)]/40 transition-colors"
              >
                <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20 grid lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-2 flex lg:flex-col items-start gap-4">
                    <span className="font-[family-name:var(--font-display)] text-5xl lg:text-6xl text-[var(--color-ink)]/15 group-hover:text-[var(--color-gold-deep)]/60 transition-colors">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="lg:col-span-6">
                    <div className="eyebrow text-[var(--color-muted)] mb-3">
                      {tag}
                    </div>
                    <h2 className="display-2 mb-3">{name}</h2>
                    <p className="text-[var(--color-ink-soft)] text-lg italic mb-4">
                      {headline}
                    </p>
                    <p className="text-[var(--color-ink-soft)] leading-relaxed max-w-xl mb-6">
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
                        label={locale === "es" ? "Formato" : "Format"}
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
                            <Check className="h-4 w-4 mt-0.5 text-[var(--color-gold-deep)] shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8 pt-6 border-t border-[var(--color-line)]">
                        <div className="text-xs text-[var(--color-muted)] uppercase tracking-wide">
                          {locale === "es" ? "Inversión" : "Investment"}
                        </div>
                        <div className="mt-2 font-[family-name:var(--font-display)] text-xl italic text-[var(--color-muted)]">
                          {locale === "es"
                            ? "A confirmar · contactar"
                            : "TBD · contact us"}
                        </div>
                      </div>

                      <div className="mt-6 space-y-2">
                        <Button
                          href={`/${locale}/${locale === "es" ? "los-caminos" : "paths"}/${p.slug}`}
                          size="sm"
                          variant="primary"
                          trailingArrow
                          className="w-full"
                        >
                          {locale === "es" ? "Ver detalle" : "View details"}
                        </Button>
                        <Button
                          href="mailto:hello@elementsmethod.com"
                          size="sm"
                          variant="secondary"
                          className="w-full"
                        >
                          {cta}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ROOTS ARC — the 5-month journey breakdown */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6">
              {locale === "es" ? "El arco elemental" : "The Elemental Arc"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Cinco elementos. Un núcleo."
                : "Five elements. One core."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-3">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Todos los programas atraviesan los cuatro elementos en orden secuenciado — Tierra por arraigo, Fuego por activación, Agua por claridad, Aire por perspectiva — y siempre cierran con Éter, la integración que devuelve el aprendizaje al núcleo que eres tú. Cada programa recorre este arco en una duración distinta."
                : "Every program traverses the four elements in sequenced order — Earth for grounding, Fire for activation, Water for clarity, Air for perspective — and always closes with Ether, the integration that returns the learning to the core that is you. Each program travels this arc over a different duration."}
            </p>
          </div>
        </div>

        <div className="border border-[var(--color-line)] divide-y divide-[var(--color-line)] bg-[var(--color-paper)]">
          {rootsArc.map((row) => {
            const Icon = ELEMENT_ICONS[row.elementKey];
            const color = ELEMENT_COLORS[row.elementKey];
            return (
              <div
                key={row.month}
                className="grid grid-cols-[60px_60px_140px_1fr] md:grid-cols-[80px_80px_220px_1fr] gap-4 md:gap-6 p-5 md:p-7 items-baseline hover:bg-[var(--color-paper-warm)] transition-colors"
              >
                <span className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-muted)]/60 tabular-nums">
                  {String(row.month).padStart(2, "0")}
                </span>
                <Icon className="h-5 w-5 mt-1" strokeWidth={1.5} style={{ color }} />
                <span className="font-[family-name:var(--font-display)] text-xl tracking-tight">
                  {locale === "es"
                    ? row.elementKey === "eter"
                      ? "Éter · Integración"
                      : row.elementKey === "tierra"
                        ? "Tierra"
                        : row.elementKey === "fuego"
                          ? "Fuego"
                          : row.elementKey === "agua"
                            ? "Agua"
                            : "Aire"
                    : row.elementKey === "eter"
                      ? "Ether · Integration"
                      : row.elementKey === "tierra"
                        ? "Earth"
                        : row.elementKey === "fuego"
                          ? "Fire"
                          : row.elementKey === "agua"
                            ? "Water"
                            : "Air"}
                </span>
                <p className="text-[var(--color-ink-soft)] leading-relaxed">
                  {locale === "es" ? row.titleEs : row.titleEn}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ORIGIN — corporate program */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <Eyebrow inverted className="mb-6">
              {locale === "es" ? "Para organizaciones" : "For organizations"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)] text-balance mb-3">
              {locale === "es" ? originProgram.nameEs : originProgram.nameEn}
            </h2>
            <p className="text-lg text-[var(--color-gold-soft)] italic mb-6">
              {locale === "es" ? originProgram.tagEs : originProgram.tagEn}
            </p>
            <p className="text-lg text-[var(--color-paper)]/90 leading-relaxed text-pretty max-w-2xl">
              {locale === "es" ? originProgram.bodyEs : originProgram.bodyEn}
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="space-y-3">
              <a
                href="mailto:hello@elementsmethod.com"
                className="block text-[var(--color-paper)] hover:text-[var(--color-gold-soft)] transition-colors text-lg"
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
            <div className="mt-8">
              <Button
                href="mailto:hello@elementsmethod.com"
                size="lg"
                trailingArrow
                className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)] w-full"
              >
                {locale === "es" ? originProgram.ctaEs : originProgram.ctaEn}
              </Button>
            </div>
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
