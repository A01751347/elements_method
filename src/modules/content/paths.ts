import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { pathsContent } from "@/shared/db/schema";
import type { PathInfo } from "@/data/content";
import { safeRead } from "./safe";

/**
 * Read query: paths — the programs / caminos preview cards
 * (Fluir / Momentum / Raíz / Brújula / Oneness).
 *
 * Source table: paths_content (pathsContent)
 * Returns: PathInfo[] ordered by sortOrder, filtered to active === true.
 *
 * Drop-in replacement for the static `paths` export from `@/data/content`:
 * a page/component can do `const paths = await getPaths()` and pass the result
 * straight to <PathsPreview> / the los-caminos page unchanged.
 *
 * `includesEs` / `includesEn` are `text[]` columns and come back as `string[]`,
 * matching the PathInfo shape byte-for-byte.
 *
 * Empty DB (or no active rows) returns [] — never throws.
 */
export async function getPaths(): Promise<PathInfo[]> {
  return safeRead([], async () => {
    const rows = await db
      .select()
      .from(pathsContent)
      .where(eq(pathsContent.active, true))
      .orderBy(asc(pathsContent.sortOrder));

    return rows.map(
      (r): PathInfo => ({
        slug: r.slug,
        nameEs: r.nameEs,
        nameEn: r.nameEn,
        tagEs: r.tagEs,
        tagEn: r.tagEn,
        headlineEs: r.headlineEs,
        headlineEn: r.headlineEn,
        shortEs: r.shortEs,
        shortEn: r.shortEn,
        longEs: r.longEs,
        longEn: r.longEn,
        includesEs: r.includesEs,
        includesEn: r.includesEn,
        modalityEs: r.modalityEs,
        modalityEn: r.modalityEn,
        durationEs: r.durationEs,
        durationEn: r.durationEn,
        capacityEs: r.capacityEs,
        capacityEn: r.capacityEn,
        ctaEs: r.ctaEs,
        ctaEn: r.ctaEn,
      }),
    );
  });
}

/**
 * Read query: a single path by its stable route `slug`
 * (e.g. "raices", "corriente", "fuente").
 *
 * Returns the matching active PathInfo, or `null` when no active row exists.
 * Useful for the `[slug]` detail page. Never throws.
 */
export async function getPathBySlug(slug: string): Promise<PathInfo | null> {
  return safeRead<PathInfo | null>(null, async () => {
    const rows = await db
      .select()
      .from(pathsContent)
      .where(and(eq(pathsContent.slug, slug), eq(pathsContent.active, true)))
      .limit(1);

    const r = rows[0];
    if (!r) return null;

    return {
      slug: r.slug,
      nameEs: r.nameEs,
      nameEn: r.nameEn,
      tagEs: r.tagEs,
      tagEn: r.tagEn,
      headlineEs: r.headlineEs,
      headlineEn: r.headlineEn,
      shortEs: r.shortEs,
      shortEn: r.shortEn,
      longEs: r.longEs,
      longEn: r.longEn,
      includesEs: r.includesEs,
      includesEn: r.includesEn,
      modalityEs: r.modalityEs,
      modalityEn: r.modalityEn,
      durationEs: r.durationEs,
      durationEn: r.durationEn,
      capacityEs: r.capacityEs,
      capacityEn: r.capacityEn,
      ctaEs: r.ctaEs,
      ctaEn: r.ctaEn,
    };
  });
}
