import {
  boolean,
  decimal,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { elementEnum, productTypeEnum } from "./enums";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  type: productTypeEnum("type").notNull(),
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en"),
  descriptionEs: text("description_es").notNull(),
  descriptionEn: text("description_en"),
  includesEs: text("includes_es"),
  includesEn: text("includes_en"),
  duration: text("duration"),
  modality: text("modality"),
  priceMxn: decimal("price_mxn", { precision: 10, scale: 2 }).notNull(),
  priceUsd: decimal("price_usd", { precision: 10, scale: 2 }),
  stripePriceIdMxn: text("stripe_price_id_mxn"),
  stripePriceIdUsd: text("stripe_price_id_usd"),
  element: elementEnum("element"),
  coverImageUrl: text("cover_image_url"),
  active: boolean("active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productCombinations = pgTable("product_combinations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  requiredProductIds: integer("required_product_ids").array().notNull(),
  discountType: text("discount_type").notNull(), // 'percentage' | 'fixed_amount'
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductCombination = typeof productCombinations.$inferSelect;
