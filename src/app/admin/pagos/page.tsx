import { count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orders } from "@/shared/db/schema";
import {
  PageHeader,
  Cifra,
  CifraGrid,
  Filtros,
  Conteo,
  Tabla,
  Th,
  Td,
  FilaEnlace,
  EnlaceFila,
  Insignia,
  Boton,
  EstadoVacio,
  Input,
  Paginacion,
} from "../_components/ui";
import { ORDER_STATUS, PAYMENT_METHOD, estado } from "../_lib/status";
import { mxn, fechaCorta } from "../_lib/format";

export const dynamic = "force-dynamic";

const MONO = "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace";
const PAGE_SIZE = 50;
const FETCH_LIMIT = 200;

type EstadoFiltro = "todas" | "pagadas" | "pendientes" | "por-validar" | "canceladas";
const ESTADOS_VALIDOS: EstadoFiltro[] = ["todas", "pagadas", "pendientes", "por-validar", "canceladas"];
function esEstadoFiltro(v: string | undefined): v is EstadoFiltro {
  return !!v && (ESTADOS_VALIDOS as string[]).includes(v);
}

const ESTADOS_PENDIENTES = ["pending_documents", "pending_payment"];
const ESTADOS_CANCELADAS = ["cancelled", "refunded"];

/** ¿La orden cae en la pestaña `filtro`? "todas" siempre coincide. */
function coincideEstado(status: string, filtro: EstadoFiltro): boolean {
  switch (filtro) {
    case "pagadas":
      return status === "paid";
    case "pendientes":
      return ESTADOS_PENDIENTES.includes(status);
    case "por-validar":
      return status === "pending_transfer_validation";
    case "canceladas":
      return ESTADOS_CANCELADAS.includes(status);
    default:
      return true;
  }
}

function buildHref(base: string, params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") search.set(k, String(v));
  }
  const qs = search.toString();
  return qs ? `${base}?${qs}` : base;
}

/** KPIs globales — no dependen de la búsqueda ni de la pestaña activa. */
async function cargarCifras() {
  try {
    const [[recaudado], [pagadas], [pendientes], [porValidar]] = await Promise.all([
      db
        .select({ total: sql<string>`coalesce(sum(${orders.total}), 0)`.mapWith(String) })
        .from(orders)
        .where(eq(orders.status, "paid")),
      db.select({ n: count() }).from(orders).where(eq(orders.status, "paid")),
      db
        .select({ n: count() })
        .from(orders)
        .where(or(eq(orders.status, "pending_documents"), eq(orders.status, "pending_payment"))),
      db.select({ n: count() }).from(orders).where(eq(orders.status, "pending_transfer_validation")),
    ]);
    return {
      recaudado: Number(recaudado?.total ?? 0),
      pagadas: pagadas?.n ?? 0,
      pendientes: pendientes?.n ?? 0,
      porValidar: porValidar?.n ?? 0,
    };
  } catch (e) {
    console.error("[admin/pagos] cifras", e);
    return { recaudado: 0, pagadas: 0, pendientes: 0, porValidar: 0 };
  }
}

/** Hasta 200 órdenes que coinciden con la búsqueda, sin filtrar por pestaña — de aquí salen los conteos de cada pestaña. */
async function cargarOrdenes(q: string) {
  try {
    const condicion = q
      ? or(
          ilike(orders.folio, `%${q}%`),
          ilike(orders.buyerName, `%${q}%`),
          ilike(orders.buyerEmail, `%${q}%`),
          ilike(orders.buyerCompany, `%${q}%`),
        )
      : undefined;
    return await db
      .select()
      .from(orders)
      .where(condicion)
      .orderBy(desc(orders.createdAt))
      .limit(FETCH_LIMIT);
  } catch (e) {
    console.error("[admin/pagos] lista", e);
    return [];
  }
}

