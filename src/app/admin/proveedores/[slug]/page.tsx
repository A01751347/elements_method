import { notFound } from "next/navigation";
import { getProviderBySlug } from "@/modules/content/providers";
import { elements } from "@/data/content";
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
import { PROVIDER_STATUS, estado } from "../../_lib/status";
import { updateProvider, deleteProvider } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminProviderFichaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProviderBySlug(slug);
  if (!p) notFound();

  const est = estado(PROVIDER_STATUS, p.status);
  const el = elements.find((e) => e.key === p.elementAffinity);

  return (
    <>
      <FichaHeader
        back={{ href: "/admin/proveedores", label: "Proveedores" }}
        kicker="Proveedor"
        title={p.disciplineEs}
        badge={<Insignia tone={est.tone}>{est.label}</Insignia>}
        meta={`${el?.nameEs ?? p.elementAffinity} · ${p.providerName || "sin proveedor asignado"}`}
      />

      <div className="ficha-columnas">
        <form action={updateProvider.bind(null, p.slug)} className="flex flex-col gap-8">
          <div>
            <SeccionEtiqueta>Disciplina</SeccionEtiqueta>
            <div className="flex flex-col gap-4">
              <Campo label="Slug" htmlFor="slug" required>
                <Input id="slug" name="slug" defaultValue={p.slug} />
              </Campo>
              <Campo label="Nombre (ES)" htmlFor="disciplineEs" required>
                <Input id="disciplineEs" name="disciplineEs" defaultValue={p.disciplineEs} />
              </Campo>
              <Campo label="Nombre (EN)" htmlFor="disciplineEn">
                <Input id="disciplineEn" name="disciplineEn" defaultValue={p.disciplineEn} />
              </Campo>
              <Campo label="Elemento" htmlFor="elementAffinity">
                <Select id="elementAffinity" name="elementAffinity" defaultValue={p.elementAffinity}>
                  <option value="tierra">Tierra</option>
                  <option value="fuego">Fuego</option>
                  <option value="agua">Agua</option>
                  <option value="aire">Aire</option>
                  <option value="eter">Núcleo</option>
                </Select>
              </Campo>
              <Campo label="Descripción (ES)" htmlFor="descriptionEs">
                <Textarea id="descriptionEs" name="descriptionEs" rows={4} defaultValue={p.descriptionEs} />
              </Campo>
              <Campo label="Descripción (EN)" htmlFor="descriptionEn">
                <Textarea id="descriptionEn" name="descriptionEn" rows={4} defaultValue={p.descriptionEn} />
              </Campo>
            </div>
          </div>

          <div>
            <SeccionEtiqueta>Proveedor / facilitador</SeccionEtiqueta>
            <div className="flex flex-col gap-4">
              <Campo label="Nombre" htmlFor="providerName" hint="Se muestra «Por confirmar» mientras esté vacío.">
                <Input id="providerName" name="providerName" defaultValue={p.providerName} />
              </Campo>
              <Campo label="Contacto" htmlFor="providerContact">
                <Input id="providerContact" name="providerContact" defaultValue={p.providerContact} />
              </Campo>
              <Campo label="Estado" htmlFor="status">
                <Select id="status" name="status" defaultValue={p.status}>
                  {Object.entries(PROVIDER_STATUS).map(([value, s]) => (
                    <option key={value} value={value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </Campo>
              <Campo label="Notas (ES)" htmlFor="notesEs" hint="Solo lo ve el equipo.">
                <Textarea id="notesEs" name="notesEs" rows={4} defaultValue={p.notesEs} />
              </Campo>
              <Campo label="Notas (EN)" htmlFor="notesEn">
                <Textarea id="notesEn" name="notesEn" rows={4} defaultValue={p.notesEn} />
              </Campo>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <BotonPendiente pendingLabel="Guardando el proveedor…">Guardar cambios</BotonPendiente>
            <Boton tone="secundario" href="/admin/proveedores">
              Cancelar
            </Boton>
          </div>
        </form>

        <div className="ficha-trabajo">
          <div>
            <Etiqueta as="h2" tone="peligro">
              Zona de riesgo
            </Etiqueta>
            <p className="pista" style={{ marginBottom: 12 }}>
              Se borra del catálogo de proveedores. No se toca ningún retiro ya publicado.
            </p>
            <ConfirmarAccion
              trigger="Eliminar proveedor"
              title="Eliminar proveedor"
              body={`Se borra «${p.disciplineEs}» del catálogo de proveedores.`}
              confirmLabel="Sí, eliminar el proveedor"
              pendingLabel="Eliminando…"
              action={deleteProvider}
              tone="peligro"
              hidden={[{ name: "slug", value: p.slug }]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
