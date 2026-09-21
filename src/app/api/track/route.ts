/**
 * Ingesta de la analítica propia — POST /api/track
 *
 * Recibe un ping por vista de página desde <PageTracker/> y escribe una fila
 * en `page_views`. Diseñado para no romper nunca la navegación: cualquier
 * error responde 204 y se descarta en silencio.
 *
 * Privacidad: la IP se usa solo como insumo de un hash junto con la fecha del
 * día y un secreto; nunca se almacena. El hash rota cada día, así que no
 * permite seguir a una persona entre días ni revertirse a una IP.
 */
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "@/shared/db/client";
import { pageViews } from "@/shared/db/schema/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OK = new NextResponse(null, { status: 204 });

/** Clasifica el path en un paso del embudo + el slug de la entidad si lo hay. */
function classifyPath(rawPath: string): { step: string; slug: string | null } {
  // Quita el prefijo de idioma: /es/experiencias/equinox → /experiencias/equinox
  const path = rawPath.replace(/^\/(es|en)(?=\/|$)/, "") || "/";
  const seg = path.split("/").filter(Boolean);

  if (seg.length === 0) return { step: "home", slug: null };

  const [first, second] = seg;
  switch (first) {
    case "experiencias":
    case "experiences":
      return { step: second ? "experiencia" : "retiros", slug: second ?? null };
    case "retiros":
    case "retreats":
      return { step: second ? "experiencia" : "retiros", slug: second ?? null };
    case "checkout":
      return { step: "checkout", slug: second ?? null };
    case "gracias":
    case "thank-you":
      return { step: "gracias", slug: second ?? null };
    case "empresas":
    case "enterprise":
      return { step: "empresas", slug: second ?? null };
    case "blog":
      return { step: "blog", slug: second ?? null };
    default:
      return { step: "otro", slug: null };
  }
}

/** utm_source explícito, o el host del referrer normalizado, o "directo". */
function normalizeSource(utmSource: string | null, referrerHost: string | null): string {
  if (utmSource) return utmSource.toLowerCase().slice(0, 60);
  if (!referrerHost) return "directo";
  const h = referrerHost.toLowerCase().replace(/^www\./, "");
  if (h.includes("google")) return "google";
  if (h.includes("instagram")) return "instagram";
  if (h.includes("facebook") || h.includes("fb.")) return "facebook";
  if (h.includes("linkedin") || h.includes("lnkd.in")) return "linkedin";
  if (h.includes("youtube")) return "youtube";
  if (h.includes("t.co") || h.includes("twitter") || h.includes("x.com")) return "x";
  if (h.includes("bing")) return "bing";
  if (h.includes("chatgpt") || h.includes("openai") || h.includes("perplexity") || h.includes("claude")) return "ia";
  if (h.includes("mail") || h.includes("outlook")) return "correo";
  return h.slice(0, 60);
}

function host(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).host.slice(0, 120) || null;
  } catch {
    return null;
  }
}

/** Hash irreversible que rota cada día: identifica un visitante solo dentro del día. */
function dailyVisitorHash(ip: string, ua: string): string {
  const salt = process.env.ANALYTICS_SALT ?? process.env.AUTH_SECRET ?? "elements-method";
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256").update(`${day}|${ip}|${ua}|${salt}`).digest("hex").slice(0, 32);
}

function device(ua: string): string {
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile";
  return "desktop";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      path?: string;
      locale?: string;
      referrer?: string;
      sessionId?: string;
      durationMs?: number;
    };

    const rawPath = typeof body.path === "string" ? body.path.slice(0, 300) : "/";
    if (!body.sessionId) return OK;

    const url = new URL(rawPath, "https://x.local");
    const cleanPath = url.pathname;
    const { step, slug } = classifyPath(cleanPath);

    const referrerHost = host(body.referrer ?? null);
    const ua = req.headers.get("user-agent") ?? "";

    // Ignora bots: no son visitas reales y ensucian los totales.
    if (/bot|crawler|spider|crawling|headless|lighthouse|preview/i.test(ua)) return OK;

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "0.0.0.0";

    await db.insert(pageViews).values({
      path: cleanPath,
      locale: body.locale === "en" ? "en" : "es",
      funnelStep: step,
      entitySlug: slug,
      referrerHost,
      source: normalizeSource(url.searchParams.get("utm_source"), referrerHost),
      medium: url.searchParams.get("utm_medium")?.slice(0, 60) ?? null,
      campaign: url.searchParams.get("utm_campaign")?.slice(0, 120) ?? null,
      device: device(ua),
      country: req.headers.get("x-vercel-ip-country") ?? null,
      visitorHash: dailyVisitorHash(ip, ua),
      sessionId: String(body.sessionId).slice(0, 64),
      durationMs:
        typeof body.durationMs === "number" && body.durationMs >= 0
          ? Math.min(Math.round(body.durationMs), 1000 * 60 * 60)
          : null,
    });

    return OK;
  } catch {
    // Nunca romper la navegación por un fallo de medición.
    return OK;
  }
}
