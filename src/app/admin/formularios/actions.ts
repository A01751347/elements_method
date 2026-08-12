"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/shared/db/client";
import { forms } from "@/shared/db/schema/forms";
import { requireAdmin, str, strOrNull, bool } from "@/shared/admin/action";

const FieldSchema = z.object({
  key: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9_]+$/, "key debe ser snake_case"),
  type: z.enum([
    "short_text",
    "long_text",
    "single_choice",
    "multi_choice",
    "scale",
    "nps",
    "date",
    "email",
    "number",
    "rating",
  ]),
  labelEs: z.string().min(1).max(500),
  labelEn: z.string().max(500),
  required: z.boolean(),
  options: z.array(z.string().min(1).max(200)).max(20).optional(),
  scaleMin: z.number().int().min(0).max(100).optional(),
  scaleMax: z.number().int().min(1).max(100).optional(),
  shareablePhrase: z.boolean().optional(),
});

const FieldsSchema = z.array(FieldSchema).min(1).max(40);

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Parse and validate the builder's hidden JSON payload of questions. */
function parseFields(fd: FormData) {
  let raw: unknown;
  try {
    raw = JSON.parse(str(fd, "fieldsJson"));
  } catch {
    throw new Error("Preguntas inválidas: JSON malformado.");
  }
  const parsed = FieldsSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(
      `Preguntas inválidas: ${parsed.error.issues[0]?.message ?? "revisa los campos"}.`,
    );
  }
  // EN falls back to ES so the public /en survey never renders empty labels.
  return parsed.data.map((f) => ({
    ...f,
    labelEn: f.labelEn.trim() || f.labelEs,
  }));
}

function parseMeta(fd: FormData) {
  const titleEs = str(fd, "titleEs");
  if (!titleEs) throw new Error("El título (ES) es obligatorio.");
  const category = str(fd, "category") || "custom";
  return {
    titleEs,
    titleEn: strOrNull(fd, "titleEn") ?? titleEs,
    descriptionEs: strOrNull(fd, "descriptionEs"),
    descriptionEn: strOrNull(fd, "descriptionEn"),
    category: ["inicio", "durante", "cierre", "custom"].includes(category)
      ? category
      : "custom",
    isAnonymous: bool(fd, "isAnonymous"),
  };
}

export async function createForm(fd: FormData) {
  await requireAdmin();
  const meta = parseMeta(fd);
  const fields = parseFields(fd);

  // Unique slug derived from the title; suffix -2, -3… on collision.
  const base = slugify(meta.titleEs) || "formulario";
  let slug = base;
  for (let i = 2; ; i++) {
    const [existing] = await db
      .select({ id: forms.id })
      .from(forms)
      .where(eq(forms.slug, slug))
      .limit(1);
    if (!existing) break;
    slug = `${base}-${i}`;
  }

  await db.insert(forms).values({ ...meta, slug, fields });
  revalidatePath("/admin/formularios");
  redirect(`/admin/formularios/${slug}`);
}

export async function updateForm(formId: string, fd: FormData) {
  await requireAdmin();
  const meta = parseMeta(fd);
  const fields = parseFields(fd);

  const [row] = await db
    .select({ slug: forms.slug })
    .from(forms)
    .where(eq(forms.id, formId))
    .limit(1);
  if (!row) throw new Error("Formulario no encontrado.");

  await db
    .update(forms)
    .set({ ...meta, fields, updatedAt: new Date() })
    .where(eq(forms.id, formId));
  revalidatePath("/admin/formularios");
  revalidatePath(`/admin/formularios/${row.slug}`);
  redirect(`/admin/formularios/${row.slug}`);
}

export async function toggleFormActive(formId: string, next: boolean) {
  await requireAdmin();
  await db
    .update(forms)
    .set({ active: next, updatedAt: new Date() })
    .where(eq(forms.id, formId));
  revalidatePath("/admin/formularios");
}
