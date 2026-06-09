import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { products } from "@/shared/db/schema";
import type { PathInfo } from "@/data/content";

/** First sentence (or first chunk before " · "). Used to derive a short tagline. */
function firstSentence(text: string): string {
  const dot = text.indexOf(". ");
  if (dot > 0 && dot < 160) return text.slice(0, dot + 1);
  return text.length > 160 ? text.slice(0, 157).trimEnd() + "…" : text;
}

/** Splits an "includes" string ( "A · B · C") into bullet items. */
function splitIncludes(text: string | null): string[] {
  if (!text) return [];
  return text
    .split(/[·•|]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Returns the 3 caminos (Roots, Current, Source) in the shape PathsPreview expects.
 * Compatible with the static PathInfo type so the section component doesn't change shape.
 */
export async function getPaths(): Promise<PathInfo[]> {
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.type, "camino"), eq(products.active, true)))
    .orderBy(asc(products.sortOrder));

  return rows.map((r): PathInfo => ({
    slug: r.slug,
    nameEs: r.nameEs,
    nameEn: r.nameEn ?? r.nameEs,
    tagEs: "",
    tagEn: "",
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
    priceMxn: Number(r.priceMxn) || null,
    priceUsd: r.priceUsd ? Number(r.priceUsd) : null,
  }));
}
