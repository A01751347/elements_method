"use client";

import { useState } from "react";
import { Copy, Loader2, Check, AlertCircle, Send } from "lucide-react";

export function MintTokenForm({
  formSlug,
  formTitle,
}: {
  formSlug: string;
  formTitle: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<{ token: string; url: string; expiresAt: string } | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setErrorMsg("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/forms/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formSlug,
          recipientEmail: String(fd.get("recipientEmail") ?? "").trim(),
          recipientName: String(fd.get("recipientName") ?? "").trim() || undefined,
          expiresInDays: Number(fd.get("expiresInDays") ?? 30),
          sendEmail: fd.get("sendEmail") === "on",
          locale: String(fd.get("locale") ?? "es") as "es" | "en",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setResult({ token: data.token, url: data.url, expiresAt: data.expiresAt });
      setState("success");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <div className="rounded-lg border border-zinc-200 bg-white p-5 space-y-4">
        <h2 className="text-sm font-medium mb-2">Destinatario</h2>
        <FormRow label="Nombre">
          <Input name="recipientName" placeholder="Opcional, sólo para el saludo" />
        </FormRow>
        <FormRow label="Email" required>
          <Input name="recipientEmail" type="email" required />
        </FormRow>
        <FormRow label="Idioma">
          <Select name="locale" defaultValue="es">
            <option value="es">Español</option>
            <option value="en">English</option>
          </Select>
        </FormRow>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-5 space-y-4">
        <h2 className="text-sm font-medium mb-2">Enlace</h2>
        <FormRow label="Cuestionario">
          <div className="text-sm text-zinc-700">{formTitle}</div>
          <div className="font-mono text-xs text-zinc-500">{formSlug}</div>
        </FormRow>
        <FormRow label="Expira en (días)">
          <Input name="expiresInDays" type="number" defaultValue="30" className="w-32" />
        </FormRow>
        <FormRow label="Enviar email">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="sendEmail"
              defaultChecked
              className="h-4 w-4 accent-zinc-900"
            />
            Enviar email con el enlace al destinatario (vía Resend)
          </label>
        </FormRow>
      </div>

      {state === "error" && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {state === "success" && result && (
        <div className="border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 mt-0.5 text-emerald-700 shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-emerald-900 mb-2">Enlace generado</h3>
              <div className="bg-white border border-emerald-200 px-3 py-2 text-xs font-mono break-all">
                {result.url}
              </div>
              <div className="mt-2 text-xs text-emerald-800">
                Expira: {new Date(result.expiresAt).toLocaleString("es-MX")}
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(result.url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-900 hover:underline"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? "Copiado" : "Copiar enlace"}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 text-sm hover:bg-zinc-800 disabled:opacity-60 transition-colors"
      >
        {state === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generando…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Generar y enviar
          </>
        )}
      </button>
    </form>
  );
}

function FormRow({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-4 items-start">
      <label className="text-xs uppercase tracking-[0.14em] text-zinc-500 pt-2">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>
      <div>{children}</div>
    </div>
  );
}

function Input({
  name,
  defaultValue,
  type = "text",
  placeholder,
  required,
  className = "",
}: {
  name: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <input
      type={type}
      name={name}
      defaultValue={defaultValue}
      placeholder={placeholder}
      required={required}
      className={`w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 ${className}`}
    />
  );
}

function Select({
  name,
  defaultValue,
  children,
}: {
  name: string;
  defaultValue?: string;
  children: React.ReactNode;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
    >
      {children}
    </select>
  );
}
