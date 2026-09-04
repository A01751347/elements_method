import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { getBlogPostBySlug } from "@/modules/content/blog";
import { CommentsSection } from "@/components/forms/CommentsSection";
import { Markdown } from "@/components/ui/Markdown";
import { blogCover } from "@/lib/blogCover";

export const revalidate = 60;

/** Content columns are jsonb stored as { text }. Read the plain text safely. */
function contentText(value: unknown): string {
  if (value && typeof value === "object" && "text" in value) {
    const t = (value as { text?: unknown }).text;
    return typeof t === "string" ? t : "";
  }
  return typeof value === "string" ? value : "";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Blog" };
  const title = locale === "en" ? (post.titleEn ?? post.titleEs) : post.titleEs;
  const description =
    locale === "en"
      ? post.metaDescriptionEn ?? post.excerptEn ?? undefined
      : post.metaDescriptionEs ?? post.excerptEs ?? undefined;
  return { title: `${title} · Elements Method`, description };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = await getBlogPostBySlug(slug);
  if (!post || post.status !== "published") notFound();

  const title = locale === "es" ? post.titleEs : post.titleEn ?? post.titleEs;
  const body = contentText(locale === "es" ? post.contentEs : post.contentEn ?? post.contentEs);

  const excerpt =
    locale === "es" ? post.excerptEs : post.excerptEn ?? post.excerptEs;
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(
        locale === "es" ? "es-MX" : "en-US",
        { year: "numeric", month: "long", day: "numeric" },
      )
    : null;
  // Lectura estimada a 200 palabras por minuto: da al lector una expectativa
  // antes de entrar, que es justo lo que le falta a un texto largo.
  const minutes = Math.max(1, Math.round(body.split(/\s+/).length / 200));

  return (
    <>
      {/* La portada abre el artículo en banda ancha: antes iba enterrada
       *  debajo del título y de la firma, y el título salía a 112px. */}
      <div className="relative aspect-[16/9] md:aspect-[21/8] overflow-hidden bg-[var(--color-paper-warm)]">
        <Image
          src={blogCover(post)}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Rail de contexto: se queda fijo mientras se lee */}
          <aside className="lg:col-span-3 lg:sticky lg:top-32 lg:self-start">
            <Link
              href={`/${locale}/${locale === "es" ? "blog" : "journal"}`}
              className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {locale === "es" ? "Todos los artículos" : "All articles"}
            </Link>

            <dl className="mt-8 space-y-5 text-sm border-t border-[var(--color-line)] pt-6">
              <div>
                <dt className="eyebrow text-[var(--color-muted)] mb-1">
                  {locale === "es" ? "Escribe" : "Written by"}
                </dt>
                <dd className="text-[var(--color-ink)]">
                  {post.author ?? "Elements Method"}
                </dd>
              </div>
              {date && (
                <div>
                  <dt className="eyebrow text-[var(--color-muted)] mb-1">
                    {locale === "es" ? "Publicado" : "Published"}
                  </dt>
                  <dd className="text-[var(--color-ink-soft)]">{date}</dd>
                </div>
              )}
              <div>
                <dt className="eyebrow text-[var(--color-muted)] mb-1">
                  {locale === "es" ? "Lectura" : "Reading"}
                </dt>
                <dd className="text-[var(--color-ink-soft)]">
                  {minutes} min
                </dd>
              </div>
            </dl>
          </aside>

          {/* El artículo */}
          <div className="lg:col-span-9 max-w-[68ch]">
            <h1 className="font-[family-name:var(--font-display)] font-medium tracking-[-0.018em] text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.12] text-balance">
              {title}
            </h1>
            {excerpt && (
              <p className="mt-6 text-xl leading-relaxed text-[var(--color-ink-soft)] text-pretty">
                {excerpt}
              </p>
            )}

            <article className="mt-10 pt-10 border-t border-[var(--color-line)]">
              <Markdown content={body} />
            </article>

            <CommentsSection locale={locale} postSlug={post.slug} />
          </div>
        </div>
      </Section>
    </>
  );
}
