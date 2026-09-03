import { desc, eq } from "drizzle-orm";
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


async function loadPendingTransfers() {
  try {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.status, "pending_transfer_validation"))
      .orderBy(desc(orders.createdAt));
  } catch (e) {
    console.error("[admin/transferencias] DB read failed", e);
    return [];
  }
}

export default async function AdminTransfersPage() {
  const list = await loadPendingTransfers();

  return (
    <>
      <AdminPageHeader
        title="Transferencias"
        subtitle="Comprobantes SPEI subidos por compradores — pendientes de validación operativa."
        count={list.length}
      />

      {list.length === 0 ? (
        <EmptyState
          title="Sin transferencias por validar"
          body="Cuando alguien suba un comprobante en /transferencia, aparecerá aquí para su validación."
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
            {list.map((o) => (
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
                  <StatusPill status="Validar" variant="amber" />
                </Td>
                <Td className="text-right">
                  <form action={markOrderPaid.bind(null, o.id)} className="inline">
                    <button
                      type="submit"
                      className="bg-emerald-600 text-white px-3 py-1.5 text-xs hover:bg-emerald-700"
                    >
                      Marcar paid
                    </button>
                  </form>
                </Td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </>
  );
}

export const dynamic = "force-dynamic";
