import "server-only";
import { db } from "@/shared/db/client";
import { calculatorConfig } from "@/shared/db/schema";
import { safeRead } from "@/modules/content/safe";
import type {
  CalculatorConfigResolved,
  Modality,
  PeopleTier,
  VolumeDiscount,
} from "./enterpriseCompute";

/**
 * Server-only enterprise-quote config loader. The pure math (`computeQuote`)
 * and all types live in `./enterpriseCompute` so the client calculator can
 * import them too. Re-exported here for existing server-side import sites.
 *
 * Formula (driven entirely by `calculator_config` so the client can tune it
 * without a deploy): basePerSession · sessions · peopleTierMultiplier ·
 * modalityMultiplier − volume discount + IVA.
 */
export * from "./enterpriseCompute";

const DEFAULTS: CalculatorConfigResolved = {
  basePerSessionMxn: 60000,
  basePerSessionUsd: 3300,
  minPeople: 4,
  minSessions: 1,
  modalityMultiplier: { presencial: 1, virtual: 0.6, hibrido: 0.85 },
  peopleTiers: [
    { min: 1, max: 8, multiplier: 1 },
    { min: 9, max: 15, multiplier: 1.4 },
    { min: 16, max: 25, multiplier: 1.9 },
    { min: 26, max: 50, multiplier: 2.6 },
  ],
  volumeDiscount: [
    { thresholdMxn: 300000, discountPct: 5 },
    { thresholdMxn: 600000, discountPct: 10 },
    { thresholdMxn: 1000000, discountPct: 15 },
  ],
  validityDays: 30,
  ivaRate: Number(process.env.IVA_RATE ?? "0.16"),
};

/** Load and normalize the calculator config from the DB (with safe defaults). */
export async function getCalculatorConfig(): Promise<CalculatorConfigResolved> {
  return safeRead(DEFAULTS, async () => {
    const rows = await db.select().from(calculatorConfig);
    const map = new Map(rows.map((r) => [r.key, r.value]));
    const num = (k: string, d: number) => {
      const v = map.get(k);
      return typeof v === "number" ? v : d;
    };
    return {
      basePerSessionMxn: num("base_per_session_mxn", DEFAULTS.basePerSessionMxn),
      basePerSessionUsd: num("base_per_session_usd", DEFAULTS.basePerSessionUsd),
      minPeople: num("min_people", DEFAULTS.minPeople),
      minSessions: num("min_sessions", DEFAULTS.minSessions),
      modalityMultiplier:
        (map.get("modality_multiplier") as Record<Modality, number>) ??
        DEFAULTS.modalityMultiplier,
      peopleTiers:
        (map.get("people_tiers") as PeopleTier[]) ?? DEFAULTS.peopleTiers,
      volumeDiscount:
        (map.get("volume_discount") as VolumeDiscount[]) ??
        DEFAULTS.volumeDiscount,
      validityDays: num("validity_days", DEFAULTS.validityDays),
      ivaRate: DEFAULTS.ivaRate,
    };
  });
}
