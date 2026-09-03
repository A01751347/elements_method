/**
 * Mailchimp Marketing API — minimal client.
 * Falls back to no-op when MAILCHIMP_API_KEY / MAILCHIMP_LIST_ID are empty.
 */
import "server-only";
import crypto from "node:crypto";

const apiKey = process.env.MAILCHIMP_API_KEY;
// The datacenter is the suffix of the API key (…-us21); trust that over the
// separate env var, which drifts out of sync when the key is rotated.
const serverPrefix =
  apiKey?.split("-")[1] || process.env.MAILCHIMP_SERVER_PREFIX || "us21";
const listId = process.env.MAILCHIMP_LIST_ID;

export interface SubscribeParams {
  email: string;
  firstName?: string;
  lastName?: string;
  /** Optional; written to the PHONE merge field when the audience has one. */
  phone?: string;
  source?: string;
  locale?: "es" | "en";
  tags?: string[];
}

export interface SubscribeResult {
  ok: boolean;
  status: string;
  error?: string;
}

/** True when both the key and the audience id are present. */
export function isMailchimpConfigured(): boolean {
  return Boolean(apiKey && listId);
}

/** Mailchimp addresses members by the MD5 of the lowercased email. */
function subscriberHash(email: string): string {
  return crypto.createHash("md5").update(email.trim().toLowerCase()).digest("hex");
}

function authHeader(): string {
  return `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`;
}

/**
 * Idempotent add-or-update of a list member.
 *
 * Uses `PUT /members/{hash}` with `status_if_new` rather than `POST /members`:
 * POST returns 400 "Member Exists" on every repeat signup, and — more
 * importantly — force-setting `status: subscribed` on someone who previously
 * unsubscribed is rejected by Mailchimp and would be a compliance problem even
 * if it weren't. With `status_if_new` we only opt in genuinely new addresses
 * and leave an existing member's status exactly as they left it.
 */
export async function subscribeToMailchimp(
  params: SubscribeParams,
): Promise<SubscribeResult> {
  if (!apiKey || !listId) {
    console.log(
      `[mailchimp:dry-run] subscribe email=${params.email} source=${params.source ?? "—"}`,
    );
    return { ok: true, status: "dry-run" };
  }

  const hash = subscriberHash(params.email);
  const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members/${hash}`;

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: authHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: params.email,
        status_if_new: "subscribed",
        merge_fields: {
          FNAME: params.firstName ?? "",
          LNAME: params.lastName ?? "",
          SOURCE: params.source ?? "site",
          LOCALE: params.locale ?? "es",
          ...(params.phone ? { PHONE: params.phone } : {}),
        },
      }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        status: "error",
        error: data?.detail || data?.title || res.statusText,
      };
    }

    // Tags are a separate endpoint; failing to tag must not fail the signup.
    if (params.tags && params.tags.length > 0) {
      try {
        await fetch(`${url}/tags`, {
          method: "POST",
          headers: {
            Authorization: authHeader(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tags: params.tags.map((name) => ({ name, status: "active" })),
          }),
        });
      } catch (e) {
        console.error("[mailchimp] tagging failed", e);
      }
    }

    return { ok: true, status: data?.status ?? "subscribed" };
  } catch (e) {
    return {
      ok: false,
      status: "error",
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
