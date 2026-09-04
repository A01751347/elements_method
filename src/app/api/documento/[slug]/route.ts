import { eq, inArray } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { documentTemplates, orders, products } from "@/shared/db/schema";
import { buildLegalDocPdf } from "@/shared/pdf/legalDoc";

export const runtime = "nodejs";

/**
 * GET /api/documento/{slug}?folio=EM-...&lang=es → personalized legal PDF.
 *
 * Renders a legal template (contrato / nda / relevo …) as a filled PDF. When a
 * `folio` query param is present, the buyer's data from that order fills the
 * {{TOKEN}} placeholders; otherwise the placeholders render as ‹TOKEN› so a
 * blank template is obvious. Organizer/company tokens come from env where set.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const url = new URL(req.url);
  const folio = url.searchParams.get("folio");
  const langParam = url.searchParams.get("lang");

  const tplRows = await db
    .select()
    .from(documentTemplates)
    .where(eq(documentTemplates.slug, slug))
    .limit(1);
  const tpl = tplRows[0];
  if (!tpl) {
    return new Response("Document not found", { status: 404 });
  }

  // Resolve order (for token values) if a folio was supplied.
  let order: typeof orders.$inferSelect | undefined;
  if (folio) {
    const orderRows = await db
      .select()
      .from(orders)
      .where(eq(orders.folio, folio))
      .limit(1);
    order = orderRows[0];
  }

  const lang = (langParam ?? order?.language ?? "es") === "en" ? "en" : "es";
  const templateMarkdown =
    lang === "en" ? tpl.templateHtmlEn ?? tpl.templateHtmlEs : tpl.templateHtmlEs;

  // Nombres de lo comprado, para {{product_names}}.
  let productNames = "";
  if (order?.productIds?.length) {
    const rows = await db
      .select({ nameEs: products.nameEs, nameEn: products.nameEn })
      .from(products)
      .where(inArray(products.id, order.productIds));
    productNames = rows
      .map((r) => (lang === "en" ? r.nameEn ?? r.nameEs : r.nameEs))
      .join(", ");
  }

  const money = (v: unknown) =>
    v === undefined || v === null
      ? undefined
      : `$${Number(v).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;

  const tokens: Record<string, string | number | null | undefined> = {
    // Organizer / company (from env; blank → visible ‹TOKEN›)
    ORGANIZADOR_RAZON_SOCIAL: process.env.LEGAL_ORG_NAME,
    ORGANIZADOR_DOMICILIO: process.env.LEGAL_ORG_ADDRESS,
    ORGANIZADOR_RFC: process.env.LEGAL_ORG_RFC,
    ORGANIZADOR_REPRESENTANTE: process.env.LEGAL_ORG_REP,
    EMPRESA_RAZON_SOCIAL: process.env.LEGAL_ORG_NAME,
    LEY_APLICABLE: process.env.LEGAL_JURISDICTION ?? "México",
    CIUDAD_JURISDICCION: process.env.LEGAL_CITY ?? "Ciudad de México",
    CUENTA_BANCARIA: process.env.BANK_CLABE,
    // Participant (from the order)
    PARTICIPANTE_NOMBRE: order?.buyerName,
    PARTICIPANTE_EMAIL: order?.buyerEmail,
    PARTICIPANTE_DOMICILIO: order?.buyerAddress,
    PARTICIPANTE_RFC: order?.buyerRfc,
    // Commercial (from the order)
    INVERSION_MXN: order ? Number(order.total).toLocaleString("es-MX") : undefined,
    FECHA_FIRMA: new Date().toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    CIUDAD_FIRMA: process.env.LEGAL_CITY ?? "Ciudad de México",

    // Los mismos datos con los nombres que usan las plantillas sembradas
    // ({{buyer_name}}, {{order_folio}}…). Sin esto salían impresos tal cual
    // en el PDF que descarga el comprador antes de pagar.
    buyer_name: order?.buyerName,
    buyer_email: order?.buyerEmail,
    buyer_phone: order?.buyerPhone,
    buyer_company: order?.buyerCompany,
    buyer_rfc: order?.buyerRfc,
    buyer_address: order?.buyerAddress,
    order_folio: order?.folio ?? folio,
    order_date: order?.createdAt
      ? new Date(order.createdAt).toLocaleDateString(
          lang === "en" ? "en-US" : "es-MX",
          { year: "numeric", month: "long", day: "numeric" },
        )
      : undefined,
    product_names: productNames || undefined,
    total_amount: money(order?.total),
    currency: order?.currency ?? "MXN",
    language: lang === "en" ? "Inglés" : "Español",
  };

  const { bytes } = await buildLegalDocPdf({
    name: lang === "en" ? tpl.nameEn ?? tpl.nameEs : tpl.nameEs,
    templateMarkdown,
    tokens,
    reference: folio ?? undefined,
  });

  return new Response(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${slug}${folio ? `-${folio}` : ""}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
