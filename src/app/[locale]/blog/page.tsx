import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Mail } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Section, Eyebrow } from "@/components/ui/Section";
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
      <section className="relative min-h-[60vh] flex items-end overflow-hidden -mt-20 pt-20 text-[var(--color-paper)]">
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

        <Container className="relative pb-16 md:pb-24">
          <div className="eyebrow text-[var(--color-paper)]/95 mb-8 flex items-center gap-3">
            <span aria-hidden className="h-px w-12 bg-[var(--color-paper)]/40" />
            {dict.blog.eyebrow}
          </div>
          <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[16ch]">
            {dict.blog.title}
          </h1>
        </Container>
      </section>

      {posts.length > 0 ? (
        /* REAL POSTS — published from the admin */
        <Section spacing="loose">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((p) => {
              const title = locale === "es" ? p.titleEs : p.titleEn;
              const excerpt = locale === "es" ? p.excerptEs : p.excerptEn;
              return (
                <Link
                  key={p.slug}
                  href={`/${locale}/${locale === "es" ? "blog" : "journal"}/${p.slug}`}
                  className="group flex flex-col border border-[var(--color-line)] bg-[var(--color-paper)] hover:bg-[var(--color-paper-warm)] transition-colors"
                >
                  {p.coverImageUrl && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={p.coverImageUrl}
                        alt=""
                        fill
                        sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="font-[family-name:var(--font-display)] text-xl tracking-tight mb-3 group-hover:text-[var(--color-gold-deep)] transition-colors">
                      {title}
                    </h2>
                    <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed line-clamp-3">
                      {excerpt}
                    </p>
                    <div className="mt-auto pt-4 text-xs text-[var(--color-muted)]">
                      {p.author}
                      {p.publishedAt &&
                        ` · ${new Date(p.publishedAt).toLocaleDateString(
                          locale === "es" ? "es-MX" : "en-US",
                          { year: "numeric", month: "long", day: "numeric" },
                        )}`}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
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
                  ? "Estamos preparando el primer artículo."
                  : "We're preparing the first article."}
              </h2>
              <p className="lead mt-8 max-w-2xl text-pretty">
                {locale === "es"
                  ? "Pronto publicaremos contenido editorial sobre liderazgo, naturaleza y los cinco elementos."
                  : "We'll soon publish editorial content on leadership, nature, and the five elements."}
              </p>
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
