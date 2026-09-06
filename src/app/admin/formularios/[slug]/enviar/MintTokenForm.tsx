"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Campo, Input, Select, Textarea, Banner } from "../../../_components/ui";
import { fechaHora } from "../../../_lib/format";

type Modo = "individual" | "masivo";

interface Destinatario {
  email: string;
  name?: string;
}

interface ResultadoEnvio {
  email: string;
  name?: string;
  ok: boolean;
  error?: string;
  url?: string;
  expiresAt?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MASIVO = 200;

/** Parse one line of the bulk textarea: a bare email, or "Nombre <correo@dominio>". */
function parseLine(line: string): Destinatario | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const m = trimmed.match(/^(.*)<([^>]+)>$/);
  if (m) {
    const name = m[1].trim().replace(/,$/, "");
    const email = m[2].trim();
    return EMAIL_RE.test(email) ? { email, name: name || undefined } : null;
  }
  return EMAIL_RE.test(trimmed) ? { email: trimmed } : null;
}

function parseBulk(text: string): { validos: Destinatario[]; invalidas: number } {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const validos: Destinatario[] = [];
  let invalidas = 0;
  for (const line of lines) {
    const d = parseLine(line);
    if (d) validos.push(d);
    else invalidas++;
  }
  return { validos, invalidas };
}

async function mintOne(params: {
  formSlug: string;
  email: string;
  name?: string;
  locale: "es" | "en";
  expiresInDays: number;
  sendEmail: boolean;
}): Promise<{ ok: boolean; url?: string; expiresAt?: string; error?: string }> {
  try {
    const res = await fetch("/api/forms/mint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formSlug: params.formSlug,
        recipientEmail: params.email,
        recipientName: params.name,
        expiresInDays: params.expiresInDays,
        sendEmail: params.sendEmail,
        locale: params.locale,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      return { ok: false, error: data.error || `HTTP ${res.status}` };
    }
    return { ok: true, url: data.url, expiresAt: data.expiresAt };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Error de red" };
  }
}

