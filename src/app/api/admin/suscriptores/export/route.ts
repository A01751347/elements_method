import { desc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { subscribers } from "@/shared/db/schema/integrations";
import { auth } from "@/shared/auth/config";

export const runtime = "nodejs";

/** Escape a value for a CSV cell (RFC 4180). */
function csvCell(value: unknown): string {
  let s: string;
  if (value === null || value === undefined) s = "";
  else if (value instanceof Date) s = value.toISOString();
  else s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * GET /api/admin/suscriptores/export → CSV of every subscriber.
 *
 * Admin-only (auth required). Same shape as the forms export
 * (src/app/api/forms/[slug]/export/route.ts): UTF-8 BOM so Excel renders
 * accents correctly, CSV so no XLSX dependency is needed.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rows = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));

  const header = ["correo", "nombre", "telefono", "fuente", "idioma", "mailchimp", "alta", "baja"];
  const lines = [header.map(csvCell).join(",")];

  for (const s of rows) {
    const row = [
      s.email,
      s.name,
      s.phone,
      s.source,
      s.language,
      s.mailchimpStatus,
      s.createdAt,
      s.unsubscribedAt,
    ];
    lines.push(row.map(csvCell).join(","));
  }

  // Prepend a UTF-8 BOM so Excel renders accents correctly.
  const csv = "﻿" + lines.join("\r\n");
  const fecha = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="suscriptores-${fecha}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
