import { getSiteSettingsRow, getTrackingConfig } from "@/shared/integrations/siteConfig";
import { PageHeader, Banner, Tarjeta, SeccionEtiqueta, Campo, Input, Boton } from "../_components/ui";
import { BotonPendiente } from "../_components/client";
import { saveTrackingSettings } from "./actions";

export const dynamic = "force-dynamic";

interface CampoTracking {
  name:
    | "gaMeasurementId"
    | "gtmContainerId"
    | "metaPixelId"
    | "googleAdsId"
    | "googleAdsPurchaseLabel"
    | "linkedinPartnerId";
  label: string;
  placeholder: string;
  hint: string;
}

const ANALITICA: CampoTracking[] = [
  {
    name: "gaMeasurementId",
    label: "Google Analytics 4",
    placeholder: "G-XXXXXXXXXX",
    hint: "Measurement ID de tu propiedad GA4 (Admin → Flujos de datos).",
  },
  {
    name: "gtmContainerId",
    label: "Google Tag Manager",
    placeholder: "GTM-XXXXXXX",
    hint: "Opcional: úsalo solo si prefieres administrar todo el tracking desde un contenedor único.",
  },
];

const MARKETING: CampoTracking[] = [
  {
    name: "metaPixelId",
    label: "Meta Pixel (Facebook/Instagram)",
    placeholder: "123456789012345",
    hint: "ID numérico del Pixel en Meta Events Manager.",
  },
  {
    name: "googleAdsId",
    label: "Google Ads",
    placeholder: "AW-XXXXXXXXX",
    hint: "ID de conversión de Google Ads (Herramientas → Conversiones).",
  },
  {
    name: "googleAdsPurchaseLabel",
    label: "Google Ads — etiqueta de compra",
    placeholder: "AbC-D_efG-h12_34-567",
    hint: "Conversion label de la acción «Compra» (se combina con el ID de Ads).",
  },
  {
    name: "linkedinPartnerId",
    label: "LinkedIn Insight Tag",
    placeholder: "1234567",
    hint: "Partner ID del Insight Tag (Campaign Manager → Insight Tag).",
  },
];

const TODOS = [...ANALITICA, ...MARKETING];

function EstadoCampo({ dbValue, effectiveValue }: { dbValue: string; effectiveValue: string }) {
  if (dbValue) {
    return (
      <span
        className="texto-ok"
        style={{ fontSize: 12, fontWeight: 400, textTransform: "none", letterSpacing: "normal" }}
      >
        ✓ Activo
      </span>
    );
  }
  if (effectiveValue) {
    return (
      <span
        className="texto-alerta"
        style={{ fontSize: 12, fontWeight: 400, textTransform: "none", letterSpacing: "normal" }}
      >
        Activo por variable de entorno
      </span>
    );
  }
  return (
    <span
      className="texto-sutil"
      style={{ fontSize: 12, fontWeight: 400, textTransform: "none", letterSpacing: "normal" }}
    >
      Sin configurar
    </span>
  );
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const [row, effective] = await Promise.all([getSiteSettingsRow(), getTrackingConfig()]);

  const activeCount = TODOS.filter((f) => (effective[f.name] ?? "").length > 0).length;

  function renderGrupo(fields: CampoTracking[]) {
    return (
      <div className="flex flex-col gap-5">
        {fields.map((f) => {
          const dbValue = (row?.[f.name] as string | null | undefined) ?? "";
          const effectiveValue = effective[f.name] ?? "";
          return (
            <Campo
              key={f.name}
              htmlFor={f.name}
              hint={f.hint}
              label={
                <span className="flex items-center gap-2">
                  {f.label}
                  <EstadoCampo dbValue={dbValue} effectiveValue={effectiveValue} />
                </span>
              }
            >
              <Input id={f.name} name={f.name} defaultValue={dbValue} placeholder={f.placeholder} />
            </Campo>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Analytics"
        subtitle="Registra aquí los IDs de tracking. Se aplican de inmediato y solo se cargan con el consentimiento de cookies del visitante."
        actions={
          <Boton tone="secundario" href="https://tagassistant.google.com/" external>
            Tag Assistant
          </Boton>
        }
      />

      {ok === "1" && <Banner tone="info">Ajustes guardados.</Banner>}

      <Banner tone="info">
        <strong>{activeCount}</strong> de {TODOS.length} proveedores configurados (en DB o por variable de entorno).
      </Banner>

      <Tarjeta>
        <form action={saveTrackingSettings} className="flex flex-col gap-8">
          <div>
            <SeccionEtiqueta>Analítica</SeccionEtiqueta>
            {renderGrupo(ANALITICA)}
          </div>
          <div>
            <SeccionEtiqueta>Marketing</SeccionEtiqueta>
            {renderGrupo(MARKETING)}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <BotonPendiente pendingLabel="Guardando…">Guardar</BotonPendiente>
            <p className="pista" style={{ marginTop: 0 }}>
              Se aplican en el sitio público de inmediato, solo con consentimiento de cookies.
            </p>
          </div>
        </form>
      </Tarjeta>
    </div>
  );
}
