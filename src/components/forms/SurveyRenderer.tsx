"use client";

import { useState } from "react";
import { Check, AlertCircle, Loader2 } from "lucide-react";

export type FormFieldType =
  | "short_text"
  | "long_text"
  | "single_choice"
  | "multi_choice"
  | "scale"
  | "nps"
  | "date"
  | "email"
  | "number"
  | "rating"
  /** Block divider — a heading + intro, no input. Carries no answer. */
  | "section";

export interface FormField {
  key: string;
  type: FormFieldType;
  labelEs: string;
  labelEn: string;
  required: boolean;
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  shareablePhrase?: boolean;
  /**
   * Supporting text under the question — the "↳" hints in the Master Plan
   * questionnaires, or the intro prose of a `section`.
   */
  helpEs?: string;
  helpEn?: string;
  /** Anchor captions for the ends of a scale ("1 = …" / "10 = …"). */
  minLabelEs?: string;
  minLabelEn?: string;
  maxLabelEs?: string;
  maxLabelEn?: string;
  /**
   * "label" (default) renders the small uppercase caption used by short admin
   * fields. "prompt" renders a full multi-line question in reading type —
   * required for the retreat questionnaires, whose questions run 3–6 lines.
   */
  style?: "label" | "prompt";
}

export interface SurveyDefinition {
  id: string;
  slug: string;
  titleEs: string;
  titleEn: string;
  descriptionEs?: string | null;
  descriptionEn?: string | null;
  fields: FormField[];
}

