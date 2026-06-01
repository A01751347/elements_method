import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Section, Eyebrow } from "@/components/ui/Section";
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
      <Section spacing="loose">
        <div className="max-w-4xl">
          <Eyebrow className="mb-6">{dict.blog.eyebrow}</Eyebrow>
          <h1 className="display-1">{dict.blog.title}</h1>
          <p className="lead mt-8 max-w-2xl">{dict.blog.lead}</p>
        </div>
      </Section>

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
                  <svg
                    viewBox="0 0 400 300"
                    className="absolute inset-0 w-full h-full mix-blend-multiply opacity-60"
                    aria-hidden
                  >
                    <path
                      d="M0 200 Q100 150, 200 200 T 400 200 L 400 300 L 0 300 Z"
                      fill="var(--color-water)"
                      opacity="0.3"
                    />
                    <path
                      d="M0 230 Q100 180, 200 230 T 400 230 L 400 300 L 0 300 Z"
                      fill="var(--color-water)"
                      opacity="0.4"
                    />
                  </svg>
                  <div className="absolute top-5 left-5 inline-flex items-center gap-2 bg-[var(--color-paper)]/85 backdrop-blur px-3 py-1.5 text-[0.7rem] tracking-[0.18em] uppercase">
                    {featured.tag}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="eyebrow text-[var(--color-muted)] mb-4 flex items-center gap-3">
                  <span aria-hidden className="h-px w-8 bg-[var(--color-muted)]/40" />
                  {locale === "es" ? "Más reciente" : "Latest"}
                </div>
                <h2 className="display-2 group-hover:text-[var(--color-moss-700)] transition-colors">
                  {locale === "es" ? featured.titleEs : featured.titleEn}
                </h2>
                <p className="lead mt-6">
                  {locale === "es" ? featured.excerptEs : featured.excerptEn}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-[var(--color-muted)]">
                  <span className="text-[var(--color-ink)]">{featured.author}</span>
                  <span aria-hidden>·</span>
                  <span>{formatDate(featured.date, locale)}</span>
                  <span aria-hidden>·</span>
                  <span>
                    {featured.readMinutes} {locale === "es" ? "min" : "min"}
                  </span>
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

      <Section spacing="default">
        <div className="border-t border-[var(--color-line)]">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="group block border-b border-[var(--color-line)] py-10 md:py-14 grid lg:grid-cols-12 gap-6 hover:bg-[var(--color-paper-warm)]/40 transition-colors -mx-5 sm:-mx-8 px-5 sm:px-8"
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
                <h3 className="display-3 group-hover:text-[var(--color-moss-700)] transition-colors">
                  {locale === "es" ? post.titleEs : post.titleEn}
                </h3>
                <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed max-w-2xl">
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
    </>
  );
}
