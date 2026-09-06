"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { inscriptions } from "@/shared/db/schema/operations";
import { requireAdmin, str, strOrNull } from "@/shared/admin/action";

const ALLOWED_STATUS = new Set(["new", "contacted", "qualified", "converted", "archived"]);

function revalidateInscriptionSurfaces(id?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/inscripciones");
  if (id) revalidatePath(`/admin/inscripciones/${id}`);
}

/** Update status + internal notes from the ficha's "Seguimiento" form. */
export async function actualizarSeguimiento(id: string, fd: FormData) {
  await requireAdmin();
  const status = str(fd, "status");
  if (!ALLOWED_STATUS.has(status)) {
    throw new Error(`Estado inválido: ${status}`);
  }
  const notes = strOrNull(fd, "notes");
  await db
    .update(inscriptions)
    .set({ status, notes, updatedAt: new Date() })
    .where(eq(inscriptions.id, id));
  revalidateInscriptionSurfaces(id);
}

/** Archive a lead. Receives FormData (hidden `id`) for ConfirmarAccion. */
export async function archivar(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await db
    .update(inscriptions)
    .set({ status: "archived", updatedAt: new Date() })
    .where(eq(inscriptions.id, id));
  revalidateInscriptionSurfaces(id);
}
