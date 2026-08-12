"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { siteSettings } from "@/shared/db/schema";
import { requireAdmin, strOrNull } from "@/shared/admin/action";

/**
 * Save the tracking IDs. Upserts the single site_settings row. Revalidates the
 * whole public site so the new pixels load on the next visit (the IDs are read
 * server-side in the locale layout).
 */
export async function saveTrackingSettings(fd: FormData) {
  await requireAdmin();

  const values = {
    gaMeasurementId: strOrNull(fd, "gaMeasurementId"),
    metaPixelId: strOrNull(fd, "metaPixelId"),
    googleAdsId: strOrNull(fd, "googleAdsId"),
    googleAdsPurchaseLabel: strOrNull(fd, "googleAdsPurchaseLabel"),
    linkedinPartnerId: strOrNull(fd, "linkedinPartnerId"),
    gtmContainerId: strOrNull(fd, "gtmContainerId"),
    updatedAt: new Date(),
  };

  const existing = await db
    .select({ id: siteSettings.id })
    .from(siteSettings)
    .limit(1);

  if (existing[0]) {
    await db
      .update(siteSettings)
      .set(values)
      .where(eq(siteSettings.id, existing[0].id));
  } else {
    await db.insert(siteSettings).values({ singleton: true, ...values });
  }

  // The pixel config is read in the [locale] layout, so revalidate the site.
  revalidatePath("/", "layout");
  revalidatePath("/admin/analytics");
}
