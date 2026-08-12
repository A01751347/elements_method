import { lexiconEs, lexiconEn } from "@/data/content";
import { db } from "../../client";
import { lexiconContent } from "../../schema";

/**
 * Seeds the `lexicon_content` table from the static `lexiconEs` / `lexiconEn`
 * sources (parallel string arrays, matched by index).
 *
 * `lexicon_content` has no natural unique key, so the idempotent strategy is:
 * DELETE all existing rows, then INSERT fresh. Re-running is safe.
 *
 * `sortOrder` is set to the array index so the query layer (getLexicon) can
 * read the rows back in the original editorial order (ordered by sortOrder):
 * termEs -> es[], termEn -> en[].
 */
export async function seedLexicon(): Promise<void> {
  const values: (typeof lexiconContent.$inferInsert)[] = lexiconEs.map(
    (termEs, index) => ({
      termEs,
      termEn: lexiconEn[index] ?? termEs,
      sortOrder: index,
    }),
  );

  // Idempotent reset: no unique column to conflict on, so wipe then re-insert.
  await db.delete(lexiconContent);

  if (values.length > 0) {
    await db.insert(lexiconContent).values(values);
  }

  console.log(`  ✓ ${values.length} lexicon seeded`);
}
