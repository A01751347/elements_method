import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/shared/db/client";
import { enterpriseQuotes } from "@/shared/db/schema";
import {
  computeQuote,
  getCalculatorConfig,
  type Modality,
  type QuoteCurrency,
} from "@/shared/pricing/enterprise";
import {
  sendMail,
  emailLayout,
  escapeHtml,
  OPS_EMAIL,
} from "@/shared/integrations/resend";

export const runtime = "nodejs";

const Schema = z.object({
  companyName: z.string().min(2).max(200),
  contactName: z.string().min(2).max(160),
  contactEmail: z.string().email(),
  contactPhone: z.string().max(40).optional(),
  people: z.number().int().positive().max(500),
  sessions: z.number().int().positive().max(52),
  modality: z.enum(["presencial", "virtual", "hibrido"]),
  currency: z.enum(["MXN", "USD"]).default("MXN"),
  locale: z.enum(["es", "en"]).default("es"),
  notes: z.string().max(2000).optional(),
  honeypot: z.string().optional(),
});

/** Generate a human-readable quote number: EM-COT-YYMM-XXXX. */
function quoteNumber(): string {
  const now = new Date();
  const yymm = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `EM-COT-${yymm}-${rand}`;
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
  // Silent spam guard: bots fill hidden fields.
  if (data.honeypot && data.honeypot.length > 0) {
    return NextResponse.json({ ok: true, quoteNumber: quoteNumber() });
  }

  const cfg = await getCalculatorConfig();
  const breakdown = computeQuote(
    {
      people: data.people,
      sessions: data.sessions,
      modality: data.modality as Modality,
      currency: data.currency as QuoteCurrency,
    },
    cfg,
  );

  const number = quoteNumber();
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + cfg.validityDays);

  // Persist the quote (best-effort; a failed insert shouldn't block the reply).
  try {
    await db.insert(enterpriseQuotes).values({
      quoteNumber: number,
      companyName: data.companyName,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone ?? null,
      numberOfPeople: data.people,
      numberOfSessions: data.sessions,
      modality: data.modality,
      breakdown,
      totalMxn:
        data.currency === "MXN"
          ? breakdown.total.toFixed(2)
          : (breakdown.total * (cfg.basePerSessionMxn / cfg.basePerSessionUsd)).toFixed(2),
      totalUsd: data.currency === "USD" ? breakdown.total.toFixed(2) : null,
      currency: data.currency,
      language: data.locale,
      notes: data.notes ?? null,
      validUntil,
    });
  } catch (e) {
    console.error("[cotizar] quote insert failed", e);
  }

  // Notify ops.
  void sendMail({
    to: OPS_EMAIL,
    subject: `[Cotización] ${data.companyName} · ${data.people} personas · ${number}`,
    html: emailLayout({
      title: "Nueva cotización empresarial",
      body: `
        <p><strong>${escapeHtml(data.companyName)}</strong> solicitó una cotización.</p>
        <ul>
          <li>Contacto: ${escapeHtml(data.contactName)} · ${escapeHtml(data.contactEmail)}${data.contactPhone ? " · " + escapeHtml(data.contactPhone) : ""}</li>
          <li>Personas: ${data.people} · Sesiones: ${data.sessions} · Modalidad: ${escapeHtml(data.modality)}</li>
          <li>Total estimado: <strong>${breakdown.total.toLocaleString("es-MX")} ${data.currency}</strong></li>
          <li>Folio: <code>${escapeHtml(number)}</code></li>
        </ul>
        ${data.notes ? `<p>Notas: ${escapeHtml(data.notes)}</p>` : ""}
      `,
    }),
  });

  // Confirmation to the requester with a link to the quote PDF.
  void sendMail({
    to: data.contactEmail,
    subject:
      data.locale === "en"
        ? "Your Elements Method quote"
        : "Tu cotización Elements Method",
    html: emailLayout({
      title: data.locale === "en" ? "Your quote" : "Tu cotización",
      body:
        data.locale === "en"
          ? `<p>Thank you, ${escapeHtml(data.contactName)}. Your estimate is <strong>${breakdown.total.toLocaleString("en-US")} ${data.currency}</strong>. A team member will reach out to tailor it. Reference: ${escapeHtml(number)}.</p>`
          : `<p>Gracias, ${escapeHtml(data.contactName)}. Tu estimado es <strong>${breakdown.total.toLocaleString("es-MX")} ${data.currency}</strong>. Un miembro del equipo te contactará para afinarla. Folio: ${escapeHtml(number)}.</p>`,
    }),
  });

  return NextResponse.json({
    ok: true,
    quoteNumber: number,
    breakdown,
    pdfUrl: `/api/cotizacion/${number}`,
  });
}
