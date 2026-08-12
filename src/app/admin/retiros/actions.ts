"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { calendarRetreats } from "@/shared/db/schema";
import { requireAdmin, str, num, list } from "@/shared/admin/action";

/** Revalidate every surface that shows retreat data after a write. */
function revalidateRetreatSurfaces(slug?: string) {
  revalidatePath("/admin/retiros");
  revalidatePath("/admin");
  revalidatePath("/admin/calendario");
  revalidatePath("/es/retiros");
  revalidatePath("/en/retreats");
  if (slug) {
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
    placeholderFields: list(fd, "placeholderFields"),
  };
}

/** Create a new calendar retreat. */
export async function createRetreat(fd: FormData) {
  await requireAdmin();
  const v = readForm(fd);
  if (!v.slug || !v.themeEs) {
    throw new Error("Slug y tema (ES) son obligatorios.");
  }
  await db.insert(calendarRetreats).values({
    ...v,
    isPlaceholder: v.placeholderFields.length > 0,
  });
  revalidateRetreatSurfaces(v.slug);
  redirect("/admin/retiros");
}

/** Update an existing calendar retreat, identified by its original slug. */
export async function updateRetreat(originalSlug: string, fd: FormData) {
  await requireAdmin();
  const v = readForm(fd);
  await db
    .update(calendarRetreats)
    .set({
      ...v,
      isPlaceholder: v.placeholderFields.length > 0,
      updatedAt: new Date(),
    })
    .where(eq(calendarRetreats.slug, originalSlug));
  revalidateRetreatSurfaces(v.slug);
  revalidateRetreatSurfaces(originalSlug);
  redirect("/admin/retiros");
}

/** Delete a calendar retreat by slug. */
export async function deleteRetreat(slug: string) {
  await requireAdmin();
  await db.delete(calendarRetreats).where(eq(calendarRetreats.slug, slug));
  revalidateRetreatSurfaces(slug);
  redirect("/admin/retiros");
}
