import type { Locale } from "@/i18n/config";
import {
  hasRealContact,
  type CalendarRetreat,
  type ContactInfo,
} from "@/data/launchData";
import { isEarlyAccessActive, type Experience } from "@/data/experiences";
import type { JsonLdObject } from "@/components/seo/JsonLd";
import { SEO_LANDINGS } from "@/data/seoLandings";
import {
  SITE_NAME,
  SITE_URL,
  SITE_DEFINITION,
  DEFAULT_OG_IMAGE,
  HTML_LANG,
  ROUTES,
  absoluteUrl,
  localePath,
  retreatRoute,
  blogPostRoute,
} from "./seo";

/**
 * Datos estructurados (schema.org) que Google usa para entender la entidad
 * "Elements Method" y para los resultados enriquecidos de eventos y artículos.
 *
 *   - Organization + WebSite → en el layout de idioma (todas las páginas).
 *   - Event → cada Executive Experience / retiro del calendario.
 *   - BlogPosting → cada artículo.
 *   - BreadcrumbList → páginas de detalle.
 *
 * Validar con https://search.google.com/test/rich-results
 */

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const LOGO_URL = absoluteUrl("/images/elements/elements_logo.jpeg");

const SCHEMA = "https://schema.org";

const orgRef = () => ({ "@type": "Organization", "@id": ORG_ID, name: SITE_NAME, url: SITE_URL });

export function organizationJsonLd(
  locale: Locale,
  contact?: ContactInfo | null,
): JsonLdObject {
  const sameAs = (contact?.socialHandles ?? [])
    .map((s) => s.url)
    .filter((u) => /^https?:\/\//i.test(u));

  const telephone =
    contact && hasRealContact(contact, "phoneE164") ? contact.phoneE164 : undefined;

  return {
    "@context": SCHEMA,
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: LOGO_URL, width: 1024, height: 1024 },
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    description: SITE_DEFINITION[locale],
    slogan:
      locale === "en"
        ? "Nature doesn't manage. Nature leads."
        : "La naturaleza no gestiona. La naturaleza lidera.",
    knowsAbout:
      locale === "en"
        ? ["Corporate retreats", "Executive retreats", "Leadership retreats", "Team building", "Company offsites", "Leadership development", "Applied neuroscience", "NLP", "Executive coaching"]
        : ["Retiros corporativos", "Retiros ejecutivos", "Retiros de liderazgo", "Team building", "Offsites empresariales", "Desarrollo de liderazgo", "Neurociencia aplicada", "PNL", "Coaching ejecutivo"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: locale === "en" ? "Retreats and programs" : "Retiros y programas",
      itemListElement: SEO_LANDINGS.map((l) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: l.title[locale],
          serviceType: l.serviceType[locale],
          url: absoluteUrl(localePath(locale, l.route)),
        },
      })),
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ciudad de México",
      addressCountry: "MX",
    },
    areaServed: "MX",
    knowsLanguage: ["es", "en"],
    ...(sameAs.length ? { sameAs } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: absoluteUrl(localePath(locale, ROUTES.contact)),
      availableLanguage: ["Spanish", "English"],
      ...(telephone ? { telephone } : {}),
    },
  };
}

