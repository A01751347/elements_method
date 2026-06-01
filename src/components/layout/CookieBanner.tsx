"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { Button } from "@/components/ui/Button";

const COOKIE_KEY = "em_cookie_consent";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&")}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${days * 24 * 60 * 60}`;
}

export function CookieBanner({
  locale: _locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const existing = getCookie(COOKIE_KEY);
    if (!existing) {
      const t = window.setTimeout(() => setShow(true), 800);
      return () => window.clearTimeout(t);
    }
  }, []);

  function accept(level: "all" | "essential") {
    setCookie(COOKIE_KEY, level);
    setShow(false);
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
              onClick={() => accept("essential")}
              aria-label="Close"
              className="absolute top-3 right-3 text-[var(--color-paper)]/60 hover:text-[var(--color-paper)]"
            >
              <X className="h-4 w-4" />
            </button>
            <h3
              id="cookie-title"
              className="font-[family-name:var(--font-display)] text-xl mb-2"
            >
              {dict.cookies.title}
            </h3>
            <p className="text-sm text-[var(--color-paper)]/70 leading-relaxed">
              {dict.cookies.body}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => accept("all")}
                className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)]"
              >
                {dict.cookies.accept}
              </Button>
              <Button
                size="sm"
                variant="outlineLight"
                onClick={() => accept("essential")}
              >
                {dict.cookies.essential}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
