import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import {
  programDetails,
  programStats,
  programIncludesBlocks,
  programWhoForItems,
  programCadence,
  type ProgramDetailRow,
} from "@/shared/db/schema";
import type { ProgramDetail } from "@/data/content";
import { safeRead } from "./safe";

/**
 * Read query: programDetails — the long /los-caminos/[slug] detail pages
 * (Flow / Momentum / Source / Compass / Soulfull).
 *
 * Source tables:
 *  - program_details            (programDetails)      — parent row, one per slug
 *  - program_stats              (programStats)        — child: stats[]
 *  - program_includes_blocks    (programIncludesBlocks) — child: includesBlocks[]
 *  - program_whofor_items       (programWhoForItems)  — child: whoForItems[]
 *  - program_cadence            (programCadence)      — child: cadence[] (optional)
 *
 * Returns: ProgramDetail[] (and findProgramDetail(slug)) byte-for-byte
 * compatible with the static `programDetails` / `findProgram` exports from
 * `@/data/content`. A page can do `const items = await getProgramDetails()` or
 * `const program = await findProgramDetail(slug)` and pass the result to the
 * existing /los-caminos/[slug] page unchanged.
 *
 * Reconstruction rules:
 *  - Parent rows are filtered to `active === true` and ordered by `sortOrder`.
 *  - Each child collection is read separately, filtered by `programId`, and
 *    ordered by its own `sortOrder` (the original editorial order).
 *  - Optional parent fields (cadenceHeading*, comparativa*, closing*) come back
 *    as `null` from the DB and are coalesced to `undefined` to match the
 *    ProgramDetail interface's `?:` optionals.
 *  - `comparativa*` are jsonb columns (typed `unknown` by Drizzle) and are cast
 *    to `{ left: string[]; right: string[] }` — the shape the seed wrote.
 *  - `cadence` is present only when the program actually has cadence child rows;
 *    otherwise the field is left `undefined`.
 *
 * Empty DB (or no active rows) returns [] / null — never throws.
 */

type Comparativa = { left: string[]; right: string[] };

/**
 * Assemble a full ProgramDetail from its parent row + already-fetched child
 * rows (each pre-sorted by sortOrder).
 */
function buildProgramDetail(
  parent: ProgramDetailRow,
  stats: {
    value: string;
    labelEs: string;
    labelEn: string;
    sortOrder: number;
  }[],
  includes: {
    titleEs: string;
    titleEn: string;
    bodyEs: string;
    bodyEn: string;
    sortOrder: number;
  }[],
  whoFor: {
    titleEs: string;
    titleEn: string;
    bodyEs: string;
    bodyEn: string;
    sortOrder: number;
  }[],
  cadence: {
    label: string;
    titleEs: string;
    titleEn: string;
    bulletsEs: string[];
    bulletsEn: string[];
    sortOrder: number;
  }[],
): ProgramDetail {
  const detail: ProgramDetail = {
    // `slug` is a string column in the DB but a string-literal union on the
    // interface; the seed only ever writes the known slugs, so this is safe.
    slug: parent.slug as ProgramDetail["slug"],
    url: parent.url,
    headerKickerEs: parent.headerKickerEs,
    headerKickerEn: parent.headerKickerEn,
    nameEs: parent.nameEs,
    nameEn: parent.nameEn,
    taglineEs: parent.taglineEs,
    taglineEn: parent.taglineEn,
    stats: stats.map((s) => ({
      value: s.value,
      labelEs: s.labelEs,
      labelEn: s.labelEn,
    })),
    includesHeadingEs: parent.includesHeadingEs,
    includesHeadingEn: parent.includesHeadingEn,
    includesBlocks: includes.map((b) => ({
      titleEs: b.titleEs,
      titleEn: b.titleEn,
      bodyEs: b.bodyEs,
      bodyEn: b.bodyEn,
    })),
    whoForHeadingEs: parent.whoForHeadingEs,
    whoForHeadingEn: parent.whoForHeadingEn,
    whoForItems: whoFor.map((w) => ({
      titleEs: w.titleEs,
      titleEn: w.titleEn,
      bodyEs: w.bodyEs,
      bodyEn: w.bodyEn,
    })),
    // `primaryElement` is an ElementKey on the interface; a plain text column in
    // the DB. The seed only writes valid element keys.
    primaryElement: parent.primaryElement as ProgramDetail["primaryElement"],
    ctaEs: parent.ctaEs,
    ctaEn: parent.ctaEn,
  };

  // ── Optional fields: only attach when present (null → omit / undefined) ──
  if (parent.cadenceHeadingEs !== null) {
    detail.cadenceHeadingEs = parent.cadenceHeadingEs;
  }
  if (parent.cadenceHeadingEn !== null) {
    detail.cadenceHeadingEn = parent.cadenceHeadingEn;
  }
  if (cadence.length > 0) {
    detail.cadence = cadence.map((c) => ({
      label: c.label,
      titleEs: c.titleEs,
      titleEn: c.titleEn,
      bulletsEs: c.bulletsEs,
      bulletsEn: c.bulletsEn,
    }));
  }
  if (parent.comparativaEs !== null) {
    detail.comparativaEs = parent.comparativaEs as Comparativa;
  }
  if (parent.comparativaEn !== null) {
    detail.comparativaEn = parent.comparativaEn as Comparativa;
  }
  if (parent.closingNoteEs !== null) detail.closingNoteEs = parent.closingNoteEs;
  if (parent.closingNoteEn !== null) detail.closingNoteEn = parent.closingNoteEn;
  if (parent.closingTitleEs !== null) {
    detail.closingTitleEs = parent.closingTitleEs;
  }
  if (parent.closingTitleEn !== null) {
    detail.closingTitleEn = parent.closingTitleEn;
  }
  if (parent.closingBodyEs !== null) detail.closingBodyEs = parent.closingBodyEs;
  if (parent.closingBodyEn !== null) detail.closingBodyEn = parent.closingBodyEn;

  return detail;
}

