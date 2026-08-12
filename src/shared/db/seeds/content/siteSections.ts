import { eq } from "drizzle-orm";

import {
  coachingSection,
  communitySection,
  originProgram,
  rootsArc,
  mantraEs,
  mantraEn,
  resultsEs,
  resultsEn,
  audienceEs,
  audienceEn,
  differentiatorsEs,
  differentiatorsEn,
  dailyScanEs,
  dailyScanEn,
} from "@/data/content";
import { db } from "../../client";
import { siteSections, siteSectionItems } from "../../schema";

/**
 * Seeds the `site_sections` keyed-singleton table (and its `site_section_items`
 * child table) from the static editorial exports in content.ts.
 *
 * Section keys created here:
 *  - `home_coaching`      — coachingSection: eyebrow/headline/body on the parent,
 *                           one child item per coaching path (title/body).
 *  - `home_community`     — communitySection: eyebrow/headline/body on the parent
 *                           (no children).
 *  - `origin_program`     — originProgram: name → headline, tag → eyebrow,
 *                           body + cta on the parent (no children).
 *  - `roots_arc`          — rootsArc: parent is a bare key row; each arc phase is
 *                           a child item with title + meta {month, elementKey}.
 *  - `mantra`             — the core mantra string stored as parent bodyEs/bodyEn.
 *  - `results`            — resultsEs/resultsEn (string[]) → one child item each,
 *                           bilingual strings paired by index into bodyEs/bodyEn.
 *  - `audience`           — audienceEs/audienceEn (string[]) → child items.
 *  - `differentiators`    — differentiatorsEs/differentiatorsEn (string[]) → items.
 *  - `daily_scan`         — dailyScanEs/dailyScanEn: one child item per element,
 *                           prompt strings into bodyEs/bodyEn + meta {element}.
 *
 * Idempotent strategy:
 *  - Each parent row has a natural unique key (`key`), so it is upserted via
 *    `onConflictDoUpdate`.
 *  - `site_section_items` has no natural unique key, so for every section we
 *    DELETE the existing child rows by `sectionKey` and then INSERT fresh.
 *    Re-running the seed is therefore safe.
 *  - `sortOrder` is set to the array index for every collection so the query
 *    layer reads the rows back in the original editorial order.
 */
export async function seedSiteSections(): Promise<void> {
  const sectionRows: (typeof siteSections.$inferInsert)[] = [];
  const itemRows: (typeof siteSectionItems.$inferInsert)[] = [];

  // ── home_coaching ────────────────────────────────────────────────────────
  sectionRows.push({
    key: "home_coaching",
    eyebrowEs: coachingSection.eyebrowEs,
    eyebrowEn: coachingSection.eyebrowEn,
    headlineEs: coachingSection.headlineEs,
    headlineEn: coachingSection.headlineEn,
    bodyEs: coachingSection.bodyEs,
    bodyEn: coachingSection.bodyEn,
  });
  coachingSection.items.forEach((item, index) => {
    itemRows.push({
      sectionKey: "home_coaching",
      titleEs: item.titleEs,
      titleEn: item.titleEn,
      bodyEs: item.bodyEs,
      bodyEn: item.bodyEn,
      sortOrder: index,
    });
  });

  // ── home_community ───────────────────────────────────────────────────────
  sectionRows.push({
    key: "home_community",
    eyebrowEs: communitySection.eyebrowEs,
    eyebrowEn: communitySection.eyebrowEn,
    headlineEs: communitySection.headlineEs,
    headlineEn: communitySection.headlineEn,
    bodyEs: communitySection.bodyEs,
    bodyEn: communitySection.bodyEn,
  });

  // ── origin_program ───────────────────────────────────────────────────────
  sectionRows.push({
    key: "origin_program",
    eyebrowEs: originProgram.tagEs,
    eyebrowEn: originProgram.tagEn,
    headlineEs: originProgram.nameEs,
    headlineEn: originProgram.nameEn,
    bodyEs: originProgram.bodyEs,
    bodyEn: originProgram.bodyEn,
    ctaEs: originProgram.ctaEs,
    ctaEn: originProgram.ctaEn,
  });

  // ── roots_arc ────────────────────────────────────────────────────────────
  sectionRows.push({ key: "roots_arc" });
  rootsArc.forEach((phase, index) => {
    itemRows.push({
      sectionKey: "roots_arc",
      titleEs: phase.titleEs,
      titleEn: phase.titleEn,
      meta: { month: phase.month, elementKey: phase.elementKey },
      sortOrder: index,
    });
  });

  // ── mantra ───────────────────────────────────────────────────────────────
  sectionRows.push({
    key: "mantra",
    bodyEs: mantraEs,
    bodyEn: mantraEn,
  });

  // ── results ──────────────────────────────────────────────────────────────
  sectionRows.push({ key: "results" });
  resultsEs.forEach((textEs, index) => {
    itemRows.push({
      sectionKey: "results",
      bodyEs: textEs,
      bodyEn: resultsEn[index] ?? null,
      sortOrder: index,
    });
  });

  // ── audience ─────────────────────────────────────────────────────────────
  sectionRows.push({ key: "audience" });
  audienceEs.forEach((textEs, index) => {
    itemRows.push({
      sectionKey: "audience",
      bodyEs: textEs,
      bodyEn: audienceEn[index] ?? null,
      sortOrder: index,
    });
  });

  // ── differentiators ──────────────────────────────────────────────────────
  sectionRows.push({ key: "differentiators" });
  differentiatorsEs.forEach((textEs, index) => {
    itemRows.push({
      sectionKey: "differentiators",
      bodyEs: textEs,
      bodyEn: differentiatorsEn[index] ?? null,
      sortOrder: index,
    });
  });

  // ── daily_scan ───────────────────────────────────────────────────────────
  sectionRows.push({ key: "daily_scan" });
  dailyScanEs.forEach((row, index) => {
    itemRows.push({
      sectionKey: "daily_scan",
      bodyEs: row.promptEs,
      bodyEn: dailyScanEn[index]?.promptEn ?? null,
      meta: { element: row.element },
      sortOrder: index,
    });
  });

  // ── Upsert every parent by its unique `key` ──────────────────────────────
  for (const section of sectionRows) {
    await db
      .insert(siteSections)
      .values(section)
      .onConflictDoUpdate({
        target: siteSections.key,
        set: {
          eyebrowEs: section.eyebrowEs ?? null,
          eyebrowEn: section.eyebrowEn ?? null,
          headlineEs: section.headlineEs ?? null,
          headlineEn: section.headlineEn ?? null,
          bodyEs: section.bodyEs ?? null,
          bodyEn: section.bodyEn ?? null,
          ctaEs: section.ctaEs ?? null,
          ctaEn: section.ctaEn ?? null,
          updatedAt: new Date(),
        },
      });
  }

  // ── Children: wipe by sectionKey, then insert fresh in editorial order ────
  const childKeys = [
    "home_coaching",
    "roots_arc",
    "results",
    "audience",
    "differentiators",
    "daily_scan",
  ] as const;
  for (const key of childKeys) {
    await db
      .delete(siteSectionItems)
      .where(eq(siteSectionItems.sectionKey, key));
  }

  if (itemRows.length > 0) {
    await db.insert(siteSectionItems).values(itemRows);
  }

  console.log(`  ✓ ${sectionRows.length} siteSections seeded`);
}
