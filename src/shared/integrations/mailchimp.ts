/**
 * Mailchimp Marketing API — minimal client.
 * Falls back to no-op when MAILCHIMP_API_KEY is empty (dev mode).
 */
import "server-only";

const apiKey = process.env.MAILCHIMP_API_KEY;
const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || "us21";
const listId = process.env.MAILCHIMP_LIST_ID;

export interface SubscribeParams {
  email: string;
  firstName?: string;
  lastName?: string;
  source?: string;
  locale?: "es" | "en";
  tags?: string[];
}

export async function subscribeToMailchimp(
  params: SubscribeParams,
): Promise<{ ok: boolean; status: string; error?: string }> {
  if (!apiKey || !listId) {
    console.log(
      `[mailchimp:dry-run] subscribe email=${params.email} source=${params.source ?? "—"}`,
    );
    return { ok: true, status: "dry-run" };
  }
  const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: params.email,
        status: "subscribed",
        merge_fields: {
          FNAME: params.firstName ?? "",
          LNAME: params.lastName ?? "",
          SOURCE: params.source ?? "site",
          LOCALE: params.locale ?? "es",
        },
        tags: params.tags ?? [],
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      // 400 with title "Member Exists" is fine — return ok=true so the form shows success.
      if (data?.title === "Member Exists") {
        return { ok: true, status: "already-subscribed" };
      }
      return { ok: false, status: "error", error: data?.detail || res.statusText };
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
