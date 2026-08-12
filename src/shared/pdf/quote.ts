import "server-only";
import type { EnterpriseQuote } from "@/shared/db/schema";
import type { QuoteBreakdown } from "@/shared/pricing/enterprise";
import { PdfBuilder } from "./engine";

const T = {
  es: {
    title: "Cotización empresarial",
    for: "Preparada para",
    company: "Empresa",
    contact: "Contacto",
    number: "Folio",
    validUntil: "Válida hasta",
    scope: "Alcance",
    people: "Participantes",
    sessions: "Sesiones",
    modality: "Modalidad",
    breakdown: "Desglose",
    base: "Base por sesión",
    subtotal: "Subtotal",
    discount: "Descuento por volumen",
    iva: "IVA",
    total: "Total estimado",
    footer:
      "Cotización estimada, no vinculante. Precios sujetos a alcance final y disponibilidad. Válida por el periodo indicado.",
    modalities: { presencial: "Presencial", virtual: "Virtual", hibrido: "Híbrido" },
  },
  en: {
    title: "Enterprise quote",
    for: "Prepared for",
    company: "Company",
    contact: "Contact",
    number: "Reference",
    validUntil: "Valid until",
    scope: "Scope",
    people: "Participants",
    sessions: "Sessions",
    modality: "Modality",
    breakdown: "Breakdown",
    base: "Base per session",
    subtotal: "Subtotal",
    discount: "Volume discount",
    iva: "VAT",
    total: "Estimated total",
    footer:
      "Estimated, non-binding quote. Prices subject to final scope and availability. Valid for the stated period.",
    modalities: { presencial: "In person", virtual: "Virtual", hibrido: "Hybrid" },
  },
} as const;

function money(n: number, currency: string): string {
  return `$${n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

export async function buildQuotePdf(
  quote: EnterpriseQuote,
): Promise<{ bytes: Uint8Array; hash: string }> {
  const lang = quote.language === "en" ? "en" : "es";
  const t = T[lang];
  const b = quote.breakdown as unknown as QuoteBreakdown;
  const currency = quote.currency;

  const pdf = await PdfBuilder.create({
    title: t.title,
    subtitle: `${t.number}: ${quote.quoteNumber}`,
  });

  pdf.heading(t.for);
  pdf.kv(t.company, quote.companyName);
  pdf.kv(t.contact, `${quote.contactName} · ${quote.contactEmail}`);
  pdf.kv(t.number, quote.quoteNumber);
  pdf.kv(
    t.validUntil,
    new Date(quote.validUntil).toLocaleDateString(lang === "en" ? "en-US" : "es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  );

  pdf.divider();
  pdf.heading(t.scope);
  pdf.kv(t.people, String(quote.numberOfPeople));
  pdf.kv(t.sessions, String(quote.numberOfSessions));
  pdf.kv(t.modality, t.modalities[quote.modality as keyof typeof t.modalities] ?? quote.modality);

  pdf.divider();
  pdf.heading(t.breakdown);
  pdf.totalRow(t.base, money(b.basePerSession, currency));
  pdf.totalRow(t.subtotal, money(b.subtotal, currency));
  if (b.discountAmount > 0) {
    pdf.totalRow(
      `${t.discount} (${b.discountPct}%)`,
      `- ${money(b.discountAmount, currency)}`,
    );
  }
  pdf.totalRow(`${t.iva} (${Math.round(b.ivaRate * 100)}%)`, money(b.iva, currency));
  pdf.divider();
  pdf.totalRow(t.total, money(b.total, currency), { bold: true });

  pdf.spacer(20);
  pdf.paragraph(t.footer, { size: 8.5 });
  pdf.footer(`Elements Method · ${quote.quoteNumber} · ${new Date().getFullYear()}`);
  return pdf.finish();
}
