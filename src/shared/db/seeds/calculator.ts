/**
 * Calculator config seed. The formula is editable from admin (RF-EMP-03).
 * Real formula is P-02 in the cronograma — to be defined by client.
 *
 * Provisional formula (placeholder until client confirms):
 *   total = base_per_session
 *         * number_of_sessions
 *         * people_multiplier(number_of_people)
 *         * modality_multiplier(modality)
 *         - volume_discount(total_above_threshold)
 */
export const calculatorConfigSeeds: { key: string; value: unknown }[] = [
  { key: "base_per_session_mxn", value: 60000 },
  { key: "base_per_session_usd", value: 3300 },
  {
    key: "people_tiers",
    value: [
      { min: 1, max: 8, multiplier: 1.0 },
      { min: 9, max: 15, multiplier: 1.4 },
      { min: 16, max: 25, multiplier: 1.9 },
      { min: 26, max: 50, multiplier: 2.6 },
    ],
  },
  {
    key: "modality_multiplier",
    value: { presencial: 1.0, virtual: 0.6, hibrido: 0.85 },
  },
  {
    key: "volume_discount",
    value: [
      { thresholdMxn: 300000, discountPct: 5 },
      { thresholdMxn: 600000, discountPct: 10 },
      { thresholdMxn: 1000000, discountPct: 15 },
    ],
  },
  { key: "min_people", value: 4 },
  { key: "min_sessions", value: 1 },
  { key: "validity_days", value: 30 },
];
