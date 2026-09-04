import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Mail } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Section, Eyebrow } from "@/components/ui/Section";
import { blogCover } from "@/lib/blogCover";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getBlogPosts } from "@/modules/content/blog";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "Articles" : "Artículos" };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const posts = await getBlogPosts();

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92svh] flex items-end overflow-hidden -mt-20 pt-32 md:pt-40 text-[var(--color-paper)]">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/heroes/blog.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-ink)]/40 via-[var(--color-ink)]/55 to-[var(--color-ink)]" />
        <div className="absolute inset-0 -z-10 film-grain" />

        <Container className="relative pb-12 md:pb-14">
          <div className="eyebrow text-[var(--color-paper)]/95 mb-6 flex items-center gap-3">
            <span aria-hidden className="h-px w-12 bg-[var(--color-paper)]/40" />
            {dict.blog.eyebrow}
          </div>
          <h1 className="display-hero text-balance text-[var(--color-paper)]">
            {dict.blog.title}
          </h1>
          <p className="lead mt-7 max-w-xl text-[var(--color-paper)]/95">
            {dict.blog.lead}
          </p>
        </Container>
      </section>

      {posts.length > 0 ? (
        /* ÍNDICE EDITORIAL — un destacado con imagen y el resto en lista.
         *  Antes eran once tarjetas iguales apiladas: una página larguísima
         *  donde además cada portada repetía una foto del propio sitio. */
        <Section spacing="default">
          {(() => {
            const [featured, ...rest] = posts;
            const href = (slug: string) =>
              `/${locale}/${locale === "es" ? "blog" : "journal"}/${slug}`;
            const fmt = (iso: string | null) =>
              iso
                ? new Date(iso).toLocaleDateString(
                    locale === "es" ? "es-MX" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" },
                  )
                : "";

            return (
              <>
                {/* Destacado */}
                <Link
                  href={href(featured.slug)}
                  className="group grid lg:grid-cols-12 gap-8 lg:gap-12 items-center pb-14 mb-14 border-b border-[var(--color-line)]"
                >
                  <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden bg-[var(--color-paper-warm)]">
                    <Image
                      src={blogCover(featured)}
                      alt=""
                      fill
                      priority
                      sizes="(min-width:1024px) 58vw, 100vw"
                      className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="lg:col-span-5">
                    <div className="eyebrow text-[var(--color-muted)] mb-4">
                      {locale === "es" ? "Lo más reciente" : "Latest"}
                    </div>
                    <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl leading-[1.1] tracking-tight text-balance group-hover:text-[var(--color-gold-deep)] transition-colors">
                      {locale === "es" ? featured.titleEs : featured.titleEn}
                    </h2>
                    <p className="mt-5 text-[var(--color-ink-soft)] leading-relaxed line-clamp-4">
                      {locale === "es" ? featured.excerptEs : featured.excerptEn}
                    </p>
                    <div className="mt-6 text-xs text-[var(--color-muted)]">
                      {featured.author}
                      {featured.publishedAt && ` · ${fmt(featured.publishedAt)}`}
                    </div>
                  </div>
                </Link>

                {/* El resto, en índice tipográfico de dos columnas */}
                <div className="grid md:grid-cols-2 gap-x-12">
                  {rest.map((p) => (
                    <Link
                      key={p.slug}
                      href={href(p.slug)}
                      className="group grid grid-cols-[76px_1fr] sm:grid-cols-[104px_1fr] gap-5 py-6 border-b border-[var(--color-line)] items-start"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[var(--color-paper-warm)]">
                        <Image
                          src={blogCover(p)}
                          alt=""
                          fill
                          sizes="104px"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-[family-name:var(--font-display)] text-xl leading-snug tracking-tight text-balance group-hover:text-[var(--color-gold-deep)] transition-colors">
                          {locale === "es" ? p.titleEs : p.titleEn}
                        </h3>
                        <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed line-clamp-2">
                          {locale === "es" ? p.excerptEs : p.excerptEn}
                        </p>
                        <div className="mt-3 text-[0.7rem] tracking-[0.14em] uppercase text-[var(--color-muted)]">
                          {p.publishedAt ? fmt(p.publishedAt) : p.author}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            );
          })()}
        </Section>
      ) : (
        /* FALLBACK — no published posts yet */
        <Section spacing="loose" tone="warm" className="paper-grain">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <Eyebrow className="mb-6 flex items-center gap-3">
                <BookOpen className="h-3.5 w-3.5" strokeWidth={1.5} />
                {locale === "es" ? "Próximamente" : "Coming soon"}
              </Eyebrow>
              <h2 className="display-2 text-balance">
                {locale === "es"
                  ? "Estamos migrando aquí el archivo completo."
                  : "We're migrating the full archive here."}
              </h2>
              <p className="lead mt-8 max-w-2xl text-pretty">
                {locale === "es"
                  ? "Los artículos que ya publicamos en LinkedIn se están reeditando para vivir aquí, junto con casos de nuestras inmersiones y los estudios que sostienen la metodología. Mientras tanto, puedes leerlos en LinkedIn."
                  : "The articles already published on LinkedIn are being re-edited to live here, alongside cases from our immersions and the research behind the methodology. In the meantime, you can read them on LinkedIn."}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  href="https://www.linkedin.com/in/ana-michelle-concepcion-esterrich-51b7017/recent-activity/all/"
                  trailingArrow
                >
                  {locale === "es" ? "Leer en LinkedIn" : "Read on LinkedIn"}
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-[var(--color-paper)] border border-[var(--color-line)] p-8">
                <div className="flex items-center gap-3 eyebrow text-[var(--color-muted)] mb-4">
                  <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {locale === "es" ? "Mantente al tanto" : "Stay tuned"}
                </div>
                <p className="text-[var(--color-ink-soft)] mb-6 text-sm leading-relaxed">
                  {locale === "es"
                    ? "Para información sobre próximos módulos y publicaciones."
                    : "For information about upcoming modules and publications."}
                </p>
                <Button
                  href="mailto:hello@elementsmethod.com"
                  trailingArrow
                  className="w-full"
                >
                  hello@elementsmethod.com
                </Button>
              </div>
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
