"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Sparkles, Trash2 } from "lucide-react";
import {
  AdminPrimaryButton,
  AdminSecondaryButton,
} from "../_components/admin-ui";

export type BuilderFieldType =
  | "short_text"
  | "long_text"
  | "single_choice"
  | "multi_choice"
  | "scale"
  | "nps"
  | "date"
  | "email"
  | "number"
  | "rating";

export interface BuilderField {
  key: string;
  type: BuilderFieldType;
  labelEs: string;
  labelEn: string;
  required: boolean;
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  shareablePhrase?: boolean;
}

export interface BuilderInitial {
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  category: string;
  isAnonymous: boolean;
  fields: BuilderField[];
}

const TYPE_LABELS: Record<BuilderFieldType, string> = {
  short_text: "Texto corto",
  long_text: "Texto largo",
  single_choice: "Opción única",
  multi_choice: "Opción múltiple",
  scale: "Escala",
  nps: "NPS (0–10)",
  date: "Fecha",
  email: "Email",
  number: "Número",
  rating: "Rating (1–5)",
};

const CHOICE_TYPES: BuilderFieldType[] = ["single_choice", "multi_choice"];
const SCALE_TYPES: BuilderFieldType[] = ["scale", "rating"];
const TEXT_TYPES: BuilderFieldType[] = ["short_text", "long_text"];

function keyFromLabel(label: string): string {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
}

function emptyField(): BuilderField {
  return {
    key: "",
    type: "long_text",
    labelEs: "",
    labelEn: "",
    required: false,
  };
}

const CONSENT_FIELD: BuilderField = {
  key: "allow_publication",
  type: "single_choice",
  labelEs: "¿Autorizas publicar tu frase con tu nombre?",
  labelEn: "Do you authorize publishing your phrase with your name?",
  required: true,
  options: ["Sí, con mi nombre y cargo", "Sí, anónimo", "No"],
};

/**
 * Dynamic question builder for admin forms. Questions live in React state and
 * are serialized to the hidden `fieldsJson` input at submit; the server action
 * (`createForm` / `updateForm`) validates the payload with zod.
 */
