/**
 * Folio generator — EM-MMAA-XXXX
 *
 * MM   — two-digit month
 * AA   — two-digit year
 * XXXX — zero-padded sequence number provided by the caller
 *        (usually a per-month counter from DB).
 */
export function generateFolio(date: Date, sequence: number): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const aa = String(date.getFullYear() % 100).padStart(2, "0");
  const xxxx = String(sequence).padStart(4, "0");
  return `EM-${mm}${aa}-${xxxx}`;
}
