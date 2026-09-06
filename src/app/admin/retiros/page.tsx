import { getCalendarRetreats } from "@/modules/content/calendarRetreats";
import { elements } from "@/data/content";
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
import { RETREAT_STATUS, VENUE_STATE, estado } from "../_lib/status";

export const dynamic = "force-dynamic";

const TONO_TEXTO: Record<string, string> = {
  ok: "texto-ok",
  alerta: "texto-alerta",
  peligro: "texto-peligro",
  acento: "texto-acento",
  neutra: "texto-tenue",
};

const FILTROS_ESTADO = [
  { value: "", label: "Todas" },
  { value: "open", label: "Abiertas" },
  { value: "waitlist", label: "Lista de espera" },
  { value: "closed", label: "Cerradas" },
  { value: "sold", label: "Sin cupo" },
] as const;

export default async function AdminRetreatsPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado: estadoFiltro = "" } = await searchParams;
  const retiros = await getCalendarRetreats();
  const filtrados = estadoFiltro ? retiros.filter((r) => r.status === estadoFiltro) : retiros;
  const ordenados = [...filtrados].sort(
    (a, b) => +new Date(a.startDate) - +new Date(b.startDate),
  );

  return (
    <>
      <PageHeader
        title="Retiros"
        subtitle="Calendario público de retiros y experiencias. Cada fila abre la ficha."
        actions={
          <Boton tone="primario" href="/admin/retiros/nuevo">
            + Nuevo retiro
          </Boton>
        }
      />

      <Filtros
        items={FILTROS_ESTADO.map((f) => ({
          href: f.value ? `/admin/retiros?estado=${f.value}` : "/admin/retiros",
          label: f.label,
          count: f.value ? retiros.filter((r) => r.status === f.value).length : retiros.length,
          active: estadoFiltro === f.value,
        }))}
      />

      <div className="mb-4">
        <Conteo n={ordenados.length} singular="retiro encontrado" plural="retiros encontrados" />
      </div>

      {ordenados.length === 0 ? (
        <EstadoVacio
          title="No hay retiros en el calendario."
          body="Crea el primero y aparecerá en /retiros del sitio público."
          action={
            <Boton tone="secundario" href="/admin/retiros/nuevo">
              + Nuevo retiro
            </Boton>
          }
        />
      ) : (
        <Tabla>
          <thead>
            <tr>
              <Th>Tema</Th>
              <Th>Fechas</Th>
              <Th>Elemento</Th>
              <Th>Sede</Th>
              <Th align="right">Cupo</Th>
              <Th>Estado</Th>
              <Th>Pública</Th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((r) => {
              const el = elements.find((e) => e.key === r.elementKey);
              const sede = estado(VENUE_STATE, r.venueState);
              const est = estado(RETREAT_STATUS, r.status);
              return (
                <FilaEnlace key={r.slug}>
                  <Td>
                    <EnlaceFila href={`/admin/retiros/${r.slug}`}>{r.themeEs}</EnlaceFila>
                    <div className="celda-secundaria">{r.slug}</div>
                  </Td>
                  <Td>{r.dateLabelEs}</Td>
                  <Td>
                    <span style={{ fontSize: 12 }}>{el?.nameEs ?? r.elementKey}</span>
                  </Td>
                  <Td>
                    {r.venueLabelEs}
                    <div className={`celda-secundaria ${TONO_TEXTO[sede.tone] ?? "texto-tenue"}`}>
                      {sede.label}
                    </div>
                  </Td>
                  <Td numeric>
                    {r.seatsLeft}/{r.capacity}
                  </Td>
                  <Td>
                    <Insignia tone={est.tone}>{est.label}</Insignia>
                  </Td>
                  <Td>
                    <a
                      href={`/es/retiros/${r.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="sobre-fila"
                    >
                      Ver ↗
                    </a>
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
