import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { enterpriseQuotes } from "@/shared/db/schema";
import type { QuoteBreakdown } from "@/shared/pricing/enterpriseCompute";
import {
  FichaHeader,
  SeccionEtiqueta,
  DatoLista,
  Campo,
  Select,
  Textarea,
  Boton,
  Insignia,
} from "../../_components/ui";
import { BotonPendiente } from "../../_components/client";
import { QUOTE_STATUS, estado } from "../../_lib/status";
import { mxn, fechaCorta, fechaHora } from "../../_lib/format";
import { actualizarCotizacion } from "../actions";

export const dynamic = "force-dynamic";

const MODALIDAD_LABEL: Record<string, string> = {
  presencial: "Presencial",
  virtual: "Virtual",
  hibrido: "Híbrido",
};

function isQuoteBreakdown(x: unknown): x is QuoteBreakdown {
  if (!x || typeof x !== "object") return false;
  const b = x as Record<string, unknown>;
  return (
    typeof b.subtotal === "number" &&
    typeof b.total === "number" &&
    typeof b.iva === "number" &&
    typeof b.taxableBase === "number" &&
    typeof b.basePerSession === "number"
  );
}

async function loadQuote(quoteNumber: string) {
  const rows = await db
    .select()
    .from(enterpriseQuotes)
    .where(eq(enterpriseQuotes.quoteNumber, quoteNumber))
    .limit(1);
  return rows[0] ?? null;
}

export default async function CotizacionFichaPage({
  params,
}: {
  params: Promise<{ quoteNumber: string }>;
}) {
  const { quoteNumber } = await params;
  const quote = await loadQuote(quoteNumber);
  if (!quote) notFound();

  const e = estado(QUOTE_STATUS, quote.status);
  const modalidadLabel = MODALIDAD_LABEL[quote.modality] ?? quote.modality;

  let desgloseItems: { label: string; value: ReactNode }[];
  if (isQuoteBreakdown(quote.breakdown)) {
    const b = quote.breakdown;
    desgloseItems = [
      { label: "Base por sesión", value: mxn(b.basePerSession, b.currency) },
      { label: "Sesiones", value: b.sessions },
      { label: "Personas", value: b.people },
      { label: "Multiplicador por personas", value: `${b.peopleMultiplier}×` },
      { label: "Modalidad", value: `${MODALIDAD_LABEL[b.modality] ?? b.modality} (${b.modalityMultiplier}×)` },
      { label: "Subtotal", value: mxn(b.subtotal, b.currency) },
      ...(b.discountPct > 0
        ? [{ label: `Descuento (${b.discountPct}%)`, value: `− ${mxn(b.discountAmount, b.currency)}` }]
        : []),
      { label: "Base gravable", value: mxn(b.taxableBase, b.currency) },
      { label: `IVA (${Math.round(b.ivaRate * 100)}%)`, value: mxn(b.iva, b.currency) },
      { label: "Total", value: mxn(b.total, b.currency) },
    ];
  } else if (quote.breakdown && typeof quote.breakdown === "object") {
    desgloseItems = Object.entries(quote.breakdown as Record<string, unknown>).map(([k, v]) => ({
      label: k,
      value: typeof v === "number" || typeof v === "string" ? String(v) : JSON.stringify(v),
    }));
  } else {
    desgloseItems = [];
  }

  const mailto = `mailto:${quote.contactEmail}?subject=${encodeURIComponent(
    `Cotización ${quote.quoteNumber} · Elements Method`,
  )}`;

  return (
    <div className="flex flex-col gap-8">
      <FichaHeader
        back={{ href: "/admin/empresas", label: "Cotizaciones" }}
        kicker={fechaHora(quote.createdAt)}
        title={quote.quoteNumber}
        badge={<Insignia tone={e.tone}>{e.label}</Insignia>}
        meta={`${quote.companyName} · ${modalidadLabel} · ${quote.numberOfPeople} personas · ${quote.numberOfSessions} sesiones`}
        aside={{
          label: "Total",
          value: (
            <>
              {mxn(quote.totalMxn)}
              {quote.totalUsd && (
                <span className="texto-tenue" style={{ fontSize: 16, marginLeft: 8 }}>
                  · USD {Number(quote.totalUsd).toLocaleString("es-MX")}
                </span>
              )}
            </>
          ),
        }}
      />

      <div className="ficha-columnas">
        <div className="flex flex-col gap-8">
          <div>
            <SeccionEtiqueta>Empresa</SeccionEtiqueta>
            <DatoLista
              columns={3}
              items={[
                { label: "Empresa", value: quote.companyName },
                { label: "Contacto", value: quote.contactName },
                {
                  label: "Correo",
                  value: <a href={`mailto:${quote.contactEmail}`}>{quote.contactEmail}</a>,
                },
                { label: "Teléfono", value: quote.contactPhone ?? "—" },
                { label: "Idioma", value: quote.language === "en" ? "English" : "Español" },
                { label: "Vigente hasta", value: fechaCorta(quote.validUntil) },
              ]}
            />
          </div>
          <div>
            <SeccionEtiqueta>Desglose</SeccionEtiqueta>
            {desgloseItems.length === 0 ? (
              <p className="texto-tenue">Esta cotización no tiene un desglose guardado.</p>
            ) : (
              <DatoLista columns={2} items={desgloseItems} />
            )}
          </div>
        </div>

        <div className="ficha-trabajo">
          <div>
            <SeccionEtiqueta>Seguimiento</SeccionEtiqueta>
            <form
              action={actualizarCotizacion.bind(null, quote.id, quote.quoteNumber)}
              className="flex flex-col gap-4"
            >
              <Campo label="Estado" htmlFor="status">
                <Select id="status" name="status" defaultValue={quote.status}>
                  {Object.entries(QUOTE_STATUS).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </Select>
              </Campo>
              <Campo label="Notas" htmlFor="notes" hint="Solo lo ve el equipo.">
                <Textarea id="notes" name="notes" rows={6} defaultValue={quote.notes ?? ""} />
              </Campo>
              <BotonPendiente pendingLabel="Guardando el seguimiento…">Guardar seguimiento</BotonPendiente>
            </form>
          </div>

          <div>
            <SeccionEtiqueta>Documento</SeccionEtiqueta>
            <Boton tone="secundario" href={`/api/cotizacion/${quote.quoteNumber}`} external>
              Cotización PDF
            </Boton>
          </div>

          <div>
            <SeccionEtiqueta>Contactar</SeccionEtiqueta>
            <a className="boton boton-secundario" href={mailto}>
              Escribir correo ✉
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
