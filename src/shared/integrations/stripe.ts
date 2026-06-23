/**
 * Stripe — minimal server client + checkout helpers.
 * Falls back to dry-run when STRIPE_SECRET_KEY is empty (dev mode).
 */
import "server-only";

const secret = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export interface CheckoutLine {
  priceId?: string;
  productName: string;
  amountMxn: number;
  quantity?: number;
}

export interface CheckoutParams {
  customerEmail?: string;
  retreatSlug?: string;
  pathSlug?: string;
  successPath?: string;
  cancelPath?: string;
  metadata?: Record<string, string>;
  lines: CheckoutLine[];
}

export interface CheckoutResult {
  ok: boolean;
  url?: string;
  sessionId?: string;
  error?: string;
  dryRun?: boolean;
}

/**
 * Create a Stripe Checkout Session. In dev / no-key mode, returns a synthetic
 * URL so the front-end flow is fully testable.
 */
export async function createCheckoutSession(
  params: CheckoutParams,
): Promise<CheckoutResult> {
  const successUrl = `${appUrl}${params.successPath ?? "/es/gracias"}?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${appUrl}${params.cancelPath ?? "/es/retiros"}`;

  if (!secret) {
    console.log(
      `[stripe:dry-run] checkout retreat=${params.retreatSlug ?? "—"} email=${params.customerEmail ?? "—"} lines=${params.lines.length}`,
    );
    return {
      ok: true,
      dryRun: true,
      sessionId: `cs_dryrun_${Date.now()}`,
      url: `${appUrl}/es/gracias?session_id=cs_dryrun_demo&dryrun=1`,
    };
  }

  const body = new URLSearchParams();
  body.append("mode", "payment");
  body.append("success_url", successUrl);
  body.append("cancel_url", cancelUrl);
  if (params.customerEmail) body.append("customer_email", params.customerEmail);

  params.lines.forEach((l, i) => {
    if (l.priceId) {
      body.append(`line_items[${i}][price]`, l.priceId);
      body.append(`line_items[${i}][quantity]`, String(l.quantity ?? 1));
    } else {
      body.append(`line_items[${i}][price_data][currency]`, "mxn");
      body.append(`line_items[${i}][price_data][product_data][name]`, l.productName);
      body.append(
        `line_items[${i}][price_data][unit_amount]`,
        String(Math.round(l.amountMxn * 100)),
      );
      body.append(`line_items[${i}][quantity]`, String(l.quantity ?? 1));
    }
  });

  if (params.retreatSlug) body.append("metadata[retreat_slug]", params.retreatSlug);
  if (params.pathSlug) body.append("metadata[path_slug]", params.pathSlug);
  for (const [k, v] of Object.entries(params.metadata ?? {})) {
    body.append(`metadata[${k}]`, v);
  }

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        ok: false,
        error: data?.error?.message || res.statusText,
      };
    }
    return { ok: true, url: data.url, sessionId: data.id };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
