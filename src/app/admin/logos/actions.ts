"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { clientLogos } from "@/shared/db/schema/testimonials";
import { requireAdmin, str, strOrNull, bool } from "@/shared/admin/action";

/** Revalidate every surface that shows client-logo data after a write. */
function revalidateLogoSurfaces() {
  revalidatePath("/admin/logos");
  revalidatePath("/es");
  revalidatePath("/en");
}

/** Create a new client logo. */
export async function createLogo(fd: FormData) {
  await requireAdmin();
  const companyName = str(fd, "companyName");
  const logoUrl = str(fd, "logoUrl");
  if (!companyName || !logoUrl) {
    throw new Error("Empresa y URL del logo son obligatorios.");
  }
  await db.insert(clientLogos).values({
    companyName,
    logoUrl,
    websiteUrl: strOrNull(fd, "websiteUrl"),
    active: bool(fd, "active"),
  });
  revalidateLogoSurfaces();
  redirect("/admin/logos");
}

/** Delete a client logo by id. */
export async function deleteLogo(id: string) {
  await requireAdmin();
  await db.delete(clientLogos).where(eq(clientLogos.id, id));
  revalidateLogoSurfaces();
  redirect("/admin/logos");
}

/** Toggle a client logo's active flag inline (no redirect). */
export async function toggleLogoActive(id: string, next: boolean) {
  await requireAdmin();
  await db.update(clientLogos).set({ active: next }).where(eq(clientLogos.id, id));
  revalidateLogoSurfaces();
}
