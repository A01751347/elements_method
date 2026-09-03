import { NextResponse } from "next/server";
import { auth } from "@/shared/auth/config";
import { isConfigured, presignDownload } from "@/shared/integrations/s3";

export const runtime = "nodejs";

/**
 * GET /api/transferencias/comprobante?key=… → redirect to a short-lived
 * presigned S3 GET.
 *
 * Admin-only. Going through this route (instead of linking the raw object URL)
 * means the bucket can stay fully private: the link in the ops email and in
 * /admin/transferencias keeps working, but only for a signed-in admin, and the
 * signed URL it hands out expires in five minutes.
 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!isConfigured()) {
    return new Response("Storage not configured", { status: 503 });
  }

  const key = new URL(req.url).searchParams.get("key");
  // Confine reads to the proofs prefix so this can't become a bucket-wide reader.
  if (!key || !key.startsWith("comprobantes/") || key.includes("..")) {
    return new Response("Invalid key", { status: 400 });
  }

  return NextResponse.redirect(presignDownload(key), {
    status: 302,
    headers: { "Cache-Control": "private, no-store" },
  });
}
