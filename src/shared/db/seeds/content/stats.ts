import { stats } from "@/data/content";
import { db } from "../../client";
import { statsContent } from "../../schema";

/**
 * Seeds the `stats_content` table from the static `stats` (StatInfo[]) source.
 *
 * `stats_content` has no natural unique key, so the idempotent strategy is:
 * DELETE all existing rows, then INSERT fresh. Re-running is safe.
 *
 * `sortOrder` is set to the array index so the query layer can read the rows
 * back in the original editorial order (ordered by sortOrder, active only).
 */
export async function seedStats(): Promise<void> {
  const values: (typeof statsContent.$inferInsert)[] = stats.map(
    (stat, index) => ({
      metricEs: stat.metricEs,
      metricEn: stat.metricEn,
      labelEs: stat.labelEs,
      labelEn: stat.labelEn,
      source: stat.source,
      url: stat.url,
      sortOrder: index,
      active: true,
    }),
  );

  // Idempotent reset: no unique column to conflict on, so wipe then re-insert.
  await db.delete(statsContent);

  if (values.length > 0) {
    await db.insert(statsContent).values(values);
  }

  console.log(`  ✓ ${values.length} stats seeded`);
}
