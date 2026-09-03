import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/shared/db/client";
import { orders, products, documentTemplates, orderDocuments } from "@/shared/db/schema";
import {
  createCheckoutSession,
  shouldUseAutomaticTax,
} from "@/shared/integrations/stripe";
import { buildLegalDocPdf } from "@/shared/pdf/legalDoc";
import { withFolio } from "@/shared/pricing/folio";
import { resolveEffectivePriceMxn } from "@/shared/pricing/effectivePrice";

export const runtime = "nodejs";

/**
 * The amount is NOT accepted from the client. The browser sends only which
 * product it wants; price, name and currency are read from the `products` table
 * so a tampered request can't create a Stripe session for an arbitrary sum.
 */
const Schema = z.object({
  productSlug: z.string().min(1).max(120),
  retreatSlug: z.string().max(120).optional(),
  email: z.string().email(),
  name: z.string().min(2).max(160),
  locale: z.enum(["es", "en"]).default("es"),
  acceptedDocs: z.array(z.string().max(120)).max(20).optional(),
});

type CheckoutInput = z.infer<typeof Schema>;

/**
 * For each accepted document, generate the personalized PDF, hash it, and store
 * an immutable acceptance record in order_documents. Best-effort per document:
 * a failure here must not undo a payment the buyer already authorized.
 */
