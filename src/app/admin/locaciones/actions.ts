"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { venues } from "@/shared/db/schema";
import { requireAdmin, str, strOrNull } from "@/shared/admin/action";

function revalidateVenueSurfaces(slug?: string) {
  revalidatePath("/admin/locaciones");
  revalidatePath("/admin");
  if (slug) revalidatePath(`/admin/locaciones/${slug}`);
  // Venues surface publicly through retreat detail pages (venue label).
  revalidatePath("/es/retiros");
  revalidatePath("/en/retreats");
}

function readForm(fd: FormData) {
  return {
    slug: str(fd, "slug"),
    name: str(fd, "name"),
    city: str(fd, "city"),
    state: str(fd, "state") || "researching",
    capacity: strOrNull(fd, "capacity"),
    notesEs: strOrNull(fd, "notesEs"),
    url: strOrNull(fd, "url"),
    rangeMxn: strOrNull(fd, "rangeMxn"),
  };
}

export async function createVenue(fd: FormData) {
  await requireAdmin();
  const v = readForm(fd);
  if (!v.slug || !v.name) {
    throw new Error("Slug y nombre son obligatorios.");
  }
  await db.insert(venues).values({ ...v, isPlaceholder: false, placeholderFields: [] });
  revalidateVenueSurfaces(v.slug);
  redirect("/admin/locaciones");
}

export async function updateVenue(originalSlug: string, fd: FormData) {
  await requireAdmin();
  const v = readForm(fd);
  if (!v.slug || !v.name) {
    throw new Error("Slug y nombre son obligatorios.");
  }
  await db
    .update(venues)
    .set({ ...v, isPlaceholder: false, placeholderFields: [], updatedAt: new Date() })
    .where(eq(venues.slug, originalSlug));
  revalidateVenueSurfaces(v.slug);
  if (v.slug !== originalSlug) revalidateVenueSurfaces(originalSlug);
  redirect(`/admin/locaciones/${v.slug}`);
}

/** Receives FormData (hidden `slug`) so it can be used from ConfirmarAccion. */
export async function deleteVenue(fd: FormData) {
  await requireAdmin();
  const slug = str(fd, "slug");
  await db.delete(venues).where(eq(venues.slug, slug));
  revalidateVenueSurfaces(slug);
  redirect("/admin/locaciones");
}
