/**
 * Seed: modality axes (Elements Method modality map).
 *
 * Source: src/data/content.ts → `modalityAxes` (ModalityAxis[])
 * Target: modality_axes_content
 *
 * Idempotent: `modalityAxesContent` has a natural unique key (`slug`), so we
 * upsert via onConflictDoUpdate. sortOrder is the array index to preserve the
 * editorial display order for the query layer (ordered by sortOrder).
 */
import { modalityAxes } from "@/data/content";
import type { ModalityAxis } from "@/data/content";

import { db } from "../../client";
import { modalityAxesContent } from "../../schema";

type ModalityAxisInsert = typeof modalityAxesContent.$inferInsert;

export async function seedModalityAxes(): Promise<void> {
  const rows: ModalityAxisInsert[] = modalityAxes.map(
    (axis: ModalityAxis, index: number) => ({
      slug: axis.slug,
      nameEs: axis.nameEs,
      nameEn: axis.nameEn,
      taglineEs: axis.taglineEs,
      taglineEn: axis.taglineEn,
      bodyEs: axis.bodyEs,
      bodyEn: axis.bodyEn,
      modalitiesEs: axis.modalitiesEs,
      modalitiesEn: axis.modalitiesEn,
      primaryElement: axis.primaryElement,
      sortOrder: index,
    }),
  );

  for (const row of rows) {
    await db
      .insert(modalityAxesContent)
      .values(row)
      .onConflictDoUpdate({
        target: modalityAxesContent.slug,
        set: {
          nameEs: row.nameEs,
          nameEn: row.nameEn,
          taglineEs: row.taglineEs,
          taglineEn: row.taglineEn,
          bodyEs: row.bodyEs,
          bodyEn: row.bodyEn,
          modalitiesEs: row.modalitiesEs,
          modalitiesEn: row.modalitiesEn,
          primaryElement: row.primaryElement,
          sortOrder: row.sortOrder,
          updatedAt: new Date(),
        },
      });
  }

  console.log(`  ✓ ${rows.length} modalityAxes seeded`);
}
