import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Instagram,
  Linkedin,
  Facebook,
  Award,
  Briefcase,
  BookOpen,
  Mic,
  MapPin,
  Quote,
} from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { founder, differentiatorsEs, differentiatorsEn } from "@/data/content";

const SOCIAL_ICON: Record<string, typeof Linkedin> = {
  LinkedIn: Linkedin,
  Instagram: Instagram,
  Facebook: Facebook,
};

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
            src="/images/heroes/quienes-somos.jpg"
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
            {dict.about.eyebrow}
          </div>
          <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[16ch]">
            {dict.about.title}
          </h1>
          <p className="lead mt-8 max-w-2xl text-[var(--color-paper)]/95">
            {dict.about.lead}
          </p>
        </Container>
      </section>

      {/* FOUNDER — identity + headline + bio + socials */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <FounderPortrait />
          </div>

          <div className="lg:col-span-7">
            <div className="eyebrow text-[var(--color-muted)] mb-4">
              {locale === "es" ? founder.fullTitleEs : founder.fullTitleEn}
            </div>
            <h2 className="display-2 mb-4 text-balance">
              {locale === "es" ? founder.nameEs : founder.nameEn}
            </h2>
            <p className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-6">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es"
                ? `${founder.originEs} → ${founder.locationEs}`
                : `${founder.originEn} → ${founder.locationEn}`}
            </p>

            <p className="text-xl font-[family-name:var(--font-display)] italic text-[var(--color-ink)] leading-snug mb-8 max-w-2xl text-pretty">
              {locale === "es" ? founder.headlineEs : founder.headlineEn}
            </p>

            <p className="text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-2xl mb-8">
              {locale === "es" ? founder.bioEs : founder.bioEn}
            </p>

            <div className="flex items-center gap-5">
              {founder.socials.map((s) => {
                const Icon = SOCIAL_ICON[s.platform] ?? Linkedin;
                return (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                    aria-label={`${s.platform} · ${s.handle}`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                    <span className="text-xs uppercase tracking-[0.18em] group-hover:underline underline-offset-4">
                      {s.handle}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* FOUNDER — long-form story arc */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Briefcase className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "El arco de 26 años" : "The 26-year arc"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "De Vicepresidenta corporativa a coach de resultados."
                : "From corporate VP to results coach."}
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-5 text-lg leading-relaxed text-[var(--color-ink-soft)]">
            {(locale === "es" ? founder.storyEs : founder.storyEn).map(
              (paragraph, idx) => (
                <p key={idx} className={idx === 0 ? "text-[var(--color-ink)] text-xl" : ""}>
                  {paragraph}
                </p>
              ),
            )}

            {/* PULL QUOTE */}
            <blockquote className="not-italic mt-10 pl-6 border-l-2 border-[var(--color-gold-deep)]">
              <Quote
                className="h-5 w-5 text-[var(--color-gold-deep)] mb-3"
                strokeWidth={1.5}
              />
              <p className="font-[family-name:var(--font-display)] text-2xl md:text-3xl italic text-[var(--color-ink)] leading-snug">
                {locale === "es" ? founder.quotesEs[0] : founder.quotesEn[0]}
              </p>
              <footer className="mt-4 text-sm uppercase tracking-[0.18em] text-[var(--color-muted)]">
                — {founder.nameEs}
              </footer>
            </blockquote>
          </div>
        </div>
      </Section>

      {/* CORPORATE PEDIGREE */}
      <Section spacing="default" tone="warm">
        <div className="grid lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6">
              {locale === "es" ? "Trayectoria corporativa" : "Corporate pedigree"}
            </Eyebrow>
            <h2 className="display-3 text-balance">
              {locale === "es"
                ? "Liderazgo VP-level en cinco organizaciones, seis países."
                : "VP-level leadership across five organizations, six countries."}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-3">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Equipos operativos, comerciales, de servicio, técnicos y de manejo de emergencias en telecomunicaciones y tecnología."
                : "Operations, sales, service, technical and emergency-management teams in telecommunications and technology."}
            </p>
          </div>
        </div>

        <div className="border border-[var(--color-line)] divide-y divide-[var(--color-line)] bg-[var(--color-paper)]">
          {founder.corporateRoles.map((r, idx) => (
            <div
              key={`${r.company}-${idx}`}
              className="grid grid-cols-[60px_1fr] md:grid-cols-[60px_220px_1fr_auto] gap-4 md:gap-6 p-5 md:p-6 items-baseline"
            >
              <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-muted)] tabular-nums">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="font-[family-name:var(--font-display)] text-lg md:text-xl tracking-tight col-span-1">
                {r.company}
              </span>
              <span className="text-[var(--color-ink-soft)] leading-relaxed col-span-2 md:col-span-1">
                {r.role}
              </span>
              <span className="hidden md:block text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                {r.region}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* CREDENTIALS + BOOK */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Award className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Formación y certificaciones" : "Training and certifications"}
            </Eyebrow>
            <h2 className="display-3 text-balance mb-8">
              {locale === "es"
                ? "Coaching multidisciplinario."
                : "Multidisciplinary coaching."}
            </h2>
            <ol className="border-y border-[var(--color-line)] divide-y divide-[var(--color-line)]">
              {(locale === "es" ? founder.credentialsEs : founder.credentialsEn).map(
                (c, idx) => (
                  <li
                    key={c}
                    className="py-4 grid grid-cols-[40px_1fr] gap-4 items-baseline"
                  >
                    <span className="font-[family-name:var(--font-display)] text-lg text-[var(--color-gold-deep)] tabular-nums">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[var(--color-ink-soft)] leading-relaxed">
                      {c}
                    </span>
                  </li>
                ),
              )}
            </ol>
          </div>

          <div className="lg:col-span-5 space-y-8">
            {/* PUBLISHED WORK */}
            <div className="bg-[var(--color-paper-warm)] border border-[var(--color-line)] p-6">
              <div className="flex items-center gap-2 mb-4 text-[var(--color-gold-deep)]">
                <BookOpen className="h-4 w-4" strokeWidth={1.5} />
                <span className="eyebrow text-[var(--color-gold-deep)]">
                  {locale === "es" ? "Publicación" : "Published work"}
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-2xl italic mb-3 text-[var(--color-ink)]">
                {(locale === "es" ? founder.workEs : founder.workEn).bookTitle}
              </h3>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                {(locale === "es" ? founder.workEs : founder.workEn).bookDescription}
              </p>
            </div>

            {/* MEDIA */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-[var(--color-muted)]">
                <Mic className="h-4 w-4" strokeWidth={1.5} />
                <span className="eyebrow">
                  {locale === "es" ? "Apariciones en medios" : "Media appearances"}
                </span>
              </div>
              <ul className="space-y-2 text-sm text-[var(--color-ink-soft)]">
                {(locale === "es" ? founder.workEs : founder.workEn).media.map(
                  (m) => (
                    <li key={m} className="border-l-2 border-[var(--color-gold-soft)] pl-3">
                      {m}
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* SPEAKING TOPICS */}
            <div>
              <div className="eyebrow text-[var(--color-muted)] mb-4">
                {locale === "es" ? "Temas de conferencia" : "Speaking topics"}
              </div>
              <div className="flex flex-wrap gap-2">
                {(locale === "es"
                  ? founder.speakingTopicsEs
                  : founder.speakingTopicsEn
                ).map((t) => (
                  <span
                    key={t}
                    className="inline-block text-xs px-3 py-1.5 border border-[var(--color-line)] text-[var(--color-ink-soft)] bg-[var(--color-paper)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
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
          <div className="lg:col-span-7 lg:pt-4 space-y-6 text-lg leading-relaxed text-[var(--color-paper)]/95 max-w-2xl">
            <p>
              {locale === "es"
                ? "Elements Method es un programa de desarrollo personal con impacto profesional, basado en inmersiones en la naturaleza, diseñado para devolver a las personas —especialmente a quienes lideran— a su fuente esencial de poder. Y en ese proceso, transformar no solo al individuo, sino a sus entornos y a las organizaciones que lo rodean."
                : "Elements Method is a nature-based personal development program with professional impact, designed to return people — especially those who lead — to their essential source of power. And in that process, transform not only the individual, but their environments and the organizations around them."}
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

            {/* MANIFIESTO — verbatim from ELEMENTS_proyecto_v1.docx */}
            <div className="pt-8 mt-6 border-t border-[var(--color-paper)]/15 space-y-4">
              <div className="eyebrow text-[var(--color-gold-soft)]">
                {locale === "es" ? "Manifiesto" : "Manifesto"}
              </div>
              <p>
                {locale === "es"
                  ? "Las decisiones importantes no se toman solo con información. Se toman desde un estado mental específico. Presión, velocidad y responsabilidad constante afectan la claridad estratégica del líder moderno."
                  : "The important decisions are not made with information alone. They are made from a specific mental state. Pressure, speed and constant responsibility affect the strategic clarity of the modern leader."}
              </p>
              <p className="font-[family-name:var(--font-display)] text-2xl italic text-[var(--color-paper)] leading-snug">
                {locale === "es"
                  ? "Pensar mejor no es un talento. Es una práctica."
                  : "Thinking better is not a talent. It is a practice."}
              </p>
              <p>
                {locale === "es"
                  ? "Porque el liderazgo no solo se mide por resultados. También por la calidad del criterio de quien los produce."
                  : "Because leadership is not measured only by results. It is also measured by the quality of judgment of the person producing them."}
              </p>
            </div>

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
