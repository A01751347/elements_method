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
                      href={o.transferProofUrl}
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
                  <button
                    type="button"
                    className="bg-emerald-600 text-white px-3 py-1.5 text-xs hover:bg-emerald-700"
                  >
                    Marcar paid
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}

      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-medium mb-3">Pendiente: server action validate</h2>
        <p className="text-sm text-zinc-600 leading-relaxed">
          El botón <strong>Marcar paid</strong> está pendiente de un server action que ejecute{" "}
          <code className="font-mono text-xs bg-zinc-100 px-1">UPDATE orders SET status=&apos;paid&apos;, paid_at=now(), transfer_validated_at=now(), transfer_validated_by=&lt;admin email&gt;</code>{" "}
          y dispare email de confirmación al comprador.
        </p>
      </div>
    </>
  );
}

export const dynamic = "force-dynamic";
