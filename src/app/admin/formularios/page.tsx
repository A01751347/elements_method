import { sql } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { forms, formTokens, formResponses } from "@/shared/db/schema/forms";
import {
  PageHeader,
  Boton,
  Filtros,
  Conteo,
  Tabla,
  Th,
  Td,
  FilaEnlace,
  EnlaceFila,
  Insignia,
  EstadoVacio,
} from "../_components/ui";
import { FORM_CATEGORY_LABEL } from "./labels";

export const dynamic = "force-dynamic";

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
      .select({ formId: formResponses.formId, c: sql<number>`count(*)`.mapWith(Number) })
      .from(formResponses)
      .groupBy(formResponses.formId);
    const respMap = new Map(counts.map((c) => [c.formId, c.c]));

    const tokenCounts = await db
      .select({ formId: formTokens.formId, c: sql<number>`count(*)`.mapWith(Number) })
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

function hrefFor(categoria?: string) {
  const sp = new URLSearchParams();
  if (categoria) sp.set("categoria", categoria);
  const qs = sp.toString();
  return `/admin/formularios${qs ? `?${qs}` : ""}`;
}

export default async function AdminFormsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const list = await loadForms();
  const categoriaFiltro = categoria && categoria in FORM_CATEGORY_LABEL ? categoria : undefined;
  const filtered = list.filter((f) => (categoriaFiltro ? (f.category ?? "custom") === categoriaFiltro : true));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Formularios"
        subtitle="Cuestionarios que se envían a participantes con un enlace de un solo uso. Crea los que necesites y define sus preguntas."
        actions={
          <Boton tone="primario" href="/admin/formularios/nuevo">
            + Nuevo formulario
          </Boton>
        }
      />

      {list.length === 0 ? (
        <EstadoVacio
          title="No hay formularios."
          body="Corre pnpm db:seed para crear los tres estándar (inicio · durante · cierre) o crea uno nuevo."
          action={
            <Boton tone="secundario" href="/admin/formularios/nuevo">
              + Nuevo formulario
            </Boton>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          <Filtros
            items={[
              { href: hrefFor(undefined), label: "Todas", count: list.length, active: !categoriaFiltro },
              ...Object.entries(FORM_CATEGORY_LABEL).map(([key, label]) => ({
                href: hrefFor(key),
                label,
                count: list.filter((f) => (f.category ?? "custom") === key).length,
                active: categoriaFiltro === key,
              })),
            ]}
          />
          <Conteo n={filtered.length} singular="formulario encontrado" plural="formularios encontrados" />
          <Tabla>
            <thead>
              <tr>
                <Th>Formulario</Th>
                <Th>Categoría</Th>
                <Th align="right">Preguntas</Th>
                <Th align="right">Enlaces enviados</Th>
                <Th align="right">Respuestas</Th>
                <Th>Estado</Th>
                <Th align="right">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <FilaEnlace key={f.id}>
                  <Td>
                    <EnlaceFila href={`/admin/formularios/${f.slug}`}>{f.titleEs}</EnlaceFila>
                    <p className="pista">{f.isAnonymous ? "Anónimo" : "Nominal"}</p>
                  </Td>
                  <Td>
                    <Insignia tone="contorno">{FORM_CATEGORY_LABEL[f.category ?? "custom"] ?? f.category}</Insignia>
                  </Td>
                  <Td numeric>{f.fieldCount}</Td>
                  <Td numeric>{f.tokenCount}</Td>
                  <Td numeric>
                    <strong>{f.responseCount}</strong>
                  </Td>
                  <Td>
                    <Insignia tone={f.active ? "ok" : "neutra"}>{f.active ? "Activo" : "Inactivo"}</Insignia>
                  </Td>
                  <Td align="right" className="sobre-fila">
                    <div className="flex justify-end gap-2">
                      <Boton tone="secundario" className="boton-chico" href={`/admin/formularios/${f.slug}/editar`}>
                        Editar
                      </Boton>
                      <Boton tone="primario" className="boton-chico" href={`/admin/formularios/${f.slug}/enviar`}>
                        Enviar
                      </Boton>
                    </div>
                  </Td>
                </FilaEnlace>
              ))}
            </tbody>
          </Tabla>
        </div>
      )}
    </div>
  );
}
