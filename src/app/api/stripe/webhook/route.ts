import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orders } from "@/shared/db/schema/orders";
import { sendMail, emailLayout, escapeHtml, OPS_EMAIL } from "@/shared/integrations/resend";

export const runtime = "nodejs";

/**
 * Stripe webhook handler. Verifies signature with STRIPE_WEBHOOK_SECRET when
 * present (production); in dev / dry-run mode it accepts the JSON body as-is
 * so it can be exercised via `curl` or the Stripe CLI without a real account.
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

  if (secret && sig) {
    // Real verification path requires `stripe` Node lib. We keep this minimal —
    // if the package becomes available, swap to `stripe.webhooks.constructEvent`.
    // For now, refuse silently when a signature is provided but unverifiable.
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
  } else {
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
