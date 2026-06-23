import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orders } from "@/shared/db/schema/orders";
import { sendMail, emailLayout, escapeHtml, OPS_EMAIL } from "@/shared/integrations/resend";

export const runtime = "nodejs";

/**
 * Records a SPEI / bank transfer proof against an existing order.
 *
 * In production, `proofUrl` should be the result of a Vercel Blob upload
 * triggered from the client. We keep upload server-driven here for simplicity
 * and accept a URL after the client uploads via signed PUT.
 */
const Schema = z.object({
  folio: z.string().min(8).max(60),
  email: z.string().email().max(200),
  proofUrl: z.string().url().max(800),
  amountMxn: z.number().int().positive().optional(),
  reference: z.string().max(120).optional(),
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
  const { folio, email, proofUrl, amountMxn, reference } = parsed.data;

  try {
    const [order] = await db
      .select({
        id: orders.id,
        buyerEmail: orders.buyerEmail,
        status: orders.status,
      })
      .from(orders)
      .where(eq(orders.folio, folio))
      .limit(1);
    if (!order) {
      return NextResponse.json({ ok: false, error: "ORDER_NOT_FOUND" }, { status: 404 });
    }
    if (order.buyerEmail.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ ok: false, error: "EMAIL_MISMATCH" }, { status: 403 });
    }
    await db
      .update(orders)
      .set({
        transferProofUrl: proofUrl,
        status: "pending_transfer_validation",
      })
      .where(eq(orders.id, order.id));
  } catch (e) {
    console.error("[transferencias] DB update failed", e);
  }

  void sendMail({
    to: OPS_EMAIL,
    subject: `[Transferencia recibida] Folio ${folio}`,
    html: emailLayout({
      title: "Transferencia recibida",
      body: `
        <p>Comprobante de transferencia subido por el comprador.</p>
        <ul>
          <li>Folio: <code>${escapeHtml(folio)}</code></li>
          <li>Email: ${escapeHtml(email)}</li>
          ${amountMxn ? `<li>Monto declarado: $${amountMxn.toLocaleString()} MXN</li>` : ""}
          ${reference ? `<li>Referencia: ${escapeHtml(reference)}</li>` : ""}
          <li><a href="${escapeHtml(proofUrl)}">Ver comprobante →</a></li>
        </ul>
        <p style="margin-top:18px;">Validar en <a href="https://elementsmethod.com/admin/transferencias">/admin/transferencias</a>.</p>
      `,
    }),
  });

  return NextResponse.json({ ok: true });
}
