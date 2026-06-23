import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/shared/db/client";
import { cookieConsents } from "@/shared/db/schema/integrations";

export const runtime = "nodejs";

const Schema = z.object({
  sessionId: z.string().min(8).max(120),
  essential: z.boolean().default(true),
  analytics: z.boolean().default(false),
  marketing: z.boolean().default(false),
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

  const ua = req.headers.get("user-agent") ?? null;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null;

  try {
    await db.insert(cookieConsents).values({
      sessionId: parsed.data.sessionId,
      essential: parsed.data.essential,
      analytics: parsed.data.analytics,
      marketing: parsed.data.marketing,
      userAgent: ua,
      ipAddress: ip,
    });
  } catch (e) {
    console.error("[consent] insert failed", e);
  }
  return NextResponse.json({ ok: true });
}
