/**
 * Stripe — minimal server client + checkout helpers.
 * Falls back to dry-run when STRIPE_SECRET_KEY is empty (dev mode).
 */
import "server-only";

const secret = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Pin the API version so a Stripe-side upgrade can never silently change the
 * shape of what we parse. Bump deliberately, after reading the changelog.
 */
const API_VERSION = "2026-07-29.dahlia";

const API_BASE = "https://api.stripe.com/v1";

export interface CheckoutLine {
  priceId?: string;
  productName: string;
  amountMxn: number;
  quantity?: number;
  /**
   * How the amount relates to tax. Mexican consumer prices are quoted IVA
   * included, and our catalog stores them that way, so `inclusive` keeps the
   * customer-facing price identical whether or not Stripe Tax is on.
   */
  taxBehavior?: "inclusive" | "exclusive";
}

export interface CheckoutParams {
  customerEmail?: string;
  retreatSlug?: string;
  pathSlug?: string;
  successPath?: string;
  cancelPath?: string;
  metadata?: Record<string, string>;
  lines: CheckoutLine[];
  /** Enable Stripe Tax. Only pass true when registrations are verified. */
  automaticTax?: boolean;
}

export interface CheckoutResult {
  ok: boolean;
  url?: string;
  sessionId?: string;
  error?: string;
  dryRun?: boolean;
}

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${secret}`,
    "Content-Type": "application/x-www-form-urlencoded",
    "Stripe-Version": API_VERSION,
  };
}

/** Stable-ish label for grouping these sessions in the Dashboard. */
function integrationIdentifier(): string {
  return "elements-web-cwtnvqrb";
}

/**
 * Create a Stripe Checkout Session. In dev / no-key mode, returns a synthetic
 * URL so the front-end flow is fully testable.
 *
 * `payment_method_types` is deliberately never sent: omitting it enables
 * dynamic payment methods, so the methods shown are controlled from the
 * Dashboard and ranked per customer. Note that enabling a delayed-notification
 * method there (OXXO, SPEI, bank debits) makes the async webhook events load
 * bearing — see the webhook handler.
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
  body.append("integration_identifier", integrationIdentifier());
  if (params.customerEmail) body.append("customer_email", params.customerEmail);

  if (params.automaticTax) {
    body.append("automatic_tax[enabled]", "true");
  }

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
      // Stripe Tax requires an explicit tax_behavior on ad-hoc prices.
      body.append(
        `line_items[${i}][price_data][tax_behavior]`,
        l.taxBehavior ?? "inclusive",
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
    const res = await fetch(`${API_BASE}/checkout/sessions`, {
      method: "POST",
      headers: authHeaders(),
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

export interface RetrievedSession {
  id: string;
  payment_status: "paid" | "unpaid" | "no_payment_required";
  amount_total: number | null;
  amount_subtotal: number | null;
  currency: string | null;
  customer_email: string | null;
  total_details?: { amount_tax?: number; amount_discount?: number };
  automatic_tax?: { enabled: boolean; status: string | null };
  metadata?: Record<string, string>;
}

/**
 * Re-read a session from Stripe.
 *
 * The webhook payload is trusted only for *which* session changed; the amounts
 * we persist are read back from the API so a replayed or stale event can never
 * write figures that disagree with Stripe's own record.
 */
export async function retrieveSession(
  sessionId: string,
): Promise<{ ok: true; session: RetrievedSession } | { ok: false; error: string }> {
  if (!secret) return { ok: false, error: "NO_STRIPE_KEY" };
  try {
    const res = await fetch(
      `${API_BASE}/checkout/sessions/${encodeURIComponent(sessionId)}`,
      { headers: authHeaders() },
    );
    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data?.error?.message || res.statusText };
    }
    return { ok: true, session: data as RetrievedSession };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/**
 * Whether Stripe Tax will actually collect anything.
 *
 * Enabling `automatic_tax` without an active registration is silent: Stripe
 * returns no error and collects zero tax while the integration believes tax is
 * on. This check is what keeps that from happening — see scripts/stripePreflight.ts.
 */
export async function taxIsCollecting(): Promise<{
  ready: boolean;
  settingsStatus: string | null;
  registrations: { country: string; status: string }[];
  reason?: string;
}> {
  if (!secret) {
    return { ready: false, settingsStatus: null, registrations: [], reason: "NO_STRIPE_KEY" };
  }
  try {
    const [settingsRes, regsRes] = await Promise.all([
      fetch(`${API_BASE}/tax/settings`, { headers: authHeaders() }),
      fetch(`${API_BASE}/tax/registrations?limit=100`, { headers: authHeaders() }),
    ]);
    const settings = await settingsRes.json();
    const regs = await regsRes.json();
    const active = (regs?.data ?? []).filter(
      (r: { status: string }) => r.status === "active",
    );
    const settingsStatus = settings?.status ?? null;
    return {
      ready: settingsStatus === "active" && active.length > 0,
      settingsStatus,
      registrations: (regs?.data ?? []).map((r: { country: string; status: string }) => ({
        country: r.country,
        status: r.status,
      })),
      reason:
        settingsStatus !== "active"
          ? "TAX_SETTINGS_PENDING"
          : active.length === 0
            ? "NO_ACTIVE_REGISTRATION"
            : undefined,
    };
  } catch (e) {
    return {
      ready: false,
      settingsStatus: null,
      registrations: [],
      reason: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

/**
 * Cached answer to "should this checkout enable Stripe Tax?".
 *
 * Gated on an explicit env flag AND a live confirmation that Stripe would
 * actually collect. Both are needed: the flag alone is how teams end up
 * believing tax is on while Stripe silently collects nothing, and the live
 * check alone would turn tax on the moment a registration appears, without
 * anyone deciding to.
 *
 * Fails closed — on any doubt we keep the local IVA-inclusive maths, which at
 * least matches what the receipt PDF prints.
 */
let taxCache: { at: number; value: boolean } | null = null;
const TAX_CACHE_MS = 5 * 60 * 1000;

export async function shouldUseAutomaticTax(): Promise<boolean> {
  if (process.env.STRIPE_TAX_ENABLED !== "true") return false;
  if (taxCache && Date.now() - taxCache.at < TAX_CACHE_MS) return taxCache.value;

  const status = await taxIsCollecting();
  if (!status.ready) {
    console.error(
      `[stripe:tax] STRIPE_TAX_ENABLED=true but Stripe would collect nothing (${status.reason}). ` +
        `Keeping local IVA calculation. Run \`pnpm stripe:preflight\` for details.`,
    );
  }
  taxCache = { at: Date.now(), value: status.ready };
  return status.ready;
}
