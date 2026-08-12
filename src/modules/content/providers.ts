import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { providers } from "@/shared/db/schema";
import type { ProviderInfo } from "@/data/launchData";
import { safeRead } from "./safe";

function toProviderInfo(p: typeof providers.$inferSelect): ProviderInfo {
  return {
    slug: p.slug,
    disciplineEs: p.disciplineEs,
    disciplineEn: p.disciplineEn,
    elementAffinity: p.elementAffinity as ProviderInfo["elementAffinity"],
    descriptionEs: p.descriptionEs ?? "",
    descriptionEn: p.descriptionEn ?? "",
    providerName: p.providerName ?? "",
    providerContact: p.providerContact ?? "",
    status: p.status as ProviderInfo["status"],
    notesEs: p.notesEs ?? "",
    notesEn: p.notesEn ?? "",
    isPlaceholder: p.isPlaceholder,
    placeholderFields: p.placeholderFields ?? [],
  };
}

export async function getProviders(): Promise<ProviderInfo[]> {
  return safeRead([], async () => {
    const rows = await db.select().from(providers).orderBy(asc(providers.disciplineEs));
    return rows.map(toProviderInfo);
  });
}

export async function getProviderBySlug(slug: string): Promise<ProviderInfo | null> {
  return safeRead(null, async () => {
    const rows = await db.select().from(providers).where(eq(providers.slug, slug)).limit(1);
    return rows[0] ? toProviderInfo(rows[0]) : null;
  });
}
