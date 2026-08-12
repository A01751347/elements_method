import { paths } from "@/data/content";
import { db } from "../../client";
import { pathsContent } from "../../schema";

/**
 * Seeds the `paths_content` table from the static `paths` (PathInfo[]) source.
 *
 * Idempotent: `paths_content` has a natural unique key (`slug`), so each row is
 * upserted via `onConflictDoUpdate`. `sortOrder` is set to the array index so
 * the display order defined in content.ts is preserved. Re-running is safe.
 */
export async function seedPaths(): Promise<void> {
  const values: (typeof pathsContent.$inferInsert)[] = paths.map(
    (path, index) => ({
      slug: path.slug,
      nameEs: path.nameEs,
      nameEn: path.nameEn,
      tagEs: path.tagEs,
      tagEn: path.tagEn,
      headlineEs: path.headlineEs,
      headlineEn: path.headlineEn,
      shortEs: path.shortEs,
      shortEn: path.shortEn,
      longEs: path.longEs,
      longEn: path.longEn,
      includesEs: path.includesEs,
      includesEn: path.includesEn,
      modalityEs: path.modalityEs,
      modalityEn: path.modalityEn,
      durationEs: path.durationEs,
      durationEn: path.durationEn,
      capacityEs: path.capacityEs,
      capacityEn: path.capacityEn,
      ctaEs: path.ctaEs,
      ctaEn: path.ctaEn,
      sortOrder: index,
      active: true,
      updatedAt: new Date(),
    }),
  );

  for (const value of values) {
    await db
      .insert(pathsContent)
      .values(value)
      .onConflictDoUpdate({
        target: pathsContent.slug,
        set: {
          nameEs: value.nameEs,
          nameEn: value.nameEn,
          tagEs: value.tagEs,
          tagEn: value.tagEn,
          headlineEs: value.headlineEs,
          headlineEn: value.headlineEn,
          shortEs: value.shortEs,
          shortEn: value.shortEn,
          longEs: value.longEs,
          longEn: value.longEn,
          includesEs: value.includesEs,
          includesEn: value.includesEn,
          modalityEs: value.modalityEs,
          modalityEn: value.modalityEn,
          durationEs: value.durationEs,
          durationEn: value.durationEn,
          capacityEs: value.capacityEs,
          capacityEn: value.capacityEn,
          ctaEs: value.ctaEs,
          ctaEn: value.ctaEn,
          sortOrder: value.sortOrder,
          active: value.active,
          updatedAt: new Date(),
        },
      });
  }

  console.log(`  ✓ ${values.length} paths seeded`);
}
