import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { blogPosts } from "@/shared/db/schema";
import { safeRead } from "./safe";

export interface PublicBlogPost {
  slug: string;
  titleEs: string;
  titleEn: string;
  excerptEs: string;
  excerptEn: string;
  author: string;
  coverImageUrl: string | null;
  publishedAt: string | null;
}

function toPublic(r: typeof blogPosts.$inferSelect): PublicBlogPost {
  return {
    slug: r.slug,
    titleEs: r.titleEs,
    titleEn: r.titleEn ?? r.titleEs,
    excerptEs: r.excerptEs ?? "",
    excerptEn: r.excerptEn ?? r.excerptEs ?? "",
    author: r.author ?? "Elements Method",
    coverImageUrl: r.coverImageUrl,
    publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
  };
}

/** Published blog posts, newest first. */
export async function getBlogPosts(): Promise<PublicBlogPost[]> {
  return safeRead([], async () => {
    const rows = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt));
    return rows.map(toPublic);
  });
}

/** A single published post by slug (for a future detail page). */
export async function getBlogPostBySlug(
  slug: string,
): Promise<(typeof blogPosts.$inferSelect) | null> {
  return safeRead(null, async () => {
    const rows = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);
    return rows[0] ?? null;
  });
}
