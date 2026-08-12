"use client";

import * as React from "react";
import { Loader2, Check, AlertCircle, Download } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type {
  CalculatorConfigResolved,
  QuoteBreakdown,
  Modality,
  QuoteCurrency,
} from "@/shared/pricing/enterpriseCompute";
import { computeQuote } from "@/shared/pricing/enterpriseCompute";

const COPY = {
  es: {
    people: "Número de participantes",
    sessions: "Número de sesiones",
    modality: "Modalidad",
    presencial: "Presencial",
    virtual: "Virtual",
    hibrido: "Híbrido",
    currency: "Moneda",
    estimate: "Estimado",
    subtotal: "Subtotal",
    discount: "Descuento por volumen",
    iva: "IVA",
    total: "Total estimado",
    company: "Empresa",
    contactName: "Nombre de contacto",
    email: "Email",
    phone: "Teléfono (opcional)",
    notes: "Notas (opcional)",
    submit: "Solicitar cotización formal",
    sending: "Enviando…",
    successTitle: "Cotización enviada",
    successBody:
      "Te enviamos la cotización por email y un miembro del equipo te contactará para afinarla.",
    download: "Descargar cotización (PDF)",
    error: "Ocurrió un error. Reintenta.",
    disclaimer:
      "Estimado no vinculante. El precio final depende del alcance, fechas y disponibilidad.",
  },
  en: {
    people: "Number of participants",
    sessions: "Number of sessions",
    modality: "Modality",
    presencial: "In person",
    virtual: "Virtual",
    hibrido: "Hybrid",
    currency: "Currency",
    estimate: "Estimate",
    subtotal: "Subtotal",
    discount: "Volume discount",
    iva: "VAT",
    total: "Estimated total",
    company: "Company",
    contactName: "Contact name",
    email: "Email",
    phone: "Phone (optional)",
    notes: "Notes (optional)",
    submit: "Request formal quote",
    sending: "Sending…",
    successTitle: "Quote sent",
    successBody:
      "We've emailed your quote and a team member will reach out to tailor it.",
    download: "Download quote (PDF)",
    error: "Something went wrong. Please retry.",
    disclaimer:
      "Non-binding estimate. Final price depends on scope, dates and availability.",
  },
} as const;

