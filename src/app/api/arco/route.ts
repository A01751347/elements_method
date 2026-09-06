import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/shared/db/client";
import { arcoRequests, type ArcoRequest } from "@/shared/db/schema/privacy";
import { sendAll } from "@/shared/integrations/resend";
import { arcoAcuseEmail, arcoOpsEmail } from "@/shared/integrations/arcoEmails";
import {
  ARCO_RIGHTS,
  ARCO_RELATIONS,
  ARCO_RESPONSE_BUSINESS_DAYS,
  addBusinessDays,
  newArcoFolio,
} from "@/data/arco";

export const runtime = "nodejs";

const Schema = z
  .object({
    right: z.enum(ARCO_RIGHTS),
    fullName: z.string().min(2).max(160),
    email: z.string().email().max(200),
    phone: z.string().max(40).optional(),
    relation: z.enum(ARCO_RELATIONS).optional(),
    isRepresentative: z.boolean().default(false),
    titularName: z.string().max(160).optional(),
    description: z.string().min(10).max(4000),
    privacyAccepted: z.literal(true),
    locale: z.enum(["es", "en"]).default("es"),
    honeypot: z.string().max(200).optional(),
  })
  .refine((d) => !d.isRepresentative || (d.titularName && d.titularName.trim().length > 1), {
    message: "titularName is required when acting as representative",
    path: ["titularName"],
  });

/**
 * POST /api/arco — recibe una solicitud de derechos ARCO.
 *
 * Guarda la fila (folio único, plazo de 20 días hábiles), avisa al equipo y
 * manda el acuse al titular. Si la base de datos no responde, la solicitud
 * NO se pierde: el correo al equipo sale igual con todos los datos, y el
 * titular recibe su acuse con folio.
 */
export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = Schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "VALIDATION", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  if (parsed.data.honeypot) {
    return NextResponse.json({ ok: true, accepted: false }, { status: 200 });
  }

  const data = parsed.data;
  const now = new Date();
  const responseDueAt = addBusinessDays(now, ARCO_RESPONSE_BUSINESS_DAYS);

  const base = {
    right: data.right,
    fullName: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim() || null,
    relation: data.relation ?? null,
    isRepresentative: data.isRepresentative,
    titularName: data.isRepresentative ? (data.titularName?.trim() ?? null) : null,
    description: data.description.trim(),
    locale: data.locale,
    status: "nueva",
    receivedAt: now,
    responseDueAt,
    privacyAcceptedAt: now,
  };

  // Dos intentos por si el folio aleatorio choca con uno existente.
  let row: ArcoRequest | null = null;
  for (let attempt = 0; attempt < 2 && !row; attempt++) {
    const folio = newArcoFolio(now);
    try {
      [row] = await db.insert(arcoRequests).values({ ...base, folio }).returning();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/unique|duplicate/i.test(msg) && attempt === 0) continue;
      console.error("[arco] DB insert failed", e);
      break;
    }
  }

  // Sin BD: se arma la solicitud en memoria para que los correos salgan igual.
  const request: ArcoRequest =
    row ?? {
      ...base,
      id: "no-db",
      folio: newArcoFolio(now),
      identityRequestedAt: null,
      identityVerifiedAt: null,
      respondedAt: null,
      resolution: null,
      notes: null,
      createdAt: now,
      updatedAt: now,
    };

  await sendAll([arcoOpsEmail(request), arcoAcuseEmail(request)]);

  return NextResponse.json({
    ok: true,
    folio: request.folio,
    responseDueAt: request.responseDueAt.toISOString(),
    stored: Boolean(row),
  });
}
