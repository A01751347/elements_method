"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { products } from "@/shared/db/schema/products";
import { requireAdmin, str, strOrNull, num, bool } from "@/shared/admin/action";

/** Revalidate every surface that shows product data after a write. */
function revalidateProductSurfaces(slug?: string) {
  revalidatePath("/admin/productos");
  revalidatePath("/es/los-caminos");
  revalidatePath("/en/paths");
  revalidatePath("/es");
  revalidatePath("/en");
  if (slug) {
    revalidatePath(`/es/retiros/${slug}`);
    revalidatePath(`/en/retreats/${slug}`);
  }
}

/**
 * Parse a `datetime-local` value ("2026-09-06T10:00") as America/Mexico_City
 * wall time. Mexico abolished seasonal DST, so the offset is a fixed -06:00.
 */
function parseMexicoDeadline(value: string): Date | null {
  if (!value) return null;
  const d = new Date(`${value}:00-06:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Update the editable fields of a product, identified by its serial id. */
export async function updateProduct(id: number, fd: FormData) {
  await requireAdmin();

  const [existing] = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  if (!existing) throw new Error("Producto no encontrado.");

  const priceMxnRaw = str(fd, "priceMxn");
  const priceMxn = Number(priceMxnRaw);
  if (!Number.isFinite(priceMxn) || priceMxn < 0) {
    throw new Error("El precio en MXN debe ser un número mayor o igual a 0.");
  }

  const earlyPriceRaw = strOrNull(fd, "earlyPriceMxn");
  const earlyPriceNum = earlyPriceRaw !== null ? Number(earlyPriceRaw) : null;
  if (earlyPriceNum !== null && (!Number.isFinite(earlyPriceNum) || earlyPriceNum < 0)) {
    throw new Error("El precio de early access debe ser un número mayor o igual a 0.");
  }
  if (earlyPriceNum !== null && earlyPriceNum >= priceMxn) {
    throw new Error("El precio de early access debe ser menor al precio normal.");
  }

  const earlyDeadline = parseMexicoDeadline(str(fd, "earlyDeadline"));

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
      coverImageUrl: strOrNull(fd, "coverImageUrl"),
      priceMxn: priceMxnRaw,
      priceUsd: strOrNull(fd, "priceUsd"),
      earlyPriceMxn: earlyPriceRaw,
      earlyDeadline,
      stripePriceIdMxn: strOrNull(fd, "stripePriceIdMxn"),
      stripePriceIdUsd: strOrNull(fd, "stripePriceIdUsd"),
      active: bool(fd, "active"),
      sortOrder: num(fd, "sortOrder"),
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  revalidateProductSurfaces(existing.slug);
  revalidatePath(`/admin/productos/${id}`);
  redirect(`/admin/productos/${id}`);
}

/** Inline toggle of a product's active flag, driven by a ConfirmarAccion form. */
export async function alternarActivo(fd: FormData) {
  await requireAdmin();
  const id = num(fd, "id");
  const next = str(fd, "next") === "true";

  const [existing] = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  await db.update(products).set({ active: next, updatedAt: new Date() }).where(eq(products.id, id));
  revalidateProductSurfaces(existing?.slug);
  revalidatePath(`/admin/productos/${id}`);
}
