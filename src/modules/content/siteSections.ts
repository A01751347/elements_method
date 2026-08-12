import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { siteSections, siteSectionItems } from "@/shared/db/schema";
import type { ElementKey } from "@/data/content";
import { safeRead } from "./safe";

/**
 * Read queries: the site-level singleton editorial blocks.
 *
 * Source tables:
 *   - site_sections       (siteSections)     — one parent row per block, keyed
 *                                              by `key` (nullable bilingual cols)
 *   - site_section_items  (siteSectionItems) — repeatable child rows, FK
 *                                              `section_key` → siteSections.key
 *
 * These reconstruct — byte-for-byte — the static exports that used to live in
 * `@/data/content`:
 *   coachingSection, communitySection, originProgram, rootsArc, mantraEs/En,
 *   resultsEs/En, audienceEs/En, differentiatorsEs/En, dailyScanEs/En.
 *
 * None of these tables have an `active` column, so no active filter is applied;
 * everything is ordered by the child `sortOrder` where a collection exists.
 * Every getter degrades gracefully on an empty DB (returns empty
 * collections / empty strings) and never throws.
 *
 * The parent-column mapping mirrors the seed (see seeds/content/siteSections.ts):
 *   coaching / community → eyebrow + headline + body
 *   origin               → tag→eyebrow, name→headline, plus body + cta
 *   mantra               → the string lives in bodyEs / bodyEn
 *   roots_arc / results / audience / differentiators / daily_scan → bare parent,
 *                          all content in child items.
 */

// Parent keys used in the site_sections table.
const KEY_COACHING = "home_coaching";
const KEY_COMMUNITY = "home_community";
const KEY_ORIGIN = "origin_program";
const KEY_ROOTS_ARC = "roots_arc";
const KEY_MANTRA = "mantra";
const KEY_RESULTS = "results";
const KEY_AUDIENCE = "audience";
const KEY_DIFFERENTIATORS = "differentiators";
const KEY_DAILY_SCAN = "daily_scan";

// ────────────────────────────────────────────────────────────────────────────
// Return-type definitions.
// None of these have an exported interface in `@/data/content`; each shape is
// derived from the literal static export and confirmed against the consuming
// component, then exported here as the canonical type.
// ────────────────────────────────────────────────────────────────────────────

/** One group-program coaching row (coachingSection.items[]). */
export interface CoachingItem {
  titleEs: string;
  titleEn: string;
  bodyEs: string;
  bodyEn: string;
}

/**
 * Shape of the static `coachingSection` export. Consumed by
 * `src/components/sections/CoachingSection.tsx`, which reads
 * eyebrow/headline/body and iterates `items` (title + body, body split on
 * "\n\n"). Empty DB yields empty strings + `items: []`.
 */
export interface CoachingSection {
  eyebrowEs: string;
  eyebrowEn: string;
  headlineEs: string;
  headlineEn: string;
  bodyEs: string;
  bodyEn: string;
  items: CoachingItem[];
}

/**
 * Shape of the static `communitySection` export. Consumed by
 * `src/components/sections/CommunitySection.tsx` (eyebrow/headline/body; body
 * split on "\n\n").
 */
export interface CommunitySection {
  eyebrowEs: string;
  eyebrowEn: string;
  headlineEs: string;
  headlineEn: string;
  bodyEs: string;
  bodyEn: string;
}

/**
 * Shape of the static `originProgram` export. Consumed by
 * `src/app/[locale]/los-caminos/page.tsx` (name/tag/body/cta). Un-maps the DB
 * columns: headline→name, eyebrow→tag.
 */
export interface OriginProgram {
  nameEs: string;
  nameEn: string;
  tagEs: string;
  tagEn: string;
  bodyEs: string;
  bodyEn: string;
  ctaEs: string;
  ctaEn: string;
}

/** One step of the elemental arc (rootsArc[]). */
export interface RootsArcRow {
  month: number;
  elementKey: ElementKey;
  titleEs: string;
  titleEn: string;
}

/**
 * The core mantra, both languages. The static source is two bare string
 * exports (`mantraEs` / `mantraEn`); rebuilt here as `{ es, en }`.
 */
export interface Mantra {
  es: string;
  en: string;
}

/**
 * A pair of parallel, index-matched bilingual string lists — the shape shared
 * by results / audience / differentiators. Each static source is two parallel
 * `string[]` exports (e.g. `resultsEs` / `resultsEn`); rebuilt as `{ es, en }`.
 * The consuming pages pick one array by locale.
 */
export interface BilingualList {
  es: string[];
  en: string[];
}

/** One Spanish daily-scan prompt row — mirrors `dailyScanEs[]`. */
export interface DailyScanEsRow {
  element: ElementKey;
  promptEs: string;
}

/** One English daily-scan prompt row — mirrors `dailyScanEn[]`. */
export interface DailyScanEnRow {
  element: ElementKey;
  promptEn: string;
}

/**
 * The 4-element daily scan. The static source is two arrays with *different*
 * per-locale shapes (`dailyScanEs` rows have `promptEs`; `dailyScanEn` rows have
 * `promptEn`). `src/app/[locale]/el-metodo/page.tsx` picks one by locale, so we
 * reproduce both split shapes exactly under `{ es, en }`.
 */
export interface DailyScan {
  es: DailyScanEsRow[];
  en: DailyScanEnRow[];
}

// ────────────────────────────────────────────────────────────────────────────
// Internal helpers.
// ────────────────────────────────────────────────────────────────────────────

