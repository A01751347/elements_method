"use client";

import { useState } from "react";
import {
  SeccionEtiqueta,
  Campo,
  Input,
  Textarea,
  Select,
  Checkbox,
  Banner,
  AntesDeConfirmar,
  Boton,
} from "../_components/ui";
import { BotonPendiente } from "../_components/client";

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
  | "rating"
  | "section";

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
  /** Supporting text under the question — or the intro prose of a section. */
  helpEs?: string;
  helpEn?: string;
  /** Captions for the ends of a scale ("1 = …" / "10 = …"). */
  minLabelEs?: string;
  minLabelEn?: string;
  maxLabelEs?: string;
  maxLabelEn?: string;
  /** "prompt" renders a multi-line question in reading type. */
  style?: "label" | "prompt";
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
  section: "── Bloque (sin respuesta)",
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
        required: f.type === "section" ? false : f.required,
        options: CHOICE_TYPES.includes(f.type) ? f.options : undefined,
        scaleMin: SCALE_TYPES.includes(f.type) ? f.scaleMin : undefined,
        scaleMax: SCALE_TYPES.includes(f.type) ? f.scaleMax : undefined,
        shareablePhrase: TEXT_TYPES.includes(f.type) && f.shareablePhrase ? true : undefined,
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
        const hidden = e.currentTarget.elements.namedItem("fieldsJson") as HTMLInputElement;
        hidden.value = payload;
      }}
      className="flex flex-col gap-8"
    >
      <input type="hidden" name="fieldsJson" defaultValue="[]" />

      {/* META */}
      <section className="tarjeta flex flex-col gap-4">
        <SeccionEtiqueta>Datos del formulario</SeccionEtiqueta>
        <div className="grid grid-cols-2 gap-4">
          <Campo label="Título (ES)" htmlFor="fb-titleEs" required>
            <Input id="fb-titleEs" name="titleEs" required defaultValue={initial?.titleEs} />
          </Campo>
          <Campo label="Título (EN)" htmlFor="fb-titleEn">
            <Input id="fb-titleEn" name="titleEn" defaultValue={initial?.titleEn} />
          </Campo>
          <Campo label="Descripción (ES)" htmlFor="fb-descriptionEs">
            <Textarea id="fb-descriptionEs" name="descriptionEs" rows={2} defaultValue={initial?.descriptionEs} />
          </Campo>
          <Campo label="Descripción (EN)" htmlFor="fb-descriptionEn">
            <Textarea id="fb-descriptionEn" name="descriptionEn" rows={2} defaultValue={initial?.descriptionEn} />
          </Campo>
          <Campo label="Categoría" htmlFor="fb-category">
            <Select id="fb-category" name="category" defaultValue={initial?.category ?? "custom"}>
              <option value="inicio">Inicio</option>
              <option value="durante">Durante</option>
              <option value="cierre">Cierre</option>
              <option value="custom">Personalizado</option>
            </Select>
          </Campo>
          <div className="flex items-end pb-1">
            <Checkbox name="isAnonymous" label="Respuestas anónimas" defaultChecked={initial?.isAnonymous} />
          </div>
        </div>
      </section>

      {/* QUESTIONS */}
      <section className="flex flex-col gap-4">
        <SeccionEtiqueta>{`Preguntas (${fields.length})`}</SeccionEtiqueta>

        {fields.map((f, i) => (
          <div key={i} className="tarjeta flex gap-4">
            <span className="paso-numero" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Select
                  value={f.type}
                  onChange={(e) => {
                    const type = e.target.value as BuilderFieldType;
                    patch(i, {
                      type,
                      options: CHOICE_TYPES.includes(type) ? (f.options ?? ["Opción 1", "Opción 2"]) : undefined,
                    });
                  }}
                  className="max-w-[220px]"
                >
                  {Object.entries(TYPE_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </Select>

                {f.type !== "section" && (
                  <label className="campo-checkbox">
                    <input
                      type="checkbox"
                      checked={f.required}
                      onChange={(e) => patch(i, { required: e.target.checked })}
                    />
                    <span>Obligatoria</span>
                  </label>
                )}

                {TEXT_TYPES.includes(f.type) && (
                  <button
                    type="button"
                    className="chip"
                    aria-pressed={!!f.shareablePhrase}
                    title="La respuesta se convierte en un testimonial pendiente de aprobación"
                    onClick={() => patch(i, { shareablePhrase: !f.shareablePhrase })}
                  >
                    Testimonial
                  </button>
                )}

                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    className="boton boton-chico boton-secundario"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Subir pregunta"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="boton boton-chico boton-secundario"
                    onClick={() => move(i, 1)}
                    disabled={i === fields.length - 1}
                    aria-label="Bajar pregunta"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="boton boton-chico boton-secundario"
                    onClick={() => remove(i)}
                    aria-label="Quitar pregunta"
                  >
                    Quitar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Campo label={f.type === "section" ? "Título del bloque (ES)" : "Pregunta (ES)"} required>
                  <Textarea
                    value={f.labelEs}
                    onChange={(e) => patch(i, { labelEs: e.target.value })}
                    rows={f.labelEs.length > 90 ? 4 : 2}
                    placeholder="¿Qué te llevas de la experiencia?"
                  />
                </Campo>
                <Campo label={f.type === "section" ? "Título del bloque (EN)" : "Pregunta (EN)"}>
                  <Textarea
                    value={f.labelEn}
                    onChange={(e) => patch(i, { labelEn: e.target.value })}
                    rows={f.labelEs.length > 90 ? 4 : 2}
                    placeholder="Se usa la versión ES si queda vacío"
                  />
                </Campo>

                <Campo
                  label={f.type === "section" ? "Texto introductorio del bloque (ES)" : "Texto de apoyo bajo la pregunta (ES)"}
                >
                  <Textarea
                    value={f.helpEs ?? ""}
                    onChange={(e) => patch(i, { helpEs: e.target.value || undefined })}
                    rows={2}
                    placeholder="Opcional"
                  />
                </Campo>
                <Campo label="Texto de apoyo (EN)">
                  <Textarea
                    value={f.helpEn ?? ""}
                    onChange={(e) => patch(i, { helpEn: e.target.value || undefined })}
                    rows={2}
                    placeholder="Opcional"
                  />
                </Campo>

                {SCALE_TYPES.concat("nps").includes(f.type) && (
                  <>
                    <Campo label="Texto del extremo mínimo (ES)">
                      <Input
                        value={f.minLabelEs ?? ""}
                        onChange={(e) => patch(i, { minLabelEs: e.target.value || undefined })}
                        placeholder="1 = …"
                      />
                    </Campo>
                    <Campo label="Texto del extremo máximo (ES)">
                      <Input
                        value={f.maxLabelEs ?? ""}
                        onChange={(e) => patch(i, { maxLabelEs: e.target.value || undefined })}
                        placeholder="10 = …"
                      />
                    </Campo>
                  </>
                )}

                {CHOICE_TYPES.includes(f.type) && (
                  <div className="col-span-2">
                    <Campo label="Opciones (una por línea)">
                      <Textarea
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
                      />
                    </Campo>
                  </div>
                )}

                {SCALE_TYPES.includes(f.type) && (
                  <>
                    <Campo label="Mínimo">
                      <Input
                        type="number"
                        value={f.scaleMin ?? 1}
                        onChange={(e) => patch(i, { scaleMin: Number(e.target.value) })}
                      />
                    </Campo>
                    <Campo label="Máximo">
                      <Input
                        type="number"
                        value={f.scaleMax ?? 5}
                        onChange={(e) => patch(i, { scaleMax: Number(e.target.value) })}
                      />
                    </Campo>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="boton boton-secundario" onClick={() => setFields((fs) => [...fs, emptyField()])}>
            + Agregar pregunta
          </button>
          {hasShareable && !hasConsent && (
            <button
              type="button"
              className="boton boton-secundario"
              onClick={() => setFields((fs) => [...fs, { ...CONSENT_FIELD }])}
            >
              + Agregar pregunta de autorización
            </button>
          )}
        </div>

        {hasShareable && !hasConsent && (
          <Banner tone="aviso">
            Tienes una pregunta testimonial sin pregunta de autorización. Sin ella, toda frase se convierte en
            testimonial pendiente; con ella, el participante decide si se publica y si aparece su nombre.
          </Banner>
        )}
      </section>

      {error && <Banner tone="error">{error}</Banner>}

      <AntesDeConfirmar
        boton={
          <div className="flex items-center gap-3">
            <BotonPendiente pendingLabel="Guardando el formulario…">{submitLabel}</BotonPendiente>
            <Boton tone="secundario" href="/admin/formularios">
              Cancelar
            </Boton>
          </div>
        }
      >
        Se guarda el formulario. Los enlaces que envíes después usarán estas preguntas; las respuestas ya
        guardadas no cambian.
      </AntesDeConfirmar>
    </form>
  );
}
