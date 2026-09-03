"use client";

import { useState } from "react";
import {
  Loader2,
  ArrowUpRight,
  AlertCircle,
  CreditCard,
  FileText,
  Check,
} from "lucide-react";
import type { Locale } from "@/i18n/config";

export interface RequiredDocLite {
  slug: string;
  nameEs: string;
  nameEn: string;
}

export interface CheckoutButtonProps {
  locale: Locale;
  retreatSlug?: string;
  /** Catalog product slug. The server prices it — the amount is never sent. */
  productSlug: string;
  label?: string;
  className?: string;
  /** Documents the buyer must accept before paying (RF-CMP-02). */
  requiredDocs?: RequiredDocLite[];
}

export function CheckoutButton({
  locale,
  retreatSlug,
  productSlug,
  label,
  className = "",
  requiredDocs = [],
}: CheckoutButtonProps) {
  const [state, setState] = useState<
    "idle" | "docs" | "form" | "loading" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});

  const allAccepted =
    requiredDocs.length === 0 ||
    requiredDocs.every((d) => accepted[d.slug]);

  async function startCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          retreatSlug,
          productSlug,
          email: String(fd.get("email") ?? "").trim(),
          name: String(fd.get("name") ?? "").trim(),
          locale,
          acceptedDocs: requiredDocs
            .filter((d) => accepted[d.slug])
            .map((d) => d.slug),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok || !data.url) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      window.location.href = data.url;
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown");
    }
  }

  if (state === "form" || state === "loading" || state === "error") {
    return (
      <form
        onSubmit={startCheckout}
        className={`bg-[var(--color-paper)] border border-[var(--color-line)] p-5 space-y-4 ${className}`}
      >
        <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink)]">
          {locale === "es" ? "Datos para el pago" : "Payment details"}
        </div>
        <input
          type="text"
          name="name"
          required
          placeholder={locale === "es" ? "Nombre completo" : "Full name"}
          className="w-full border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)]"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          className="w-full border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)]"
        />
        {state === "error" && (
          <div className="text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{errorMsg || (locale === "es" ? "Reintenta." : "Try again.")}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={state === "loading"}
          className="w-full inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-3 text-sm tracking-wide hover:bg-[var(--color-ink)]/90 disabled:opacity-60 transition-colors"
        >
          {state === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {locale === "es" ? "Redirigiendo a Stripe…" : "Redirecting to Stripe…"}
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              {locale === "es" ? "Continuar a Stripe" : "Continue to Stripe"}
              <ArrowUpRight className="h-4 w-4" />
            </>
          )}
        </button>
        <p className="text-[0.7rem] text-[var(--color-muted)] leading-relaxed">
          {locale === "es"
            ? "Pago seguro vía Stripe. Recibirás recibo y confirmación por email."
            : "Secure payment via Stripe. You'll receive receipt and confirmation by email."}
        </p>
      </form>
    );
  }

  // ── Step: document acceptance gate (clip-a-clip) ────────────────────
  if (state === "docs") {
    return (
      <div
        className={`bg-[var(--color-paper)] border border-[var(--color-line)] p-5 space-y-4 ${className}`}
      >
        <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          {locale === "es"
            ? "Acepta los documentos para continuar"
            : "Accept the documents to continue"}
        </div>
        <ul className="space-y-3">
          {requiredDocs.map((d) => (
            <li key={d.slug} className="flex items-start gap-3">
              <button
                type="button"
                onClick={() =>
                  setAccepted((a) => ({ ...a, [d.slug]: !a[d.slug] }))
                }
                aria-pressed={!!accepted[d.slug]}
                className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                  accepted[d.slug]
                    ? "bg-[var(--color-ink)] border-[var(--color-ink)] text-[var(--color-paper)]"
                    : "border-[var(--color-line)] hover:border-[var(--color-ink)]"
                }`}
              >
                {accepted[d.slug] && <Check className="h-3 w-3" strokeWidth={3} />}
              </button>
              <div className="flex-1 min-w-0 text-sm">
                <span className="text-[var(--color-ink-soft)]">
                  {locale === "es" ? "He leído y acepto: " : "I have read and accept: "}
                </span>
                <a
                  href={`/api/documento/${d.slug}?lang=${locale}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--color-ink)] underline underline-offset-2 hover:text-[var(--color-gold-deep)]"
                >
                  <FileText className="h-3 w-3" />
                  {locale === "es" ? d.nameEs : d.nameEn}
                </a>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          disabled={!allAccepted}
          onClick={() => setState("form")}
          className="w-full inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-3 text-sm tracking-wide hover:bg-[var(--color-ink)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {locale === "es" ? "Continuar al pago" : "Continue to payment"}
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setState(requiredDocs.length > 0 ? "docs" : "form")}
      className={`inline-flex items-center justify-center gap-2 bg-[var(--color-paper)] text-[var(--color-ink)] px-4 py-3 text-sm tracking-wide hover:bg-[var(--color-paper-warm)] border border-[var(--color-paper)]/30 transition-colors w-full ${className}`}
    >
      <CreditCard className="h-4 w-4" />
      {label ?? (locale === "es" ? "Pagar con tarjeta" : "Pay by card")}
    </button>
  );
}
