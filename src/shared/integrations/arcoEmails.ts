import "server-only";
import {
  appUrl,
  emailLayout,
  escapeHtml,
  OPS_EMAIL,
  type MailParams,
} from "./resend";
import {
  ARCO_RIGHT_INFO,
  ARCO_RELATION_LABEL,
  ARCO_RESPONSE_BUSINESS_DAYS,
  ARCO_IDENTITY_BUSINESS_DAYS,
  type ArcoRight,
  type ArcoRelation,
} from "@/data/arco";
import type { ArcoRequest } from "@/shared/db/schema/privacy";

/**
 * Correos del flujo ARCO. Todos devuelven MailParams: quien llama decide
 * cuándo enviarlos (la API con sendAll, el admin desde una server action).
 */

type Lang = "es" | "en";

const lang = (r: { locale: string }): Lang => (r.locale === "en" ? "en" : "es");

function fechaLarga(d: Date, l: Lang): string {
  return d.toLocaleDateString(l === "en" ? "en-US" : "es-MX", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function rightLabel(right: string, l: Lang): string {
  const info = ARCO_RIGHT_INFO[right as ArcoRight];
  return info ? (l === "en" ? info.label.en : info.label.es) : right;
}

function relationLabel(relation: string | null, l: Lang): string {
  if (!relation) return "—";
  const r = ARCO_RELATION_LABEL[relation as ArcoRelation];
  return r ? (l === "en" ? r.en : r.es) : relation;
}

const fila = (k: string, v: string) =>
  `<tr><td style="color:#5A5752;vertical-align:top;padding-right:14px;">${escapeHtml(k)}</td><td>${v}</td></tr>`;

const firma = (l: Lang) =>
  `<p style="margin-top:24px;font-style:italic;color:#5A5752;">${
    l === "en" ? "Nature doesn't manage. Nature leads." : "La naturaleza no gestiona. La naturaleza lidera."
  }</p>`;

/** Aviso interno al equipo: nueva solicitud con enlace a la ficha del admin. */
export function arcoOpsEmail(req: ArcoRequest): MailParams {
  const body = `
    <p>Nueva solicitud de derechos ARCO desde el sitio. <strong>Plazo legal de respuesta: ${ARCO_RESPONSE_BUSINESS_DAYS} días hábiles</strong> — vence el ${escapeHtml(fechaLarga(req.responseDueAt, "es"))}.</p>
    <table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:16px;font-size:14px;">
      ${fila("Folio", `<strong>${escapeHtml(req.folio)}</strong>`)}
      ${fila("Derecho", `<strong>${escapeHtml(rightLabel(req.right, "es"))}</strong>`)}
      ${fila("Titular", escapeHtml(req.fullName))}
      ${fila("Correo", `<a href="mailto:${escapeHtml(req.email)}">${escapeHtml(req.email)}</a>`)}
      ${req.phone ? fila("Teléfono", escapeHtml(req.phone)) : ""}
      ${fila("Relación", escapeHtml(relationLabel(req.relation, "es")))}
      ${req.isRepresentative ? fila("Representa a", escapeHtml(req.titularName ?? "—")) : ""}
      ${fila("Idioma", escapeHtml(req.locale))}
    </table>
    <div style="margin-top:18px;padding:14px;background:#F5F0E8;border-left:3px solid #C9A96E;">${escapeHtml(req.description).replace(/\n/g, "<br />")}</div>
    <p style="margin-top:24px;">
      <a href="${appUrl()}/admin/arco/${req.id}" style="display:inline-block;background:#1F1F1D;color:#F5F0E8;padding:12px 20px;text-decoration:none;letter-spacing:.08em;text-transform:uppercase;font-size:12px;">Abrir en el admin</a>
    </p>
    <p style="margin-top:16px;font-size:12px;color:#5A5752;">Siguiente paso: acreditar la identidad del titular (identificación oficial) antes de atender el fondo de la solicitud.</p>
  `;
  return {
    to: OPS_EMAIL,
    subject: `[ARCO] ${req.folio} · ${rightLabel(req.right, "es")} · ${req.fullName}`,
    replyTo: req.email,
    html: emailLayout({
      title: "Nueva solicitud ARCO",
      preheader: `${req.fullName} · ${rightLabel(req.right, "es")} · vence ${fechaLarga(req.responseDueAt, "es")}`,
      body,
    }),
  };
}

/** Acuse de recibo al titular, con folio, plazo y el requisito de identificación. */
export function arcoAcuseEmail(req: ArcoRequest): MailParams {
  const l = lang(req);
  const nombre = escapeHtml(req.fullName.split(" ")[0]);
  const derecho = escapeHtml(rightLabel(req.right, l));
  const vence = escapeHtml(fechaLarga(req.responseDueAt, l));
  const body =
    l === "en"
      ? `
        <p>Hi ${nombre},</p>
        <p>We received your request to exercise your right of <strong>${derecho}</strong> over your personal data. Your reference number is <strong>${escapeHtml(req.folio)}</strong> — please keep it for any follow-up.</p>
        <table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:12px;font-size:14px;">
          ${fila("Reference", `<strong>${escapeHtml(req.folio)}</strong>`)}
          ${fila("Received", escapeHtml(fechaLarga(req.receivedAt, l)))}
          ${fila("Response by", `${vence} (${ARCO_RESPONSE_BUSINESS_DAYS} business days)`)}
        </table>
        <p style="margin-top:18px;"><strong>Next step — identity verification.</strong> Mexican data protection law requires us to verify the identity of the data subject before acting on a request. Please reply to this email with a copy of an official ID (INE, passport or similar)${req.isRepresentative ? ", plus the document that proves you are authorized to act on behalf of the data subject" : ""}. If we do not receive it within ${ARCO_IDENTITY_BUSINESS_DAYS} business days of our request, the request will be considered not submitted and you may file it again at any time.</p>
        <p>We will respond within ${ARCO_RESPONSE_BUSINESS_DAYS} business days. If your request is granted, it will take effect within a further 15 business days.</p>
        <p>You can read our <a href="${appUrl()}/en/privacy">Privacy Notice</a> at any time.</p>
        ${firma(l)}
      `
      : `
        <p>Hola ${nombre},</p>
        <p>Recibimos tu solicitud para ejercer tu derecho de <strong>${derecho}</strong> sobre tus datos personales. Tu folio es <strong>${escapeHtml(req.folio)}</strong>; guárdalo para cualquier seguimiento.</p>
        <table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:12px;font-size:14px;">
          ${fila("Folio", `<strong>${escapeHtml(req.folio)}</strong>`)}
          ${fila("Recibida", escapeHtml(fechaLarga(req.receivedAt, l)))}
          ${fila("Respuesta a más tardar", `${vence} (${ARCO_RESPONSE_BUSINESS_DAYS} días hábiles)`)}
        </table>
        <p style="margin-top:18px;"><strong>Siguiente paso: acreditar tu identidad.</strong> La ley nos obliga a verificar la identidad del titular antes de atender una solicitud. Responde a este correo con una copia de tu identificación oficial (INE, pasaporte o similar)${req.isRepresentative ? ", además del documento que acredite tu representación del titular" : ""}. Si no la recibimos dentro de los ${ARCO_IDENTITY_BUSINESS_DAYS} días hábiles siguientes a nuestro requerimiento, la solicitud se tendrá por no presentada y podrás volver a enviarla cuando quieras.</p>
        <p>Te responderemos en un máximo de ${ARCO_RESPONSE_BUSINESS_DAYS} días hábiles. Si tu solicitud procede, se hará efectiva dentro de los 15 días hábiles siguientes.</p>
        <p>Puedes consultar nuestro <a href="${appUrl()}/es/privacidad">Aviso de Privacidad</a> en cualquier momento.</p>
        ${firma(l)}
      `;
  return {
    to: req.email,
    subject:
      l === "en"
        ? `We received your data rights request · ${req.folio}`
        : `Recibimos tu solicitud ARCO · ${req.folio}`,
    html: emailLayout({
      title: l === "en" ? "Request received" : "Solicitud recibida",
      preheader: l === "en" ? `Reference ${req.folio}` : `Folio ${req.folio}`,
      body,
    }),
  };
}

/** Requerimiento formal de identificación (lo dispara el equipo desde el admin). */
export function arcoIdentityRequestEmail(req: ArcoRequest): MailParams {
  const l = lang(req);
  const nombre = escapeHtml(req.fullName.split(" ")[0]);
  const body =
    l === "en"
      ? `
        <p>Hi ${nombre},</p>
        <p>To continue with your request <strong>${escapeHtml(req.folio)}</strong> (${escapeHtml(rightLabel(req.right, l))}) we need to verify your identity. Please reply to this email with a copy of an official ID (INE, passport or similar)${req.isRepresentative ? " and the document that proves you are authorized to act on behalf of the data subject" : ""}.</p>
        <p>You have <strong>${ARCO_IDENTITY_BUSINESS_DAYS} business days</strong> to send it. Meanwhile the legal response period is paused. If we do not receive it, the request will be considered not submitted and you may file it again at any time.</p>
        ${firma(l)}
      `
      : `
        <p>Hola ${nombre},</p>
        <p>Para continuar con tu solicitud <strong>${escapeHtml(req.folio)}</strong> (${escapeHtml(rightLabel(req.right, l))}) necesitamos acreditar tu identidad. Responde a este correo con una copia de tu identificación oficial (INE, pasaporte o similar)${req.isRepresentative ? " y el documento que acredite tu representación del titular" : ""}.</p>
        <p>Tienes <strong>${ARCO_IDENTITY_BUSINESS_DAYS} días hábiles</strong> para enviarla. Mientras tanto, el plazo legal de respuesta queda suspendido. Si no la recibimos, la solicitud se tendrá por no presentada y podrás volver a enviarla cuando quieras.</p>
        ${firma(l)}
      `;
  return {
    to: req.email,
    subject:
      l === "en"
        ? `Identity verification needed · ${req.folio}`
        : `Necesitamos acreditar tu identidad · ${req.folio}`,
    html: emailLayout({
      title: l === "en" ? "Identity verification" : "Acreditación de identidad",
      body,
    }),
  };
}

/** Respuesta formal al titular (procedente o improcedente). */
export function arcoResolutionEmail(
  req: ArcoRequest,
  resolution: string,
  outcome: "resuelta" | "rechazada",
  executionDueAt: Date | null,
): MailParams {
  const l = lang(req);
  const nombre = escapeHtml(req.fullName.split(" ")[0]);
  const texto = escapeHtml(resolution).replace(/\n/g, "<br />");
  const procedente = outcome === "resuelta";
  const body =
    l === "en"
      ? `
        <p>Hi ${nombre},</p>
        <p>Here is our response to your request <strong>${escapeHtml(req.folio)}</strong> (${escapeHtml(rightLabel(req.right, l))}), received on ${escapeHtml(fechaLarga(req.receivedAt, l))}.</p>
        <p><strong>${procedente ? "Your request has been granted." : "Your request could not be granted."}</strong></p>
        <div style="margin-top:14px;padding:14px;background:#F5F0E8;border-left:3px solid #C9A96E;">${texto}</div>
        ${
          procedente && executionDueAt
            ? `<p style="margin-top:16px;">It will take effect no later than <strong>${escapeHtml(fechaLarga(executionDueAt, l))}</strong> (15 business days).</p>`
            : ""
        }
        <p style="margin-top:16px;">If you disagree with this response, you may file a complaint with the Mexican data protection authority (Secretaría Anticorrupción y Buen Gobierno, formerly INAI) within 15 business days.</p>
        ${firma(l)}
      `
      : `
        <p>Hola ${nombre},</p>
        <p>Te compartimos la respuesta a tu solicitud <strong>${escapeHtml(req.folio)}</strong> (${escapeHtml(rightLabel(req.right, l))}), recibida el ${escapeHtml(fechaLarga(req.receivedAt, l))}.</p>
        <p><strong>${procedente ? "Tu solicitud es procedente." : "Tu solicitud no resultó procedente."}</strong></p>
        <div style="margin-top:14px;padding:14px;background:#F5F0E8;border-left:3px solid #C9A96E;">${texto}</div>
        ${
          procedente && executionDueAt
            ? `<p style="margin-top:16px;">Se hará efectiva a más tardar el <strong>${escapeHtml(fechaLarga(executionDueAt, l))}</strong> (15 días hábiles).</p>`
            : ""
        }
        <p style="margin-top:16px;">Si no estás de acuerdo con esta respuesta, puedes presentar una solicitud de protección de derechos ante la autoridad garante (Secretaría Anticorrupción y Buen Gobierno, antes INAI) dentro de los 15 días hábiles siguientes.</p>
        ${firma(l)}
      `;
  return {
    to: req.email,
    subject:
      l === "en"
        ? `Response to your data rights request · ${req.folio}`
        : `Respuesta a tu solicitud ARCO · ${req.folio}`,
    html: emailLayout({
      title: l === "en" ? "Response to your request" : "Respuesta a tu solicitud",
      body,
    }),
  };
}
