/**
 * Seed — Founders editorial content.
 *
 * Writes the co-founders (Ana Michelle, Andrés) and their social links from the
 * canonical static source (`src/data/content.ts`) into the normalized
 * `founders_content` / `founder_socials` tables.
 *
 * Idempotency strategy:
 *  - Parent (`founders_content`) is upserted by its unique `slug`, so the parent
 *    id stays stable across re-runs.
 *  - Children (`founder_socials`) have no natural unique key, so we DELETE all
 *    rows for the parent, then INSERT fresh with `sortOrder = array index`.
 *
 * Display order is preserved via `sortOrder` (the index in the static array).
 *
 * The query layer reconstructs `FounderInfo[]` from these tables:
 *  - `socials` from `founder_socials` ordered by `sortOrder`
 *  - `image` from `founders_content.imageUrl`
 *  - founders ordered by `sortOrder`
 */
import { eq } from "drizzle-orm";

import { founders } from "@/data/content";

import { db } from "../../client";
import { founderSocials, foundersContent } from "../../schema";

type FounderInsert = typeof foundersContent.$inferInsert;
type SocialInsert = typeof founderSocials.$inferInsert;

export async function seedFounders(): Promise<void> {
  for (let i = 0; i < founders.length; i++) {
    const f = founders[i];

    const values: FounderInsert = {
      slug: f.slug,
      name: f.name,
      roleEs: f.roleEs,
      roleEn: f.roleEn,
      locationEs: f.locationEs,
      locationEn: f.locationEn,
      imageUrl: f.image ?? null,
      bioEs: f.bioEs,
      bioEn: f.bioEn,
      quoteEs: f.quoteEs,
      quoteEn: f.quoteEn,
      sortOrder: i,
    };

    // Upsert the parent by its unique `slug`. `.returning()` gives us the stable
    // id so we can (re)build the child rows.
    const [row] = await db
      .insert(foundersContent)
      .values(values)
      .onConflictDoUpdate({
        target: foundersContent.slug,
        set: {
          name: values.name,
          roleEs: values.roleEs,
          roleEn: values.roleEn,
          locationEs: values.locationEs,
          locationEn: values.locationEn,
          imageUrl: values.imageUrl ?? null,
          bioEs: values.bioEs,
          bioEn: values.bioEn,
          quoteEs: values.quoteEs,
          quoteEn: values.quoteEn,
          sortOrder: values.sortOrder ?? 0,
          updatedAt: new Date(),
        },
      })
      .returning({ id: foundersContent.id });

    const founderId = row.id;

    // Rebuild children: delete all existing, then insert fresh in array order.
    await db
      .delete(founderSocials)
      .where(eq(founderSocials.founderId, founderId));

    const socials = f.socials ?? [];
    if (socials.length > 0) {
      const socialValues: SocialInsert[] = socials.map((s, j) => ({
        founderId,
        platform: s.platform,
        handle: s.handle,
        url: s.url,
        sortOrder: j,
      }));
      await db.insert(founderSocials).values(socialValues);
    }
  }

  console.log(`  ✓ ${founders.length} founders seeded`);
}
