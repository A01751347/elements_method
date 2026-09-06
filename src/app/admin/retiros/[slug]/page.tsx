import { notFound } from "next/navigation";
import { getCalendarRetreatBySlug } from "@/modules/content/calendarRetreats";
import { elements } from "@/data/content";
import {
  FichaHeader,
  Cifra,
  CifraGrid,
  SeccionEtiqueta,
  Etiqueta,
  Campo,
  Input,
  Textarea,
  Select,
  Boton,
  Insignia,
} from "../../_components/ui";
import { BotonPendiente, ConfirmarAccion } from "../../_components/client";
import { RETREAT_STATUS, VENUE_STATE, estado } from "../../_lib/status";
import { fechaCorta } from "../../_lib/format";
import { updateRetreat, deleteRetreat } from "../actions";

export const dynamic = "force-dynamic";

function diasEntre(start: string, end: string): number {
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  if (Number.isNaN(a) || Number.isNaN(b) || b < a) return 0;
  return Math.round((b - a) / 86_400_000) + 1;
}

export default async function AdminRetreatFichaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = await getCalendarRetreatBySlug(slug);
  if (!r) notFound();

  const est = estado(RETREAT_STATUS, r.status);
  const sedeEstado = estado(VENUE_STATE, r.venueState);
  const el = elements.find((e) => e.key === r.elementKey);
  const dias = diasEntre(r.startDate, r.endDate);
  const seatsTone = r.seatsLeft <= 0 ? "peligro" : r.seatsLeft <= 3 ? "alerta" : "neutro";

  return (
    <>
      <FichaHeader
        back={{ href: "/admin/retiros", label: "Retiros" }}
        kicker={`${r.venueLabelEs} · ${sedeEstado.label}`}
        title={r.themeEs}
        badge={<Insignia tone={est.tone}>{est.label}</Insignia>}
        meta={`${r.dateLabelEs} · ${el?.nameEs ?? r.elementKey} · ${r.slug}`}
        aside={{ label: "Inversión", value: r.investmentLabelEs || "—" }}
      />

      <CifraGrid>
        <Cifra label="Cupo total" value={r.capacity} />
        <Cifra
          label="Lugares disponibles"
          value={r.seatsLeft}
          tone={seatsTone}
          note={`De ${r.capacity}`}
        />
        <Cifra
          label="Días"
          value={dias}
          note={`${fechaCorta(r.startDate)} → ${fechaCorta(r.endDate)}`}
        />
        <Cifra label="Estado" value={est.label} />
      </CifraGrid>

      <div className="ficha-columnas">
        <form action={updateRetreat.bind(null, r.slug)} className="flex flex-col gap-8">
          <div>
            <SeccionEtiqueta>Identidad</SeccionEtiqueta>
            <div className="flex flex-col gap-4">
              <Campo
                label="Slug"
                htmlFor="slug"
                hint={`Se usa en la URL pública /retiros/${r.slug}. Cambiarlo rompe enlaces compartidos.`}
                required
              >
                <Input id="slug" name="slug" defaultValue={r.slug} />
              </Campo>
              <Campo label="Tema (ES)" htmlFor="themeEs" required>
                <Input id="themeEs" name="themeEs" defaultValue={r.themeEs} />
              </Campo>
              <Campo label="Tema (EN)" htmlFor="themeEn">
                <Input id="themeEn" name="themeEn" defaultValue={r.themeEn} />
              </Campo>
              <Campo
                label="Elemento"
                htmlFor="elementKey"
                hint="Define el marco (framework) y el color de referencia interno del retiro."
              >
                <Select id="elementKey" name="elementKey" defaultValue={r.elementKey}>
                  <option value="tierra">Tierra</option>
                  <option value="fuego">Fuego</option>
                  <option value="agua">Agua</option>
                  <option value="aire">Aire</option>
                  <option value="eter">Núcleo</option>
                </Select>
              </Campo>
              <Campo label="Orden en el calendario" htmlFor="orderIdx">
                <Input
                  id="orderIdx"
                  name="orderIdx"
                  type="number"
                  defaultValue={String(r.orderIdx)}
                />
              </Campo>
              <Campo label="Resumen (ES)" htmlFor="summaryEs">
                <Textarea id="summaryEs" name="summaryEs" rows={4} defaultValue={r.summaryEs} />
              </Campo>
              <Campo label="Resumen (EN)" htmlFor="summaryEn">
                <Textarea id="summaryEn" name="summaryEn" rows={4} defaultValue={r.summaryEn} />
              </Campo>
            </div>
          </div>

          <div>
            <SeccionEtiqueta>Fechas</SeccionEtiqueta>
            <div className="flex flex-col gap-4">
              <Campo label="Inicio" htmlFor="startDate">
                <Input id="startDate" name="startDate" type="date" defaultValue={r.startDate} />
              </Campo>
              <Campo label="Fin" htmlFor="endDate">
                <Input id="endDate" name="endDate" type="date" defaultValue={r.endDate} />
              </Campo>
              <Campo
                label="Etiqueta de fecha (ES)"
                htmlFor="dateLabelEs"
                hint="Como se muestra al público: «22 sep 2026 · CDMX»."
              >
                <Input id="dateLabelEs" name="dateLabelEs" defaultValue={r.dateLabelEs} />
              </Campo>
              <Campo label="Etiqueta de fecha (EN)" htmlFor="dateLabelEn">
                <Input id="dateLabelEn" name="dateLabelEn" defaultValue={r.dateLabelEn} />
              </Campo>
            </div>
          </div>

          <div>
            <SeccionEtiqueta>Sede y cupo</SeccionEtiqueta>
            <div className="flex flex-col gap-4">
              <Campo label="Estado de la sede" htmlFor="venueState">
                <Select id="venueState" name="venueState" defaultValue={r.venueState}>
                  <option value="confirmed">Confirmada</option>
                  <option value="tentative">Tentativa</option>
                  <option value="tbd">Por definir</option>
                </Select>
              </Campo>
              <Campo label="Sede (ES)" htmlFor="venueLabelEs">
                <Input id="venueLabelEs" name="venueLabelEs" defaultValue={r.venueLabelEs} />
              </Campo>
              <Campo label="Sede (EN)" htmlFor="venueLabelEn">
                <Input id="venueLabelEn" name="venueLabelEn" defaultValue={r.venueLabelEn} />
              </Campo>
              <Campo label="Nota interna de sede" htmlFor="venueNote">
                <Input id="venueNote" name="venueNote" defaultValue={r.venueNote} />
              </Campo>
              <Campo label="Cupo total" htmlFor="capacity">
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min={0}
                  defaultValue={String(r.capacity)}
                />
              </Campo>
              <Campo
                label="Lugares disponibles"
                htmlFor="seatsLeft"
                hint="No puede ser mayor al cupo total."
              >
                <Input
                  id="seatsLeft"
                  name="seatsLeft"
                  type="number"
                  min={0}
                  defaultValue={String(r.seatsLeft)}
                />
              </Campo>
            </div>
          </div>

          <div>
            <SeccionEtiqueta>Comercial</SeccionEtiqueta>
            <div className="flex flex-col gap-4">
              <Campo
                label="Estado público"
                htmlFor="status"
                hint="Controla el filtro y la insignia en el calendario público."
              >
                <Select id="status" name="status" defaultValue={r.status}>
                  <option value="open">Abierta</option>
                  <option value="waitlist">Lista de espera</option>
                  <option value="closed">Cerrada</option>
                  <option value="sold">Sin cupo</option>
                </Select>
              </Campo>
              <Campo label="Etiqueta de inversión (ES)" htmlFor="investmentLabelEs">
                <Input
                  id="investmentLabelEs"
                  name="investmentLabelEs"
                  defaultValue={r.investmentLabelEs}
                />
              </Campo>
              <Campo label="Etiqueta de inversión (EN)" htmlFor="investmentLabelEn">
                <Input
                  id="investmentLabelEn"
                  name="investmentLabelEn"
                  defaultValue={r.investmentLabelEn}
                />
              </Campo>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <BotonPendiente pendingLabel="Guardando el retiro…">Guardar cambios</BotonPendiente>
            <Boton tone="secundario" href="/admin/retiros">
              Cancelar
            </Boton>
          </div>
        </form>

        <div className="ficha-trabajo">
          <div>
            <Etiqueta as="h2">Público</Etiqueta>
            <div className="flex flex-col gap-2 mt-2">
              <a href={`/es/retiros/${r.slug}`} target="_blank" rel="noreferrer">
                Ver página pública ↗
              </a>
              <a href="/es/retiros" target="_blank" rel="noreferrer">
                Ver calendario ↗
              </a>
            </div>
          </div>

          <div>
            <Etiqueta as="h2" tone="peligro">
              Zona de riesgo
            </Etiqueta>
            <p className="pista" style={{ marginBottom: 12 }}>
              Se borra del calendario y su página pública deja de existir.
            </p>
            <ConfirmarAccion
              trigger="Eliminar retiro"
              title="Eliminar retiro"
              body={`Se borra «${r.themeEs}» del calendario y su página pública deja de existir. Las órdenes existentes no se tocan.`}
              confirmLabel="Sí, eliminar el retiro"
              pendingLabel="Eliminando…"
              action={deleteRetreat}
              tone="peligro"
              hidden={[{ name: "slug", value: r.slug }]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