export function websiteJsonLd(locale: Locale): JsonLdObject {
  return {
    "@context": SCHEMA,
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: HTML_LANG[locale],
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): JsonLdObject {
  return {
    "@context": SCHEMA,
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

/** Sede → PostalAddress aproximada a partir de la etiqueta pública. */
function placeFromLabel(label: string) {
  const address: Record<string, string> = { "@type": "PostalAddress", addressCountry: "MX" };
  if (/morelos/i.test(label)) {
    address.addressRegion = "Morelos";
    if (/jiutepec/i.test(label)) address.addressLocality = "Jiutepec";
  } else if (/ciudad de m[eé]xico|mexico city|cdmx/i.test(label)) {
    address.addressLocality = "Ciudad de México";
    address.addressRegion = "Ciudad de México";
  }
  return { "@type": "Place", name: label, address };
}

const AVAILABILITY: Record<CalendarRetreat["status"], string> = {
  open: `${SCHEMA}/InStock`,
  waitlist: `${SCHEMA}/LimitedAvailability`,
  closed: `${SCHEMA}/SoldOut`,
  sold: `${SCHEMA}/SoldOut`,
};

/**
 * Event para una Executive Experience. `retreat` (fila del calendario, BD o
 * estática, mismo slug) aporta fechas de inicio/fin, sede y estado; la
 * experiencia aporta copy, imagen, precio y facilitadores.
 */
export function experienceEventJsonLd(
  experience: Experience,
  retreat: CalendarRetreat | null | undefined,
  locale: Locale,
): JsonLdObject {
  const t = (l: { es: string; en: string }) => (locale === "en" ? l.en : l.es);
  const url = absoluteUrl(localePath(locale, retreatRoute(experience.slug)));
  const startDate = retreat?.startDate ?? experience.startDateIso;
  const endDate = retreat?.endDate ?? experience.startDateIso;
  const venueLabel = retreat
    ? locale === "en"
      ? retreat.venueLabelEn
      : retreat.venueLabelEs
    : t(experience.location);
  const status = retreat?.status ?? "open";

  const offers: JsonLdObject[] = [];
  if (experience.priceMxn != null) {
    const offerBase = {
      "@type": "Offer",
      url,
      priceCurrency: "MXN",
      availability: AVAILABILITY[status],
      category: "primary",
    };
    if (experience.earlyPriceMxn != null && isEarlyAccessActive(experience)) {
      offers.push({
        ...offerBase,
        name: locale === "en" ? "Early Access" : "Acceso anticipado",
        price: experience.earlyPriceMxn,
        ...(experience.earlyDeadlineIso
          ? { priceValidUntil: experience.earlyDeadlineIso }
          : {}),
      });
    }
    offers.push({
      ...offerBase,
      name: locale === "en" ? "Regular price" : "Precio regular",
      price: experience.priceMxn,
    });
  }

  const performers = experience.facilitators
    .filter((f) => f.name)
    .map((f) => ({ "@type": "Person", name: f.name, jobTitle: t(f.role) }));

  return {
    "@context": SCHEMA,
    "@type": "Event",
    name: `${experience.title} · ${t(experience.tagline).replace(/\.\s*$/, "")}`,
    description: t(experience.lead),
    image: [absoluteUrl(experience.image)],
    url,
    startDate,
    endDate,
    eventStatus: `${SCHEMA}/EventScheduled`,
    eventAttendanceMode: `${SCHEMA}/OfflineEventAttendanceMode`,
    location: placeFromLabel(venueLabel),
    organizer: orgRef(),
    ...(performers.length ? { performer: performers } : {}),
    ...(offers.length ? { offers } : {}),
    inLanguage: "es",
    maximumAttendeeCapacity: experience.seats,
    isAccessibleForFree: false,
  };
}

/** Event genérico para un retiro del calendario sin landing propia. */
export function retreatEventJsonLd(
  retreat: CalendarRetreat,
  locale: Locale,
): JsonLdObject {
  const en = locale === "en";
  return {
    "@context": SCHEMA,
    "@type": "Event",
    name: en ? retreat.themeEn : retreat.themeEs,
    description: en ? retreat.summaryEn : retreat.summaryEs,
    image: [absoluteUrl(DEFAULT_OG_IMAGE)],
    url: absoluteUrl(localePath(locale, retreatRoute(retreat.slug))),
    startDate: retreat.startDate,
    endDate: retreat.endDate,
    eventStatus: `${SCHEMA}/EventScheduled`,
    eventAttendanceMode: `${SCHEMA}/OfflineEventAttendanceMode`,
    location: placeFromLabel(en ? retreat.venueLabelEn : retreat.venueLabelEs),
    organizer: orgRef(),
    inLanguage: "es",
    maximumAttendeeCapacity: retreat.capacity,
  };
}

export function blogPostingJsonLd(o: {
  locale: Locale;
  slug: string;
  title: string;
  description?: string | null;
  image: string;
  author: string;
  publishedAt?: Date | string | null;
  updatedAt?: Date | string | null;
}): JsonLdObject {
  const url = absoluteUrl(localePath(o.locale, blogPostRoute(o.slug)));
  const iso = (d?: Date | string | null) =>
    d ? new Date(d).toISOString() : undefined;
  const published = iso(o.publishedAt);
  const modified = iso(o.updatedAt) ?? published;

  return {
    "@context": SCHEMA,
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline: o.title,
    ...(o.description ? { description: o.description } : {}),
    image: [absoluteUrl(o.image)],
    inLanguage: HTML_LANG[o.locale],
    author: { "@type": "Person", name: o.author },
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: LOGO_URL },
    },
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
  };
}

/** FAQPage: preguntas y respuestas visibles en la página, tal cual. */
export function faqPageJsonLd(faqs: { q: string; a: string }[]): JsonLdObject {
  return {
    "@context": SCHEMA,
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Service: un tipo de retiro/programa que ofrece Elements Method. */
export function serviceJsonLd(o: {
  locale: Locale;
  name: string;
  serviceType: string;
  description: string;
  url: string;
  image?: string;
}): JsonLdObject {
  return {
    "@context": SCHEMA,
    "@type": "Service",
    "@id": `${absoluteUrl(o.url)}#service`,
    name: o.name,
    serviceType: o.serviceType,
    description: o.description,
    url: absoluteUrl(o.url),
    ...(o.image ? { image: absoluteUrl(o.image) } : {}),
    provider: orgRef(),
    areaServed: { "@type": "Country", name: "Mexico" },
    availableLanguage: ["es", "en"],
    audience: { "@type": "BusinessAudience", audienceType: "Leadership teams, executives and organizations" },
    inLanguage: HTML_LANG[o.locale],
  };
}
