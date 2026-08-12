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

  return (
    <>
      <Section spacing="default">
        <Container className="max-w-3xl">
          <Link
            href={`/${locale}/${locale === "es" ? "blog" : "journal"}`}
            className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {locale === "es" ? "Todos los artículos" : "All articles"}
          </Link>

          <h1 className="display-1 text-balance mb-6">{title}</h1>
          <div className="text-sm text-[var(--color-muted)] mb-10">
            {post.author ?? "Elements Method"}
            {post.publishedAt &&
              ` · ${new Date(post.publishedAt).toLocaleDateString(
                locale === "es" ? "es-MX" : "en-US",
                { year: "numeric", month: "long", day: "numeric" },
              )}`}
          </div>

          {post.coverImageUrl && (
            <div className="relative aspect-[16/9] mb-12 overflow-hidden">
              <Image
                src={post.coverImageUrl}
                alt=""
                fill
                sizes="(min-width:768px) 768px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          )}

          <article>
            <Markdown content={body} />
          </article>

          <CommentsSection locale={locale} postSlug={post.slug} />
        </Container>
      </Section>
    </>
  );
}
