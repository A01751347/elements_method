import {
  decimal,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { currencyEnum, quoteStatusEnum, retreatModalityEnum } from "./enums";

export const calculatorConfig = pgTable("calculator_config", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const enterpriseQuotes = pgTable("enterprise_quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  quoteNumber: text("quote_number").notNull().unique(),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  numberOfPeople: integer("number_of_people").notNull(),
  numberOfSessions: integer("number_of_sessions").notNull(),
  modality: retreatModalityEnum("modality").notNull(),
  breakdown: jsonb("breakdown").notNull(),
  totalMxn: decimal("total_mxn", { precision: 10, scale: 2 }).notNull(),
  totalUsd: decimal("total_usd", { precision: 10, scale: 2 }),
  currency: currencyEnum("currency").notNull(),
  pdfUrl: text("pdf_url"),
  language: text("language").notNull(),
  status: quoteStatusEnum("status").default("nueva").notNull(),
  notes: text("notes"),
  validUntil: timestamp("valid_until").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type CalculatorConfig = typeof calculatorConfig.$inferSelect;
export type EnterpriseQuote = typeof enterpriseQuotes.$inferSelect;
