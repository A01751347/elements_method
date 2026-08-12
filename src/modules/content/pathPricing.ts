import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { products } from "@/shared/db/schema";
import { safeRead } from "./safe";

/**
 * Program-detail slug (ES, e.g. "raices") → catalog product slug (e.g. "roots").
 *
 * The editorial program_details use Spanish slugs while the commerce `products`
 * table uses the English catalog slugs. This explicit map bridges the two so a
 * program page can look up its real price. Programs without a priced product
 * (brujula = custom workshop, soulfull = 1:1 immersion) intentionally have no
 * entry → no checkout button (they stay apply-first).
 */
const PROGRAM_TO_PRODUCT: Record<string, string> = {
  raices: "roots",
  corriente: "current",
  fuente: "source",
};

export interface PathPrice {
  productSlug: string;
  priceMxn: number;
  priceUsd: number | null;
  stripePriceIdMxn: string | null;
  nameEs: string;
}

/**
 * Resolve the purchasable price for a program-detail slug, or null when the
 * program has no priced product (→ the page keeps the apply-first CTA).
 */
export async function getPathPrice(
  programSlug: string,
): Promise<PathPrice | null> {
  const productSlug = PROGRAM_TO_PRODUCT[programSlug];
  if (!productSlug) return null;

  return safeRead(null, async () => {
    const rows = await db
      .select()
      .from(products)
      .where(and(eq(products.slug, productSlug), eq(products.active, true)))
      .limit(1);
    const p = rows[0];
    if (!p) return null;
    const priceMxn = Number(p.priceMxn);
    if (!Number.isFinite(priceMxn) || priceMxn <= 0) return null;
    return {
      productSlug: p.slug,
      priceMxn,
      priceUsd: p.priceUsd ? Number(p.priceUsd) : null,
      stripePriceIdMxn: p.stripePriceIdMxn,
      nameEs: p.nameEs,
    };
  });
}
