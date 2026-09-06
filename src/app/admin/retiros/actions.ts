"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, ne, and } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { calendarRetreats } from "@/shared/db/schema";
import { requireAdmin, str, num } from "@/shared/admin/action";

/** Revalidate every surface that shows retreat data after a write. */
function revalidateRetreatSurfaces(slug?: string) {
  revalidatePath("/admin/retiros");
  revalidatePath("/admin");
  revalidatePath("/es/retiros");
  revalidatePath("/en/retreats");
  if (slug) {
    revalidatePath(`/admin/retiros/${slug}`);
    revalidatePath(`/es/retiros/${slug}`);
    revalidatePath(`/en/retreats/${slug}`);
  }
}

/** Read the retreat fields out of a submitted admin form. */
function readForm(fd: FormData) {
  return {
    slug: str(fd, "slug"),
    orderIdx: num(fd, "orderIdx"),
    themeEs: str(fd, "themeEs"),
    themeEn: str(fd, "themeEn"),
    elementKey: str(fd, "elementKey") || "tierra",
    startDate: str(fd, "startDate"),
    endDate: str(fd, "endDate"),
    dateLabelEs: str(fd, "dateLabelEs"),
    dateLabelEn: str(fd, "dateLabelEn"),
    venueState: str(fd, "venueState") || "tbd",
    venueLabelEs: str(fd, "venueLabelEs"),
    venueLabelEn: str(fd, "venueLabelEn"),
    venueNote: str(fd, "venueNote"),
    summaryEs: str(fd, "summaryEs"),
    summaryEn: str(fd, "summaryEn"),
    status: str(fd, "status") || "open",
    capacity: num(fd, "capacity"),
    seatsLeft: num(fd, "seatsLeft"),
    investmentLabelEs: str(fd, "investmentLabelEs"),
    investmentLabelEn: str(fd, "investmentLabelEn"),
  };
}

type RetreatFormValues = ReturnType<typeof readForm>;

/** Shared validation for create and update. Throws with a clear message. */
async function validate(v: RetreatFormValues, excludeSlug?: string) {
  if (!v.slug || !v.themeEs) {
    throw new Error("El slug y el tema (ES) son obligatorios.");
  }
  if (v.startDate && v.endDate && v.startDate > v.endDate) {
    throw new Error("La fecha de inicio no puede ser posterior a la fecha de fin.");
  }
  if (v.seatsLeft > v.capacity) {
    throw new Error("Los lugares disponibles no pueden ser más que el cupo total.");
  }
  const existing = await db
    .select({ slug: calendarRetreats.slug })
    .from(calendarRetreats)
    .where(
      excludeSlug
        ? and(eq(calendarRetreats.slug, v.slug), ne(calendarRetreats.slug, excludeSlug))
        : eq(calendarRetreats.slug, v.slug),
    )
    .limit(1);
  if (existing.length > 0) {
    throw new Error(`Ya existe un retiro con el slug «${v.slug}».`);
  }
}

/** Create a new calendar retreat. */
export async function createRetreat(fd: FormData) {
  await requireAdmin();
  const v = readForm(fd);
  await validate(v);
  await db.insert(calendarRetreats).values({
    ...v,
    isPlaceholder: false,
    placeholderFields: [],
  });
  revalidateRetreatSurfaces(v.slug);
  redirect("/admin/retiros");
}

/** Update an existing calendar retreat, identified by its original slug. */
export async function updateRetreat(originalSlug: string, fd: FormData) {
  await requireAdmin();
  const v = readForm(fd);
  await validate(v, originalSlug);
  await db
    .update(calendarRetreats)
    .set({
      ...v,
      isPlaceholder: false,
      placeholderFields: [],
      updatedAt: new Date(),
    })
    .where(eq(calendarRetreats.slug, originalSlug));
  revalidateRetreatSurfaces(v.slug);
  if (v.slug !== originalSlug) revalidateRetreatSurfaces(originalSlug);
  redirect(`/admin/retiros/${v.slug}`);
}

/** Delete a calendar retreat. Receives FormData (hidden `slug`) so it can be
 * used directly as the action of a ConfirmarAccion modal. */
export async function deleteRetreat(fd: FormData) {
  await requireAdmin();
  const slug = str(fd, "slug");
  await db.delete(calendarRetreats).where(eq(calendarRetreats.slug, slug));
  revalidateRetreatSurfaces(slug);
  redirect("/admin/retiros");
}
