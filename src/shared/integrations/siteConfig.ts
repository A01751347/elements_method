import "server-only";
import { db } from "@/shared/db/client";
import { siteSettings } from "@/shared/db/schema";
import { safeRead } from "@/modules/content/safe";

/**
 * Public tracking configuration surfaced to the browser.
 *
 * Resolution order per field: DB (site_settings, editable in /admin/analytics)
 * → NEXT_PUBLIC_* env var fallback → "". Empty strings mean "not configured"
 * and the pixel loader skips that provider.
 */
export interface TrackingConfig {
  gaMeasurementId: string;
  metaPixelId: string;
  googleAdsId: string;
  googleAdsPurchaseLabel: string;
  linkedinPartnerId: string;
  gtmContainerId: string;
}

const EMPTY: TrackingConfig = {
  gaMeasurementId: "",
  metaPixelId: "",
  googleAdsId: "",
  googleAdsPurchaseLabel: "",
  linkedinPartnerId: "",
  gtmContainerId: "",
};

/** env-var fallbacks (build-time NEXT_PUBLIC_* still work if DB is empty). */
function envFallback(): TrackingConfig {
  return {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
    googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "",
    googleAdsPurchaseLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL ?? "",
    linkedinPartnerId: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID ?? "",
    gtmContainerId: process.env.NEXT_PUBLIC_GTM_CONTAINER_ID ?? "",
  };
}

/** Read the raw settings row (or undefined) — used by the admin form. */
export async function getSiteSettingsRow() {
  return safeRead(undefined, async () => {
    const rows = await db.select().from(siteSettings).limit(1);
    return rows[0];
  });
}

/**
 * Resolve the effective tracking config (DB value, else env var). Safe on an
 * empty/missing table — returns env fallback (or all-empty).
 */
export async function getTrackingConfig(): Promise<TrackingConfig> {
  const env = envFallback();
  const row = await getSiteSettingsRow();
  if (!row) return env;
  const pick = (dbVal: string | null, envVal: string) =>
    dbVal && dbVal.trim().length > 0 ? dbVal.trim() : envVal;
  return {
    gaMeasurementId: pick(row.gaMeasurementId, env.gaMeasurementId),
    metaPixelId: pick(row.metaPixelId, env.metaPixelId),
    googleAdsId: pick(row.googleAdsId, env.googleAdsId),
    googleAdsPurchaseLabel: pick(row.googleAdsPurchaseLabel, env.googleAdsPurchaseLabel),
    linkedinPartnerId: pick(row.linkedinPartnerId, env.linkedinPartnerId),
    gtmContainerId: pick(row.gtmContainerId, env.gtmContainerId),
  };
}

export { EMPTY as EMPTY_TRACKING_CONFIG };
