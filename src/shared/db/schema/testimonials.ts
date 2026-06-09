import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { formResponses } from "./forms";
import { retreats } from "./retreats";
import { testimonialTypeEnum } from "./enums";

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: testimonialTypeEnum("type").notNull(),
  authorName: text("author_name"),
  authorRole: text("author_role"),
  companyName: text("company_name"),
  quoteEs: text("quote_es"),
  quoteEn: text("quote_en"),
  videoUrl: text("video_url"),
  photoUrl: text("photo_url"),
  sourceFormResponseId: uuid("source_form_response_id").references(
    () => formResponses.id
  ),
  retreatId: uuid("retreat_id").references(() => retreats.id),
  displayLocations: text("display_locations").array(),
  approvedByAdmin: boolean("approved_by_admin").default(false).notNull(),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clientLogos = pgTable("client_logos", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyName: text("company_name").notNull(),
  logoUrl: text("logo_url").notNull(),
  websiteUrl: text("website_url"),
  usageAuthorizationUrl: text("usage_authorization_url"),
  sortOrder: text("sort_order"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type ClientLogo = typeof clientLogos.$inferSelect;
