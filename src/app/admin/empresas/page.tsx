import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { enterpriseQuotes, quoteStatusEnum } from "@/shared/db/schema";
import {
  PageHeader,
  CifraGrid,
  Cifra,
  Filtros,
  Conteo,
  Tabla,
  Th,
  Td,
  FilaEnlace,
  EnlaceFila,
  Insignia,
  EstadoVacio,
  Input,
  Boton,
} from "../_components/ui";
import { QUOTE_STATUS, estado } from "../_lib/status";
import { mxn, fechaCorta } from "../_lib/format";

export const dynamic = "force-dynamic";

const MODALIDAD_LABEL: Record<string, string> = {
  presencial: "Presencial",
  virtual: "Virtual",
  hibrido: "Híbrido",
};

type QuoteStatusValue = (typeof quoteStatusEnum.enumValues)[number];

function esQuoteStatus(v: string | undefined): v is QuoteStatusValue {
  return !!v && (quoteStatusEnum.enumValues as readonly string[]).includes(v);
}

function buildHref(base: string, params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) search.set(k, v);
  }
  const qs = search.toString();
  return qs ? `${base}?${qs}` : base;
}

async function loadResumenCotizaciones() {
  try {
    const [porEstado, aceptadaSumaAgg, totalAgg] = await Promise.all([
      db
        .select({ status: enterpriseQuotes.status, n: count() })
        .from(enterpriseQuotes)
        .groupBy(enterpriseQuotes.status),
      db
        .select({ sum: sql<string>`COALESCE(SUM(${enterpriseQuotes.totalMxn}), 0)` })
        .from(enterpriseQuotes)
        .where(eq(enterpriseQuotes.status, "aceptada")),
      db.select({ n: count() }).from(enterpriseQuotes),
    ]);
    const mapa = new Map(porEstado.map((r) => [r.status, r.n]));
    return {
      nueva: mapa.get("nueva") ?? 0,
      contactada: mapa.get("contactada") ?? 0,
      aceptada: mapa.get("aceptada") ?? 0,
      cerrada: mapa.get("cerrada") ?? 0,
      aceptadaSumaMxn: Number(aceptadaSumaAgg[0]?.sum ?? 0),
      total: totalAgg[0]?.n ?? 0,
    };
  } catch (e) {
    console.error("[admin/empresas] resumen fallido", e);
    return { nueva: 0, contactada: 0, aceptada: 0, cerrada: 0, aceptadaSumaMxn: 0, total: 0 };
  }
}

async function loadQuotes(estadoFiltro: string | undefined, q: string) {
  try {
    const condiciones = [];
    if (esQuoteStatus(estadoFiltro)) condiciones.push(eq(enterpriseQuotes.status, estadoFiltro));
    if (q) {
      const pat = `%${q}%`;
      condiciones.push(
        or(
          ilike(enterpriseQuotes.companyName, pat),
          ilike(enterpriseQuotes.contactName, pat),
          ilike(enterpriseQuotes.contactEmail, pat),
          ilike(enterpriseQuotes.quoteNumber, pat),
        ),
      );
    }
    return await db
      .select()
      .from(enterpriseQuotes)
      .where(condiciones.length > 0 ? and(...condiciones) : undefined)
      .orderBy(desc(enterpriseQuotes.createdAt))
      .limit(200);
  } catch (e) {
    console.error("[admin/empresas] lista fallida", e);
    return [];
  }
}

