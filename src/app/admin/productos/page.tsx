import { asc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { products } from "@/shared/db/schema/products";
import { resolveEffectivePriceMxn } from "@/shared/pricing/effectivePrice";
import {
  PageHeader,
  Boton,
  Filtros,
  Conteo,
  Tabla,
  Th,
  Td,
  FilaEnlace,
  EnlaceFila,
  Insignia,
  EstadoVacio,
} from "../_components/ui";
import { ConfirmarAccion } from "../_components/client";
import { PRODUCT_TYPE, estado } from "../_lib/status";
import { mxn, fechaCorta } from "../_lib/format";
import { ELEMENT_LABELS } from "./labels";
import { alternarActivo } from "./actions";

export const dynamic = "force-dynamic";

async function loadProducts() {
  try {
    return await db.select().from(products).orderBy(asc(products.sortOrder));
  } catch (e) {
    console.error("[admin/productos] DB read failed", e);
    return [];
  }
}

function hrefFor(tipo?: string, activo?: string) {
  const sp = new URLSearchParams();
  if (tipo) sp.set("tipo", tipo);
  if (activo) sp.set("activo", activo);
  const qs = sp.toString();
  return `/admin/productos${qs ? `?${qs}` : ""}`;
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; activo?: string }>;
}) {
  const { tipo, activo } = await searchParams;
  const list = await loadProducts();

  const tipoFiltro = tipo && tipo in PRODUCT_TYPE ? tipo : undefined;
  const activoFiltro = activo === "activos" ? true : activo === "inactivos" ? false : undefined;

  const filtered = list.filter(
    (p) =>
      (tipoFiltro ? p.type === tipoFiltro : true) &&
      (activoFiltro === undefined ? true : p.active === activoFiltro),
  );

  const now = new Date();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Productos"
        subtitle="Catálogo que alimenta el checkout: elementos, caminos, retiros, experiencias y programa corporativo."
        actions={
          <Boton tone="secundario" href="/es/los-caminos" external>
            Ver catálogo público
          </Boton>
        }
      />

      {list.length === 0 ? (
        <EstadoVacio
          title="No hay productos en la base de datos."
          body="Corre pnpm db:seed en tu terminal para sembrar el catálogo."
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Filtros
              items={[
                {
                  href: hrefFor(undefined, activo),
                  label: "Todos los tipos",
                  count: list.length,
                  active: !tipoFiltro,
                },
                ...Object.entries(PRODUCT_TYPE).map(([key, info]) => ({
                  href: hrefFor(key, activo),
                  label: info.label,
                  count: list.filter((p) => p.type === key).length,
                  active: tipoFiltro === key,
                })),
              ]}
            />
            <Filtros
              items={[
                {
                  href: hrefFor(tipo, undefined),
                  label: "Todos",
                  count: list.length,
                  active: activoFiltro === undefined,
                },
                {
                  href: hrefFor(tipo, "activos"),
                  label: "Activos",
                  count: list.filter((p) => p.active).length,
                  active: activoFiltro === true,
                },
                {
                  href: hrefFor(tipo, "inactivos"),
                  label: "Inactivos",
                  count: list.filter((p) => !p.active).length,
                  active: activoFiltro === false,
                },
              ]}
            />
          </div>

          <Conteo n={filtered.length} singular="producto encontrado" plural="productos encontrados" />

          <Tabla>
            <thead>
              <tr>
                <Th>Producto</Th>
                <Th>Tipo</Th>
                <Th>Elemento</Th>
                <Th align="right">Precio</Th>
                <Th>Stripe</Th>
                <Th>Estado</Th>
                <Th align="right">Acción</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const effective = resolveEffectivePriceMxn(p, now);
                const hasEarlyConfig = p.earlyPriceMxn != null && p.earlyDeadline != null;
                const tipoInfo = estado(PRODUCT_TYPE, p.type);

                return (
                  <FilaEnlace key={p.id}>
                    <Td>
                      <EnlaceFila href={`/admin/productos/${p.id}`}>{p.nameEs}</EnlaceFila>
                      <p className="pista">{p.slug}</p>
                    </Td>
                    <Td>
                      <Insignia tone={tipoInfo.tone}>{tipoInfo.label}</Insignia>
                    </Td>
                    <Td>{p.element ? (ELEMENT_LABELS[p.element] ?? p.element) : "—"}</Td>
                    <Td numeric>
                      {hasEarlyConfig ? (
                        effective.earlyActive ? (
                          <>
                            {mxn(effective.amountMxn)}
                            <p className="pista">
                              Early access hasta {fechaCorta(p.earlyDeadline)} · después {mxn(p.priceMxn)}
                            </p>
                          </>
                        ) : (
                          <>
                            {mxn(p.priceMxn)}
                            <p className="pista">Early access venció el {fechaCorta(p.earlyDeadline)}</p>
                          </>
                        )
                      ) : (
                        mxn(p.priceMxn)
                      )}
                    </Td>
                    <Td>
                      {p.stripePriceIdMxn ? (
                        <code className="pista">{p.stripePriceIdMxn.slice(0, 12)}…</code>
                      ) : (
                        <span className="pista">Sin price ID</span>
                      )}
                    </Td>
                    <Td>
                      <Insignia tone={p.active ? "ok" : "neutra"}>{p.active ? "Activo" : "Inactivo"}</Insignia>
                    </Td>
                    <Td align="right" className="sobre-fila">
                      <ConfirmarAccion
                        trigger={p.active ? "Desactivar" : "Activar"}
                        title={p.active ? "Desactivar este producto" : "Activar este producto"}
                        body={
                          p.active
                            ? "El producto deja de aparecer en el catálogo público y no se puede comprar. Las órdenes existentes no cambian."
                            : "El producto vuelve al catálogo público."
                        }
                        confirmLabel={p.active ? "Sí, desactivar" : "Sí, activar"}
                        pendingLabel="Guardando…"
                        action={alternarActivo}
                        hidden={[
                          { name: "id", value: String(p.id) },
                          { name: "next", value: String(!p.active) },
                        ]}
                        size="chico"
                      />
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
