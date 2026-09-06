import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { ARCO_RIGHTS, ARCO_RIGHT_INFO, t } from "@/data/arco";
import { localePath, ROUTES } from "@/lib/seo";

/**
 * Los cinco botones ARCO dentro del Aviso de Privacidad: cada uno abre el
 * formulario de /privacidad/arco con ese derecho preseleccionado.
 */
export function ArcoRightLinks({ locale }: { locale: Locale }) {
  const base = localePath(locale, ROUTES.arco);
  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      {ARCO_RIGHTS.map((key) => {
        const info = ARCO_RIGHT_INFO[key];
        return (
          <Link
            key={key}
            href={`${base}?derecho=${key}`}
            className="inline-flex items-center gap-2.5 border border-[var(--color-ink)]/25 px-4 h-11 text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-ink)] hover:border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-colors"
          >
            <span className="font-[family-name:var(--font-display)] text-lg leading-none" aria-hidden>
              {info.letter}
            </span>
            {t(info.label, locale)}
          </Link>
        );
      })}
    </div>
  );
}
