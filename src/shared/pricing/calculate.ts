import type {
  AppliedDiscount,
  Currency,
  DiscountRule,
  PricedProduct,
  PriceCalculation,
  PriceLineItem,
} from "./types";

export const IVA_RATE = Number(process.env.IVA_RATE ?? "0.16");

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function unitPriceFor(product: PricedProduct, currency: Currency): number {
  if (currency === "MXN") return Number(product.priceMxn);
  if (product.priceUsd == null) {
    throw new Error(`Product ${product.slug} has no USD price`);
  }
  return Number(product.priceUsd);
}

function nameFor(product: PricedProduct, locale: "es" | "en"): string {
  if (locale === "en" && product.nameEn) return product.nameEn;
  return product.nameEs;
}

/**
 * Picks the discount rule that produces the largest reduction, given the
 * selected products. A rule applies only when EVERY required product is in
 * the cart. Returns null if no rule applies.
 */
function pickBestDiscount(
  productIds: number[],
  rules: DiscountRule[],
  subtotal: number
): { rule: DiscountRule; amount: number } | null {
  const selected = new Set(productIds);
  let best: { rule: DiscountRule; amount: number } | null = null;

  for (const rule of rules) {
    if (!rule.active) continue;
    const matchesAll = rule.requiredProductIds.every((id) => selected.has(id));
    if (!matchesAll) continue;

    const amount =
      rule.discountType === "percentage"
        ? round2(subtotal * (Number(rule.discountValue) / 100))
        : round2(Number(rule.discountValue));

    if (!best || amount > best.amount) {
      best = { rule, amount };
    }
  }
  return best;
}

export interface CalculateOptions {
  productIds: number[];
  products: PricedProduct[];
  currency: Currency;
  discountRules?: DiscountRule[];
  locale?: "es" | "en";
  ivaRate?: number;
}

export function calculateOrderTotal({
  productIds,
  products,
  currency,
  discountRules = [],
  locale = "es",
  ivaRate = IVA_RATE,
}: CalculateOptions): PriceCalculation {
  const byId = new Map(products.map((p) => [p.id, p]));

  const breakdown: PriceLineItem[] = productIds.map((id) => {
    const product = byId.get(id);
    if (!product) {
      throw new Error(`Product ${id} not found in pricing input`);
    }
    return {
      productId: product.id,
      slug: product.slug,
      name: nameFor(product, locale),
      unitPrice: round2(unitPriceFor(product, currency)),
    };
  });

  const subtotal = round2(breakdown.reduce((sum, li) => sum + li.unitPrice, 0));

  const best = pickBestDiscount(productIds, discountRules, subtotal);
  const discount: AppliedDiscount = best
    ? { ruleId: best.rule.id, ruleName: best.rule.name, amount: best.amount }
    : { ruleId: null, ruleName: null, amount: 0 };

  const taxableBase = round2(Math.max(0, subtotal - discount.amount));
  const iva = round2(taxableBase * ivaRate);
  const total = round2(taxableBase + iva);

  return {
    subtotal,
    discount,
    taxableBase,
    iva,
    total,
    currency,
    ivaRate,
    breakdown,
  };
}

/**
 * Formats a money amount using Intl, respecting locale and currency.
 */
export function formatMoney(
  amount: number,
  currency: Currency,
  locale: "es" | "en" = "es"
): string {
  const tag = locale === "es" ? "es-MX" : "en-US";
  return new Intl.NumberFormat(tag, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
