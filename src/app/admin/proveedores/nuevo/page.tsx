import { PageHeader, Tarjeta, SeccionEtiqueta, Campo, Input, Textarea, Select, Boton } from "../../_components/ui";
import { BotonPendiente } from "../../_components/client";
import { PROVIDER_STATUS } from "../../_lib/status";
import { createProvider } from "../actions";

export const dynamic = "force-dynamic";

export default function AdminProviderNewPage() {
  return (
    <>
      <PageHeader
        title="Nuevo proveedor"
        subtitle="Registra una disciplina o facilitador para poder asignarlo a un retiro."
      />

      <Tarjeta>
        <form action={createProvider} className="flex flex-col gap-8" style={{ maxWidth: 640 }}>
          <div>
            <SeccionEtiqueta>Disciplina</SeccionEtiqueta>
            <div className="flex flex-col gap-4">
              <Campo label="Slug" htmlFor="slug" hint="Minúsculas y guiones, p. ej. caballos." required>
                <Input id="slug" name="slug" placeholder="caballos" />
              </Campo>
              <Campo label="Nombre (ES)" htmlFor="disciplineEs" required>
                <Input id="disciplineEs" name="disciplineEs" />
              </Campo>
              <Campo label="Nombre (EN)" htmlFor="disciplineEn">
                <Input id="disciplineEn" name="disciplineEn" />
              </Campo>
              <Campo label="Elemento" htmlFor="elementAffinity">
                <Select id="elementAffinity" name="elementAffinity" defaultValue="tierra">
                  <option value="tierra">Tierra</option>
                  <option value="fuego">Fuego</option>
                  <option value="agua">Agua</option>
                  <option value="aire">Aire</option>
                  <option value="eter">Núcleo</option>
                </Select>
              </Campo>
              <Campo label="Descripción (ES)" htmlFor="descriptionEs">
                <Textarea id="descriptionEs" name="descriptionEs" rows={4} />
              </Campo>
              <Campo label="Descripción (EN)" htmlFor="descriptionEn">
                <Textarea id="descriptionEn" name="descriptionEn" rows={4} />
              </Campo>
            </div>
          </div>

          <div>
            <SeccionEtiqueta>Proveedor / facilitador</SeccionEtiqueta>
            <div className="flex flex-col gap-4">
              <Campo label="Nombre" htmlFor="providerName" hint="Se muestra «Por confirmar» mientras esté vacío.">
                <Input id="providerName" name="providerName" />
              </Campo>
              <Campo label="Contacto" htmlFor="providerContact">
                <Input id="providerContact" name="providerContact" />
              </Campo>
              <Campo label="Estado" htmlFor="status">
                <Select id="status" name="status" defaultValue="researching">
                  {Object.entries(PROVIDER_STATUS).map(([value, s]) => (
                    <option key={value} value={value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </Campo>
              <Campo label="Notas (ES)" htmlFor="notesEs" hint="Solo lo ve el equipo.">
                <Textarea id="notesEs" name="notesEs" rows={4} />
              </Campo>
              <Campo label="Notas (EN)" htmlFor="notesEn">
                <Textarea id="notesEn" name="notesEn" rows={4} />
              </Campo>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <BotonPendiente pendingLabel="Creando el proveedor…">Crear proveedor</BotonPendiente>
            <Boton tone="secundario" href="/admin/proveedores">
              Cancelar
            </Boton>
          </div>
        </form>
      </Tarjeta>
    </>
  );
}
