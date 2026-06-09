import {
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { retreats } from "./retreats";
import {
  buyerTypeEnum,
  currencyEnum,
  localeEnum,
  orderStatusEnum,
  paymentMethodEnum,
} from "./enums";

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  folio: text("folio").notNull().unique(), // EM-MMAA-XXXX
  buyerType: buyerTypeEnum("buyer_type").notNull(),
  buyerName: text("buyer_name").notNull(),
  buyerEmail: text("buyer_email").notNull(),
  buyerPhone: text("buyer_phone"),
  buyerCompany: text("buyer_company"),
  buyerRfc: text("buyer_rfc"),
  buyerAddress: text("buyer_address"),
  productIds: integer("product_ids").array().notNull(),
  retreatId: uuid("retreat_id").references(() => retreats.id),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0").notNull(),
  discountRule: text("discount_rule"),
  iva: decimal("iva", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  currency: currencyEnum("currency").notNull(),
  language: localeEnum("language").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  stripeSessionId: text("stripe_session_id").unique(),
  transferProofUrl: text("transfer_proof_url"),
  transferValidatedAt: timestamp("transfer_validated_at"),
  transferValidatedBy: text("transfer_validated_by"),
  status: orderStatusEnum("status").default("pending_documents").notNull(),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
