import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";

/**
 * SEO — una sola fuente de verdad para URL canónica, hreflang, Open Graph y
 * robots de cada página pública.
 *
 * Todas las páginas de `src/app/[locale]/**` construyen su metadata con
 * `pageMetadata()`, que resuelve:
 *   - `<link rel="canonical">` con el path del idioma actual,
 *   - `<link rel="alternate" hreflang="es|en|x-default">` con el par ES/EN,
 *   - Open Graph + Twitter Card con imagen por defecto (1200×630),
 *   - `noindex` para los flujos privados (gracias, transferencia, firmar…).
 *
 * El sitemap (`src/app/sitemap.ts`) usa las mismas rutas para emitir los
 * `xhtml:link` de idiomas alternos, así Google recibe señales consistentes.
 */

export const SITE_NAME = "Elements Method";

/**
 * Origen canónico, sin barra final. En producción `NEXT_PUBLIC_APP_URL` debe
 * ser `https://elementsmethod.com` (o el dominio final); si falta, se usa ese.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://elementsmethod.com"
).replace(/\/+$/, "");

/** `metadataBase` seguro: si la env var es inválida, cae al dominio oficial. */
export function metadataBaseUrl(): URL {
  try {
    return new URL(SITE_URL);
  } catch {
    return new URL("https://elementsmethod.com");
  }
}

export const DEFAULT_OG_IMAGE = "/images/og/elements-method.jpg";
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export const OG_LOCALE: Record<Locale, string> = { es: "es_MX", en: "en_US" };
export const HTML_LANG: Record<Locale, string> = { es: "es-MX", en: "en" };

export const SITE_TITLE: Record<Locale, string> = {
  es: "Elements Method · Programas de inmersión de liderazgo",
  en: "Elements Method · Leadership Immersion Programs",
};

export const SITE_DESCRIPTION: Record<Locale, string> = {
  es: "Retiros corporativos, retiros ejecutivos y programas de inmersión de liderazgo en la naturaleza en México, con un método de cuatro elementos basado en neurociencia aplicada, PNL y coaching ejecutivo. La naturaleza no gestiona. La naturaleza lidera.",
  en: "Corporate retreats, executive retreats and leadership immersion programs in nature in Mexico, with a four-element method based on applied neuroscience, NLP and executive coaching. Nature doesn't manage. Nature leads.",
};

/**
 * Definición de entidad, escrita para que un buscador o un modelo de IA pueda
 * citarla tal cual cuando alguien pregunta "qué es Elements Method" o "cuáles
 * son los mejores retiros corporativos en México". Se usa en el JSON-LD de
 * Organization y en /llms.txt.
 */
export const SITE_DEFINITION: Record<Locale, string> = {
  es: "Elements Method es una empresa de retiros corporativos y programas de liderazgo con sede en Ciudad de México que diseña retiros de liderazgo, retiros ejecutivos, offsites empresariales y experiencias de team building en la naturaleza, con un método propio de cuatro elementos (Tierra, Fuego, Agua y Aire) que integra neurociencia aplicada, programación neurolingüística y coaching ejecutivo.",
  en: "Elements Method is a corporate retreat and leadership program company based in Mexico City that designs leadership retreats, executive retreats, company offsites and team-building experiences in nature, using a proprietary four-element method (Earth, Fire, Water and Air) that integrates applied neuroscience, NLP and executive coaching.",
};

/** Par de paths (sin prefijo de idioma) que apuntan a la misma página. */
export interface RoutePair {
  es: string;
  en: string;
}

