import { calendarRetreats } from "@/data/launchData";
import { elements } from "@/data/content";
import { AdminPageHeader, PlaceholderNote } from "../_components/admin-ui";

const MONTHS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export default function AdminCalendarPage() {
  // Group retreats by year for a compact timeline
  const byYear = new Map<number, typeof calendarRetreats>();
  for (const r of calendarRetreats) {
    const y = new Date(r.startDate).getUTCFullYear();
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y)!.push(r);
  }
  const years = [...byYear.keys()].sort();

  return (
    <>
      <AdminPageHeader
        title="Calendario operativo"
        subtitle="Vista timeline de los 9 retiros del arco 2026-2027 + estado de venue."
        count={calendarRetreats.length}
      />
      <PlaceholderNote />

      <div className="space-y-12">
        {years.map((y) => (
          <section key={y}>
            <h2 className="text-lg font-medium mb-4 flex items-baseline gap-3">
              <span className="text-3xl tabular-nums font-[family-name:var(--font-display)] text-zinc-900">
                {y}
              </span>
              <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                {byYear.get(y)!.length} retiros
              </span>
            </h2>
            <div className="grid grid-cols-12 gap-1 mb-2">
              {MONTHS.map((m, i) => {
                const retreat = byYear
                  .get(y)!
                  .find((r) => new Date(r.startDate).getUTCMonth() === i);
                const el = retreat
                  ? elements.find((e) => e.key === retreat.elementKey)
                  : null;
                return (
                  <div
                    key={m}
                    className={`relative aspect-square border ${
                      retreat ? "border-zinc-900" : "border-zinc-200"
                    } p-1.5 flex flex-col`}
                    style={
                      retreat && el
                        ? { background: el.accentSoft, borderColor: el.accentInk }
                        : undefined
                    }
                  >
                    <span
                      className={`text-[0.6rem] uppercase tracking-[0.16em] ${
                        retreat ? "text-zinc-900" : "text-zinc-400"
                      }`}
                    >
                      {m}
                    </span>
                    {retreat && el && (
                      <div
                        className="mt-auto text-[0.6rem] leading-tight font-medium"
                        style={{ color: el.accentInk }}
                      >
                        {el.nameEs}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <ul className="text-sm divide-y divide-zinc-100 border border-zinc-200 bg-white">
              {byYear.get(y)!.map((r) => {
                const el = elements.find((e) => e.key === r.elementKey);
                return (
                  <li key={r.slug} className="px-4 py-2.5 flex items-center gap-4">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ background: el?.accent }}
                    />
                    <span className="text-xs uppercase tracking-[0.14em] text-zinc-500 w-44">
                      {r.dateLabelEs.split(",")[0]}
                    </span>
                    <span className="flex-1 font-medium">{r.themeEs}</span>
                    <span className="text-xs text-zinc-500">{r.venueLabelEs}</span>
                    <span className="text-xs tabular-nums w-16 text-right">
                      {r.seatsLeft}/{r.capacity}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