/** Fetch the single parent row for a key (or undefined if not seeded). */
async function getParent(key: string) {
  const rows = await db
    .select()
    .from(siteSections)
    .where(eq(siteSections.key, key))
    .limit(1);
  return rows[0];
}

/** Fetch a section's child items, ordered by sortOrder. */
async function getItems(sectionKey: string) {
  return db
    .select()
    .from(siteSectionItems)
    .where(eq(siteSectionItems.sectionKey, sectionKey))
    .orderBy(asc(siteSectionItems.sortOrder));
}

// ────────────────────────────────────────────────────────────────────────────
// Public getters.
// ────────────────────────────────────────────────────────────────────────────

export async function getCoachingSection(): Promise<CoachingSection> {
  return safeRead(
    {
      eyebrowEs: "",
      eyebrowEn: "",
      headlineEs: "",
      headlineEn: "",
      bodyEs: "",
      bodyEn: "",
      items: [],
    },
    async () => {
      const [parent, items] = await Promise.all([
        getParent(KEY_COACHING),
        getItems(KEY_COACHING),
      ]);

      return {
        eyebrowEs: parent?.eyebrowEs ?? "",
        eyebrowEn: parent?.eyebrowEn ?? "",
        headlineEs: parent?.headlineEs ?? "",
        headlineEn: parent?.headlineEn ?? "",
        bodyEs: parent?.bodyEs ?? "",
        bodyEn: parent?.bodyEn ?? "",
        items: items.map(
          (i): CoachingItem => ({
            titleEs: i.titleEs ?? "",
            titleEn: i.titleEn ?? "",
            bodyEs: i.bodyEs ?? "",
            bodyEn: i.bodyEn ?? "",
          }),
        ),
      };
    },
  );
}

export async function getCommunitySection(): Promise<CommunitySection> {
  return safeRead(
    {
      eyebrowEs: "",
      eyebrowEn: "",
      headlineEs: "",
      headlineEn: "",
      bodyEs: "",
      bodyEn: "",
    },
    async () => {
      const parent = await getParent(KEY_COMMUNITY);
      return {
        eyebrowEs: parent?.eyebrowEs ?? "",
        eyebrowEn: parent?.eyebrowEn ?? "",
        headlineEs: parent?.headlineEs ?? "",
        headlineEn: parent?.headlineEn ?? "",
        bodyEs: parent?.bodyEs ?? "",
        bodyEn: parent?.bodyEn ?? "",
      };
    },
  );
}

export async function getOriginProgram(): Promise<OriginProgram> {
  return safeRead(
    {
      nameEs: "",
      nameEn: "",
      tagEs: "",
      tagEn: "",
      bodyEs: "",
      bodyEn: "",
      ctaEs: "",
      ctaEn: "",
    },
    async () => {
      const parent = await getParent(KEY_ORIGIN);
      // Un-map: headline→name, eyebrow→tag (see seed column mapping).
      return {
        nameEs: parent?.headlineEs ?? "",
        nameEn: parent?.headlineEn ?? "",
        tagEs: parent?.eyebrowEs ?? "",
        tagEn: parent?.eyebrowEn ?? "",
        bodyEs: parent?.bodyEs ?? "",
        bodyEn: parent?.bodyEn ?? "",
        ctaEs: parent?.ctaEs ?? "",
        ctaEn: parent?.ctaEn ?? "",
      };
    },
  );
}

export async function getRootsArc(): Promise<RootsArcRow[]> {
  return safeRead([], async () => {
    const items = await getItems(KEY_ROOTS_ARC);
    return items.map((i): RootsArcRow => {
      const meta = (i.meta ?? {}) as { month?: number; elementKey?: string };
      return {
        month: meta.month ?? 0,
        elementKey: (meta.elementKey ?? "tierra") as ElementKey,
        titleEs: i.titleEs ?? "",
        titleEn: i.titleEn ?? "",
      };
    });
  });
}

export async function getMantra(): Promise<Mantra> {
  return safeRead({ es: "", en: "" }, async () => {
    const parent = await getParent(KEY_MANTRA);
    return {
      es: parent?.bodyEs ?? "",
      en: parent?.bodyEn ?? "",
    };
  });
}

/** Shared reader for the three index-paired bilingual bullet lists. */
async function getBilingualList(key: string): Promise<BilingualList> {
  return safeRead({ es: [], en: [] }, async () => {
    const items = await getItems(key);
    return {
      es: items.map((i) => i.bodyEs ?? ""),
      en: items.map((i) => i.bodyEn ?? ""),
    };
  });
}

export function getResults(): Promise<BilingualList> {
  return getBilingualList(KEY_RESULTS);
}

export function getAudience(): Promise<BilingualList> {
  return getBilingualList(KEY_AUDIENCE);
}

export function getDifferentiators(): Promise<BilingualList> {
  return getBilingualList(KEY_DIFFERENTIATORS);
}

export async function getDailyScan(): Promise<DailyScan> {
  return safeRead({ es: [], en: [] }, async () => {
    const items = await getItems(KEY_DAILY_SCAN);
    return {
      es: items.map((i): DailyScanEsRow => {
        const meta = (i.meta ?? {}) as { element?: string };
        return {
          element: (meta.element ?? "agua") as ElementKey,
          promptEs: i.bodyEs ?? "",
        };
      }),
      en: items.map((i): DailyScanEnRow => {
        const meta = (i.meta ?? {}) as { element?: string };
        return {
          element: (meta.element ?? "agua") as ElementKey,
          promptEn: i.bodyEn ?? "",
        };
      }),
    };
  });
}