export function FormBuilder({
  action,
  initial,
  submitLabel,
}: {
  action: (fd: FormData) => Promise<void>;
  initial?: BuilderInitial;
  submitLabel: string;
}) {
  const [fields, setFields] = useState<BuilderField[]>(
    initial?.fields?.length ? initial.fields : [emptyField()],
  );
  const [error, setError] = useState("");

  function patch(i: number, p: Partial<BuilderField>) {
    setFields((fs) => fs.map((f, j) => (j === i ? { ...f, ...p } : f)));
  }

  function move(i: number, delta: number) {
    setFields((fs) => {
      const j = i + delta;
      if (j < 0 || j >= fs.length) return fs;
      const next = [...fs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function remove(i: number) {
    setFields((fs) => fs.filter((_, j) => j !== i));
  }

  /** Finalize keys (auto-generate from label ES, dedupe) and serialize. */
  function buildPayload(): string | null {
    const seen = new Set<string>();
    const out: BuilderField[] = [];
    for (const f of fields) {
      if (!f.labelEs.trim()) {
        setError("Cada pregunta necesita su texto en español.");
        return null;
      }
      if (CHOICE_TYPES.includes(f.type) && !(f.options ?? []).length) {
        setError(`"${f.labelEs}" es de opciones y no tiene opciones.`);
        return null;
      }
      let key = f.key || keyFromLabel(f.labelEs) || "pregunta";
      let n = 2;
      while (seen.has(key)) key = `${f.key || keyFromLabel(f.labelEs)}_${n++}`;
      seen.add(key);
      out.push({
        ...f,
        key,
        labelEs: f.labelEs.trim(),
        labelEn: f.labelEn.trim(),
        options: CHOICE_TYPES.includes(f.type) ? f.options : undefined,
        scaleMin: SCALE_TYPES.includes(f.type) ? f.scaleMin : undefined,
        scaleMax: SCALE_TYPES.includes(f.type) ? f.scaleMax : undefined,
        shareablePhrase:
          TEXT_TYPES.includes(f.type) && f.shareablePhrase ? true : undefined,
      });
    }
    if (out.length === 0) {
      setError("Agrega al menos una pregunta.");
      return null;
    }
    setError("");
    return JSON.stringify(out);
  }

  const hasConsent = fields.some((f) => f.key === "allow_publication");
  const hasShareable = fields.some((f) => f.shareablePhrase);

  return (
    <form
      action={action}
      onSubmit={(e) => {
        const payload = buildPayload();
        if (!payload) {
          e.preventDefault();
          return;
        }
        const hidden = e.currentTarget.elements.namedItem(
          "fieldsJson",
        ) as HTMLInputElement;
        hidden.value = payload;
      }}
      className="space-y-6 max-w-4xl"
    >
      <input type="hidden" name="fieldsJson" defaultValue="[]" />

      {/* META */}
      <section className="rounded-lg border border-zinc-200 bg-white p-5 space-y-4">
        <h2 className="text-sm font-medium">Datos del formulario</h2>
        <div className="grid grid-cols-2 gap-4">
          <Labeled label="Título (ES) *">
            <input
              name="titleEs"
              required
              defaultValue={initial?.titleEs}
              className={inputCls}
            />
          </Labeled>
          <Labeled label="Título (EN)">
            <input name="titleEn" defaultValue={initial?.titleEn} className={inputCls} />
          </Labeled>
          <Labeled label="Descripción (ES)">
            <textarea
              name="descriptionEs"
              rows={2}
              defaultValue={initial?.descriptionEs}
              className={inputCls}
            />
          </Labeled>
          <Labeled label="Descripción (EN)">
            <textarea
              name="descriptionEn"
              rows={2}
              defaultValue={initial?.descriptionEn}
              className={inputCls}
            />
          </Labeled>
          <Labeled label="Categoría">
            <select
              name="category"
              defaultValue={initial?.category ?? "custom"}
              className={inputCls}
            >
              <option value="inicio">Inicio</option>
              <option value="durante">Durante</option>
              <option value="cierre">Cierre</option>
              <option value="custom">Custom</option>
            </select>
          </Labeled>
          <label className="flex items-center gap-2 text-sm text-zinc-700 self-end pb-2">
            <input
              type="checkbox"
              name="isAnonymous"
              defaultChecked={initial?.isAnonymous}
              className="h-4 w-4 rounded border-zinc-300"
            />
            Respuestas anónimas
          </label>
        </div>
      </section>

      {/* QUESTIONS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Preguntas ({fields.length})</h2>
        </div>

        {fields.map((f, i) => (
          <div key={i} className="rounded-lg border border-zinc-200 bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-zinc-400 tabular-nums text-sm w-6">
                {String(i + 1).padStart(2, "0")}
              </span>
              <select
                value={f.type}
                onChange={(e) => {
                  const type = e.target.value as BuilderFieldType;
                  patch(i, {
                    type,
                    options: CHOICE_TYPES.includes(type)
                      ? (f.options ?? ["Opción 1", "Opción 2"])
                      : undefined,
                  });
                }}
                className="border border-zinc-300 rounded px-2 py-1.5 text-xs bg-white"
              >
                {Object.entries(TYPE_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-1.5 text-xs text-zinc-600">
                <input
                  type="checkbox"
                  checked={f.required}
                  onChange={(e) => patch(i, { required: e.target.checked })}
                  className="h-3.5 w-3.5 rounded border-zinc-300"
                />
                Obligatoria
              </label>
              {TEXT_TYPES.includes(f.type) && (
                <label
                  className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-1"
                  title="La respuesta se convierte en un testimonial pendiente de aprobación"
                >
                  <input
                    type="checkbox"
                    checked={!!f.shareablePhrase}
                    onChange={(e) => patch(i, { shareablePhrase: e.target.checked })}
                    className="h-3.5 w-3.5 rounded border-amber-300"
                  />
                  <Sparkles className="h-3 w-3" />
                  Testimonial
                </label>
              )}
              <div className="ml-auto flex items-center gap-1">
                <IconBtn onClick={() => move(i, -1)} disabled={i === 0} label="Subir">
                  <ArrowUp className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn
                  onClick={() => move(i, 1)}
                  disabled={i === fields.length - 1}
                  label="Bajar"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn onClick={() => remove(i)} label="Eliminar" danger>
                  <Trash2 className="h-3.5 w-3.5" />
                </IconBtn>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Labeled label="Pregunta (ES) *">
                <input
                  value={f.labelEs}
                  onChange={(e) => patch(i, { labelEs: e.target.value })}
                  className={inputCls}
                  placeholder="¿Qué te llevas de la experiencia?"
                />
              </Labeled>
              <Labeled label="Pregunta (EN)">
                <input
                  value={f.labelEn}
                  onChange={(e) => patch(i, { labelEn: e.target.value })}
                  className={inputCls}
                  placeholder="Se usa la versión ES si queda vacío"
                />
              </Labeled>

              {CHOICE_TYPES.includes(f.type) && (
                <Labeled label="Opciones (una por línea)" wide>
                  <textarea
                    value={(f.options ?? []).join("\n")}
                    onChange={(e) =>
                      patch(i, {
                        options: e.target.value
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    rows={3}
                    className={inputCls}
                  />
                </Labeled>
              )}

              {SCALE_TYPES.includes(f.type) && (
                <>
                  <Labeled label="Mínimo">
                    <input
                      type="number"
                      value={f.scaleMin ?? 1}
                      onChange={(e) => patch(i, { scaleMin: Number(e.target.value) })}
                      className={inputCls}
                    />
                  </Labeled>
                  <Labeled label="Máximo">
                    <input
                      type="number"
                      value={f.scaleMax ?? 5}
                      onChange={(e) => patch(i, { scaleMax: Number(e.target.value) })}
                      className={inputCls}
                    />
                  </Labeled>
                </>
              )}
            </div>
          </div>
        ))}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFields((fs) => [...fs, emptyField()])}
            className="inline-flex items-center gap-1.5 border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-50 transition-colors rounded"
          >
            <Plus className="h-3.5 w-3.5" /> Agregar pregunta
          </button>
          {hasShareable && !hasConsent && (
            <button
              type="button"
              onClick={() => setFields((fs) => [...fs, { ...CONSENT_FIELD }])}
              className="inline-flex items-center gap-1.5 border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 hover:bg-amber-100 transition-colors rounded"
            >
              <Plus className="h-3.5 w-3.5" /> Agregar pregunta de autorización
            </button>
          )}
        </div>

        {hasShareable && !hasConsent && (
          <p className="text-xs text-amber-800 bg-amber-50 border-l-2 border-amber-400 px-3 py-2">
            Tienes una pregunta testimonial sin pregunta de autorización. Sin ella,
            toda frase se convierte en testimonial pendiente; con ella, el
            participante decide si se publica y si aparece su nombre.
          </p>
        )}
      </section>

      {error && (
        <p className="text-sm text-red-800 bg-red-50 border border-red-200 px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-zinc-200">
        <AdminPrimaryButton type="submit">{submitLabel}</AdminPrimaryButton>
        <AdminSecondaryButton href="/admin/formularios">Cancelar</AdminSecondaryButton>
      </div>
    </form>
  );
}

const inputCls =
  "w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-zinc-500";

function Labeled({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "col-span-2" : undefined}>
      <label className="block text-[0.65rem] uppercase tracking-[0.14em] text-zinc-500 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function IconBtn({
  onClick,
  disabled,
  label,
  danger,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`h-7 w-7 inline-flex items-center justify-center rounded border transition-colors disabled:opacity-30 ${
        danger
          ? "border-red-200 text-red-700 hover:bg-red-50"
          : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
      }`}
    >
      {children}
    </button>
  );
}
