"use client";

/**
 * Envía un ping a /api/track por cada vista de página (analítica propia).
 *
 * Es independiente de los pixels de terceros (GA4, Meta): mide de forma
 * agregada y sin identificar a nadie, así que funciona aunque el visitante
 * rechace las cookies de analítica o marketing. Por eso vive fuera del
 * CookieBanner y no consulta el consentimiento.
 *
 * El `sessionId` vive en sessionStorage: agrupa las páginas de una misma
 * visita y desaparece al cerrar la pestaña. El tiempo en página se manda en
 * un segundo ping con sendBeacon cuando la pestaña se oculta.
 */
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "em_sid";

function sessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = (crypto.randomUUID?.() ?? String(Math.random()).slice(2)) as string;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // Modo privado o storage bloqueado: sesión efímera en memoria.
    return "anon";
  }
}

export function PageTracker({ locale }: { locale: string }) {
  const pathname = usePathname();
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sid = sessionId();
    startedAt.current = Date.now();

    const payload = {
      path: window.location.pathname + window.location.search,
      locale,
      referrer: document.referrer || null,
      sessionId: sid,
    };

    // Vista de página.
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});

    // Tiempo en página, al salir o cambiar de pestaña.
    const sendDuration = () => {
      const durationMs = Date.now() - startedAt.current;
      if (durationMs < 1000) return;
      try {
        navigator.sendBeacon?.(
          "/api/track",
          new Blob([JSON.stringify({ ...payload, durationMs })], {
            type: "application/json",
          }),
        );
      } catch {
        /* sin telemetría de salida si el navegador no lo permite */
      }
    };

    const onHide = () => {
      if (document.visibilityState === "hidden") sendDuration();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [pathname, locale]);

  return null;
}
