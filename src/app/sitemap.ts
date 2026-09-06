import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getCalendarRetreats } from "@/modules/content/calendarRetreats";
import { getBlogPosts } from "@/modules/content/blog";
import { calendarRetreats as staticRetreats } from "@/data/launchData";
import { LEGAL_DOCUMENTS } from "@/data/legalDocuments";
import { SEO_LANDINGS } from "@/data/seoLandings";
import {
  ROUTES,
  retreatRoute,
  blogPostRoute,
  legalRoute,
  absoluteUrl,
  localePath,
  languageAlternates,
  type RoutePair,
} from "@/lib/seo";

/**
 * /sitemap.xml
 *
 * Cada página pública aparece una vez por idioma, y cada entrada declara sus
 * alternativas hreflang (es · en · x-default) — el formato que Google pide
 * para sitios multilingües. Se omiten los flujos privados (gracias,
 * transferencia, firmar, encuesta), que llevan `noindex`, y las rutas que solo
 * redirigen (los-caminos / paths).
 *
 * `lastModified` solo se declara cuando es real (fecha de publicación de un
 * artículo): una fecha inventada hace que Google ignore el campo.
 */
export const revalidate = 3600;

type Freq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

interface EntryOptions {
  priority: number;
  changeFrequency?: Freq;
  lastModified?: Date;
}

function entriesFor(route: RoutePair, o: EntryOptions): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    Object.entries(languageAlternates(route)).map(([k, v]) => [k, absoluteUrl(v)]),
  );
  return locales.map((locale) => ({
    url: absoluteUrl(localePath(locale, route)),
    priority: locale === "es" ? o.priority : Math.round(o.priority * 0.9 * 10) / 10,
    changeFrequency: o.changeFrequency,
    lastModified: o.lastModified,
    alternates: { languages },
  }));
}

const STATIC: { route: RoutePair; priority: number; changeFrequency: Freq }[] = [
  { route: ROUTES.home, priority: 1, changeFrequency: "weekly" },
  { route: ROUTES.retreats, priority: 0.9, changeFrequency: "weekly" },
  { route: ROUTES.method, priority: 0.9, changeFrequency: "monthly" },
  { route: ROUTES.companies, priority: 0.8, changeFrequency: "monthly" },
  { route: ROUTES.test, priority: 0.8, changeFrequency: "monthly" },
  { route: ROUTES.about, priority: 0.7, changeFrequency: "monthly" },
  { route: ROUTES.blog, priority: 0.7, changeFrequency: "weekly" },
  { route: ROUTES.quote, priority: 0.6, changeFrequency: "monthly" },
  { route: ROUTES.contact, priority: 0.5, changeFrequency: "yearly" },
  { route: ROUTES.schedule, priority: 0.4, changeFrequency: "yearly" },
  { route: ROUTES.apply, priority: 0.4, changeFrequency: "yearly" },
  { route: ROUTES.privacy, priority: 0.3, changeFrequency: "yearly" },
  { route: ROUTES.arco, priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const s of STATIC) entries.push(...entriesFor(s.route, s));

  // Landings por intención de búsqueda (retiros corporativos, ejecutivos…).
  for (const l of SEO_LANDINGS) {
    entries.push(...entriesFor(l.route, { priority: 0.8, changeFrequency: "monthly" }));
  }

  // Documentos legales: los términos de compra son el contrato de adhesión
  // (más relevante); el resto se firma post-compra pero es público.
  for (const doc of LEGAL_DOCUMENTS) {
    entries.push(
      ...entriesFor(legalRoute(doc.slug), {
        priority: doc.stage === "checkout" ? 0.3 : 0.2,
        changeFrequency: "yearly",
      }),
    );
  }

  // Dinámico: experiencias (BD, con calendario estático de respaldo) y blog.
  // Ambas lecturas se degradan a [] si la BD no responde (safeRead).
  const [dbRetreats, posts] = await Promise.all([
    getCalendarRetreats(),
    getBlogPosts(),
  ]);
  const retreats = dbRetreats.length > 0 ? dbRetreats : staticRetreats;

  for (const r of retreats) {
    entries.push(
      ...entriesFor(retreatRoute(r.slug), {
        priority: 0.8,
        changeFrequency: "weekly",
      }),
    );
  }

  for (const post of posts) {
    entries.push(
      ...entriesFor(blogPostRoute(post.slug), {
        priority: 0.6,
        changeFrequency: "monthly",
        lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
      }),
    );
  }

  return entries;
}
