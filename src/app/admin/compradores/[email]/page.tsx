import { notFound } from "next/navigation";
import { desc, eq, inArray, or } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orders, orderDocuments, documentTemplates, formResponses, forms } from "@/shared/db/schema";
import {
  FichaHeader,
  Etiqueta,
  Insignia,
  Cifra,
  CifraGrid,
  Tabla,
  Th,
  Td,
  FilaEnlace,
  EnlaceFila,
  Detalle,
  Boton,
} from "../../_components/ui";
import { ORDER_STATUS, PAYMENT_METHOD, estado } from "../../_lib/status";
import { mxn, fechaCorta, fechaHora } from "../../_lib/format";

export const dynamic = "force-dynamic";

async function cargarOrdenesComprador(email: string) {
  return db.select().from(orders).where(eq(orders.buyerEmail, email)).orderBy(desc(orders.createdAt));
}

async function cargarDocumentos(orderIds: string[]) {
  if (orderIds.length === 0) return [];
  return db
    .select({
      id: orderDocuments.id,
      orderId: orderDocuments.orderId,
      nameEs: documentTemplates.nameEs,
      version: orderDocuments.documentVersion,
      accepted: orderDocuments.accepted,
      acceptedAt: orderDocuments.acceptedAt,
    })
    .from(orderDocuments)
    .innerJoin(documentTemplates, eq(documentTemplates.id, orderDocuments.documentTemplateId))
    .where(inArray(orderDocuments.orderId, orderIds));
}

async function cargarRespuestas(email: string, orderIds: string[]) {
  const condicion =
    orderIds.length > 0
      ? or(eq(formResponses.respondentEmail, email), inArray(formResponses.orderId, orderIds))
      : eq(formResponses.respondentEmail, email);
  return db
    .select({
      id: formResponses.id,
      orderId: formResponses.orderId,
      titleEs: forms.titleEs,
      respondentName: formResponses.respondentName,
      createdAt: formResponses.createdAt,
    })
    .from(formResponses)
    .innerJoin(forms, eq(forms.id, formResponses.formId))
    .where(condicion)
    .orderBy(desc(formResponses.createdAt));
}

export default async function CompradorFichaPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email: emailParam } = await params;
  const email = decodeURIComponent(emailParam);

  const ordenes = await cargarOrdenesComprador(email);
  if (ordenes.length === 0) notFound();

  const orderIds = ordenes.map((o) => o.id);
  const folioPorOrden = new Map(ordenes.map((o) => [o.id, o.folio]));
  const [documentos, respuestas] = await Promise.all([
    cargarDocumentos(orderIds),
    cargarRespuestas(email, orderIds),
  ]);

  const masReciente = ordenes[0];
  const pagadas = ordenes.filter((o) => o.status === "paid");
  const pendientes = ordenes.filter((o) => o.status === "pending_payment" || o.status === "pending_documents");
  const totalPagado = pagadas.reduce((acc, o) => acc + Number(o.total), 0);

  return (
    <div className="flex flex-col gap-8">
      <FichaHeader
        back={{ href: "/admin/compradores", label: "Compradores" }}
        kicker="Comprador"
        title={masReciente.buyerName}
        badge={<Insignia tone="contorno">{masReciente.buyerType === "empresa" ? "Empresa" : "Persona"}</Insignia>}
        meta={`${masReciente.buyerEmail}${masReciente.buyerPhone ? ` · ${masReciente.buyerPhone}` : ""}${masReciente.buyerCompany ? ` · ${masReciente.buyerCompany}` : ""}`}
        aside={{ label: "Total pagado", value: mxn(totalPagado) }}
      />

      <div className="flex justify-end">
        <Boton tone="secundario" href={`mailto:${email}`}>
          Escribir correo ✉
        </Boton>
      </div>

      <CifraGrid>
        <Cifra label="Órdenes" value={ordenes.length} />
        <Cifra label="Pagadas" value={pagadas.length} tone="ok" />
        <Cifra label="Pendientes" value={pendientes.length} tone={pendientes.length > 0 ? "alerta" : "neutro"} />
        <Cifra label="Total pagado" value={mxn(totalPagado)} tone="ok" />
      </CifraGrid>

      <div className="flex flex-col gap-3">
        <Etiqueta as="h2">Órdenes</Etiqueta>
        <Tabla>
          <thead>
            <tr>
              <Th>Folio</Th>
              <Th>Fecha</Th>
              <Th align="right">Total</Th>
              <Th>Método</Th>
              <Th>Estado</Th>
              <Th align="right">Comprobante</Th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((o) => {
              const st = estado(ORDER_STATUS, o.status);
              const pm = estado(PAYMENT_METHOD, o.paymentMethod);
              return (
                <FilaEnlace key={o.id}>
                  <Td>
                    <EnlaceFila href={`/admin/pagos/${o.folio}`}>{o.folio}</EnlaceFila>
                  </Td>
                  <Td>{fechaCorta(o.createdAt)}</Td>
                  <Td numeric>{mxn(o.total, o.currency)}</Td>
                  <Td>
                    <Insignia tone="contorno">{pm.label}</Insignia>
                  </Td>
                  <Td>
                    <Insignia tone={st.tone}>{st.label}</Insignia>
                  </Td>
                  <Td align="right">
                    <a href={`/api/comprobante/${o.folio}`} target="_blank" rel="noreferrer" className="sobre-fila">
                      PDF ↗
                    </a>
                  </Td>
                </FilaEnlace>
              );
            })}
          </tbody>
        </Tabla>
      </div>

      <div style={{ borderTop: "1px solid var(--tinta)", marginTop: 8, paddingTop: 8 }}>
        <Detalle summary="Documentos aceptados">
          {documentos.length === 0 ? (
            <p>Ninguna de sus órdenes registró documentos.</p>
          ) : (
            <Tabla>
              <thead>
                <tr>
                  <Th>Orden</Th>
                  <Th>Nombre</Th>
                  <Th>Versión</Th>
                  <Th>Aceptado</Th>
                  <Th>Fecha</Th>
                </tr>
              </thead>
              <tbody>
                {documentos.map((d) => (
                  <tr key={d.id}>
                    <Td secondary>{folioPorOrden.get(d.orderId) ?? "—"}</Td>
                    <Td>{d.nameEs}</Td>
                    <Td>v{d.version}</Td>
                    <Td>{d.accepted ? "✓" : "—"}</Td>
                    <Td>{d.acceptedAt ? fechaHora(d.acceptedAt) : "—"}</Td>
                  </tr>
                ))}
              </tbody>
            </Tabla>
          )}
        </Detalle>

        <Detalle summary="Cuestionarios respondidos">
          {respuestas.length === 0 ? (
            <p>Todavía no responde ningún cuestionario.</p>
          ) : (
            <Tabla>
              <thead>
                <tr>
                  <Th>Orden</Th>
                  <Th>Formulario</Th>
                  <Th>Quien respondió</Th>
                  <Th>Fecha</Th>
                </tr>
              </thead>
              <tbody>
                {respuestas.map((r) => (
                  <tr key={r.id}>
                    <Td secondary>{r.orderId ? (folioPorOrden.get(r.orderId) ?? "—") : "—"}</Td>
                    <Td>{r.titleEs}</Td>
                    <Td secondary>{r.respondentName || "—"}</Td>
                    <Td>{fechaHora(r.createdAt)}</Td>
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
