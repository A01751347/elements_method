/**
 * Seed: Elemental Shadow Profile editorial content.
 *
 * Source: src/data/content.ts → `shadowProfile` (ShadowProfileRow[])
 * Target: shadow_profile_content
 *   (element / bestEs / bestEn / stressEs / stressEn / giftEs / giftEn /
 *    shadowEs / shadowEn)
 *
 * `shadow_profile_content` has no natural unique key, so the idempotent
 * strategy is: DELETE all existing rows, then INSERT fresh with
 * sortOrder = array index. Re-running the seed is therefore safe and
 * preserves the original editorial display order.
 *
 * The query layer reads these back into ShadowProfileRow[], ordered by
 * sortOrder — exactly the shape the shadow-profile table consumes today.
 */
import { shadowProfile } from "@/data/content";
import { db } from "../../client";
import { shadowProfileContent } from "../../schema";

type NewShadowProfile = typeof shadowProfileContent.$inferInsert;

export async function seedShadowProfile(): Promise<void> {
  const rows: NewShadowProfile[] = shadowProfile.map((row, index) => ({
    element: row.element,
    bestEs: row.bestEs,
    bestEn: row.bestEn,
    stressEs: row.stressEs,
    stressEn: row.stressEn,
    giftEs: row.giftEs,
    giftEn: row.giftEn,
    shadowEs: row.shadowEs,
    shadowEn: row.shadowEn,
    sortOrder: index,
  }));

  // No natural unique key → delete-all then insert-fresh for idempotency.
  await db.delete(shadowProfileContent);
  if (rows.length > 0) {
    await db.insert(shadowProfileContent).values(rows);
  }

  console.log(`  ✓ ${rows.length} shadowProfile seeded`);
}
