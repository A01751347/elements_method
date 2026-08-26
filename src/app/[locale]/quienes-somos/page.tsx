import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Instagram,
  Linkedin,
  Facebook,
  MapPin,
  Quote,
} from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
  founders as staticFounders,
  type FounderInfo,
  differentiatorsEs as staticDifferentiatorsEs,
  differentiatorsEn as staticDifferentiatorsEn,
} from "@/data/content";
import { getFounders } from "@/modules/content/founders";
import { getDifferentiators } from "@/modules/content/siteSections";

export const revalidate = 60;

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
  const es = locale === "es";

  const [dbFounders, dbDifferentiators] = await Promise.all([
    getFounders(),
    getDifferentiators(),
  ]);

  const founders = dbFounders.length > 0 ? dbFounders : staticFounders;
  const differentiatorsEs =
    dbDifferentiators.es.length > 0
      ? dbDifferentiators.es
      : staticDifferentiatorsEs;
  const differentiatorsEn =
    dbDifferentiators.en.length > 0
      ? dbDifferentiators.en
      : staticDifferentiatorsEn;

  return (
    <>
      {/* HERO — about Elements Method */}
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
          <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[18ch]">
            {es
              ? "Nacimos de una convicción: el liderazgo se transforma desde adentro."
              : "We were born from one conviction: leadership transforms from within."}
          </h1>
          <p className="lead mt-8 max-w-2xl text-[var(--color-paper)]/95">
            {es
              ? "Elements Method existe para devolver a las personas —y a quienes lideran— a su fuente esencial de poder, usando los cuatro elementos de la naturaleza como espejo y maestro."
              : "Elements Method exists to return people — and those who lead — to their essential source of power, using the four elements of nature as mirror and teacher."}
          </p>
        </Container>
      </section>

      {/* WHAT WE BELIEVE — the method, not a person */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6">
              {es ? "En qué creemos" : "What we believe"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {es
                ? "La mayor enseñanza de la naturaleza es su capacidad de autogestionarse."
                : "Nature's greatest lesson is its capacity to govern itself."}
            </h2>
            <p className="mt-6 text-[var(--color-ink-soft)] leading-relaxed">
              {es
                ? "Mediante Elements Method diseñamos tu camino hacia ella."
                : "Through Elements Method we design your path toward it."}
            </p>
          </div>
          <div className="lg:col-span-7 space-y-6 text-lg leading-relaxed text-[var(--color-ink-soft)]">
            <p className="text-[var(--color-ink)] text-xl">
              {es
                ? "El liderazgo no es un conjunto de competencias que se añaden desde afuera. Es una capacidad que ya existe —latente— dentro de cada persona. Igual que el Agua, el Fuego, el Aire y la Tierra ya existen en la naturaleza, esperando ser reconocidos y gestionados."
                : "Leadership is not a set of competencies added from the outside. It is a capacity that already exists — latent — inside every person. The same way Water, Fire, Air and Earth already exist in nature, waiting to be recognized and managed."}
            </p>
            <p>
              {es
                ? "La maestría de tu ser, como la entiende Elements Method, no significa control sobre ti. Significa conocimiento profundo de ti — y, desde ese conocimiento, la libertad de elegir cómo liderar en lugar de reaccionar desde patrones automáticos."
                : "Self mastery, as Elements Method understands it, does not mean control over yourself. It means deep knowledge of yourself — and from that knowledge, the freedom to choose how you lead instead of reacting from automatic patterns."}
            </p>
            <p className="italic text-[var(--color-gold-deep)] font-[family-name:var(--font-display)] text-2xl">
              {es
                ? "La naturaleza es el entorno. El líder es el territorio por descubrir."
                : "Nature is the setting. The leader is the territory to be discovered."}
            </p>
            <p className="italic text-[var(--color-ink-soft)]">
              {es ? "Esto no es un retiro. Es un regreso." : "This is not a retreat. This is a return."}
            </p>
          </div>
        </div>
      </Section>

      {/* THE FOUNDERS — brief, parallel bios */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6">
              {es ? "Quiénes lo fundaron" : "The founders"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {es
                ? "Dos caminos, una misma convicción."
                : "Two paths, one shared conviction."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-3">
            <p className="lead text-pretty">
              {es
                ? "Elements Method nace del encuentro de dos trayectorias que llegaron, por rutas distintas, a la misma certeza: las organizaciones cambian cuando las personas cambian."
                : "Elements Method is born from the meeting of two trajectories that arrived, by different routes, at the same certainty: organizations change when people change."}
            </p>
          </div>
        </div>

        <div className="space-y-16 md:space-y-24">
          {founders.map((f, idx) => (
            <FounderBlock key={f.slug} founder={f} locale={locale} flip={idx % 2 === 1} />
          ))}
        </div>
      </Section>

      {/* DIFFERENTIATORS — what sets the method apart */}
      <Section spacing="default" tone="warm">
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6">
              {es ? "Lo que nos distingue" : "What sets us apart"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {es
                ? "Siete decisiones que hacen Elements Method irrepetible."
                : "Seven decisions that make Elements Method unrepeatable."}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <ol className="border-y border-[var(--color-line)] divide-y divide-[var(--color-line)]">
              {(es ? differentiatorsEs : differentiatorsEn).map((line, idx) => (
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
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* MANIFESTO / CLOSING */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Eyebrow inverted className="mb-6">
              {es ? "El diagnóstico" : "The diagnosis"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)] text-balance">
              {es
                ? "La naturaleza nos enseña. No tiene una crisis de liderazgo; nosotros sí, quizá porque dejamos de aprender de ella."
                : "Nature teaches us. It has no leadership crisis; we do — perhaps because we stopped learning from it."}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-4 space-y-6 text-lg leading-relaxed text-[var(--color-paper)]/95 max-w-2xl">
            <p>
              {es
                ? "Elements Method es un programa de desarrollo personal con impacto profesional, basado en inmersiones en la naturaleza, diseñado para devolver a las personas —especialmente a quienes lideran— a su fuente esencial de poder. Y en ese proceso, transformar no solo al individuo, sino a sus entornos y a las organizaciones que lo rodean."
                : "Elements Method is a nature-based personal development program with professional impact, designed to return people — especially those who lead — to their essential source of power. And in that process, transform not only the individual, but their environments and the organizations around them."}
            </p>
            <p className="font-[family-name:var(--font-display)] text-2xl italic text-[var(--color-paper)] leading-snug">
              {es
                ? "Pensar mejor no es un talento. Es una práctica."
                : "Thinking better is not a talent. It is a practice."}
            </p>
            <p className="italic text-[var(--color-gold-soft)]">
              {es
                ? "Porque el liderazgo no solo se mide por resultados. También por la calidad del criterio de quien los produce."
                : "Because leadership is not measured only by results. It is also measured by the quality of judgment of the person producing them."}
            </p>

            <div className="pt-8 flex flex-wrap gap-3">
              <Button
                href={`/${locale}/${es ? "el-metodo" : "method"}`}
                trailingArrow
                className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)]"
              >
                {es ? "Ver el método" : "See the method"}
              </Button>
              <Button
                href={`/${locale}/${es ? "los-caminos" : "paths"}`}
                variant="outlineLight"
              >
                {es ? "Ver programas" : "See programs"}
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

/**
 * A single founder: photo (placeholder decorative mark until a real image is
 * dropped at founder.image) + role + short semblanza + one quote + socials.
 */
function FounderBlock({
  founder,
  locale,
  flip,
}: {
  founder: FounderInfo;
  locale: string;
  flip: boolean;
}) {
  const es = locale === "es";
  const paragraphs = (es ? founder.bioEs : founder.bioEn).split("\n\n");
  return (
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      <div className={flip ? "lg:col-span-4 lg:order-2" : "lg:col-span-4"}>
        <FounderPortrait founder={founder} locale={locale} />
      </div>

      <div className={flip ? "lg:col-span-8 lg:order-1" : "lg:col-span-8"}>
        <div className="eyebrow text-[var(--color-muted)] mb-3">
          {es ? founder.roleEs : founder.roleEn}
        </div>
        <h3 className="display-3 mb-3 text-balance">{founder.name}</h3>
        <p className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-6">
          <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
          {es ? founder.locationEs : founder.locationEn}
        </p>

        <div className="space-y-4 text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-2xl">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <blockquote className="mt-8 pl-6 border-l-2 border-[var(--color-gold-deep)]">
          <Quote className="h-5 w-5 text-[var(--color-gold-deep)] mb-3" strokeWidth={1.5} />
          <p className="font-[family-name:var(--font-display)] text-xl md:text-2xl italic text-[var(--color-ink)] leading-snug">
            {es ? founder.quoteEs : founder.quoteEn}
          </p>
          <footer className="mt-4 text-sm uppercase tracking-[0.18em] text-[var(--color-muted)]">
            — {founder.name}
          </footer>
        </blockquote>

        {founder.socials.length > 0 && (
          <div className="mt-8 flex items-center gap-5">
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
        )}
      </div>
    </div>
  );
}

/**
 * Founder portrait. Uses the real photo at `founder.image` when present;
 * otherwise renders the decorative compass mark (four element arcs around the
 * gold Núcleo). Drop a photo at the image path to replace it.
 */
function FounderPortrait({
  founder,
  locale,
}: {
  founder: FounderInfo;
  locale: string;
}) {
  const es = locale === "es";
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-paper-warm)] nucleus-glow">
      <Image
        src={founder.image}
        alt={founder.name}
        fill
        sizes="(max-width: 1024px) 100vw, 33vw"
        className="object-cover"
      />
      {/* Decorative fallback mark, shown beneath the image. If the image 404s
          in dev before real photos exist, this keeps the block on-brand. */}
      <svg
        className="absolute inset-0 w-full h-full mix-blend-multiply opacity-40 pointer-events-none"
        viewBox="0 0 100 125"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <circle cx="50" cy="62" r="28" stroke="#C9A96E" strokeWidth="0.4" fill="none" opacity="0.6" />
        <circle cx="50" cy="62" r="20" stroke="#2C2C2A" strokeWidth="0.3" fill="none" opacity="0.4" strokeDasharray="1 2" />
        <circle cx="50" cy="62" r="3" fill="#8A6F3C" />
        <path d="M50 38 A 24 24 0 0 1 74 62" stroke="#2B6B8A" strokeWidth="1.2" fill="none" opacity="0.7" />
        <path d="M74 62 A 24 24 0 0 1 50 86" stroke="#C4622D" strokeWidth="1.2" fill="none" opacity="0.7" />
        <path d="M50 86 A 24 24 0 0 1 26 62" stroke="#3D5A3E" strokeWidth="1.2" fill="none" opacity="0.7" />
        <path d="M26 62 A 24 24 0 0 1 50 38" stroke="#7A9BAD" strokeWidth="1.2" fill="none" opacity="0.7" />
      </svg>
      <div className="absolute bottom-5 left-5 right-5 text-[var(--color-ink)]">
        {/* Each founder's own role — the label used to be hardcoded to
         *  "Cofundador", which was both wrong for Ana and dropped the fact that
         *  she created the method (client feedback #74). */}
        <div className="eyebrow text-[var(--color-muted)] mb-1">
          {es ? founder.roleEs : founder.roleEn}
        </div>
      </div>
    </div>
  );
}
