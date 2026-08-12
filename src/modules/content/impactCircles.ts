import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { impactCirclesContent } from "@/shared/db/schema";
import type { ImpactCircleInfo } from "@/data/content";
import { safeRead } from "./safe";

/**
 * Read query: impact circles — the five expanding circles of impact.
 *
 * Source table: impact_circles_content (impactCirclesContent)
 * Returns: ImpactCircleInfo[] ordered by sortOrder.
 *
 * Drop-in replacement for the static `impactCircles` export from
 * `@/data/content`: a page can do `const circles = await getImpactCircles()`
 * and pass the result straight to <SeasonsRhythm> unchanged.
 *
 * All seven fields (level / whoEs / whoEn / titleEs / titleEn / bodyEs / bodyEn)
 * are plain notNull text columns, mapped directly to the canonical interface.
 *
 * The target table has no `active` column, so no active filter is applied.
 * Empty DB returns [] (never throws).
 */
export async function getImpactCircles(): Promise<ImpactCircleInfo[]> {
  return safeRead([], async () => {
    const rows = await db
      .select()
      .from(impactCirclesContent)
      .orderBy(asc(impactCirclesContent.sortOrder));

    return rows.map(
      (r): ImpactCircleInfo => ({
        level: r.level,
        whoEs: r.whoEs,
        whoEn: r.whoEn,
        titleEs: r.titleEs,
        titleEn: r.titleEn,
        bodyEs: r.bodyEs,
        bodyEn: r.bodyEn,
      }),
    );
  });
}
