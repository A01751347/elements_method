import { BarChart3, CheckCircle2, Circle, ExternalLink } from "lucide-react";
import {
  getSiteSettingsRow,
  getTrackingConfig,
} from "@/shared/integrations/siteConfig";
import { AdminPageHeader } from "../_components/admin-ui";
import { FormSection, FormRow, Input } from "../_components/form";
import { AdminPrimaryButton } from "../_components/admin-ui";
import { saveTrackingSettings } from "./actions";

export const dynamic = "force-dynamic";

const FIELDS: {
  name:
    | "gaMeasurementId"
    | "metaPixelId"
    | "googleAdsId"
    | "googleAdsPurchaseLabel"
    | "linkedinPartnerId"
    | "gtmContainerId";
  label: string;
  placeholder: string;
  hint: string;
  category: "Analítica" | "Marketing" | "Opcional";
}[] = [
  {
    name: "gaMeasurementId",
    label: "Google Analytics 4",
    placeholder: "G-XXXXXXXXXX",
    hint: "Measurement ID de tu propiedad GA4 (Admin → Flujos de datos).",
    category: "Analítica",
  },
  {
    name: "metaPixelId",
    label: "Meta Pixel (Facebook/Instagram)",
    placeholder: "123456789012345",
    hint: "ID numérico del Pixel en Meta Events Manager.",
    category: "Marketing",
  },
  {
    name: "googleAdsId",
    label: "Google Ads",
    placeholder: "AW-XXXXXXXXX",
    hint: "ID de conversión de Google Ads (Herramientas → Conversiones).",
    category: "Marketing",
  },
  {
    name: "googleAdsPurchaseLabel",
    label: "Google Ads — etiqueta de compra",
    placeholder: "AbC-D_efG-h12_34-567",
    hint: "Conversion label de la acción 'Compra' (se combina con el ID de Ads).",
    category: "Marketing",
  },
  {
    name: "linkedinPartnerId",
    label: "LinkedIn Insight Tag",
    placeholder: "1234567",
    hint: "Partner ID del Insight Tag (Campaign Manager → Insight Tag).",
    category: "Marketing",
  },
  {
    name: "gtmContainerId",
    label: "Google Tag Manager (opcional)",
    placeholder: "GTM-XXXXXXX",
    hint: "Si usas GTM como contenedor único. Opcional.",
    category: "Opcional",
  },
];

export default async function AdminAnalyticsPage() {
  const [row, effective] = await Promise.all([
    getSiteSettingsRow(),
    getTrackingConfig(),
  ]);

  const activeCount = Object.values(effective).filter(
    (v) => typeof v === "string" && v.length > 0,
  ).length;

  return (
    <>
      <AdminPageHeader
        title="Analytics & Pixeles"
        subtitle="Registra aquí los IDs de tracking. Se aplican en runtime (sin re-deploy) y solo se cargan con el consentimiento de cookies del visitante. Si dejas un campo vacío, se usa la variable de entorno correspondiente como respaldo."
        action={
          <a
            href="https://tagassistant.google.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
          >
            <ExternalLink className="h-4 w-4" />
            Tag Assistant
          </a>
        }
      />

      <div className="mb-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 flex items-center gap-3 text-sm text-zinc-700">
        <BarChart3 className="h-4 w-4 text-zinc-500 shrink-0" strokeWidth={1.5} />
        <span>
          <strong className="text-zinc-900">{activeCount}</strong> de {FIELDS.length}{" "}
          proveedores configurados (valor en DB o variable de entorno).
        </span>
      </div>

      <form action={saveTrackingSettings} className="space-y-6 max-w-3xl">
        <FormSection title="Identificadores de tracking">
          {FIELDS.map((f) => {
            const dbValue = (row?.[f.name] as string | null | undefined) ?? "";
            const effectiveValue = effective[f.name] ?? "";
            const active = effectiveValue.length > 0;
            return (
              <FormRow
                key={f.name}
                label={
                  <span className="flex items-center gap-2">
                    {active ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-zinc-300" />
                    )}
                    {f.label}
                  </span>
                }
              >
                <Input
                  name={f.name}
                  defaultValue={dbValue}
                  placeholder={f.placeholder}
                />
                <p className="mt-1.5 text-xs text-zinc-500">
                  {f.hint}
                  {!dbValue && effectiveValue && (
                    <span className="text-amber-700">
                      {" "}
                      · Actualmente activo vía variable de entorno.
                    </span>
                  )}
                </p>
              </FormRow>
            );
          })}
        </FormSection>

        <div className="flex items-center gap-3 pt-2">
          <AdminPrimaryButton type="submit">Guardar</AdminPrimaryButton>
          <span className="text-xs text-zinc-500">
            Los cambios se reflejan en el sitio público de inmediato.
          </span>
        </div>
      </form>
    </>
  );
}