/**
 * All active program detail pages, ordered by editorial `sortOrder`, with every
 * nested collection reconstructed. Drop-in replacement for the static
 * `programDetails` export. Returns [] on an empty DB.
 */
export async function getProgramDetails(): Promise<ProgramDetail[]> {
  return safeRead([], async () => {
    const parents = await db
      .select()
      .from(programDetails)
      .where(eq(programDetails.active, true))
      .orderBy(asc(programDetails.sortOrder));

    if (parents.length === 0) return [];

    return Promise.all(
      parents.map(async (parent): Promise<ProgramDetail> => {
        const [stats, includes, whoFor, cadence] = await Promise.all([
          db
            .select()
            .from(programStats)
            .where(eq(programStats.programId, parent.id))
            .orderBy(asc(programStats.sortOrder)),
          db
            .select()
            .from(programIncludesBlocks)
            .where(eq(programIncludesBlocks.programId, parent.id))
            .orderBy(asc(programIncludesBlocks.sortOrder)),
          db
            .select()
            .from(programWhoForItems)
            .where(eq(programWhoForItems.programId, parent.id))
            .orderBy(asc(programWhoForItems.sortOrder)),
          db
            .select()
            .from(programCadence)
            .where(eq(programCadence.programId, parent.id))
            .orderBy(asc(programCadence.sortOrder)),
        ]);

        return buildProgramDetail(parent, stats, includes, whoFor, cadence);
      }),
    );
  });
}

/**
 * A single active program detail page by its stable route `slug`
 * (e.g. "raices", "corriente", "fuente"). Drop-in replacement for the static
 * `findProgram(slug)`. Returns `null` when no active row matches. Never throws.
 */
export async function findProgramDetail(
  slug: string,
): Promise<ProgramDetail | null> {
  return safeRead(null, async () => {
    const parents = await db
      .select()
      .from(programDetails)
      .where(and(eq(programDetails.slug, slug), eq(programDetails.active, true)))
      .limit(1);

    const parent = parents[0];
    if (!parent) return null;

    const [stats, includes, whoFor, cadence] = await Promise.all([
      db
        .select()
        .from(programStats)
        .where(eq(programStats.programId, parent.id))
        .orderBy(asc(programStats.sortOrder)),
      db
        .select()
        .from(programIncludesBlocks)
        .where(eq(programIncludesBlocks.programId, parent.id))
        .orderBy(asc(programIncludesBlocks.sortOrder)),
      db
        .select()
        .from(programWhoForItems)
        .where(eq(programWhoForItems.programId, parent.id))
        .orderBy(asc(programWhoForItems.sortOrder)),
      db
        .select()
        .from(programCadence)
        .where(eq(programCadence.programId, parent.id))
        .orderBy(asc(programCadence.sortOrder)),
    ]);

    return buildProgramDetail(parent, stats, includes, whoFor, cadence);
  });
}
