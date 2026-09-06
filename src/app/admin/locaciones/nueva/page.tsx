import { PageHeader, Tarjeta, SeccionEtiqueta, Campo, Input, Textarea, Select, Boton } from "../../_components/ui";
import { BotonPendiente } from "../../_components/client";
import { VENUE_STATE_ADMIN } from "../../_lib/status";
import { createVenue } from "../actions";

export const dynamic = "force-dynamic";

export default function AdminVenueNewPage() {
  return (
    <>
      <PageHeader title="Nueva locación" subtitle="Registra una sede candidata para futuros retiros." />

      <Tarjeta>
        <form action={createVenue} className="flex flex-col gap-8" style={{ maxWidth: 640 }}>
          <div>
            <SeccionEtiqueta>Identificación</SeccionEtiqueta>
            <div className="flex flex-col gap-4">
              <Campo label="Slug" htmlFor="slug" hint="Minúsculas y guiones, p. ej. bosque-geometrico." required>
                <Input id="slug" name="slug" placeholder="bosque-geometrico" />
              </Campo>
              <Campo label="Nombre" htmlFor="name" required>
                <Input id="name" name="name" />
              </Campo>
              <Campo label="Ciudad" htmlFor="city">
                <Input id="city" name="city" />
              </Campo>
              <Campo label="URL del sitio" htmlFor="url">
                <Input id="url" name="url" placeholder="https://…" />
              </Campo>
            </div>
          </div>

          <div>
            <SeccionEtiqueta>Estado y capacidad</SeccionEtiqueta>
            <div className="flex flex-col gap-4">
              <Campo label="Estado" htmlFor="state">
                <Select id="state" name="state" defaultValue="researching">
                  {Object.entries(VENUE_STATE_ADMIN).map(([value, s]) => (
                    <option key={value} value={value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </Campo>
              <Campo label="Capacidad" htmlFor="capacity" hint="Texto libre, p. ej. «Cabañas 2 personas c/u».">
                <Input id="capacity" name="capacity" />
              </Campo>
              <Campo label="Rango de precio (MXN)" htmlFor="rangeMxn">
                <Input id="rangeMxn" name="rangeMxn" />
              </Campo>
            </div>
          </div>

          <div>
            <SeccionEtiqueta>Notas internas</SeccionEtiqueta>
            <Campo label="Notas" htmlFor="notesEs" hint="Solo lo ve el equipo.">
              <Textarea id="notesEs" name="notesEs" rows={6} />
            </Campo>
          </div>

          <div className="flex items-center gap-3">
            <BotonPendiente pendingLabel="Creando la locación…">Crear locación</BotonPendiente>
            <Boton tone="secundario" href="/admin/locaciones">
              Cancelar
            </Boton>
          </div>
        </form>
      </Tarjeta>
    </>
  );
}
