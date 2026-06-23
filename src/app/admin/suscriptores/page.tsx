import { desc, sql } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { subscribers } from "@/shared/db/schema/integrations";
import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
  StatusPill,
  Td,
  Th,
} from "../_components/admin-ui";

async function loadSubscribers() {
  try {
    const rows = await db
      .select()
      .from(subscribers)
      .orderBy(desc(subscribers.createdAt))
      .limit(200);
    const stats = await db
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
        subscribed: sql<number>`sum(case when ${subscribers.mailchimpStatus} = 'subscribed' then 1 else 0 end)`.mapWith(
          Number,
        ),
        pending: sql<number>`sum(case when ${subscribers.mailchimpStatus} = 'pending' then 1 else 0 end)`.mapWith(
          Number,
        ),
      })
      .from(subscribers);
    return { rows, stats: stats[0] };
  } catch (e) {
    console.error("[admin/suscriptores] DB read failed", e);
    return { rows: [], stats: { total: 0, subscribed: 0, pending: 0 } };
  }
}

const MAILCHIMP_VARIANT: Record<string, "green" | "amber" | "neutral" | "red"> = {
  subscribed: "green",
  pending: "amber",
  unsubscribed: "neutral",
  cleaned: "red",
};

export default async function AdminSubscribersPage() {
  const { rows: list, stats } = await loadSubscribers();

  return (
    <>
      <AdminPageHeader
        title="Suscriptores"
        subtitle="Newsletter — sincronizados con Mailchimp."
        count={list.length}
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Kpi label="Total" value={stats.total} tone="neutral" />
        <Kpi label="Subscribed (Mailchimp)" value={stats.subscribed} tone="green" />
        <Kpi label="Pending sync" value={stats.pending} tone="amber" />
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Sin suscriptores"
          body="Cuando alguien se suscriba desde el footer, aparecerá aquí. El endpoint /api/newsletter ya hace upsert local + Mailchimp."
        />
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <Th>Fecha</Th>
              <Th>Email</Th>
              <Th>Nombre</Th>
              <Th>Fuente</Th>
              <Th>Idioma</Th>
              <Th>Mailchimp</Th>
              <Th>Sync</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id} className="hover:bg-zinc-50">
                <Td className="text-xs">{new Date(s.createdAt).toLocaleDateString("es-MX")}</Td>
                <Td className="text-xs">
                  <a href={`mailto:${s.email}`} className="hover:text-zinc-900">
                    {s.email}
                  </a>
                </Td>
                <Td className="text-xs">{s.name ?? "—"}</Td>
                <Td className="text-xs uppercase tracking-[0.14em]">{s.source ?? "—"}</Td>
                <Td className="text-xs">{s.language ?? "—"}</Td>
                <Td>
                  <StatusPill
                    status={s.mailchimpStatus ?? "—"}
                    variant={MAILCHIMP_VARIANT[s.mailchimpStatus ?? ""] ?? "neutral"}
                  />
                </Td>
                <Td className="text-xs text-zinc-500">
                  {s.mailchimpSyncedAt
                    ? new Date(s.mailchimpSyncedAt).toLocaleDateString("es-MX")
                    : "—"}
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
  value: number;
  tone: "neutral" | "amber" | "green";
}) {
  const cls = {
    neutral: "text-zinc-900",
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
