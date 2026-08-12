import { eq, asc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { forms, formResponses } from "@/shared/db/schema";
import { auth } from "@/shared/auth/config";

export const runtime = "nodejs";

/** Escape a value for a CSV cell (RFC 4180). */
function csvCell(value: unknown): string {
  let s: string;
  if (value === null || value === undefined) s = "";
  else if (typeof value === "object") s = JSON.stringify(value);
  else s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * GET /api/forms/{slug}/export → CSV of all responses for a form.
 *
 * Admin-only (auth required). Columns = fixed metadata + the union of every
 * answer key seen across responses, so a spreadsheet opens it cleanly. Excel
 * and Google Sheets import CSV natively (no XLSX dependency needed).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { slug } = await params;
  const formRows = await db
    .select()
    .from(forms)
    .where(eq(forms.slug, slug))
    .limit(1);
  const form = formRows[0];
  if (!form) return new Response("Form not found", { status: 404 });

  const responses = await db
    .select()
    .from(formResponses)
    .where(eq(formResponses.formId, form.id))
    .orderBy(asc(formResponses.createdAt));

  // Union of answer keys across all responses → stable column order.
  const answerKeys = new Set<string>();
  for (const r of responses) {
    const a = r.answers as Record<string, unknown> | null;
    if (a && typeof a === "object") {
      for (const k of Object.keys(a)) answerKeys.add(k);
    }
  }
  const keys = Array.from(answerKeys).sort();

  const header = [
    "fecha",
    "nombre",
    "email",
    "frase_compartible",
    ...keys,
  ];
  const lines = [header.map(csvCell).join(",")];

  for (const r of responses) {
    const a = (r.answers as Record<string, unknown>) ?? {};
    const row = [
      r.createdAt ? new Date(r.createdAt).toISOString() : "",
      r.respondentName ?? "",
      r.respondentEmail ?? "",
      r.shareablePhrase ?? "",
      ...keys.map((k) => a[k]),
    ];
    lines.push(row.map(csvCell).join(","));
  }

  // Prepend a UTF-8 BOM so Excel renders accents correctly.
  const csv = "﻿" + lines.join("\r\n");

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}-respuestas.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
