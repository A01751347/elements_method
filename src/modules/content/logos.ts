import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { clientLogos } from "@/shared/db/schema";
import { safeRead } from "./safe";

export interface ClientLogo {
  id: string;
  companyName: string;
  logoUrl: string;
  websiteUrl: string | null;
}

/** Active client logos for the marquee, ordered by sortOrder. */
export async function getLogos(): Promise<ClientLogo[]> {
  return safeRead([], async () => {
    const rows = await db
      .select()
      .from(clientLogos)
      .where(eq(clientLogos.active, true))
      .orderBy(asc(clientLogos.sortOrder));
    return rows.map(
      (r): ClientLogo => ({
        id: r.id,
        companyName: r.companyName,
        logoUrl: r.logoUrl,
        websiteUrl: r.websiteUrl,
      }),
    );
  });
}
