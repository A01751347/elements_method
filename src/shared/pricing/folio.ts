import { sql } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orders } from "@/shared/db/schema/orders";

/**
 * Folio generator — EM-AAMM-XXXX
 *
 * AA   — two-digit year
 * MM   — two-digit month
 * XXXX — zero-padded sequence, restarting each month.
 *
 * Note the order is year-then-month, matching the folios already issued
 * (e.g. EM-2608-5573 = 2026-08). `orders.folio` is UNIQUE, so the sequence is
 * allocated from the DB and the caller retries on conflict rather than hoping
 * a random number doesn't collide.
 */
export function folioPrefix(date: Date): string {
  const aa = String(date.getFullYear() % 100).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `EM-${aa}${mm}`;
}

export function generateFolio(date: Date, sequence: number): string {
  return `${folioPrefix(date)}-${String(sequence).padStart(4, "0")}`;
}

/**
 * Next free sequence number for the month of `date`.
 *
 * Reads the highest suffix already used under this month's prefix. Two requests
 * racing here get the same number; the UNIQUE constraint catches it and
 * `withFolio` retries with the next one.
 */
export async function nextFolioSequence(date: Date): Promise<number> {
  const prefix = folioPrefix(date);
  const rows = await db
    .select({
      max: sql<number>`COALESCE(MAX(NULLIF(regexp_replace(${orders.folio}, '^.*-', ''), '')::int), 0)`,
    })
    .from(orders)
    // Restrict to the exact EM-AAMM-NNNN shape so a hand-entered folio with a
    // non-numeric suffix can't break the ::int cast.
    .where(sql`${orders.folio} ~ ${"^" + prefix + "-[0-9]{4}$"}`);
  return Number(rows[0]?.max ?? 0) + 1;
}

/**
 * Postgres unique-violation (SQLSTATE 23505).
 *
 * Drizzle wraps driver errors in a generic `Failed query: …` Error, so the
 * SQLSTATE lives on `cause`, not on the thrown error — walk the chain rather
 * than checking only the top level, or every collision looks like a fatal error
 * and the retry never happens.
 */
function isUniqueViolation(e: unknown): boolean {
  for (let cur = e, depth = 0; cur && depth < 5; depth++) {
    const err = cur as { code?: string; constraint?: string; message?: string; cause?: unknown };
    if (err.code === "23505") return true;
    if (err.message && /duplicate key|unique constraint/i.test(err.message)) return true;
    cur = err.cause;
  }
  return false;
}

/**
 * Run `insert` with a freshly allocated folio, retrying on collision.
 *
 * `insert` receives the candidate folio and must perform the actual INSERT, so
 * the uniqueness check and the write happen together — the Neon HTTP driver has
 * no transactions, and this retry loop is what keeps folios unique under
 * concurrency.
 *
 * Each attempt re-reads the current maximum and, from the second attempt on,
 * adds a widening random offset. Without the jitter, concurrent writers all
 * recompute the same "next" number and march in lockstep, colliding on every
 * attempt. Gaps in the sequence are acceptable: a folio is a reference, not an
 * accounting series.
 */
export async function withFolio<T>(
  insert: (folio: string) => Promise<T>,
  date: Date = new Date(),
  attempts = 8,
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < attempts; i++) {
    const base = await nextFolioSequence(date);
    const sequence = i === 0 ? base : base + Math.floor(Math.random() * (i + 2));
    try {
      return await insert(generateFolio(date, sequence));
    } catch (e) {
      if (!isUniqueViolation(e)) throw e;
      lastError = e;
    }
  }
  throw lastError ?? new Error("Could not allocate a unique folio");
}
