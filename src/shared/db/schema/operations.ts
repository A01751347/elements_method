/**
 * Operational schema — entities that the operations team manages
 * through the admin panel for the 7-day launch:
 *
 *  - venues:          candidate locations (Tepoztlán, Valle de Bravo, etc.)
 *  - providers:       discipline facilitators (yoga, breathwork, caballos, etc.)
 *  - inscriptions:    leads coming from public Contact + Apply forms
 *
 * All free-text fields are bilingual where they surface on the public site.
 */
import {
  boolean,
  decimal,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// ────────────────────────────────────────────────────────────────────────────
// CALENDAR RETREATS — the public /retiros calendar (2026-2027).
// Mirrors the CalendarRetreat shape (src/data/launchData.ts) 1:1 so the admin
// edits map directly to columns and reflect on the public calendar.
// Separate from `retreats` (which holds the commerce/orders relationship).
// ────────────────────────────────────────────────────────────────────────────

export const calendarRetreats = pgTable("calendar_retreats", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  orderIdx: integer("order_idx").default(0).notNull(),
  themeEs: text("theme_es").notNull(),
  themeEn: text("theme_en").notNull(),
  elementKey: text("element_key").notNull(),
  startDate: text("start_date").notNull(), // ISO YYYY-MM-DD (display calendar)
  endDate: text("end_date").notNull(),
  dateLabelEs: text("date_label_es").notNull(),
  dateLabelEn: text("date_label_en").notNull(),
  venueState: text("venue_state").notNull(), // confirmed | tentative | tbd
  venueLabelEs: text("venue_label_es").notNull(),
  venueLabelEn: text("venue_label_en").notNull(),
  venueNote: text("venue_note").notNull().default(""),
  summaryEs: text("summary_es").notNull(),
  summaryEn: text("summary_en").notNull(),
  status: text("status").notNull(), // open | waitlist | closed | sold
  capacity: integer("capacity").notNull(),
  seatsLeft: integer("seats_left").notNull(),
  investmentLabelEs: text("investment_label_es").notNull().default(""),
  investmentLabelEn: text("investment_label_en").notNull().default(""),
  isPlaceholder: boolean("is_placeholder").default(false).notNull(),
  placeholderFields: text("placeholder_fields").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type CalendarRetreatRow = typeof calendarRetreats.$inferSelect;
export type NewCalendarRetreat = typeof calendarRetreats.$inferInsert;

// ────────────────────────────────────────────────────────────────────────────
// VENUES — candidate locations
// ────────────────────────────────────────────────────────────────────────────

export const venues = pgTable("venues", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(), // confirmed | cotizacion-en-proceso | sin-respuesta | researching | available-2027
  capacity: text("capacity"),
  notesEs: text("notes_es"),
  url: text("url"),
  rangeMxn: text("range_mxn"),
  active: boolean("active").default(true).notNull(),
  isPlaceholder: boolean("is_placeholder").default(false).notNull(),
  placeholderFields: text("placeholder_fields").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Venue = typeof venues.$inferSelect;
export type NewVenue = typeof venues.$inferInsert;

// ────────────────────────────────────────────────────────────────────────────
// PROVIDERS — discipline facilitators
// ────────────────────────────────────────────────────────────────────────────

export const providers = pgTable("providers", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  disciplineEs: text("discipline_es").notNull(),
  disciplineEn: text("discipline_en").notNull(),
  elementAffinity: text("element_affinity").notNull(), // tierra|fuego|agua|aire|eter
  descriptionEs: text("description_es"),
  descriptionEn: text("description_en"),
  providerName: text("provider_name"),
  providerContact: text("provider_contact"),
  status: text("status").notNull(), // confirmed | in-contact | pending | researching
  notesEs: text("notes_es"),
  notesEn: text("notes_en"),
  active: boolean("active").default(true).notNull(),
  isPlaceholder: boolean("is_placeholder").default(true).notNull(),
  placeholderFields: text("placeholder_fields").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Provider = typeof providers.$inferSelect;
export type NewProvider = typeof providers.$inferInsert;

// ────────────────────────────────────────────────────────────────────────────
// INSCRIPTIONS — leads from public Apply / Contact forms
// ────────────────────────────────────────────────────────────────────────────

export const inscriptions = pgTable("inscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  source: text("source").notNull(), // apply | contact | newsletter | corporate
  retreatSlug: text("retreat_slug"), // optional: which retreat they applied to
  pathSlug: text("path_slug"), // optional: which program
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  organization: text("organization"),
  role: text("role"),
  message: text("message"),
  status: text("status").default("new").notNull(), // new | contacted | qualified | converted | archived
  notes: text("notes"),
  locale: text("locale").default("es").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Inscription = typeof inscriptions.$inferSelect;
export type NewInscription = typeof inscriptions.$inferInsert;
