import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { products } from "@/shared/db/schema";
import type { PathInfo } from "@/data/content";

/** First sentence (or first 160 chars). */
function firstSentence(text: string): string {
  const dot = text.indexOf(". ");
  if (dot > 0 && dot < 160) return text.slice(0, dot + 1);
  return text.length > 160 ? text.slice(0, 157).trimEnd() + "…" : text;
}

/** Splits "A · B · C" into bullet items. */
function splitIncludes(text: string | null): string[] {
  if (!text) return [];
  return text
    .split(/[·•|]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

const TAGS: Record<string, { es: string; en: string }> = {
  raices: { es: "El Camino · Grupal", en: "The Journey · Group" },
  corriente: { es: "Intensivo · Grupal", en: "Intensive · Group" },
  fuente: { es: "Inmersión Total · Retiro 3 días", en: "Full Immersion · 3-day Retreat" },
};

const HEADLINES: Record<string, { es: string; en: string }> = {
  raices: {
    es: "Encuentra tu fundamento. Lidera desde tus profundidades.",
    en: "Find your foundation. Lead from your depths.",
  },
  corriente: {
    es: "Doble la inmersión. Doble el momentum.",
    en: "Double the immersion. Double the momentum.",
  },
  fuente: {
    es: "La transformación más completa.",
    en: "The most complete transformation.",
  },
};

const CTAS: Record<string, { es: string; en: string }> = {
  raices: { es: "Comenzar Raíces", en: "Begin Roots" },
  corriente: { es: "Comenzar Corriente", en: "Begin Current" },
  fuente: { es: "Comenzar Fuente", en: "Begin Source" },
};

/**
 * Returns the 3 caminos (Roots, Current, Source) in the shape PathsPreview expects.
 */
export async function getPaths(): Promise<PathInfo[]> {
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.type, "camino"), eq(products.active, true)))
    .orderBy(asc(products.sortOrder));

  return rows.map((r): PathInfo => {
    const tag = TAGS[r.slug] ?? { es: "", en: "" };
    const headline = HEADLINES[r.slug] ?? { es: "", en: "" };
    const cta = CTAS[r.slug] ?? { es: "Solicitar información", en: "Request information" };

    return {
      slug: r.slug,
      nameEs: r.nameEs,
      nameEn: r.nameEn ?? r.nameEs,
      tagEs: tag.es,
      tagEn: tag.en,
      headlineEs: headline.es,
      headlineEn: headline.en,
      shortEs: firstSentence(r.descriptionEs),
      shortEn: firstSentence(r.descriptionEn ?? r.descriptionEs),
      longEs: r.descriptionEs,
      longEn: r.descriptionEn ?? r.descriptionEs,
      includesEs: splitIncludes(r.includesEs),
      includesEn: splitIncludes(r.includesEn ?? r.includesEs),
      modalityEs: r.modality ?? "",
      modalityEn: r.modality ?? "",
      durationEs: r.duration ?? "",
      durationEn: r.duration ?? "",
      capacityEs: r.modality ?? "",
      capacityEn: r.modality ?? "",
      ctaEs: cta.es,
      ctaEn: cta.en,
    };
  });
}
