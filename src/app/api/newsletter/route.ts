import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { subscribers } from "@/shared/db/schema/integrations";
import { subscribeToMailchimp } from "@/shared/integrations/mailchimp";

export const runtime = "nodejs";

const Schema = z.object({
  email: z.string().email().max(200),
  firstName: z.string().max(80).optional(),
  source: z.string().max(40).optional(),
  locale: z.enum(["es", "en"]).default("es"),
  honeypot: z.string().max(0).optional(),
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
  if (parsed.data.honeypot) {
    return NextResponse.json({ ok: true, accepted: false });
  }

  const { email, firstName, source, locale } = parsed.data;

  // Upsert in DB (subscribers table). Don't crash if table missing in dev.
  try {
    const existing = await db
      .select({ id: subscribers.id })
      .from(subscribers)
      .where(eq(subscribers.email, email))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(subscribers).values({
        email,
        name: firstName ?? null,
        source: source ?? "footer",
        language: locale,
        mailchimpStatus: "pending",
      });
    } else {
      // Already subscribed — that's a success path, not an error.
    }
  } catch (e) {
    console.error("[newsletter] DB upsert failed", e);
  }

  // Mailchimp upsert (idempotent — handles "Member Exists" gracefully)
  const mc = await subscribeToMailchimp({
    email,
    firstName,
    source: source ?? "footer",
    locale,
    tags: source ? [source] : undefined,
  });

  if (mc.ok) {
    // Mark synced in DB (best-effort)
    try {
      await db
        .update(subscribers)
        .set({ mailchimpStatus: mc.status, mailchimpSyncedAt: new Date() })
        .where(eq(subscribers.email, email));
    } catch {
      /* best-effort */
    }
  }

  return NextResponse.json({ ok: true, status: mc.status });
}