async function recordAcceptedDocs(
  orderId: string,
  data: CheckoutInput,
  amountMxn: number,
) {
  for (const slug of data.acceptedDocs ?? []) {
    try {
      const tplRows = await db
        .select()
        .from(documentTemplates)
        .where(
          and(
            eq(documentTemplates.slug, slug),
            eq(documentTemplates.active, true),
          ),
        )
        .limit(1);
      const tpl = tplRows[0];
      if (!tpl) continue;

      const templateMarkdown =
        data.locale === "en"
          ? tpl.templateHtmlEn ?? tpl.templateHtmlEs
          : tpl.templateHtmlEs;
      const { hash } = await buildLegalDocPdf({
        name: data.locale === "en" ? tpl.nameEn ?? tpl.nameEs : tpl.nameEs,
        templateMarkdown,
        tokens: {
          PARTICIPANTE_NOMBRE: data.name,
          PARTICIPANTE_EMAIL: data.email,
          INVERSION_MXN: amountMxn.toLocaleString("es-MX"),
        },
      });

      await db.insert(orderDocuments).values({
        orderId,
        documentTemplateId: tpl.id,
        documentVersion: tpl.currentVersion,
        // The PDF is generated on demand from /api/documento; the hash pins the
        // exact accepted content/version.
        generatedPdfUrl: `/api/documento/${slug}`,
        generatedPdfHash: hash,
        accepted: true,
        acceptedAt: new Date(),
      });
    } catch (e) {
      console.error(`[checkout] record accepted doc ${slug} failed`, e);
    }
  }
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = Schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "VALIDATION", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const data = parsed.data;

  // ── 1. Resolve the real price from the catalog ────────────────────────
  let product;
  try {
    [product] = await db
      .select()
      .from(products)
      .where(and(eq(products.slug, data.productSlug), eq(products.active, true)))
      .limit(1);
  } catch (e) {
    console.error("[checkout] product lookup failed", e);
    return NextResponse.json({ ok: false, error: "DB_ERROR" }, { status: 500 });
  }
  if (!product) {
    return NextResponse.json({ ok: false, error: "PRODUCT_NOT_FOUND" }, { status: 404 });
  }

  // Early-access windows (e.g. EQUINOX / SOUL Discovery) switch the charged
  // amount automatically at their deadline; the client never sends a price.
  const effective = resolveEffectivePriceMxn(product);
  const amountMxn = effective.amountMxn;
  if (!Number.isFinite(amountMxn) || amountMxn <= 0) {
    return NextResponse.json({ ok: false, error: "PRODUCT_NOT_PURCHASABLE" }, { status: 409 });
  }
  const productName =
    data.locale === "en" ? product.nameEn ?? product.nameEs : product.nameEs;

  // ── 2. Persist the order BEFORE creating the payment session ──────────
  // If the DB is down we must fail here, not after the buyer has been charged
  // for an order that was never recorded.
  //
  // The IVA split written here is provisional. When Stripe Tax is live it
  // computes the real figures from the buyer's address, and the webhook
  // overwrites subtotal/iva/total with Stripe's numbers before the receipt is
  // ever generated. With tax off, this local split is the final word.
  const automaticTax = await shouldUseAutomaticTax();
  const ivaRate = Number(process.env.IVA_RATE ?? "0.16");
  const subtotal = amountMxn / (1 + ivaRate);
  const iva = amountMxn - subtotal;

  let order: { id: string; folio: string };
  try {
    order = await withFolio(async (folio) => {
      const [row] = await db
        .insert(orders)
        .values({
          folio,
          buyerType: "persona",
          buyerName: data.name,
          buyerEmail: data.email,
          productIds: [product.id],
          retreatId: null,
          subtotal: subtotal.toFixed(2),
          iva: iva.toFixed(2),
          total: amountMxn.toFixed(2),
          currency: "MXN",
          language: data.locale,
          paymentMethod: "stripe",
          status: "pending_payment",
        })
        .returning({ id: orders.id, folio: orders.folio });
      return row;
    });
  } catch (e) {
    console.error("[checkout] order insert failed", e);
    return NextResponse.json({ ok: false, error: "ORDER_CREATE_FAILED" }, { status: 500 });
  }

  // ── 3. Create the Stripe session ──────────────────────────────────────
  const session = await createCheckoutSession({
    customerEmail: data.email,
    retreatSlug: data.retreatSlug,
    pathSlug: data.productSlug,
    successPath: data.locale === "en" ? "/en/thank-you" : "/es/gracias",
    cancelPath:
      data.retreatSlug
        ? data.locale === "en"
          ? `/en/retreats/${data.retreatSlug}`
          : `/es/retiros/${data.retreatSlug}`
        : data.locale === "en"
          ? "/en/paths"
          : "/es/los-caminos",
    metadata: {
      source: "site",
      customer_name: data.name,
      folio: order.folio,
      order_id: order.id,
    },
    automaticTax,
    lines: [
      {
        // Prefer the Stripe Price when the catalog has one; otherwise charge the
        // DB amount so the admin stays the single source of truth for pricing.
        // A stored Stripe Price holds the OFFICIAL amount, so while an
        // early-access window is active we must charge ad-hoc instead.
        priceId: effective.earlyActive
          ? undefined
          : product.stripePriceIdMxn ?? undefined,
        productName,
        amountMxn,
        // Catalog prices are quoted IVA included, so the customer pays the same
        // number whether or not Stripe Tax is on.
        taxBehavior: "inclusive",
      },
    ],
  });

  if (!session.ok) {
    // Don't leave a phantom pending order behind when payment never started.
    try {
      await db
        .update(orders)
        .set({ status: "cancelled", updatedAt: new Date() })
        .where(eq(orders.id, order.id));
    } catch (e) {
      console.error("[checkout] could not cancel orphan order", e);
    }
    return NextResponse.json({ ok: false, error: session.error }, { status: 502 });
  }

  // ── 4. Attach the session + snapshot accepted documents ───────────────
  try {
    await db
      .update(orders)
      .set({ stripeSessionId: session.sessionId ?? null, updatedAt: new Date() })
      .where(eq(orders.id, order.id));
  } catch (e) {
    console.error("[checkout] could not attach stripe session id", e);
  }

  if (data.acceptedDocs && data.acceptedDocs.length > 0) {
    await recordAcceptedDocs(order.id, data, amountMxn);
  }

  return NextResponse.json({
    ok: true,
    url: session.url,
    sessionId: session.sessionId,
    folio: order.folio,
    amountMxn,
    dryRun: !!session.dryRun,
  });
}
