import Link from "next/link";
import { count, eq, desc, sql, gte } from "drizzle-orm";
import { db } from "@/shared/db/client";
import {
  orders,
  enterpriseQuotes,
  inscriptions,
  subscribers,
  calendarRetreats as calendarRetreatsTable,
} from "@/shared/db/schema";
import { AdminPageHeader } from "./_components/admin-ui";

export const dynamic = "force-dynamic";

/** Business KPIs pulled live from the DB (RF-ADM-03). Degrades to zeros. */
async function loadKpis() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const startOfYear = new Date(startOfMonth.getFullYear(), 0, 1);

  try {
    const [
      paidAgg,
      monthAgg,
      yearAgg,
      pendingCount,
      quotesCount,
      leadsCount,
      newLeads,
      subsCount,
    ] = await Promise.all([
      db
        .select({
          n: count(),
          sum: sql<string>`COALESCE(SUM(${orders.total}), 0)`,
        })
        .from(orders)
        .where(eq(orders.status, "paid")),
      db
        .select({ sum: sql<string>`COALESCE(SUM(${orders.total}), 0)` })
        .from(orders)
        .where(sql`${orders.status} = 'paid' AND ${orders.paidAt} >= ${startOfMonth}`),
      db
        .select({ sum: sql<string>`COALESCE(SUM(${orders.total}), 0)` })
        .from(orders)
        .where(sql`${orders.status} = 'paid' AND ${orders.paidAt} >= ${startOfYear}`),
      db
        .select({ n: count() })
        .from(orders)
        .where(sql`${orders.status} IN ('pending_payment','pending_transfer_validation')`),
      db.select({ n: count() }).from(enterpriseQuotes),
      db.select({ n: count() }).from(inscriptions),
      db
        .select({ n: count() })
        .from(inscriptions)
        .where(gte(inscriptions.createdAt, startOfMonth)),
      db.select({ n: count() }).from(subscribers),
    ]);

    const paidN = paidAgg[0]?.n ?? 0;
    const leadsN = leadsCount[0]?.n ?? 0;
    // Conversion = paid orders / total leads (proxy).
    const conversion = leadsN > 0 ? Math.round((paidN / leadsN) * 100) : 0;

    return {
      revenueYear: Number(yearAgg[0]?.sum ?? 0),
      revenueMonth: Number(monthAgg[0]?.sum ?? 0),
      revenueAll: Number(paidAgg[0]?.sum ?? 0),
      paidOrders: paidN,
      pendingOrders: pendingCount[0]?.n ?? 0,
      quotes: quotesCount[0]?.n ?? 0,
      leads: leadsN,
      newLeads: newLeads[0]?.n ?? 0,
      subscribers: subsCount[0]?.n ?? 0,
      conversion,
    };
  } catch (e) {
    console.error("[admin/dashboard] KPI load failed", e);
    return {
      revenueYear: 0,
      revenueMonth: 0,
      revenueAll: 0,
      paidOrders: 0,
      pendingOrders: 0,
      quotes: 0,
      leads: 0,
      newLeads: 0,
      subscribers: 0,
      conversion: 0,
    };
  }
}

async function loadUpcomingRetreats() {
  try {
    return await db
      .select()
      .from(calendarRetreatsTable)
      .orderBy(desc(calendarRetreatsTable.orderIdx))
      .limit(5);
  } catch {
    return [];
  }
}

async function loadRecentOrders() {
  try {
    return await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(6);
  } catch {
    return [];
  }
}

const mxn = (n: number) => `$${n.toLocaleString("es-MX")}`;

