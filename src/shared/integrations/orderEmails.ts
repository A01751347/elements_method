import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { documentTemplates, orderDocuments, orders } from "@/shared/db/schema";
import { signToken } from "./signedTokens";
import {
  appUrl,
  emailLayout,
  escapeHtml,
  sendAll,
  OPS_EMAIL,
  type MailParams,
} from "./resend";

type Order = typeof orders.$inferSelect;

const money = (amount: string | number, currency = "MXN") =>
  `$${Number(amount).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;

interface OrderDoc {
  orderDocId: string;
  slug: string;
  nameEs: string;
  nameEn: string | null;
  acceptanceType: string;
  accepted: boolean;
}

/** Documents attached to an order, with the template metadata joined in. */
async function loadOrderDocs(orderId: string): Promise<OrderDoc[]> {
  try {
    return await db
      .select({
        orderDocId: orderDocuments.id,
        slug: documentTemplates.slug,
        nameEs: documentTemplates.nameEs,
        nameEn: documentTemplates.nameEn,
        acceptanceType: documentTemplates.acceptanceType,
        accepted: orderDocuments.accepted,
      })
      .from(orderDocuments)
      .innerJoin(
        documentTemplates,
        eq(documentTemplates.id, orderDocuments.documentTemplateId),
      )
      .where(eq(orderDocuments.orderId, orderId));
  } catch (e) {
    console.error("[orderEmails] could not load order documents", e);
    return [];
  }
}

/**
 * Build the documents section of the confirmation email.
 *
 * Two kinds of document exist. `check_only` ones were already accepted at
 * checkout, so we just hand back a personalized copy. `signature_upload` ones
 * still need a signature, so each gets its own one-time signed link into
 * /firmar/[token] — this is what actually activates that flow.
 */
async function documentsBlock(
  order: Order,
  docs: OrderDoc[],
  es: boolean,
): Promise<string> {
  if (docs.length === 0) return "";
  const base = appUrl();
  const lang = order.language === "en" ? "en" : "es";

  // Partition so every document lands in exactly one bucket. Splitting on
  // acceptanceType alone dropped an already-signed signature_upload doc from
  // both lists and it vanished from the email.
  const toSign = docs.filter(
    (d) => d.acceptanceType === "signature_upload" && !d.accepted,
  );
  const accepted = docs.filter((d) => !toSign.includes(d));

  let html = "";

  if (accepted.length > 0) {
    html += `
      <p style="margin-top:22px;"><strong>${es ? "Documentos aceptados" : "Accepted documents"}</strong><br />
      <span style="font-size:13px;color:#5A5752;">${
        es
          ? "Los aceptaste al momento de la compra. Aquí está tu copia con tus datos:"
          : "You accepted these at checkout. Here is your personalized copy:"
      }</span></p>
      <ul style="font-size:14px;">
        ${accepted
          .map(
            (d) =>
              `<li><a href="${base}/api/documento/${encodeURIComponent(d.slug)}?folio=${encodeURIComponent(order.folio)}&lang=${lang}">${escapeHtml(es ? d.nameEs : d.nameEn ?? d.nameEs)} (PDF)</a></li>`,
          )
          .join("")}
      </ul>`;
  }

  if (toSign.length > 0) {
    // One single-use signed link per document; each expires in 14 days.
    const links = await Promise.all(
      toSign.map(async (d) => {
        const token = await signToken({
          orderDocId: d.orderDocId,
          email: order.buyerEmail,
        });
        return `<li><a href="${base}/${lang}/firmar/${token}">${escapeHtml(es ? d.nameEs : d.nameEn ?? d.nameEs)} — ${es ? "firmar" : "sign"} →</a></li>`;
      }),
    );
    html += `
      <p style="margin-top:22px;"><strong>${es ? "Pendiente de firma" : "Pending signature"}</strong><br />
      <span style="font-size:13px;color:#5A5752;">${
        es
          ? "Estos enlaces son personales y de un solo uso. Caducan en 14 días."
          : "These links are personal and single-use. They expire in 14 days."
      }</span></p>
      <ul style="font-size:14px;">${links.join("")}</ul>`;
  }

  return html;
}

/**
 * Payment confirmed — notify buyer and ops.
 *
 * Used by both the Stripe webhook and the admin transfer-validation action so
 * both payment methods produce the same buyer experience.
 */
export async function sendPaymentConfirmation(
  order: Order,
  opts: { method: "stripe" | "transferencia"; validatedBy?: string } = {
    method: "stripe",
  },
): Promise<void> {
  const es = order.language !== "en";
  const base = appUrl();
  const docs = await loadOrderDocs(order.id);
  const docsHtml = await documentsBlock(order, docs, es);
  const firstName = escapeHtml(order.buyerName.split(" ")[0] ?? "");
  const total = money(order.total, order.currency);

  const buyer: MailParams = {
    to: order.buyerEmail,
    subject: es
      ? `Pago confirmado · Folio ${order.folio}`
      : `Payment confirmed · Reference ${order.folio}`,
    html: emailLayout({
      title: es ? "Pago confirmado" : "Payment confirmed",
      preheader: es
        ? `Recibimos ${total}. Folio ${order.folio}.`
        : `We received ${total}. Reference ${order.folio}.`,
      body: `
        <p>${es ? `Hola ${firstName},` : `Hi ${firstName},`}</p>
        <p>${
          es
            ? `Confirmamos tu pago de <strong>${escapeHtml(total)}</strong>${opts.method === "transferencia" ? " por transferencia" : ""}. Tu lugar está reservado.`
            : `We've confirmed your payment of <strong>${escapeHtml(total)}</strong>${opts.method === "transferencia" ? " by bank transfer" : ""}. Your place is reserved.`
        }</p>
        <p style="margin-top:18px;">
          <a href="${base}/api/comprobante/${encodeURIComponent(order.folio)}"
             style="display:inline-block;background:#2C2C2A;color:#F5F0E8;padding:12px 20px;text-decoration:none;font-size:14px;letter-spacing:.04em;">
            ${es ? "Descargar comprobante (PDF)" : "Download receipt (PDF)"}
          </a>
        </p>
        ${docsHtml}
        <p style="margin-top:24px;">${
          es
            ? "En los próximos días te escribimos con la logística de tu inmersión."
            : "We'll follow up shortly with the logistics for your immersion."
        }</p>
        <p style="margin-top:24px;font-size:12px;color:#5A5752;">${es ? "Folio" : "Reference"}: ${escapeHtml(order.folio)}</p>
      `,
    }),
  };

  const ops: MailParams = {
    to: OPS_EMAIL,
    subject: `[Pago confirmado] ${order.folio} · ${order.buyerName} · ${total}`,
    replyTo: order.buyerEmail,
    html: emailLayout({
      title: "Pago confirmado",
      body: `
        <p>Orden pagada vía <strong>${escapeHtml(opts.method)}</strong>.</p>
        <ul>
          <li>Folio: <code>${escapeHtml(order.folio)}</code></li>
          <li>Comprador: ${escapeHtml(order.buyerName)} · ${escapeHtml(order.buyerEmail)}</li>
          <li>Total: <strong>${escapeHtml(total)}</strong></li>
          ${order.stripeSessionId ? `<li>Stripe session: <code>${escapeHtml(order.stripeSessionId)}</code></li>` : ""}
          ${opts.validatedBy ? `<li>Validado por: ${escapeHtml(opts.validatedBy)}</li>` : ""}
          <li>Documentos en la orden: ${docs.length}</li>
        </ul>
        <p style="margin-top:18px;"><a href="${base}/admin/pagos">Ver en /admin/pagos →</a></p>
      `,
    }),
  };

  await sendAll([buyer, ops]);
}

/** Async payment failure from Stripe — ops only. */
export async function sendPaymentFailed(detail: unknown): Promise<void> {
  await sendAll([
    {
      to: OPS_EMAIL,
      subject: "[Stripe] Pago FALLIDO async",
      html: emailLayout({
        title: "Pago async fallido",
        body: `<p>Revisar en el dashboard de Stripe.</p><pre style="font-size:11px;white-space:pre-wrap;">${escapeHtml(
          JSON.stringify(detail, null, 2),
        )}</pre>`,
      }),
    },
  ]);
}

/**
 * Delayed-notification payment started (OXXO voucher, SPEI reference).
 *
 * The buyer has finished checkout but no money has moved yet, so this
 * deliberately does NOT confirm the purchase or attach a receipt — that only
 * happens on `async_payment_succeeded`.
 */
export async function sendAwaitingAsyncPayment(order: Order): Promise<void> {
  const es = order.language !== "en";
  const firstName = escapeHtml(order.buyerName.split(" ")[0] ?? "");
  const total = money(order.total, order.currency);

  await sendAll([
    {
      to: order.buyerEmail,
      subject: es
        ? `Falta completar tu pago · Folio ${order.folio}`
        : `Payment pending · Reference ${order.folio}`,
      html: emailLayout({
        title: es ? "Tu pago está pendiente" : "Your payment is pending",
        preheader: es
          ? `Aún no recibimos ${total}.`
          : `We haven't received ${total} yet.`,
        body: `
          <p>${es ? `Hola ${firstName},` : `Hi ${firstName},`}</p>
          <p>${
            es
              ? `Registramos tu solicitud por <strong>${escapeHtml(total)}</strong>, pero el pago <strong>aún no se completa</strong>. Stripe te envió por separado las instrucciones (ficha o referencia) — en cuanto se acredite, te llega la confirmación y tu comprobante.`
              : `We've recorded your request for <strong>${escapeHtml(total)}</strong>, but the payment <strong>hasn't cleared yet</strong>. Stripe sent you the payment instructions separately — as soon as it clears we'll send your confirmation and receipt.`
          }</p>
          <p>${
            es
              ? "Tu lugar queda apartado hasta la fecha límite que aparece en esas instrucciones."
              : "Your place is held until the deadline shown in those instructions."
          }</p>
          <p style="margin-top:24px;font-size:12px;color:#5A5752;">${es ? "Folio" : "Reference"}: ${escapeHtml(order.folio)}</p>
        `,
      }),
    },
    {
      to: OPS_EMAIL,
      subject: `[Pago pendiente] ${order.folio} · ${order.buyerName} · ${total}`,
      html: emailLayout({
        title: "Pago asíncrono iniciado",
        body: `
          <p>Checkout completado <strong>sin pago acreditado</strong> (método de notificación diferida).</p>
          <ul>
            <li>Folio: <code>${escapeHtml(order.folio)}</code></li>
            <li>Comprador: ${escapeHtml(order.buyerName)} · ${escapeHtml(order.buyerEmail)}</li>
            <li>Total: <strong>${escapeHtml(total)}</strong></li>
          </ul>
          <p style="margin-top:14px;">No entregar acceso hasta que llegue <code>async_payment_succeeded</code>.</p>
        `,
      }),
    },
  ]);
}
