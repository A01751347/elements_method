/**
 * Seed: Impact circles editorial content.
 *
 * Source: src/data/content.ts → `impactCircles` (ImpactCircleInfo[])
 * Target: impact_circles_content
 *   (level / whoEs / whoEn / titleEs / titleEn / bodyEs / bodyEn)
 *
 * `impact_circles_content` has no natural unique key, so the idempotent
 * strategy is: DELETE all existing rows, then INSERT fresh. Re-running the
 * seed is therefore safe.
 *
 * `sortOrder` is set to the array index so the query layer can read the rows
 * back into ImpactCircleInfo[] in the original editorial order (ordered by
 * sortOrder).
 */
import { impactCircles } from "@/data/content";
import { db } from "../../client";
import { impactCirclesContent } from "../../schema";

type NewImpactCircle = typeof impactCirclesContent.$inferInsert;

export async function seedImpactCircles(): Promise<void> {
  const rows: NewImpactCircle[] = impactCircles.map((circle, index) => ({
    level: circle.level,
    whoEs: circle.whoEs,
    whoEn: circle.whoEn,
    titleEs: circle.titleEs,
    titleEn: circle.titleEn,
    bodyEs: circle.bodyEs,
    bodyEn: circle.bodyEn,
    sortOrder: index,
  }));

  // No natural unique key → delete-all then insert-fresh for idempotency.
  await db.delete(impactCirclesContent);
  if (rows.length > 0) {
    await db.insert(impactCirclesContent).values(rows);
  }

  console.log(`  ✓ ${rows.length} impactCircles seeded`);
}
