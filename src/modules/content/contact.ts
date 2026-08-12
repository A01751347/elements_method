import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { contactInfo, contactSocials } from "@/shared/db/schema";
import type { ContactInfo } from "@/data/launchData";
import { safeRead } from "./safe";

/**
 * Read query: contact info + social handles.
 *
 * Source tables:
 *   - contact_info    (contactInfo)    — singleton row (phone, whatsapp, address)
 *   - contact_socials (contactSocials) — flat global child table of social links
 *
 * Returns: the exact `ContactInfo` shape from `@/data/launchData`, with
 * `socialHandles` rebuilt from contact_socials ordered by sortOrder (which the
 * seed set to array index, so display order is preserved). Column `platform`
 * maps back to the static `name` field; `handle`/`url` map 1:1.
 *
 * Drop-in replacement for the static `contactInfo` export: any page/component
 * can do `const contact = await getContactInfo()` and read
 * `.phoneDisplayMx / .phoneE164 / .whatsappLink / .addressLabelEs /
 * .addressLabelEn / .socialHandles[]` unchanged. Consumers today live in
 * Footer.tsx, FinalCta.tsx, contacto/gracias/agendar/aplicar/legal/retiros pages.
 *
 * Fields not persisted in the DB (no columns exist for them) are reconstructed
 * to keep the canonical type intact:
 *   - `isPlaceholder`      → always false (DB values are the real, edited data).
 *   - `placeholderFields`  → always [] for the same reason.
 * The nullable text columns (phoneDisplayMx, phoneE164, whatsappLink,
 * addressLabelEs/En) are coalesced to "" so the return type matches the
 * non-null string fields of `ContactInfo`.
 *
 * Empty-DB handling: if no singleton row exists, returns `null` (never throws).
 * A caller can fall back to the static export or render nothing.
 */
export async function getContactInfo(): Promise<ContactInfo | null> {
  return safeRead(null, async () => {
    const [infoRows, socialRows] = await Promise.all([
      db.select().from(contactInfo).limit(1),
      db.select().from(contactSocials).orderBy(asc(contactSocials.sortOrder)),
    ]);

    const info = infoRows[0];
    if (!info) return null;

    return {
      phoneDisplayMx: info.phoneDisplayMx ?? "",
      phoneE164: info.phoneE164 ?? "",
      whatsappLink: info.whatsappLink ?? "",
      addressLabelEs: info.addressLabelEs ?? "",
      addressLabelEn: info.addressLabelEn ?? "",
      socialHandles: socialRows.map((s) => ({
        name: s.platform,
        handle: s.handle,
        url: s.url,
      })),
      isPlaceholder: false,
      placeholderFields: [],
    };
  });
}
