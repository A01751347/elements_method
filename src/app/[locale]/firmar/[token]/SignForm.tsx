"use client";

import { useState } from "react";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import type { Locale } from "@/i18n/config";

export function SignForm({
  locale,
  token,
  email,
}: {
  locale: Locale;
  token: string;
  email: string;
}) {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          acceptedTerms: fd.get("acceptedTerms") === "on",
          signature: String(fd.get("signature") ?? "").trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setState("success");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown");
    }
  }

  if (state === "success") {
    return (
      <div className="border border-emerald-200 bg-emerald-50 p-5" role="status">
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 mt-0.5 text-emerald-700 shrink-0" />
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-lg text-emerald-900 mb-1">
              {locale === "es" ? "Firmado." : "Signed."}
            </h3>
            <p className="text-sm text-emerald-800 leading-relaxed">
              {locale === "es"
                ? `Aceptación registrada con ${email}. Te enviamos copia por email.`
                : `Acceptance recorded with ${email}. We've emailed you a copy.`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block">
        <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-2">
          {locale === "es" ? "Escribe tu nombre como firma" : "Type your name as signature"}
          <span className="ml-1 text-[var(--color-fire-ink)]">*</span>
        </span>
        <input
          type="text"
          name="signature"
          required
          minLength={2}
          autoComplete="off"
          className="w-full border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-3 font-[family-name:var(--font-display)] text-xl italic focus:outline-none focus:border-[var(--color-ink)]"
        />
      </label>

      <label className="flex items-start gap-3 text-sm text-[var(--color-ink-soft)] cursor-pointer">
        <input
          type="checkbox"
          name="acceptedTerms"
          required
          className="mt-0.5 h-4 w-4 accent-[var(--color-gold-deep)]"
        />
        <span className="leading-relaxed">
          {locale === "es"
            ? "Leí y acepto los términos del documento. Mi aceptación tiene validez legal."
            : "I read and accept the terms. My acceptance has legal validity."}
        </span>
      </label>

      {state === "error" && (
        <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 flex items-start gap-2">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-3 text-sm tracking-wide hover:bg-[var(--color-ink)]/90 disabled:opacity-60 transition-colors"
      >
        {state === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {locale === "es" ? "Firmando…" : "Signing…"}
          </>
        ) : locale === "es" ? (
          "Firmar y aceptar"
        ) : (
          "Sign and accept"
        )}
      </button>
    </form>
  );
}
