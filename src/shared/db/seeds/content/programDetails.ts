import { eq } from "drizzle-orm";

import { programDetails as programDetailsData } from "@/data/content";
import { db } from "../../client";
import {
  programDetails,
  programStats,
  programIncludesBlocks,
  programWhoForItems,
  programCadence,
} from "../../schema";

/**
 * Seeds the `program_details` table (and its child tables) from the static
 * `programDetails` (ProgramDetail[]) source in content.ts.
 *
 * Idempotent strategy:
 *  - Parent (`program_details`) has a natural unique key (`slug`), so each row
 *    is upserted via `onConflictDoUpdate`, returning the persisted id.
 *  - Child collections (`program_stats`, `program_includes_blocks`,
 *    `program_whofor_items`, `program_cadence`) have no natural unique key, so
 *    for each parent we DELETE the existing child rows by `programId` and then
 *    INSERT fresh. Re-running the seed is therefore safe.
 *
 * `comparativaEs/En` and the `closing*` fields live on the parent row.
 * `cadenceHeading*` also live on the parent; cadence child rows are inserted
 * only when the static record actually declares a `cadence` array.
 *
 * `sortOrder` is set to the array index for every collection so the query layer
 * can read the rows back in the original editorial order.
 */
export async function seedProgramDetails(): Promise<void> {
  for (const [index, program] of programDetailsData.entries()) {
    // ── Parent: upsert by unique slug, capture the persisted id ────────────
    const parentValues: typeof programDetails.$inferInsert = {
      slug: program.slug,
      url: program.url,
      headerKickerEs: program.headerKickerEs,
      headerKickerEn: program.headerKickerEn,
      nameEs: program.nameEs,
      nameEn: program.nameEn,
      taglineEs: program.taglineEs,
      taglineEn: program.taglineEn,
      includesHeadingEs: program.includesHeadingEs,
      includesHeadingEn: program.includesHeadingEn,
      whoForHeadingEs: program.whoForHeadingEs,
      whoForHeadingEn: program.whoForHeadingEn,
      cadenceHeadingEs: program.cadenceHeadingEs ?? null,
      cadenceHeadingEn: program.cadenceHeadingEn ?? null,
      comparativaEs: program.comparativaEs ?? null,
      comparativaEn: program.comparativaEn ?? null,
      closingNoteEs: program.closingNoteEs ?? null,
      closingNoteEn: program.closingNoteEn ?? null,
      closingTitleEs: program.closingTitleEs ?? null,
      closingTitleEn: program.closingTitleEn ?? null,
      closingBodyEs: program.closingBodyEs ?? null,
      closingBodyEn: program.closingBodyEn ?? null,
      ctaEs: program.ctaEs,
      ctaEn: program.ctaEn,
      primaryElement: program.primaryElement,
      sortOrder: index,
      active: true,
      updatedAt: new Date(),
    };

    const [parent] = await db
      .insert(programDetails)
      .values(parentValues)
      .onConflictDoUpdate({
        target: programDetails.slug,
        set: {
          url: parentValues.url,
          headerKickerEs: parentValues.headerKickerEs,
          headerKickerEn: parentValues.headerKickerEn,
          nameEs: parentValues.nameEs,
          nameEn: parentValues.nameEn,
          taglineEs: parentValues.taglineEs,
          taglineEn: parentValues.taglineEn,
          includesHeadingEs: parentValues.includesHeadingEs,
          includesHeadingEn: parentValues.includesHeadingEn,
          whoForHeadingEs: parentValues.whoForHeadingEs,
          whoForHeadingEn: parentValues.whoForHeadingEn,
          cadenceHeadingEs: parentValues.cadenceHeadingEs ?? null,
          cadenceHeadingEn: parentValues.cadenceHeadingEn ?? null,
          comparativaEs: parentValues.comparativaEs ?? null,
          comparativaEn: parentValues.comparativaEn ?? null,
          closingNoteEs: parentValues.closingNoteEs ?? null,
          closingNoteEn: parentValues.closingNoteEn ?? null,
          closingTitleEs: parentValues.closingTitleEs ?? null,
          closingTitleEn: parentValues.closingTitleEn ?? null,
          closingBodyEs: parentValues.closingBodyEs ?? null,
          closingBodyEn: parentValues.closingBodyEn ?? null,
          ctaEs: parentValues.ctaEs,
          ctaEn: parentValues.ctaEn,
          primaryElement: parentValues.primaryElement,
          sortOrder: parentValues.sortOrder,
          active: parentValues.active,
          updatedAt: new Date(),
        },
      })
      .returning({ id: programDetails.id });

    const programId = parent.id;

    // ── Children: wipe by parentId, then insert fresh in editorial order ───
    await db.delete(programStats).where(eq(programStats.programId, programId));
    await db
      .delete(programIncludesBlocks)
      .where(eq(programIncludesBlocks.programId, programId));
    await db
      .delete(programWhoForItems)
      .where(eq(programWhoForItems.programId, programId));
    await db
      .delete(programCadence)
      .where(eq(programCadence.programId, programId));

    // program_stats
    const statValues: (typeof programStats.$inferInsert)[] = program.stats.map(
      (stat, statIndex) => ({
        programId,
        value: stat.value,
        labelEs: stat.labelEs,
        labelEn: stat.labelEn,
        sortOrder: statIndex,
      }),
    );
    if (statValues.length > 0) {
      await db.insert(programStats).values(statValues);
    }

    // program_includes_blocks
    const includesValues: (typeof programIncludesBlocks.$inferInsert)[] =
      program.includesBlocks.map((block, blockIndex) => ({
        programId,
        titleEs: block.titleEs,
        titleEn: block.titleEn,
        bodyEs: block.bodyEs,
        bodyEn: block.bodyEn,
        sortOrder: blockIndex,
      }));
    if (includesValues.length > 0) {
      await db.insert(programIncludesBlocks).values(includesValues);
    }

    // program_whofor_items
    const whoForValues: (typeof programWhoForItems.$inferInsert)[] =
      program.whoForItems.map((item, itemIndex) => ({
        programId,
        titleEs: item.titleEs,
        titleEn: item.titleEn,
        bodyEs: item.bodyEs,
        bodyEn: item.bodyEn,
        sortOrder: itemIndex,
      }));
    if (whoForValues.length > 0) {
      await db.insert(programWhoForItems).values(whoForValues);
    }

    // program_cadence — only when the static record declares a cadence array
    if (program.cadence && program.cadence.length > 0) {
      const cadenceValues: (typeof programCadence.$inferInsert)[] =
        program.cadence.map((entry, entryIndex) => ({
          programId,
          label: entry.label,
          titleEs: entry.titleEs,
          titleEn: entry.titleEn,
          bulletsEs: entry.bulletsEs,
          bulletsEn: entry.bulletsEn,
          sortOrder: entryIndex,
        }));
      await db.insert(programCadence).values(cadenceValues);
    }
  }

  console.log(`  ✓ ${programDetailsData.length} programDetails seeded`);
}
