import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orderDocuments } from "@/shared/db/schema/documents";
import { verifyToken } from "@/shared/integrations/signedTokens";
import { sendMail, emailLayout, OPS_EMAIL } from "@/shared/integrations/resend";

export const runtime = "nodejs";

const Schema = z.object({
  token: z.string().min(20).max(2000),
  acceptedTerms: z.boolean(),
  signature: z.string().min(2).max(200),
});

export async function POST(req: Request) {
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
  if (!parsed.data.acceptedTerms) {
    return NextResponse.json({ ok: false, error: "TERMS_NOT_ACCEPTED" }, { status: 400 });
  }

  const verified = await verifyToken(parsed.data.token);
  if (!verified.ok) {
    return NextResponse.json({ ok: false, error: verified.error }, { status: 401 });
  }

  const ua = req.headers.get("user-agent") ?? null;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null;

  try {
    await db
      .update(orderDocuments)
      .set({
        accepted: true,
        acceptedAt: new Date(),
        ipAddress: ip,
        userAgent: ua,
      })
      .where(eq(orderDocuments.id, verified.orderDocId));
  } catch (e) {
    console.error("[sign] DB update failed", e);
  }

  await sendMail({
    to: OPS_EMAIL,
    subject: "[Firma] Documento aceptado",
    html: emailLayout({
      title: "Documento aceptado",
      body: `
        <p>Un participante firmó un documento.</p>
        <ul>
          <li>orderDocId: <code>${verified.orderDocId}</code></li>
          <li>email: ${verified.email}</li>
          <li>firma: ${parsed.data.signature}</li>
          <li>IP: ${ip ?? "—"}</li>
        </ul>
      `,
    }),
  });

  return NextResponse.json({ ok: true });
}
