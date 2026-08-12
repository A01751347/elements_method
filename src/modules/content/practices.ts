import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { practicesContent } from "@/shared/db/schema";
import { safeRead } from "./safe";
import type { ElementKey, PracticeInfo } from "@/data/content";

/**
 * Read query: practices — the exercises gallery (three per element).
 *
 * Source table: practices_content (practicesContent)
 * Returns: PracticeInfo[] ordered by sortOrder, only active rows.
 *
 * Drop-in replacement for the static `practices` export from
 * `@/data/content`: a page/component can do `const items = await getPractices()`
 * and pass the result straight to <PracticesGallery> unchanged.
 *
 * `iconName` and `element` are stored as plain `text` columns in the DB
 * (the schema keeps `element` free-text so it can hold the fifth element
 * `eter`, and `iconName` free-text so admins can pick any icon). The
 * frontend type narrows both to unions, so we cast them back here — the
 * seed only ever writes valid union members, so this is the query layer's
 * canonical widening→narrowing boundary.
 *
 * Empty DB returns [] (never throws).
 */
export async function getPractices(): Promise<PracticeInfo[]> {
  return safeRead([], async () => {
    const rows = await db
      .select()
      .from(practicesContent)
      .where(eq(practicesContent.active, true))
      .orderBy(asc(practicesContent.sortOrder));

    return rows.map(
      (r): PracticeInfo => ({
        iconName: r.iconName as PracticeInfo["iconName"],
        titleEs: r.titleEs,
        titleEn: r.titleEn,
        bodyEs: r.bodyEs,
        bodyEn: r.bodyEn,
        durationEs: r.durationEs,
        durationEn: r.durationEn,
        element: r.element as ElementKey,
      }),
    );
  });
}
