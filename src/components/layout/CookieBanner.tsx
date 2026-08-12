"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Settings, Check } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { Button } from "@/components/ui/Button";
import {
  loadPixels,
  type TrackingConfig,
} from "@/shared/integrations/tracking";

const COOKIE_KEY = "em_cookie_consent";
const SESSION_KEY = "em_session_id";

interface ConsentState {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  ts: number;
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&")}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${days * 24 * 60 * 60}; SameSite=Lax`;
}

function getOrCreateSessionId(): string {
  let id = getCookie(SESSION_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `sid_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    setCookie(SESSION_KEY, id);
  }
  return id;
}

export function CookieBanner({
  locale,
  dict,
  tracking,
}: {
  locale: Locale;
  dict: Dict;
  tracking: TrackingConfig;
}) {
  const [show, setShow] = React.useState(false);
  const [mode, setMode] = React.useState<"banner" | "settings">("banner");
  const [pref, setPref] = React.useState({ analytics: false, marketing: false });

  React.useEffect(() => {
    const existing = getCookie(COOKIE_KEY);
    if (existing) {
      try {
        const consent = JSON.parse(existing) as ConsentState;
        loadPixels(tracking, consent);
        return;
      } catch {
        /* invalid stored value — re-prompt */
      }
    }
    const t = window.setTimeout(() => setShow(true), 800);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracking]);

  async function persist(consent: ConsentState) {
    setCookie(COOKIE_KEY, JSON.stringify(consent));
    const sessionId = getOrCreateSessionId();
    try {
      await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          essential: consent.essential,
          analytics: consent.analytics,
          marketing: consent.marketing,
        }),
      });
    } catch {
      /* best-effort */
    }
    loadPixels(tracking, consent);
    setShow(false);
  }

  function acceptAll() {
    void persist({ essential: true, analytics: true, marketing: true, ts: Date.now() });
  }
  function essentialOnly() {
    void persist({ essential: true, analytics: false, marketing: false, ts: Date.now() });
  }
  function savePreferences() {
    void persist({
      essential: true,
      analytics: pref.analytics,
      marketing: pref.marketing,
      ts: Date.now(),
    });
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-50 inset-x-3 bottom-3 sm:inset-x-auto sm:left-6 sm:bottom-6 sm:max-w-md"
          role="dialog"
          aria-labelledby="cookie-title"
        >
          <div className="bg-[var(--color-ink)] text-[var(--color-paper)] p-6 sm:p-7 shadow-2xl rounded-lg relative">
            <button
              type="button"
              onClick={essentialOnly}
              aria-label="Close"
              className="absolute top-3 right-3 text-[var(--color-paper)]/85 hover:text-[var(--color-paper)]"
            >
              <X className="h-4 w-4" />
            </button>
            <h3
              id="cookie-title"
              className="font-[family-name:var(--font-display)] text-xl mb-2"
            >
              {dict.cookies.title}
            </h3>
            <p className="text-sm text-[var(--color-paper)]/90 leading-relaxed">
              {dict.cookies.body}
            </p>

            {mode === "settings" ? (
              <div className="mt-5 space-y-3 text-sm">
                <CategoryRow
                  title={locale === "es" ? "Esenciales" : "Essential"}
                  body={
                    locale === "es"
                      ? "Necesarias para que el sitio funcione (siempre activas)."
                      : "Required for the site to function (always on)."
                  }
                  forced
                />
                <CategoryRow
                  title={locale === "es" ? "Analítica" : "Analytics"}
                  body={
                    locale === "es"
                      ? "Google Analytics para medir tráfico y mejorar contenido."
                      : "Google Analytics to measure traffic and improve content."
                  }
                  checked={pref.analytics}
                  onChange={(v) => setPref((p) => ({ ...p, analytics: v }))}
                />
                <CategoryRow
                  title={locale === "es" ? "Marketing" : "Marketing"}
                  body={
                    locale === "es"
                      ? "Meta (Facebook/Instagram), Google Ads y LinkedIn para atribución de campañas."
                      : "Meta (Facebook/Instagram), Google Ads and LinkedIn for campaign attribution."
                  }
                  checked={pref.marketing}
                  onChange={(v) => setPref((p) => ({ ...p, marketing: v }))}
                />
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="solidLight" onClick={savePreferences}>
                    {locale === "es" ? "Guardar preferencias" : "Save preferences"}
                  </Button>
                  <Button size="sm" variant="outlineLight" onClick={() => setMode("banner")}>
                    {locale === "es" ? "← Volver" : "← Back"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="sm" variant="solidLight" onClick={acceptAll}>
                  {dict.cookies.accept}
                </Button>
                <Button size="sm" variant="outlineLight" onClick={essentialOnly}>
                  {dict.cookies.essential}
                </Button>
                <button
                  type="button"
                  onClick={() => setMode("settings")}
                  className="inline-flex items-center gap-2 text-xs text-[var(--color-paper)]/90 hover:text-[var(--color-paper)] underline-offset-2 hover:underline"
                >
                  <Settings className="h-3.5 w-3.5" />
                  {dict.cookies.settings}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CategoryRow({
  title,
  body,
  checked,
  forced,
  onChange,
}: {
  title: string;
  body: string;
  checked?: boolean;
  forced?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const isOn = forced || checked;
  return (
    <div className="flex items-start gap-3 border-t border-[var(--color-paper)]/15 pt-3 first:border-t-0 first:pt-0">
      <button
        type="button"
        disabled={forced}
        onClick={() => onChange?.(!checked)}
        className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-sm border transition-colors ${
          isOn
            ? "bg-[var(--color-gold-soft)] border-[var(--color-gold-soft)] text-[var(--color-ink)]"
            : "border-[var(--color-paper)]/40 hover:border-[var(--color-paper)]"
        } ${forced ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
        aria-pressed={isOn}
        aria-label={title}
      >
        {isOn && <Check className="h-3 w-3" strokeWidth={3} />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="text-[var(--color-paper)] text-sm font-medium">{title}</div>
        <div className="text-[var(--color-paper)]/85 text-xs leading-relaxed">{body}</div>
      </div>
    </div>
  );
}
