import "server-only";
import { and, asc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orders, retreats } from "@/shared/db/schema";
import { elementImages, type RetreatInfo, type ElementKey } from "@/data/content";

const ELEMENT_HUE: Record<ElementKey, string> = {
  tierra: "var(--color-earth-soft)",
  fuego: "var(--color-fire-soft)",
  agua: "var(--color-water-soft)",
  aire: "var(--color-air-soft)",
};

function isElementKey(s: string): s is ElementKey {
  return s === "tierra" || s === "fuego" || s === "agua" || s === "aire";
}

/**
 * Returns upcoming, active retreats with their sold-seat counts (sum of paid orders).
 * Output shape is compatible with the static RetreatInfo used by RetreatsShowcase.
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
      priceMxn: retreats.priceMxn,
      priceUsd: retreats.priceUsd,
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
    const primary = elements[0];
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
      priceMxn: Number(r.priceMxn) || 0,
      priceUsd: r.priceUsd ? Number(r.priceUsd) : null,
      capacity: r.capacity,
      sold: Number(r.sold ?? 0),
      imageHue: primary ? ELEMENT_HUE[primary] : "var(--color-paper-warm)",
      image: r.imageUrl ?? (primary ? elementImages[primary] : elementImages.tierra),
    };
  });
}
