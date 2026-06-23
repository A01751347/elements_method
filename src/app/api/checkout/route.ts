import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/shared/db/client";
import { orders } from "@/shared/db/schema/orders";
import { createCheckoutSession } from "@/shared/integrations/stripe";

export const runtime = "nodejs";

const Schema = z.object({
  retreatSlug: z.string().max(120).optional(),
  pathSlug: z.string().max(120).optional(),
  email: z.string().email(),
  name: z.string().min(2).max(160),
  amountMxn: z.number().int().positive().max(2_000_000),
  productName: z.string().min(2).max(200),
  locale: z.enum(["es", "en"]).default("es"),
});

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

  const session = await createCheckoutSession({
    customerEmail: data.email,
    retreatSlug: data.retreatSlug,
    pathSlug: data.pathSlug,
    successPath: data.locale === "en" ? "/en/thank-you" : "/es/gracias",
    cancelPath:
      (data.retreatSlug
        ? data.locale === "en"
          ? `/en/retreats/${data.retreatSlug}`
          : `/es/retiros/${data.retreatSlug}`
        : data.locale === "en"
          ? "/en/retreats"
          : "/es/retiros"),
    metadata: { source: "site", customer_name: data.name },
    lines: [
      {
        productName: data.productName,
        amountMxn: data.amountMxn,
      },
    ],
  });

  if (!session.ok) {
    return NextResponse.json({ ok: false, error: session.error }, { status: 500 });
  }

  // Persist a draft order — best-effort; dev DB may not be reachable.
  try {
    const ivaRate = Number(process.env.IVA_RATE ?? "0.16");
    const subtotal = data.amountMxn / (1 + ivaRate);
    const iva = data.amountMxn - subtotal;
    const folio = `EM-${new Date().toISOString().slice(2, 7).replace("-", "")}-${Math.floor(
      Math.random() * 10000,
    )
      .toString()
      .padStart(4, "0")}`;
    await db.insert(orders).values({
      folio,
      buyerType: "persona",
      buyerName: data.name,
      buyerEmail: data.email,
      productIds: [],
      retreatId: null,
      subtotal: subtotal.toFixed(2),
      iva: iva.toFixed(2),
      total: String(data.amountMxn),
      currency: "MXN",
      language: data.locale,
      paymentMethod: "stripe",
      stripeSessionId: session.sessionId ?? null,
      status: "pending_payment",
    });
  } catch (e) {
    console.error("[checkout] order draft insert failed", e);
  }

  return NextResponse.json({
    ok: true,
    url: session.url,
    sessionId: session.sessionId,
    dryRun: !!session.dryRun,
  });
}
