"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { CAL_ORIGIN, CAL_USERNAME } from "@/shared/integrations/cal";

const EMBED_JS = "https://app.cal.com/embed/embed.js";

type CalFn = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  ns?: Record<string, unknown>;
  q?: unknown[];
};

/**
 * Cal's official loader stub, in TypeScript.
 *
 * `embed.js` does NOT define `window.Cal` by itself — it drains a queue that
 * this stub must create first. Loading the script and then calling `Cal(...)`
 * (what this component used to do) fails silently, which is why the calendar
 * never appeared. Every call before the script finishes is queued and replayed
 * on load.
 */
function ensureCal(): CalFn {
  const w = window as unknown as { Cal?: CalFn };
  if (typeof w.Cal === "function") return w.Cal;

  const api: CalFn = function (...args: unknown[]) {
    const cal = w.Cal as CalFn;
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];
      const script = document.createElement("script");
      script.src = EMBED_JS;
      script.async = true;
      document.head.appendChild(script);
      cal.loaded = true;
    }
    if (args[0] === "init") {
      const namespace = args[1];
      if (typeof namespace === "string") {
        const nsApi: CalFn = function (...a: unknown[]) {
          nsApi.q!.push(a);
        };
        nsApi.q = nsApi.q || [];
        cal.ns![namespace] = cal.ns![namespace] || nsApi;
        (cal.ns![namespace] as CalFn).q!.push(args);
        cal.q!.push(["initNamespace", namespace]);
        return;
      }
    }
    cal.q!.push(args);
  };

  w.Cal = api;
  return api;
}

interface CalEmbedProps {
  eventType: string;
  layout?: "month_view" | "week_view" | "column_view";
  className?: string;
  fallbackLabel?: string;
}

/**
 * Inline Cal.com booking calendar.
 *
 * Success is detected two ways — Cal's own `linkReady` event and a mutation
 * observer watching for the iframe — because a missed signal used to leave a
 * perfectly working calendar hidden behind the fallback. The container is
 * never unmounted: if the embed arrives late, it simply appears.
 */
export function CalEmbed({
  eventType,
  layout = "month_view",
  className = "",
  fallbackLabel,
}: CalEmbedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const bookingUrl = `https://cal.com/${CAL_USERNAME}/${eventType}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    readyRef.current = false;
    setStatus("loading");

    function markReady() {
      if (readyRef.current) return;
      readyRef.current = true;
      setStatus("ready");
    }

    // El iframe de Cal aparece como hijo del contenedor: verlo es la señal más
    // fiable de que el calendario montó, con o sin evento `linkReady`.
    const observer = new MutationObserver(() => {
      if (el.querySelector("iframe")) markReady();
    });
    observer.observe(el, { childList: true, subtree: true });

    let cancelled = false;
    try {
      const Cal = ensureCal();
      Cal("init", { origin: CAL_ORIGIN });

      // StrictMode monta el efecto dos veces en desarrollo: sin esto, Cal
      // inyecta dos calendarios en el mismo contenedor.
      if (!el.querySelector("cal-inline, iframe")) {
        Cal("inline", {
          elementOrSelector: el,
          calLink: `${CAL_USERNAME}/${eventType}`,
          layout,
          config: { layout, theme: "light" },
        });
      }

      Cal("ui", {
        theme: "light",
        cssVarsPerTheme: { light: { "cal-brand": "#C9A96E" } },
        hideEventTypeDetails: false,
        layout,
      });

      Cal("on", { action: "linkReady", callback: markReady });
      Cal("on", {
        action: "linkFailed",
        callback: () => {
          if (!cancelled && !readyRef.current) setStatus("error");
        },
      });
    } catch {
      setStatus("error");
    }

    // Red lenta o script bloqueado: se ofrece la salida a cal.com, pero el
    // contenedor sigue vivo por si el calendario llega después.
    const timer = window.setTimeout(() => {
      if (!cancelled && !readyRef.current) setStatus("error");
    }, 12_000);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [eventType, layout]);

  return (
    <div className={`relative ${className}`}>
      {status === "error" && (
        <div className="mb-4 border border-[var(--color-line)] bg-[var(--color-paper-warm)] p-6 text-sm text-[var(--color-ink-soft)]">
          <p className="leading-relaxed">
            {fallbackLabel ||
              "La agenda no está disponible aquí en este momento. Continúa en una nueva pestaña:"}
          </p>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--color-gold-deep)] hover:underline"
          >
            cal.com/{CAL_USERNAME}/{eventType}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}

      <div className="relative">
        {status === "loading" && (
          <div className="absolute inset-0 grid place-items-center text-[var(--color-muted)] text-sm pointer-events-none">
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

      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
      >
        Abrir en cal.com
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}
