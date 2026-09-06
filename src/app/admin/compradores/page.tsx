import { count, desc, ilike, or, sql } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orders } from "@/shared/db/schema";
import {
  PageHeader,
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
import { mxn, fechaCorta } from "../_lib/format";

export const dynamic = "force-dynamic";

type TipoFiltro = "todas" | "persona" | "empresa";
function esTipoFiltro(v: string | undefined): v is TipoFiltro {
  return v === "persona" || v === "empresa";
}

function buildHref(base: string, params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) search.set(k, v);
  }
  const qs = search.toString();
  return qs ? `${base}?${qs}` : base;
}

async function cargarCompradores(q: string) {
  try {
    const condicion = q
      ? or(ilike(orders.buyerName, `%${q}%`), ilike(orders.buyerEmail, `%${q}%`), ilike(orders.buyerCompany, `%${q}%`))
      : undefined;
    return await db
      .select({
        email: orders.buyerEmail,
        name: orders.buyerName,
        type: orders.buyerType,
        company: orders.buyerCompany,
        ordersCount: count(),
        totalPaid: sql<string>`coalesce(sum(case when ${orders.status} = 'paid' then ${orders.total} else 0 end), 0)`.mapWith(
          String,
        ),
        lastOrderAt: sql<Date>`max(${orders.createdAt})`,
      })
      .from(orders)
      .where(condicion)
      .groupBy(orders.buyerEmail, orders.buyerName, orders.buyerType, orders.buyerCompany)
      .orderBy(desc(sql`max(${orders.createdAt})`));
  } catch (e) {
    console.error("[admin/compradores] DB read failed", e);
    return [];
  }
}

export default async function CompradoresPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tipo?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const tipoFiltro: TipoFiltro = esTipoFiltro(sp.tipo) ? sp.tipo : "todas";

  const listaCompleta = await cargarCompradores(q);
  const conteos = {
    todas: listaCompleta.length,
    persona: listaCompleta.filter((c) => c.type === "persona").length,
    empresa: listaCompleta.filter((c) => c.type === "empresa").length,
  };
  const filtrada = tipoFiltro === "todas" ? listaCompleta : listaCompleta.filter((c) => c.type === tipoFiltro);

  const hrefFor = (tipo: TipoFiltro) =>
    buildHref("/admin/compradores", { tipo: tipo === "todas" ? undefined : tipo, q: q || undefined });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Compradores"
        subtitle="Personas y organizaciones con al menos una orden. Cada fila abre su historial."
      />

      <div className="flex flex-col gap-4">
        <Filtros
          items={[
            { href: hrefFor("todas"), label: "Todos", count: conteos.todas, active: tipoFiltro === "todas" },
            { href: hrefFor("persona"), label: "Persona", count: conteos.persona, active: tipoFiltro === "persona" },
            { href: hrefFor("empresa"), label: "Empresa", count: conteos.empresa, active: tipoFiltro === "empresa" },
          ]}
        />

        <form action="/admin/compradores" method="get" className="flex flex-wrap items-center gap-2">
          {tipoFiltro !== "todas" && <input type="hidden" name="tipo" value={tipoFiltro} />}
          <Input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Nombre, correo o empresa…"
            aria-label="Buscar compradores"
            className="max-w-xs"
          />
          <Boton tone="secundario" type="submit">
            Buscar
          </Boton>
        </form>
      </div>

      {listaCompleta.length === 0 ? (
        <EstadoVacio
          title="Todavía no hay compradores."
          body="Cuando alguien complete un checkout o suba un comprobante de transferencia, aparecerá aquí."
        />
      ) : filtrada.length === 0 ? (
        <EstadoVacio title="Nadie coincide con este filtro." body="Prueba con otra búsqueda o cambia de pestaña." />
      ) : (
        <div className="flex flex-col gap-4">
          <Conteo n={filtrada.length} singular="comprador encontrado" plural="compradores encontrados" />
          <Tabla>
            <thead>
              <tr>
                <Th>Nombre</Th>
                <Th>Tipo</Th>
                <Th>Empresa</Th>
                <Th align="right">Órdenes</Th>
                <Th align="right">Total pagado</Th>
                <Th>Última orden</Th>
              </tr>
            </thead>
            <tbody>
              {filtrada.map((c) => (
                <FilaEnlace key={c.email}>
                  <Td>
                    <EnlaceFila href={`/admin/compradores/${encodeURIComponent(c.email)}`}>{c.name}</EnlaceFila>
                    <span className="celda-secundaria">{c.email}</span>
                  </Td>
                  <Td>
                    <Insignia tone="contorno">{c.type === "empresa" ? "Empresa" : "Persona"}</Insignia>
                  </Td>
                  <Td>{c.company || "—"}</Td>
                  <Td numeric>{c.ordersCount}</Td>
                  <Td numeric>{mxn(c.totalPaid)}</Td>
                  <Td>{fechaCorta(c.lastOrderAt)}</Td>
                </FilaEnlace>
              ))}
            </tbody>
          </Tabla>
        </div>
      )}
    </div>
  );
}
