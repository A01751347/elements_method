"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2, AlertCircle } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import {
  ARCO_RIGHTS,
  ARCO_RIGHT_INFO,
  ARCO_RELATIONS,
  ARCO_RELATION_LABEL,
  ARCO_RESPONSE_BUSINESS_DAYS,
  ARCO_IDENTITY_BUSINESS_DAYS,
  t,
  type ArcoRight,
} from "@/data/arco";

/**
 * Solicitud de derechos ARCO en tres pasos: el derecho (los cinco botones),
 * los datos del titular y la descripción. POST /api/arco devuelve el folio y
 * la fecha límite legal de respuesta, que se muestran en la confirmación.
 */

const COPY = {
  es: {
    step1: "1 · ¿Qué derecho quieres ejercer?",
    step2: "2 · Tus datos",
    step3: "3 · Tu solicitud",
    chooseRight: "Elige un derecho para continuar.",
    fullName: "Nombre completo",
    email: "Correo electrónico",
    emailHint: "Ahí te enviaremos el acuse con tu folio y la respuesta.",
    phone: "Teléfono (opcional)",
    relation: "¿Qué relación tienes con Elements Method?",
    choose: "Selecciona…",
    representative: "Presento esta solicitud en representación del titular de los datos",
    titularName: "Nombre completo del titular",
    description: "Describe tu solicitud",
    descriptionHint:
      "Indica qué datos, qué quieres que hagamos con ellos y cualquier detalle que nos ayude a localizarlos (programa, fechas, empresa).",
    privacy1: "He leído el ",
    privacyLink: "Aviso de Privacidad",
    privacy2: " y acepto que mis datos se usen para atender esta solicitud.",
    submit: "Enviar solicitud",
    sending: "Enviando…",
    error: "Algo salió mal. Intenta de nuevo o escríbenos por correo.",
    successTitle: "Recibimos tu solicitud.",
    folio: "Tu folio",
    due: "Responderemos a más tardar el",
    dueNote: `(${ARCO_RESPONSE_BUSINESS_DAYS} días hábiles, conforme a la ley)`,
    next: "Qué sigue",
    next1: "Revisa tu correo: te enviamos el acuse con este folio.",
    next2: `Responde a ese correo con una copia de tu identificación oficial. La ley nos obliga a acreditar tu identidad antes de atender la solicitud; tienes ${ARCO_IDENTITY_BUSINESS_DAYS} días hábiles para enviarla.`,
    next3: "Guarda tu folio: es la referencia para cualquier seguimiento.",
    another: "Enviar otra solicitud",
  },
  en: {
    step1: "1 · Which right do you want to exercise?",
    step2: "2 · Your details",
    step3: "3 · Your request",
    chooseRight: "Choose a right to continue.",
    fullName: "Full name",
    email: "Email",
    emailHint: "We'll send the acknowledgement with your reference number and our response there.",
    phone: "Phone (optional)",
    relation: "How are you related to Elements Method?",
    choose: "Select…",
    representative: "I'm submitting this request on behalf of the data subject",
    titularName: "Data subject's full name",
    description: "Describe your request",
    descriptionHint:
      "Tell us which data, what you want us to do with it, and anything that helps us locate it (program, dates, company).",
    privacy1: "I have read the ",
    privacyLink: "Privacy Notice",
    privacy2: " and agree to the use of my data to handle this request.",
    submit: "Submit request",
    sending: "Sending…",
    error: "Something went wrong. Try again or email us.",
    successTitle: "We received your request.",
    folio: "Your reference",
    due: "We will respond by",
    dueNote: `(${ARCO_RESPONSE_BUSINESS_DAYS} business days, as required by law)`,
    next: "What happens next",
    next1: "Check your inbox: we sent an acknowledgement with this reference.",
    next2: `Reply to that email with a copy of an official ID. The law requires us to verify your identity before acting on the request; you have ${ARCO_IDENTITY_BUSINESS_DAYS} business days to send it.`,
    next3: "Keep your reference number: it's the key for any follow-up.",
    another: "Submit another request",
  },
} as const;

