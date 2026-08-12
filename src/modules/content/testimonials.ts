import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { testimonials } from "@/shared/db/schema";
import type { Testimonial } from "@/data/content";
import { safeRead } from "./safe";

/** Map the DB testimonial_type enum to the public Testimonial.type union. */
function mapType(t: string): Testimonial["type"] {
  switch (t) {
    case "video":
      return "video";
    case "company_logo":
      return "company";
    default:
      return "quote"; // photo_quote | quote_only → quote
  }
}

/**
 * Published + admin-approved testimonials for the public carousel / empresas.
 * `displayLocations` can scope where each shows; when null it shows anywhere.
 */
export async function getTestimonials(
  location?: string,
): Promise<Testimonial[]> {
  return safeRead([], async () => {
    const rows = await db
      .select()
      .from(testimonials)
      .where(
        and(
          eq(testimonials.published, true),
          eq(testimonials.approvedByAdmin, true),
        ),
      )
      .orderBy(desc(testimonials.publishedAt));

    return rows
      .filter(
        (r) =>
          !location ||
          !r.displayLocations ||
          r.displayLocations.length === 0 ||
          r.displayLocations.includes(location),
      )
      .map(
        (r): Testimonial => ({
          id: r.id,
          type: mapType(r.type),
          authorName: r.authorName ?? undefined,
          authorRole: r.authorRole ?? undefined,
          company: r.companyName ?? undefined,
          quoteEs: r.quoteEs ?? undefined,
          quoteEn: r.quoteEn ?? undefined,
          image: r.photoUrl ?? undefined,
        }),
      );
  });
}
