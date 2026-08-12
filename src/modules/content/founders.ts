import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { foundersContent, founderSocials } from "@/shared/db/schema";
import type { FounderInfo } from "@/data/content";
import { safeRead } from "./safe";

/**
 * Read query: founders — the co-founder profiles on /quienes-somos.
 *
 * Source tables:
 *   - founders_content (foundersContent) — parent profile row
 *   - founder_socials  (founderSocials)  — child social links per founder
 *
 * Returns: FounderInfo[] ordered by sortOrder. Each founder's `socials[]` is
 * reconstructed from founder_socials (rows for that founder, ordered by their
 * own sortOrder, so display order is preserved). A founder with no social rows
 * gets `socials: []`.
 *
 * Drop-in replacement for the static `founders` export from `@/data/content`:
 * `src/app/[locale]/quienes-somos/page.tsx` can do
 * `const founders = await getFounders()` and pass the result straight to the
 * existing markup unchanged — it maps over `founders`, reads
 * `.name/.roleEs/.roleEn/.locationEs/.locationEn/.bioEs/.bioEn/.quoteEs/.quoteEn/.image`
 * and iterates `.socials` (`.platform/.handle/.url`).
 *
 * Column remaps:
 *   - `image_url` (nullable text) → `image` (FounderInfo.image is a non-null
 *     string). The seed always writes a real path, so `?? ""` only guards the
 *     theoretical null case rather than surfacing it to the component.
 *
 * The foundersContent table has no `active` column, so no active filter is
 * applied. Empty DB returns [] (never throws).
 */
export async function getFounders(): Promise<FounderInfo[]> {
  return safeRead([], async () => {
    const [founderRows, socialRows] = await Promise.all([
      db.select().from(foundersContent).orderBy(asc(foundersContent.sortOrder)),
      db.select().from(founderSocials).orderBy(asc(founderSocials.sortOrder)),
    ]);

    if (founderRows.length === 0) return [];

    // Group social links by their parent founder id, preserving the sortOrder
    // established by the query above.
    const socialsByFounder = new Map<
      string,
      { platform: string; handle: string; url: string }[]
    >();
    for (const s of socialRows) {
      const list = socialsByFounder.get(s.founderId);
      const entry = { platform: s.platform, handle: s.handle, url: s.url };
      if (list) list.push(entry);
      else socialsByFounder.set(s.founderId, [entry]);
    }

    return founderRows.map(
      (r): FounderInfo => ({
        slug: r.slug,
        name: r.name,
        roleEs: r.roleEs,
        roleEn: r.roleEn,
        locationEs: r.locationEs,
        locationEn: r.locationEn,
        image: r.imageUrl ?? "",
        bioEs: r.bioEs,
        bioEn: r.bioEn,
        quoteEs: r.quoteEs,
        quoteEn: r.quoteEn,
        socials: socialsByFounder.get(r.id) ?? [],
      }),
    );
  });
}
