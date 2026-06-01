import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/Container";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Instagram, Linkedin } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Who we are" : "Quiénes somos",
  };
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
      <Section spacing="loose">
        <div className="max-w-4xl">
          <Eyebrow className="mb-6">{dict.about.eyebrow}</Eyebrow>
          <h1 className="display-1">{dict.about.title}</h1>
          <p className="lead mt-8 max-w-2xl">{dict.about.lead}</p>
        </div>
      </Section>

      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <FounderCard
            name="Andrés Flores Pedroza"
            role={dict.about.andres.role}
            bio={dict.about.andres.bio}
            accent="var(--color-fire)"
            accentSoft="var(--color-fire-soft)"
            elementSymbol="fire"
            socials={[
              { kind: "linkedin", href: "https://linkedin.com" },
              { kind: "instagram", href: "https://instagram.com" },
            ]}
          />
          <FounderCard
            name="Ana Michelle"
            role={dict.about.michelle.role}
            bio={dict.about.michelle.bio}
            accent="var(--color-water)"
            accentSoft="var(--color-water-soft)"
            elementSymbol="water"
            socials={[
              { kind: "linkedin", href: "https://linkedin.com" },
              { kind: "instagram", href: "https://instagram.com" },
            ]}
          />
        </div>
      </Section>

      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6">
              {locale === "es" ? "Manifiesto" : "Manifesto"}
            </Eyebrow>
            <h2 className="display-2">
              {locale === "es"
                ? "No enseñamos liderazgo. Lo entrenamos."
                : "We don't teach leadership. We train it."}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-4">
            <div className="space-y-6 text-lg leading-relaxed text-[var(--color-ink-soft)] max-w-2xl">
              <p>
                {locale === "es"
                  ? "La industria del liderazgo confunde discurso con práctica. Hablamos mucho de \"presencia\" y \"escucha\" sin trabajar el cuerpo, la respiración, las decisiones que duelen."
                  : "The leadership industry confuses speech with practice. We talk a lot about \"presence\" and \"listening\" without working the body, the breath, the decisions that hurt."}
              </p>
              <p>
                {locale === "es"
                  ? "Los cuatro elementos nos dan una gramática concreta: cada uno es un terreno entrenable, con cuerpo, con prácticas, con frameworks. Lo simbólico no sustituye lo concreto; lo organiza."
                  : "The four elements give us a concrete grammar: each one is a trainable terrain, with body, with practices, with frameworks. The symbolic doesn't replace the concrete; it organizes it."}
              </p>
              <p>
                {locale === "es"
                  ? "Trabajamos con personas que toman decisiones cuyas consecuencias importan. Por eso nuestro método exige tiempo, presencia y, sobre todo, honestidad."
                  : "We work with people whose decisions have consequences that matter. That's why our method demands time, presence, and above all, honesty."}
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-3">
              <Button
                href={`/${locale}/${locale === "es" ? "el-metodo" : "method"}`}
                trailingArrow
              >
                {locale === "es" ? "Ver el método" : "See the method"}
              </Button>
              <Button
                href={`/${locale}/${locale === "es" ? "los-caminos" : "paths"}`}
                variant="secondary"
              >
                {locale === "es" ? "Los caminos" : "The paths"}
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function FounderCard({
  name,
  role,
  bio,
  accent,
  accentSoft,
  elementSymbol,
  socials,
}: {
  name: string;
  role: string;
  bio: string;
  accent: string;
  accentSoft: string;
  elementSymbol: "fire" | "water";
  socials: { kind: "linkedin" | "instagram"; href: string }[];
}) {
  return (
    <article className="group">
      <div
        className="relative aspect-[4/5] mb-8 overflow-hidden"
        style={{
          background: `linear-gradient(140deg, ${accentSoft} 0%, var(--color-paper-warm) 100%)`,
        }}
      >
        {/* Decorative element glyph */}
        <svg
          className="absolute inset-0 w-full h-full mix-blend-multiply opacity-50"
          viewBox="0 0 100 125"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          {elementSymbol === "fire" ? (
            <path
              d="M50 20 C 40 35, 65 45, 50 60 C 35 50, 40 75, 50 95 C 65 80, 80 60, 75 40 C 70 30, 60 28, 50 20 Z"
              fill={accent}
              opacity="0.55"
            />
          ) : (
            <path
              d="M50 18 C 70 40, 78 60, 50 100 C 22 60, 30 40, 50 18 Z"
              fill={accent}
              opacity="0.55"
            />
          )}
        </svg>

        <div className="absolute bottom-5 left-5 text-[var(--color-ink)]">
          <div
            className="font-[family-name:var(--font-display)] text-2xl tracking-tight"
          >
            {name.split(" ")[0]}
          </div>
        </div>
      </div>

      <div className="eyebrow text-[var(--color-muted)] mb-3">{role}</div>
      <h3 className="display-3 mb-5">{name}</h3>
      <p className="text-[var(--color-ink-soft)] leading-relaxed max-w-md">
        {bio}
      </p>

      <div className="mt-6 flex items-center gap-4">
        {socials.map((s) => (
          <a
            key={s.kind}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
            aria-label={s.kind}
          >
            {s.kind === "linkedin" ? (
              <Linkedin className="h-4 w-4" />
            ) : (
              <Instagram className="h-4 w-4" />
            )}
          </a>
        ))}
      </div>
    </article>
  );
}
