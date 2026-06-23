import { desc, sql } from "drizzle-orm";
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

async function loadBuyers() {
  try {
    const rows = await db
      .select({
        email: orders.buyerEmail,
        name: orders.buyerName,
        type: orders.buyerType,
        phone: orders.buyerPhone,
        company: orders.buyerCompany,
        ordersCount: sql<number>`count(${orders.id})`.mapWith(Number),
        totalSpent: sql<string>`sum(${orders.total})`.mapWith(String),
        lastOrderAt: sql<Date>`max(${orders.createdAt})`,
      })
      .from(orders)
      .groupBy(orders.buyerEmail, orders.buyerName, orders.buyerType, orders.buyerPhone, orders.buyerCompany)
      .orderBy(desc(sql`max(${orders.createdAt})`));
    return rows;
  } catch (e) {
    console.error("[admin/compradores] DB read failed", e);
    return [];
  }
}

export default async function AdminBuyersPage() {
  const list = await loadBuyers();

  return (
    <>
      <AdminPageHeader
        title="Compradores"
        subtitle="Personas y organizaciones que han generado al menos una orden."
        count={list.length}
      />

      {list.length === 0 ? (
        <EmptyState
          title="Sin compradores"
          body="Cuando alguien complete un checkout o suba un comprobante de transferencia, aparecerá aquí."
        />
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <Th>Nombre</Th>
              <Th>Email</Th>
              <Th>Tipo</Th>
              <Th>Organización</Th>
              <Th>Órdenes</Th>
              <Th>Total gastado</Th>
              <Th>Última orden</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.email} className="hover:bg-zinc-50">
                <Td className="font-medium">{b.name}</Td>
                <Td className="text-xs">
                  <a href={`mailto:${b.email}`} className="hover:text-zinc-900">
                    {b.email}
                  </a>
                </Td>
                <Td>
                  <StatusPill
                    status={b.type === "empresa" ? "Empresa" : "Persona"}
                    variant={b.type === "empresa" ? "blue" : "neutral"}
                  />
                </Td>
                <Td className="text-xs">{b.company ?? "—"}</Td>
                <Td className="tabular-nums text-sm">{b.ordersCount}</Td>
                <Td className="tabular-nums text-sm">
                  ${Number(b.totalSpent ?? 0).toLocaleString("es-MX")} MXN
                </Td>
                <Td className="text-xs">
                  {b.lastOrderAt ? new Date(b.lastOrderAt).toLocaleDateString("es-MX") : "—"}
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
const _STATUS_VARIANT = STATUS_VARIANT; // keep eslint quiet for unused-export style
void _STATUS_VARIANT;
