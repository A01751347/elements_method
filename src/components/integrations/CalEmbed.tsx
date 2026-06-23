"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";

const USERNAME = process.env.NEXT_PUBLIC_CAL_USERNAME || "elementsmethod";

interface CalEmbedProps {
  eventType: string;
  layout?: "month_view" | "week_view" | "column_view";
  className?: string;
  fallbackLabel?: string;
}

/**
 * Inline Cal.com embed. Loads the Cal embed script lazily, then mounts
 * the calendar into the container ref. If the script fails (workspace
 * doesn't exist yet), renders a fallback link to the public booking URL.
 */
export function CalEmbed({
  eventType,
  layout = "month_view",
  className = "",
  fallbackLabel,
}: CalEmbedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    const w = window as unknown as { Cal?: (...args: unknown[]) => unknown };
    const init = () => {
      if (cancelled || !ref.current) return;
      try {
        if (typeof w.Cal !== "function") {
          setStatus("error");
          return;
        }
        w.Cal("init", { origin: "https://cal.com" });
        w.Cal("inline", {
          elementOrSelector: ref.current,
          calLink: `${USERNAME}/${eventType}`,
          layout,
        });
        w.Cal("ui", {
          theme: "light",
          styles: { branding: { brandColor: "#C9A96E" } },
          hideEventTypeDetails: false,
        });
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    };

    if (typeof w.Cal === "function") {
      init();
      return () => {
        cancelled = true;
      };
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-cal-loader]`,
    );
    if (existing) {
      existing.addEventListener("load", init, { once: true });
      existing.addEventListener("error", () => setStatus("error"), { once: true });
      return () => {
        cancelled = true;
        existing.removeEventListener("load", init);
      };
    }

    const s = document.createElement("script");
    s.src = "https://app.cal.com/embed/embed.js";
    s.async = true;
    s.dataset.calLoader = "1";
    s.onload = init;
    s.onerror = () => setStatus("error");
    document.head.appendChild(s);

    // Defensive timeout — if Cal never resolves in 8s show fallback
    const t = window.setTimeout(() => {
      if (status === "loading") setStatus("error");
    }, 8000);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventType, layout]);

  if (status === "error") {
    return (
      <div
        className={`border border-[var(--color-line)] bg-[var(--color-paper-warm)] p-6 text-sm text-[var(--color-ink-soft)] ${className}`}
      >
        <p className="leading-relaxed">
          {fallbackLabel ||
            "La agenda no está disponible aquí en este momento. Continúa en una nueva pestaña:"}
        </p>
        <a
          href={`https://cal.com/${USERNAME}/${eventType}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--color-gold-deep)] hover:underline"
        >
          cal.com/{USERNAME}/{eventType}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center text-[var(--color-muted)] text-sm">
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando agenda…
          </span>
        </div>
      )}
      <div
        ref={ref}
        className="min-h-[640px] border border-[var(--color-line)] bg-[var(--color-paper)] overflow-hidden"
      />
    </div>
  );
}
