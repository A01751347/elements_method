"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { contactInfo, contactSocials } from "@/shared/db/schema";
import { requireAdmin, str, strOrNull } from "@/shared/admin/action";

interface RedSocialRaw {
  platform: string;
  handle: string;
  url: string;
}

/**
 * Guarda el singleton de contact_info y reemplaza contact_socials completo
 * (borra + reinserta con sortOrder = índice) en un solo batch atómico, ya que
 * el driver neon-http no soporta `db.transaction()` de verdad.
 */
export async function guardarContacto(fd: FormData): Promise<void> {
  await requireAdmin();

  const values = {
    phoneDisplayMx: strOrNull(fd, "phoneDisplayMx"),
    phoneE164: strOrNull(fd, "phoneE164"),
    whatsappLink: strOrNull(fd, "whatsappLink"),
    emailGeneral: strOrNull(fd, "emailGeneral"),
    addressLabelEs: strOrNull(fd, "addressLabelEs"),
    addressLabelEn: strOrNull(fd, "addressLabelEn"),
    updatedAt: new Date(),
  };

  const existing = await db.select({ id: contactInfo.id }).from(contactInfo).limit(1);
  if (existing[0]) {
    await db.update(contactInfo).set(values).where(eq(contactInfo.id, existing[0].id));
  } else {
    await db.insert(contactInfo).values({ singleton: true, ...values });
  }

  let socials: RedSocialRaw[] = [];
  try {
    const raw = JSON.parse(str(fd, "socialsJson") || "[]");
    if (Array.isArray(raw)) {
      socials = raw
        .map((r): RedSocialRaw => ({
          platform: typeof r?.platform === "string" ? r.platform.trim() : "",
          handle: typeof r?.handle === "string" ? r.handle.trim() : "",
          url: typeof r?.url === "string" ? r.url.trim() : "",
        }))
        .filter((r) => r.platform.length > 0 && r.url.length > 0);
    }
  } catch {
    socials = [];
  }

  await db.batch([
    db.delete(contactSocials),
    ...socials.map((s, i) =>
      db.insert(contactSocials).values({ platform: s.platform, handle: s.handle, url: s.url, sortOrder: i }),
    ),
  ] as Parameters<typeof db.batch>[0]);

  revalidatePath("/", "layout");
  revalidatePath("/admin/ajustes/contacto");
  redirect("/admin/ajustes/contacto?ok=1");
}
