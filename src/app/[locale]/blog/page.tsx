import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  Clock,
  BookOpen,
  Droplets,
  Flame,
  Wind,
  Mountain,
  Send,
  Library,
} from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { blogPosts } from "@/data/content";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "Journal" : "Diario" };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const [featured, ...rest] = blogPosts;

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden -mt-20 pt-20 text-[var(--color-paper)]">
        <div className="absolute inset-0 -z-20">
          <Image
            src="https://images.unsplash.com/photo-1500380804539-4e1e8c1e7118?w=2400&q=85&auto=format&fit=crop"
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
            {dict.blog.eyebrow}
          </div>
          <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[14ch]">
            {dict.blog.title}
          </h1>
          <p className="lead mt-8 max-w-2xl text-[var(--color-paper)]/85">
            {dict.blog.lead}
          </p>
        </Container>
      </section>

      {/* FEATURED */}
      {featured && (
        <Section spacing="default" contained={false} tone="warm" className="paper-grain">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <Link
              href={`/${locale}/blog/${featured.slug}`}
              className="group grid lg:grid-cols-12 gap-10 lg:gap-16 items-center"
            >
              <div className="lg:col-span-6">
                <div
                  className="aspect-[4/3] relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-water-soft) 0%, var(--color-paper-warm) 100%)",
                  }}
                >
                  <Image
                    src="https://images.unsplash.com/photo-1499346030926-9a72daac6c63?w=1200&q=80&auto=format&fit=crop"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/30 to-transparent" />
                  <div className="absolute top-5 left-5 inline-flex items-center gap-2 bg-[var(--color-paper)]/95 backdrop-blur px-3 py-1.5 text-[0.7rem] tracking-[0.18em] uppercase">
                    {featured.tag}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="eyebrow text-[var(--color-muted)] mb-4 flex items-center gap-3">
                  <span aria-hidden className="h-px w-8 bg-[var(--color-muted)]/40" />
                  {locale === "es" ? "Más reciente" : "Latest"}
                </div>
                <h2 className="display-2 group-hover:text-[var(--color-moss-700)] transition-colors text-balance">
                  {locale === "es" ? featured.titleEs : featured.titleEn}
                </h2>
                <p className="lead mt-6 text-pretty">
                  {locale === "es" ? featured.excerptEs : featured.excerptEn}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-[var(--color-muted)]">
                  <span className="text-[var(--color-ink)]">{featured.author}</span>
                  <span aria-hidden>·</span>
                  <span>{formatDate(featured.date, locale)}</span>
                  <span aria-hidden>·</span>
                  <span>{featured.readMinutes} min</span>
                </div>
                <div className="mt-8 inline-flex items-center gap-2 text-sm text-[var(--color-ink)] border-b border-[var(--color-ink)]/30 pb-1 group-hover:border-[var(--color-ink)] transition-colors">
                  {dict.blog.readMore}
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </Section>
      )}

      {/* EDITORIAL AXES */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Library className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Ejes editoriales" : "Editorial axes"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Cuatro temas. Un cuaderno largo."
                : "Four themes. One long notebook."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-4">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Cada texto entra por uno de los cuatro elementos. No es categoría: es ángulo de lectura."
                : "Each text enters through one of the four elements. Not a category — a reading angle."}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {[
            {
              icon: Droplets,
              color: "var(--color-water)",
              soft: "var(--color-water-soft)",
              t: locale === "es" ? "Agua" : "Water",
              about: locale === "es" ? "Escucha, lectura emocional, conversaciones difíciles" : "Listening, emotional reading, hard conversations",
              count: "12",
            },
            {
              icon: Flame,
              color: "var(--color-fire)",
              soft: "var(--color-fire-soft)",
              t: locale === "es" ? "Fuego" : "Fire",
              about: locale === "es" ? "Decisión, activación, propósito ejecutado" : "Decision, activation, executed purpose",
              count: "9",
            },
            {
              icon: Wind,
              color: "var(--color-air)",
              soft: "var(--color-air-soft)",
              t: locale === "es" ? "Aire" : "Air",
              about: locale === "es" ? "Claridad, comunicación, narrativa" : "Clarity, communication, narrative",
              count: "7",
            },
            {
              icon: Mountain,
              color: "var(--color-earth)",
              soft: "var(--color-earth-soft)",
              t: locale === "es" ? "Tierra" : "Earth",
              about: locale === "es" ? "Hábitos, estructura, raíz" : "Habits, structure, root",
              count: "11",
            },
          ].map((row) => {
            const Icon = row.icon;
            return (
              <div
                key={row.t}
                className="group bg-[var(--color-paper)] p-7 md:p-8 hover:bg-[var(--color-paper-warm)] transition-colors duration-500 min-h-[240px] flex flex-col"
              >
                <div className="flex items-start justify-between mb-6">
                  <span
                    className="inline-flex items-center justify-center h-11 w-11 rounded-full"
                    style={{ background: row.soft }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} style={{ color: row.color }} />
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]/30">
                    {row.count}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-tight mb-2">
                  {row.t}
                </h3>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed flex-1">
                  {row.about}
                </p>
                <div
                  className="mt-5 text-xs uppercase tracking-wide font-medium"
                  style={{ color: row.color }}
                >
                  {locale === "es" ? "Explorar" : "Explore"} →
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ARTICLES LIST */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="mb-12">
          <Eyebrow className="mb-6 flex items-center gap-3">
            <BookOpen className="h-3.5 w-3.5" strokeWidth={1.5} />
            {locale === "es" ? "Más recientes" : "Most recent"}
          </Eyebrow>
        </div>

        <div className="border-t border-[var(--color-line)] bg-[var(--color-paper)]">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="group block border-b border-[var(--color-line)] py-10 md:py-12 grid lg:grid-cols-12 gap-6 hover:bg-[var(--color-paper-warm)]/60 transition-colors -mx-5 sm:-mx-8 px-5 sm:px-8"
            >
              <div className="lg:col-span-2 flex flex-col gap-2">
                <span className="eyebrow text-[var(--color-muted)]">
                  {post.tag}
                </span>
                <span className="text-sm text-[var(--color-muted)]">
                  {formatDate(post.date, locale)}
                </span>
              </div>
              <div className="lg:col-span-7">
                <h3 className="display-3 group-hover:text-[var(--color-moss-700)] transition-colors text-balance">
                  {locale === "es" ? post.titleEs : post.titleEn}
                </h3>
                <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed max-w-2xl text-pretty">
                  {locale === "es" ? post.excerptEs : post.excerptEn}
                </p>
              </div>
              <div className="lg:col-span-3 flex lg:items-end lg:justify-end">
                <div className="inline-flex items-center gap-2 text-sm text-[var(--color-ink)] border-b border-[var(--color-ink)]/30 pb-1 group-hover:border-[var(--color-ink)] transition-colors">
                  {dict.blog.readMore}
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* AUTHORS */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-6">
              {locale === "es" ? "Voces" : "Voices"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Quién escribe aquí."
                : "Who writes here."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-4">
            <p className="lead text-pretty">
              {locale === "es"
                ? "Solo Andrés, Ana Michelle y, ocasionalmente, alguien del equipo extendido. No hay ghostwriting ni IA generando texto."
                : "Only Andrés, Ana Michelle and, occasionally, someone from the extended team. No ghostwriting, no AI-generated text."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {(locale === "es"
            ? [
                {
                  n: "Andrés Flores",
                  r: "Cofundador",
                  bio: "Escribe sobre decisión, fuego y la responsabilidad de mandar bien. Cuenta lo que aprende en sesiones, no lo que opina sin haber visto.",
                  count: "23 textos",
                },
                {
                  n: "Ana Michelle",
                  r: "Cofundadora",
                  bio: "Escribe sobre cuerpo, agua y lo que pasa antes de la palabra. Práctica somática traducida sin diluir.",
                  count: "16 textos",
                },
              ]
            : [
                {
                  n: "Andrés Flores",
                  r: "Cofounder",
                  bio: "Writes about decision, fire and the responsibility of commanding well. Tells what he learns in sessions, not what he opines without seeing.",
                  count: "23 texts",
                },
                {
                  n: "Ana Michelle",
                  r: "Cofounder",
                  bio: "Writes about body, water and what happens before words. Somatic practice translated without dilution.",
                  count: "16 texts",
                },
              ]
          ).map((author) => (
            <div
              key={author.n}
              className="bg-[var(--color-paper)] p-8 md:p-10 hover:bg-[var(--color-paper-warm)] transition-colors"
            >
              <div className="flex items-start gap-5">
                <div className="h-16 w-16 rounded-full bg-[var(--color-moss-100)] flex items-center justify-center shrink-0">
                  <span className="font-[family-name:var(--font-display)] text-xl text-[var(--color-moss-700)]">
                    {author.n.split(" ").map((s) => s[0]).join("")}
                  </span>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
                    {author.n}
                  </h3>
                  <div className="text-xs uppercase tracking-wide text-[var(--color-muted)] mt-1">
                    {author.r} · {author.count}
                  </div>
                </div>
              </div>
              <p className="mt-6 text-[var(--color-ink-soft)] leading-relaxed">
                {author.bio}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* RECOMMENDED READING */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-6">
            <Eyebrow inverted className="mb-6">
              {locale === "es" ? "Lecturas que nos formaron" : "Readings that shaped us"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)] text-balance">
              {locale === "es"
                ? "Si el método te interesa, esto te interesa."
                : "If the method interests you, this interests you."}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-3">
            <p className="text-lg text-[var(--color-paper)]/75 leading-relaxed text-pretty">
              {locale === "es"
                ? "Libros que sostienen nuestra biblioteca. No son referencias casuales: son fuente activa de práctica."
                : "Books that sustain our library. Not casual references: active practice sources."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-paper)]/15">
          {[
            { t: "The Body Keeps the Score", a: "Bessel van der Kolk", e: locale === "es" ? "Agua" : "Water" },
            { t: "The Inner Game of Tennis", a: "Timothy Gallwey", e: locale === "es" ? "Fuego" : "Fire" },
            { t: "Atomic Habits", a: "James Clear", e: locale === "es" ? "Tierra" : "Earth" },
            { t: "Iron John", a: "Robert Bly", e: locale === "es" ? "Aire" : "Air" },
            { t: "Polyvagal Theory", a: "Stephen Porges", e: locale === "es" ? "Agua" : "Water" },
            { t: "Tribe", a: "Sebastian Junger", e: locale === "es" ? "Tierra" : "Earth" },
            { t: "Wild", a: "Cheryl Strayed", e: locale === "es" ? "Tierra" : "Earth" },
            { t: "Breath", a: "James Nestor", e: locale === "es" ? "Aire" : "Air" },
          ].map((book) => (
            <div key={book.t} className="bg-[var(--color-ink)] p-6 md:p-7 min-h-[180px] flex flex-col justify-between">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-lg leading-tight text-[var(--color-paper)] mb-2">
                  {book.t}
                </h3>
                <p className="text-sm text-[var(--color-paper)]/60">{book.a}</p>
              </div>
              <div className="text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-paper)]/50">
                {book.e}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* NEWSLETTER */}
      <Section spacing="default" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Send className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Boletín mensual" : "Monthly journal"}
            </Eyebrow>
            <h2 className="display-2 max-w-2xl text-balance">
              {locale === "es"
                ? "Una nota cada mes. Sin ruido, sin venta."
                : "One note each month. No noise, no selling."}
            </h2>
            <p className="lead mt-6 max-w-xl text-pretty">
              {locale === "es"
                ? "Lectura corta, fecha del próximo retiro, una pregunta abierta. Cancelas cuando quieras."
                : "Short reading, next retreat date, an open question. Cancel anytime."}
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-[var(--color-paper)] border border-[var(--color-line)] p-7">
              <label htmlFor="blog-email" className="eyebrow text-[var(--color-muted)] mb-3 block">
                {locale === "es" ? "Tu correo" : "Your email"}
              </label>
              <div className="flex items-center gap-2 border-b border-[var(--color-line)] focus-within:border-[var(--color-ink)] transition-colors">
                <input
                  id="blog-email"
                  type="email"
                  placeholder="nombre@dominio.com"
                  className="flex-1 bg-transparent py-3 text-[var(--color-ink)] placeholder:text-[var(--color-muted)]/50 focus:outline-none"
                />
                <Button size="sm" trailingArrow type="submit">
                  {locale === "es" ? "Suscribir" : "Subscribe"}
                </Button>
              </div>
              <p className="mt-4 text-xs text-[var(--color-muted)]">
                {locale === "es"
                  ? "Política de privacidad LFPDPPP. No compartimos tu correo con nadie."
                  : "LFPDPPP privacy policy. We don't share your email with anyone."}
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
