"use client";

import * as React from "react";
import { Loader2, MessageCircle, Clock } from "lucide-react";
import type { Locale } from "@/i18n/config";

interface PublicComment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  pending: boolean;
}

const SESSION_KEY = "em_session_id";

function getSessionId(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${SESSION_KEY}=([^;]*)`));
  if (match) return decodeURIComponent(match[1]);
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `sid_${Date.now()}`;
  document.cookie = `${SESSION_KEY}=${id}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
  return id;
}

const COPY = {
  es: {
    title: "Comentarios",
    name: "Tu nombre",
    email: "Email (no se publica)",
    comment: "Escribe un comentario…",
    submit: "Publicar comentario",
    sending: "Enviando…",
    pending: "En revisión",
    moderation:
      "Los comentarios se revisan antes de publicarse. El tuyo aparece aquí mientras tanto.",
    empty: "Sé la primera persona en comentar.",
    error: "No se pudo enviar. Reintenta.",
  },
  en: {
    title: "Comments",
    name: "Your name",
    email: "Email (not published)",
    comment: "Write a comment…",
    submit: "Post comment",
    sending: "Sending…",
    pending: "Under review",
    moderation:
      "Comments are reviewed before publishing. Yours shows here in the meantime.",
    empty: "Be the first to comment.",
    error: "Couldn't send. Please retry.",
  },
} as const;

export function CommentsSection({
  locale,
  postSlug,
}: {
  locale: Locale;
  postSlug: string;
}) {
  const c = COPY[locale];
  const [comments, setComments] = React.useState<PublicComment[]>([]);
  const [loaded, setLoaded] = React.useState(false);
  const [state, setState] = React.useState<"idle" | "sending" | "error">("idle");
  const formRef = React.useRef<HTMLFormElement>(null);

  const load = React.useCallback(async () => {
    const sid = getSessionId();
    try {
      const res = await fetch(
        `/api/comentarios?postSlug=${encodeURIComponent(postSlug)}&sessionId=${encodeURIComponent(sid)}`,
      );
      const data = await res.json().catch(() => ({}));
      if (data.ok) setComments(data.comments ?? []);
    } catch {
      /* best-effort */
    } finally {
      setLoaded(true);
    }
  }, [postSlug]);

  React.useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postSlug,
          authorName: String(fd.get("authorName") ?? "").trim(),
          authorEmail: String(fd.get("authorEmail") ?? "").trim(),
          content: String(fd.get("content") ?? "").trim(),
          sessionId: getSessionId(),
          honeypot: String(fd.get("company_url") ?? ""),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error("send failed");
      formRef.current?.reset();
      setState("idle");
      await load();
    } catch {
      setState("error");
    }
  }

  return (
    <div className="mt-16 pt-10 border-t border-[var(--color-line)]">
      <h2 className="font-[family-name:var(--font-display)] text-2xl mb-6 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-[var(--color-muted)]" strokeWidth={1.5} />
        {c.title}
        {comments.length > 0 && (
          <span className="text-sm text-[var(--color-muted)]">({comments.length})</span>
        )}
      </h2>

      <div className="space-y-5 mb-10">
        {loaded && comments.length === 0 && (
          <p className="text-sm text-[var(--color-muted)]">{c.empty}</p>
        )}
        {comments.map((cm) => (
          <div
            key={cm.id}
            className={`border-l-2 pl-4 ${cm.pending ? "border-amber-400" : "border-[var(--color-line)]"}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">{cm.authorName}</span>
              {cm.pending && (
                <span className="inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.14em] text-amber-700">
                  <Clock className="h-3 w-3" />
                  {c.pending}
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed whitespace-pre-line">
              {cm.content}
            </p>
          </div>
        ))}
      </div>

      <form ref={formRef} onSubmit={onSubmit} className="space-y-3 max-w-xl">
        <input type="text" name="company_url" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <div className="grid sm:grid-cols-2 gap-3">
          <input name="authorName" required placeholder={c.name} className={inputCls} />
          <input name="authorEmail" type="email" required placeholder={c.email} className={inputCls} />
        </div>
        <textarea name="content" required rows={3} placeholder={c.comment} className={inputCls} />
        {state === "error" && <p className="text-xs text-red-700">{c.error}</p>}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={state === "sending"}
            className="inline-flex items-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-2.5 text-sm hover:bg-[var(--color-ink)]/90 disabled:opacity-60 transition-colors"
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
          <span className="text-xs text-[var(--color-muted)]">{c.moderation}</span>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full border-0 border-b border-[var(--color-line)] bg-transparent px-1 py-2 text-sm focus:outline-none focus:border-[var(--color-ink)]";
