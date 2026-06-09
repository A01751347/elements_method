/**
 * Discount rules. Resolved at seed time after products are inserted, because
 * we need their numeric IDs (productCombinations.requiredProductIds expects ints).
 *
 * Source: docs/proyecto.md (INVERSIÓN) and docs/02_srs_elements_method_v3.md (RF-PRD-03).
 */
export interface DiscountSeed {
  name: string;
  /** product slugs (resolved to IDs at runtime) */
  requiredSlugs: string[];
  discountType: "percentage" | "fixed_amount";
  discountValue: string;
  active: boolean;
}

export const discountSeeds: DiscountSeed[] = [
  {
    name: "Cuatro elementos juntos · 15% off",
    requiredSlugs: ["tierra", "fuego", "agua", "aire"],
    discountType: "percentage",
    discountValue: "15.00",
    active: true,
  },
  // Early Bird and Group (3+) discounts in proyecto.md are operational
  // discounts (applied at checkout to whichever module). They are typed as
  // "fixed_amount" off the standard 25k per-module price.
  //
  // Early Bird: 25,000 - 22,000 = 3,000 off per module
  // Grupos 3+: 25,000 - 20,000 = 5,000 off per module
  //
  // We seed them as per-element rules so they apply when ONLY a single
  // element is in the cart. Discounts engine picks the best applicable rule.
  {
    name: "Early Bird · Tierra",
    requiredSlugs: ["tierra"],
    discountType: "fixed_amount",
    discountValue: "3000.00",
    active: false, // off by default — admin turns on per campaign
  },
  {
    name: "Early Bird · Fuego",
    requiredSlugs: ["fuego"],
    discountType: "fixed_amount",
    discountValue: "3000.00",
    active: false,
  },
  {
    name: "Early Bird · Agua",
    requiredSlugs: ["agua"],
    discountType: "fixed_amount",
    discountValue: "3000.00",
    active: false,
  },
  {
    name: "Early Bird · Aire",
    requiredSlugs: ["aire"],
    discountType: "fixed_amount",
    discountValue: "3000.00",
    active: false,
  },
];
