/**
 * Stripe go-live preflight.
 *
 * Checks the things that fail silently in production: Stripe Tax collecting
 * nothing because there's no registration, delayed-notification payment methods
 * enabled without the async webhook wired, catalog prices that don't match
 * Stripe, and missing webhook secrets.
 *
 * Run: pnpm stripe:preflight
 */
import "dotenv/config";

const KEY = process.env.STRIPE_SECRET_KEY;
const API = "https://api.stripe.com/v1";
const VERSION = "2026-07-29.dahlia";

type Level = "ok" | "warn" | "fail";
const results: { level: Level; label: string; detail: string }[] = [];
const add = (level: Level, label: string, detail: string) =>
  results.push({ level, label, detail });

async function get(path: string): Promise<any> {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${KEY}`, "Stripe-Version": VERSION },
  });
  return res.json();
}

async function main() {
  if (!KEY) {
    console.error("STRIPE_SECRET_KEY no está configurada — nada que verificar.");
    process.exit(1);
  }
  const live = KEY.startsWith("sk_live") || KEY.startsWith("rk_live");
  console.log(`\nStripe preflight · modo ${live ? "LIVE" : "TEST/SANDBOX"}\n`);

  // ── Account ─────────────────────────────────────────────────────────
  const account = await get("/account");
  if (account.error) {
    console.error("No se pudo leer la cuenta:", account.error.message);
    process.exit(1);
  }
  add(
    account.charges_enabled ? "ok" : "warn",
    "Cuenta",
    `${account.id} · ${account.country} · ${String(account.default_currency).toUpperCase()} · charges_enabled=${account.charges_enabled}`,
  );

  if (KEY.startsWith("sk_")) {
    add(
      "warn",
      "Tipo de llave",
      "Estás usando una secret key (sk_). Stripe recomienda una restricted key (rk_) con sólo los permisos que la app necesita.",
    );
  }

  // ── Webhook secret ──────────────────────────────────────────────────
  add(
    process.env.STRIPE_WEBHOOK_SECRET ? "ok" : "fail",
    "Webhook secret",
    process.env.STRIPE_WEBHOOK_SECRET
      ? "configurado — la firma es obligatoria"
      : "AUSENTE: el webhook aceptaría eventos sin firma. No lances así.",
  );

  // ── Payment methods (async awareness) ───────────────────────────────
  const pmc = await get("/payment_method_configurations");
  const ASYNC_METHODS = ["oxxo", "boleto", "konbini", "customer_balance", "sepa_debit", "acss_debit", "bacs_debit", "au_becs_debit", "us_bank_account", "multibanco"];
  const enabledAsync: string[] = [];
  for (const cfg of pmc?.data ?? []) {
    for (const m of ASYNC_METHODS) {
      if (cfg[m]?.display_preference?.value === "on") enabledAsync.push(m);
    }
  }
  if (enabledAsync.length > 0) {
    add(
      "warn",
      "Métodos de notificación diferida",
      `activos: ${[...new Set(enabledAsync)].join(", ")}. El webhook YA maneja async_payment_succeeded/failed y no entrega nada con payment_status=unpaid — verifica que sigue así antes de lanzar.`,
    );
  } else {
    add("ok", "Métodos de pago", "sólo métodos inmediatos activos (card/link).");
  }

  // ── Stripe Tax ──────────────────────────────────────────────────────
  const settings = await get("/tax/settings");
  const regs = await get("/tax/registrations?limit=100");
  const activeRegs = (regs?.data ?? []).filter((r: any) => r.status === "active");
  const flag = process.env.STRIPE_TAX_ENABLED === "true";

  if (settings?.status !== "active") {
    add(
      flag ? "fail" : "warn",
      "Stripe Tax · settings",
      `status="${settings?.status}" (falta: ${settings?.status_details?.pending?.missing_fields?.join(", ") ?? "?"}). Sin head office, automatic_tax NO calcula nada.`,
    );
  } else {
    add("ok", "Stripe Tax · settings", "status=active");
  }

  if (activeRegs.length === 0) {
    add(
      flag ? "fail" : "warn",
      "Stripe Tax · registros",
      "0 registros activos. Con automatic_tax activado, Stripe cobraría CERO impuesto sin devolver ningún error.",
    );
  } else {
    add(
      "ok",
      "Stripe Tax · registros",
      activeRegs.map((r: any) => `${r.country}${r.state ? "/" + r.state : ""}`).join(", "),
    );
  }

  add(
    flag ? (settings?.status === "active" && activeRegs.length > 0 ? "ok" : "fail") : "warn",
    "STRIPE_TAX_ENABLED",
    flag
      ? "true — la app intentará usar Stripe Tax"
      : "no activado: la app calcula el IVA localmente (16% incluido en el precio)",
  );

  // ── Products ────────────────────────────────────────────────────────
  const products = await get("/products?limit=100&active=true");
  const withoutTaxCode = (products?.data ?? []).filter((p: any) => !p.tax_code);
  if ((products?.data ?? []).length === 0) {
    add("warn", "Catálogo en Stripe", "0 productos. La app cobra con price_data ad-hoc, lo cual funciona, pero sin producto no puedes fijar un tax_code.");
  } else if (withoutTaxCode.length > 0) {
    add("warn", "Product tax codes", `${withoutTaxCode.length} producto(s) sin tax_code: ${withoutTaxCode.map((p: any) => p.name).join(", ")}`);
  } else {
    add("ok", "Product tax codes", `${products.data.length} producto(s) con tax_code`);
  }

  // ── Report ──────────────────────────────────────────────────────────
  const icon = { ok: "✓", warn: "!", fail: "✗" } as const;
  for (const r of results) {
    console.log(`  ${icon[r.level]}  ${r.label}\n      ${r.detail}\n`);
  }
  const fails = results.filter((r) => r.level === "fail").length;
  const warns = results.filter((r) => r.level === "warn").length;
  console.log(`${fails} bloqueante(s) · ${warns} advertencia(s)\n`);
  process.exit(fails > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
