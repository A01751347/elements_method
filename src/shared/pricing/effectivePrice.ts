/**
 * Early-access pricing resolution.
 *
 * Catalog products may carry an early-access price (`earlyPriceMxn`) valid
 * until `earlyDeadline`. Every server-side consumer that charges or displays a
 * product price must go through this helper so the switch from early to
 * official price happens automatically at the deadline — no redeploy, no
 * admin edit.
 */

export interface EarlyPriceable {
  priceMxn: string | number;
  earlyPriceMxn?: string | number | null;
  earlyDeadline?: Date | string | null;
}

export interface EffectivePrice {
  /** The amount to charge right now, in MXN. */
  amountMxn: number;
  /** The official (non-early) price, in MXN. */
  officialMxn: number;
  /** True when the early-access window is active and its price applies. */
  earlyActive: boolean;
  /** The early-access deadline, when one exists. */
  earlyDeadline: Date | null;
}

export function resolveEffectivePriceMxn(
  product: EarlyPriceable,
  now: Date = new Date(),
): EffectivePrice {
  const officialMxn = Number(product.priceMxn);
  const earlyMxn =
    product.earlyPriceMxn != null ? Number(product.earlyPriceMxn) : null;
  const deadline =
    product.earlyDeadline != null ? new Date(product.earlyDeadline) : null;

  const earlyActive =
    earlyMxn != null &&
    Number.isFinite(earlyMxn) &&
    earlyMxn > 0 &&
    deadline != null &&
    !Number.isNaN(deadline.getTime()) &&
    now.getTime() <= deadline.getTime();

  return {
    amountMxn: earlyActive ? (earlyMxn as number) : officialMxn,
    officialMxn,
    earlyActive,
    earlyDeadline: deadline,
  };
}
