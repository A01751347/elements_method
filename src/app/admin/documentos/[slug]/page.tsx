import { notFound } from "next/navigation";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { documentTemplates, documentVersions, orderDocuments, orders } from "@/shared/db/schema";
import { extractLegalTokens } from "@/data/legalDocuments";
import {
  FichaHeader,
  Insignia,
  SeccionEtiqueta,
  Campo,
  Input,
  Textarea,
  Select,
  Checkbox,
  Tabla,
  Th,
  Td,
  FilaEnlace,
  EnlaceFila,
  Detalle,
  Boton,
} from "../../_components/ui";
import { BotonPendiente, ConfirmarAccion } from "../../_components/client";
import { fechaCorta } from "../../_lib/format";
import { APPLIES_TO_LABEL, ACCEPTANCE_TYPE_LABEL } from "../labels";
import { guardarPlantilla, guardarComoNuevaVersion, alternarActiva } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminDocumentTemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [template] = await db.select().from(documentTemplates).where(eq(documentTemplates.slug, slug)).limit(1);
  if (!template) notFound();

  const [countRow] = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(orderDocuments)
    .where(eq(orderDocuments.documentTemplateId, template.id));
  const acceptanceCount = countRow?.count ?? 0;

  const recentAcceptances = await db
    .select({
      orderId: orders.id,
      folio: orders.folio,
      buyerName: orders.buyerName,
      documentVersion: orderDocuments.documentVersion,
      accepted: orderDocuments.accepted,
      orderCreatedAt: orders.createdAt,
    })
    .from(orderDocuments)
    .innerJoin(orders, eq(orderDocuments.orderId, orders.id))
    .where(eq(orderDocuments.documentTemplateId, template.id))
    .orderBy(desc(orders.createdAt))
    .limit(10);

  const versions = await db
    .select()
    .from(documentVersions)
    .where(eq(documentVersions.templateId, template.id))
    .orderBy(desc(documentVersions.versionNumber));

  const tokens = Array.from(
    new Set([...extractLegalTokens(template.templateHtmlEs), ...extractLegalTokens(template.templateHtmlEn ?? "")]),
  );

  const boundGuardar = guardarPlantilla.bind(null, template.id);
  const boundNuevaVersion = guardarComoNuevaVersion.bind(null, template.id);

  return (
    <div className="flex flex-col gap-8">
      <FichaHeader
        back={{ href: "/admin/documentos", label: "Documentos" }}
        kicker={`Plantilla · v${template.currentVersion}`}
        title={template.nameEs}
        badge={<Insignia tone={template.active ? "ok" : "neutra"}>{template.active ? "Activa" : "Inactiva"}</Insignia>}
        meta={`${APPLIES_TO_LABEL[template.appliesTo] ?? template.appliesTo} · ${
          ACCEPTANCE_TYPE_LABEL[template.acceptanceType] ?? template.acceptanceType
        } · ${template.requiredForPurchase ? "Requerido" : "No requerido"}`}
        aside={{ label: "Aceptaciones", value: acceptanceCount }}
      />

      <div className="ficha-columnas">
        <form action={boundGuardar} className="flex flex-col gap-10">
          <section className="flex flex-col gap-4">
            <SeccionEtiqueta>Identidad</SeccionEtiqueta>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Nombre (ES)" htmlFor="nameEs" required>
                <Input id="nameEs" name="nameEs" defaultValue={template.nameEs} required />
              </Campo>
              <Campo label="Nombre (EN)" htmlFor="nameEn">
                <Input id="nameEn" name="nameEn" defaultValue={template.nameEn ?? ""} />
              </Campo>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <SeccionEtiqueta>Plantilla (ES)</SeccionEtiqueta>
            <Campo
              label="Cuerpo en español"
              htmlFor="templateHtmlEs"
              hint="Markdown. Los tokens {{NOMBRE}} se rellenan con los datos de la orden al generar el PDF."
              required
            >
              <Textarea id="templateHtmlEs" name="templateHtmlEs" rows={22} defaultValue={template.templateHtmlEs} required />
            </Campo>
            {tokens.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tokens.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-4">
            <SeccionEtiqueta>Plantilla (EN)</SeccionEtiqueta>
            <Campo label="Cuerpo en inglés" htmlFor="templateHtmlEn">
              <Textarea id="templateHtmlEn" name="templateHtmlEn" rows={22} defaultValue={template.templateHtmlEn ?? ""} />
            </Campo>
          </section>

          <section className="flex flex-col gap-4">
            <SeccionEtiqueta>Reglas</SeccionEtiqueta>
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Aplica a" htmlFor="appliesTo">
                <Select id="appliesTo" name="appliesTo" defaultValue={template.appliesTo}>
                  <option value="persona">Persona</option>
                  <option value="empresa">Empresa</option>
                  <option value="ambos">Ambos</option>
                </Select>
              </Campo>
              <Campo label="Tipo de aceptación" htmlFor="acceptanceType">
                <Select id="acceptanceType" name="acceptanceType" defaultValue={template.acceptanceType}>
                  <option value="check_only">Casilla</option>
                  <option value="signature_upload">Firma</option>
                </Select>
              </Campo>
            </div>
            <Checkbox name="requiredForPurchase" label="Debe aceptarse antes de pagar" defaultChecked={template.requiredForPurchase} />
            <Checkbox name="active" label="Plantilla activa" defaultChecked={template.active} />
          </section>

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <BotonPendiente pendingLabel="Guardando…">Guardar cambios</BotonPendiente>
              <button type="submit" formAction={boundNuevaVersion} className="boton boton-secundario">
                Guardar como nueva versión
              </button>
            </div>
            <p className="pista">
              Crea la versión v{template.currentVersion + 1}: las aceptaciones anteriores conservan la versión
              exacta que firmaron.
            </p>
          </div>
        </form>

        <aside className="ficha-trabajo">
          <div className="flex flex-col gap-2 items-start">
            <SeccionEtiqueta>Vista previa</SeccionEtiqueta>
            <Boton tone="texto" href={`/api/documento/${template.slug}`} external>
              Ver PDF (ES)
            </Boton>
            <Boton tone="texto" href={`/api/documento/${template.slug}?lang=en`} external>
              Ver PDF (EN)
            </Boton>
          </div>

          <div>
            <SeccionEtiqueta>Aceptaciones recientes</SeccionEtiqueta>
            {recentAcceptances.length === 0 ? (
              <p className="pista">Todavía no hay aceptaciones registradas.</p>
            ) : (
              <Tabla>
                <thead>
                  <tr>
                    <Th>Folio</Th>
                    <Th>Comprador</Th>
                    <Th align="right">Versión</Th>
                    <Th>Aceptado</Th>
                    <Th>Fecha</Th>
                  </tr>
                </thead>
                <tbody>
                  {recentAcceptances.map((a) => (
                    <FilaEnlace key={`${a.orderId}-${a.documentVersion}`}>
                      <Td>
                        <EnlaceFila href={`/admin/pagos/${a.folio}`}>{a.folio}</EnlaceFila>
                      </Td>
                      <Td secondary>{a.buyerName}</Td>
                      <Td numeric>v{a.documentVersion}</Td>
                      <Td>{a.accepted ? "✓" : "—"}</Td>
                      <Td secondary>{fechaCorta(a.orderCreatedAt)}</Td>
                    </FilaEnlace>
                  ))}
                </tbody>
              </Tabla>
            )}
          </div>

          <div>
            <SeccionEtiqueta>Zona de riesgo</SeccionEtiqueta>
            <ConfirmarAccion
              trigger={template.active ? "Desactivar plantilla" : "Activar plantilla"}
              title={template.active ? "Desactivar esta plantilla" : "Activar esta plantilla"}
              body={
                template.active
                  ? "La plantilla deja de exigirse en el checkout de inmediato. Las aceptaciones ya firmadas no cambian."
                  : "La plantilla vuelve a exigirse en el checkout según sus reglas de «aplica a»."
              }
              confirmLabel={template.active ? "Sí, desactivar" : "Sí, activar"}
              pendingLabel="Guardando…"
              action={alternarActiva}
              tone={template.active ? "peligro" : "tinta"}
              hidden={[
                { name: "id", value: template.id },
                { name: "next", value: String(!template.active) },
              ]}
            />
          </div>
        </aside>
      </div>

      <div className="flex flex-col gap-4" style={{ borderTop: "1px solid var(--tinta)", paddingTop: 24 }}>
        <Detalle summary="Historial de versiones">
          {versions.length === 0 ? (
            <p className="pista">Sin versiones registradas todavía.</p>
          ) : (
            <Tabla>
              <thead>
                <tr>
                  <Th align="right">Versión</Th>
                  <Th>Fecha</Th>
                  <Th>Extracto</Th>
                </tr>
              </thead>
              <tbody>
                {versions.map((v) => (
                  <tr key={v.id}>
                    <Td numeric>v{v.versionNumber}</Td>
                    <Td>{fechaCorta(v.createdAt)}</Td>
                    <Td secondary>
                      {v.templateHtmlEs.slice(0, 120)}
                      {v.templateHtmlEs.length > 120 ? "…" : ""}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Tabla>
          )}
        </Detalle>
      </div>
    </div>
  );
}