export default async function AdminDashboardPage() {
  const [kpi, retreats, recentOrders] = await Promise.all([
    loadKpis(),
    loadUpcomingRetreats(),
    loadRecentOrders(),
  ]);

  const kpis: { label: string; value: string; detail: string; tone: string }[] = [
    {
      label: "Ingresos del año",
      value: mxn(kpi.revenueYear),
      detail: `Este mes: ${mxn(kpi.revenueMonth)}`,
      tone: "green",
    },
    {
      label: "Órdenes pagadas",
      value: String(kpi.paidOrders),
      detail: `${kpi.pendingOrders} pendientes de pago/validación`,
      tone: "neutral",
    },
    {
      label: "Tasa de conversión",
      value: `${kpi.conversion}%`,
      detail: "Órdenes pagadas / leads totales",
      tone: kpi.conversion > 0 ? "green" : "neutral",
    },
    {
      label: "Cotizaciones",
      value: String(kpi.quotes),
      detail: "Empresas / Origin",
      tone: "neutral",
    },
    {
      label: "Leads nuevos (mes)",
      value: String(kpi.newLeads),
      detail: `${kpi.leads} leads totales`,
      tone: "neutral",
    },
    {
      label: "Suscriptores",
      value: String(kpi.subscribers),
      detail: "Newsletter",
      tone: "neutral",
    },
    {
      label: "Ingresos totales",
      value: mxn(kpi.revenueAll),
      detail: "Histórico (órdenes pagadas)",
      tone: "green",
    },
    {
      label: "Analytics",
      value: "GA4 ↗",
      detail: "Ver métricas de tráfico en Google Analytics",
      tone: "neutral",
      href: "https://analytics.google.com/",
    } as { label: string; value: string; detail: string; tone: string; href?: string },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        subtitle="KPIs de negocio en tiempo real desde la base de datos."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {kpis.map((k) => {
          const inner = (
            <>
              <p className="text-[0.65rem] uppercase tracking-[0.16em] text-zinc-500 mb-2">
                {k.label}
              </p>
              <p
                className={`text-2xl font-medium tabular-nums ${
                  k.tone === "red"
                    ? "text-red-700"
                    : k.tone === "amber"
                      ? "text-amber-800"
                      : k.tone === "green"
                        ? "text-emerald-700"
                        : "text-zinc-900"
                }`}
              >
                {k.value}
              </p>
              {k.detail && (
                <p className="mt-2 text-xs text-zinc-500 leading-snug">{k.detail}</p>
              )}
            </>
          );
          const href = (k as { href?: string }).href;
          return href ? (
            <a
              key={k.label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-zinc-200 bg-white p-4 hover:border-zinc-300 transition-colors"
            >
              {inner}
            </a>
          ) : (
            <div key={k.label} className="rounded-lg border border-zinc-200 bg-white p-4">
              {inner}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-medium mb-4">Órdenes recientes</h2>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-zinc-500">Aún no hay órdenes.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {recentOrders.map((o) => (
                <li key={o.id} className="py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-zinc-900 truncate">
                      {o.buyerName}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5 font-mono">
                      {o.folio}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-sm tabular-nums">
                      {mxn(Number(o.total))}
                    </div>
                    <div className="text-[0.6rem] uppercase tracking-[0.14em] text-zinc-500 mt-0.5">
                      {o.status}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/admin/pagos"
            className="mt-4 inline-block text-xs text-zinc-600 hover:text-zinc-900 underline underline-offset-2"
          >
            Ver todas las órdenes →
          </Link>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-medium mb-4">Próximos retiros</h2>
          {retreats.length === 0 ? (
            <p className="text-sm text-zinc-500">Sin retiros en el calendario.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {retreats.map((r) => (
                <li key={r.slug} className="py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/retiros/${r.slug}`}
                      className="text-sm font-medium text-zinc-900 hover:text-zinc-600 truncate block"
                    >
                      {r.themeEs}
                    </Link>
                    <div className="text-xs text-zinc-500 mt-0.5">{r.dateLabelEs}</div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <div className="text-xs tabular-nums">
                      {r.seatsLeft}/{r.capacity}
                    </div>
                    <div className="text-[0.6rem] uppercase tracking-[0.14em] text-zinc-500 mt-0.5">
                      {r.status}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
