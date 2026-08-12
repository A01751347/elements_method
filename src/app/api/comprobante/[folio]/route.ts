import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orders } from "@/shared/db/schema";
import { buildReceiptPdf } from "@/shared/pdf/receipt";

export const runtime = "nodejs";

/**
 * GET /api/comprobante/{folio} → purchase-receipt PDF.
 *
 * Looks up the order by its public folio and streams a generated PDF. Returns
 * 404 when the folio is unknown. Safe to link from the thank-you page and the
 * admin, and to attach to confirmation emails.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ folio: string }> },
) {
  const { folio } = await params;
  if (!folio) {
    return new Response("Missing folio", { status: 400 });
  }

  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.folio, folio))
    .limit(1);
  const order = rows[0];
  if (!order) {
    return new Response("Not found", { status: 404 });
  }

  const { bytes } = await buildReceiptPdf(order);
  const body = new Uint8Array(bytes);

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="comprobante-${order.folio}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
