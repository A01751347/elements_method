import "server-only";
import { and, asc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orders, retreats } from "@/shared/db/schema";
import { elementImages, type RetreatInfo, type ElementKey } from "@/data/content";

const ELEMENT_HUE: Record<ElementKey, string> = {
  tierra: "#C8D4C0",
  fuego: "#E8C9B0",
  agua: "#B5D0DE",
  aire: "#D2DCE4",
  // legacy `eter` key = the Núcleo (see ElementKey in @/data/content)
  eter: "#E4D6B8",
};

const EXPERIENCE_BY_ELEMENT: Record<ElementKey, { es: string; en: string }> = {
  tierra: { es: "Forest Grounding & Roots Ritual", en: "Forest Grounding & Roots Ritual" },
  fuego: { es: "Vision Ceremony", en: "Vision Ceremony" },
  agua: { es: "Riverine Reflection & Deep Listening", en: "Riverine Reflection & Deep Listening" },
  aire: { es: "Summit Perspective", en: "Summit Perspective" },
  eter: { es: "Integración en el Núcleo", en: "Integration in the Core" },
};

function isElementKey(s: string): s is ElementKey {
  return s === "tierra" || s === "fuego" || s === "agua" || s === "aire" || s === "eter";
}

/**
 * Returns upcoming active retreats with sold-seat counts.
 * Maps DB rows to RetreatInfo for RetreatsShowcase compatibility.
 */
export async function getUpcomingRetreats(
  options: { limit?: number; includePast?: boolean } = {}
): Promise<RetreatInfo[]> {
  const { limit, includePast = false } = options;

  const filters = [eq(retreats.active, true)];
  if (!includePast) {
    filters.push(gte(retreats.endDate, new Date()));
  }

  const rows = await db
    .select({
      id: retreats.id,
      nameEs: retreats.nameEs,
      nameEn: retreats.nameEn,
      startDate: retreats.startDate,
      endDate: retreats.endDate,
      location: retreats.location,
      modality: retreats.modality,
      elementsCovered: retreats.elementsCovered,
      capacity: retreats.capacity,
      imageUrl: retreats.imageUrl,
      sold: sql<number>`(
        SELECT COUNT(*)::int FROM ${orders}
        WHERE ${orders.retreatId} = ${retreats.id}
          AND ${orders.status} = 'paid'
      )`,
    })
    .from(retreats)
    .where(and(...filters))
    .orderBy(asc(retreats.startDate));

  const list = limit ? rows.slice(0, limit) : rows;

  return list.map((r): RetreatInfo => {
    const elements = (r.elementsCovered ?? []).filter(isElementKey);
    const primary = elements[0] ?? "tierra";
    const exp = EXPERIENCE_BY_ELEMENT[primary];
    return {
      id: r.id,
      nameEs: r.nameEs,
      nameEn: r.nameEn ?? r.nameEs,
      startDate: r.startDate ? r.startDate.toISOString() : null,
      endDate: r.endDate ? r.endDate.toISOString() : null,
      location: r.location,
      modalityEs: r.modality,
      modalityEn: r.modality,
      elementsCovered: elements,
      capacity: r.capacity,
      sold: Number(r.sold ?? 0),
      imageHue: ELEMENT_HUE[primary],
      image: r.imageUrl ?? elementImages[primary],
      // A single-element, full-day immersion is sold as Brújula; a multi-element
      // one is the 3-day Raíz retreat (client feedback #66/#69).
      programEs: elements.length > 1 ? "Raíz · Retiro 3 días" : "Brújula · Taller de 1 día",
      programEn: elements.length > 1 ? "Root · 3-day retreat" : "Compass · 1-day workshop",
      programSlug: elements.length > 1 ? "fuente" : "brujula",
      experienceEs: exp.es,
      experienceEn: exp.en,
    };
  });
}
