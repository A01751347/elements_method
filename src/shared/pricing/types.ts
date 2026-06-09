export type Currency = "MXN" | "USD";

export interface PricedProduct {
  id: number;
  slug: string;
  nameEs: string;
  nameEn: string | null;
  priceMxn: number;
  priceUsd: number | null;
}

export interface DiscountRule {
  id: string;
  name: string;
  requiredProductIds: number[];
  discountType: "percentage" | "fixed_amount";
  discountValue: number;
  active: boolean;
}

export interface PriceLineItem {
  productId: number;
  slug: string;
  name: string;
  unitPrice: number;
}

export interface AppliedDiscount {
  ruleId: string | null;
  ruleName: string | null;
  amount: number;
}

export interface PriceCalculation {
  subtotal: number;
  discount: AppliedDiscount;
  taxableBase: number;
  iva: number;
  total: number;
  currency: Currency;
  ivaRate: number;
  breakdown: PriceLineItem[];
}
