"use client";

import { useState } from "react";
import { Check, Loader2, AlertCircle } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { trackLead } from "@/shared/integrations/tracking";

type Source = "apply" | "contact" | "newsletter" | "corporate";

export interface InscriptionFormProps {
  locale: Locale;
  source: Source;
  retreatSlug?: string;
  pathSlug?: string;
  showOrganization?: boolean;
  /**
   * Render the qualification questionnaire: how many participants, individual
   * or group, who is contracting, leadership topics of interest, and the two
   * contacts (decision-maker + participating leader).
   * Added for client feedback #46 — "más información" should lead to a
   * questionnaire, not a mailto. Answers ride along in `details` and land in
   * `inscriptions.metadata`, so no schema migration is needed.
   */
  questionnaire?: boolean;
  submitLabel?: string;
  successHeadlineEs?: string;
  successHeadlineEn?: string;
  className?: string;
}

const COPY = {
  es: {
    name: "Nombre completo",
    email: "Email",
    phone: "Teléfono (opcional)",
    organization: "Organización (opcional)",
    role: "Cargo (opcional)",
    message: "¿Qué te trae aquí? (opcional)",
    submit: "Enviar",
    sending: "Enviando…",
    successHeadline: "Recibimos tu mensaje.",
    successBody:
      "Un miembro del equipo te responderá personalmente en las próximas 48 horas. Mientras tanto, revisa tu bandeja de entrada — te enviamos confirmación.",
    error: "Algo salió mal. Intenta de nuevo o escríbenos a hello@elementsmethod.com.",
    required: "Este campo es obligatorio",
    qGroup: "Sobre el programa que buscas",
    participants: "¿Cuántas personas participarían?",
    format: "¿Individual o grupal?",
    formatOptions: ["Individual", "Grupal"],
    contractor: "¿Quién contrata el programa?",
    contractorOptions: ["Una persona", "Una organización"],
    topics: "Temas de liderazgo que te interesan",
    decisionMaker: "Contacto de quien toma la decisión (nombre y correo)",
    participantLead: "Contacto del líder que participará (nombre y correo)",
    choose: "Selecciona…",
  },
  en: {
    name: "Full name",
    email: "Email",
    phone: "Phone (optional)",
    organization: "Organization (optional)",
    role: "Role (optional)",
    message: "What brings you here? (optional)",
    submit: "Send",
    sending: "Sending…",
    successHeadline: "Message received.",
    successBody:
      "A team member will respond personally within 48 hours. In the meantime, check your inbox — we sent confirmation.",
    error: "Something went wrong. Try again or email hello@elementsmethod.com.",
    required: "This field is required",
    qGroup: "About the program you're looking for",
    participants: "How many people would take part?",
    format: "Individual or group?",
    formatOptions: ["Individual", "Group"],
    contractor: "Who is commissioning the program?",
    contractorOptions: ["An individual", "An organization"],
    topics: "Leadership topics you're interested in",
    decisionMaker: "Decision-maker contact (name and email)",
    participantLead: "Participating leader contact (name and email)",
    choose: "Select…",
  },
} as const;

