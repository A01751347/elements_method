/**
 * Seed — Elements editorial content.
 *
 * Writes the five elements (Tierra, Fuego, Agua, Aire, Éter) and their
 * "Key Components of X Leadership" child rows from the canonical static source
 * (`src/data/content.ts`) into the normalized `elements_content` /
 * `element_components` tables.
 *
 * Idempotency strategy:
 *  - Parent (`elements_content`) is upserted by its unique `key`, so the parent
 *    id stays stable across re-runs.
 *  - Children (`element_components`) have no natural unique key, so we DELETE all
 *    rows for the parent, then INSERT fresh with `sortOrder = array index`.
 *
 * Display order is preserved via `sortOrder` (the index in the static array).
 *
 * The query layer reconstructs `ElementInfo[]` from these tables:
 *  - `components` from `element_components` ordered by `sortOrder`
 *  - `image` from `elements_content.imageUrl` (fallback `elementImages`)
 *  - `frameworkImage` from `elements_content.frameworkImageUrl`
 */
import { eq } from "drizzle-orm";

import { elements, elementImages, frameworkImages } from "@/data/content";

import { db } from "../../client";
import { elementComponents, elementsContent } from "../../schema";

type ElementInsert = typeof elementsContent.$inferInsert;
type ComponentInsert = typeof elementComponents.$inferInsert;

export async function seedElements(): Promise<void> {
  for (let i = 0; i < elements.length; i++) {
    const e = elements[i];

    const values: ElementInsert = {
      key: e.key,
      nameEs: e.nameEs,
      nameEn: e.nameEn,
      framework: e.framework,
      qualityEs: e.qualityEs,
      qualityEn: e.qualityEn,
      cultivaEs: e.cultivaEs,
      cultivaEn: e.cultivaEn,
      quoteEs: e.quoteEs,
      quoteEn: e.quoteEn,
      natureEs: e.natureEs,
      natureEn: e.natureEn,
      methodEs: e.methodEs,
      methodEn: e.methodEn,
      bodyEs: e.bodyEs,
      bodyEn: e.bodyEn,
      experienceEs: e.experienceEs,
      experienceEn: e.experienceEn,
      paradoxEs: e.paradoxEs,
      paradoxEn: e.paradoxEn,
      invitationEs: e.invitationEs,
      invitationEn: e.invitationEn,
      accent: e.accent,
      accentSoft: e.accentSoft,
      accentInk: e.accentInk,
      animClass: e.animClass,
      imageUrl: elementImages[e.key] ?? null,
      frameworkImageUrl: frameworkImages[e.key] ?? null,
      sortOrder: i,
    };

    // Upsert the parent by its unique `key`. `.returning()` gives us the stable
    // id so we can (re)build the child rows.
    const [row] = await db
      .insert(elementsContent)
      .values(values)
      .onConflictDoUpdate({
        target: elementsContent.key,
        set: {
          nameEs: values.nameEs,
          nameEn: values.nameEn,
          framework: values.framework ?? null,
          qualityEs: values.qualityEs,
          qualityEn: values.qualityEn,
          cultivaEs: values.cultivaEs,
          cultivaEn: values.cultivaEn,
          quoteEs: values.quoteEs,
          quoteEn: values.quoteEn,
          natureEs: values.natureEs,
          natureEn: values.natureEn,
          methodEs: values.methodEs,
          methodEn: values.methodEn,
          bodyEs: values.bodyEs,
          bodyEn: values.bodyEn,
          experienceEs: values.experienceEs,
          experienceEn: values.experienceEn,
          paradoxEs: values.paradoxEs ?? null,
          paradoxEn: values.paradoxEn ?? null,
          invitationEs: values.invitationEs ?? null,
          invitationEn: values.invitationEn ?? null,
          accent: values.accent,
          accentSoft: values.accentSoft,
          accentInk: values.accentInk,
          animClass: values.animClass,
          imageUrl: values.imageUrl ?? null,
          frameworkImageUrl: values.frameworkImageUrl ?? null,
          sortOrder: values.sortOrder ?? 0,
          updatedAt: new Date(),
        },
      })
      .returning({ id: elementsContent.id });

    const elementId = row.id;

    // Rebuild children: delete all existing, then insert fresh in array order.
    await db
      .delete(elementComponents)
      .where(eq(elementComponents.elementId, elementId));

    const components = e.components ?? [];
    if (components.length > 0) {
      const componentValues: ComponentInsert[] = components.map((c, j) => ({
        elementId,
        nameEs: c.nameEs,
        nameEn: c.nameEn,
        bodyEs: c.bodyEs,
        bodyEn: c.bodyEn,
        sortOrder: j,
      }));
      await db.insert(elementComponents).values(componentValues);
    }
  }

  console.log(`  ✓ ${elements.length} elements seeded`);
}
