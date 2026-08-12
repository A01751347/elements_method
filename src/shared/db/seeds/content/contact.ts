/**
 * Seed: contact info + social handles.
 *
 * Source: src/data/launchData.ts → `contactInfo` (ContactInfo)
 * Targets:
 *   - contact_info    (singleton — exactly one row, `singleton = true`)
 *   - contact_socials (children — the social handle rows)
 *
 * Idempotent strategy:
 *   - contact_info has a unique `singleton` column, so we upsert with
 *     onConflictDoUpdate on that column (always one row).
 *   - contact_socials has no natural unique key and is not scoped by a
 *     parent id column, so we DELETE all rows then INSERT fresh in array
 *     order (sortOrder = index). Re-running the seed is therefore safe.
 *
 * The query layer (getContactInfo) reads these back into the exact
 * ContactInfo shape, rebuilding `socialHandles` from contact_socials
 * ordered by sortOrder.
 *
 * Note on field mapping:
 *   - static `socialHandles[].name` → column `platform`
 *   - `emailGeneral` is not present in the static source, so we pass null.
 *   - `isPlaceholder` / `placeholderFields` are not persisted (no columns).
 */
import { contactInfo as contactInfoData } from "@/data/launchData";
import { db } from "../../client";
import { contactInfo, contactSocials } from "../../schema";

type NewContactInfo = typeof contactInfo.$inferInsert;
type NewContactSocial = typeof contactSocials.$inferInsert;

export async function seedContact(): Promise<void> {
  // ── Parent singleton row ────────────────────────────────────────────────
  const infoValues: NewContactInfo = {
    singleton: true,
    phoneDisplayMx: contactInfoData.phoneDisplayMx,
    phoneE164: contactInfoData.phoneE164,
    whatsappLink: contactInfoData.whatsappLink,
    emailGeneral: null,
    addressLabelEs: contactInfoData.addressLabelEs,
    addressLabelEn: contactInfoData.addressLabelEn,
  };

  await db
    .insert(contactInfo)
    .values(infoValues)
    .onConflictDoUpdate({
      target: contactInfo.singleton,
      set: {
        phoneDisplayMx: infoValues.phoneDisplayMx ?? null,
        phoneE164: infoValues.phoneE164 ?? null,
        whatsappLink: infoValues.whatsappLink ?? null,
        emailGeneral: infoValues.emailGeneral ?? null,
        addressLabelEs: infoValues.addressLabelEs ?? null,
        addressLabelEn: infoValues.addressLabelEn ?? null,
        updatedAt: new Date(),
      },
    });

  // ── Child social rows ───────────────────────────────────────────────────
  // No natural unique key / no parent id column → delete-all then insert-fresh.
  const socialValues: NewContactSocial[] = contactInfoData.socialHandles.map(
    (social, index) => ({
      platform: social.name,
      handle: social.handle,
      url: social.url,
      sortOrder: index,
    }),
  );

  await db.delete(contactSocials);
  if (socialValues.length > 0) {
    await db.insert(contactSocials).values(socialValues);
  }

  console.log(`  ✓ ${socialValues.length} contact seeded`);
}
