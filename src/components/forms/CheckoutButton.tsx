"use client";

import { useState } from "react";
import { Loader2, ArrowUpRight, AlertCircle, CreditCard } from "lucide-react";
import type { Locale } from "@/i18n/config";

export interface CheckoutButtonProps {
  locale: Locale;
  retreatSlug?: string;
  pathSlug?: string;
  productName: string;
  amountMxn: number;
  label?: string;
  className?: string;
}

export function CheckoutButton({
  locale,
  retreatSlug,
  pathSlug,
  productName,
  amountMxn,
  label,
  className = "",
}: CheckoutButtonProps) {
  const [state, setState] = useState<"idle" | "form" | "loading" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

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
          pathSlug,
          email: String(fd.get("email") ?? "").trim(),
          name: String(fd.get("name") ?? "").trim(),
          amountMxn,
          productName,
          locale,
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
        <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          {locale === "es" ? "Datos para el pago" : "Payment details"}
        </div>
        <input
          type="text"
          name="name"
          required
          placeholder={locale === "es" ? "Nombre completo" : "Full name"}
          className="w-full border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-2 text-sm focus:outline-none focus:border-[var(--color-ink)]"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          className="w-full border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-2 text-sm focus:outline-none focus:border-[var(--color-ink)]"
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

  return (
    <button
      type="button"
      onClick={() => setState("form")}
      className={`inline-flex items-center justify-center gap-2 bg-[var(--color-paper)] text-[var(--color-ink)] px-4 py-3 text-sm tracking-wide hover:bg-[var(--color-paper-warm)] border border-[var(--color-paper)]/30 transition-colors w-full ${className}`}
    >
      <CreditCard className="h-4 w-4" />
      {label ?? (locale === "es" ? "Pagar con tarjeta" : "Pay by card")}
    </button>
  );
}
