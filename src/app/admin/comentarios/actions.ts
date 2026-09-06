"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { blogComments } from "@/shared/db/schema/blog";
import { requireAdmin, str } from "@/shared/admin/action";

/** Revalidate every surface that shows blog-comment data after a write. */
function revalidateCommentSurfaces() {
  revalidatePath("/admin/comentarios");
  revalidatePath("/es/blog");
  revalidatePath("/en/journal");
}

/** Approve a pending blog comment. Reads `id` from the submitted form. */
export async function approveComment(fd: FormData) {
  const admin = await requireAdmin();
  const id = str(fd, "id");
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

/** Reject a blog comment. Triggered from `ConfirmarAccion` — reads `id`
 * from the hidden field of the confirmation form. */
export async function rejectComment(fd: FormData) {
  const admin = await requireAdmin();
  const id = str(fd, "id");
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

/** Mark a blog comment as spam. Triggered from `ConfirmarAccion` — reads
 * `id` from the hidden field of the confirmation form. */
export async function marcarSpam(fd: FormData) {
  const admin = await requireAdmin();
  const id = str(fd, "id");
  await db
    .update(blogComments)
    .set({
      status: "spam",
      moderatedAt: new Date(),
      moderatedBy: admin.email,
    })
    .where(eq(blogComments.id, id));
  revalidateCommentSurfaces();
}
