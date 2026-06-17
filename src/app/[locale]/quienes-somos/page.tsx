import Image from "next/image";
import { notFound } from "next/navigation";
import { Instagram, Linkedin } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { founder, differentiatorsEs, differentiatorsEn } from "@/data/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "Who we are" : "Quiénes somos" };
}

export default async function AboutPage({
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
            src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=2400&q=85&auto=format&fit=crop"
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
            {dict.about.eyebrow}
          </div>
          <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[16ch]">
            {dict.about.title}
          </h1>
          <p className="lead mt-8 max-w-2xl text-[var(--color-paper)]/85">
            {dict.about.lead}
          </p>
        </Container>
      </section>

      {/* FOUNDER */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <FounderPortrait />
          </div>

          <div className="lg:col-span-7">
            <div className="eyebrow text-[var(--color-muted)] mb-4">
              {locale === "es" ? founder.roleEs : founder.roleEn}
            </div>
            <h2 className="display-2 mb-8 text-balance">
              {locale === "es" ? founder.nameEs : founder.nameEn}
            </h2>
            <p className="text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-2xl mb-8">
              {locale === "es" ? founder.bioEs : founder.bioEn}
            </p>
            <div className="flex items-center gap-5">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" strokeWidth={1.5} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* DIFFERENTIATORS — verbatim from master doc */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6">
              {locale === "es" ? "Lo que nos distingue" : "What sets us apart"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Siete decisiones que hacen Elements Method irrepetible."
                : "Seven decisions that make Elements Method unrepeatable."}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <ol className="border-y border-[var(--color-line)] divide-y divide-[var(--color-line)]">
              {(locale === "es" ? differentiatorsEs : differentiatorsEn).map(
                (line, idx) => (
                  <li
                    key={line}
                    className="py-6 grid grid-cols-[60px_1fr] gap-6 items-baseline"
                  >
                    <span className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-gold-deep)] tabular-nums">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[var(--color-ink-soft)] leading-relaxed">
                      {line}
                    </span>
                  </li>
                ),
              )}
            </ol>
          </div>
        </div>
      </Section>

      {/* MANIFESTO — verbatim from master doc opening line */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Eyebrow inverted className="mb-6">
              {locale === "es" ? "El diagnóstico" : "The diagnosis"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)] text-balance">
              {locale === "es"
                ? "La naturaleza no tiene una crisis de liderazgo. Nosotros sí. Quizá porque dejamos de aprender de ella."
                : "Nature does not have a leadership crisis. We do. Perhaps because we stopped learning from it."}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-4 space-y-6 text-lg leading-relaxed text-[var(--color-paper)]/80 max-w-2xl">
            <p>
              {locale === "es"
                ? "Elements Method es un programa de desarrollo de liderazgo basado en inmersiones en la naturaleza, diseñado para devolver a los líderes a su fuente esencial de poder — y en ese proceso, transformar no solo a los individuos, sino las organizaciones que lideran."
                : "Elements Method is a nature-based leadership development program, designed to return leaders to their essential source of power — and in that process, transform not only individuals, but the organizations they lead."}
            </p>
            <p>
              {locale === "es"
                ? "Cuando un líder se reconecta con su propia naturaleza — cuando encuentra su Agua, su Fuego, su Aire y su Tierra — no necesita más herramientas. Se reconecta con su ser completo."
                : "When a leader reconnects with their own nature — when they find their Water, their Fire, their Air and their Earth — they don't need more tools. They reconnect with their complete being."}
            </p>
            <p className="italic text-[var(--color-gold-soft)]">
              {locale === "es"
                ? "Y ese líder completo produce resultados organizacionales que ningún entrenamiento de habilidades puede generar desde la superficie."
                : "And that complete leader produces organizational results no skill training can generate from the surface."}
            </p>

            <div className="pt-8 flex flex-wrap gap-3">
              <Button
                href={`/${locale}/${locale === "es" ? "el-metodo" : "method"}`}
                trailingArrow
                className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)]"
              >
                {locale === "es" ? "Ver el método" : "See the method"}
              </Button>
              <Button
                href={`/${locale}/${locale === "es" ? "los-caminos" : "paths"}`}
                variant="outlineLight"
              >
                {locale === "es" ? "Ver programas" : "See programs"}
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

/**
 * Decorative portrait placeholder until a real photo is provided.
 * Uses the gold "Núcleo" glow to honor the brand language.
 */
function FounderPortrait() {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-paper-warm)] nucleus-glow">
      <svg
        className="absolute inset-0 w-full h-full mix-blend-multiply opacity-50"
        viewBox="0 0 100 125"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        {/* Compass-like mark — N/E/S/O cardinal arcs around a gold core */}
        <circle cx="50" cy="62" r="28" stroke="#C9A96E" strokeWidth="0.4" fill="none" opacity="0.6" />
        <circle cx="50" cy="62" r="20" stroke="#2C2C2A" strokeWidth="0.3" fill="none" opacity="0.4" strokeDasharray="1 2" />
        <circle cx="50" cy="62" r="3" fill="#C9A96E" />
        {/* Cardinal arcs */}
        <path d="M50 38 A 24 24 0 0 1 74 62" stroke="#2B6B8A" strokeWidth="1.2" fill="none" opacity="0.7" />
        <path d="M74 62 A 24 24 0 0 1 50 86" stroke="#C4622D" strokeWidth="1.2" fill="none" opacity="0.7" />
        <path d="M50 86 A 24 24 0 0 1 26 62" stroke="#3D5A3E" strokeWidth="1.2" fill="none" opacity="0.7" />
        <path d="M26 62 A 24 24 0 0 1 50 38" stroke="#7A9BAD" strokeWidth="1.2" fill="none" opacity="0.7" />
      </svg>
      <div className="absolute bottom-6 left-6 right-6 text-[var(--color-ink)]">
        <div className="eyebrow text-[var(--color-muted)] mb-1">
          Founder · 2025
        </div>
        <div className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
          Ana Michelle Concepción
        </div>
      </div>
    </div>
  );
}
