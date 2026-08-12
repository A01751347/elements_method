/**
 * Seed: process steps — the Disconnection Protocol.
 *
 * Source: src/data/content.ts → `processSteps` (ProcessStep[])
 * Target: process_steps_content (processStepsContent)
 *
 * The target table has NO natural unique key, so the idempotent strategy is:
 * delete all existing rows, then insert fresh. Re-running the seed is safe.
 * sortOrder is set to the array index so display order is preserved and the
 * query layer can read the rows back ordered by sortOrder.
 */

import { processSteps } from "@/data/content";
import { db } from "../../client";
import { processStepsContent } from "../../schema";

type ProcessStepInsert = typeof processStepsContent.$inferInsert;

export async function seedProcessSteps(): Promise<void> {
  const rows: ProcessStepInsert[] = processSteps.map((step, index) => ({
    n: step.n,
    titleEs: step.titleEs,
    titleEn: step.titleEn,
    durationEs: step.durationEs,
    durationEn: step.durationEn,
    bodyEs: step.bodyEs,
    bodyEn: step.bodyEn,
    sortOrder: index,
  }));

  // No natural unique key → delete all, then insert fresh (idempotent).
  await db.delete(processStepsContent);

  if (rows.length > 0) {
    await db.insert(processStepsContent).values(rows);
  }

  console.log(`  ✓ ${rows.length} processSteps seeded`);
}