export function InscriptionForm({
  locale,
  source,
  retreatSlug,
  pathSlug,
  showOrganization,
  questionnaire,
  submitLabel,
  className = "",
}: InscriptionFormProps) {
  const t = COPY[locale];
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      source,
      retreatSlug,
      pathSlug,
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim() || undefined,
      organization: String(fd.get("organization") ?? "").trim() || undefined,
      role: String(fd.get("role") ?? "").trim() || undefined,
      message: String(fd.get("message") ?? "").trim() || undefined,
      locale,
      honeypot: String(fd.get("company_url") ?? ""),
      details: questionnaire
        ? pruneEmpty({
            participants: String(fd.get("participants") ?? "").trim(),
            format: String(fd.get("format") ?? "").trim(),
            contractor: String(fd.get("contractor") ?? "").trim(),
            topics: String(fd.get("topics") ?? "").trim(),
            decisionMaker: String(fd.get("decisionMaker") ?? "").trim(),
            participantLead: String(fd.get("participantLead") ?? "").trim(),
          })
        : undefined,
    };

    try {
      const res = await fetch("/api/inscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setState("success");
      trackLead({ source: source || retreatSlug || pathSlug || "inscription" });
      form.reset();
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown");
    }
  }

  if (state === "success") {
    return (
      <div
        role="status"
        className={`border border-emerald-200 bg-emerald-50 p-6 ${className}`}
      >
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 mt-0.5 text-emerald-700 shrink-0" />
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-xl text-emerald-900 mb-2">
              {t.successHeadline}
            </h3>
            <p className="text-sm text-emerald-800 leading-relaxed">
              {t.successBody}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`space-y-5 ${className}`} noValidate>
      {/* Honeypot — hidden from real users, traps bots */}
      <div className="absolute -left-[9999px] w-0 h-0 overflow-hidden" aria-hidden>
        <label>
          Company URL
          <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field name="name" label={t.name} required />
      <Field name="email" label={t.email} type="email" required />
      <Field name="phone" label={t.phone} type="tel" />
      {showOrganization && (
        <>
          <Field name="organization" label={t.organization} />
          <Field name="role" label={t.role} />
        </>
      )}

      {questionnaire && (
        <fieldset className="pt-4 mt-2 border-t border-[var(--color-line)] space-y-5">
          <legend className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)] pb-2">
            {t.qGroup}
          </legend>
          <Field
            name="participants"
            label={t.participants}
            type="number"
            required
          />
          <SelectField
            name="format"
            label={t.format}
            placeholder={t.choose}
            options={t.formatOptions}
            required
          />
          <SelectField
            name="contractor"
            label={t.contractor}
            placeholder={t.choose}
            options={t.contractorOptions}
            required
          />
          <Field name="topics" label={t.topics} textarea />
          <Field name="decisionMaker" label={t.decisionMaker} />
          <Field name="participantLead" label={t.participantLead} />
        </fieldset>
      )}

      <Field name="message" label={t.message} textarea />

      {state === "error" && (
        <div
          role="alert"
          className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-start gap-3"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <div>{t.error}</div>
            {errorMsg && (
              <div className="mt-1 text-xs font-mono text-red-600">{errorMsg}</div>
            )}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] px-6 py-3 text-sm tracking-wide hover:bg-[var(--color-ink)]/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {state === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t.sending}
          </>
        ) : (
          <>{submitLabel ?? t.submit}</>
        )}
      </button>
    </form>
  );
}

/** Strip empty strings so `details` only carries answers the user actually gave. */
function pruneEmpty(obj: Record<string, string>): Record<string, string> | undefined {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) if (v) out[k] = v;
  return Object.keys(out).length > 0 ? out : undefined;
}

function SelectField({
  name,
  label,
  options,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  options: readonly string[];
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-2">
        {label}
        {required && <span className="ml-1 text-[var(--color-fire-ink)]">*</span>}
      </span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="w-full rounded-none border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-3 text-sm focus:outline-none focus:border-[var(--color-ink)] transition-colors"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  textarea,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const baseClasses =
    "w-full rounded-none border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-3 text-sm focus:outline-none focus:border-[var(--color-ink)] transition-colors placeholder:text-[var(--color-muted)]";
  return (
    <label className="block">
      <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-2">
        {label}
        {required && <span className="ml-1 text-[var(--color-fire-ink)]">*</span>}
      </span>
      {textarea ? (
        <textarea name={name} required={required} rows={4} className={baseClasses} />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          autoComplete={
            type === "email"
              ? "email"
              : type === "tel"
                ? "tel"
                : name === "name"
                  ? "name"
                  : "off"
          }
          className={baseClasses}
        />
      )}
    </label>
  );
}
