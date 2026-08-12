import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { statsContent } from "@/shared/db/schema";
import type { StatInfo } from "@/data/content";
import { safeRead } from "./safe";

/**
 * Read query: stats — the evidence band (scientific statistics).
 *
 * Source table: stats_content (statsContent)
 * Returns: StatInfo[] ordered by sortOrder, active rows only.
 *
 * Drop-in replacement for the static `stats` export from `@/data/content`:
 * a page can do `const items = await getStats()` and pass the result straight
 * to <StatsBand> (or any consumer that maps over StatInfo) unchanged. The
 * returned objects are byte-for-byte compatible with the static shape — the
 * six StatInfo fields (metricEs, metricEn, labelEs, labelEn, source, url) and
 * nothing more.
 *
 * The `stats_content` table has an `active` column, so only active rows are
 * returned. Empty DB returns [] (never throws).
 */
export async function getStats(): Promise<StatInfo[]> {
  return safeRead([], async () => {
    const rows = await db
      .select()
      .from(statsContent)
      .where(eq(statsContent.active, true))
      .orderBy(asc(statsContent.sortOrder));

    return rows.map(
      (r): StatInfo => ({
        metricEs: r.metricEs,
        metricEn: r.metricEn,
        labelEs: r.labelEs,
        labelEn: r.labelEn,
        source: r.source,
        url: r.url,
      }),
    );
  });
}