export default async function PagosPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const estadoFiltro: EstadoFiltro = esEstadoFiltro(sp.estado) ? sp.estado : "todas";
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number(sp.page) || 1);

  const [cifras, listaCompleta] = await Promise.all([cargarCifras(), cargarOrdenes(q)]);

  const conteos = {
    todas: listaCompleta.length,
    pagadas: listaCompleta.filter((o) => coincideEstado(o.status, "pagadas")).length,
    pendientes: listaCompleta.filter((o) => coincideEstado(o.status, "pendientes")).length,
    "por-validar": listaCompleta.filter((o) => coincideEstado(o.status, "por-validar")).length,
    canceladas: listaCompleta.filter((o) => coincideEstado(o.status, "canceladas")).length,
  };

  const filtrada = listaCompleta.filter((o) => coincideEstado(o.status, estadoFiltro));
  const pages = Math.max(1, Math.ceil(filtrada.length / PAGE_SIZE));
  const pageClamped = Math.min(page, pages);
  const visibles = filtrada.slice((pageClamped - 1) * PAGE_SIZE, pageClamped * PAGE_SIZE);

  const hrefFor = (params: { estado?: EstadoFiltro; page?: number }) =>
    buildHref("/admin/pagos", {
      estado: (params.estado ?? estadoFiltro) === "todas" ? undefined : (params.estado ?? estadoFiltro),
      q: q || undefined,
      page: params.page && params.page > 1 ? params.page : undefined,
    });

  const exportHref = buildHref("/api/admin/ordenes/export", {
    estado: estadoFiltro === "todas" ? undefined : estadoFiltro,
    q: q || undefined,
  });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Órdenes"
        subtitle="Todas las órdenes: Stripe y transferencia. Cada fila abre la ficha."
        actions={
          <Boton tone="secundario" href={exportHref} external>
            Exportar CSV
          </Boton>
        }
      />

      <CifraGrid>
        <Cifra label="Recaudado" value={mxn(cifras.recaudado)} note="Órdenes pagadas, histórico" tone="ok" />
        <Cifra label="Pagadas" value={cifras.pagadas} note="Sin canceladas ni reembolsadas" />
        <Cifra label="Pendientes de pago" value={cifras.pendientes} tone="alerta" />
        <Cifra
          label="Por validar"
          value={cifras.porValidar}
          note="Comprobantes SPEI recibidos"
          href="/admin/transferencias"
          tone="acento"
        />
      </CifraGrid>

      <div className="flex flex-col gap-4">
        <Filtros
          items={[
            { href: hrefFor({ estado: "todas" }), label: "Todas", count: conteos.todas, active: estadoFiltro === "todas" },
            { href: hrefFor({ estado: "pagadas" }), label: "Pagadas", count: conteos.pagadas, active: estadoFiltro === "pagadas" },
            {
              href: hrefFor({ estado: "pendientes" }),
              label: "Pendientes",
              count: conteos.pendientes,
              active: estadoFiltro === "pendientes",
            },
            {
              href: hrefFor({ estado: "por-validar" }),
              label: "Por validar",
              count: conteos["por-validar"],
              active: estadoFiltro === "por-validar",
            },
            {
              href: hrefFor({ estado: "canceladas" }),
              label: "Canceladas",
              count: conteos.canceladas,
              active: estadoFiltro === "canceladas",
            },
          ]}
        />

        <form action="/admin/pagos" method="get" className="flex flex-wrap items-center gap-2">
          {estadoFiltro !== "todas" && <input type="hidden" name="estado" value={estadoFiltro} />}
          <Input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Folio, nombre, correo o empresa…"
            aria-label="Buscar órdenes"
            className="max-w-xs"
          />
          <Boton tone="secundario" type="submit">
            Buscar
          </Boton>
        </form>
      </div>

      {listaCompleta.length === 0 ? (
        <EstadoVacio
          title="Todavía no hay órdenes."
          body="Cuando alguien pague con Stripe o suba un comprobante de transferencia, aparecerá aquí."
        />
      ) : filtrada.length === 0 ? (
        <EstadoVacio
          title="Ninguna orden coincide con este filtro."
          body="Prueba con otra pestaña o cambia la búsqueda."
        />
      ) : (
        <div className="flex flex-col gap-4">
          <Conteo n={filtrada.length} singular="orden encontrada" plural="órdenes encontradas" />
          <Tabla>
            <thead>
              <tr>
                <Th>Folio</Th>
                <Th>Fecha</Th>
                <Th>Comprador</Th>
                <Th align="right">Total</Th>
                <Th>Método</Th>
                <Th>Estado</Th>
                <Th align="right">Comprobante</Th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((o) => {
                const st = estado(ORDER_STATUS, o.status);
                const pm = estado(PAYMENT_METHOD, o.paymentMethod);
                return (
                  <FilaEnlace key={o.id}>
                    <Td style={{ fontFamily: MONO, fontSize: 12 }}>
                      <EnlaceFila href={`/admin/pagos/${o.folio}`}>{o.folio}</EnlaceFila>
                    </Td>
                    <Td>{fechaCorta(o.createdAt)}</Td>
                    <Td secondary>
                      {o.buyerName}
                      <br />
                      {o.buyerEmail}
                    </Td>
                    <Td numeric>{mxn(o.total, o.currency)}</Td>
                    <Td>
                      <Insignia tone="contorno">{pm.label}</Insignia>
                    </Td>
                    <Td>
                      <Insignia tone={st.tone}>{st.label}</Insignia>
                    </Td>
                    <Td align="right">
                      <a
                        href={`/api/comprobante/${o.folio}`}
                        target="_blank"
                        rel="noreferrer"
                        className="sobre-fila"
                      >
                        PDF ↗
                      </a>
                    </Td>
                  </FilaEnlace>
                );
              })}
            </tbody>
          </Tabla>
          <Paginacion page={pageClamped} pages={pages} hrefFor={(p) => hrefFor({ page: p })} />
        </div>
      )}
    </div>
  );
}
