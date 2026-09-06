import { db } from "@/shared/db/client";
import { calculatorConfig } from "@/shared/db/schema";
import { getCalculatorConfig } from "@/shared/pricing/enterprise";
import {
  PageHeader,
  Banner,
  Campo,
  Input,
  PasoGuiado,
  AntesDeConfirmar,
} from "../../_components/ui";
import { BotonPendiente } from "../../_components/client";
import { guardarCalculadora } from "../actions";
import { TramosEditor } from "./TramosEditor";

export const dynamic = "force-dynamic";

export default async function CalculadoraPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const [config, rows] = await Promise.all([
    getCalculatorConfig(),
    db.select({ key: calculatorConfig.key }).from(calculatorConfig),
  ]);
  const dbVacia = rows.length === 0;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Fórmula de cotización"
        subtitle="Lo que ves aquí es lo que calcula la página pública /empresas/cotizar. Los cambios aplican de inmediato, sin deploy."
      />

      {ok === "1" && <Banner tone="info">Fórmula guardada.</Banner>}
      {dbVacia && (
        <Banner tone="aviso">
          La base de datos no tiene filas en calculator_config: la calculadora está usando los valores por
          defecto del código.
        </Banner>
      )}

      <form action={guardarCalculadora} className="formulario-guiado">
        <PasoGuiado
          numero="01"
          pregunta="¿Cuánto cuesta una sesión base?"
          hint="La fórmula completa: base · sesiones · multiplicador por personas · multiplicador por modalidad − descuento por volumen + IVA."
        >
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <Campo label="Precio base en MXN" htmlFor="basePerSessionMxn">
              <Input
                id="basePerSessionMxn"
                name="basePerSessionMxn"
                type="number"
                min={1}
                step={1}
                defaultValue={config.basePerSessionMxn}
                required
              />
            </Campo>
            <Campo label="Precio base en USD" htmlFor="basePerSessionUsd">
              <Input
                id="basePerSessionUsd"
                name="basePerSessionUsd"
                type="number"
                min={1}
                step={1}
                defaultValue={config.basePerSessionUsd}
                required
              />
            </Campo>
          </div>
        </PasoGuiado>

        <PasoGuiado numero="02" pregunta="¿Cuáles son los mínimos?">
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <Campo label="Personas mínimas" htmlFor="minPeople">
              <Input id="minPeople" name="minPeople" type="number" min={1} defaultValue={config.minPeople} required />
            </Campo>
            <Campo label="Sesiones mínimas" htmlFor="minSessions">
              <Input
                id="minSessions"
                name="minSessions"
                type="number"
                min={1}
                defaultValue={config.minSessions}
                required
              />
            </Campo>
            <Campo label="Días de vigencia" htmlFor="validityDays" hint="Días de vigencia de la cotización.">
              <Input
                id="validityDays"
                name="validityDays"
                type="number"
                min={1}
                defaultValue={config.validityDays}
                required
              />
            </Campo>
          </div>
        </PasoGuiado>

        <PasoGuiado numero="03" pregunta="¿Cómo cambia por modalidad?">
          <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <Campo label="Presencial" htmlFor="modalityPresencial">
              <Input
                id="modalityPresencial"
                name="modalityPresencial"
                type="number"
                step={0.05}
                min={0}
                defaultValue={config.modalityMultiplier.presencial}
                required
              />
            </Campo>
            <Campo label="Virtual" htmlFor="modalityVirtual">
              <Input
                id="modalityVirtual"
                name="modalityVirtual"
                type="number"
                step={0.05}
                min={0}
                defaultValue={config.modalityMultiplier.virtual}
                required
              />
            </Campo>
            <Campo label="Híbrido" htmlFor="modalityHibrido">
              <Input
                id="modalityHibrido"
                name="modalityHibrido"
                type="number"
                step={0.05}
                min={0}
                defaultValue={config.modalityMultiplier.hibrido}
                required
              />
            </Campo>
          </div>
        </PasoGuiado>

        <PasoGuiado
          numero="04"
          pregunta="¿Cómo escala por número de personas?"
          hint="Cada tramo cubre un rango de personas; el multiplicador se aplica al precio base."
        >
          <TramosEditor
            name="peopleTiersJson"
            columnas={[
              { key: "min", label: "Desde" },
              { key: "max", label: "Hasta" },
              { key: "multiplier", label: "Multiplicador", step: 0.05 },
            ]}
            filasIniciales={config.peopleTiers.map((t) => ({ min: t.min, max: t.max, multiplier: t.multiplier }))}
            agregarLabel="+ Agregar tramo"
          />
        </PasoGuiado>

        <PasoGuiado
          numero="05"
          pregunta="¿Qué descuento por volumen?"
          hint="Se aplica el descuento del umbral más alto que el subtotal en MXN alcance."
        >
          <TramosEditor
            name="volumeDiscountJson"
            columnas={[
              { key: "thresholdMxn", label: "Desde (MXN)" },
              { key: "discountPct", label: "Descuento %", step: 0.5 },
            ]}
            filasIniciales={config.volumeDiscount.map((v) => ({
              thresholdMxn: v.thresholdMxn,
              discountPct: v.discountPct,
            }))}
            agregarLabel="+ Agregar tramo"
          />
        </PasoGuiado>

        <AntesDeConfirmar
          boton={<BotonPendiente pendingLabel="Guardando la fórmula…">Guardar la fórmula</BotonPendiente>}
        >
          Se guardan las 8 claves en calculator_config y la calculadora pública usa la nueva fórmula en la
          siguiente visita.
        </AntesDeConfirmar>
      </form>
    </div>
  );
}
