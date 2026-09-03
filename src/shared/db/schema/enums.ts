import { pgEnum } from "drizzle-orm/pg-core";

export const localeEnum = pgEnum("locale", ["es", "en"]);

export const productTypeEnum = pgEnum("product_type", [
  "camino",
  "elemento",
  "retiro_inmersivo",
  "programa_corporativo",
  "experiencia",
]);

export const elementEnum = pgEnum("element", ["agua", "fuego", "aire", "tierra", "eter"]);

export const currencyEnum = pgEnum("currency", ["MXN", "USD"]);

export const buyerTypeEnum = pgEnum("buyer_type", ["persona", "empresa"]);

export const paymentMethodEnum = pgEnum("payment_method", ["stripe", "transferencia"]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending_documents",
  "pending_payment",
  "pending_transfer_validation",
  "paid",
  "refunded",
  "cancelled",
]);

export const documentAcceptanceTypeEnum = pgEnum("document_acceptance_type", [
  "check_only",
  "signature_upload",
]);

export const documentAppliesEnum = pgEnum("document_applies_to", [
  "persona",
  "empresa",
  "ambos",
]);

export const testimonialTypeEnum = pgEnum("testimonial_type", [
  "video",
  "photo_quote",
  "quote_only",
  "company_logo",
]);

export const commentStatusEnum = pgEnum("comment_status", [
  "pending",
  "approved",
  "rejected",
  "spam",
]);

export const blogStatusEnum = pgEnum("blog_status", ["draft", "published"]);

export const quoteStatusEnum = pgEnum("quote_status", [
  "nueva",
  "contactada",
  "aceptada",
  "cerrada",
]);

export const retreatModalityEnum = pgEnum("retreat_modality", [
  "presencial",
  "virtual",
  "hibrido",
]);
