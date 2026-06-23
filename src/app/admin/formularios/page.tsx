import Link from "next/link";
import { sql } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { forms, formTokens, formResponses } from "@/shared/db/schema/forms";
import {
  AdminPageHeader,
  AdminTable,
  AdminSecondaryButton,
  PlaceholderNote,
  StatusPill,
  Td,
  Th,
} from "../_components/admin-ui";

async function loadForms() {
  try {
    const rows = await db
      .select({
        id: forms.id,
        slug: forms.slug,
        titleEs: forms.titleEs,
        category: forms.category,
        isAnonymous: forms.isAnonymous,
        active: forms.active,
        fields: forms.fields,
      })
      .from(forms);

    const counts = await db
      .select({
        formId: formResponses.formId,
        c: sql<number>`count(*)`.mapWith(Number),
      })
      .from(formResponses)
      .groupBy(formResponses.formId);
    const respMap = new Map(counts.map((c) => [c.formId, c.c]));

    const tokenCounts = await db
      .select({
        formId: formTokens.formId,
        c: sql<number>`count(*)`.mapWith(Number),
      })
      .from(formTokens)
      .groupBy(formTokens.formId);
    const tokenMap = new Map(tokenCounts.map((c) => [c.formId, c.c]));

    return rows.map((r) => ({
      ...r,
      responseCount: respMap.get(r.id) ?? 0,
      tokenCount: tokenMap.get(r.id) ?? 0,
      fieldCount: Array.isArray(r.fields) ? r.fields.length : 0,
    }));
  } catch (e) {
    console.error("[admin/formularios] DB read failed", e);
    return [];
  }
}

export default async function AdminFormsPage() {
  const list = await loadForms();
  const empty = list.length === 0;

  return (
    <>
      <AdminPageHeader
        title="Formularios"
        subtitle="Cuestionarios de inicio, durante y cierre que se envían a participantes con un enlace de un solo uso."
        count={list.length}
      />
      {empty && (
        <div className="mb-6 border-l-2 border-amber-500 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          <strong>Sin datos en DB.</strong> Corre <code className="font-mono bg-amber-100 px-1">pnpm db:seed</code>{" "}
          para crear los 3 formularios estándar (inicio · durante · cierre).
        </div>
      )}
      <PlaceholderNote />

      <AdminTable>
        <thead>
          <tr>
            <Th>Slug</Th>
            <Th>Título</Th>
            <Th>Categoría</Th>
            <Th>Campos</Th>
            <Th>Tokens emitidos</Th>
            <Th>Respuestas</Th>
            <Th>Status</Th>
            <Th className="text-right">Acciones</Th>
          </tr>
        </thead>
        <tbody>
          {list.map((f) => (
            <tr key={f.id} className="hover:bg-zinc-50">
              <Td className="font-mono text-xs">{f.slug}</Td>
              <Td>
                <div className="font-medium">{f.titleEs}</div>
                <div className="text-xs text-zinc-500">{f.isAnonymous ? "Anónimo" : "Nominal"}</div>
              </Td>
              <Td>
                <StatusPill
                  status={f.category ?? "—"}
                  variant={
                    f.category === "inicio"
                      ? "blue"
                      : f.category === "durante"
                        ? "amber"
                        : f.category === "cierre"
                          ? "green"
                          : "neutral"
                  }
                />
              </Td>
              <Td className="tabular-nums text-xs">{f.fieldCount}</Td>
              <Td className="tabular-nums text-xs">{f.tokenCount}</Td>
              <Td className="tabular-nums text-sm font-medium">{f.responseCount}</Td>
              <Td>
                <StatusPill
                  status={f.active ? "Activo" : "Inactivo"}
                  variant={f.active ? "green" : "neutral"}
                />
              </Td>
              <Td className="text-right whitespace-nowrap">
                <div className="flex justify-end gap-1.5">
                  <AdminSecondaryButton href={`/admin/formularios/${f.slug}`}>
                    Ver
                  </AdminSecondaryButton>
                  <Link
                    href={`/admin/formularios/${f.slug}/enviar`}
                    className="inline-flex items-center gap-1 bg-zinc-900 text-white px-3 py-1.5 text-xs hover:bg-zinc-800 transition-colors"
                  >
                    Enviar
                  </Link>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </>
  );
}
