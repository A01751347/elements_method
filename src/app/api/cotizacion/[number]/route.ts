import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { enterpriseQuotes } from "@/shared/db/schema";
import { buildQuotePdf } from "@/shared/pdf/quote";

export const runtime = "nodejs";

/** GET /api/cotizacion/{number} → enterprise-quote PDF. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ number: string }> },
) {
  const { number } = await params;
  const rows = await db
    .select()
    .from(enterpriseQuotes)
    .where(eq(enterpriseQuotes.quoteNumber, number))
    .limit(1);
  const quote = rows[0];
  if (!quote) {
    return new Response("Not found", { status: 404 });
  }

  const { bytes } = await buildQuotePdf(quote);
  return new Response(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="cotizacion-${quote.quoteNumber}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