export function MintTokenForm({ formSlug }: { formSlug: string; formTitle: string }) {
  const [modo, setModo] = useState<Modo>("individual");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [correos, setCorreos] = useState("");
  const [locale, setLocale] = useState<"es" | "en">("es");
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [sendEmail, setSendEmail] = useState(true);

  const [enviando, setEnviando] = useState(false);
  const [progreso, setProgreso] = useState<{ actual: number; total: number } | null>(null);
  const [resultados, setResultados] = useState<ResultadoEnvio[] | null>(null);
  const [errorGeneral, setErrorGeneral] = useState("");
  const [copiadoUrl, setCopiadoUrl] = useState<string | null>(null);

  const { validos, invalidas } = parseBulk(correos);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorGeneral("");
    setResultados(null);

    if (modo === "individual") {
      if (!EMAIL_RE.test(correo.trim())) {
        setErrorGeneral("Escribe un correo válido.");
        return;
      }
      setEnviando(true);
      const r = await mintOne({
        formSlug,
        email: correo.trim(),
        name: nombre.trim() || undefined,
        locale,
        expiresInDays,
        sendEmail,
      });
      setResultados([{ email: correo.trim(), name: nombre.trim() || undefined, ...r }]);
      setEnviando(false);
      return;
    }

    if (validos.length === 0) {
      setErrorGeneral("Escribe al menos un correo válido, uno por línea.");
      return;
    }
    if (validos.length > MAX_MASIVO) {
      setErrorGeneral(`Máximo ${MAX_MASIVO} correos por envío. Divide la lista en tandas más pequeñas.`);
      return;
    }

    setEnviando(true);
    const out: ResultadoEnvio[] = [];
    for (let i = 0; i < validos.length; i++) {
      setProgreso({ actual: i + 1, total: validos.length });
      const d = validos[i];
      const r = await mintOne({ formSlug, email: d.email, name: d.name, locale, expiresInDays, sendEmail });
      out.push({ email: d.email, name: d.name, ...r });
      setResultados([...out]);
    }
    setProgreso(null);
    setEnviando(false);
  }

  function copiar(url: string) {
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiadoUrl(url);
    setTimeout(() => setCopiadoUrl((cur) => (cur === url ? null : cur)), 1500);
  }

  const generados = resultados?.filter((r) => r.ok).length ?? 0;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8" style={{ maxWidth: 760 }}>
      <div className="flex flex-col gap-3">
        <label className="opcion-tarjeta flex items-start gap-3">
          <input type="radio" name="modo" checked={modo === "individual"} onChange={() => setModo("individual")} />
          <span>
            <span className="opcion-tarjeta-titulo block">Una persona</span>
            <span className="opcion-tarjeta-explicacion block">Genera un enlace para un solo correo.</span>
          </span>
        </label>
        <label className="opcion-tarjeta flex items-start gap-3">
          <input type="radio" name="modo" checked={modo === "masivo"} onChange={() => setModo("masivo")} />
          <span>
            <span className="opcion-tarjeta-titulo block">Varias personas</span>
            <span className="opcion-tarjeta-explicacion block">
              Pega una lista de correos y genera un enlace para cada uno.
            </span>
          </span>
        </label>
      </div>

      {modo === "individual" ? (
        <div className="flex flex-col gap-4">
          <Campo label="Nombre" htmlFor="mint-nombre" hint="Opcional, solo para el saludo del correo.">
            <Input id="mint-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </Campo>
          <Campo label="Correo" htmlFor="mint-correo" required>
            <Input id="mint-correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          </Campo>
        </div>
      ) : (
        <Campo
          label="Correos"
          htmlFor="mint-correos"
          hint={`Un correo por línea; opcionalmente «Nombre <correo@dominio>». ${validos.length} de ${
            validos.length + invalidas
          } líneas son válidas.`}
        >
          <Textarea
            id="mint-correos"
            rows={8}
            value={correos}
            onChange={(e) => setCorreos(e.target.value)}
            placeholder={"Ana Torres <ana@ejemplo.com>\nluis@ejemplo.com"}
          />
        </Campo>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Campo label="Idioma" htmlFor="mint-locale">
          <Select id="mint-locale" value={locale} onChange={(e) => setLocale(e.target.value as "es" | "en")}>
            <option value="es">Español</option>
            <option value="en">English</option>
          </Select>
        </Campo>
        <Campo label="Días de vigencia" htmlFor="mint-dias" hint="Después de este plazo el enlace deja de funcionar.">
          <Input
            id="mint-dias"
            type="number"
            min={1}
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(Number(e.target.value) || 30)}
          />
        </Campo>
      </div>

      <label className="campo-checkbox">
        <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
        <span>Enviar el correo con el enlace (vía Resend)</span>
      </label>

      {errorGeneral && <Banner tone="error">{errorGeneral}</Banner>}

      {progreso && (
        <p className="pista">
          {progreso.actual} de {progreso.total}…
        </p>
      )}

      {resultados && !enviando && (
        <Banner tone="info">
          {generados} {generados === 1 ? "enlace generado" : "enlaces generados"}
          {sendEmail ? ` · ${generados} ${generados === 1 ? "correo enviado" : "correos enviados"}` : ""}
        </Banner>
      )}

      {resultados && resultados.length > 0 && (
        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th>Correo</th>
                <th>Estado</th>
                <th>Expira</th>
                <th>Enlace</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((r) => (
                <tr key={r.email}>
                  <td>{r.name ? `${r.name} · ${r.email}` : r.email}</td>
                  <td>{r.ok ? "✓" : `⚠ ${r.error ?? "Error"}`}</td>
                  <td className="secundario">{r.expiresAt ? fechaHora(r.expiresAt) : "—"}</td>
                  <td>
                    {r.ok && r.url ? (
                      <div className="flex items-center gap-2">
                        <code className="pista" style={{ wordBreak: "break-all" }}>
                          {r.url}
                        </code>
                        <button
                          type="button"
                          className="boton boton-secundario boton-chico"
                          onClick={() => copiar(r.url!)}
                        >
                          {copiadoUrl === r.url ? "Copiado ✓" : "Copiar"}
                        </button>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div>
        <button type="submit" className="boton boton-primario" disabled={enviando} aria-busy={enviando}>
          {enviando ? (
            <>
              <span className="girito" />
              Generando enlaces…
            </>
          ) : (
            "Generar enlaces"
          )}
        </button>
      </div>
    </form>
  );
}
