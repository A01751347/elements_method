import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orders } from "@/shared/db/schema/orders";
import {
  sendPaymentConfirmation,
  sendPaymentFailed,
  sendAwaitingAsyncPayment,
} from "@/shared/integrations/orderEmails";
import { retrieveSession } from "@/shared/integrations/stripe";

export const runtime = "nodejs";

/** Tolerance (seconds) for the webhook timestamp vs. now, to block replays. */
const SIGNATURE_TOLERANCE_SECONDS = 300;

/**
 * Verify a Stripe webhook signature WITHOUT the `stripe` npm package.
 *
 * Reproduces exactly what `stripe.webhooks.constructEvent` does:
 *   1. Parse the `Stripe-Signature` header → { t, v1[] }.
 *   2. Compute HMAC-SHA256 of `${t}.${rawBody}` keyed by the whsec secret.
 *   3. timing-safe-compare against any provided v1 signature.
 *   4. Reject if the timestamp is outside the tolerance window (replay guard).
 *
 * Returns true only when a v1 signature matches and the timestamp is fresh.
 */
function verifyStripeSignature(
  rawBody: string,
  header: string,
  secret: string,
): boolean {
  const parts = header.split(",").reduce<Record<string, string[]>>((acc, part) => {
    const [key, value] = part.split("=");
    if (!key || value === undefined) return acc;
    (acc[key] ??= []).push(value);
    return acc;
  }, {});

  const timestamp = parts["t"]?.[0];
  const signatures = parts["v1"] ?? [];
  if (!timestamp || signatures.length === 0) return false;

  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return false;
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSeconds - ts) > SIGNATURE_TOLERANCE_SECONDS) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`, "utf8")
    .digest("hex");
  const expectedBuf = Buffer.from(expected, "hex");

  return signatures.some((sig) => {
    let sigBuf: Buffer;
    try {
      sigBuf = Buffer.from(sig, "hex");
    } catch {
      return false;
    }
    return (
      sigBuf.length === expectedBuf.length &&
      crypto.timingSafeEqual(sigBuf, expectedBuf)
    );
  });
}

/**
 * Stripe webhook handler.
 *
 * SECURITY: when STRIPE_WEBHOOK_SECRET is configured, the request MUST carry a
 * valid `Stripe-Signature` header — otherwise it is rejected with 400. This
 * blocks forged `checkout.session.completed` events that would otherwise mark
 * orders as paid. Signature verification is HMAC-SHA256 done natively (no
 * `stripe` package needed).
 *
 * The unsigned path is allowed ONLY when no secret is set (local dev / dry-run),
 * so the flow can still be exercised with the Stripe CLI or curl before the
 * account is live.
 *
 * Handles minimum events for the launch:
 *   - checkout.session.completed → mark order paid + send confirmation
 *   - checkout.session.async_payment_failed → notify ops
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");

  const rawBody = await req.text();
  let event: { type: string; data: { object: Record<string, unknown> } };

  if (secret) {
    // Production: a secret is configured → signature is REQUIRED and verified.
    if (!sig || !verifyStripeSignature(rawBody, sig, secret)) {
      console.warn("[stripe:webhook] rejected: missing/invalid signature");
      return NextResponse.json(
        { ok: false, error: "INVALID_SIGNATURE" },
        { status: 400 },
      );
    }
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 });
    }
  } else {
    // Dev / dry-run only (no secret set): accept unsigned JSON.
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 });
    }
  }

  /**
   * Fulfilment events.
   *
   * `checkout.session.completed` fires as soon as the customer finishes the
   * form — NOT when money arrives. With a delayed-notification method (OXXO and
   * SPEI in Mexico, bank debits elsewhere) it arrives with
   * `payment_status: "unpaid"` and the real outcome lands hours or days later on
   * `async_payment_succeeded` / `async_payment_failed`. Fulfilling on
   * `completed` alone would hand over a paid program to someone who only
   * printed a voucher, so every path below is gated on `payment_status`.
   */
  const FULFILMENT_EVENTS = new Set([
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
  ]);

  if (FULFILMENT_EVENTS.has(event.type)) {
    const sessionObject = event.data.object as { id?: string };
    const sessionId = sessionObject.id;
    if (!sessionId) {
      return NextResponse.json({ ok: true, ignored: "no_session_id" });
    }

    // Stripe retries webhooks and can deliver the same event more than once.
    // Look the order up first and bail if it is already settled, so a replay
    // never re-stamps paidAt or sends the buyer a second confirmation.
    let order;
    try {
      [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.stripeSessionId, sessionId))
        .limit(1);
    } catch (e) {
      // Signal failure so Stripe retries rather than dropping the event.
      console.error("[stripe:webhook] order lookup failed", e);
      return NextResponse.json({ ok: false, error: "DB_ERROR" }, { status: 500 });
    }

    if (!order) {
      console.warn(`[stripe:webhook] no order for session ${sessionId}`);
      return NextResponse.json({ ok: true, ignored: "order_not_found" });
    }
    if (order.status === "paid") {
      return NextResponse.json({ ok: true, idempotent: true });
    }

    // Read the session back from the API rather than trusting the event body,
    // so the amounts we persist are Stripe's own and a stale replay can't
    // rewrite them.
    const fetched = await retrieveSession(sessionId);
    if (!fetched.ok) {
      console.error(`[stripe:webhook] could not retrieve ${sessionId}: ${fetched.error}`);
      return NextResponse.json({ ok: false, error: "RETRIEVE_FAILED" }, { status: 500 });
    }
    const session = fetched.session;

    // Not paid yet → the buyer has a voucher/transfer pending. Tell them what
    // to do and leave the order pending; the async event settles it later.
    if (session.payment_status === "unpaid") {
      try {
        await db
          .update(orders)
          .set({ status: "pending_payment", updatedAt: new Date() })
          .where(eq(orders.id, order.id));
      } catch (e) {
        console.error("[stripe:webhook] pending update failed", e);
      }
      await sendAwaitingAsyncPayment({ ...order, status: "pending_payment" });
      return NextResponse.json({ ok: true, awaiting: "async_payment" });
    }

    // The charged amount must match what we recorded. A mismatch means the
    // session was not the one we created for this order — record it and let a
    // human look rather than silently marking it paid.
    const expectedCents = Math.round(Number(order.total) * 100);
    if (
      typeof session.amount_total === "number" &&
      session.amount_total !== expectedCents
    ) {
      console.error(
        `[stripe:webhook] amount mismatch for ${order.folio}: charged ${session.amount_total}, expected ${expectedCents}`,
      );
      await sendPaymentFailed({
        reason: "AMOUNT_MISMATCH",
        folio: order.folio,
        chargedCents: session.amount_total,
        expectedCents,
        sessionId,
      });
      return NextResponse.json({ ok: true, flagged: "amount_mismatch" });
    }

    // When Stripe Tax computed the tax, its figures are authoritative — our
    // local IVA split was only an estimate. Reconcile so the receipt PDF and
    // the books show what was actually charged.
    const taxCents = session.total_details?.amount_tax;
    const reconciled =
      session.automatic_tax?.enabled && typeof taxCents === "number"
        ? {
            iva: (taxCents / 100).toFixed(2),
            subtotal: (((session.amount_total ?? 0) - taxCents) / 100).toFixed(2),
            total: ((session.amount_total ?? 0) / 100).toFixed(2),
          }
        : {};

    const paidAt = new Date();
    try {
      await db
        .update(orders)
        .set({ status: "paid", paidAt, updatedAt: paidAt, ...reconciled })
        .where(eq(orders.id, order.id));
    } catch (e) {
      console.error("[stripe:webhook] order update failed", e);
      return NextResponse.json({ ok: false, error: "DB_ERROR" }, { status: 500 });
    }

    // Awaited, not fire-and-forget: the serverless function can be frozen the
    // instant we return, which silently drops in-flight sends.
    await sendPaymentConfirmation(
      { ...order, ...reconciled, status: "paid", paidAt },
      { method: "stripe" },
    );
  }

  if (event.type === "checkout.session.async_payment_failed") {
    const sessionId = (event.data.object as { id?: string }).id;
    if (sessionId) {
      try {
        await db
          .update(orders)
          .set({ status: "cancelled", updatedAt: new Date() })
          .where(eq(orders.stripeSessionId, sessionId));
      } catch (e) {
        console.error("[stripe:webhook] could not cancel failed order", e);
      }
    }
    await sendPaymentFailed(event.data.object);
  }

  return NextResponse.json({ ok: true, received: event.type });
}
