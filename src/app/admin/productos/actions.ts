"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { products } from "@/shared/db/schema/products";
import { requireAdmin, str, strOrNull, num, bool } from "@/shared/admin/action";

/** Revalidate every surface that shows product data after a write. */
function revalidateProductSurfaces() {
  revalidatePath("/admin/productos");
  revalidatePath("/es/los-caminos");
  revalidatePath("/en/paths");
  revalidatePath("/es");
  revalidatePath("/en");
}

/** Update the editable fields of a product, identified by its serial id. */
export async function updateProduct(id: number, fd: FormData) {
  await requireAdmin();
  await db
    .update(products)
    .set({
      nameEs: str(fd, "nameEs"),
      nameEn: strOrNull(fd, "nameEn"),
      descriptionEs: str(fd, "descriptionEs"),
      descriptionEn: strOrNull(fd, "descriptionEn"),
      includesEs: strOrNull(fd, "includesEs"),
      includesEn: strOrNull(fd, "includesEn"),
      duration: strOrNull(fd, "duration"),
      modality: strOrNull(fd, "modality"),
      priceMxn: str(fd, "priceMxn"),
      priceUsd: strOrNull(fd, "priceUsd"),
      stripePriceIdMxn: strOrNull(fd, "stripePriceIdMxn"),
      stripePriceIdUsd: strOrNull(fd, "stripePriceIdUsd"),
      active: bool(fd, "active"),
      sortOrder: num(fd, "sortOrder"),
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));
  revalidateProductSurfaces();
  redirect("/admin/productos");
}

/** Inline toggle of a product's active flag (no redirect, just revalidate). */
export async function toggleProductActive(id: number, next: boolean) {
  await requireAdmin();
  await db
    .update(products)
    .set({ active: next, updatedAt: new Date() })
    .where(eq(products.id, id));
  revalidateProductSurfaces();
}
