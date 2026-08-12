/**
 * Seed: FAQs editorial content.
 *
 * Source: src/data/content.ts → `faqs` ({ qEs, qEn, aEs, aEn }[])
 * Target: faqs_content (questionEs / questionEn / answerEs / answerEn)
 *
 * `faqs_content` has no natural unique key, so the idempotent strategy is:
 * DELETE all rows, then INSERT fresh with sortOrder = array index. Re-running
 * the seed is therefore safe and preserves display order.
 *
 * The query layer reads these back into { qEs, qEn, aEs, aEn }[], ordered by
 * sortOrder, active only — exactly the shape FAQ.tsx consumes today.
 */
import { faqs } from "@/data/content";
import { db } from "../../client";
import { faqsContent } from "../../schema";

type NewFaq = typeof faqsContent.$inferInsert;

export async function seedFaqs(): Promise<void> {
  const rows: NewFaq[] = faqs.map((faq, index) => ({
    questionEs: faq.qEs,
    questionEn: faq.qEn,
    answerEs: faq.aEs,
    answerEn: faq.aEn,
    sortOrder: index,
    active: true,
  }));

  // No natural unique key → delete-all then insert-fresh for idempotency.
  await db.delete(faqsContent);
  if (rows.length > 0) {
    await db.insert(faqsContent).values(rows);
  }

  console.log(`  ✓ ${rows.length} faqs seeded`);
}
