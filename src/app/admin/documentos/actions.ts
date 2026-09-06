"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { documentTemplates, documentVersions } from "@/shared/db/schema";
import { requireAdmin, str, strOrNull, bool } from "@/shared/admin/action";

const APPLIES_TO_VALUES = ["persona", "empresa", "ambos"] as const;
const ACCEPTANCE_TYPE_VALUES = ["check_only", "signature_upload"] as const;

/** Revalidate every surface the checkout / admin reads document templates from. */
function revalidateDocumentSurfaces(slug?: string) {
  revalidatePath("/admin/documentos");
  if (slug) revalidatePath(`/admin/documentos/${slug}`);
  // The checkout gate (getRequiredDocs) is read on every catalog/checkout page.
  revalidatePath("/es/los-caminos");
  revalidatePath("/en/paths");
}

function readTemplateFields(fd: FormData) {
  const appliesToRaw = str(fd, "appliesTo");
  const acceptanceTypeRaw = str(fd, "acceptanceType");
  const nameEs = str(fd, "nameEs");
  const templateHtmlEs = str(fd, "templateHtmlEs");
  if (!nameEs || !templateHtmlEs) {
    throw new Error("El nombre y la plantilla en español son obligatorios.");
  }
  return {
    nameEs,
    nameEn: strOrNull(fd, "nameEn"),
    templateHtmlEs,
    templateHtmlEn: strOrNull(fd, "templateHtmlEn"),
    appliesTo: (APPLIES_TO_VALUES as readonly string[]).includes(appliesToRaw)
      ? (appliesToRaw as (typeof APPLIES_TO_VALUES)[number])
      : "ambos",
    acceptanceType: (ACCEPTANCE_TYPE_VALUES as readonly string[]).includes(acceptanceTypeRaw)
      ? (acceptanceTypeRaw as (typeof ACCEPTANCE_TYPE_VALUES)[number])
      : "check_only",
    requiredForPurchase: bool(fd, "requiredForPurchase"),
    active: bool(fd, "active"),
  };
}

/** Save the template's fields in place — no new version. Existing acceptances keep pointing at the version they signed. */
export async function guardarPlantilla(id: string, fd: FormData) {
  await requireAdmin();
  const fields = readTemplateFields(fd);

  const [row] = await db
    .select({ slug: documentTemplates.slug })
    .from(documentTemplates)
    .where(eq(documentTemplates.id, id))
    .limit(1);
  if (!row) throw new Error("Plantilla no encontrada.");

  await db
    .update(documentTemplates)
    .set({ ...fields, updatedAt: new Date() })
    .where(eq(documentTemplates.id, id));

  revalidateDocumentSurfaces(row.slug);
}

/**
 * Save the edited HTML as a new version: bumps `currentVersion` and snapshots
 * both the outgoing and the new HTML into `document_versions`, so the history
 * never loses a version even if it was never explicitly snapshotted before.
 *
 * Note: the Neon HTTP driver used by `db` (drizzle-orm/neon-http) does not
 * support multi-statement transactions, so these writes run sequentially —
 * consistent with the rest of the codebase, which never calls `db.transaction`.
 */
export async function guardarComoNuevaVersion(id: string, fd: FormData) {
  await requireAdmin();
  const fields = readTemplateFields(fd);

  const [current] = await db.select().from(documentTemplates).where(eq(documentTemplates.id, id)).limit(1);
  if (!current) throw new Error("Plantilla no encontrada.");

  const [existingSnapshot] = await db
    .select({ id: documentVersions.id })
    .from(documentVersions)
    .where(
      and(eq(documentVersions.templateId, id), eq(documentVersions.versionNumber, current.currentVersion)),
    )
    .limit(1);

  if (!existingSnapshot) {
    await db.insert(documentVersions).values({
      templateId: id,
      versionNumber: current.currentVersion,
      templateHtmlEs: current.templateHtmlEs,
      templateHtmlEn: current.templateHtmlEn,
    });
  }

  const nextVersion = current.currentVersion + 1;
  await db.insert(documentVersions).values({
    templateId: id,
    versionNumber: nextVersion,
    templateHtmlEs: fields.templateHtmlEs,
    templateHtmlEn: fields.templateHtmlEn,
  });

  await db
    .update(documentTemplates)
    .set({ ...fields, currentVersion: nextVersion, updatedAt: new Date() })
    .where(eq(documentTemplates.id, id));

  revalidateDocumentSurfaces(current.slug);
}

/** Inline toggle of a template's active flag, driven by a ConfirmarAccion form. */
export async function alternarActiva(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const next = str(fd, "next") === "true";

  const [row] = await db
    .select({ slug: documentTemplates.slug })
    .from(documentTemplates)
    .where(eq(documentTemplates.id, id))
    .limit(1);

  await db.update(documentTemplates).set({ active: next, updatedAt: new Date() }).where(eq(documentTemplates.id, id));
  revalidateDocumentSurfaces(row?.slug);
}
