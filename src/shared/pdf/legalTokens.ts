import "server-only";
import type { Order } from "@/shared/db/schema/orders";
import { appUrl, OPS_EMAIL } from "@/shared/integrations/resend";

export type LegalLang = "es" | "en";

export interface LegalTokenInput {
  /** The order whose buyer data fills the participant tokens. */
  order?: Order | null;
  lang: LegalLang;
  /** Names of the purchased products, already joined for display. */
  productNames?: string;
  /** Folio to show when there is no order row (blank preview). */
  folio?: string | null;
  now?: Date;
  /**
   * `labels`: with no order, buyer/order tokens render as bracketed labels
   * ("[Nombre del comprador]") instead of ‹TOKEN› — for the public /legal copy.
   */
  placeholders?: "labels";
}

const envOr = (key: string, fallback: string) => {
  const v = process.env[key]?.trim();
  return v ? v : fallback;
};

const longDate = (d: Date, lang: LegalLang) =>
  d.toLocaleDateString(lang === "en" ? "en-US" : "es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/**
 * Token → value map for the legal templates (contrato / NDA / relevo).
 *
 * ONE builder for both the checkout snapshot (hash pinned in order_documents)
 * and the on-demand download at /api/documento — if the two used different
 * token sets, the PDF a buyer downloads would never match the one they
 * accepted. Empty values render as ‹TOKEN› so a missing datum is visible
 * rather than silently blank.
 *
 * Organizer identity comes from LEGAL_* env vars; the legal name falls back
 * to the brand so a preview reads naturally, but RFC / address / representative
 * are deliberately left visible until filled — they are what identifies the
 * provider under Mexican law.
 */
export function legalDocTokens(
  input: LegalTokenInput,
): Record<string, string | number | null | undefined> {
  const { order, lang } = input;
  const es = lang !== "en";
  const now = input.now ?? new Date();
  // Acceptance date is the order date so the download always matches the
  // snapshot taken at checkout.
  const signedAt = order?.createdAt ? new Date(order.createdAt) : now;
  const city = envOr("LEGAL_CITY", es ? "Ciudad de México" : "Mexico City");
  const orgName = envOr("LEGAL_ORG_NAME", "Elements Method");
  const base = appUrl();

  const money = (v: unknown) =>
    v === undefined || v === null
      ? undefined
      : Number(v).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const paymentLabel = order
    ? order.paymentMethod === "stripe"
      ? es
        ? "tarjeta bancaria a través de Stripe"
        : "bank card via Stripe"
      : es
        ? "depósito o transferencia bancaria (SPEI)"
        : "bank deposit or transfer (SPEI)"
    : undefined;

  // Public copy without an order: name the field instead of leaking a marker.
  const label = (esText: string, enText: string) =>
    !order && input.placeholders === "labels" ? `[${es ? esText : enText}]` : undefined;

  return {
    // ── Organizer (env) ─────────────────────────────────────────────────
    ORGANIZADOR_RAZON_SOCIAL: orgName,
    ORGANIZADOR_RFC: process.env.LEGAL_ORG_RFC,
    ORGANIZADOR_DOMICILIO: process.env.LEGAL_ORG_ADDRESS,
    ORGANIZADOR_REPRESENTANTE: process.env.LEGAL_ORG_REP,
    ORGANIZADOR_EMAIL: envOr("LEGAL_ORG_EMAIL", OPS_EMAIL),
    EMPRESA_RAZON_SOCIAL: orgName,
    AVISO_PRIVACIDAD_URL: `${base}/${lang}/${es ? "privacidad" : "privacy"}`,
    LEY_APLICABLE: envOr(
      "LEGAL_JURISDICTION",
      es ? "los Estados Unidos Mexicanos" : "the United Mexican States",
    ),
    CIUDAD_JURISDICCION: city,
    CIUDAD_FIRMA: city,
    CUENTA_BANCARIA: process.env.BANK_CLABE,

    // ── Commercial policy (env, with the defaults the documents were drafted for)
    DIAS_CANCELACION_TOTAL: envOr("LEGAL_CANCEL_FULL_DAYS", "30"),
    PORCENTAJE_REEMBOLSO_TOTAL: envOr("LEGAL_CANCEL_FULL_PCT", "90"),
    DIAS_CANCELACION_PARCIAL: envOr("LEGAL_CANCEL_PARTIAL_DAYS", "15"),
    PORCENTAJE_REEMBOLSO_PARCIAL: envOr("LEGAL_CANCEL_PARTIAL_PCT", "50"),
    VIGENCIA_CONFIDENCIALIDAD_ANIOS: envOr("LEGAL_NDA_YEARS", "5"),

    // ── Participant (order) ─────────────────────────────────────────────
    PARTICIPANTE_NOMBRE: order?.buyerName ?? label("Nombre del comprador", "Buyer name"),
    PARTICIPANTE_EMAIL: order?.buyerEmail ?? label("Correo electrónico", "Email"),
    PARTICIPANTE_TELEFONO: order?.buyerPhone ?? label("Teléfono", "Phone"),
    PARTICIPANTE_EMPRESA: order
      ? order.buyerCompany?.trim() || (es ? "No aplica" : "N/A")
      : label("Empresa, si aplica", "Company, if any"),
    PARTICIPANTE_DOMICILIO: order?.buyerAddress ?? label("Domicilio", "Address"),
    PARTICIPANTE_RFC: order?.buyerRfc ?? label("RFC", "Tax ID"),

    // ── Order ───────────────────────────────────────────────────────────
    NOMBRE_PROGRAMA: input.productNames || label("Programa contratado", "Program purchased"),
    FOLIO: order?.folio ?? input.folio ?? label("Folio de la orden", "Order folio"),
    FECHA_ORDEN: order?.createdAt
      ? longDate(new Date(order.createdAt), lang)
      : label("Fecha de la orden", "Order date"),
    INVERSION_MXN: money(order?.total) ?? label("Total pagado", "Total paid"),
    FORMA_DE_PAGO: paymentLabel ?? label("Forma de pago", "Payment method"),
    FECHA_FIRMA: order ? longDate(signedAt, lang) : label("Fecha de aceptación", "Acceptance date") ?? longDate(signedAt, lang),

    // ── Legacy lowercase names (older templates / admin-edited copies) ──
    buyer_name: order?.buyerName,
    buyer_email: order?.buyerEmail,
    buyer_phone: order?.buyerPhone,
    buyer_company: order?.buyerCompany,
    buyer_rfc: order?.buyerRfc,
    buyer_address: order?.buyerAddress,
    order_folio: order?.folio ?? input.folio ?? undefined,
    order_date: order?.createdAt ? longDate(new Date(order.createdAt), lang) : undefined,
    product_names: input.productNames || undefined,
    total_amount: money(order?.total) ? `$${money(order?.total)}` : undefined,
    currency: order?.currency ?? "MXN",
    language: es ? "Español" : "Inglés",
  };
}
