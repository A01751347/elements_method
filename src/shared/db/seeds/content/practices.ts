import { practices } from "@/data/content";

import { db } from "../../client";
import { practicesContent } from "../../schema";

type NewPractice = typeof practicesContent.$inferInsert;

/**
 * Seeds the `practices_content` table from the static `practices` array
 * (PracticeInfo[]) in @/data/content.
 *
 * The table has no natural unique key, so the idempotent strategy is
 * DELETE-all-then-INSERT: re-running the seed is safe and preserves the
 * source array order via sortOrder = array index.
 */
export async function seedPractices(): Promise<void> {
  const rows: NewPractice[] = practices.map((practice, index) => ({
    iconName: practice.iconName,
    titleEs: practice.titleEs,
    titleEn: practice.titleEn,
    bodyEs: practice.bodyEs,
    bodyEn: practice.bodyEn,
    durationEs: practice.durationEs,
    durationEn: practice.durationEn,
    element: practice.element,
    sortOrder: index,
    active: true,
  }));

  // No natural unique column → wipe and re-insert to stay idempotent.
  await db.delete(practicesContent);

  if (rows.length > 0) {
    await db.insert(practicesContent).values(rows);
  }

  console.log(`  ✓ ${rows.length} practices seeded`);
}
