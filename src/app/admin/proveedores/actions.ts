"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { providers } from "@/shared/db/schema";
import { requireAdmin, str, strOrNull } from "@/shared/admin/action";

function revalidateProviderSurfaces(slug?: string) {
  revalidatePath("/admin/proveedores");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/admin/proveedores/${slug}`);
  revalidatePath("/es/retiros");
  revalidatePath("/en/retreats");
}

function readForm(fd: FormData) {
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
  };
}

export async function createProvider(fd: FormData) {
  await requireAdmin();
  const v = readForm(fd);
  if (!v.slug || !v.disciplineEs) {
    throw new Error("Slug y disciplina (ES) son obligatorios.");
  }
  await db.insert(providers).values({ ...v, isPlaceholder: false, placeholderFields: [] });
  revalidateProviderSurfaces(v.slug);
  redirect("/admin/proveedores");
}

export async function updateProvider(originalSlug: string, fd: FormData) {
  await requireAdmin();
  const v = readForm(fd);
  if (!v.slug || !v.disciplineEs) {
    throw new Error("Slug y disciplina (ES) son obligatorios.");
  }
  await db
    .update(providers)
    .set({ ...v, isPlaceholder: false, placeholderFields: [], updatedAt: new Date() })
    .where(eq(providers.slug, originalSlug));
  revalidateProviderSurfaces(v.slug);
  if (v.slug !== originalSlug) revalidateProviderSurfaces(originalSlug);
  redirect(`/admin/proveedores/${v.slug}`);
}

/** Receives FormData (hidden `slug`) so it can be used from ConfirmarAccion. */
export async function deleteProvider(fd: FormData) {
  await requireAdmin();
  const slug = str(fd, "slug");
  await db.delete(providers).where(eq(providers.slug, slug));
  revalidateProviderSurfaces(slug);
  redirect("/admin/proveedores");
}
