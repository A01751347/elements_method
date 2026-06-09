import {
  boolean,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { products } from "./products";

export const retreats = pgTable("retreats", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: integer("product_id").references(() => products.id),
  nameEs: text("name_es").notNull(),
  nameEn: text("name_en"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location"),
  modality: text("modality").notNull(),
  elementsCovered: text("elements_covered").array().notNull(),
  descriptionEs: text("description_es"),
  descriptionEn: text("description_en"),
  imageUrl: text("image_url"),
  priceMxn: decimal("price_mxn", { precision: 10, scale: 2 }).notNull(),
  priceUsd: decimal("price_usd", { precision: 10, scale: 2 }),
  capacity: integer("capacity").notNull(),
  lowSeatsThreshold: integer("low_seats_threshold").default(10).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Retreat = typeof retreats.$inferSelect;
export type NewRetreat = typeof retreats.$inferInsert;