export function SurveyRenderer({
  form,
  token,
  locale,
}: {
  form: SurveyDefinition;
  token: string;
  locale: "es" | "en";
}) {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const labelKey = locale === "es" ? "labelEs" : "labelEn";
  const titleKey = locale === "es" ? "titleEs" : "titleEn";
  const descKey = locale === "es" ? "descriptionEs" : "descriptionEn";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");
    const fd = new FormData(e.currentTarget);
    const answers: Record<string, unknown> = {};
    let shareablePhrase: string | undefined;

    for (const field of form.fields) {
      const raw = fd.getAll(field.key);
      if (field.type === "multi_choice") {
        answers[field.key] = raw.map(String);
      } else {
        answers[field.key] = String(raw[0] ?? "");
      }
      if (field.shareablePhrase && answers[field.key]) {
        shareablePhrase = String(answers[field.key]);
      }
    }

    try {
      const res = await fetch("/api/forms/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          formSlug: form.slug,
          answers,
          shareablePhrase,
          locale,
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
      <div className="border border-emerald-200 bg-emerald-50 p-6" role="status">
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 mt-0.5 text-emerald-700 shrink-0" />
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-xl text-emerald-900 mb-2">
              {locale === "es" ? "Recibido. Gracias." : "Received. Thank you."}
            </h3>
            <p className="text-sm text-emerald-800 leading-relaxed">
              {locale === "es"
                ? "Tu respuesta quedó registrada. La leemos cuidadosamente antes del siguiente paso del proceso."
                : "Your response is recorded. We'll read it carefully before the next step."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7" noValidate>
      <header>
        <h1 className="display-2 mb-3">{form[titleKey]}</h1>
        {form[descKey] && (
          <p className="text-[var(--color-ink-soft)] leading-relaxed max-w-2xl text-pretty">
            {form[descKey]}
          </p>
        )}
      </header>

      <div className="space-y-7">
        {form.fields.map((field) => (
          <SurveyField key={field.key} field={field} label={field[labelKey]} locale={locale} />
        ))}
      </div>

      {state === "error" && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="pt-4 border-t border-[var(--color-line)] flex items-center gap-4">
        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex items-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] px-6 py-3 text-sm tracking-wide hover:bg-[var(--color-ink)]/90 disabled:opacity-60 transition-colors"
        >
          {state === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {locale === "es" ? "Enviando…" : "Submitting…"}
            </>
          ) : locale === "es" ? (
            "Enviar respuestas"
          ) : (
            "Submit responses"
          )}
        </button>
        <span className="text-xs text-[var(--color-muted)]">
          {locale === "es" ? "Una sola vez por enlace." : "One use per link."}
        </span>
      </div>
    </form>
  );
}

function SurveyField({
  field,
  label,
  locale,
}: {
  field: FormField;
  label: string;
  locale: "es" | "en";
}) {
  const inputBase =
    "w-full border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-3 text-sm focus:outline-none focus:border-[var(--color-ink)] transition-colors";

  // Block divider — heading + intro prose, no input and no answer.
  if (field.type === "section") {
    const intro = locale === "es" ? field.helpEs : field.helpEn;
    return (
      <div className="pt-8 first:pt-0 border-t border-[var(--color-line)] first:border-t-0">
        <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-tight text-balance">
          {label}
        </h3>
        {intro && (
          <p className="mt-3 text-[var(--color-ink-soft)] leading-relaxed text-pretty max-w-2xl whitespace-pre-line">
            {intro}
          </p>
        )}
      </div>
    );
  }

  if (
    field.type === "short_text" ||
    field.type === "email" ||
    field.type === "date" ||
    field.type === "number"
  ) {
    return (
      <Wrapper field={field} label={label} locale={locale}>
        <input
          type={
            field.type === "email"
              ? "email"
              : field.type === "date"
                ? "date"
                : field.type === "number"
                  ? "number"
                  : "text"
          }
          name={field.key}
          required={field.required}
          className={inputBase}
        />
      </Wrapper>
    );
  }

  if (field.type === "long_text") {
    return (
      <Wrapper field={field} label={label} locale={locale}>
        <textarea name={field.key} required={field.required} rows={5} className={inputBase} />
      </Wrapper>
    );
  }

  if (field.type === "single_choice") {
    return (
      <Wrapper field={field} label={label} locale={locale}>
        <div className="space-y-2 mt-2">
          {(field.options ?? []).map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-3 cursor-pointer text-sm text-[var(--color-ink)] hover:text-[var(--color-ink)]"
            >
              <input
                type="radio"
                name={field.key}
                value={opt}
                required={field.required}
                className="accent-[var(--color-gold-deep)]"
              />
              {opt}
            </label>
          ))}
        </div>
      </Wrapper>
    );
  }

  if (field.type === "multi_choice") {
    return (
      <Wrapper field={field} label={label} locale={locale}>
        <div className="space-y-2 mt-2">
          {(field.options ?? []).map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-3 cursor-pointer text-sm text-[var(--color-ink)]"
            >
              <input
                type="checkbox"
                name={field.key}
                value={opt}
                className="accent-[var(--color-gold-deep)]"
              />
              {opt}
            </label>
          ))}
        </div>
      </Wrapper>
    );
  }

  if (field.type === "scale" || field.type === "nps" || field.type === "rating") {
    const min = field.scaleMin ?? (field.type === "nps" ? 0 : 1);
    const max = field.scaleMax ?? (field.type === "nps" ? 10 : 5);
    const values: number[] = [];
    for (let i = min; i <= max; i++) values.push(i);
    return (
      <Wrapper field={field} label={label} locale={locale}>
        <div className="flex flex-wrap gap-2 mt-3">
          {values.map((v) => (
            <label key={v} className="cursor-pointer">
              <input
                type="radio"
                name={field.key}
                value={v}
                required={field.required}
                className="peer sr-only"
              />
              <span className="inline-flex items-center justify-center h-10 min-w-10 px-3 border border-[var(--color-line)] text-sm tabular-nums hover:border-[var(--color-ink)] peer-checked:bg-[var(--color-ink)] peer-checked:text-[var(--color-paper)] peer-checked:border-[var(--color-ink)] transition-colors">
                {v}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-3 flex justify-between gap-6 text-[0.72rem] leading-snug text-[var(--color-muted)]">
          <span className="max-w-[46%]">
            {(locale === "es" ? field.minLabelEs : field.minLabelEn) ??
              `${locale === "es" ? "Mínimo" : "Min"} · ${min}`}
          </span>
          <span className="max-w-[46%] text-right">
            {(locale === "es" ? field.maxLabelEs : field.maxLabelEn) ??
              `${locale === "es" ? "Máximo" : "Max"} · ${max}`}
          </span>
        </div>
      </Wrapper>
    );
  }

  return null;
}

function Wrapper({
  field,
  label,
  locale,
  children,
}: {
  field: FormField;
  label: string;
  locale: "es" | "en";
  children: React.ReactNode;
}) {
  // Questions from the retreat instruments run several lines; rendering them
  // in the small uppercase caption style makes them unreadable.
  const prompt = field.style === "prompt";
  const help = locale === "es" ? field.helpEs : field.helpEn;
  return (
    <div>
      <label
        htmlFor={field.key}
        className={
          prompt
            ? "block text-[1.02rem] leading-relaxed text-[var(--color-ink)] mb-3 whitespace-pre-line text-pretty"
            : "block text-[0.7rem] uppercase tracking-[0.22em] text-[var(--color-muted)] mb-2"
        }
      >
        {label}
        {field.required && <span className="ml-1 text-[var(--color-fire-ink)]">*</span>}
        {field.shareablePhrase && (
          <span
            className="ml-2 inline-block bg-[var(--color-gold-soft)] text-[var(--color-ink)] px-1.5 py-0.5 text-[0.6rem] normal-case tracking-normal"
            title="Esta respuesta puede usarse como testimonio (con tu permiso)"
          >
            shareable
          </span>
        )}
      </label>
      {help && (
        <p className="-mt-1 mb-3 text-sm italic text-[var(--color-muted)] text-pretty">
          ↳ {help}
        </p>
      )}
      {children}
    </div>
  );
}
