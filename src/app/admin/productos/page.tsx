import { asc } from "drizzle-orm";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { db } from "@/shared/db/client";
import { products } from "@/shared/db/schema/products";
import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
  StatusPill,
  Td,
  Th,
} from "../_components/admin-ui";

const TYPE_VARIANT: Record<string, "green" | "amber" | "neutral" | "blue"> = {
  elemento: "blue",
  camino: "green",
  retiro_inmersivo: "amber",
  programa_corporativo: "neutral",
};

async function loadProducts() {
  try {
    return await db.select().from(products).orderBy(asc(products.sortOrder));
  } catch (e) {
    console.error("[admin/productos] DB read failed", e);
    return [];
  }
}

export default async function AdminProductsPage() {
  const list = await loadProducts();

  return (
    <>
      <AdminPageHeader
        title="Productos"
        subtitle="Catálogo de elementos, caminos, retiros inmersivos y programas corporativos."
        count={list.length}
        action={
          <Link
            href="/es/los-caminos"
            target="_blank"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
          >
            <ExternalLink className="h-4 w-4" />
            Ver público
          </Link>
        }
      />

      {list.length === 0 ? (
        <EmptyState
          title="Sin productos en DB"
          body="Corre pnpm db:seed para sembrar los 11 productos del catálogo."
        />
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <Th>Slug</Th>
              <Th>Tipo</Th>
              <Th>Elemento</Th>
              <Th>Nombre</Th>
              <Th>Precio MXN</Th>
              <Th>Precio USD</Th>
              <Th>Stripe MXN</Th>
              <Th>Activo</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50">
                <Td className="font-mono text-xs">{p.slug}</Td>
                <Td>
                  <StatusPill
                    status={p.type}
                    variant={TYPE_VARIANT[p.type] ?? "neutral"}
                  />
                </Td>
                <Td className="text-xs uppercase tracking-[0.14em]">{p.element ?? "—"}</Td>
                <Td>
                  <div className="font-medium">{p.nameEs}</div>
                  <div className="text-xs text-zinc-500">{p.nameEn ?? "—"}</div>
                </Td>
                <Td className="tabular-nums text-sm">${Number(p.priceMxn).toLocaleString("es-MX")}</Td>
                <Td className="tabular-nums text-xs text-zinc-500">
                  {p.priceUsd ? `$${Number(p.priceUsd).toLocaleString("en-US")}` : "—"}
                </Td>
                <Td>
                  {p.stripePriceIdMxn ? (
                    <code className="font-mono text-[0.65rem] text-zinc-600 bg-zinc-50 px-1.5 py-0.5">
                      {p.stripePriceIdMxn.slice(0, 12)}…
                    </code>
                  ) : (
                    <span className="text-[0.65rem] uppercase tracking-[0.14em] text-amber-700">
                      Pendiente
                    </span>
                  )}
                </Td>
                <Td>
                  <StatusPill
                    status={p.active ? "Activo" : "Inactivo"}
                    variant={p.active ? "green" : "neutral"}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </>
  );
}

export const dynamic = "force-dynamic";
