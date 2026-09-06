import { asc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { documentTemplates } from "@/shared/db/schema";
import {
  PageHeader,
  Banner,
  Filtros,
  Conteo,
  Tabla,
  Th,
  Td,
  FilaEnlace,
  EnlaceFila,
  Insignia,
  Boton,
  EstadoVacio,
} from "../_components/ui";
import { APPLIES_TO_LABEL, ACCEPTANCE_TYPE_LABEL } from "./labels";

export const dynamic = "force-dynamic";

async function loadTemplates() {
  try {
    return await db.select().from(documentTemplates).orderBy(asc(documentTemplates.nameEs));
  } catch (e) {
    console.error("[admin/documentos] DB read failed", e);
    return [];
  }
}

function hrefFor(activo?: string) {
  const sp = new URLSearchParams();
  if (activo) sp.set("activo", activo);
  const qs = sp.toString();
  return `/admin/documentos${qs ? `?${qs}` : ""}`;
}

export default async function AdminDocumentTemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ activo?: string }>;
}) {
  const { activo } = await searchParams;
  const list = await loadTemplates();
  const activoFiltro = activo === "activas" ? true : activo === "inactivas" ? false : undefined;
  const filtered = list.filter((t) => (activoFiltro === undefined ? true : t.active === activoFiltro));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Documentos"
        subtitle="Plantillas legales que el comprador acepta en el checkout y que generan los PDF. Cada fila abre la plantilla."
      />

      <Banner tone="info">
        Las páginas públicas /legal/[slug] se sirven desde el código (src/data/legalDocuments.ts); estas
        plantillas alimentan el checkout y los PDF.
      </Banner>

      {list.length === 0 ? (
        <EstadoVacio
          title="No hay plantillas en la base de datos."
          body="Corre pnpm db:seed para cargar las plantillas iniciales."
        />
      ) : (
        <div className="flex flex-col gap-4">
          <Filtros
            items={[
              { href: hrefFor(undefined), label: "Todas", count: list.length, active: activoFiltro === undefined },
              {
                href: hrefFor("activas"),
                label: "Activas",
                count: list.filter((t) => t.active).length,
                active: activoFiltro === true,
              },
              {
                href: hrefFor("inactivas"),
                label: "Inactivas",
                count: list.filter((t) => !t.active).length,
                active: activoFiltro === false,
              },
            ]}
          />
          <Conteo n={filtered.length} singular="plantilla encontrada" plural="plantillas encontradas" />
          <Tabla>
            <thead>
              <tr>
                <Th>Documento</Th>
                <Th>Aplica a</Th>
                <Th>Aceptación</Th>
                <Th>Requerido</Th>
                <Th align="right">Versión</Th>
                <Th>Estado</Th>
                <Th>PDF</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <FilaEnlace key={t.id}>
                  <Td>
                    <EnlaceFila href={`/admin/documentos/${t.slug}`}>{t.nameEs}</EnlaceFila>
                    <p className="pista">{t.slug}</p>
                  </Td>
                  <Td>
                    <Insignia tone="contorno">{APPLIES_TO_LABEL[t.appliesTo] ?? t.appliesTo}</Insignia>
                  </Td>
                  <Td>
                    <span className="pista">{ACCEPTANCE_TYPE_LABEL[t.acceptanceType] ?? t.acceptanceType}</span>
                  </Td>
                  <Td>
                    <span className={`texto-12 ${t.requiredForPurchase ? "texto-ok" : "texto-tenue"}`}>
                      {t.requiredForPurchase ? "Sí" : "No"}
                    </span>
                  </Td>
                  <Td numeric>v{t.currentVersion}</Td>
                  <Td>
                    <Insignia tone={t.active ? "ok" : "neutra"}>{t.active ? "Activa" : "Inactiva"}</Insignia>
                  </Td>
                  <Td className="sobre-fila">
                    <Boton tone="texto" href={`/api/documento/${t.slug}`} external>
                      Ver PDF
                    </Boton>
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
