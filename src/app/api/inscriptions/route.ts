import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/shared/db/client";
import { inscriptions } from "@/shared/db/schema/operations";
import { sendAll, emailLayout, escapeHtml, OPS_EMAIL, appUrl } from "@/shared/integrations/resend";

export const runtime = "nodejs";

const Schema = z.object({
  source: z.enum(["apply", "contact", "newsletter", "corporate"]).default("apply"),
  retreatSlug: z.string().max(120).optional(),
  pathSlug: z.string().max(120).optional(),
  name: z.string().min(2).max(160),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional(),
  organization: z.string().max(160).optional(),
  role: z.string().max(120).optional(),
  message: z.string().max(2000).optional(),
  locale: z.enum(["es", "en"]).default("es"),
  honeypot: z.string().max(200).optional(),
  /**
   * Qualification questionnaire (client feedback #46). Stored in
   * `inscriptions.metadata` (jsonb) — no column migration needed.
   */
  details: z
    .object({
      participants: z.string().max(40).optional(),
      format: z.string().max(60).optional(),
      contractor: z.string().max(60).optional(),
      topics: z.string().max(2000).optional(),
      decisionMaker: z.string().max(300).optional(),
      participantLead: z.string().max(300).optional(),
    })
    .optional(),
});

/** Labels for the questionnaire rows in the ops email. */
const DETAIL_LABELS: Record<string, string> = {
  participants: "Participantes",
  format: "Formato",
  contractor: "Contrata",
  topics: "Temas de interés",
  decisionMaker: "Tomador de decisión",
  participantLead: "Líder participante",
};

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
  // Honeypot — silently drop spam
  if (parsed.data.honeypot) {
    return NextResponse.json({ ok: true, accepted: false }, { status: 200 });
  }

  const data = parsed.data;
  let inserted;
  try {
    [inserted] = await db
      .insert(inscriptions)
      .values({
        source: data.source,
        retreatSlug: data.retreatSlug ?? null,
        pathSlug: data.pathSlug ?? null,
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        organization: data.organization ?? null,
        role: data.role ?? null,
        message: data.message ?? null,
        locale: data.locale,
        status: "new",
        metadata: data.details ?? null,
      })
      .returning({ id: inscriptions.id });
  } catch (e) {
    // DB may be unavailable in dev — log and continue so the email side still runs
    console.error("[inscriptions] DB insert failed", e);
    inserted = { id: "no-db" };
  }

  // Email to ops
  const opsBody = `
    <p>Nueva inscripción recibida desde el sitio.</p>
    <table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:16px;font-size:14px;">
      <tr><td style="color:#5A5752;">Fuente</td><td><strong>${escapeHtml(data.source)}</strong></td></tr>
      ${data.retreatSlug ? `<tr><td style="color:#5A5752;">Retiro</td><td><strong>${escapeHtml(data.retreatSlug)}</strong></td></tr>` : ""}
      ${data.pathSlug ? `<tr><td style="color:#5A5752;">Programa</td><td><strong>${escapeHtml(data.pathSlug)}</strong></td></tr>` : ""}
      <tr><td style="color:#5A5752;">Nombre</td><td>${escapeHtml(data.name)}</td></tr>
      <tr><td style="color:#5A5752;">Email</td><td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
      ${data.phone ? `<tr><td style="color:#5A5752;">Teléfono</td><td>${escapeHtml(data.phone)}</td></tr>` : ""}
      ${data.organization ? `<tr><td style="color:#5A5752;">Organización</td><td>${escapeHtml(data.organization)}</td></tr>` : ""}
      ${data.role ? `<tr><td style="color:#5A5752;">Rol</td><td>${escapeHtml(data.role)}</td></tr>` : ""}
    </table>
    ${
      data.details
        ? `<table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:18px;font-size:14px;">
             <tr><td colspan="2" style="padding-bottom:4px;color:#1F1F1D;font-weight:bold;">Cuestionario</td></tr>
             ${Object.entries(data.details)
               .filter(([, v]) => v)
               .map(
                 ([k, v]) =>
                   `<tr><td style="color:#5A5752;vertical-align:top;">${escapeHtml(DETAIL_LABELS[k] ?? k)}</td><td>${escapeHtml(String(v)).replace(/\n/g, "<br />")}</td></tr>`,
               )
               .join("")}
           </table>`
        : ""
    }
    ${data.message ? `<div style="margin-top:18px;padding:14px;background:#F5F0E8;border-left:3px solid #C9A96E;font-style:italic;">${escapeHtml(data.message).replace(/\n/g, "<br />")}</div>` : ""}
    <p style="margin-top:24px;font-size:12px;color:#5A5752;">ID interno: ${inserted.id}</p>
  `;
  // Auto-reply to the applicant.
  const replyBody =
    data.locale === "en"
      ? `
        <p>Hi ${escapeHtml(data.name.split(" ")[0])},</p>
        <p>Thank you for reaching out to Elements Method. We received your message and a member of our team will respond personally within 48 hours.</p>
        <p>In the meantime, you can read more about the method and the upcoming calendar of immersions on <a href="${appUrl()}/en/retreats">our retreats page</a>.</p>
        <p>You'll also start receiving our monthly note: cases from our immersions, the research behind the methodology, and articles on neuroscience, NLP and psychology applied to leadership.</p>
        <p style="margin-top:24px;font-style:italic;color:#5A5752;">Nature doesn't manage. Nature leads.</p>
      `
      : `
        <p>Hola ${escapeHtml(data.name.split(" ")[0])},</p>
        <p>Gracias por escribir a Elements Method. Recibimos tu mensaje y un miembro de nuestro equipo te responderá personalmente en las próximas 48 horas.</p>
        <p>Mientras tanto, puedes leer más sobre el método y el calendario de inmersiones en <a href="${appUrl()}/es/retiros">nuestra página de retiros</a>.</p>
        <p>También empezarás a recibir nuestra nota mensual: casos de nuestras inmersiones, los estudios que sostienen la metodología y artículos de neurociencia, PNL y psicología aplicados al liderazgo.</p>
        <p style="margin-top:24px;font-style:italic;color:#5A5752;">La naturaleza no gestiona. La naturaleza lidera.</p>
      `;

  // Awaited: a fire-and-forget send is routinely killed when the serverless
  // function freezes on response.
  await sendAll([
    {
      to: OPS_EMAIL,
      subject: `[Inscripción] ${data.name} · ${data.retreatSlug ?? data.source}`,
      replyTo: data.email,
      html: emailLayout({
        title: "Nueva inscripción",
        preheader: `${data.name} aplicó desde el sitio · ${data.source}`,
        body: opsBody,
      }),
    },
    {
      to: data.email,
      subject:
        data.locale === "en"
          ? "We received your message — Elements Method"
          : "Recibimos tu mensaje — Elements Method",
      html: emailLayout({
        title: data.locale === "en" ? "We received your message" : "Recibimos tu mensaje",
        body: replyBody,
      }),
    },
  ]);

  return NextResponse.json({ ok: true, id: inserted.id });
}
