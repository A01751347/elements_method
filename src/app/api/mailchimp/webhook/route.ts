import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { subscribers } from "@/shared/db/schema/integrations";

export const runtime = "nodejs";

/**
 * Mailchimp list webhook.
 *
 * Mailchimp does not sign its webhooks, so the shared secret travels in the
 * query string — configure the callback as
 *   https://<domain>/api/mailchimp/webhook?secret=<MAILCHIMP_WEBHOOK_SECRET>
 * and keep that URL private. Comparison is timing-safe.
 *
 * Without this, an unsubscribe made from a Mailchimp email never reaches us and
 * `subscribers.unsubscribed_at` stays null forever — so the admin list shows
 * people who have actually opted out.
 */
function secretMatches(req: Request): boolean {
  const expected = process.env.MAILCHIMP_WEBHOOK_SECRET;
  // No secret configured → endpoint is inert rather than open.
  if (!expected) return false;

  const provided = new URL(req.url).searchParams.get("secret") ?? "";
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * Mailchimp pings the endpoint with a GET when you save the webhook; it must
 * answer 200 or the callback is rejected.
 */
export async function GET(req: Request) {
  return NextResponse.json({ ok: secretMatches(req) });
}

export async function POST(req: Request) {
  if (!secretMatches(req)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  // Mailchimp posts form-encoded bodies, e.g. type=unsubscribe&data[email]=…
  let form: URLSearchParams;
  try {
    form = new URLSearchParams(await req.text());
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_BODY" }, { status: 400 });
  }

  const type = form.get("type") ?? "";
  const email = form.get("data[email]")?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ ok: true, ignored: "no_email" });
  }

  try {
    switch (type) {
      case "unsubscribe":
      case "cleaned": {
        await db
          .update(subscribers)
          .set({
            mailchimpStatus: type === "cleaned" ? "cleaned" : "unsubscribed",
            unsubscribedAt: new Date(),
            mailchimpSyncedAt: new Date(),
          })
          .where(eq(subscribers.email, email));
        break;
      }
      case "subscribe": {
        // Re-subscribing clears the opt-out stamp.
        await db
          .update(subscribers)
          .set({
            mailchimpStatus: "subscribed",
            unsubscribedAt: null,
            mailchimpSyncedAt: new Date(),
          })
          .where(eq(subscribers.email, email));
        break;
      }
      case "upemail": {
        const next = form.get("data[new_email]")?.trim().toLowerCase();
        if (next) {
          await db
            .update(subscribers)
            .set({ email: next, mailchimpSyncedAt: new Date() })
            .where(eq(subscribers.email, email));
        }
        break;
      }
      default:
        // profile / campaign updates carry nothing we store.
        return NextResponse.json({ ok: true, ignored: type });
    }
  } catch (e) {
    // 500 makes Mailchimp retry instead of dropping the event.
    console.error(`[mailchimp:webhook] ${type} for ${email} failed`, e);
    return NextResponse.json({ ok: false, error: "DB_ERROR" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, type });
}