export default async function AdminEmpresasPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const estadoFiltro = esQuoteStatus(sp.estado) ? sp.estado : undefined;
  const q = (sp.q ?? "").trim();

  const [resumen, quotes] = await Promise.all([loadResumenCotizaciones(), loadQuotes(estadoFiltro, q)]);

  const hrefFor = (e: QuoteStatusValue | undefined) =>
    buildHref("/admin/empresas", { estado: e, q: q || undefined });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Cotizaciones"
        subtitle="Cotizaciones de programas corporativos generadas por la calculadora pública. Cada fila abre la ficha."
        actions={
          <Boton tone="secundario" href="/admin/empresas/calculadora">
            Ajustar fórmula →
          </Boton>
        }
      />

      <CifraGrid>
        <Cifra label="Nuevas" value={resumen.nueva} tone="alerta" />
        <Cifra label="Contactadas" value={resumen.contactada} tone="acento" />
        <Cifra
          label="Aceptadas"
          value={resumen.aceptada}
          tone="ok"
          note={`Suma: ${mxn(resumen.aceptadaSumaMxn)}`}
        />
        <Cifra label="Cerradas" value={resumen.cerrada} />
      </CifraGrid>

      <div className="flex flex-col gap-4">
        <Filtros
          items={[
            { href: hrefFor(undefined), label: "Todas", count: resumen.total, active: !estadoFiltro },
            {
              href: hrefFor("nueva"),
              label: "Nueva",
              count: resumen.nueva,
              active: estadoFiltro === "nueva",
            },
            {
              href: hrefFor("contactada"),
              label: "Contactada",
              count: resumen.contactada,
              active: estadoFiltro === "contactada",
            },
            {
              href: hrefFor("aceptada"),
              label: "Aceptada",
              count: resumen.aceptada,
              active: estadoFiltro === "aceptada",
            },
            {
              href: hrefFor("cerrada"),
              label: "Cerrada",
              count: resumen.cerrada,
              active: estadoFiltro === "cerrada",
            },
          ]}
        />

        <form action="/admin/empresas" method="get" className="flex flex-wrap items-center gap-2">
          {estadoFiltro && <input type="hidden" name="estado" value={estadoFiltro} />}
          <Input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Empresa, contacto, correo o folio…"
            aria-label="Buscar cotizaciones"
            className="max-w-xs"
          />
          <Boton tone="secundario" type="submit">
            Buscar
          </Boton>
        </form>
      </div>

      {quotes.length === 0 ? (
        <EstadoVacio
          title="Todavía no hay cotizaciones."
          body="Cuando una empresa use la calculadora en /empresas/cotizar, aparecerá aquí."
        />
      ) : (
        <div className="flex flex-col gap-4">
          <Conteo n={quotes.length} singular="cotización encontrada" plural="cotizaciones encontradas" />
          <Tabla>
            <thead>
              <tr>
                <Th>Folio</Th>
                <Th>Fecha</Th>
                <Th>Empresa</Th>
                <Th align="right">Personas</Th>
                <Th align="right">Sesiones</Th>
                <Th>Modalidad</Th>
                <Th align="right">Total</Th>
                <Th>Vigencia</Th>
                <Th>Estado</Th>
                <Th align="right">PDF</Th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => {
                const e = estado(QUOTE_STATUS, quote.status);
                const vencida = new Date(quote.validUntil).getTime() < Date.now();
                const total =
                  quote.currency === "USD" && quote.totalUsd
                    ? mxn(quote.totalUsd, "USD")
                    : mxn(quote.totalMxn);
                return (
                  <FilaEnlace key={quote.id}>
                    <Td
                      style={{
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                        fontSize: 12,
                      }}
                    >
                      <EnlaceFila href={`/admin/empresas/${quote.quoteNumber}`}>{quote.quoteNumber}</EnlaceFila>
                    </Td>
                    <Td secondary>{fechaCorta(quote.createdAt)}</Td>
                    <Td>
                      {quote.companyName}
                      <span className="celda-secundaria">{quote.contactName}</span>
                    </Td>
                    <Td numeric>{quote.numberOfPeople}</Td>
                    <Td numeric>{quote.numberOfSessions}</Td>
                    <Td>
                      <Insignia tone="contorno">{MODALIDAD_LABEL[quote.modality] ?? quote.modality}</Insignia>
                    </Td>
                    <Td numeric>{total}</Td>
                    <Td>
                      {fechaCorta(quote.validUntil)}
                      {vencida && <span className="celda-secundaria texto-peligro">Venció</span>}
                    </Td>
                    <Td>
                      <Insignia tone={e.tone}>{e.label}</Insignia>
                    </Td>
                    <Td align="right">
                      <a
                        className="sobre-fila"
                        href={`/api/cotizacion/${quote.quoteNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: 12 }}
                      >
                        Ver ↗
                      </a>
                    </Td>
                  </FilaEnlace>
                );
              })}
            </tbody>
          </Tabla>
        </div>
      )}
    </div>
  );
}
