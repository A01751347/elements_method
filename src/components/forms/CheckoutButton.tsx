"use client";

import { useState } from "react";
import {
  Loader2,
  ArrowUpRight,
  AlertCircle,
  CreditCard,
  Banknote,
  FileText,
  Check,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { PaymentMethod } from "@/shared/payments/methods";

export interface RequiredDocLite {
  slug: string;
  nameEs: string;
  nameEn: string;
  /** Readable public page for the document; falls back to the PDF endpoint. */
  href?: string;
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
  /**
   * Payment methods to offer, decided on the server from env flags (see
   * `enabledPaymentMethods`). With one method the selector is hidden.
   */
  paymentMethods?: PaymentMethod[];
}

const DEFAULT_METHODS: PaymentMethod[] = ["stripe", "transferencia"];

export function CheckoutButton({
  locale,
  retreatSlug,
  productSlug,
  label,
  className = "",
  requiredDocs = [],
  paymentMethods = DEFAULT_METHODS,
}: CheckoutButtonProps) {
  const es = locale === "es";
  const methods = paymentMethods.length > 0 ? paymentMethods : DEFAULT_METHODS;

  const [state, setState] = useState<
    "idle" | "docs" | "form" | "loading" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [method, setMethod] = useState<PaymentMethod>(methods[0]);

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
          phone: String(fd.get("phone") ?? "").trim(),
          company: String(fd.get("company") ?? "").trim() || undefined,
          locale,
          paymentMethod: method,
          acceptedDocs: requiredDocs
            .filter((d) => accepted[d.slug])
            .map((d) => d.slug),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok || !data.url) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      // Stripe: hosted checkout. Deposit: our /transferencia page with the
      // folio prefilled so the buyer can upload the proof later.
      window.location.href = data.url;
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown");
    }
  }

  if (state === "form" || state === "loading" || state === "error") {
    const isTransfer = method === "transferencia";
    return (
      <form
        onSubmit={startCheckout}
        className={`bg-[var(--color-paper)] border border-[var(--color-line)] p-5 space-y-4 ${className}`}
      >
        <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink)]">
          {es ? "Datos para el pago" : "Payment details"}
        </div>
        <input
          type="text"
          name="name"
          required
          placeholder={es ? "Nombre completo" : "Full name"}
          className="w-full border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)]"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          className="w-full border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)]"
        />
        <input
          type="tel"
          name="phone"
          required
          autoComplete="tel"
          inputMode="tel"
          minLength={7}
          placeholder={es ? "Teléfono (WhatsApp)" : "Phone (WhatsApp)"}
          className="w-full border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)]"
        />
        <input
          type="text"
          name="company"
          autoComplete="organization"
          maxLength={160}
          placeholder={es ? "Empresa (opcional)" : "Company (optional)"}
          className="w-full border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-ink)]"
        />

        {methods.length > 1 && (
          <fieldset className="space-y-2">
            <legend className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-2">
              {es ? "Forma de pago" : "Payment method"}
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {methods.map((m) => {
                const selected = m === method;
                const Icon = m === "stripe" ? CreditCard : Banknote;
                const title =
                  m === "stripe"
                    ? es ? "Tarjeta" : "Card"
                    : es ? "Depósito / SPEI" : "Bank deposit / SPEI";
                const hint =
                  m === "stripe"
                    ? es ? "Pago inmediato vía Stripe" : "Immediate payment via Stripe"
                    : es ? "Te enviamos los datos por correo" : "We email you the details";
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    aria-pressed={selected}
                    className={`text-left border px-3 py-3 transition-colors ${
                      selected
                        ? "border-[var(--color-ink)] bg-[var(--color-paper-warm)]"
                        : "border-[var(--color-line)] hover:border-[var(--color-ink)]"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
                      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      <span className="font-medium">{title}</span>
                      {selected && <Check className="h-3.5 w-3.5 ml-auto" strokeWidth={2.5} />}
                    </div>
                    <div className="mt-1 text-[0.7rem] text-[var(--color-muted)] leading-snug">
                      {hint}
                    </div>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {state === "error" && (
          <div className="text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{errorMsg || (es ? "Reintenta." : "Try again.")}</span>
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
              {isTransfer
                ? es ? "Registrando tu reserva…" : "Registering your reservation…"
                : es ? "Redirigiendo a Stripe…" : "Redirecting to Stripe…"}
            </>
          ) : isTransfer ? (
            <>
              <Banknote className="h-4 w-4" />
              {es ? "Reservar y recibir datos de depósito" : "Reserve and get deposit details"}
              <ArrowUpRight className="h-4 w-4" />
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              {es ? "Continuar a Stripe" : "Continue to Stripe"}
              <ArrowUpRight className="h-4 w-4" />
            </>
          )}
        </button>
        <p className="text-[0.7rem] text-[var(--color-muted)] leading-relaxed">
          {isTransfer
            ? es
              ? "Registramos tu reserva y te contactamos por correo con los datos para tu depósito o SPEI. Tu lugar se confirma al validar el pago."
              : "We register your reservation and email you the details for your deposit or SPEI. Your seat is confirmed once payment is validated."
            : es
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
          {requiredDocs.length === 1
            ? es ? "Términos y condiciones" : "Terms and conditions"
            : es ? "Acepta los documentos para continuar" : "Accept the documents to continue"}
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
                  {es ? "He leído y acepto: " : "I have read and accept: "}
                </span>
                <a
                  href={d.href ?? `/api/documento/${d.slug}?lang=${locale}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--color-ink)] underline underline-offset-2 hover:text-[var(--color-gold-deep)]"
                >
                  <FileText className="h-3 w-3" />
                  {es ? d.nameEs : d.nameEn}
                </a>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-[0.7rem] text-[var(--color-muted)] leading-relaxed">
          {es
            ? "Al aceptar celebras el contrato de adhesión de compra. Los documentos de participación se firman después de confirmar el pago."
            : "By accepting you enter into the purchase adhesion contract. Participation documents are signed after payment is confirmed."}
        </p>
        <button
          type="button"
          disabled={!allAccepted}
          onClick={() => setState("form")}
          className="w-full inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-3 text-sm tracking-wide hover:bg-[var(--color-ink)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {es ? "Continuar al pago" : "Continue to payment"}
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const onlyTransfer = methods.length === 1 && methods[0] === "transferencia";
  const onlyCard = methods.length === 1 && methods[0] === "stripe";
  const IdleIcon = onlyTransfer ? Banknote : CreditCard;
  const idleLabel =
    label ??
    (onlyCard
      ? es ? "Pagar con tarjeta" : "Pay by card"
      : onlyTransfer
        ? es ? "Reservar con depósito" : "Reserve by bank deposit"
        : es ? "Reservar mi lugar" : "Reserve my seat");

  return (
    <button
      type="button"
      onClick={() => setState(requiredDocs.length > 0 ? "docs" : "form")}
      className={`inline-flex items-center justify-center gap-2 bg-[var(--color-paper)] text-[var(--color-ink)] px-4 py-3 text-sm tracking-wide hover:bg-[var(--color-paper-warm)] border border-[var(--color-paper)]/30 transition-colors w-full ${className}`}
    >
      <IdleIcon className="h-4 w-4" />
      {idleLabel}
    </button>
  );
}
