import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { blogStatusEnum, commentStatusEnum } from "./enums";

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  titleEs: text("title_es").notNull(),
  titleEn: text("title_en"),
  excerptEs: text("excerpt_es"),
  excerptEn: text("excerpt_en"),
  contentEs: jsonb("content_es").notNull(),
  contentEn: jsonb("content_en"),
  coverImageUrl: text("cover_image_url"),
  author: text("author"),
  metaDescriptionEs: text("meta_description_es"),
  metaDescriptionEn: text("meta_description_en"),
  status: blogStatusEnum("status").default("draft").notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const blogComments = pgTable("blog_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .references(() => blogPosts.id, { onDelete: "cascade" })
    .notNull(),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  content: text("content").notNull(),
  status: commentStatusEnum("status").default("pending").notNull(),
  sessionId: text("session_id").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  moderatedAt: timestamp("moderated_at"),
  moderatedBy: text("moderated_by"),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type BlogComment = typeof blogComments.$inferSelect;
