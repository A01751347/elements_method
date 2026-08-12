import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import { venuesInventory as staticVenues } from "@/data/launchData";
import { getVenues } from "@/modules/content/venues";
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

const STATE_VARIANT: Record<string, "green" | "amber" | "neutral" | "red" | "blue"> = {
  confirmed: "green",
  "cotizacion-en-proceso": "blue",
  "sin-respuesta": "red",
  researching: "neutral",
  "available-2027": "amber",
};

const STATE_LABEL: Record<string, string> = {
  confirmed: "Confirmada",
  "cotizacion-en-proceso": "Cotización en proceso",
  "sin-respuesta": "Sin respuesta",
  researching: "En búsqueda",
  "available-2027": "Disponible 2027",
};

export default async function AdminVenuesPage() {
  const dbVenues = await getVenues();
  const venuesInventory = dbVenues.length > 0 ? dbVenues : staticVenues;
  return (
    <>
      <AdminPageHeader
        title="Locaciones"
        subtitle="Catálogo de sedes candidatas para inmersiones (haciendas, eco-lodges, espacios urbanos)."
        count={venuesInventory.length}
        action={
          <AdminPrimaryButton href="/admin/locaciones/nueva">
            <Plus className="h-4 w-4" />
            Nueva locación
          </AdminPrimaryButton>
        }
      />
      <PlaceholderNote />

      <AdminTable>
        <thead>
          <tr>
            <Th>Sede</Th>
            <Th>Ciudad</Th>
            <Th>Capacidad</Th>
            <Th>Rango precio</Th>
            <Th>Estado</Th>
            <Th>PH</Th>
            <Th className="text-right">Acciones</Th>
          </tr>
        </thead>
        <tbody>
          {venuesInventory.map((v) => (
            <tr key={v.slug} className="hover:bg-zinc-50">
              <Td>
                <div className="font-medium">{v.name}</div>
                <div className="text-xs text-zinc-500 mt-0.5 line-clamp-2 max-w-md">
                  {v.notesEs}
                </div>
              </Td>
              <Td className="text-xs whitespace-nowrap">{v.city}</Td>
              <Td className="text-xs">{v.capacity || "—"}</Td>
              <Td className="text-xs whitespace-nowrap">{v.rangeMxn || "—"}</Td>
              <Td>
                <StatusPill
                  status={STATE_LABEL[v.state] ?? v.state}
                  variant={STATE_VARIANT[v.state] ?? "neutral"}
                />
              </Td>
              <Td>
                <PlaceholderBadge fields={v.placeholderFields} />
              </Td>
              <Td className="text-right whitespace-nowrap">
                <div className="flex justify-end gap-1.5">
                  {v.url && (
                    <Link
                      href={v.url}
                      target="_blank"
                      className="inline-flex items-center gap-1 bg-white border border-zinc-300 text-zinc-700 px-3 py-1.5 text-xs hover:bg-zinc-50"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                  <AdminSecondaryButton href={`/admin/locaciones/${v.slug}`}>
                    Editar
                  </AdminSecondaryButton>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </>
  );
}
