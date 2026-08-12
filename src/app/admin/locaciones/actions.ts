"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { venues } from "@/shared/db/schema";
import { requireAdmin, str, strOrNull, list } from "@/shared/admin/action";

function revalidateVenueSurfaces() {
  revalidatePath("/admin/locaciones");
  revalidatePath("/admin");
  // Venues surface publicly through retreat detail pages (venue label).
  revalidatePath("/es/retiros");
  revalidatePath("/en/retreats");
}

function readForm(fd: FormData) {
  const placeholderFields = list(fd, "placeholderFields");
  return {
    slug: str(fd, "slug"),
    name: str(fd, "name"),
    city: str(fd, "city"),
    state: str(fd, "state") || "researching",
    capacity: strOrNull(fd, "capacity"),
    notesEs: strOrNull(fd, "notesEs"),
    url: strOrNull(fd, "url"),
    rangeMxn: strOrNull(fd, "rangeMxn"),
    isPlaceholder: placeholderFields.length > 0,
    placeholderFields,
  };
}

export async function createVenue(fd: FormData) {
  await requireAdmin();
  const v = readForm(fd);
  if (!v.slug || !v.name) {
    throw new Error("Slug y nombre son obligatorios.");
  }
  await db.insert(venues).values(v);
  revalidateVenueSurfaces();
  redirect("/admin/locaciones");
}

export async function updateVenue(originalSlug: string, fd: FormData) {
  await requireAdmin();
  const v = readForm(fd);
  await db
    .update(venues)
    .set({ ...v, updatedAt: new Date() })
    .where(eq(venues.slug, originalSlug));
  revalidateVenueSurfaces();
  redirect("/admin/locaciones");
}

export async function deleteVenue(slug: string) {
  await requireAdmin();
  await db.delete(venues).where(eq(venues.slug, slug));
  revalidateVenueSurfaces();
  redirect("/admin/locaciones");
}
