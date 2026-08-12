/**
 * Pure enterprise-quote math — no server-only imports, so BOTH the server
 * (API + PDF) and the client (live calculator preview) can use it.
 * The DB-backed config loader lives in `enterprise.ts` (server-only).
 */

export type Modality = "presencial" | "virtual" | "hibrido";
export type QuoteCurrency = "MXN" | "USD";

export interface PeopleTier {
  min: number;
  max: number;
  multiplier: number;
}
export interface VolumeDiscount {
  thresholdMxn: number;
  discountPct: number;
}

export interface CalculatorConfigResolved {
  basePerSessionMxn: number;
  basePerSessionUsd: number;
  minPeople: number;
  minSessions: number;
  modalityMultiplier: Record<Modality, number>;
  peopleTiers: PeopleTier[];
  volumeDiscount: VolumeDiscount[];
  validityDays: number;
  ivaRate: number;
}

export interface QuoteInput {
  people: number;
  sessions: number;
  modality: Modality;
  currency: QuoteCurrency;
}

export interface QuoteBreakdown {
  people: number;
  sessions: number;
  modality: Modality;
  currency: QuoteCurrency;
  basePerSession: number;
  peopleMultiplier: number;
  modalityMultiplier: number;
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  taxableBase: number;
  ivaRate: number;
  iva: number;
  total: number;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function peopleMultiplier(people: number, tiers: PeopleTier[]): number {
  const tier = tiers.find((t) => people >= t.min && people <= t.max);
  if (tier) return tier.multiplier;
  const last = tiers[tiers.length - 1];
  return last ? last.multiplier : 1;
}

/** Compute a full enterprise quote breakdown from validated inputs + config. */
export function computeQuote(
  input: QuoteInput,
  cfg: CalculatorConfigResolved,
): QuoteBreakdown {
  const people = Math.max(input.people, cfg.minPeople);
  const sessions = Math.max(input.sessions, cfg.minSessions);
  const basePerSession =
    input.currency === "USD" ? cfg.basePerSessionUsd : cfg.basePerSessionMxn;
  const pMult = peopleMultiplier(people, cfg.peopleTiers);
  const mMult = cfg.modalityMultiplier[input.modality] ?? 1;

  const subtotal = round2(basePerSession * sessions * pMult * mMult);

  const subtotalMxnEquivalent =
    input.currency === "USD"
      ? subtotal * (cfg.basePerSessionMxn / cfg.basePerSessionUsd)
      : subtotal;
  const applicable = [...cfg.volumeDiscount]
    .sort((a, b) => b.thresholdMxn - a.thresholdMxn)
    .find((v) => subtotalMxnEquivalent >= v.thresholdMxn);
  const discountPct = applicable?.discountPct ?? 0;
  const discountAmount = round2(subtotal * (discountPct / 100));

  const taxableBase = round2(subtotal - discountAmount);
  const iva = round2(taxableBase * cfg.ivaRate);
  const total = round2(taxableBase + iva);

  return {
    people,
    sessions,
    modality: input.modality,
    currency: input.currency,
    basePerSession,
    peopleMultiplier: pMult,
    modalityMultiplier: mMult,
    subtotal,
    discountPct,
    discountAmount,
    taxableBase,
    ivaRate: cfg.ivaRate,
    iva,
    total,
  };
}
