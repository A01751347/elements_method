/**
 * Site-level singleton content + program detail pages + contact info.
 *
 * - siteSections: keyed singleton blocks (home coaching/community/origin,
 *   mantra, hero copy, results/audience/differentiators lists…). Each block is
 *   one row keyed by `key`; bilingual fields cover the common shape and
 *   `items` child table covers repeatable sub-blocks.
 * - programDetails + children: the long /los-caminos/[slug] pages.
 * - contactInfo: a single row (phone, whatsapp, address, socials child table).
 */
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// ────────────────────────────────────────────────────────────────────────────
// SITE SETTINGS — a single row of runtime-editable config (tracking IDs, etc.)
// so the admin can register GA4 / Meta Pixel / Google Ads / LinkedIn / GTM
// without a redeploy. Empty fields fall back to the NEXT_PUBLIC_* env vars.
// ────────────────────────────────────────────────────────────────────────────

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  singleton: boolean("singleton").default(true).notNull().unique(),
  gaMeasurementId: text("ga_measurement_id"), // G-XXXXXXXXXX
  metaPixelId: text("meta_pixel_id"), // Meta / Facebook Pixel (numeric)
  googleAdsId: text("google_ads_id"), // AW-XXXXXXXXX
  googleAdsPurchaseLabel: text("google_ads_purchase_label"), // conversion label for purchases
  linkedinPartnerId: text("linkedin_partner_id"),
  gtmContainerId: text("gtm_container_id"), // GTM-XXXXXXX (optional)
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SiteSettingsRow = typeof siteSettings.$inferSelect;
export type NewSiteSettings = typeof siteSettings.$inferInsert;

// ────────────────────────────────────────────────────────────────────────────
// SITE SECTIONS — keyed singleton blocks
//   key examples: 'home_coaching', 'home_community', 'origin_program',
//   'mantra', 'roots_arc' (via items), 'results', 'audience',
//   'differentiators', 'daily_scan'
// ────────────────────────────────────────────────────────────────────────────

export const siteSections = pgTable("site_sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  eyebrowEs: text("eyebrow_es"),
  eyebrowEn: text("eyebrow_en"),
  headlineEs: text("headline_es"),
  headlineEn: text("headline_en"),
  bodyEs: text("body_es"),
  bodyEn: text("body_en"),
  ctaEs: text("cta_es"),
  ctaEn: text("cta_en"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/** Repeatable sub-items belonging to a site section (coaching items, arc steps,
 *  results bullets, audience bullets, differentiators, daily-scan rows). */
export const siteSectionItems = pgTable("site_section_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  sectionKey: text("section_key")
    .notNull()
    .references(() => siteSections.key, { onDelete: "cascade" }),
  titleEs: text("title_es"),
  titleEn: text("title_en"),
  bodyEs: text("body_es"),
  bodyEn: text("body_en"),
  meta: jsonb("meta"), // free-form extras (elementKey, month, icon…)
  sortOrder: integer("sort_order").default(0).notNull(),
});

// ────────────────────────────────────────────────────────────────────────────
// CONTACT INFO — single row
// Source: launchData.ts → `contactInfo`
// ────────────────────────────────────────────────────────────────────────────

export const contactInfo = pgTable("contact_info", {
  id: uuid("id").primaryKey().defaultRandom(),
  singleton: boolean("singleton").default(true).notNull().unique(),
  phoneDisplayMx: text("phone_display_mx"),
  phoneE164: text("phone_e164"),
  whatsappLink: text("whatsapp_link"),
  emailGeneral: text("email_general"),
  addressLabelEs: text("address_label_es"),
  addressLabelEn: text("address_label_en"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contactSocials = pgTable("contact_socials", {
  id: uuid("id").primaryKey().defaultRandom(),
  platform: text("platform").notNull(),
  handle: text("handle").notNull(),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

// ────────────────────────────────────────────────────────────────────────────
// PROGRAM DETAILS — long /los-caminos/[slug] pages
// Source: content.ts → `programDetails` (ProgramDetail[])
// ────────────────────────────────────────────────────────────────────────────

export const programDetails = pgTable("program_details", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  url: text("url").notNull(),
  headerKickerEs: text("header_kicker_es").notNull(),
  headerKickerEn: text("header_kicker_en").notNull(),
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en").notNull(),
  taglineEs: text("tagline_es").notNull(),
  taglineEn: text("tagline_en").notNull(),
  includesHeadingEs: text("includes_heading_es").notNull(),
  includesHeadingEn: text("includes_heading_en").notNull(),
  whoForHeadingEs: text("who_for_heading_es").notNull(),
  whoForHeadingEn: text("who_for_heading_en").notNull(),
  cadenceHeadingEs: text("cadence_heading_es"),
  cadenceHeadingEn: text("cadence_heading_en"),
  comparativaEs: jsonb("comparativa_es"), // { left: string[], right: string[] } | null
  comparativaEn: jsonb("comparativa_en"),
  closingNoteEs: text("closing_note_es"),
  closingNoteEn: text("closing_note_en"),
  closingTitleEs: text("closing_title_es"),
  closingTitleEn: text("closing_title_en"),
  closingBodyEs: text("closing_body_es"),
  closingBodyEn: text("closing_body_en"),
  ctaEs: text("cta_es").notNull(),
  ctaEn: text("cta_en").notNull(),
  primaryElement: text("primary_element").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const programStats = pgTable("program_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  programId: uuid("program_id")
    .notNull()
    .references(() => programDetails.id, { onDelete: "cascade" }),
  value: text("value").notNull(),
  labelEs: text("label_es").notNull(),
  labelEn: text("label_en").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const programIncludesBlocks = pgTable("program_includes_blocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  programId: uuid("program_id")
    .notNull()
    .references(() => programDetails.id, { onDelete: "cascade" }),
  titleEs: text("title_es").notNull(),
  titleEn: text("title_en").notNull(),
  bodyEs: text("body_es").notNull(),
  bodyEn: text("body_en").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const programWhoForItems = pgTable("program_whofor_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  programId: uuid("program_id")
    .notNull()
    .references(() => programDetails.id, { onDelete: "cascade" }),
  titleEs: text("title_es").notNull(),
  titleEn: text("title_en").notNull(),
  bodyEs: text("body_es").notNull(),
  bodyEn: text("body_en").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const programCadence = pgTable("program_cadence", {
  id: uuid("id").primaryKey().defaultRandom(),
  programId: uuid("program_id")
    .notNull()
    .references(() => programDetails.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  titleEs: text("title_es").notNull(),
  titleEn: text("title_en").notNull(),
  bulletsEs: text("bullets_es").array().notNull(),
  bulletsEn: text("bullets_en").array().notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export type SiteSectionRow = typeof siteSections.$inferSelect;
export type SiteSectionItemRow = typeof siteSectionItems.$inferSelect;
export type ContactInfoRow = typeof contactInfo.$inferSelect;
export type ContactSocialRow = typeof contactSocials.$inferSelect;
export type ProgramDetailRow = typeof programDetails.$inferSelect;
export type ProgramStatRow = typeof programStats.$inferSelect;
export type ProgramIncludesBlockRow = typeof programIncludesBlocks.$inferSelect;
export type ProgramWhoForItemRow = typeof programWhoForItems.$inferSelect;
export type ProgramCadenceRow = typeof programCadence.$inferSelect;
