import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/shared/db/client";
import { orders } from "@/shared/db/schema/orders";
import { isConfigured, objectUrl, presignUpload } from "@/shared/integrations/s3";

export const runtime = "nodejs";

/** Proof files only — anything else is rejected before a URL is issued. */
const ALLOWED = new Map<string, string>([
  ["application/pdf", "pdf"],
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
]);

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const Schema = z.object({
  folio: z.string().min(8).max(60),
  email: z.string().email().max(200),
  contentType: z.string().max(120),
  size: z.number().int().positive().max(MAX_BYTES),
});

/**
 * POST /api/uploads/comprobante → short-lived presigned S3 PUT.
 *
 * The browser uploads straight to S3 with the returned URL, so the file never
 * passes through this function (no body-size ceiling) and no AWS credential
 * ever reaches the client.
 *
 * Gated on folio+email matching a real order: without that, anyone could mint
 * upload URLs and use the bucket as free storage.
 */
export async function POST(req: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { ok: false, error: "UPLOAD_UNAVAILABLE" },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 });
  }
  const parsed = Schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "VALIDATION", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const { folio, email, contentType } = parsed.data;

  const ext = ALLOWED.get(contentType);
  if (!ext) {
    return NextResponse.json({ ok: false, error: "UNSUPPORTED_TYPE" }, { status: 415 });
  }

  // Only the buyer of a real order may upload against that folio.
  let order: { id: string; buyerEmail: string } | undefined;
  try {
    [order] = await db
      .select({ id: orders.id, buyerEmail: orders.buyerEmail })
      .from(orders)
      .where(eq(orders.folio, folio))
      .limit(1);
  } catch (e) {
    console.error("[uploads:comprobante] order lookup failed", e);
    return NextResponse.json({ ok: false, error: "DB_ERROR" }, { status: 500 });
  }
  if (!order) {
    return NextResponse.json({ ok: false, error: "ORDER_NOT_FOUND" }, { status: 404 });
  }
  if (order.buyerEmail.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json({ ok: false, error: "EMAIL_MISMATCH" }, { status: 403 });
  }

  // Key is server-generated: the client never chooses a path, so it cannot
  // overwrite another buyer's proof or escape the comprobantes/ prefix.
  const month = new Date().toISOString().slice(0, 7);
  const key = `comprobantes/${month}/${folio}/${crypto.randomUUID()}.${ext}`;

  return NextResponse.json({
    ok: true,
    uploadUrl: presignUpload(key),
    publicUrl: objectUrl(key),
    contentType,
  });
}
