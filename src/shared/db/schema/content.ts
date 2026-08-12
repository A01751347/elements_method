/**
 * Editorial content schema — fully normalized.
 *
 * These tables move every piece of marketing/editorial copy that used to live
 * ONLY in `src/data/content.ts` into the database, so the admin panel can edit
 * it and the public site can read it. One table per content type; nested
 * structures become child tables with foreign keys.
 *
 * Design rules:
 *  - Every public-facing free-text field is bilingual (`*Es` / `*En`).
 *  - `element` values use free `text` (not the pg enum) because editorial
 *    content includes the fifth element `eter`, and admins may reorder.
 *  - `sortOrder` on every collection so the admin controls display order.
 *  - Child rows cascade-delete with their parent.
 */
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// ────────────────────────────────────────────────────────────────────────────
// ELEMENTS — the 5 elements (Tierra, Fuego, Agua, Aire, Éter)
// Source: content.ts → `elements` (ElementInfo[])
// ────────────────────────────────────────────────────────────────────────────

export const elementsContent = pgTable("elements_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(), // agua | fuego | aire | tierra | eter
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en").notNull(),
  framework: text("framework"), // ROOTS / IGNITE / FLOW / CLEAR (null for eter)
  qualityEs: text("quality_es").notNull(),
  qualityEn: text("quality_en").notNull(),
  cultivaEs: text("cultiva_es").notNull(),
  cultivaEn: text("cultiva_en").notNull(),
  quoteEs: text("quote_es").notNull(),
  quoteEn: text("quote_en").notNull(),
  natureEs: text("nature_es").notNull(),
  natureEn: text("nature_en").notNull(),
  methodEs: text("method_es").notNull(),
  methodEn: text("method_en").notNull(),
  bodyEs: text("body_es").notNull(),
  bodyEn: text("body_en").notNull(),
  experienceEs: text("experience_es").notNull(),
  experienceEn: text("experience_en").notNull(),
  paradoxEs: text("paradox_es"),
  paradoxEn: text("paradox_en"),
  invitationEs: text("invitation_es"),
  invitationEn: text("invitation_en"),
  accent: text("accent").notNull(),
  accentSoft: text("accent_soft").notNull(),
  accentInk: text("accent_ink").notNull(),
  animClass: text("anim_class").notNull(),
  imageUrl: text("image_url"),
  frameworkImageUrl: text("framework_image_url"),
  sortOrder: integer("sort_order").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/** "Key Components of X Leadership" — 4 named components per element. */
export const elementComponents = pgTable("element_components", {
  id: uuid("id").primaryKey().defaultRandom(),
  elementId: uuid("element_id")
    .notNull()
    .references(() => elementsContent.id, { onDelete: "cascade" }),
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en").notNull(),
  bodyEs: text("body_es").notNull(),
  bodyEn: text("body_en").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

// ────────────────────────────────────────────────────────────────────────────
// PATHS — the 3 caminos preview cards (Fluir / Momentum / Raíz…)
// Source: content.ts → `paths` (PathInfo[])
// ────────────────────────────────────────────────────────────────────────────

export const pathsContent = pgTable("paths_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en").notNull(),
  tagEs: text("tag_es").notNull(),
  tagEn: text("tag_en").notNull(),
  headlineEs: text("headline_es").notNull(),
  headlineEn: text("headline_en").notNull(),
  shortEs: text("short_es").notNull(),
  shortEn: text("short_en").notNull(),
  longEs: text("long_es").notNull(),
  longEn: text("long_en").notNull(),
  includesEs: text("includes_es").array().notNull(),
  includesEn: text("includes_en").array().notNull(),
  modalityEs: text("modality_es").notNull(),
  modalityEn: text("modality_en").notNull(),
  durationEs: text("duration_es").notNull(),
  durationEn: text("duration_en").notNull(),
  capacityEs: text("capacity_es").notNull(),
  capacityEn: text("capacity_en").notNull(),
  ctaEs: text("cta_es").notNull(),
  ctaEn: text("cta_en").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ────────────────────────────────────────────────────────────────────────────
// STATS — evidence band (scientific statistics)
// Source: content.ts → `stats` (StatInfo[])
// ────────────────────────────────────────────────────────────────────────────

export const statsContent = pgTable("stats_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  metricEs: text("metric_es").notNull(),
  metricEn: text("metric_en").notNull(),
  labelEs: text("label_es").notNull(),
  labelEn: text("label_en").notNull(),
  source: text("source").notNull(),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ────────────────────────────────────────────────────────────────────────────
// PRACTICES — the exercises gallery (3 per element)
// Source: content.ts → `practices` (PracticeInfo[])
// ────────────────────────────────────────────────────────────────────────────

export const practicesContent = pgTable("practices_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  iconName: text("icon_name").notNull(),
  titleEs: text("title_es").notNull(),
  titleEn: text("title_en").notNull(),
  bodyEs: text("body_es").notNull(),
  bodyEn: text("body_en").notNull(),
  durationEs: text("duration_es").notNull(),
  durationEn: text("duration_en").notNull(),
  element: text("element").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ────────────────────────────────────────────────────────────────────────────
// FAQS
// Source: content.ts → `faqs`
// ────────────────────────────────────────────────────────────────────────────

export const faqsContent = pgTable("faqs_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  questionEs: text("question_es").notNull(),
  questionEn: text("question_en").notNull(),
  answerEs: text("answer_es").notNull(),
  answerEn: text("answer_en").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ────────────────────────────────────────────────────────────────────────────
// PROCESS STEPS — the Disconnection Protocol
// Source: content.ts → `processSteps` (ProcessStep[])
// ────────────────────────────────────────────────────────────────────────────

export const processStepsContent = pgTable("process_steps_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  n: text("n").notNull(),
  titleEs: text("title_es").notNull(),
  titleEn: text("title_en").notNull(),
  durationEs: text("duration_es").notNull(),
  durationEn: text("duration_en").notNull(),
  bodyEs: text("body_es").notNull(),
  bodyEn: text("body_en").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ────────────────────────────────────────────────────────────────────────────
// MODALITY AXES — methodology axes (Coaching/PNL, etc.)
// Source: content.ts → `modalityAxes` (ModalityAxis[])
// ────────────────────────────────────────────────────────────────────────────

export const modalityAxesContent = pgTable("modality_axes_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en").notNull(),
  taglineEs: text("tagline_es").notNull(),
  taglineEn: text("tagline_en").notNull(),
  bodyEs: text("body_es").notNull(),
  bodyEn: text("body_en").notNull(),
  modalitiesEs: text("modalities_es").array().notNull(),
  modalitiesEn: text("modalities_en").array().notNull(),
  primaryElement: text("primary_element").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ────────────────────────────────────────────────────────────────────────────
// IMPACT CIRCLES
// Source: content.ts → `impactCircles` (ImpactCircleInfo[])
// ────────────────────────────────────────────────────────────────────────────

export const impactCirclesContent = pgTable("impact_circles_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  level: text("level").notNull(),
  whoEs: text("who_es").notNull(),
  whoEn: text("who_en").notNull(),
  titleEs: text("title_es").notNull(),
  titleEn: text("title_en").notNull(),
  bodyEs: text("body_es").notNull(),
  bodyEn: text("body_en").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ────────────────────────────────────────────────────────────────────────────
// SHADOW PROFILE — elemental shadow table
// Source: content.ts → `shadowProfile` (ShadowProfileRow[])
// ────────────────────────────────────────────────────────────────────────────

export const shadowProfileContent = pgTable("shadow_profile_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  element: text("element").notNull(),
  bestEs: text("best_es").notNull(),
  bestEn: text("best_en").notNull(),
  stressEs: text("stress_es").notNull(),
  stressEn: text("stress_en").notNull(),
  giftEs: text("gift_es").notNull(),
  giftEn: text("gift_en").notNull(),
  shadowEs: text("shadow_es").notNull(),
  shadowEn: text("shadow_en").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ────────────────────────────────────────────────────────────────────────────
// FOUNDERS — Ana Michelle, Andrés
// Source: content.ts → `founders` (FounderInfo[])
// ────────────────────────────────────────────────────────────────────────────

export const foundersContent = pgTable("founders_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  roleEs: text("role_es").notNull(),
  roleEn: text("role_en").notNull(),
  locationEs: text("location_es").notNull(),
  locationEn: text("location_en").notNull(),
  imageUrl: text("image_url"),
  bioEs: text("bio_es").notNull(),
  bioEn: text("bio_en").notNull(),
  quoteEs: text("quote_es").notNull(),
  quoteEn: text("quote_en").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const founderSocials = pgTable("founder_socials", {
  id: uuid("id").primaryKey().defaultRandom(),
  founderId: uuid("founder_id")
    .notNull()
    .references(() => foundersContent.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(),
  handle: text("handle").notNull(),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

// ────────────────────────────────────────────────────────────────────────────
// LEXICON — nature lexicon terms (bilingual, keyed by language)
// Source: content.ts → `lexiconEs` / `lexiconEn`
// ────────────────────────────────────────────────────────────────────────────

export const lexiconContent = pgTable("lexicon_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  termEs: text("term_es").notNull(),
  termEn: text("term_en").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ElementContentRow = typeof elementsContent.$inferSelect;
export type ElementComponentRow = typeof elementComponents.$inferSelect;
export type PathContentRow = typeof pathsContent.$inferSelect;
export type StatContentRow = typeof statsContent.$inferSelect;
export type PracticeContentRow = typeof practicesContent.$inferSelect;
export type FaqContentRow = typeof faqsContent.$inferSelect;
export type ProcessStepContentRow = typeof processStepsContent.$inferSelect;
export type ModalityAxisContentRow = typeof modalityAxesContent.$inferSelect;
export type ImpactCircleContentRow = typeof impactCirclesContent.$inferSelect;
export type ShadowProfileContentRow = typeof shadowProfileContent.$inferSelect;
export type FounderContentRow = typeof foundersContent.$inferSelect;
export type FounderSocialRow = typeof founderSocials.$inferSelect;
export type LexiconContentRow = typeof lexiconContent.$inferSelect;
