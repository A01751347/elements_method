"use client";

import { useEffect } from "react";
import { HTML_LANG } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

/**
 * El `<html lang>` vive en el layout raíz, fuera de `[locale]`, así que no
 * conoce el idioma. Este componente lo corrige en cliente para /en. Google
 * determina el idioma por el contenido y por hreflang (ambos ya correctos en
 * el HTML inicial); esto es para lectores de pantalla y traductores.
 */
export function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[locale];
  }, [locale]);
  return null;
}
