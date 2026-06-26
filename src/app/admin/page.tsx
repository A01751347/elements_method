import Link from "next/link";
import {
  calendarRetreats,
  providersInventory,
  venuesInventory,
  legalDocs,
} from "@/data/launchData";
import { AdminPageHeader, PlaceholderNote } from "./_components/admin-ui";

export default function AdminDashboardPage() {
  // 7-day-launch operations dashboard. Aggregates straight off launchData
  // until the matching tables are seeded; admin can swap source by table.
  const openRetreats = calendarRetreats.filter((r) => r.status === "open").length;
  const nextRetreat = [...calendarRetreats].sort(
    (a, b) => +new Date(a.startDate) - +new Date(b.startDate),
  )[0];
  const daysToNext = nextRetreat
    ? Math.max(
        0,
        Math.ceil((+new Date(nextRetreat.startDate) - +new Date()) / 86400000),
      )
    : 0;
  const venuesPending = venuesInventory.filter((v) =>
    ["researching", "cotizacion-en-proceso", "sin-respuesta"].includes(v.state),
  ).length;
  const venuesConfirmed = venuesInventory.filter((v) => v.state === "confirmed").length;
  const providersPending = providersInventory.filter(
    (p) => p.status !== "confirmed",
  ).length;
  const placeholdersTotal = [
    ...calendarRetreats.flatMap((r) => r.placeholderFields),
    ...providersInventory.flatMap((p) => p.placeholderFields),
    ...venuesInventory.flatMap((v) => v.placeholderFields),
    ...legalDocs.flatMap((d) => d.placeholderFields),
  ].length;

  const kpis = [
    {
      label: "Próximo retiro",
      value: nextRetreat ? `${daysToNext} días` : "—",
      detail: nextRetreat ? `${nextRetreat.themeEs} · ${nextRetreat.dateLabelEs}` : "",
      tone: daysToNext < 30 ? "red" : daysToNext < 90 ? "amber" : "neutral",
    },
    {
      label: "Retiros abiertos",
      value: `${openRetreats}/${calendarRetreats.length}`,
      detail: "Aplicaciones abiertas en el calendario 2026-2027",
      tone: "neutral",
    },
    {
      label: "Locaciones pendientes",
      value: `${venuesPending}`,
      detail: `${venuesConfirmed} confirmadas · ${venuesInventory.length} totales`,
      tone: venuesConfirmed === 0 ? "red" : "amber",
    },
    {
      label: "Proveedores pendientes",
      value: `${providersPending}`,
      detail: `${providersInventory.length - providersPending} confirmados · ${providersInventory.length} totales`,
      tone: providersPending > 8 ? "amber" : "neutral",
    },
    {
      label: "Placeholders activos",
      value: `${placeholdersTotal}`,
      detail: "Campos marcados como datos no reales",
      tone: placeholdersTotal > 50 ? "amber" : "neutral",
    },
    {
      label: "Documentos legales",
      value: `${legalDocs.length}`,
      detail: "En borrador · pendientes revisión legal",
      tone: "amber",
    },
    {
      label: "Inscripciones nuevas",
      value: "0",
      detail: "Sin backend de leads conectado",
      tone: "neutral",
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Operaciones del lanzamiento de 7 días — KPIs operativos en tiempo real desde launchData."
      />
      <PlaceholderNote />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-lg border border-zinc-200 bg-white p-4"
          >
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-zinc-500 mb-2">
              {k.label}
            </p>
            <p
              className={`text-2xl font-medium tabular-nums ${
                k.tone === "red"
                  ? "text-red-700"
                  : k.tone === "amber"
                    ? "text-amber-800"
                    : "text-zinc-900"
              }`}
            >
              {k.value}
            </p>
            {k.detail && (
              <p className="mt-2 text-xs text-zinc-500 leading-snug">{k.detail}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-medium mb-4">Próximos retiros</h2>
          <ul className="divide-y divide-zinc-100">
            {[...calendarRetreats]
              .sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate))
              .slice(0, 5)
              .map((r) => (
                <li key={r.slug} className="py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/retiros/${r.slug}`}
                      className="text-sm font-medium text-zinc-900 hover:text-zinc-600 truncate block"
                    >
                      {r.themeEs}
                    </Link>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {r.dateLabelEs}
                    </div>
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
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-medium mb-4">Locaciones por confirmar</h2>
          <ul className="divide-y divide-zinc-100">
            {venuesInventory
              .filter((v) =>
                ["researching", "cotizacion-en-proceso", "sin-respuesta"].includes(
                  v.state,
                ),
              )
              .slice(0, 5)
              .map((v) => (
                <li key={v.slug} className="py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/locaciones/${v.slug}`}
                      className="text-sm font-medium text-zinc-900 hover:text-zinc-600 truncate block"
                    >
                      {v.name}
                    </Link>
                    <div className="text-xs text-zinc-500 mt-0.5">{v.city}</div>
                  </div>
                  <div className="text-[0.6rem] uppercase tracking-[0.14em] text-zinc-500 ml-4 shrink-0">
                    {v.state.replace(/-/g, " ")}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
