import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orders } from "@/shared/db/schema/orders";
import { keyFromUrl } from "@/shared/integrations/s3";
import { sendMail, emailLayout, escapeHtml, OPS_EMAIL, appUrl } from "@/shared/integrations/resend";

export const runtime = "nodejs";

/**
 * Records a SPEI / bank transfer proof against an existing order.
 *
 * `proofUrl` must be an object on our own S3 bucket — it comes from
 * /api/uploads/comprobante, which already verified folio+email and generated
 * the key server-side. Rejecting anything else stops an arbitrary link from
 * being stored on the order and mailed to ops.
 *
 * The field is optional: when storage isn't configured the buyer sends the
 * proof by email instead, and we still record the declared amount/reference so
 * ops can reconcile.
 */
const Schema = z.object({
  folio: z.string().min(8).max(60),
  email: z.string().email().max(200),
  proofUrl: z.string().url().max(800).optional(),
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

  // Only accept a proof that lives on our bucket under the proofs prefix.
  let proofKey: string | null = null;
  if (proofUrl) {
    proofKey = keyFromUrl(proofUrl);
    if (!proofKey || !proofKey.startsWith("comprobantes/")) {
      return NextResponse.json(
        { ok: false, error: "INVALID_PROOF_URL" },
        { status: 422 },
      );
    }
  }

  let order: { id: string; buyerEmail: string; status: string } | undefined;
  try {
    [order] = await db
      .select({
        id: orders.id,
        buyerEmail: orders.buyerEmail,
        status: orders.status,
      })
      .from(orders)
      .where(eq(orders.folio, folio))
      .limit(1);
  } catch (e) {
    console.error("[transferencias] order lookup failed", e);
    return NextResponse.json({ ok: false, error: "DB_ERROR" }, { status: 500 });
  }

  if (!order) {
    return NextResponse.json({ ok: false, error: "ORDER_NOT_FOUND" }, { status: 404 });
  }
  if (order.buyerEmail.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json({ ok: false, error: "EMAIL_MISMATCH" }, { status: 403 });
  }
  // Don't let a paid order be knocked back into review by a late submission.
  if (order.status === "paid") {
    return NextResponse.json({ ok: true, alreadyPaid: true });
  }

  try {
    await db
      .update(orders)
      .set({
        ...(proofUrl ? { transferProofUrl: proofUrl } : {}),
        status: "pending_transfer_validation",
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));
  } catch (e) {
    console.error("[transferencias] DB update failed", e);
    return NextResponse.json({ ok: false, error: "DB_ERROR" }, { status: 500 });
  }

  // Link through the admin-gated viewer so the bucket can stay private.
  const proofLink = proofKey
    ? `${appUrl()}/api/transferencias/comprobante?key=${encodeURIComponent(proofKey)}`
    : null;

  await sendMail({
    to: OPS_EMAIL,
    subject: `[Transferencia recibida] Folio ${folio}`,
    replyTo: email,
    html: emailLayout({
      title: "Transferencia recibida",
      preheader: `Folio ${folio} · ${email}`,
      body: `
        <p>${proofLink ? "Comprobante de transferencia subido por el comprador." : "El comprador reportó una transferencia <strong>sin adjuntar comprobante</strong> (subida no disponible) — debe llegar por correo."}</p>
        <ul>
          <li>Folio: <code>${escapeHtml(folio)}</code></li>
          <li>Email: ${escapeHtml(email)}</li>
          ${amountMxn ? `<li>Monto declarado: $${amountMxn.toLocaleString("es-MX")} MXN</li>` : ""}
          ${reference ? `<li>Referencia: ${escapeHtml(reference)}</li>` : ""}
          ${proofLink ? `<li><a href="${escapeHtml(proofLink)}">Ver comprobante →</a></li>` : ""}
        </ul>
        <p style="margin-top:18px;">Validar en <a href="${escapeHtml(appUrl())}/admin/transferencias">/admin/transferencias</a>.</p>
      `,
    }),
  });

  return NextResponse.json({ ok: true });
}
