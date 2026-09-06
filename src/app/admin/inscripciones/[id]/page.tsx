import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { inscriptions } from "@/shared/db/schema/operations";
import {
  FichaHeader,
  Insignia,
  Etiqueta,
  DatoLista,
  Select,
  Textarea,
  Boton,
} from "../../_components/ui";
import { BotonPendiente, ConfirmarAccion } from "../../_components/client";
import { INSCRIPTION_STATUS, INSCRIPTION_SOURCE, estado } from "../../_lib/status";
import { fechaHora } from "../../_lib/format";
import { actualizarSeguimiento, archivar } from "../actions";

export const dynamic = "force-dynamic";

async function loadInscription(id: string) {
  const rows = await db.select().from(inscriptions).where(eq(inscriptions.id, id)).limit(1);
  return rows[0] ?? null;
}

function esObjetoPlano(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export default async function AdminInscripcionFichaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const l = await loadInscription(id);
  if (!l) notFound();

  const est = estado(INSCRIPTION_STATUS, l.status);
  const fuente = estado(INSCRIPTION_SOURCE, l.source);
  const programa = l.retreatSlug || l.pathSlug || "sin programa asociado";
  const asuntoCorreo = encodeURIComponent(`Elements Method · ${programa}`);
  const whatsappHref = l.phone ? `https://wa.me/${l.phone.replace(/\D/g, "")}` : undefined;

  return (
    <>
      <FichaHeader
        back={{ href: "/admin/inscripciones", label: "Inscripciones" }}
        kicker={`Inscripción · ${fuente.label}`}
        title={l.name}
        badge={<Insignia tone={est.tone}>{est.label}</Insignia>}
        meta={`${fechaHora(l.createdAt)} · ${l.locale} · ${programa}`}
        aside={{ label: "Origen", value: fuente.label }}
      />

      <div className="ficha-columnas">
        <div className="flex flex-col gap-8">
          <div>
            <Etiqueta as="h2">Contacto</Etiqueta>
            <div className="mt-3">
              <DatoLista
                columns={3}
                items={[
                  { label: "Correo", value: <a href={`mailto:${l.email}`}>{l.email}</a> },
                  { label: "Teléfono", value: l.phone || "—" },
                  { label: "Organización", value: l.organization || "—" },
                  { label: "Rol", value: l.role || "—" },
                  { label: "Idioma", value: l.locale },
                  { label: "Programa / retiro", value: l.retreatSlug || l.pathSlug || "—" },
                ]}
              />
            </div>
          </div>

          <div>
            <Etiqueta as="h2">Mensaje</Etiqueta>
            <div className="mt-3">
              {l.message ? (
                <div className="renglon-destacado">
                  <p>{l.message}</p>
                </div>
              ) : (
                <p className="texto-sutil">Sin mensaje.</p>
              )}
            </div>
          </div>

          {esObjetoPlano(l.metadata) && Object.keys(l.metadata).length > 0 && (
            <div>
              <Etiqueta as="h2">Datos adicionales</Etiqueta>
              <div className="mt-3">
                <DatoLista
                  columns={2}
                  items={Object.entries(l.metadata).map(([label, value]) => ({
                    label,
                    value: typeof value === "string" ? value : JSON.stringify(value),
                  }))}
                />
              </div>
            </div>
          )}
        </div>

        <div className="ficha-trabajo">
          <div>
            <Etiqueta as="h2">Seguimiento</Etiqueta>
            <form
              action={actualizarSeguimiento.bind(null, l.id)}
              className="flex flex-col gap-4 mt-3"
            >
              <div className="campo">
                <label className="etiqueta" htmlFor="status">
                  Estado
                </label>
                <Select id="status" name="status" defaultValue={l.status}>
                  {Object.entries(INSCRIPTION_STATUS).map(([value, s]) => (
                    <option key={value} value={value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="campo">
                <label className="etiqueta" htmlFor="notes">
                  Notas
                </label>
                <Textarea
                  id="notes"
                  name="notes"
                  rows={6}
                  defaultValue={l.notes ?? ""}
                  placeholder="Solo lo ve el equipo…"
                />
                <p className="pista">Solo lo ve el equipo.</p>
              </div>
              <BotonPendiente pendingLabel="Guardando…">Guardar seguimiento</BotonPendiente>
            </form>
          </div>

          <div>
            <Etiqueta as="h2">Contactar</Etiqueta>
            <div className="flex flex-wrap gap-2 mt-3">
              <Boton tone="secundario" href={`mailto:${l.email}?subject=${asuntoCorreo}`}>
                Escribir correo ✉
              </Boton>
              {whatsappHref && (
                <Boton tone="secundario" href={whatsappHref} external>
                  WhatsApp
                </Boton>
              )}
            </div>
          </div>

          <div>
            <Etiqueta as="h2" tone="peligro">
              Zona de riesgo
            </Etiqueta>
            <p className="pista" style={{ marginBottom: 12 }}>
              La inscripción deja de contar como pendiente en el resumen.
            </p>
            <ConfirmarAccion
              trigger="Archivar"
              title="Archivar"
              body="La inscripción pasa a «archivada» y deja de contar como pendiente. No se borra nada."
              confirmLabel="Sí, archivar"
              pendingLabel="Archivando…"
              action={archivar}
              tone="peligro"
              hidden={[{ name: "id", value: l.id }]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
