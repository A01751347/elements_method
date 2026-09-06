import { getVenues } from "@/modules/content/venues";
import {
  PageHeader,
  Boton,
  Filtros,
  Conteo,
  Tabla,
  Th,
  Td,
  FilaEnlace,
  EnlaceFila,
  Insignia,
  EstadoVacio,
} from "../_components/ui";
import { VENUE_STATE_ADMIN, estado } from "../_lib/status";

export const dynamic = "force-dynamic";

const FILTROS_ESTADO = [
  { value: "", label: "Todas" },
  ...Object.entries(VENUE_STATE_ADMIN).map(([value, s]) => ({ value, label: s.label })),
];

function truncar(texto: string | null | undefined, max: number): string {
  if (!texto) return "";
  return texto.length > max ? `${texto.slice(0, max).trimEnd()}…` : texto;
}

export default async function AdminVenuesPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado: estadoFiltro = "" } = await searchParams;
  const venues = await getVenues();
  const filtradas = estadoFiltro ? venues.filter((v) => v.state === estadoFiltro) : venues;

  return (
    <>
      <PageHeader
        title="Locaciones"
        subtitle="Catálogo de sedes candidatas y confirmadas para las inmersiones. Cada fila abre la ficha."
        actions={
          <Boton tone="primario" href="/admin/locaciones/nueva">
            + Nueva locación
          </Boton>
        }
      />

      <Filtros
        items={FILTROS_ESTADO.map((f) => ({
          href: f.value ? `/admin/locaciones?estado=${f.value}` : "/admin/locaciones",
          label: f.label,
          count: f.value ? venues.filter((v) => v.state === f.value).length : venues.length,
          active: estadoFiltro === f.value,
        }))}
      />

      <div className="mb-4">
        <Conteo n={filtradas.length} singular="locación encontrada" plural="locaciones encontradas" />
      </div>

      {filtradas.length === 0 ? (
        <EstadoVacio
          title="No hay locaciones registradas."
          body="Crea la primera sede candidata para empezar a planear retiros."
          action={
            <Boton tone="secundario" href="/admin/locaciones/nueva">
              + Nueva locación
            </Boton>
          }
        />
      ) : (
        <Tabla>
          <thead>
            <tr>
              <Th>Sede</Th>
              <Th>Ciudad</Th>
              <Th>Capacidad</Th>
              <Th>Rango MXN</Th>
              <Th>Estado</Th>
              <Th>Sitio</Th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((v) => {
              const est = estado(VENUE_STATE_ADMIN, v.state);
              return (
                <FilaEnlace key={v.slug}>
                  <Td>
                    <EnlaceFila href={`/admin/locaciones/${v.slug}`}>{v.name}</EnlaceFila>
                    {v.notesEs && <div className="celda-secundaria">{truncar(v.notesEs, 90)}</div>}
                  </Td>
                  <Td>{v.city}</Td>
                  <Td>{v.capacity || "—"}</Td>
                  <Td>{v.rangeMxn || "—"}</Td>
                  <Td>
                    <Insignia tone={est.tone}>{est.label}</Insignia>
                  </Td>
                  <Td>
                    {v.url ? (
                      <a href={v.url} target="_blank" rel="noreferrer" className="sobre-fila">
                        Abrir ↗
                      </a>
                    ) : (
                      "—"
                    )}
                  </Td>
                </FilaEnlace>
              );
            })}
          </tbody>
        </Tabla>
      )}
    </>
  );
}
