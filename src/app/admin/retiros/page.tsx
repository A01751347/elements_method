import Link from "next/link";
import { Plus } from "lucide-react";
import { calendarRetreats as staticCalendarRetreats } from "@/data/launchData";
import { getCalendarRetreats } from "@/modules/content/calendarRetreats";
import { elements } from "@/data/content";
import {
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  AdminTable,
  PlaceholderBadge,
  PlaceholderNote,
  StatusPill,
  Td,
  Th,
} from "../_components/admin-ui";

const STATUS_VARIANT: Record<string, "green" | "amber" | "neutral" | "red"> = {
  open: "green",
  waitlist: "amber",
  closed: "neutral",
  sold: "red",
};

export default async function AdminRetreatsPage() {
  const dbRetreats = await getCalendarRetreats();
  const calendarRetreats =
    dbRetreats.length > 0 ? dbRetreats : staticCalendarRetreats;
  const sorted = [...calendarRetreats].sort(
    (a, b) => +new Date(a.startDate) - +new Date(b.startDate),
  );

  return (
    <>
      <AdminPageHeader
        title="Retiros"
        subtitle="Calendario 2026-2027. Cada fila enlaza a la página pública /retiros/[slug]."
        count={calendarRetreats.length}
        action={
          <AdminPrimaryButton href="/admin/retiros/nuevo">
            <Plus className="h-4 w-4" />
            Nuevo retiro
          </AdminPrimaryButton>
        }
      />
      <PlaceholderNote />

      <AdminTable>
        <thead>
          <tr>
            <Th className="w-12">#</Th>
            <Th>Tema</Th>
            <Th>Fechas</Th>
            <Th>Elemento</Th>
            <Th>Sede</Th>
            <Th>Cupo</Th>
            <Th>Status</Th>
            <Th>PH</Th>
            <Th className="text-right">Acciones</Th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => {
            const el = elements.find((e) => e.key === r.elementKey);
            return (
              <tr key={r.slug} className="hover:bg-zinc-50">
                <Td className="tabular-nums text-zinc-500">
                  {String(r.orderIdx).padStart(2, "0")}
                </Td>
                <Td>
                  <div className="font-medium">{r.themeEs}</div>
                  <div className="text-xs text-zinc-500 mt-0.5 line-clamp-1 max-w-md">
                    {r.summaryEs}
                  </div>
                </Td>
                <Td className="text-xs text-zinc-600 whitespace-nowrap">
                  {r.dateLabelEs}
                </Td>
                <Td>
                  <span
                    className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.14em]"
                    style={{ color: el?.accentInk }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: el?.accent }}
                    />
                    {el?.nameEs}
                  </span>
                </Td>
                <Td>
                  <div className="text-xs text-zinc-700">{r.venueLabelEs}</div>
                  <div className="text-[0.6rem] uppercase tracking-[0.14em] text-zinc-500 mt-0.5">
                    {r.venueState}
                  </div>
                </Td>
                <Td className="tabular-nums text-xs">
                  {r.seatsLeft}/{r.capacity}
                </Td>
                <Td>
                  <StatusPill status={r.status} variant={STATUS_VARIANT[r.status]} />
                </Td>
                <Td>
                  <PlaceholderBadge fields={r.placeholderFields} />
                </Td>
                <Td className="text-right whitespace-nowrap">
                  <div className="flex justify-end gap-1.5">
                    <AdminSecondaryButton href={`/admin/retiros/${r.slug}`}>
                      Editar
                    </AdminSecondaryButton>
                    <Link
                      href={`/es/retiros/${r.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 bg-white border border-zinc-300 text-zinc-700 px-3 py-1.5 text-xs hover:bg-zinc-50 transition-colors"
                    >
                      Ver →
                    </Link>
                  </div>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </AdminTable>
    </>
  );
}
