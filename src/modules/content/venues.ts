import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { venues } from "@/shared/db/schema";
import type { VenueInfo } from "@/data/launchData";
import { safeRead } from "./safe";

function toVenueInfo(v: typeof venues.$inferSelect): VenueInfo {
  return {
    slug: v.slug,
    name: v.name,
    city: v.city,
    state: v.state as VenueInfo["state"],
    capacity: v.capacity ?? "",
    notesEs: v.notesEs ?? "",
    url: v.url ?? "",
    rangeMxn: v.rangeMxn ?? "",
    isPlaceholder: v.isPlaceholder,
    placeholderFields: v.placeholderFields ?? [],
  };
}

export async function getVenues(): Promise<VenueInfo[]> {
  return safeRead([], async () => {
    const rows = await db.select().from(venues).orderBy(asc(venues.name));
    return rows.map(toVenueInfo);
  });
}

export async function getVenueBySlug(slug: string): Promise<VenueInfo | null> {
  return safeRead(null, async () => {
    const rows = await db.select().from(venues).where(eq(venues.slug, slug)).limit(1);
    return rows[0] ? toVenueInfo(rows[0]) : null;
  });
}
