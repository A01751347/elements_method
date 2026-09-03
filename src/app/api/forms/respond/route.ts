import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { forms, formTokens, formResponses } from "@/shared/db/schema/forms";
import { testimonials } from "@/shared/db/schema/testimonials";
import { sendAll, emailLayout, escapeHtml, OPS_EMAIL } from "@/shared/integrations/resend";

export const runtime = "nodejs";

const Schema = z.object({
  token: z.string().min(8).max(200),
  formSlug: z.string().min(3).max(120),
  answers: z.record(z.string(), z.unknown()),
  shareablePhrase: z.string().max(2000).optional(),
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
  const { token, formSlug, answers, shareablePhrase, locale } = parsed.data;

  let tokenRow: {
    id: string;
    formId: string;
    recipientEmail: string;
    recipientName: string | null;
    orderId: string | null;
    retreatId: string | null;
  } | null = null;
  try {
    const rows = await db
      .select({
        id: formTokens.id,
        formId: formTokens.formId,
        recipientEmail: formTokens.recipientEmail,
        recipientName: formTokens.recipientName,
        orderId: formTokens.orderId,
        retreatId: formTokens.retreatId,
        formSlug: forms.slug,
      })
      .from(formTokens)
      .innerJoin(forms, eq(forms.id, formTokens.formId))
      .where(
        and(
          eq(formTokens.token, token),
          eq(forms.slug, formSlug),
          gt(formTokens.expiresAt, new Date()),
          isNull(formTokens.usedAt),
        ),
      )
      .limit(1);
    const r = rows[0];
    if (!r) {
      return NextResponse.json(
        { ok: false, error: "TOKEN_INVALID_OR_USED" },
        { status: 401 },
      );
    }
    tokenRow = {
      id: r.id,
      formId: r.formId,
      recipientEmail: r.recipientEmail,
      recipientName: r.recipientName,
      orderId: r.orderId,
      retreatId: r.retreatId,
    };
  } catch (e) {
    console.error("[forms:respond] token lookup failed", e);
    return NextResponse.json({ ok: false, error: "DB_ERROR" }, { status: 500 });
  }

  // Neon HTTP driver does NOT support transactions — run sequentially.
  // Token is marked used FIRST so a race condition leaves no orphan response
  // without a "used" token. If the response insert then fails, we re-open
  // the token by clearing usedAt before bubbling the error.
  try {
    await db
      .update(formTokens)
      .set({ usedAt: new Date() })
      .where(eq(formTokens.id, tokenRow.id));
  } catch (e) {
    console.error("[forms:respond] token mark-used failed", e);
    return NextResponse.json({ ok: false, error: "TOKEN_UPDATE_FAILED" }, { status: 500 });
  }

  let responseId: string | null = null;
  try {
    const inserted = await db
      .insert(formResponses)
      .values({
        formId: tokenRow.formId,
        tokenId: tokenRow.id,
        orderId: tokenRow.orderId,
        retreatId: tokenRow.retreatId,
        respondentEmail: tokenRow.recipientEmail,
        respondentName: tokenRow.recipientName,
        answers,
        shareablePhrase: shareablePhrase ?? null,
      })
      .returning({ id: formResponses.id });
    responseId = inserted[0]?.id ?? null;
  } catch (e) {
    console.error("[forms:respond] response insert failed", e);
    // Compensating action — re-open the token so the user can retry
    try {
      await db
        .update(formTokens)
        .set({ usedAt: null })
        .where(eq(formTokens.id, tokenRow.id));
    } catch (rollbackErr) {
      console.error("[forms:respond] compensating rollback failed", rollbackErr);
    }
    return NextResponse.json({ ok: false, error: "INSERT_FAILED" }, { status: 500 });
  }

  // A shareable-phrase answer becomes a PENDING testimonial (approved_by_admin
  // = false, published = false) so the admin can approve it from
  // /admin/testimoniales. The "allow_publication" answer gates it: "No" skips
  // creation entirely; the anonymous option strips the author's name.
  const consent =
    typeof answers["allow_publication"] === "string"
      ? (answers["allow_publication"] as string)
      : null;
  const consentDenied = consent !== null && /^no\b/i.test(consent.trim());
  const anonymous = consent !== null && /an[oó]nim|anonymous/i.test(consent);
  if (shareablePhrase && shareablePhrase.trim() && !consentDenied) {
    try {
      await db.insert(testimonials).values({
        type: "quote_only",
        authorName: anonymous ? null : tokenRow.recipientName,
        quoteEs: shareablePhrase.trim(),
        quoteEn: shareablePhrase.trim(),
        sourceFormResponseId: responseId,
        retreatId: tokenRow.retreatId,
      });
    } catch (e) {
      // Non-fatal: the response is already saved; the phrase remains visible
      // in the form response detail for manual recovery.
      console.error("[forms:respond] testimonial insert failed", e);
    }
  }

  // Notify ops + acknowledge the participant.
  await sendAll([
    {
    to: OPS_EMAIL,
    subject: `[Encuesta] ${formSlug} · ${tokenRow.recipientEmail}`,
    html: emailLayout({
      title: "Nueva respuesta recibida",
      body: `
        <p>Nueva respuesta a <strong>${escapeHtml(formSlug)}</strong>.</p>
        <ul>
          <li>Email: ${escapeHtml(tokenRow.recipientEmail)}</li>
          ${tokenRow.recipientName ? `<li>Nombre: ${escapeHtml(tokenRow.recipientName)}</li>` : ""}
          ${tokenRow.retreatId ? `<li>Retreat: <code>${tokenRow.retreatId}</code></li>` : ""}
        </ul>
        <h3 style="margin-top:18px;font-size:14px;color:#5A5752;">Respuestas</h3>
        <pre style="font-size:11px;background:#F5F0E8;padding:10px;border-left:3px solid #C9A96E;white-space:pre-wrap;">${escapeHtml(
          JSON.stringify(answers, null, 2),
        )}</pre>
        ${shareablePhrase ? `<p style="margin-top:14px;font-style:italic;background:#FCF4E1;padding:10px;border-left:3px solid #C9A96E;">${escapeHtml(shareablePhrase)}</p>` : ""}
      `,
    }),
    },

    {
    to: tokenRow.recipientEmail,
    subject:
      locale === "en"
        ? "We received your survey — Elements Method"
        : "Recibimos tu cuestionario — Elements Method",
    html: emailLayout({
      title: locale === "en" ? "Survey received" : "Cuestionario recibido",
      body:
        locale === "en"
          ? `<p>Thank you${tokenRow.recipientName ? `, ${escapeHtml(tokenRow.recipientName)}` : ""}.</p><p>We've recorded your responses and read them carefully before the next step of the process.</p>`
          : `<p>Gracias${tokenRow.recipientName ? `, ${escapeHtml(tokenRow.recipientName)}` : ""}.</p><p>Quedó registrada tu respuesta. La leemos cuidadosamente antes del siguiente paso del proceso.</p>`,
    }),
    },
  ]);

  return NextResponse.json({ ok: true });
}
