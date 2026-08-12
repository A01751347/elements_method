"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { testimonials } from "@/shared/db/schema/testimonials";
import { requireAdmin, str, strOrNull, bool } from "@/shared/admin/action";

type TestimonialType = (typeof testimonials.type.enumValues)[number];

/** Revalidate every surface that shows testimonial data after a write. */
function revalidateTestimonialSurfaces() {
  revalidatePath("/admin/testimoniales");
  revalidatePath("/es");
  revalidatePath("/en");
  revalidatePath("/es/empresas");
  revalidatePath("/en/companies");
}

/** Toggle the published flag on a testimonial (inline row control). */
export async function toggleTestimonialPublished(id: string, next: boolean) {
  await requireAdmin();
  await db
    .update(testimonials)
    .set({
      published: next,
      publishedAt: next ? new Date() : null,
    })
    .where(eq(testimonials.id, id));
  revalidateTestimonialSurfaces();
}

/** Approve a testimonial and publish it in the same step, so survey-sourced
 * quotes go live on the homepage as soon as the admin accepts them. */
export async function approveTestimonial(id: string) {
  await requireAdmin();
  await db
    .update(testimonials)
    .set({ approvedByAdmin: true, published: true, publishedAt: new Date() })
    .where(eq(testimonials.id, id));
  revalidateTestimonialSurfaces();
}

/** Reject and delete a pending survey-sourced testimonial. The phrase stays
 * recorded in the original form response. */
export async function rejectTestimonial(id: string) {
  await requireAdmin();
  await db.delete(testimonials).where(eq(testimonials.id, id));
  revalidateTestimonialSurfaces();
}

/** Create a new testimonial from the admin create form. */
export async function createTestimonial(fd: FormData) {
  await requireAdmin();
  const type = (str(fd, "type") || "quote_only") as TestimonialType;
  const published = bool(fd, "published");
  await db.insert(testimonials).values({
    type,
    authorName: strOrNull(fd, "authorName"),
    authorRole: strOrNull(fd, "authorRole"),
    companyName: strOrNull(fd, "companyName"),
    quoteEs: strOrNull(fd, "quoteEs"),
    quoteEn: strOrNull(fd, "quoteEn"),
    published,
    publishedAt: published ? new Date() : null,
  });
  revalidateTestimonialSurfaces();
  redirect("/admin/testimoniales");
}