const inputClasses =
  "w-full rounded-none border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-3 text-sm focus:outline-none focus:border-[var(--color-ink)] transition-colors placeholder:text-[var(--color-muted)]";

const labelClasses =
  "block text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-2";

function fechaLarga(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(locale === "en" ? "en-US" : "es-MX", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ArcoRequestForm({
  locale,
  initialRight,
  privacyHref,
}: {
  locale: Locale;
  initialRight?: ArcoRight;
  privacyHref: string;
}) {
  const c = COPY[locale];
  const [right, setRight] = useState<ArcoRight | null>(initialRight ?? null);
  const [rightMissing, setRightMissing] = useState(false);
  const [representative, setRepresentative] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<{ folio: string; responseDueAt: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!right) {
      setRightMissing(true);
      document.getElementById("arco-derechos")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setState("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const str = (k: string) => String(fd.get(k) ?? "").trim();
    const payload = {
      right,
      fullName: str("fullName"),
      email: str("email"),
      phone: str("phone") || undefined,
      relation: str("relation") || undefined,
      isRepresentative: representative,
      titularName: representative ? str("titularName") || undefined : undefined,
      description: str("description"),
      privacyAccepted: fd.get("privacy") === "on",
      locale,
      honeypot: str("company_url"),
    };

    try {
      const res = await fetch("/api/arco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setResult({ folio: data.folio, responseDueAt: data.responseDueAt });
      setState("success");
      form.reset();
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown");
    }
  }

  if (state === "success" && result) {
    return (
      <div role="status" className="border border-[var(--color-ink)] p-8 md:p-10">
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 mt-1 shrink-0" />
          <div className="min-w-0">
            <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-tight mb-6">
              {c.successTitle}
            </h2>
            <dl className="grid sm:grid-cols-2 gap-6 mb-8">
              <div>
                <dt className={labelClasses}>{c.folio}</dt>
                <dd className="font-mono text-lg tracking-wide">{result.folio}</dd>
              </div>
              <div>
                <dt className={labelClasses}>{c.due}</dt>
                <dd className="text-base">
                  {fechaLarga(result.responseDueAt, locale)}
                  <span className="block text-xs text-[var(--color-muted)] mt-1">{c.dueNote}</span>
                </dd>
              </div>
            </dl>
            <h3 className={labelClasses}>{c.next}</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">
              <li>{c.next1}</li>
              <li>{c.next2}</li>
              <li>{c.next3}</li>
            </ol>
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setRight(null);
                setRepresentative(false);
                setState("idle");
              }}
              className="mt-8 text-[0.7rem] uppercase tracking-[0.16em] underline underline-offset-[6px] hover:text-[var(--color-gold-deep)]"
            >
              {c.another}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-12">
      {/* Honeypot — invisible para personas, atrapa bots */}
      <div className="absolute -left-[9999px] w-0 h-0 overflow-hidden" aria-hidden>
        <label>
          Company URL
          <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Paso 1: los botones ARCO */}
      <fieldset id="arco-derechos" className="scroll-mt-32">
        <legend className={cn(labelClasses, "mb-4")}>{c.step1}</legend>
        <div role="radiogroup" aria-label={c.step1} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ARCO_RIGHTS.map((key) => {
            const info = ARCO_RIGHT_INFO[key];
            const active = right === key;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => {
                  setRight(key);
                  setRightMissing(false);
                }}
                className={cn(
                  "group text-left p-5 border flex flex-col gap-2 min-h-[11rem] transition-colors duration-300",
                  active
                    ? "bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]"
                    : "border-[var(--color-line)] hover:border-[var(--color-ink)]",
                )}
              >
                <span
                  className={cn(
                    "font-[family-name:var(--font-display)] text-4xl leading-none",
                    active ? "text-[var(--color-gold)]" : "text-[var(--color-ink)]",
                  )}
                  aria-hidden
                >
                  {info.letter}
                </span>
                <span className="text-[0.7rem] uppercase tracking-[0.18em] mt-1">
                  {t(info.label, locale)}
                </span>
                <span
                  className={cn(
                    "text-sm leading-relaxed",
                    active ? "text-[var(--color-paper)]/80" : "text-[var(--color-ink-soft)]",
                  )}
                >
                  {t(info.description, locale)}
                </span>
              </button>
            );
          })}
        </div>
        {rightMissing && (
          <p role="alert" className="mt-3 text-sm text-[var(--color-fire-ink)] flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> {c.chooseRight}
          </p>
        )}
      </fieldset>

      {/* Paso 2: datos del titular */}
      <fieldset className="space-y-5">
        <legend className={cn(labelClasses, "mb-4")}>{c.step2}</legend>
        <label className="block">
          <span className={labelClasses}>
            {c.fullName} <span className="ml-1 text-[var(--color-fire-ink)]">*</span>
          </span>
          <input type="text" name="fullName" required autoComplete="name" className={inputClasses} />
        </label>
        <label className="block">
          <span className={labelClasses}>
            {c.email} <span className="ml-1 text-[var(--color-fire-ink)]">*</span>
          </span>
          <input type="email" name="email" required autoComplete="email" className={inputClasses} />
          <span className="block mt-2 text-xs text-[var(--color-muted)]">{c.emailHint}</span>
        </label>
        <label className="block">
          <span className={labelClasses}>{c.phone}</span>
          <input type="tel" name="phone" autoComplete="tel" className={inputClasses} />
        </label>
        <label className="block">
          <span className={labelClasses}>{c.relation}</span>
          <select name="relation" defaultValue="" className={inputClasses}>
            <option value="">{c.choose}</option>
            {ARCO_RELATIONS.map((r) => (
              <option key={r} value={r}>
                {t(ARCO_RELATION_LABEL[r], locale)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-start gap-3 text-sm leading-relaxed cursor-pointer">
          <input
            type="checkbox"
            name="representative"
            checked={representative}
            onChange={(e) => setRepresentative(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--color-ink)]"
          />
          <span>{c.representative}</span>
        </label>
        {representative && (
          <label className="block">
            <span className={labelClasses}>
              {c.titularName} <span className="ml-1 text-[var(--color-fire-ink)]">*</span>
            </span>
            <input type="text" name="titularName" required className={inputClasses} />
          </label>
        )}
      </fieldset>

      {/* Paso 3: la solicitud */}
      <fieldset className="space-y-5">
        <legend className={cn(labelClasses, "mb-4")}>{c.step3}</legend>
        <label className="block">
          <span className={labelClasses}>
            {c.description} <span className="ml-1 text-[var(--color-fire-ink)]">*</span>
          </span>
          <textarea
            name="description"
            required
            minLength={10}
            rows={6}
            placeholder={right ? t(ARCO_RIGHT_INFO[right].example, locale) : undefined}
            className={inputClasses}
          />
          <span className="block mt-2 text-xs text-[var(--color-muted)]">{c.descriptionHint}</span>
        </label>
        <label className="flex items-start gap-3 text-sm leading-relaxed cursor-pointer">
          <input type="checkbox" name="privacy" required className="mt-1 h-4 w-4 accent-[var(--color-ink)]" />
          <span>
            {c.privacy1}
            <Link href={privacyHref} className="underline underline-offset-4" target="_blank">
              {c.privacyLink}
            </Link>
            {c.privacy2}
          </span>
        </label>
      </fieldset>

      {state === "error" && (
        <div
          role="alert"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-start gap-3"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <div>{c.error}</div>
            {errorMsg && <div className="mt-1 text-xs font-mono text-red-600">{errorMsg}</div>}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] px-7 h-12 text-[0.7rem] uppercase tracking-[0.16em] hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
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
  );
}
