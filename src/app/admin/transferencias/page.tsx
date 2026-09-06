import { and, desc, eq, or } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orders } from "@/shared/db/schema/orders";
import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
  StatusPill,
  Td,
  Th,
} from "../_components/admin-ui";
import { markOrderPaid } from "./actions";
import { keyFromUrl } from "@/shared/integrations/s3";
import { getBankDetails } from "@/shared/payments/bank";

/**
 * Proofs live in a private S3 bucket, so link through the admin-gated route
 * that mints a short-lived presigned GET instead of the raw object URL.
 */
function proofHref(url: string): string {
  const key = keyFromUrl(url);
  return key
    ? `/api/transferencias/comprobante?key=${encodeURIComponent(key)}`
    : url;
}

/**
 * Two kinds of row share this queue:
 *  - `pending_transfer_validation`: the buyer uploaded a proof → validate it.
 *  - `transferencia` + `pending_payment`: the buyer chose deposit at checkout
 *    and no proof has arrived yet → send them the bank details if BANK_* isn't
 *    configured, then wait for the money.
 * Proofs to validate are listed first since they're the actionable ones.
 */
async function loadTransferQueue() {
  try {
    const rows = await db
      .select()
      .from(orders)
      .where(
        or(
          eq(orders.status, "pending_transfer_validation"),
          and(
            eq(orders.paymentMethod, "transferencia"),
            eq(orders.status, "pending_payment"),
          ),
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

export default async function AdminTransfersPage() {
  const list = await loadTransferQueue();
  const bank = getBankDetails();
  const awaiting = list.filter((o) => o.status === "pending_payment").length;

  return (
    <>
      <AdminPageHeader
        title="Transferencias"
        subtitle="Órdenes con pago por depósito / SPEI: comprobantes por validar y reservas que aún esperan el depósito."
        count={list.length}
      />

      {!bank.configured && awaiting > 0 && (
        <div className="mb-6 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Datos bancarios sin configurar.</strong> A {awaiting === 1 ? "esta reserva se le prometió" : `estas ${awaiting} reservas se les prometió`}{" "}
          la liga / datos de depósito <em>por correo</em>: hay que enviárselos manualmente (llegó un aviso
          &ldquo;[Depósito solicitado]&rdquo; al inbox de operaciones). Llena las variables{" "}
          <code className="font-mono text-xs">BANK_*</code> para que el sitio y el correo los muestren solos.
        </div>
      )}

      {list.length === 0 ? (
        <EmptyState
          title="Sin transferencias pendientes"
          body="Cuando alguien elija pago por depósito en el checkout o suba un comprobante en /transferencia, aparecerá aquí."
        />
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <Th>Folio</Th>
              <Th>Fecha</Th>
              <Th>Comprador</Th>
              <Th>Total</Th>
              <Th>Comprobante</Th>
              <Th>Status</Th>
              <Th className="text-right">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => {
              const validating = o.status === "pending_transfer_validation";
              return (
                <tr key={o.id} className="hover:bg-zinc-50">
                  <Td className="font-mono text-xs">{o.folio}</Td>
                  <Td className="text-xs tabular-nums whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString("es-MX")}
                  </Td>
                  <Td>
                    <div className="font-medium">{o.buyerName}</div>
                    <div className="text-xs text-zinc-500">{o.buyerEmail}</div>
                  </Td>
                  <Td className="tabular-nums text-sm">${Number(o.total).toLocaleString("es-MX")} MXN</Td>
                  <Td>
                    {o.transferProofUrl ? (
                      <a
                        href={proofHref(o.transferProofUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-700 hover:underline"
                      >
                        Ver →
                      </a>
                    ) : (
                      <span className="text-xs text-zinc-400">Sin comprobante</span>
                    )}
                  </Td>
                  <Td>
                    {validating ? (
                      <StatusPill status="Validar" variant="blue" />
                    ) : (
                      <StatusPill status="Esperando depósito" variant="amber" />
                    )}
                  </Td>
                  <Td className="text-right">
                    <form action={markOrderPaid.bind(null, o.id)} className="inline">
                      <button
                        type="submit"
                        className="bg-emerald-600 text-white px-3 py-1.5 text-xs hover:bg-emerald-700"
                        title={
                          validating
                            ? "Confirmar que el comprobante es válido"
                            : "Usar solo si el depósito ya se ve reflejado en el banco"
                        }
                      >
                        Marcar paid
                      </button>
                    </form>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </AdminTable>
      )}
    </>
  );
}

export const dynamic = "force-dynamic";
