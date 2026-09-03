/**
 * Resend transactional email helper.
 *
 * In dev or when RESEND_API_KEY is empty we log to stdout instead of sending.
 * This keeps the form flows demoable without burning real send quota.
 */
import "server-only";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromAddress =
  process.env.RESEND_FROM_TRANSACTIONAL || "hola@elementsmethod.com";
const opsAddress = process.env.OPS_EMAIL || "hello@elementsmethod.com";

const client = apiKey ? new Resend(apiKey) : null;

/**
 * Absolute site URL for links inside emails.
 *
 * NEXT_PUBLIC_APP_URL is the source of truth; on Vercel we fall back to the
 * deployment URL so preview builds still produce clickable links, and finally
 * to the production domain.
 */
export function appUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "https://www.elementsmethod.com";
}

export interface MailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendMail(params: MailParams): Promise<{
  ok: boolean;
  id?: string;
  error?: string;
}> {
  if (!client) {
    console.log(
      `[mail:dry-run] to=${Array.isArray(params.to) ? params.to.join(",") : params.to} subject="${params.subject}"`,
    );
    return { ok: true, id: "dry-run" };
  }
  try {
    const res = await client.emails.send({
      from: `Elements Method <${fromAddress}>`,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: params.replyTo,
    });
    if (res.error) {
      return { ok: false, error: res.error.message };
    }
    return { ok: true, id: res.data?.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export const OPS_EMAIL = opsAddress;

/**
 * Send several emails concurrently without letting one failure sink the others
 * or the request.
 *
 * Every send is awaited: on serverless the function can be frozen the moment
 * the response is returned, so a fire-and-forget `void sendMail(...)` is
 * routinely killed mid-flight and the mail is silently lost.
 */
export async function sendAll(mails: MailParams[]): Promise<void> {
  const results = await Promise.allSettled(mails.map((m) => sendMail(m)));
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`[mail] send threw for "${mails[i].subject}"`, r.reason);
    } else if (!r.value.ok) {
      console.error(`[mail] send failed for "${mails[i].subject}": ${r.value.error}`);
    }
  });
}

/**
 * Minimal HTML email template — branded, mobile-friendly, inline styles only.
 */
export function emailLayout({
  title,
  preheader,
  body,
}: {
  title: string;
  preheader?: string;
  body: string;
}): string {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Jost',ui-sans-serif,system-ui,sans-serif;color:#2C2C2A;">
  ${
    preheader
      ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>`
      : ""
  }
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F5F0E8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;background:#FFFFFF;border:1px solid #E7E1D4;">
          <tr>
            <td style="padding:32px 36px;border-bottom:1px solid #E7E1D4;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="padding-right:14px;">
                    <img src="${process.env.NEXT_PUBLIC_APP_URL || "https://elementsmethod.com"}/images/elements/elements_logo.jpeg" width="52" height="52" alt="Elements Method" style="display:block;border:0;border-radius:6px;" />
                  </td>
                  <td valign="middle">
                    <div style="font-family:'Cormorant Garamond',ui-serif,Georgia,serif;font-size:22px;letter-spacing:.04em;color:#2C2C2A;font-weight:500;">
                      Elements Method
                    </div>
                    <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#5A5752;margin-top:4px;">
                      Leadership Immersion Programs
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 36px;font-size:15px;line-height:1.65;color:#2C2C2A;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 36px;border-top:1px solid #E7E1D4;font-size:12px;color:#5A5752;background:#F5F0E8;">
              Elements Method · Ciudad de México<br />
              <a href="mailto:hello@elementsmethod.com" style="color:#5A5752;">hello@elementsmethod.com</a> · <a href="https://www.elementsmethod.com" style="color:#5A5752;">www.elementsmethod.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export { escapeHtml };
