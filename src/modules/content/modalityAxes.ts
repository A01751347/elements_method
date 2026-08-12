import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { modalityAxesContent } from "@/shared/db/schema";
import type { ElementKey, ModalityAxis } from "@/data/content";
import { safeRead } from "./safe";

/**
 * Read query: modality axes — the methodology stack (Coaching/PNL, etc.).
 *
 * Source table: modality_axes_content (modalityAxesContent)
 * Returns: ModalityAxis[] ordered by sortOrder.
 *
 * Drop-in replacement for the static `modalityAxes` export from
 * `@/data/content`: a page/component can do `const axes = await getModalityAxes()`
 * and pass the result straight to <LocationsSection> unchanged.
 *
 * modalitiesEs / modalitiesEn are text[] columns, returned as-is. `primaryElement`
 * is stored as plain text in the DB (so `eter` fits); the ModalityAxis interface
 * types it as ElementKey, so it is narrowed here to keep the return type canonical.
 *
 * The target table has no `active` column, so no active filter is applied.
 * Empty DB returns [] (never throws).
 */
export async function getModalityAxes(): Promise<ModalityAxis[]> {
  return safeRead([], async () => {
    const rows = await db
      .select()
      .from(modalityAxesContent)
      .orderBy(asc(modalityAxesContent.sortOrder));

    return rows.map(
      (r): ModalityAxis => ({
        slug: r.slug,
        nameEs: r.nameEs,
        nameEn: r.nameEn,
        taglineEs: r.taglineEs,
        taglineEn: r.taglineEn,
        bodyEs: r.bodyEs,
        bodyEn: r.bodyEn,
        modalitiesEs: r.modalitiesEs,
        modalitiesEn: r.modalitiesEn,
        primaryElement: r.primaryElement as ElementKey,
      }),
    );
  });
}
