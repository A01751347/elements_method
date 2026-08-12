import { isLocale } from "@/i18n/config";
import { getBlogPosts } from "@/modules/content/blog";

export const runtime = "nodejs";
export const revalidate = 300;

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://elementsmethod.com";

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** GET /{locale}/blog/rss.xml → RSS 2.0 feed of published posts. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const lang = isLocale(locale) ? locale : "es";
  const posts = await getBlogPosts();
  const segment = lang === "es" ? "blog" : "journal";
  const title =
    lang === "es" ? "Elements Method · Artículos" : "Elements Method · Articles";

  const items = posts
    .map((p) => {
      const t = lang === "es" ? p.titleEs : p.titleEn;
      const desc = lang === "es" ? p.excerptEs : p.excerptEn;
      const link = `${BASE}/${lang}/${segment}/${p.slug}`;
      const date = p.publishedAt
        ? new Date(p.publishedAt).toUTCString()
        : new Date().toUTCString();
      return `    <item>
      <title>${xmlEscape(t)}</title>
      <link>${xmlEscape(link)}</link>
      <guid>${xmlEscape(link)}</guid>
      <description>${xmlEscape(desc)}</description>
      <pubDate>${date}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xmlEscape(title)}</title>
    <link>${BASE}/${lang}/${segment}</link>
    <description>Elements Method</description>
    <language>${lang}</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
