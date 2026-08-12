"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { blogComments } from "@/shared/db/schema/blog";
import { requireAdmin } from "@/shared/admin/action";

/** Revalidate every surface that shows blog-comment data after a write. */
function revalidateCommentSurfaces() {
  revalidatePath("/admin/comentarios");
  revalidatePath("/es/blog");
  revalidatePath("/en/journal");
}

/** Approve a pending blog comment (inline toggle — revalidate, no redirect). */
export async function approveComment(id: string) {
  const admin = await requireAdmin();
  await db
    .update(blogComments)
    .set({
      status: "approved",
      moderatedAt: new Date(),
      moderatedBy: admin.email,
    })
    .where(eq(blogComments.id, id));
  revalidateCommentSurfaces();
}

/** Reject a blog comment (inline toggle — revalidate, no redirect). */
export async function rejectComment(id: string) {
  const admin = await requireAdmin();
  await db
    .update(blogComments)
    .set({
      status: "rejected",
      moderatedAt: new Date(),
      moderatedBy: admin.email,
    })
    .where(eq(blogComments.id, id));
  revalidateCommentSurfaces();
}
