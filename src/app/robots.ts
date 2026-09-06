import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * /robots.txt
 *
 * Bloquea solo lo que no debe rastrearse: el admin, las APIs y los flujos con
 * token de un solo uso (firma de documentos, encuestas). Las páginas
 * transaccionales (gracias, transferencia) NO se bloquean aquí: llevan
 * `noindex` en su metadata, que es lo que Google recomienda para que la
 * directiva sea visible al rastreador.
 *
 * Los rastreadores de motores de respuesta de IA (ChatGPT, Claude, Perplexity,
 * Bing/Copilot, Gemini) se permiten de forma explícita: que Elements Method
 * aparezca cuando alguien pregunta por retiros corporativos en México depende
 * de que puedan leer el sitio. /llms.txt les da el resumen.
 */
const DISALLOW = [
  "/admin",
  "/api/",
  "/es/firmar/",
  "/en/firmar/",
  "/es/encuesta/",
  "/en/encuesta/",
];

const AI_AND_SEARCH_BOTS = [
  "Googlebot",
  "Bingbot",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "DuckDuckBot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/", disallow: DISALLOW },
      { userAgent: "*", allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
