import "server-only";
import type { Order } from "@/shared/db/schema";
import { PdfBuilder } from "./engine";

const T = {
  es: {
    title: "Comprobante de compra",
    receiptFor: "Comprobante para",
    folio: "Folio",
    date: "Fecha",
    paymentMethod: "Método de pago",
    status: "Estado",
    concept: "Concepto",
    breakdown: "Desglose",
    subtotal: "Subtotal",
    discount: "Descuento",
    iva: "IVA (16%)",
    total: "Total",
    rfc: "RFC",
    company: "Empresa",
    stripe: "Tarjeta (Stripe)",
    transferencia: "Transferencia (SPEI)",
    paid: "Pagado",
    pendingPayment: "Pago pendiente",
    pendingTransfer: "Transferencia por validar",
    pendingDocuments: "Documentos pendientes",
    refunded: "Reembolsado",
    cancelled: "Cancelado",
    footer:
      "Este comprobante confirma tu compra en Elements Method. No es un CFDI. La factura fiscal se emite por separado con los datos proporcionados.",
    conceptLine: "Programa / retiro Elements Method",
  },
  en: {
    title: "Purchase receipt",
    receiptFor: "Receipt for",
    folio: "Reference",
    date: "Date",
    paymentMethod: "Payment method",
    status: "Status",
    concept: "Concept",
    breakdown: "Breakdown",
    subtotal: "Subtotal",
    discount: "Discount",
    iva: "VAT (16%)",
    total: "Total",
    rfc: "Tax ID",
    company: "Company",
    stripe: "Card (Stripe)",
    transferencia: "Bank transfer (SPEI)",
    paid: "Paid",
    pendingPayment: "Payment pending",
    pendingTransfer: "Transfer pending validation",
    pendingDocuments: "Documents pending",
    refunded: "Refunded",
    cancelled: "Cancelled",
    footer:
      "This receipt confirms your Elements Method purchase. It is not a tax invoice (CFDI); the fiscal invoice is issued separately.",
    conceptLine: "Elements Method program / retreat",
  },
} as const;

function money(amount: string | number, currency: string): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  return `$${n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

type Strings = { [K in keyof (typeof T)["es"]]: string };

function statusLabel(status: string, t: Strings): string {
  switch (status) {
    case "paid":
      return t.paid;
    case "pending_payment":
      return t.pendingPayment;
    case "pending_transfer_validation":
      return t.pendingTransfer;
    case "pending_documents":
      return t.pendingDocuments;
    case "refunded":
      return t.refunded;
    case "cancelled":
      return t.cancelled;
    default:
      return status;
  }
}

/** Build a purchase-receipt PDF from an order. Returns bytes + sha256 hash. */
export async function buildReceiptPdf(
  order: Order,
): Promise<{ bytes: Uint8Array; hash: string }> {
  const t = T[order.language === "en" ? "en" : "es"];
  const pdf = await PdfBuilder.create({
    title: t.title,
    subtitle: `${t.folio}: ${order.folio}`,
  });

  const created = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString(
        order.language === "en" ? "en-US" : "es-MX",
        { year: "numeric", month: "long", day: "numeric" },
      )
    : "—";

  pdf.heading(t.receiptFor);
  pdf.kv(order.language === "en" ? "Name" : "Nombre", order.buyerName);
  pdf.kv("Email", order.buyerEmail);
  if (order.buyerCompany) pdf.kv(t.company, order.buyerCompany);
  if (order.buyerRfc) pdf.kv(t.rfc, order.buyerRfc);
  pdf.kv(t.folio, order.folio);
  pdf.kv(t.date, created);
  pdf.kv(
    t.paymentMethod,
    order.paymentMethod === "stripe" ? t.stripe : t.transferencia,
  );
  pdf.kv(t.status, statusLabel(order.status, t));

  pdf.divider();
  pdf.heading(t.breakdown);
  pdf.paragraph(t.conceptLine, { size: 10.5 });
  pdf.spacer(6);
  pdf.totalRow(t.subtotal, money(order.subtotal, order.currency));
  if (Number(order.discount) > 0) {
    pdf.totalRow(
      t.discount + (order.discountRule ? ` · ${order.discountRule}` : ""),
      `- ${money(order.discount, order.currency)}`,
    );
  }
  pdf.totalRow(t.iva, money(order.iva, order.currency));
  pdf.divider();
  pdf.totalRow(t.total, money(order.total, order.currency), { bold: true });

  pdf.spacer(20);
  pdf.paragraph(t.footer, { size: 8.5 });

  pdf.footer(
    `Elements Method · ${order.folio} · ${new Date().getFullYear()}`,
  );
  return pdf.finish();
}
