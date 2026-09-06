import { desc, ilike, or } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orders } from "@/shared/db/schema";
import { auth } from "@/shared/auth/config";
import { ORDER_STATUS, PAYMENT_METHOD, estado } from "@/app/admin/_lib/status";
import { fechaIso } from "@/app/admin/_lib/format";

export const runtime = "nodejs";

const ESTADOS_PENDIENTES = ["pending_documents", "pending_payment"];
const ESTADOS_CANCELADAS = ["cancelled", "refunded"];

/** Misma regla de agrupación de estado que usa la lista /admin/pagos. */
function coincideEstado(status: string, filtro: string | null): boolean {
  switch (filtro) {
    case "pagadas":
      return status === "paid";
    case "pendientes":
      return ESTADOS_PENDIENTES.includes(status);
    case "por-validar":
      return status === "pending_transfer_validation";
    case "canceladas":
      return ESTADOS_CANCELADAS.includes(status);
    default:
      return true;
  }
}

/** Escapa un valor para una celda CSV (RFC 4180). */
function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/**
 * GET /api/admin/ordenes/export?estado=&q= → CSV de las órdenes que
 * coinciden con los mismos filtros que la lista /admin/pagos.
 *
 * Admin-only (auth requerida). BOM UTF-8 para que Excel muestre bien los
 * acentos, igual que el export de formularios.
 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(req.url);
  const estadoFiltro = url.searchParams.get("estado");
  const q = (url.searchParams.get("q") ?? "").trim();

  const condicion = q
    ? or(
        ilike(orders.folio, `%${q}%`),
        ilike(orders.buyerName, `%${q}%`),
        ilike(orders.buyerEmail, `%${q}%`),
        ilike(orders.buyerCompany, `%${q}%`),
      )
    : undefined;

  const rows = await db.select().from(orders).where(condicion).orderBy(desc(orders.createdAt)).limit(200);
  const filtradas = rows.filter((o) => coincideEstado(o.status, estadoFiltro));

  const header = [
    "folio",
    "fecha",
    "estado",
    "metodo",
    "comprador",
    "correo",
    "telefono",
    "empresa",
    "subtotal",
    "descuento",
    "iva",
    "total",
    "moneda",
    "pagado_el",
  ];
  const lines = [header.map(csvCell).join(",")];

  for (const o of filtradas) {
    const row = [
      o.folio,
      fechaIso(o.createdAt),
      estado(ORDER_STATUS, o.status).label,
      estado(PAYMENT_METHOD, o.paymentMethod).label,
      o.buyerName,
      o.buyerEmail,
      o.buyerPhone ?? "",
      o.buyerCompany ?? "",
      o.subtotal,
      o.discount,
      o.iva,
      o.total,
      o.currency,
      o.paidAt ? fechaIso(o.paidAt) : "",
    ];
    lines.push(row.map(csvCell).join(","));
  }

  // BOM UTF-8 al inicio para que Excel muestre bien los acentos.
  const csv = "﻿" + lines.join("\r\n");
  const filename = `ordenes-${fechaIso(new Date())}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
