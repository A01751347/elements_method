import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { documentTemplates, orderDocuments, orders } from "@/shared/db/schema";
import { verifyToken } from "@/shared/integrations/signedTokens";
import { sendAll, emailLayout, escapeHtml, OPS_EMAIL, appUrl } from "@/shared/integrations/resend";

export const runtime = "nodejs";

const Schema = z.object({
  token: z.string().min(20).max(2000),
  acceptedTerms: z.boolean(),
  signature: z.string().min(2).max(200),
});

/**
 * POST /api/sign — the participant accepts a post-purchase document
 * (contrato / NDA / relevo) from their one-time /firmar link.
 *
 * Records the acceptance (timestamp, IP, user agent, typed name) on the
 * order_documents row the token points to, then emails the participant a copy
 * and ops a notice. The token's email must match the order's buyer.
 */
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
  if (!parsed.data.acceptedTerms) {
    return NextResponse.json({ ok: false, error: "TERMS_NOT_ACCEPTED" }, { status: 400 });
  }

  const verified = await verifyToken(parsed.data.token);
  if (!verified.ok) {
    return NextResponse.json({ ok: false, error: verified.error }, { status: 401 });
  }

  let row:
    | {
        orderDocId: string;
        accepted: boolean;
        slug: string;
        nameEs: string;
        nameEn: string | null;
        folio: string;
        buyerName: string;
        buyerEmail: string;
        language: string;
      }
    | undefined;
  try {
    [row] = await db
      .select({
        orderDocId: orderDocuments.id,
        accepted: orderDocuments.accepted,
        slug: documentTemplates.slug,
        nameEs: documentTemplates.nameEs,
        nameEn: documentTemplates.nameEn,
        folio: orders.folio,
        buyerName: orders.buyerName,
        buyerEmail: orders.buyerEmail,
        language: orders.language,
      })
      .from(orderDocuments)
      .innerJoin(documentTemplates, eq(documentTemplates.id, orderDocuments.documentTemplateId))
      .innerJoin(orders, eq(orders.id, orderDocuments.orderId))
      .where(eq(orderDocuments.id, verified.orderDocId))
      .limit(1);
  } catch (e) {
    console.error("[sign] lookup failed", e);
    return NextResponse.json({ ok: false, error: "DB_ERROR" }, { status: 500 });
  }
  if (!row) {
    return NextResponse.json({ ok: false, error: "DOCUMENT_NOT_FOUND" }, { status: 404 });
  }
  if (row.buyerEmail.toLowerCase() !== verified.email.toLowerCase()) {
    return NextResponse.json({ ok: false, error: "EMAIL_MISMATCH" }, { status: 403 });
  }
  // Idempotent: a second click on the same link must not re-stamp or re-email.
  if (row.accepted) {
    return NextResponse.json({ ok: true, alreadySigned: true });
  }

  const ua = req.headers.get("user-agent") ?? null;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null;
  const now = new Date();

  try {
    await db
      .update(orderDocuments)
      .set({ accepted: true, acceptedAt: now, ipAddress: ip, userAgent: ua })
      .where(eq(orderDocuments.id, row.orderDocId));
  } catch (e) {
    console.error("[sign] DB update failed", e);
    return NextResponse.json({ ok: false, error: "DB_ERROR" }, { status: 500 });
  }

  const es = row.language !== "en";
  const lang = es ? "es" : "en";
  const docName = es ? row.nameEs : row.nameEn ?? row.nameEs;
  const pdfUrl = `${appUrl()}/api/documento/${encodeURIComponent(row.slug)}?folio=${encodeURIComponent(row.folio)}&lang=${lang}`;
  const firstName = escapeHtml(row.buyerName.split(" ")[0] ?? "");
  const when = now.toLocaleString(es ? "es-MX" : "en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  });

  await sendAll([
    {
      to: row.buyerEmail,
      subject: es
        ? `Documento firmado · ${docName} · Folio ${row.folio}`
        : `Document signed · ${docName} · Reference ${row.folio}`,
      html: emailLayout({
        title: es ? "Documento firmado" : "Document signed",
        preheader: `${docName} · ${row.folio}`,
        body: `
          <p>${es ? `Hola ${firstName},` : `Hi ${firstName},`}</p>
          <p>${
            es
              ? `Registramos tu aceptación de <strong>${escapeHtml(docName)}</strong> el ${escapeHtml(when)} (hora de la Ciudad de México), firmado como <em>${escapeHtml(parsed.data.signature)}</em>.`
              : `We recorded your acceptance of <strong>${escapeHtml(docName)}</strong> on ${escapeHtml(when)} (Mexico City time), signed as <em>${escapeHtml(parsed.data.signature)}</em>.`
          }</p>
          <p style="margin-top:18px;">
            <a href="${pdfUrl}" style="display:inline-block;background:#2C2C2A;color:#F5F0E8;padding:12px 20px;text-decoration:none;font-size:14px;letter-spacing:.04em;">
              ${es ? "Descargar mi copia (PDF)" : "Download my copy (PDF)"}
            </a>
          </p>
          <p style="margin-top:24px;font-size:12px;color:#5A5752;">${es ? "Folio" : "Reference"}: ${escapeHtml(row.folio)}</p>
        `,
      }),
    },
    {
      to: OPS_EMAIL,
      subject: `[Firma] ${docName} · ${row.folio} · ${row.buyerName}`,
      replyTo: row.buyerEmail,
      html: emailLayout({
        title: "Documento firmado",
        body: `
          <p>Un participante firmó un documento de participación.</p>
          <ul>
            <li>Documento: <strong>${escapeHtml(docName)}</strong> (<code>${escapeHtml(row.slug)}</code>)</li>
            <li>Folio: <code>${escapeHtml(row.folio)}</code></li>
            <li>Participante: ${escapeHtml(row.buyerName)} · ${escapeHtml(row.buyerEmail)}</li>
            <li>Firma: ${escapeHtml(parsed.data.signature)}</li>
            <li>IP: ${escapeHtml(ip ?? "—")}</li>
          </ul>
          <p style="margin-top:18px;"><a href="${pdfUrl}">Ver PDF personalizado →</a></p>
        `,
      }),
    },
  ]);

  return NextResponse.json({ ok: true });
}
