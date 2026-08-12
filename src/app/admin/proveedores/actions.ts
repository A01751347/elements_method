"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { providers } from "@/shared/db/schema";
import { requireAdmin, str, strOrNull, list } from "@/shared/admin/action";

function revalidateProviderSurfaces() {
  revalidatePath("/admin/proveedores");
  revalidatePath("/admin");
  revalidatePath("/es/retiros");
  revalidatePath("/en/retreats");
}

function readForm(fd: FormData) {
  const placeholderFields = list(fd, "placeholderFields");
  return {
    slug: str(fd, "slug"),
    disciplineEs: str(fd, "disciplineEs"),
    disciplineEn: str(fd, "disciplineEn"),
    elementAffinity: str(fd, "elementAffinity") || "tierra",
    descriptionEs: strOrNull(fd, "descriptionEs"),
    descriptionEn: strOrNull(fd, "descriptionEn"),
    providerName: strOrNull(fd, "providerName"),
    providerContact: strOrNull(fd, "providerContact"),
    status: str(fd, "status") || "researching",
    notesEs: strOrNull(fd, "notesEs"),
    notesEn: strOrNull(fd, "notesEn"),
    isPlaceholder: placeholderFields.length > 0,
    placeholderFields,
  };
}

export async function createProvider(fd: FormData) {
  await requireAdmin();
  const v = readForm(fd);
  if (!v.slug || !v.disciplineEs) {
    throw new Error("Slug y disciplina (ES) son obligatorios.");
  }
  await db.insert(providers).values(v);
  revalidateProviderSurfaces();
  redirect("/admin/proveedores");
}

export async function updateProvider(originalSlug: string, fd: FormData) {
  await requireAdmin();
  const v = readForm(fd);
  await db
    .update(providers)
    .set({ ...v, updatedAt: new Date() })
    .where(eq(providers.slug, originalSlug));
  revalidateProviderSurfaces();
  redirect("/admin/proveedores");
}

export async function deleteProvider(slug: string) {
  await requireAdmin();
  await db.delete(providers).where(eq(providers.slug, slug));
  revalidateProviderSurfaces();
  redirect("/admin/proveedores");
}
