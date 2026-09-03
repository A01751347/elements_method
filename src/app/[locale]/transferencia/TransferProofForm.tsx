"use client";

import { useRef, useState } from "react";
import { Copy, Loader2, Check, AlertCircle, Upload } from "lucide-react";
import type { Locale } from "@/i18n/config";

/** Map API error codes to something a buyer can act on. */
function errorLabel(code: unknown, locale: Locale): string {
  const es = locale === "es";
  switch (code) {
    case "ORDER_NOT_FOUND":
      return es
        ? "No encontramos ese folio. Revísalo en tu correo de confirmación."
        : "We couldn't find that folio. Check your confirmation email.";
    case "EMAIL_MISMATCH":
      return es
        ? "El email no coincide con el de la orden."
        : "The email doesn't match the one on the order.";
    case "UNSUPPORTED_TYPE":
      return es ? "Formato no admitido (PDF, JPG o PNG)." : "Unsupported format (PDF, JPG or PNG).";
    case "INVALID_PROOF_URL":
      return es ? "El comprobante no es válido." : "The proof file is not valid.";
    case "UPLOAD_UNAVAILABLE":
      return es ? "La subida no está disponible." : "Upload is unavailable.";
    default:
      return "";
  }
}

export function TransferProofForm({ locale }: { locale: Locale }) {
  const [state, setState] = useState<"idle" | "uploading" | "submitting" | "success" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [proofUrl, setProofUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  /** Set when the server has no S3 credentials — we then ask for the proof by email. */
  const [uploadUnavailable, setUploadUnavailable] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const t = (es: string, en: string) => (locale === "es" ? es : en);

  /**
   * Two-step upload: ask the server for a presigned S3 PUT (it checks the folio
   * belongs to this email), then send the file straight to S3. The file never
   * transits our server, and no AWS credential reaches the browser.
   */
  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // The folio+email are what authorize the upload, so require them first.
    const fd = new FormData(formRef.current ?? undefined);
    const folio = String(fd.get("folio") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    if (!folio || !email) {
      setState("error");
      setErrorMsg(
        t(
          "Escribe primero tu folio y email — con eso verificamos tu orden antes de subir.",
          "Enter your folio and email first — we verify your order before uploading.",
        ),
      );
      e.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setState("error");
      setErrorMsg(t("El archivo supera 10 MB.", "File exceeds 10 MB."));
      e.target.value = "";
      return;
    }

    setState("uploading");
    setErrorMsg("");
    setProofUrl("");
    try {
      const signRes = await fetch("/api/uploads/comprobante", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folio,
          email,
          contentType: file.type,
          size: file.size,
        }),
      });
      const signed = await signRes.json().catch(() => ({}));

      if (signRes.status === 503) {
        // No storage configured — degrade honestly instead of faking a URL.
        setUploadUnavailable(true);
        setState("idle");
        e.target.value = "";
        return;
      }
      if (!signRes.ok || !signed.ok) {
        throw new Error(errorLabel(signed.error, locale) || `HTTP ${signRes.status}`);
      }

      const put = await fetch(signed.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": signed.contentType },
        body: file,
      });
      if (!put.ok) {
        throw new Error(t("No se pudo subir el archivo.", "Could not upload the file."));
      }

      setProofUrl(signed.publicUrl);
      setFileName(file.name);
      setState("idle");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : t("Falló la subida.", "Upload failed."));
      e.target.value = "";
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!proofUrl && !uploadUnavailable) {
      setState("error");
      setErrorMsg(t("Sube tu comprobante primero.", "Upload your proof first."));
      return;
    }
    setState("submitting");
    setErrorMsg("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/transferencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folio: String(fd.get("folio") ?? "").trim(),
          email: String(fd.get("email") ?? "").trim(),
          proofUrl: proofUrl || undefined,
          amountMxn: fd.get("amountMxn")
            ? Number(fd.get("amountMxn"))
            : undefined,
          reference: String(fd.get("reference") ?? "").trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(errorLabel(data.error, locale) || `HTTP ${res.status}`);
      }
      setState("success");
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : t("Error desconocido.", "Unknown error."));
    }
  }

  if (state === "success") {
    return (
      <div className="border border-emerald-200 bg-emerald-50 p-6" role="status">
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 mt-0.5 text-emerald-700 shrink-0" />
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-xl text-emerald-900 mb-2">
              {locale === "es" ? "Recibido." : "Received."}
            </h3>
            <p className="text-sm text-emerald-800 leading-relaxed">
              {locale === "es"
                ? "Validamos tu comprobante en menos de 24 horas hábiles y te enviamos la confirmación por email."
                : "We validate your proof within 24 business hours and email you confirmation."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-5">
      <label className="block">
        <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-2">
          Folio<span className="ml-1 text-[var(--color-fire-ink)]">*</span>
        </span>
        <input
          type="text"
          name="folio"
          required
          placeholder="EM-XXXX-XXXX"
          className="w-full border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-3 text-sm font-mono focus:outline-none focus:border-[var(--color-ink)]"
        />
      </label>
      <label className="block">
        <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-2">
          Email<span className="ml-1 text-[var(--color-fire-ink)]">*</span>
        </span>
        <input
          type="email"
          name="email"
          required
          className="w-full border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-3 text-sm focus:outline-none focus:border-[var(--color-ink)]"
        />
      </label>
      <label className="block">
        <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-2">
          {locale === "es" ? "Monto transferido (MXN)" : "Amount transferred (MXN)"}
        </span>
        <input
          type="number"
          name="amountMxn"
          min="0"
          className="w-full border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-3 text-sm tabular-nums focus:outline-none focus:border-[var(--color-ink)]"
        />
      </label>
      <label className="block">
        <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-2">
          {locale === "es" ? "Referencia / clave SPEI" : "Reference / SPEI key"}
        </span>
        <input
          type="text"
          name="reference"
          className="w-full border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-3 text-sm font-mono focus:outline-none focus:border-[var(--color-ink)]"
        />
      </label>

      {uploadUnavailable ? (
        <div className="border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium mb-1">
                {t("Subida no disponible por ahora", "Upload unavailable right now")}
              </p>
              <p className="leading-relaxed">
                {t(
                  "Envía tu comprobante a hello@elementsmethod.com con tu folio en el asunto. Puedes mandar este formulario de todos modos y lo conciliamos con tu correo.",
                  "Email your proof to hello@elementsmethod.com with your folio in the subject. You can still submit this form and we'll match it with your email.",
                )}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <label className="block">
          <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-2">
            {t("Comprobante (PDF, JPG, PNG · máx. 10 MB)", "Proof (PDF, JPG, PNG · max 10 MB)")}
            <span className="ml-1 text-[var(--color-fire-ink)]">*</span>
          </span>
          <div className="border border-dashed border-[var(--color-line)] hover:border-[var(--color-ink)] transition-colors px-4 py-6 text-center">
            <input
              type="file"
              accept="image/png,image/jpeg,application/pdf"
              onChange={onFileChange}
              disabled={state === "uploading" || state === "submitting"}
              className="block mx-auto text-xs text-[var(--color-ink-soft)] disabled:opacity-50"
            />
            {state === "uploading" && (
              <div className="mt-3 inline-flex items-center gap-2 text-xs text-[var(--color-muted)]">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {t("Subiendo…", "Uploading…")}
              </div>
            )}
            {proofUrl && state !== "uploading" && (
              <div className="mt-3 inline-flex items-center gap-2 text-xs text-emerald-700">
                <Check className="h-3.5 w-3.5" />
                {t("Subido:", "Uploaded:")} <span className="font-mono">{fileName}</span>
              </div>
            )}
          </div>
        </label>
      )}

      {state === "error" && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={state === "submitting" || state === "uploading"}
        className="inline-flex items-center justify-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] px-6 py-3 text-sm tracking-wide hover:bg-[var(--color-ink)]/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {state === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {locale === "es" ? "Enviando…" : "Submitting…"}
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            {locale === "es" ? "Enviar comprobante" : "Submit proof"}
          </>
        )}
      </button>
    </form>
  );
}

export function BankRow({
  label,
  value,
  copyable,
}: {
  label: string;
  value: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="px-5 py-4 flex items-center justify-between gap-4">
      <div>
        <div className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)]">
          {label}
        </div>
        <div className="mt-1 font-mono text-sm text-[var(--color-ink)]">{value}</div>
      </div>
      {copyable && (
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className={`inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.18em] transition-colors ${
            copied
              ? "text-emerald-700"
              : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          }`}
        >
          <Copy className="h-3.5 w-3.5" />
          {copied ? "OK" : "Copiar"}
        </button>
      )}
    </div>
  );
}
