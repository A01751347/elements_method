import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/shared/db/client";
import { orders, products, documentTemplates, orderDocuments } from "@/shared/db/schema";
import {
  createCheckoutSession,
  shouldUseAutomaticTax,
} from "@/shared/integrations/stripe";
import { sendTransferInstructions } from "@/shared/integrations/orderEmails";
import { buildLegalDocPdf } from "@/shared/pdf/legalDoc";
import { withFolio } from "@/shared/pricing/folio";
import { resolveEffectivePriceMxn } from "@/shared/pricing/effectivePrice";
import { legalDocTokens } from "@/shared/pdf/legalTokens";
import { isPaymentMethodEnabled } from "@/shared/payments/methods";
import { getBankDetails } from "@/shared/payments/bank";

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
  /** Contact phone (WhatsApp) — ops uses it to follow up on deposits. */
  phone: z.string().trim().min(7).max(30),
  /** Company paying for or sponsoring the seat, if any. */
  company: z.string().trim().max(160).optional(),
  locale: z.enum(["es", "en"]).default("es"),
  acceptedDocs: z.array(z.string().max(120)).max(20).optional(),
  /**
   * `stripe` redirects to Stripe Checkout. `transferencia` registers the order
   * as awaiting a deposit / SPEI and emails the bank details (or a promise to
   * send them) — the purchase is confirmed later from /admin/transferencias.
   */
  paymentMethod: z.enum(["stripe", "transferencia"]).default("stripe"),
});

type CheckoutInput = z.infer<typeof Schema>;

/**
 * For each accepted document, generate the personalized PDF, hash it, and store
 * an immutable acceptance record in order_documents. Best-effort per document:
 * a failure here must not undo a payment the buyer already authorized.
 */
async function recordAcceptedDocs(
  order: typeof orders.$inferSelect,
  data: CheckoutInput,
  productName: string,
) {
  // Same tokens and reference as /api/documento, so the hash pinned here is
  // the document the buyer can later download.
  const tokens = legalDocTokens({
    order,
    lang: data.locale,
    productNames: productName,
  });
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
        tokens,
        reference: order.folio,
      });

      await db.insert(orderDocuments).values({
        orderId: order.id,
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

/**
 * Attach the participation documents (contrato / NDA / relevo) to the order
 * as PENDING signatures. Nothing is accepted here: the payment-confirmation
 * email turns each row into a one-time /firmar link. The hash pins the exact
 * wording the participant will be asked to sign.
 */
async function attachPostPurchaseDocs(
  order: typeof orders.$inferSelect,
  data: CheckoutInput,
  productName: string,
) {
  let templates: (typeof documentTemplates.$inferSelect)[] = [];
  try {
    templates = await db
      .select()
      .from(documentTemplates)
      .where(
        and(
          eq(documentTemplates.active, true),
          eq(documentTemplates.acceptanceType, "signature_upload"),
        ),
      );
  } catch (e) {
    console.error("[checkout] post-purchase docs lookup failed", e);
    return;
  }
  const tokens = legalDocTokens({ order, lang: data.locale, productNames: productName });
  const buyerType = order.buyerType;
  for (const tpl of templates) {
    if (tpl.appliesTo !== "ambos" && tpl.appliesTo !== buyerType) continue;
    try {
      const templateMarkdown =
        data.locale === "en" ? tpl.templateHtmlEn ?? tpl.templateHtmlEs : tpl.templateHtmlEs;
      const { hash } = await buildLegalDocPdf({
        name: data.locale === "en" ? tpl.nameEn ?? tpl.nameEs : tpl.nameEs,
        templateMarkdown,
        tokens,
        reference: order.folio,
      });
      await db.insert(orderDocuments).values({
        orderId: order.id,
        documentTemplateId: tpl.id,
        documentVersion: tpl.currentVersion,
        generatedPdfUrl: `/api/documento/${tpl.slug}`,
        generatedPdfHash: hash,
        accepted: false,
      });
    } catch (e) {
      console.error(`[checkout] attach post-purchase doc ${tpl.slug} failed`, e);
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

  // The public button only shows enabled methods; re-check here so a method
  // hidden by config (e.g. card while Stripe is still in setup) can't be
  // reached by hand-crafting the request.
  if (!isPaymentMethodEnabled(data.paymentMethod)) {
    return NextResponse.json({ ok: false, error: "METHOD_DISABLED" }, { status: 409 });
  }

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
  const isTransfer = data.paymentMethod === "transferencia";
  const automaticTax = isTransfer ? false : await shouldUseAutomaticTax();
  const ivaRate = Number(process.env.IVA_RATE ?? "0.16");
  const subtotal = amountMxn / (1 + ivaRate);
  const iva = amountMxn - subtotal;

  let order: typeof orders.$inferSelect;
  try {
    order = await withFolio(async (folio) => {
      const [row] = await db
        .insert(orders)
        .values({
          folio,
          buyerType: "persona",
          buyerName: data.name,
          buyerEmail: data.email,
          buyerPhone: data.phone,
          buyerCompany: data.company || null,
          productIds: [product.id],
          retreatId: null,
          subtotal: subtotal.toFixed(2),
          iva: iva.toFixed(2),
          total: amountMxn.toFixed(2),
          currency: "MXN",
          language: data.locale,
          paymentMethod: data.paymentMethod,
          // Both methods start here. A transfer order moves to
          // pending_transfer_validation when the buyer uploads a proof, and to
          // paid when an admin validates it.
          status: "pending_payment",
        })
        .returning();
      return row;
    });
  } catch (e) {
    console.error("[checkout] order insert failed", e);
    return NextResponse.json({ ok: false, error: "ORDER_CREATE_FAILED" }, { status: 500 });
  }

  // ── 3a. Deposit / SPEI: no payment session, email the instructions ────
  if (isTransfer) {
    if (data.acceptedDocs && data.acceptedDocs.length > 0) {
      await recordAcceptedDocs(order, data, productName);
    }
    await attachPostPurchaseDocs(order, data, productName);

    // Email failures are logged inside sendAll; the order is already recorded
    // and ops can still see it in /admin/transferencias.
    await sendTransferInstructions(order, {
      productName,
      bank: getBankDetails(),
    });

    const nextUrl =
      `/${data.locale}/transferencia` +
      `?folio=${encodeURIComponent(order.folio)}&email=${encodeURIComponent(data.email)}`;

    return NextResponse.json({
      ok: true,
      method: "transferencia",
      url: nextUrl,
      folio: order.folio,
      amountMxn,
    });
  }

  // ── 3b. Create the Stripe session ─────────────────────────────────────
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
    await recordAcceptedDocs(order, data, productName);
  }
  await attachPostPurchaseDocs(order, data, productName);

  return NextResponse.json({
    ok: true,
    method: "stripe",
    url: session.url,
    sessionId: session.sessionId,
    folio: order.folio,
    amountMxn,
    dryRun: !!session.dryRun,
  });
}
