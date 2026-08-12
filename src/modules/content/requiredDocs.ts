import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { documentTemplates } from "@/shared/db/schema";
import { safeRead } from "./safe";

export interface RequiredDoc {
  slug: string;
  nameEs: string;
  nameEn: string;
  acceptanceType: string; // check_only | signature_upload
  version: number;
}

/**
 * Documents a buyer must accept before checkout (RF-CMP-02 / RF-DOC-05).
 * `appliesTo` filters by buyer type: persona docs + "ambos".
 */
export async function getRequiredDocs(
  buyerType: "persona" | "empresa" = "persona",
): Promise<RequiredDoc[]> {
  return safeRead([], async () => {
    const rows = await db
      .select()
      .from(documentTemplates)
      .where(
        and(
          eq(documentTemplates.active, true),
          eq(documentTemplates.requiredForPurchase, true),
        ),
      )
      .orderBy(asc(documentTemplates.nameEs));

    return rows
      .filter(
        (r) => r.appliesTo === "ambos" || r.appliesTo === buyerType,
      )
      .map(
        (r): RequiredDoc => ({
          slug: r.slug,
          nameEs: r.nameEs,
          nameEn: r.nameEn ?? r.nameEs,
          acceptanceType: r.acceptanceType,
          version: r.currentVersion,
        }),
      );
  });
}
