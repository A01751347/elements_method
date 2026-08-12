import type { MetadataRoute } from "next";
import { getCalendarRetreats } from "@/modules/content/calendarRetreats";
import { getBlogPosts } from "@/modules/content/blog";
import { getPaths } from "@/modules/content/paths";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://elementsmethod.com";

/** Static public routes, expressed per-locale (ES canonical path, EN path). */
const STATIC_ROUTES: { es: string; en: string; priority: number }[] = [
  { es: "", en: "", priority: 1 },
  { es: "el-metodo", en: "method", priority: 0.9 },
  { es: "los-caminos", en: "paths", priority: 0.9 },
  { es: "retiros", en: "retreats", priority: 0.9 },
  { es: "empresas", en: "companies", priority: 0.8 },
  { es: "empresas/cotizar", en: "companies/cotizar", priority: 0.7 },
  { es: "quienes-somos", en: "who-we-are", priority: 0.7 },
  { es: "blog", en: "journal", priority: 0.6 },
  { es: "contacto", en: "contact", priority: 0.6 },
  { es: "agendar", en: "schedule", priority: 0.5 },
  { es: "privacidad", en: "privacy", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const r of STATIC_ROUTES) {
    entries.push({
      url: `${BASE}/es/${r.es}`.replace(/\/$/, ""),
      lastModified: now,
      changeFrequency: "weekly",
      priority: r.priority,
    });
    entries.push({
      url: `${BASE}/en/${r.en}`.replace(/\/$/, ""),
      lastModified: now,
      changeFrequency: "weekly",
      priority: r.priority * 0.9,
    });
  }

  // Dynamic: retreats, paths, blog posts (best-effort — safeRead in each query).
  const [retreats, paths, posts] = await Promise.all([
    getCalendarRetreats(),
    getPaths(),
    getBlogPosts(),
  ]);

  for (const rt of retreats) {
    entries.push({ url: `${BASE}/es/retiros/${rt.slug}`, lastModified: now, priority: 0.7 });
    entries.push({ url: `${BASE}/en/retreats/${rt.slug}`, lastModified: now, priority: 0.6 });
  }
  for (const p of paths) {
    entries.push({ url: `${BASE}/es/los-caminos/${p.slug}`, lastModified: now, priority: 0.7 });
    entries.push({ url: `${BASE}/en/paths/${p.slug}`, lastModified: now, priority: 0.6 });
  }
  for (const post of posts) {
    const last = post.publishedAt ? new Date(post.publishedAt) : now;
    entries.push({ url: `${BASE}/es/blog/${post.slug}`, lastModified: last, priority: 0.5 });
    entries.push({ url: `${BASE}/en/journal/${post.slug}`, lastModified: last, priority: 0.5 });
  }

  return entries;
}
