"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { arcoRequests } from "@/shared/db/schema/privacy";
import { requireAdmin, str, strOrNull } from "@/shared/admin/action";
import { sendMail } from "@/shared/integrations/resend";
import {
  arcoIdentityRequestEmail,
  arcoResolutionEmail,
} from "@/shared/integrations/arcoEmails";
import {
  ARCO_STATUSES,
  ARCO_EXECUTION_BUSINESS_DAYS,
  addBusinessDays,
} from "@/data/arco";

const ALLOWED_STATUS = new Set<string>(ARCO_STATUSES);

function revalidar(id?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/arco");
  if (id) revalidatePath(`/admin/arco/${id}`);
}

async function cargar(id: string) {
  const rows = await db.select().from(arcoRequests).where(eq(arcoRequests.id, id)).limit(1);
  const r = rows[0];
  if (!r) throw new Error("Solicitud no encontrada.");
  return r;
}

/** Estado + notas internas desde el bloque «Seguimiento» de la ficha. */
export async function actualizarSeguimiento(id: string, fd: FormData) {
  await requireAdmin();
  const status = str(fd, "status");
  if (!ALLOWED_STATUS.has(status)) throw new Error(`Estado inválido: ${status}`);
  await db
    .update(arcoRequests)
    .set({ status, notes: strOrNull(fd, "notes"), updatedAt: new Date() })
    .where(eq(arcoRequests.id, id));
  revalidar(id);
}

/**
 * Requerimiento formal de identificación al titular. Manda el correo y deja
 * la solicitud en «identidad pendiente»; el plazo legal queda suspendido
 * hasta que el titular responda (10 días hábiles).
 */
export async function solicitarIdentificacion(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const r = await cargar(id);
  const res = await sendMail(arcoIdentityRequestEmail(r));
  if (!res.ok) throw new Error(`No se pudo enviar el correo: ${res.error ?? "error desconocido"}`);
  await db
    .update(arcoRequests)
    .set({ status: "identidad_pendiente", identityRequestedAt: new Date(), updatedAt: new Date() })
    .where(eq(arcoRequests.id, id));
  revalidar(id);
}

/** El titular ya acreditó su identidad: la solicitud pasa a «en proceso». */
export async function marcarIdentidadVerificada(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const r = await cargar(id);
  const sigueAbierta = r.status === "nueva" || r.status === "identidad_pendiente";
  await db
    .update(arcoRequests)
    .set({
      identityVerifiedAt: new Date(),
      status: sigueAbierta ? "en_proceso" : r.status,
      updatedAt: new Date(),
    })
    .where(eq(arcoRequests.id, id));
  revalidar(id);
}

/**
 * Respuesta formal al titular (procedente o improcedente). Se envía por
 * correo y cierra la solicitud; si el correo falla, no se cambia nada.
 */
export async function responderTitular(id: string, fd: FormData) {
  await requireAdmin();
  const sentido = str(fd, "sentido");
  if (sentido !== "resuelta" && sentido !== "rechazada") {
    throw new Error("Indica si la solicitud es procedente o improcedente.");
  }
  const resolution = str(fd, "resolution");
  if (resolution.length < 10) throw new Error("Escribe la respuesta que recibirá el titular.");

  const r = await cargar(id);
  const now = new Date();
  const executionDueAt =
    sentido === "resuelta" ? addBusinessDays(now, ARCO_EXECUTION_BUSINESS_DAYS) : null;

  const res = await sendMail(arcoResolutionEmail(r, resolution, sentido, executionDueAt));
  if (!res.ok) throw new Error(`No se pudo enviar el correo: ${res.error ?? "error desconocido"}`);

  await db
    .update(arcoRequests)
    .set({ status: sentido, resolution, respondedAt: now, updatedAt: now })
    .where(eq(arcoRequests.id, id));
  revalidar(id);
}
