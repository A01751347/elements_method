import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { faqsContent } from "@/shared/db/schema";
import { safeRead } from "./safe";

/**
 * Frequently-asked question, in the exact shape the FAQ component consumes.
 *
 * The static `faqs` array in `@/data/content` has no exported interface, so we
 * derive the canonical return type here from its literal shape `{qEs,qEn,aEs,aEn}`
 * (all strings). `src/components/sections/FAQ.tsx` reads only `faq.qEs`,
 * `faq.qEn`, `faq.aEs`, `faq.aEn` — this type is byte-for-byte compatible.
 */
export interface Faq {
  qEs: string;
  qEn: string;
  aEs: string;
  aEn: string;
}

/**
 * Read query: FAQs.
 *
 * Source table: faqs_content (faqsContent)
 * Returns: Faq[] — only `active` rows, ordered by sortOrder.
 *
 * Drop-in replacement for the static `faqs` export from `@/data/content`: a
 * page/component can do `const faqs = await getFaqs()` and pass the result
 * straight to <FAQ> unchanged (it maps over `.qEs/.qEn/.aEs/.aEn`).
 *
 * Column remap: question_es/en → qEs/qEn, answer_es/en → aEs/aEn.
 * Empty DB returns [] (never throws).
 */
export async function getFaqs(): Promise<Faq[]> {
  return safeRead([], async () => {
    const rows = await db
      .select()
      .from(faqsContent)
      .where(eq(faqsContent.active, true))
      .orderBy(asc(faqsContent.sortOrder));

    return rows.map(
      (r): Faq => ({
        qEs: r.questionEs,
        qEn: r.questionEn,
        aEs: r.answerEs,
        aEn: r.answerEn,
      }),
    );
  });
}
