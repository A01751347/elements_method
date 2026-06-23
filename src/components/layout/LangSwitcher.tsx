"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";
import { locales, type Locale, isLocale } from "@/i18n/config";
import { cn } from "@/lib/utils";

const routeMap: Record<string, Record<Locale, string>> = {
  // Home
  "": { es: "", en: "" },
  // Public pages
  "quienes-somos": { es: "quienes-somos", en: "who-we-are" },
  "who-we-are": { es: "quienes-somos", en: "who-we-are" },
  "los-caminos": { es: "los-caminos", en: "paths" },
  paths: { es: "los-caminos", en: "paths" },
  "el-metodo": { es: "el-metodo", en: "method" },
  method: { es: "el-metodo", en: "method" },
  empresas: { es: "empresas", en: "companies" },
  companies: { es: "empresas", en: "companies" },
  retiros: { es: "retiros", en: "retreats" },
  retreats: { es: "retiros", en: "retreats" },
  blog: { es: "blog", en: "journal" },
  journal: { es: "blog", en: "journal" },
};

function translatePath(pathname: string, target: Locale): string {
  // Strip leading slash and current locale
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${target}`;
  const [, ...rest] = segments;
  if (rest.length === 0) return `/${target}`;

  const first = rest[0];
  const tail = rest.slice(1);
  const translatedFirst = routeMap[first]?.[target] ?? first;
  const path = [target, translatedFirst, ...tail].filter(Boolean).join("/");
  return `/${path}`;
}

export function LangSwitcher({
  currentLocale,
  inverted,
}: {
  currentLocale: Locale;
  inverted?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname() || `/${currentLocale}`;
  const [pending, start] = useTransition();

  function switchTo(target: Locale) {
    if (target === currentLocale) return;
    const next = translatePath(pathname, target);
    document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=${60 * 60 * 24 * 365}`;
    start(() => router.push(next));
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-[0.8rem] tracking-[0.18em] uppercase font-medium",
        inverted
          ? "text-[var(--color-paper)]"
          : "text-[var(--color-ink-soft)]",
        pending && "opacity-60",
      )}
      style={
        inverted
          ? { textShadow: "0 1px 2px rgba(0,0,0,0.35)" }
          : undefined
      }
      role="group"
      aria-label="Language"
    >
      <Globe className="h-3.5 w-3.5" aria-hidden />
      {locales.map((l, idx) => (
        <span key={l} className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => switchTo(l)}
            aria-current={l === currentLocale ? "true" : undefined}
            className={cn(
              "transition-colors",
              l === currentLocale
                ? inverted
                  ? "text-[var(--color-paper)]"
                  : "text-[var(--color-ink)]"
                : "hover:text-[var(--color-ink)]",
              inverted && l !== currentLocale && "hover:text-[var(--color-paper)]",
            )}
          >
            {l.toUpperCase()}
          </button>
          {idx === 0 && (
            <span
              aria-hidden
              className={cn(
                "h-3 w-px",
                inverted
                  ? "bg-[var(--color-paper)]/30"
                  : "bg-[var(--color-ink)]/20",
              )}
            />
          )}
        </span>
      ))}
    </div>
  );
}

export { isLocale };
