import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orders } from "@/shared/db/schema/orders";
import { sendMail, emailLayout, escapeHtml, OPS_EMAIL } from "@/shared/integrations/resend";

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      id?: string;
      customer_email?: string;
      amount_total?: number;
      metadata?: Record<string, string>;
    };
    const sessionId = session.id;
    if (sessionId) {
      try {
        await db
          .update(orders)
          .set({ status: "paid", paidAt: new Date() })
          .where(eq(orders.stripeSessionId, sessionId));
      } catch (e) {
        console.error("[stripe:webhook] order update failed", e);
      }

      // Confirmation email to buyer
      if (session.customer_email) {
        const amountDisplay = session.amount_total
          ? `$${(session.amount_total / 100).toFixed(2)} ${(session as { currency?: string }).currency?.toUpperCase() ?? "MXN"}`
          : "—";
        void sendMail({
          to: session.customer_email,
          subject: "Pago recibido — Elements Method",
          html: emailLayout({
            title: "Pago recibido",
            preheader: "Confirmamos tu reserva.",
            body: `
              <p>Confirmamos tu pago de <strong>${escapeHtml(amountDisplay)}</strong>.</p>
              <p>En breve te enviamos un correo separado con los documentos a firmar (Contrato, NDA y Relevo) y la confirmación de logística.</p>
              <p style="margin-top:24px;font-size:12px;color:#5A5752;">Referencia: ${escapeHtml(sessionId)}</p>
            `,
          }),
        });
      }
      void sendMail({
        to: OPS_EMAIL,
        subject: `[Stripe] Pago confirmado · ${session.customer_email ?? sessionId}`,
        html: emailLayout({
          title: "Pago confirmado",
          body: `
            <p>Nueva orden pagada vía Stripe.</p>
            <ul>
              <li>Session: <code>${escapeHtml(sessionId)}</code></li>
              <li>Email: ${escapeHtml(session.customer_email ?? "—")}</li>
              <li>Metadata: <code>${escapeHtml(JSON.stringify(session.metadata ?? {}))}</code></li>
            </ul>
          `,
        }),
      });
    }
  }

  if (event.type === "checkout.session.async_payment_failed") {
    void sendMail({
      to: OPS_EMAIL,
      subject: "[Stripe] Pago FALLIDO async",
      html: emailLayout({
        title: "Pago async fallido",
        body: `<p>Revisar en dashboard Stripe.</p><pre style="font-size:11px;">${escapeHtml(
          JSON.stringify(event.data.object, null, 2),
        )}</pre>`,
      }),
    });
  }

  return NextResponse.json({ ok: true, received: event.type });
}
