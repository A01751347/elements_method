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

/** Ops-facing buyer identification: name, email, phone and company when given. */
function buyerLines(order: Order): string {
  const parts = [
    `<li>Comprador: ${escapeHtml(order.buyerName)} · ${escapeHtml(order.buyerEmail)}</li>`,
  ];
  if (order.buyerPhone) parts.push(`<li>Teléfono: ${escapeHtml(order.buyerPhone)}</li>`);
  if (order.buyerCompany) parts.push(`<li>Empresa: ${escapeHtml(order.buyerCompany)}</li>`);
  return parts.join("\n          ");
}

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
          ${buyerLines(order)}
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
            ${buyerLines(order)}
            <li>Total: <strong>${escapeHtml(total)}</strong></li>
          </ul>
          <p style="margin-top:14px;">No entregar acceso hasta que llegue <code>async_payment_succeeded</code>.</p>
        `,
      }),
    },
  ]);
}

/**
 * Deposit / bank-transfer order registered — buyer + ops.
 *
 * No money has moved: the buyer chose to pay by deposit at checkout. When the
 * bank account is configured the email carries the full details (folio as the
 * transfer concept, link to upload the proof). When it is not, we promise the
 * details by email and ops is told to send them by hand. The purchase is only
 * confirmed later, from /admin/transferencias.
 */
export async function sendTransferInstructions(
  order: Order,
  opts: {
    productName: string;
    bank: {
      configured: boolean;
      name: string;
      beneficiary: string;
      clabe: string;
      account: string;
    };
  },
): Promise<void> {
  const es = order.language !== "en";
  const base = appUrl();
  const lang = es ? "es" : "en";
  const firstName = escapeHtml(order.buyerName.split(" ")[0] ?? "");
  const total = money(order.total, order.currency);
  const product = escapeHtml(opts.productName);
  const proofUrl = `${base}/${lang}/transferencia?folio=${encodeURIComponent(order.folio)}&email=${encodeURIComponent(order.buyerEmail)}`;

  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #E7E1D4;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#5A5752;white-space:nowrap;">${label}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #E7E1D4;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;color:#2C2C2A;">${escapeHtml(value)}</td>
    </tr>`;

  const bankBlock = opts.bank.configured
    ? `
      <p style="margin-top:22px;"><strong>${es ? "Datos para tu depósito o SPEI" : "Deposit / SPEI details"}</strong></p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #E7E1D4;border-bottom:0;">
        ${row(es ? "Banco" : "Bank", opts.bank.name)}
        ${opts.bank.beneficiary ? row(es ? "Beneficiario" : "Beneficiary", opts.bank.beneficiary) : ""}
        ${row("CLABE", opts.bank.clabe)}
        ${opts.bank.account ? row(es ? "Cuenta" : "Account", opts.bank.account) : ""}
        ${row(es ? "Monto" : "Amount", total)}
        ${row(es ? "Concepto" : "Concept", order.folio)}
      </table>
      <p style="margin-top:14px;font-size:13px;color:#5A5752;">${
        es
          ? "Usa tu folio como concepto o referencia: es lo que nos permite vincular el pago a tu reserva."
          : "Use your folio as the transfer concept or reference: it's how we link the payment to your reservation."
      }</p>
      <p style="margin-top:18px;">
        <a href="${proofUrl}"
           style="display:inline-block;background:#2C2C2A;color:#F5F0E8;padding:12px 20px;text-decoration:none;font-size:14px;letter-spacing:.04em;">
          ${es ? "Subir mi comprobante" : "Upload my proof of payment"}
        </a>
      </p>`
    : `
      <p style="margin-top:22px;"><strong>${es ? "Siguiente paso" : "Next step"}</strong><br />
      ${
        es
          ? "En breve te contactaremos por este correo con los datos y la liga para realizar tu depósito. No necesitas hacer nada más por ahora."
          : "We'll shortly contact you at this address with the details and link to make your deposit. There's nothing else you need to do for now."
      }</p>
      <p style="font-size:13px;color:#5A5752;">${
        es
          ? `Cuando hayas depositado, sube tu comprobante aquí: <a href="${proofUrl}" style="color:#5A5752;">${proofUrl}</a>`
          : `Once you've paid, upload your proof here: <a href="${proofUrl}" style="color:#5A5752;">${proofUrl}</a>`
      }</p>`;

  const buyer: MailParams = {
    to: order.buyerEmail,
    subject: es
      ? `Reserva registrada · Folio ${order.folio}`
      : `Reservation registered · Reference ${order.folio}`,
    html: emailLayout({
      title: es ? "Reserva registrada" : "Reservation registered",
      preheader: es
        ? `${opts.productName} · ${total} · pago por depósito`
        : `${opts.productName} · ${total} · pay by deposit`,
      body: `
        <p>${es ? `Hola ${firstName},` : `Hi ${firstName},`}</p>
        <p>${
          es
            ? `Registramos tu reserva para <strong>${product}</strong> por <strong>${escapeHtml(total)}</strong>, con pago por depósito o transferencia.`
            : `We've registered your reservation for <strong>${product}</strong> for <strong>${escapeHtml(total)}</strong>, to be paid by deposit or bank transfer.`
        }</p>
        ${bankBlock}
        <p style="margin-top:24px;">${
          es
            ? "En cuanto validemos tu pago recibirás la confirmación, tu comprobante en PDF y los enlaces para firmar electrónicamente tus documentos de participación."
            : "As soon as we validate your payment you'll receive the confirmation, your PDF receipt and the links to electronically sign your participation documents."
        }</p>
        <p style="margin-top:24px;font-size:12px;color:#5A5752;">${es ? "Folio" : "Reference"}: ${escapeHtml(order.folio)}</p>
      `,
    }),
  };

  const ops: MailParams = {
    to: OPS_EMAIL,
    subject: `[Depósito solicitado] ${order.folio} · ${order.buyerName} · ${total}`,
    replyTo: order.buyerEmail,
    html: emailLayout({
      title: "Depósito solicitado",
      body: `
        <p>Un comprador eligió <strong>pago por depósito / transferencia</strong> en el checkout. Aún no hay pago.</p>
        <ul>
          <li>Folio: <code>${escapeHtml(order.folio)}</code></li>
          ${buyerLines(order)}
          <li>Producto: ${product}</li>
          <li>Total: <strong>${escapeHtml(total)}</strong></li>
        </ul>
        ${
          opts.bank.configured
            ? `<p style="margin-top:14px;">El comprador ya recibió los datos bancarios por correo con el folio como concepto.</p>`
            : `<p style="margin-top:14px;padding:12px 14px;background:#FDF3D7;border-left:4px solid #D9A441;"><strong>Acción requerida:</strong> los datos bancarios (BANK_*) no están configurados, así que al comprador se le prometió la liga / datos de depósito <strong>por correo</strong>. Envíaselos manualmente respondiendo a este mensaje.</p>`
        }
        <p style="margin-top:18px;">Cuando el dinero llegue, márcala como pagada en <a href="${base}/admin/transferencias">/admin/transferencias</a>.</p>
      `,
    }),
  };

  await sendAll([buyer, ops]);
}