function money(n: number, currency: string, locale: Locale): string {
  return `$${n.toLocaleString(locale === "es" ? "es-MX" : "en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

export function QuoteCalculator({
  locale,
  config,
}: {
  locale: Locale;
  config: CalculatorConfigResolved;
}) {
  const c = COPY[locale];
  const [people, setPeople] = React.useState(config.minPeople);
  const [sessions, setSessions] = React.useState(config.minSessions);
  const [modality, setModality] = React.useState<Modality>("presencial");
  const [currency, setCurrency] = React.useState<QuoteCurrency>("MXN");
  const [state, setState] = React.useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState("");

  // Live estimate — computed client-side with the same engine as the server.
  const breakdown: QuoteBreakdown = React.useMemo(
    () => computeQuote({ people, sessions, modality, currency }, config),
    [people, sessions, modality, currency, config],
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setErrorMsg("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/cotizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: String(fd.get("companyName") ?? "").trim(),
          contactName: String(fd.get("contactName") ?? "").trim(),
          contactEmail: String(fd.get("contactEmail") ?? "").trim(),
          contactPhone: String(fd.get("contactPhone") ?? "").trim() || undefined,
          notes: String(fd.get("notes") ?? "").trim() || undefined,
          people,
          sessions,
          modality,
          currency,
          locale,
          honeypot: String(fd.get("company_url") ?? ""),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setPdfUrl(data.pdfUrl ?? null);
      setState("success");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown");
    }
  }

  if (state === "success") {
    return (
      <div className="bg-[var(--color-paper)] border border-[var(--color-line)] p-8 text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-5">
          <Check className="h-6 w-6 text-emerald-700" strokeWidth={2} />
        </div>
        <h3 className="font-[family-name:var(--font-display)] text-2xl mb-3">
          {c.successTitle}
        </h3>
        <p className="text-[var(--color-ink-soft)] mb-6 max-w-md mx-auto">
          {c.successBody}
        </p>
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] px-5 py-3 text-sm hover:bg-[var(--color-ink)]/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            {c.download}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Inputs + live estimate */}
      <div className="space-y-6">
        <Field label={c.people}>
          <input
            type="number"
            min={config.minPeople}
            max={500}
            value={people}
            onChange={(e) => setPeople(Math.max(config.minPeople, Number(e.target.value) || config.minPeople))}
            className={inputCls}
          />
        </Field>
        <Field label={c.sessions}>
          <input
            type="number"
            min={config.minSessions}
            max={52}
            value={sessions}
            onChange={(e) => setSessions(Math.max(config.minSessions, Number(e.target.value) || config.minSessions))}
            className={inputCls}
          />
        </Field>
        <Field label={c.modality}>
          <div className="flex gap-2">
            {(["presencial", "virtual", "hibrido"] as Modality[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setModality(m)}
                className={`flex-1 px-3 py-2 text-sm border transition-colors ${
                  modality === m
                    ? "bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]"
                    : "bg-transparent border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)]"
                }`}
              >
                {c[m]}
              </button>
            ))}
          </div>
        </Field>
        <Field label={c.currency}>
          <div className="flex gap-2">
            {(["MXN", "USD"] as QuoteCurrency[]).map((cur) => (
              <button
                key={cur}
                type="button"
                onClick={() => setCurrency(cur)}
                className={`px-4 py-2 text-sm border transition-colors ${
                  currency === cur
                    ? "bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]"
                    : "bg-transparent border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)]"
                }`}
              >
                {cur}
              </button>
            ))}
          </div>
        </Field>

        <div className="bg-[var(--color-paper-warm)] border border-[var(--color-line)] p-5">
          <div className="text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-muted)] mb-3">
            {c.estimate}
          </div>
          <Row label={c.subtotal} value={money(breakdown.subtotal, currency, locale)} />
          {breakdown.discountAmount > 0 && (
            <Row
              label={`${c.discount} (${breakdown.discountPct}%)`}
              value={`- ${money(breakdown.discountAmount, currency, locale)}`}
            />
          )}
          <Row label={`${c.iva} (${Math.round(breakdown.ivaRate * 100)}%)`} value={money(breakdown.iva, currency, locale)} />
          <div className="mt-3 pt-3 border-t border-[var(--color-line)] flex items-baseline justify-between">
            <span className="text-sm font-medium">{c.total}</span>
            <span className="font-[family-name:var(--font-display)] text-2xl">
              {money(breakdown.total, currency, locale)}
            </span>
          </div>
          <p className="mt-3 text-[0.7rem] text-[var(--color-muted)] leading-relaxed">
            {c.disclaimer}
          </p>
        </div>
      </div>

      {/* Contact form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <input type="text" name="company_url" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <input name="companyName" required placeholder={c.company} className={inputCls} />
        <input name="contactName" required placeholder={c.contactName} className={inputCls} />
        <input name="contactEmail" type="email" required placeholder={c.email} className={inputCls} />
        <input name="contactPhone" placeholder={c.phone} className={inputCls} />
        <textarea name="notes" rows={4} placeholder={c.notes} className={inputCls} />
        {state === "error" && (
          <div className="text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{errorMsg || c.error}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={state === "sending"}
          className="w-full inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] px-5 py-3 text-sm tracking-wide hover:bg-[var(--color-ink)]/90 disabled:opacity-60 transition-colors"
        >
          {state === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {c.sending}
            </>
          ) : (
            c.submit
          )}
        </button>
      </form>
    </div>
  );
}

const inputCls =
  "w-full border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-2 text-sm focus:outline-none focus:border-[var(--color-ink)]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-muted)] mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-1 text-sm">
      <span className="text-[var(--color-ink-soft)]">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