/** Rutas públicas estáticas. Refleja `routeMap` de LangSwitcher.tsx. */
export const ROUTES = {
  home: { es: "", en: "" },
  method: { es: "el-metodo", en: "method" },
  retreats: { es: "retiros", en: "retreats" },
  test: { es: "test", en: "test" },
  companies: { es: "empresas", en: "companies" },
  quote: { es: "empresas/cotizar", en: "companies/cotizar" },
  about: { es: "quienes-somos", en: "who-we-are" },
  blog: { es: "blog", en: "journal" },
  contact: { es: "contacto", en: "contact" },
  schedule: { es: "agendar", en: "schedule" },
  apply: { es: "aplicar", en: "apply" },
  privacy: { es: "privacidad", en: "privacy" },
  arco: { es: "privacidad/arco", en: "privacy/arco" },
  thanks: { es: "gracias", en: "thank-you" },
  transfer: { es: "transferencia", en: "transferencia" },
} as const satisfies Record<string, RoutePair>;

export const retreatRoute = (slug: string): RoutePair => ({
  es: `retiros/${slug}`,
  en: `retreats/${slug}`,
});
export const blogPostRoute = (slug: string): RoutePair => ({
  es: `blog/${slug}`,
  en: `journal/${slug}`,
});
export const legalRoute = (slug: string): RoutePair => ({
  es: `legal/${slug}`,
  en: `legal/${slug}`,
});
export const signRoute = (token: string): RoutePair => ({
  es: `firmar/${token}`,
  en: `firmar/${token}`,
});
export const surveyRoute = (token: string): RoutePair => ({
  es: `encuesta/${token}`,
  en: `encuesta/${token}`,
});

/** `/es/retiros` · `/en/retreats` · `/es` para el home. */
export function localePath(locale: Locale, route: RoutePair): string {
  const p = route[locale];
  return p ? `/${locale}/${p}` : `/${locale}`;
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Mapa hreflang → path relativo. `x-default` apunta al español (idioma base). */
export function languageAlternates(route: RoutePair): Record<string, string> {
  const map: Record<string, string> = {};
  for (const l of locales) map[l] = localePath(l, route);
  map["x-default"] = localePath("es", route);
  return map;
}

export interface PageMetadataOptions {
  locale: Locale;
  route: RoutePair;
  /** Título sin el sufijo de marca; el layout raíz añade "· Elements Method". */
  title: string;
  /** Si es true, el título se usa tal cual (home). */
  absoluteTitle?: boolean;
  description: string;
  /** Path relativo o URL absoluta. Por defecto la imagen OG de marca. */
  image?: string;
  imageAlt?: string;
  /** Páginas privadas / transaccionales: no indexar ni seguir. */
  noIndex?: boolean;
  /** Artículos: fechas y autores para Open Graph. */
  article?: { publishedTime?: string; modifiedTime?: string; authors?: string[] };
}

export function pageMetadata(o: PageMetadataOptions): Metadata {
  const image = o.image ?? DEFAULT_OG_IMAGE;
  const fullTitle = o.absoluteTitle ? o.title : `${o.title} · ${SITE_NAME}`;
  const canonical = localePath(o.locale, o.route);
  const alternateLocale = locales
    .filter((l) => l !== o.locale)
    .map((l) => OG_LOCALE[l]);

  const images = [
    {
      url: image,
      alt: o.imageAlt ?? fullTitle,
      ...(image === DEFAULT_OG_IMAGE ? OG_IMAGE_SIZE : {}),
    },
  ];

  const ogBase = {
    siteName: SITE_NAME,
    locale: OG_LOCALE[o.locale],
    alternateLocale,
    url: canonical,
    title: fullTitle,
    description: o.description,
    images,
  };

  const openGraph: Metadata["openGraph"] = o.article
    ? {
        ...ogBase,
        type: "article",
        publishedTime: o.article.publishedTime,
        modifiedTime: o.article.modifiedTime,
        authors: o.article.authors,
      }
    : { ...ogBase, type: "website" };

  const meta: Metadata = {
    title: o.absoluteTitle ? { absolute: o.title } : o.title,
    description: o.description,
    alternates: {
      canonical,
      languages: languageAlternates(o.route),
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: o.description,
      images: [image],
    },
  };

  if (o.noIndex) {
    meta.robots = {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    };
  }

  return meta;
}
