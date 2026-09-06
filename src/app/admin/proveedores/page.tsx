import { getProviders } from "@/modules/content/providers";
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
import { PROVIDER_STATUS, estado } from "../_lib/status";

export const dynamic = "force-dynamic";

const FILTROS_ESTADO = [
  { value: "", label: "Todos" },
  ...Object.entries(PROVIDER_STATUS).map(([value, s]) => ({ value, label: s.label })),
];

export default async function AdminProvidersPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; elemento?: string }>;
}) {
  const { estado: estadoFiltro = "", elemento: elementoFiltro = "" } = await searchParams;
  const providers = await getProviders();
  const filtrados = providers.filter(
    (p) =>
      (!estadoFiltro || p.status === estadoFiltro) &&
      (!elementoFiltro || p.elementAffinity === elementoFiltro),
  );

  const qs = (overrides: { estado?: string; elemento?: string }) => {
    const params = new URLSearchParams();
    const estado_ = overrides.estado ?? estadoFiltro;
    const elemento_ = overrides.elemento ?? elementoFiltro;
    if (estado_) params.set("estado", estado_);
    if (elemento_) params.set("elemento", elemento_);
    const s = params.toString();
    return s ? `/admin/proveedores?${s}` : "/admin/proveedores";
  };

  return (
    <>
      <PageHeader
        title="Proveedores"
        subtitle="Disciplinas y facilitadores disponibles para asignar a retiros. Cada fila abre la ficha."
        actions={
          <Boton tone="primario" href="/admin/proveedores/nuevo">
            + Nuevo proveedor
          </Boton>
        }
      />

      <Filtros
        items={FILTROS_ESTADO.map((f) => ({
          href: qs({ estado: f.value }),
          label: f.label,
          count: f.value
            ? providers.filter((p) => p.status === f.value).length
            : providers.length,
          active: estadoFiltro === f.value,
        }))}
      />

      <Filtros
        items={[
          { value: "", label: "Todos los elementos" },
          ...elements.map((e) => ({ value: e.key, label: e.nameEs })),
        ].map((f) => ({
          href: qs({ elemento: f.value }),
          label: f.label,
          count: f.value
            ? providers.filter((p) => p.elementAffinity === f.value).length
            : providers.length,
          active: elementoFiltro === f.value,
        }))}
      />

      <div className="mb-4">
        <Conteo
          n={filtrados.length}
          singular="proveedor encontrado"
          plural="proveedores encontrados"
        />
      </div>

      {filtrados.length === 0 ? (
        <EstadoVacio
          title="No hay proveedores registrados."
          body="Crea el primero para poder asignarlo a un retiro."
          action={
            <Boton tone="secundario" href="/admin/proveedores/nuevo">
              + Nuevo proveedor
            </Boton>
          }
        />
      ) : (
        <Tabla>
          <thead>
            <tr>
              <Th>Disciplina</Th>
              <Th>Elemento</Th>
              <Th>Proveedor</Th>
              <Th>Contacto</Th>
              <Th>Estado</Th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p) => {
              const el = elements.find((e) => e.key === p.elementAffinity);
              const est = estado(PROVIDER_STATUS, p.status);
              return (
                <FilaEnlace key={p.slug}>
                  <Td>
                    <EnlaceFila href={`/admin/proveedores/${p.slug}`}>{p.disciplineEs}</EnlaceFila>
                    <div className="celda-secundaria">{p.disciplineEn}</div>
                  </Td>
                  <Td>
                    <span style={{ fontSize: 12 }}>{el?.nameEs ?? p.elementAffinity}</span>
                  </Td>
                  <Td>
                    {p.providerName ? (
                      p.providerName
                    ) : (
                      <span className="texto-sutil">Por confirmar</span>
                    )}
                  </Td>
                  <Td secondary>{p.providerContact || "—"}</Td>
                  <Td>
                    <Insignia tone={est.tone}>{est.label}</Insignia>
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
