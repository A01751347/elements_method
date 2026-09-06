"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/shared/db/client";
import { enterpriseQuotes, calculatorConfig, quoteStatusEnum } from "@/shared/db/schema";
import { requireAdmin, str, strOrNull } from "@/shared/admin/action";

type QuoteStatusValue = (typeof quoteStatusEnum.enumValues)[number];

function isQuoteStatus(v: string): v is QuoteStatusValue {
  return (quoteStatusEnum.enumValues as readonly string[]).includes(v);
}

/**
 * Guarda el seguimiento (estado + notas internas) de una cotización.
 * Se llama enlazada como `actualizarCotizacion.bind(null, quote.id, quote.quoteNumber)`
 * desde la ficha, así el server action solo recibe el FormData del formulario.
 */
export async function actualizarCotizacion(
  id: string,
  quoteNumber: string,
  fd: FormData,
): Promise<void> {
  await requireAdmin();

  const statusRaw = str(fd, "status");
  if (!isQuoteStatus(statusRaw)) {
    throw new Error("El estado de la cotización no es válido.");
  }
  const notes = strOrNull(fd, "notes");

  await db
    .update(enterpriseQuotes)
    .set({ status: statusRaw, notes, updatedAt: new Date() })
    .where(eq(enterpriseQuotes.id, id));

  revalidatePath("/admin");
  revalidatePath("/admin/empresas");
  revalidatePath(`/admin/empresas/${quoteNumber}`);
}

/* ── Editor de la fórmula (calculator_config) ────────────────────────────── */

const TierSchema = z.object({
  min: z.coerce.number().int().positive(),
  max: z.coerce.number().int().positive(),
  multiplier: z.coerce.number().positive(),
});

const DiscountSchema = z.object({
  thresholdMxn: z.coerce.number().positive(),
  discountPct: z.coerce.number().min(0).max(100),
});

const CalculadoraSchema = z.object({
  basePerSessionMxn: z.coerce.number().positive(),
  basePerSessionUsd: z.coerce.number().positive(),
  minPeople: z.coerce.number().int().positive(),
  minSessions: z.coerce.number().int().positive(),
  validityDays: z.coerce.number().int().positive(),
  modalityPresencial: z.coerce.number().positive(),
  modalityVirtual: z.coerce.number().positive(),
  modalityHibrido: z.coerce.number().positive(),
  peopleTiers: z.array(TierSchema).min(1, "Necesitas al menos un tramo de personas."),
  volumeDiscount: z.array(DiscountSchema),
});

/** Sube la clave `key` en `calculator_config` (la PK es `key`). */
async function upsertConfigKey(key: string, value: unknown) {
  await db
    .insert(calculatorConfig)
    .values({ key, value })
    .onConflictDoUpdate({ target: calculatorConfig.key, set: { value, updatedAt: new Date() } });
}

/**
 * Guarda las 8 claves de `calculator_config` que usa la calculadora pública.
 * Valida números positivos, tramos de personas continuos (sin huecos ni
 * traslapes) y descuentos por volumen con umbrales crecientes.
 */
export async function guardarCalculadora(fd: FormData): Promise<void> {
  await requireAdmin();

  let peopleTiersRaw: unknown;
  let volumeDiscountRaw: unknown;
  try {
    peopleTiersRaw = JSON.parse(str(fd, "peopleTiersJson") || "[]");
    volumeDiscountRaw = JSON.parse(str(fd, "volumeDiscountJson") || "[]");
  } catch {
    throw new Error("Los tramos de personas o los descuentos por volumen no tienen un formato válido.");
  }

  const parsed = CalculadoraSchema.safeParse({
    basePerSessionMxn: str(fd, "basePerSessionMxn"),
    basePerSessionUsd: str(fd, "basePerSessionUsd"),
    minPeople: str(fd, "minPeople"),
    minSessions: str(fd, "minSessions"),
    validityDays: str(fd, "validityDays"),
    modalityPresencial: str(fd, "modalityPresencial"),
    modalityVirtual: str(fd, "modalityVirtual"),
    modalityHibrido: str(fd, "modalityHibrido"),
    peopleTiers: peopleTiersRaw,
    volumeDiscount: volumeDiscountRaw,
  });

  if (!parsed.success) {
    throw new Error("La fórmula tiene datos inválidos: revisa los números, los tramos y los descuentos.");
  }
  const data = parsed.data;

  const tiersSorted = [...data.peopleTiers].sort((a, b) => a.min - b.min);
  for (let i = 1; i < tiersSorted.length; i++) {
    if (tiersSorted[i].min !== tiersSorted[i - 1].max + 1) {
      throw new Error("Los tramos de personas deben ser continuos, sin huecos ni traslapes.");
    }
  }

  const discountsSorted = [...data.volumeDiscount].sort((a, b) => a.thresholdMxn - b.thresholdMxn);
  for (let i = 1; i < discountsSorted.length; i++) {
    if (discountsSorted[i].thresholdMxn <= discountsSorted[i - 1].thresholdMxn) {
      throw new Error("Los descuentos por volumen deben tener umbrales distintos y crecientes.");
    }
  }

  await Promise.all([
    upsertConfigKey("base_per_session_mxn", data.basePerSessionMxn),
    upsertConfigKey("base_per_session_usd", data.basePerSessionUsd),
    upsertConfigKey("min_people", data.minPeople),
    upsertConfigKey("min_sessions", data.minSessions),
    upsertConfigKey("validity_days", data.validityDays),
    upsertConfigKey("modality_multiplier", {
      presencial: data.modalityPresencial,
      virtual: data.modalityVirtual,
      hibrido: data.modalityHibrido,
    }),
    upsertConfigKey("people_tiers", tiersSorted),
    upsertConfigKey("volume_discount", discountsSorted),
  ]);

  revalidatePath("/admin/empresas/calculadora");
  revalidatePath("/es/empresas/cotizar");
  revalidatePath("/en/companies/cotizar");
  redirect("/admin/empresas/calculadora?ok=1");
}
