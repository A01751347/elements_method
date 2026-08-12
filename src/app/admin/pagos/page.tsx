import { desc } from "drizzle-orm";
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

const STATUS_VARIANT: Record<string, "green" | "amber" | "neutral" | "red" | "blue"> = {
  pending_documents: "amber",
  pending_payment: "amber",
  pending_transfer_validation: "blue",
  paid: "green",
  cancelled: "red",
  refunded: "neutral",
};

async function loadOrders() {
  try {
    return await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(200);
  } catch (e) {
    console.error("[admin/pagos] DB read failed", e);
    return [];
  }
}

export default async function AdminOrdersPage() {
  const list = await loadOrders();

  const summary = {
    total: list.length,
    paid: list.filter((o) => o.status === "paid").length,
    pendingPayment: list.filter((o) => o.status === "pending_payment").length,
    pendingTransfer: list.filter((o) => o.status === "pending_transfer_validation").length,
    paidMxn: list
      .filter((o) => o.status === "paid")
      .reduce((acc, o) => acc + Number(o.total), 0),
  };

  return (
    <>
      <AdminPageHeader
        title="Pagos / Órdenes"
        subtitle="Todas las órdenes generadas — Stripe y SPEI/transferencia combinados."
        count={list.length}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Kpi label="Pagadas" value={summary.paid} tone="green" />
        <Kpi label="Pendientes pago" value={summary.pendingPayment} tone="amber" />
        <Kpi label="Validando SPEI" value={summary.pendingTransfer} tone="blue" />
        <Kpi
          label="Recaudado MXN"
          value={`$${summary.paidMxn.toLocaleString("es-MX")}`}
          tone="green"
        />
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Sin órdenes"
          body="Cuando alguien pague vía Stripe o suba un comprobante, aparecerá aquí."
        />
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <Th>Folio</Th>
              <Th>Fecha</Th>
              <Th>Comprador</Th>
              <Th>Total</Th>
              <Th>Método</Th>
              <Th>Status</Th>
              <Th className="text-right">PDF</Th>
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
                <Td className="tabular-nums text-sm">
                  ${Number(o.total).toLocaleString("es-MX")} {o.currency}
                </Td>
                <Td className="text-xs uppercase tracking-[0.14em]">{o.paymentMethod}</Td>
                <Td>
                  <StatusPill
                    status={o.status}
                    variant={STATUS_VARIANT[o.status] ?? "neutral"}
                  />
                </Td>
                <Td className="text-right whitespace-nowrap">
                  <a
                    href={`/api/comprobante/${o.folio}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-zinc-600 hover:text-zinc-900 underline underline-offset-2"
                  >
                    Comprobante
                  </a>
                </Td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </>
  );
}

function Kpi({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: "blue" | "amber" | "green";
}) {
  const cls = {
    blue: "text-blue-700",
    amber: "text-amber-700",
    green: "text-emerald-700",
  }[tone];
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500 mb-1">
        {label}
      </div>
      <div className={`text-2xl font-medium tabular-nums ${cls}`}>{value}</div>
    </div>
  );
}

export const dynamic = "force-dynamic";
