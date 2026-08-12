"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { blogPosts } from "@/shared/db/schema/blog";
import { requireAdmin, str, strOrNull } from "@/shared/admin/action";

/** Revalidate every surface that shows blog data after a write. */
function revalidateBlogSurfaces() {
  revalidatePath("/admin/blog");
  revalidatePath("/es/blog");
  revalidatePath("/en/journal");
}

/**
 * Read the blog-post fields out of a submitted admin form.
 * Content columns are jsonb, so ES/EN bodies are stored as a { text } wrapper.
 */
function readForm(fd: FormData) {
  const status = str(fd, "status") === "published" ? "published" : "draft";
  return {
    slug: str(fd, "slug"),
    titleEs: str(fd, "titleEs"),
    titleEn: strOrNull(fd, "titleEn"),
    excerptEs: strOrNull(fd, "excerptEs"),
    excerptEn: strOrNull(fd, "excerptEn"),
    contentEs: { text: str(fd, "contentEs") },
    contentEn: strOrNull(fd, "contentEn")
      ? { text: str(fd, "contentEn") }
      : null,
    coverImageUrl: strOrNull(fd, "coverImageUrl"),
    author: strOrNull(fd, "author"),
    status: status as "draft" | "published",
  };
}

/** Create a new blog post. */
export async function createPost(fd: FormData) {
  await requireAdmin();
  const v = readForm(fd);
  if (!v.slug || !v.titleEs) {
    throw new Error("Slug y título (ES) son obligatorios.");
  }
  await db.insert(blogPosts).values({
    ...v,
    publishedAt: v.status === "published" ? new Date() : null,
  });
  revalidateBlogSurfaces();
  redirect("/admin/blog");
}

/** Update an existing blog post, identified by its original slug. */
export async function updatePost(originalSlug: string, fd: FormData) {
  await requireAdmin();
  const v = readForm(fd);
  if (!v.slug || !v.titleEs) {
    throw new Error("Slug y título (ES) son obligatorios.");
  }

  // Only stamp publishedAt the first time the post becomes published.
  const [existing] = await db
    .select({ publishedAt: blogPosts.publishedAt })
    .from(blogPosts)
    .where(eq(blogPosts.slug, originalSlug))
    .limit(1);

  const publishedAt =
    v.status === "published"
      ? (existing?.publishedAt ?? new Date())
      : null;

  await db
    .update(blogPosts)
    .set({
      ...v,
      publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.slug, originalSlug));
  revalidateBlogSurfaces();
  redirect("/admin/blog");
}

/** Delete a blog post by slug. */
export async function deletePost(slug: string) {
  await requireAdmin();
  await db.delete(blogPosts).where(eq(blogPosts.slug, slug));
  revalidateBlogSurfaces();
  redirect("/admin/blog");
}
