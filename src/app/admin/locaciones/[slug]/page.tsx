import { notFound } from "next/navigation";
import { getVenueBySlug } from "@/modules/content/venues";
import {
  FichaHeader,
  Insignia,
  SeccionEtiqueta,
  Etiqueta,
  Campo,
  Input,
  Textarea,
  Select,
  Boton,
} from "../../_components/ui";
import { BotonPendiente, ConfirmarAccion } from "../../_components/client";
import { VENUE_STATE_ADMIN, estado } from "../../_lib/status";
import { updateVenue, deleteVenue } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminVenueFichaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = await getVenueBySlug(slug);
  if (!v) notFound();

  const est = estado(VENUE_STATE_ADMIN, v.state);

  return (
    <>
      <FichaHeader
        back={{ href: "/admin/locaciones", label: "Locaciones" }}
        kicker="Locación"
        title={v.name}
        badge={<Insignia tone={est.tone}>{est.label}</Insignia>}
        meta={`${v.city} · ${v.capacity || "capacidad sin definir"} · ${v.rangeMxn || "sin rango de precio"}`}
      />

      <div className="ficha-columnas">
        <form action={updateVenue.bind(null, v.slug)} className="flex flex-col gap-8">
          <div>
            <SeccionEtiqueta>Identificación</SeccionEtiqueta>
            <div className="flex flex-col gap-4">
              <Campo
                label="Slug"
                htmlFor="slug"
                hint={`Se usa en referencias internas /locaciones/${v.slug}.`}
                required
              >
                <Input id="slug" name="slug" defaultValue={v.slug} />
              </Campo>
              <Campo label="Nombre" htmlFor="name" required>
                <Input id="name" name="name" defaultValue={v.name} />
              </Campo>
              <Campo label="Ciudad" htmlFor="city">
                <Input id="city" name="city" defaultValue={v.city} />
              </Campo>
              <Campo label="URL del sitio" htmlFor="url">
                <Input id="url" name="url" defaultValue={v.url} placeholder="https://…" />
              </Campo>
            </div>
          </div>

          <div>
            <SeccionEtiqueta>Estado y capacidad</SeccionEtiqueta>
            <div className="flex flex-col gap-4">
              <Campo label="Estado" htmlFor="state">
                <Select id="state" name="state" defaultValue={v.state}>
                  {Object.entries(VENUE_STATE_ADMIN).map(([value, s]) => (
                    <option key={value} value={value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </Campo>
              <Campo label="Capacidad" htmlFor="capacity" hint="Texto libre, p. ej. «Cabañas 2 personas c/u».">
                <Input id="capacity" name="capacity" defaultValue={v.capacity} />
              </Campo>
              <Campo label="Rango de precio (MXN)" htmlFor="rangeMxn">
                <Input id="rangeMxn" name="rangeMxn" defaultValue={v.rangeMxn} />
              </Campo>
            </div>
          </div>

          <div>
            <SeccionEtiqueta>Notas internas</SeccionEtiqueta>
            <Campo label="Notas" htmlFor="notesEs" hint="Solo lo ve el equipo.">
              <Textarea id="notesEs" name="notesEs" rows={6} defaultValue={v.notesEs} />
            </Campo>
          </div>

          <div className="flex items-center gap-3">
            <BotonPendiente pendingLabel="Guardando la locación…">Guardar cambios</BotonPendiente>
            <Boton tone="secundario" href="/admin/locaciones">
              Cancelar
            </Boton>
          </div>
        </form>

        <div className="ficha-trabajo">
          {v.url && (
            <div>
              <Etiqueta as="h2">Sitio web</Etiqueta>
              <div className="mt-2">
                <a href={v.url} target="_blank" rel="noreferrer">
                  Sitio web ↗
                </a>
              </div>
            </div>
          )}

          <div>
            <Etiqueta as="h2" tone="peligro">
              Zona de riesgo
            </Etiqueta>
            <p className="pista" style={{ marginBottom: 12 }}>
              Se borra del catálogo de sedes. Los retiros que ya la mencionan no se modifican.
            </p>
            <ConfirmarAccion
              trigger="Eliminar locación"
              title="Eliminar locación"
              body={`Se borra «${v.name}» del catálogo de sedes. Los retiros ya publicados con esta sede conservan su texto, pero deja de poder asignarse a nuevos retiros.`}
              confirmLabel="Sí, eliminar la locación"
              pendingLabel="Eliminando…"
              action={deleteVenue}
              tone="peligro"
              hidden={[{ name: "slug", value: v.slug }]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
