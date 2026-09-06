import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/shared/db/client";
import {
  orders,
  products,
  orderDocuments,
  documentTemplates,
  formTokens,
  formResponses,
  forms,
} from "@/shared/db/schema";
import { FichaHeader, Etiqueta, Insignia, DatoLista, Detalle, Boton, Tabla, Th, Td } from "../../_components/ui";
import { ConfirmarAccion } from "../../_components/client";
import { ORDER_STATUS, PAYMENT_METHOD, TOKEN_STATE, estado, type Estado } from "../../_lib/status";
import { mxn, fechaHora } from "../../_lib/format";
import { keyFromUrl } from "@/shared/integrations/s3";
import { marcarPagada, cancelarOrden, registrarReembolso } from "../actions";

export const dynamic = "force-dynamic";

const MONO = "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace";

/** Los comprobantes viven en un bucket privado; se pasa por la ruta admin-gated que firma un GET corto. */
function proofHref(url: string): string {
  const key = keyFromUrl(url);
  return key ? `/api/transferencias/comprobante?key=${encodeURIComponent(key)}` : url;
}

async function cargarOrden(folio: string) {
  const [order] = await db.select().from(orders).where(eq(orders.folio, folio)).limit(1);
  return order ?? null;
}

async function cargarProductos(ids: number[]) {
  if (ids.length === 0) return [];
  return db.select().from(products).where(inArray(products.id, ids));
}

async function cargarDocumentos(orderId: string) {
  return db
    .select({
      id: orderDocuments.id,
      nameEs: documentTemplates.nameEs,
      version: orderDocuments.documentVersion,
      accepted: orderDocuments.accepted,
      acceptedAt: orderDocuments.acceptedAt,
      ipAddress: orderDocuments.ipAddress,
      signedPdfUrl: orderDocuments.signedPdfUrl,
    })
    .from(orderDocuments)
    .innerJoin(documentTemplates, eq(documentTemplates.id, orderDocuments.documentTemplateId))
    .where(eq(orderDocuments.orderId, orderId));
}

async function cargarTokens(orderId: string) {
  return db
    .select({
      id: formTokens.id,
      titleEs: forms.titleEs,
      recipientEmail: formTokens.recipientEmail,
      sentAt: formTokens.sentAt,
      expiresAt: formTokens.expiresAt,
      usedAt: formTokens.usedAt,
    })
    .from(formTokens)
    .innerJoin(forms, eq(forms.id, formTokens.formId))
    .where(eq(formTokens.orderId, orderId));
}

async function cargarRespuestas(orderId: string) {
  return db
    .select({
      id: formResponses.id,
      titleEs: forms.titleEs,
      respondentName: formResponses.respondentName,
      respondentEmail: formResponses.respondentEmail,
      createdAt: formResponses.createdAt,
    })
    .from(formResponses)
    .innerJoin(forms, eq(forms.id, formResponses.formId))
    .where(eq(formResponses.orderId, orderId));
}

function estadoToken(t: { usedAt: Date | null; expiresAt: Date }): Estado {
  if (t.usedAt) return estado(TOKEN_STATE, "respondido");
  if (new Date(t.expiresAt).getTime() < Date.now()) return estado(TOKEN_STATE, "expirado");
  return estado(TOKEN_STATE, "pendiente");
}

