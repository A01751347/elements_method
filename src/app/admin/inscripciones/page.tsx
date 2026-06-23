import { desc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { inscriptions } from "@/shared/db/schema/operations";
import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
  StatusPill,
  Td,
  Th,
} from "../_components/admin-ui";

const STATUS_VARIANT: Record<string, "green" | "amber" | "neutral" | "blue"> = {
  new: "blue",
  contacted: "amber",
  qualified: "green",
  converted: "green",
  archived: "neutral",
};

async function loadInscriptions() {
  try {
    return await db
      .select()
      .from(inscriptions)
      .orderBy(desc(inscriptions.createdAt))
      .limit(200);
  } catch (e) {
    console.error("[admin/inscripciones] DB read failed", e);
    return [];
  }
}

export default async function AdminInscriptionsPage() {
  const list = await loadInscriptions();
  const empty = list.length === 0;

  const counts = {
    new: list.filter((l) => l.status === "new").length,
    contacted: list.filter((l) => l.status === "contacted").length,
    qualified: list.filter((l) => l.status === "qualified").length,
    converted: list.filter((l) => l.status === "converted").length,
  };

  return (
    <>
      <AdminPageHeader
        title="Inscripciones"
        subtitle="Bandeja de leads desde formularios públicos de aplicación, contacto y corporativo."
        count={list.length}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Nuevos" value={counts.new} tone="blue" />
        <KpiCard label="Contactados" value={counts.contacted} tone="amber" />
        <KpiCard label="Calificados" value={counts.qualified} tone="green" />
        <KpiCard label="Convertidos" value={counts.converted} tone="green" />
      </div>

      {empty ? (
        <EmptyState
          title="Sin inscripciones"
          body="Cuando un visitante envíe el formulario de /aplicar o /contacto, aparecerá aquí."
        />
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <Th>Fecha</Th>
              <Th>Nombre</Th>
              <Th>Email</Th>
              <Th>Teléfono</Th>
              <Th>Fuente</Th>
              <Th>Retiro / Programa</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((l) => (
              <tr key={l.id} className="hover:bg-zinc-50">
                <Td className="text-xs tabular-nums whitespace-nowrap">
                  {new Date(l.createdAt).toLocaleDateString("es-MX")}
                </Td>
                <Td className="font-medium">{l.name}</Td>
                <Td className="text-xs">
                  <a href={`mailto:${l.email}`} className="hover:text-zinc-900">
                    {l.email}
                  </a>
                </Td>
                <Td className="text-xs">{l.phone ?? "—"}</Td>
                <Td className="text-xs uppercase tracking-[0.14em]">{l.source}</Td>
                <Td className="text-xs">
                  {l.retreatSlug ? (
                    <span className="font-mono">{l.retreatSlug}</span>
                  ) : l.pathSlug ? (
                    <span className="font-mono">{l.pathSlug}</span>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td>
                  <StatusPill status={l.status} variant={STATUS_VARIANT[l.status]} />
                </Td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </>
  );
}

function KpiCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
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
