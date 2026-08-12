import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { lexiconContent } from "@/shared/db/schema";
import { safeRead } from "./safe";

/**
 * Read query: lexicon — the nature-lexicon marquee terms (bilingual).
 *
 * Source table: lexicon_content (lexiconContent)
 *
 * The static source in `@/data/content` is a pair of parallel string arrays
 * (`lexiconEs` / `lexiconEn`), matched by index. There is no exported interface
 * for them, and the consuming component (`NatureLexicon`) picks one array by
 * locale — `const words = locale === "es" ? lexiconEs : lexiconEn;`. So the
 * canonical frontend shape rebuilt here is `{ es: string[]; en: string[] }`,
 * exposed as the exported `Lexicon` type below.
 *
 * Rows are ordered by `sortOrder` (ascending) so the original editorial order —
 * the five elements, the six Disconnection-Protocol phases, then the closing
 * tagline — is preserved. The `lexicon_content` table has NO `active` column,
 * so no active filter is applied.
 *
 * Empty DB returns `{ es: [], en: [] }` (never throws).
 *
 * Drop-in usage:
 *   const { es, en } = await getLexicon();
 * then a page can hand `es` / `en` to `<NatureLexicon>` in place of the static
 * `lexiconEs` / `lexiconEn` imports.
 */
export interface Lexicon {
  es: string[];
  en: string[];
}

export async function getLexicon(): Promise<Lexicon> {
  return safeRead({ es: [], en: [] }, async () => {
    const rows = await db
      .select()
      .from(lexiconContent)
      .orderBy(asc(lexiconContent.sortOrder));

    return {
      es: rows.map((r) => r.termEs),
      en: rows.map((r) => r.termEn),
    };
  });
}