export default async function OrdenFichaPage({
  params,
}: {
  params: Promise<{ folio: string }>;
}) {
  const { folio } = await params;
  const order = await cargarOrden(folio);
  if (!order) notFound();

  const [productosDb, documentos, tokens, respuestas] = await Promise.all([
    cargarProductos(order.productIds),
    cargarDocumentos(order.id),
    cargarTokens(order.id),
    cargarRespuestas(order.id),
  ]);

  const mapaProductos = new Map(productosDb.map((p) => [p.id, p]));
  const productosEnOrden = order.productIds
    .map((id) => mapaProductos.get(id))
    .filter((p): p is (typeof productosDb)[number] => Boolean(p));

  const st = estado(ORDER_STATUS, order.status);
  const pm = estado(PAYMENT_METHOD, order.paymentMethod);
  const idioma = order.language === "en" ? "en" : "es";
  const hiddenOrderId = [{ name: "orderId", value: order.id }];

  const pagoItems: { label: string; value: ReactNode }[] = [{ label: "Método", value: pm.label }];
  if (order.stripeSessionId) {
    pagoItems.push({
      label: "Sesión Stripe",
      value: (
        <span
          title={order.stripeSessionId}
          style={{
            fontFamily: MONO,
            fontSize: 12,
            display: "inline-block",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            verticalAlign: "bottom",
          }}
        >
          {order.stripeSessionId}
        </span>
      ),
    });
  }
  if (order.transferProofUrl) {
    pagoItems.push({
      label: "Comprobante SPEI",
      value: (
        <a href={proofHref(order.transferProofUrl)} target="_blank" rel="noreferrer">
          Ver comprobante ↗
        </a>
      ),
    });
  }
  if (order.transferValidatedBy) {
    pagoItems.push({ label: "Validado por", value: order.transferValidatedBy });
  }
  if (order.transferValidatedAt) {
    pagoItems.push({ label: "Validado el", value: fechaHora(order.transferValidatedAt) });
  }
  pagoItems.push({ label: "Pagado el", value: order.paidAt ? fechaHora(order.paidAt) : "—" });
  pagoItems.push({ label: "Actualizado el", value: fechaHora(order.updatedAt) });

  const eventos = (
    [
      { label: "Orden creada", date: order.createdAt },
      order.paidAt ? { label: "Pago registrado", date: order.paidAt } : null,
      order.transferValidatedAt ? { label: "Transferencia validada", date: order.transferValidatedAt } : null,
      { label: "Última actualización", date: order.updatedAt },
    ].filter(Boolean) as { label: string; date: Date }[]
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="flex flex-col gap-8">
      <FichaHeader
        back={{ href: "/admin/pagos", label: "Órdenes" }}
        kicker={fechaHora(order.createdAt)}
        title={order.folio}
        badge={<Insignia tone={st.tone}>{st.label}</Insignia>}
        meta={`${pm.label} · ${idioma} · ${order.productIds.length} producto${order.productIds.length === 1 ? "" : "s"}`}
        aside={{ label: "Total", value: mxn(order.total, order.currency) }}
      />

      <p className="ficha-cabecera-meta">
        <span className="etiqueta">Pago</span> {st.label} · {pm.label}
      </p>

      <div className="ficha-columnas">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <Etiqueta as="h2">Productos</Etiqueta>
            {productosEnOrden.length === 0 ? (
              <p className="texto-tenue">Esta orden no tiene productos asociados.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {productosEnOrden.map((p) => (
                  <div key={p.id} className="renglon-destacado">
                    <p className="renglon-destacado-titulo">{p.nameEs}</p>
                    <p className="texto-tenue texto-13">
                      {mxn(order.currency === "USD" && p.priceUsd ? p.priceUsd : p.priceMxn, order.currency)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Etiqueta as="h2">Comprador</Etiqueta>
            <DatoLista
              columns={3}
              items={[
                { label: "Nombre", value: order.buyerName },
                {
                  label: "Correo",
                  value: <a href={`mailto:${order.buyerEmail}`}>{order.buyerEmail}</a>,
                },
                { label: "Teléfono", value: order.buyerPhone || "—" },
                { label: "Tipo", value: order.buyerType === "empresa" ? "Empresa" : "Persona" },
                { label: "Empresa", value: order.buyerCompany || "—" },
                { label: "RFC", value: order.buyerRfc || "—" },
                { label: "Dirección", value: order.buyerAddress || "—" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Etiqueta as="h2">Importes</Etiqueta>
            <DatoLista
              items={[
                { label: "Subtotal", value: mxn(order.subtotal, order.currency) },
                {
                  label: "Descuento",
                  value:
                    Number(order.discount) > 0
                      ? `${mxn(order.discount, order.currency)}${order.discountRule ? ` — ${order.discountRule}` : ""}`
                      : mxn(0, order.currency),
                },
                { label: "IVA", value: mxn(order.iva, order.currency) },
                { label: "Total", value: mxn(order.total, order.currency) },
                { label: "Moneda", value: order.currency },
              ]}
            />
          </div>
        </div>

        <div className="ficha-trabajo">
          <div className="flex flex-col gap-3">
            <Etiqueta as="h2">Acción pendiente</Etiqueta>

            {order.status === "pending_transfer_validation" && (
              <>
                <p>Llegó un comprobante de transferencia. Revísalo y confirma que el depósito está reflejado en el banco.</p>
                {order.transferProofUrl && (
                  <p>
                    <a href={proofHref(order.transferProofUrl)} target="_blank" rel="noreferrer">
                      Ver comprobante ↗
                    </a>
                  </p>
                )}
                <ConfirmarAccion
                  trigger="Marcar como pagada"
                  title="Confirmar pago"
                  body="La orden queda «pagada», se registra tu correo como validador y el comprador recibe su comprobante por correo."
                  confirmLabel="Sí, marcar como pagada"
                  pendingLabel="Registrando el pago…"
                  action={marcarPagada}
                  tone="tinta"
                  hidden={hiddenOrderId}
                />
              </>
            )}

            {(order.status === "pending_payment" || order.status === "pending_documents") && (
              <>
                <p>
                  {order.status === "pending_documents"
                    ? "El comprador todavía no completa los documentos requeridos para continuar."
                    : order.paymentMethod === "stripe"
                      ? "El comprador no ha completado el pago en Stripe."
                      : "El comprador eligió depósito y aún no sube comprobante."}
                </p>
                <div className="flex flex-wrap gap-3">
                  <ConfirmarAccion
                    trigger="Marcar como pagada"
                    title="Confirmar pago"
                    body="La orden queda «pagada», se registra tu correo como validador y el comprador recibe su comprobante por correo."
                    confirmLabel="Sí, marcar como pagada"
                    pendingLabel="Registrando el pago…"
                    action={marcarPagada}
                    tone="tinta"
                    hidden={hiddenOrderId}
                  />
                  <ConfirmarAccion
                    trigger="Cancelar orden"
                    title="Cancelar la orden"
                    body="La orden pasa a «cancelada». No se envía ningún correo ni se devuelve dinero; esto solo cierra el registro."
                    confirmLabel="Sí, cancelar la orden"
                    pendingLabel="Cancelando…"
                    action={cancelarOrden}
                    tone="peligro"
                    hidden={hiddenOrderId}
                  />
                </div>
              </>
            )}

            {order.status === "paid" && (
              <>
                <p>Nada pendiente. La orden está pagada.</p>
                <ConfirmarAccion
                  trigger="Registrar reembolso"
                  title="Registrar reembolso"
                  body="La orden pasa a «reembolsada». El reembolso en Stripe o el depósito de vuelta lo haces tú fuera del panel; aquí solo se registra."
                  confirmLabel="Sí, registrar el reembolso"
                  pendingLabel="Registrando el reembolso…"
                  action={registrarReembolso}
                  tone="peligro"
                  hidden={hiddenOrderId}
                />
              </>
            )}

            {(order.status === "cancelled" || order.status === "refunded") && (
              <>
                <p>Orden cerrada.</p>
                <Insignia tone="invertida">{st.label}</Insignia>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Etiqueta as="h2">Pago</Etiqueta>
            <DatoLista items={pagoItems} columns={1} />
            <Boton tone="secundario" href={`/api/comprobante/${order.folio}`} external>
              Comprobante PDF
            </Boton>
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--tinta)", marginTop: 8, paddingTop: 8 }}>
        <Detalle summary="Documentos aceptados">
          {documentos.length === 0 ? (
            <p>Esta orden no registró documentos.</p>
          ) : (
            <Tabla>
              <thead>
                <tr>
                  <Th>Nombre</Th>
                  <Th>Versión</Th>
                  <Th>Aceptado</Th>
                  <Th>Fecha</Th>
                  <Th>IP</Th>
                  <Th>{" "}</Th>
                </tr>
              </thead>
              <tbody>
                {documentos.map((d) => (
                  <tr key={d.id}>
                    <Td>{d.nameEs}</Td>
                    <Td>v{d.version}</Td>
                    <Td>{d.accepted ? "✓" : "—"}</Td>
                    <Td>{d.acceptedAt ? fechaHora(d.acceptedAt) : "—"}</Td>
                    <Td secondary>{d.ipAddress || "—"}</Td>
                    <Td>
                      {d.signedPdfUrl ? (
                        <a href={d.signedPdfUrl} target="_blank" rel="noreferrer">
                          Firmado ↗
                        </a>
                      ) : null}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Tabla>
          )}
        </Detalle>

        <Detalle summary="Cuestionarios">
          {tokens.length === 0 && respuestas.length === 0 ? (
            <p>Esta orden no tiene cuestionarios asociados.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {tokens.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="etiqueta">Enviados</p>
                  <Tabla>
                    <thead>
                      <tr>
                        <Th>Formulario</Th>
                        <Th>Destinatario</Th>
                        <Th>Enviado</Th>
                        <Th>Expira</Th>
                        <Th>Estado</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.map((t) => {
                        const tk = estadoToken(t);
                        return (
                          <tr key={t.id}>
                            <Td>{t.titleEs}</Td>
                            <Td secondary>{t.recipientEmail}</Td>
                            <Td>{fechaHora(t.sentAt)}</Td>
                            <Td>{fechaHora(t.expiresAt)}</Td>
                            <Td>
                              <Insignia tone={tk.tone}>{tk.label}</Insignia>
                            </Td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Tabla>
                </div>
              )}
              {respuestas.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="etiqueta">Respuestas</p>
                  <Tabla>
                    <thead>
                      <tr>
                        <Th>Formulario</Th>
                        <Th>Quien respondió</Th>
                        <Th>Fecha</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {respuestas.map((r) => (
                        <tr key={r.id}>
                          <Td>{r.titleEs}</Td>
                          <Td secondary>{r.respondentName || r.respondentEmail || "—"}</Td>
                          <Td>{fechaHora(r.createdAt)}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </Tabla>
                </div>
              )}
            </div>
          )}
        </Detalle>

        <Detalle summary="Historial">
          <ul className="flex flex-col gap-2">
            {eventos.map((ev, i) => (
              <li key={i}>
                <strong>{fechaHora(ev.date)}</strong> — {ev.label}
              </li>
            ))}
          </ul>
        </Detalle>
      </div>
    </div>
  );
}
