import Image from "next/image";
import { notFound } from "next/navigation";
import { Instagram, Linkedin } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

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

      {/* FOUNDERS — lorem ipsum placeholders */}
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

      {/* MANIFIESTO — verbatim from proyecto.md */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Eyebrow inverted className="mb-6">
              {locale === "es" ? "Manifiesto" : "Manifesto"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)] text-balance">
              {locale === "es"
                ? "Pensar mejor no es un talento. Es una práctica."
                : "Better thinking is not a talent. It is a practice."}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-4 space-y-6 text-lg leading-relaxed text-[var(--color-paper)]/80 max-w-2xl">
            <p>
              {locale === "es"
                ? "Las decisiones importantes no se toman solo con información. Se toman desde un estado mental específico."
                : "Important decisions are not made with information alone. They are made from a specific mental state."}
            </p>
            <p>
              {locale === "es"
                ? "Presión, velocidad y responsabilidad constante afectan la claridad estratégica del líder moderno."
                : "Pressure, speed and constant responsibility affect the modern leader's strategic clarity."}
            </p>
            <p>
              {locale === "es"
                ? "Elements es un espacio diseñado para entrenar la calidad de pensamiento desde donde se toman decisiones críticas. Integra herramientas de neurociencia, programación neurolingüística y frameworks estratégicos para mejorar enfoque, perspectiva y precisión."
                : "Elements is a space designed to train the quality of thinking decisions come from. It integrates neuroscience, neuro-linguistic programming and strategic frameworks to improve focus, perspective and precision."}
            </p>
            <p className="italic text-[var(--color-paper-warm)]">
              {locale === "es"
                ? "Porque el liderazgo no solo se mide por resultados. También por la calidad del criterio de quien los produce."
                : "Because leadership is not measured only by results. Also by the quality of judgment of who produces them."}
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
          <div className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
            {name.split(" ")[0]}
          </div>
        </div>
      </div>

      <div className="eyebrow text-[var(--color-muted)] mb-3">{role}</div>
      <h3 className="display-3 mb-5">{name}</h3>
      <p className="text-[var(--color-ink-soft)] leading-relaxed max-w-md italic">
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
