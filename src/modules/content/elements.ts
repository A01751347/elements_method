import "server-only";

import { asc, eq } from "drizzle-orm";

import { db } from "@/shared/db/client";
import { elementComponents, elementsContent } from "@/shared/db/schema";
import {
  elementImages,
  frameworkImages,
  type ElementInfo,
  type ElementKey,
} from "@/data/content";
import { safeRead } from "./safe";

/**
 * Read query: the five elements (Tierra, Fuego, Agua, Aire, Éter).
 *
 * Source tables:
 *  - elements_content   (elementsContent)   — parent, one row per element
 *  - element_components (elementComponents) — child "Key Components" rows
 *
 * Returns: `ElementInfo[]` ordered by `sortOrder` — byte-for-byte compatible
 * with the static `elements` export from `@/data/content`, so a page can do
 *
 *     const elements = await getElements();
 *
 * and hand the result straight to <ElementsShowcase>, the el-método page, the
 * retiros pages, etc. with no other change.
 *
 * Reconstruction notes:
 *  - `components` is rebuilt from `element_components` ordered by its own
 *    `sortOrder`. Éter has no components in the static source; when the DB has
 *    no child rows for an element we return `null` for `components` (matching
 *    the static shape, where Éter's `components` is `null`, not `[]`).
 *  - `elements_content` has no `active` column, so no active filter is applied.
 *  - Empty DB returns `[]` — never throws.
 *
 * The `elements_content` table also stores `imageUrl` / `frameworkImageUrl`,
 * which are NOT part of `ElementInfo` (consumers read those from the separate
 * `elementImages` / `frameworkImages` maps). `getElementImages()` /
 * `getFrameworkImages()` below reconstruct those maps from the DB with the
 * static values as fallback, so the whole image layer can move to the DB too.
 */
export async function getElements(): Promise<ElementInfo[]> {
  return safeRead([], async () => {
    const rows = await db
      .select()
      .from(elementsContent)
      .orderBy(asc(elementsContent.sortOrder));

    if (rows.length === 0) return [];

    // Fetch every element's components in one query, then group by elementId.
    const componentRows = await db
      .select()
      .from(elementComponents)
      .orderBy(asc(elementComponents.sortOrder));

    const componentsByElement = new Map<
      string,
      { nameEs: string; nameEn: string; bodyEs: string; bodyEn: string }[]
    >();
    for (const c of componentRows) {
      const list = componentsByElement.get(c.elementId) ?? [];
      list.push({
        nameEs: c.nameEs,
        nameEn: c.nameEn,
        bodyEs: c.bodyEs,
        bodyEn: c.bodyEn,
      });
      componentsByElement.set(c.elementId, list);
    }

    return rows.map((r): ElementInfo => {
      const comps = componentsByElement.get(r.id);
      return {
        key: r.key as ElementKey,
        nameEs: r.nameEs,
        nameEn: r.nameEn,
        framework: r.framework,
        qualityEs: r.qualityEs,
        qualityEn: r.qualityEn,
        cultivaEs: r.cultivaEs,
        cultivaEn: r.cultivaEn,
        quoteEs: r.quoteEs,
        quoteEn: r.quoteEn,
        natureEs: r.natureEs,
        natureEn: r.natureEn,
        methodEs: r.methodEs,
        methodEn: r.methodEn,
        bodyEs: r.bodyEs,
        bodyEn: r.bodyEn,
        experienceEs: r.experienceEs,
        experienceEn: r.experienceEn,
        paradoxEs: r.paradoxEs,
        paradoxEn: r.paradoxEn,
        // `null` (not `[]`) when there are no component rows, matching the
        // static shape where Éter's `components` is `null`.
        components: comps && comps.length > 0 ? comps : null,
        invitationEs: r.invitationEs,
        invitationEn: r.invitationEn,
        accent: r.accent,
        accentSoft: r.accentSoft,
        accentInk: r.accentInk,
        animClass: r.animClass,
      };
    });
  });
}

/**
 * Reconstruct the `elementImages` map (`Record<ElementKey, string>`) from the
 * DB. Uses `elements_content.imageUrl` when present, falling back to the static
 * `elementImages` value for that key. Drop-in for the static `elementImages`
 * export. Empty DB yields the full static map.
 */
export async function getElementImages(): Promise<Record<ElementKey, string>> {
  return safeRead(elementImages, async () => {
    const rows = await db
      .select({ key: elementsContent.key, imageUrl: elementsContent.imageUrl })
      .from(elementsContent);

    // Start from the static defaults so every key is always populated.
    const map: Record<ElementKey, string> = { ...elementImages };
    for (const r of rows) {
      if (r.imageUrl) map[r.key as ElementKey] = r.imageUrl;
    }
    return map;
  });
}

/**
 * Reconstruct the `frameworkImages` map (`Record<ElementKey, string | null>`)
 * from the DB. Uses `elements_content.frameworkImageUrl`, falling back to the
 * static `frameworkImages` value. Drop-in for the static `frameworkImages`
 * export. Empty DB yields the full static map.
 */
export async function getFrameworkImages(): Promise<
  Record<ElementKey, string | null>
> {
  return safeRead(frameworkImages, async () => {
    const rows = await db
      .select({
        key: elementsContent.key,
        frameworkImageUrl: elementsContent.frameworkImageUrl,
      })
      .from(elementsContent);

    const map: Record<ElementKey, string | null> = { ...frameworkImages };
    for (const r of rows) {
      map[r.key as ElementKey] = r.frameworkImageUrl;
    }
    return map;
  });
}

/**
 * Convenience: look up a single element by its key. Returns `undefined` when
 * the element is absent (e.g. empty DB), never throws.
 */
export async function getElementByKey(
  key: ElementKey,
): Promise<ElementInfo | undefined> {
  return safeRead<ElementInfo | undefined>(undefined, async () => {
    const [row] = await db
      .select()
      .from(elementsContent)
      .where(eq(elementsContent.key, key))
      .limit(1);

    if (!row) return undefined;

    const componentRows = await db
      .select()
      .from(elementComponents)
      .where(eq(elementComponents.elementId, row.id))
      .orderBy(asc(elementComponents.sortOrder));

    const comps = componentRows.map((c) => ({
      nameEs: c.nameEs,
      nameEn: c.nameEn,
      bodyEs: c.bodyEs,
      bodyEn: c.bodyEn,
    }));

    return {
      key: row.key as ElementKey,
      nameEs: row.nameEs,
      nameEn: row.nameEn,
      framework: row.framework,
      qualityEs: row.qualityEs,
      qualityEn: row.qualityEn,
      cultivaEs: row.cultivaEs,
      cultivaEn: row.cultivaEn,
      quoteEs: row.quoteEs,
      quoteEn: row.quoteEn,
      natureEs: row.natureEs,
      natureEn: row.natureEn,
      methodEs: row.methodEs,
      methodEn: row.methodEn,
      bodyEs: row.bodyEs,
      bodyEn: row.bodyEn,
      experienceEs: row.experienceEs,
      experienceEn: row.experienceEn,
      paradoxEs: row.paradoxEs,
      paradoxEn: row.paradoxEn,
      components: comps.length > 0 ? comps : null,
      invitationEs: row.invitationEs,
      invitationEn: row.invitationEn,
      accent: row.accent,
      accentSoft: row.accentSoft,
      accentInk: row.accentInk,
      animClass: row.animClass,
    };
  });
}
