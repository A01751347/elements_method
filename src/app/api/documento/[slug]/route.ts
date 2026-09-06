import { eq, inArray } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { documentTemplates, orders, products } from "@/shared/db/schema";
import { buildLegalDocPdf } from "@/shared/pdf/legalDoc";
import { legalDocTokens } from "@/shared/pdf/legalTokens";

export const runtime = "nodejs";

/**
 * GET /api/documento/{slug}?folio=EM-...&lang=es → personalized legal PDF.
 *
 * Renders a legal template (contrato / nda / relevo …) as a filled PDF. When a
 * `folio` query param is present, the buyer's data from that order fills the
 * {{TOKEN}} placeholders; otherwise the placeholders render as ‹TOKEN› so a
 * blank template is obvious. Token values are built by legalDocTokens — the
 * same builder the checkout uses for the hashed snapshot.
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

  const tokens = legalDocTokens({
    order,
    lang,
    productNames,
    folio,
  });

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
