import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { retreats } from "./retreats";

export const forms = pgTable("forms", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  titleEs: text("title_es").notNull(),
  titleEn: text("title_en"),
  descriptionEs: text("description_es"),
  descriptionEn: text("description_en"),
  fields: jsonb("fields").notNull(),
  category: text("category"), // 'inicio' | 'durante' | 'cierre' | 'custom'
  isAnonymous: boolean("is_anonymous").default(false).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const formTokens = pgTable("form_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id")
    .references(() => forms.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").notNull().unique(),
  recipientEmail: text("recipient_email").notNull(),
  recipientName: text("recipient_name"),
  orderId: uuid("order_id").references(() => orders.id),
  retreatId: uuid("retreat_id").references(() => retreats.id),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});

export const formResponses = pgTable("form_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id")
    .references(() => forms.id, { onDelete: "cascade" })
    .notNull(),
  tokenId: uuid("token_id").references(() => formTokens.id),
  orderId: uuid("order_id").references(() => orders.id),
  retreatId: uuid("retreat_id").references(() => retreats.id),
  respondentEmail: text("respondent_email"),
  respondentName: text("respondent_name"),
  answers: jsonb("answers").notNull(),
  shareablePhrase: text("shareable_phrase"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Form = typeof forms.$inferSelect;
export type FormToken = typeof formTokens.$inferSelect;
export type FormResponse = typeof formResponses.$inferSelect;
