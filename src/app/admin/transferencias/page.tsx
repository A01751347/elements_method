import { and, desc, eq, or } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orders } from "@/shared/db/schema";
import {
  PageHeader,
  Banner,
  Conteo,
  Tabla,
  Th,
  Td,
  FilaEnlace,
  EnlaceFila,
  Insignia,
  EstadoVacio,
} from "../_components/ui";
import { ConfirmarAccion } from "../_components/client";
import { mxn, fechaCorta } from "../_lib/format";
import { marcarPagada } from "./actions";
import { keyFromUrl } from "@/shared/integrations/s3";
import { getBankDetails } from "@/shared/payments/bank";

export const dynamic = "force-dynamic";

/**
 * Los comprobantes viven en un bucket privado; se pasa por la ruta admin-gated
 * que firma un GET corto en vez de enlazar la URL cruda del objeto.
 */
function proofHref(url: string): string {
  const key = keyFromUrl(url);
  return key ? `/api/transferencias/comprobante?key=${encodeURIComponent(key)}` : url;
}

/**
 * Dos tipos de fila comparten esta cola:
 *  - `pending_transfer_validation`: subieron comprobante → hay que validarlo.
 *  - `transferencia` + `pending_payment`: eligieron depósito en el checkout y
 *    todavía no llega comprobante → esperando el dinero.
 * Los comprobantes por validar van primero por ser los accionables.
 */
async function cargarColaTransferencias() {
  try {
    const rows = await db
      .select()
      .from(orders)
      .where(
        or(
          eq(orders.status, "pending_transfer_validation"),
          and(eq(orders.paymentMethod, "transferencia"), eq(orders.status, "pending_payment")),
        ),
      )
      .orderBy(desc(orders.createdAt));
    return rows.sort((a, b) => {
      const av = a.status === "pending_transfer_validation" ? 0 : 1;
      const bv = b.status === "pending_transfer_validation" ? 0 : 1;
      return av - bv;
    });
  } catch (e) {
    console.error("[admin/transferencias] DB read failed", e);
    return [];
  }
}

export default async function TransferenciasPage() {
  const list = await cargarColaTransferencias();
  const bank = getBankDetails();
  const awaiting = list.filter((o) => o.status === "pending_payment").length;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Transferencias"
        subtitle="Órdenes con pago por depósito o SPEI: comprobantes por validar y reservas que aún esperan el depósito."
      />

      {!bank.configured && awaiting > 0 && (
        <Banner tone="aviso">
          Datos bancarios sin configurar. A {awaiting === 1 ? "esta reserva se le prometió" : `estas ${awaiting} reservas se les prometió`}{" "}
          la liga / datos de depósito <em>por correo</em>: hay que enviárselos manualmente (llegó un aviso «[Depósito
          solicitado]» al inbox de operaciones). Llena las variables <code>BANK_*</code> para que el sitio y el
          correo los muestren solos.
        </Banner>
      )}

      {list.length === 0 ? (
        <EstadoVacio
          title="Nada pendiente por validar."
          body="Cuando alguien elija pago por depósito en el checkout o suba un comprobante en /transferencia, aparecerá aquí."
        />
      ) : (
        <div className="flex flex-col gap-4">
          <Conteo n={list.length} singular="orden en la cola" plural="órdenes en la cola" />
          <Tabla>
            <thead>
              <tr>
                <Th>Folio</Th>
                <Th>Fecha</Th>
                <Th>Comprador</Th>
                <Th align="right">Total</Th>
                <Th>Comprobante</Th>
                <Th>Estado</Th>
                <Th align="right">Acción</Th>
              </tr>
            </thead>
            <tbody>
              {list.map((o) => {
                const validando = o.status === "pending_transfer_validation";
                return (
                  <FilaEnlace key={o.id}>
                    <Td>
                      <EnlaceFila href={`/admin/pagos/${o.folio}`}>{o.folio}</EnlaceFila>
                    </Td>
                    <Td>{fechaCorta(o.createdAt)}</Td>
                    <Td secondary>
                      {o.buyerName}
                      <br />
                      {o.buyerEmail}
                    </Td>
                    <Td numeric>{mxn(o.total, o.currency)}</Td>
                    <Td>
                      {o.transferProofUrl ? (
                        <a href={proofHref(o.transferProofUrl)} target="_blank" rel="noreferrer" className="sobre-fila">
                          Ver ↗
                        </a>
                      ) : (
                        <span className="texto-sutil">Sin comprobante</span>
                      )}
                    </Td>
                    <Td>
                      {validando ? (
                        <Insignia tone="acento">Comprobante enviado</Insignia>
                      ) : (
                        <Insignia tone="alerta">Esperando depósito</Insignia>
                      )}
                    </Td>
                    <Td align="right">
                      <span className="sobre-fila">
                        <ConfirmarAccion
                          trigger="Marcar como pagada"
                          title="Confirmar pago"
                          body="La orden queda «pagada», se registra tu correo como validador y el comprador recibe su comprobante por correo."
                          confirmLabel="Sí, marcar como pagada"
                          pendingLabel="Registrando el pago…"
                          action={marcarPagada}
                          tone="tinta"
                          size="chico"
                          hidden={[{ name: "orderId", value: o.id }]}
                        />
                      </span>
                    </Td>
                  </FilaEnlace>
                );
              })}
            </tbody>
          </Tabla>
        </div>
      )}
    </div>
  );
}
