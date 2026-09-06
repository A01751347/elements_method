import {
  PageHeader,
  PasoGuiado,
  AntesDeConfirmar,
  Campo,
  Input,
  Textarea,
  Select,
} from "../../_components/ui";
import { BotonPendiente } from "../../_components/client";
import { createRetreat } from "../actions";

export const dynamic = "force-dynamic";

export default function AdminRetreatNewPage() {
  return (
    <>
      <PageHeader
        title="Nuevo retiro"
        subtitle="Responde estos cinco pasos y el retiro queda publicado en el calendario."
      />

      <form action={createRetreat} className="formulario-guiado">
        <PasoGuiado numero="01" pregunta="¿Cómo se llama el retiro?">
          <div className="flex flex-col gap-4">
            <Campo label="Tema (ES)" htmlFor="themeEs" required>
              <Input id="themeEs" name="themeEs" placeholder="EQUINOX · Tepoztlán" />
            </Campo>
            <Campo label="Tema (EN)" htmlFor="themeEn">
              <Input id="themeEn" name="themeEn" placeholder="EQUINOX · Tepoztlán" />
            </Campo>
            <Campo
              label="Slug"
              htmlFor="slug"
              hint="Minúsculas y guiones, p. ej. equinox-2026. Se usa en la URL pública /retiros/{slug}."
              required
            >
              <Input id="slug" name="slug" placeholder="equinox-2026" />
            </Campo>
          </div>
        </PasoGuiado>

        <PasoGuiado numero="02" pregunta="¿Cuándo es?">
          <div className="flex flex-col gap-4">
            <Campo label="Inicio" htmlFor="startDate" required>
              <Input id="startDate" name="startDate" type="date" />
            </Campo>
            <Campo label="Fin" htmlFor="endDate" required>
              <Input id="endDate" name="endDate" type="date" />
            </Campo>
            <Campo
              label="Etiqueta de fecha (ES)"
              htmlFor="dateLabelEs"
              hint="Como se muestra al público: «22 sep 2026 · CDMX»."
            >
              <Input id="dateLabelEs" name="dateLabelEs" placeholder="22 sep 2026 · CDMX" />
            </Campo>
            <Campo label="Etiqueta de fecha (EN)" htmlFor="dateLabelEn">
              <Input id="dateLabelEn" name="dateLabelEn" placeholder="Sep 22, 2026 · CDMX" />
            </Campo>
          </div>
        </PasoGuiado>

        <PasoGuiado numero="03" pregunta="¿Dónde?">
          <div className="flex flex-col gap-4">
            <Campo label="Estado de la sede" htmlFor="venueState">
              <Select id="venueState" name="venueState" defaultValue="tbd">
                <option value="confirmed">Confirmada</option>
                <option value="tentative">Tentativa</option>
                <option value="tbd">Por definir</option>
              </Select>
            </Campo>
            <Campo label="Sede (ES)" htmlFor="venueLabelEs">
              <Input id="venueLabelEs" name="venueLabelEs" placeholder="Tepoztlán, Morelos" />
            </Campo>
            <Campo label="Sede (EN)" htmlFor="venueLabelEn">
              <Input id="venueLabelEn" name="venueLabelEn" placeholder="Tepoztlán, Morelos" />
            </Campo>
            <Campo label="Nota interna de sede" htmlFor="venueNote" hint="Solo la ve el equipo.">
              <Input id="venueNote" name="venueNote" />
            </Campo>
          </div>
        </PasoGuiado>

        <PasoGuiado numero="04" pregunta="¿Cuántas personas?">
          <div className="flex flex-col gap-4">
            <Campo label="Cupo total" htmlFor="capacity">
              <Input id="capacity" name="capacity" type="number" min={0} defaultValue="20" />
            </Campo>
            <Campo
              label="Lugares disponibles"
              htmlFor="seatsLeft"
              hint="No puede ser mayor al cupo total."
            >
              <Input id="seatsLeft" name="seatsLeft" type="number" min={0} defaultValue="20" />
            </Campo>
            <Campo label="Estado público" htmlFor="status">
              <Select id="status" name="status" defaultValue="open">
                <option value="open">Abierta</option>
                <option value="waitlist">Lista de espera</option>
                <option value="closed">Cerrada</option>
                <option value="sold">Sin cupo</option>
              </Select>
            </Campo>
          </div>
        </PasoGuiado>

        <PasoGuiado numero="05" pregunta="¿Qué elemento y cómo se describe?">
          <div className="flex flex-col gap-4">
            <Campo label="Elemento" htmlFor="elementKey">
              <Select id="elementKey" name="elementKey" defaultValue="tierra">
                <option value="tierra">Tierra</option>
                <option value="fuego">Fuego</option>
                <option value="agua">Agua</option>
                <option value="aire">Aire</option>
                <option value="eter">Núcleo</option>
              </Select>
            </Campo>
            <Campo label="Resumen (ES)" htmlFor="summaryEs">
              <Textarea id="summaryEs" name="summaryEs" rows={4} />
            </Campo>
            <Campo label="Resumen (EN)" htmlFor="summaryEn">
              <Textarea id="summaryEn" name="summaryEn" rows={4} />
            </Campo>
            <Campo label="Etiqueta de inversión (ES)" htmlFor="investmentLabelEs">
              <Input id="investmentLabelEs" name="investmentLabelEs" placeholder="$18,500 MXN" />
            </Campo>
            <Campo label="Etiqueta de inversión (EN)" htmlFor="investmentLabelEn">
              <Input id="investmentLabelEn" name="investmentLabelEn" placeholder="$18,500 MXN" />
            </Campo>
            <Campo
              label="Orden en el calendario"
              htmlFor="orderIdx"
              hint="Define en qué posición aparece dentro de /retiros."
            >
              <Input id="orderIdx" name="orderIdx" type="number" defaultValue="0" />
            </Campo>
          </div>
        </PasoGuiado>

        <AntesDeConfirmar
          boton={
            <BotonPendiente pendingLabel="Creando el retiro…">
              Crear retiro y publicarlo
            </BotonPendiente>
          }
        >
          Se crea el retiro en el calendario y aparece de inmediato en /retiros del sitio público
          con el estado que elegiste.
        </AntesDeConfirmar>
      </form>
    </>
  );
}
