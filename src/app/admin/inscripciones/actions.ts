"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { inscriptions } from "@/shared/db/schema/operations";
import { requireAdmin, str } from "@/shared/admin/action";

/** Allowed lead statuses (mirrors the inscriptions.status comment in schema). */
const ALLOWED_STATUS = new Set([
  "new",
  "contacted",
  "qualified",
  "converted",
  "archived",
]);

/**
 * Inline status change for a single lead/inscription. Reads `status` from the
 * submitted row form and updates the matching row. This is an inline toggle, so
 * it only revalidates the admin surfaces — no redirect.
 */
export async function updateInscriptionStatus(id: string, fd: FormData) {
  await requireAdmin();
  const status = str(fd, "status");
  if (!ALLOWED_STATUS.has(status)) {
    throw new Error(`Status inválido: ${status}`);
  }
  await db
    .update(inscriptions)
    .set({ status, updatedAt: new Date() })
    .where(eq(inscriptions.id, id));
  revalidatePath("/admin/inscripciones");
  revalidatePath("/admin");
}
