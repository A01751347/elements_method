import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { documentAcceptanceTypeEnum, documentAppliesEnum } from "./enums";

export const documentTemplates = pgTable("document_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en"),
  templateHtmlEs: text("template_html_es").notNull(),
  templateHtmlEn: text("template_html_en"),
  requiredForPurchase: boolean("required_for_purchase").default(true).notNull(),
  acceptanceType: documentAcceptanceTypeEnum("acceptance_type").notNull(),
  appliesTo: documentAppliesEnum("applies_to").notNull(),
  currentVersion: integer("current_version").default(1).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const documentVersions = pgTable("document_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  templateId: uuid("template_id")
    .references(() => documentTemplates.id, { onDelete: "cascade" })
    .notNull(),
  versionNumber: integer("version_number").notNull(),
  templateHtmlEs: text("template_html_es").notNull(),
  templateHtmlEn: text("template_html_en"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderDocuments = pgTable("order_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  documentTemplateId: uuid("document_template_id")
    .references(() => documentTemplates.id)
    .notNull(),
  documentVersion: integer("document_version").notNull(),
  generatedPdfUrl: text("generated_pdf_url").notNull(),
  generatedPdfHash: text("generated_pdf_hash").notNull(),
  accepted: boolean("accepted").default(false).notNull(),
  acceptedAt: timestamp("accepted_at"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  signedPdfUrl: text("signed_pdf_url"),
  signedPdfHash: text("signed_pdf_hash"),
});

export const documentDownloads = pgTable("document_downloads", {
  id: uuid("id").primaryKey().defaultRandom(),
  templateId: uuid("template_id")
    .references(() => documentTemplates.id)
    .notNull(),
  documentVersion: integer("document_version").notNull(),
  email: text("email"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  downloadedAt: timestamp("downloaded_at").defaultNow().notNull(),
});

export type DocumentTemplate = typeof documentTemplates.$inferSelect;
export type OrderDocument = typeof orderDocuments.$inferSelect;
