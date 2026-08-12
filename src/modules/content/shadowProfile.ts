import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { shadowProfileContent } from "@/shared/db/schema";
import type { ElementKey, ShadowProfileRow } from "@/data/content";
import { safeRead } from "./safe";

/**
 * Read query: elemental shadow profile — the "best / stress / gift / shadow"
 * table (one row per element) shown on the /el-metodo page.
 *
 * Source table: shadow_profile_content (shadowProfileContent)
 * Returns: ShadowProfileRow[] ordered by sortOrder.
 *
 * Drop-in replacement for the static `shadowProfile` export from
 * `@/data/content`: a page can do `const rows = await getShadowProfile()` and
 * pass the result straight to the shadow-profile <table> in
 * `src/app/[locale]/el-metodo/page.tsx`, which maps over
 * `.element / .bestEs / .bestEn / .stressEs / .stressEn / .giftEs / .giftEn /
 * .shadowEs / .shadowEn` and uses `row.element` to look up the matching
 * element via `elements.find((e) => e.key === row.element)`.
 *
 * The `element` DB column is plain `text` (no enum constraint), while the
 * frontend `ShadowProfileRow.element` is the `ElementKey` union. The seed only
 * ever writes valid element keys, so we narrow the string to `ElementKey` here
 * to keep the return type byte-for-byte identical to the static export.
 *
 * The target table has no `active` column, so no active filter is applied.
 * Empty DB returns [] (never throws).
 */
export async function getShadowProfile(): Promise<ShadowProfileRow[]> {
  return safeRead([], async () => {
    const rows = await db
      .select()
      .from(shadowProfileContent)
      .orderBy(asc(shadowProfileContent.sortOrder));

    return rows.map(
      (r): ShadowProfileRow => ({
        element: r.element as ElementKey,
        bestEs: r.bestEs,
        bestEn: r.bestEn,
        stressEs: r.stressEs,
        stressEn: r.stressEn,
        giftEs: r.giftEs,
        giftEn: r.giftEn,
        shadowEs: r.shadowEs,
        shadowEn: r.shadowEn,
      }),
    );
  });
}
