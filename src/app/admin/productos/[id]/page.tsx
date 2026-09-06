import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/shared/db/client";
import { products } from "@/shared/db/schema/products";
import { resolveEffectivePriceMxn } from "@/shared/pricing/effectivePrice";
import { FichaHeader, Insignia, Banner, SeccionEtiqueta, DatoLista, Boton } from "../../_components/ui";
import { PRODUCT_TYPE, estado } from "../../_lib/status";
import { mxn, fechaHora, fechaCorta } from "../../_lib/format";
import { ELEMENT_LABELS } from "../labels";
import { ProductForm } from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function AdminProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number.parseInt(id, 10);
  if (!Number.isInteger(numericId)) notFound();

  const [product] = await db.select().from(products).where(eq(products.id, numericId)).limit(1);
  if (!product) notFound();

  const now = new Date();
  const effective = resolveEffectivePriceMxn(product, now);
  const hasEarlyConfig = product.earlyPriceMxn != null && product.earlyDeadline != null;
  const tipoInfo = estado(PRODUCT_TYPE, product.type);
  const elementoLabel = product.element ? (ELEMENT_LABELS[product.element] ?? product.element) : "Sin elemento";

  const publicHref =
    product.type === "experiencia" || product.type === "retiro_inmersivo"
      ? `/es/retiros/${product.slug}`
      : product.type === "camino"
        ? "/es/los-caminos"
        : "/es";

  return (
    <div className="flex flex-col gap-8">
      <FichaHeader
        back={{ href: "/admin/productos", label: "Productos" }}
        kicker={`${tipoInfo.label} · ${elementoLabel}`}
        title={product.nameEs}
        badge={<Insignia tone={product.active ? "ok" : "neutra"}>{product.active ? "Activo" : "Inactivo"}</Insignia>}
        meta={`${product.slug} · ${product.modality ?? "—"} · ${product.duration ?? "—"}`}
        aside={{ label: "Precio vigente", value: mxn(effective.amountMxn) }}
      />

      {hasEarlyConfig && effective.earlyActive && (
        <Banner tone="info">
          Early access activo: el checkout cobra {mxn(effective.amountMxn)} hasta el {fechaHora(product.earlyDeadline)}.
          Después cobra {mxn(product.priceMxn)}.
        </Banner>
      )}
      {Number(product.priceMxn) === 0 && (
        <Banner tone="aviso">
          Este producto no se puede comprar (precio 0). Se muestra con «Solicitar invitación».
        </Banner>
      )}

      <div className="ficha-columnas">
        <ProductForm product={product} />

        <aside className="ficha-trabajo">
          <div>
            <SeccionEtiqueta>Identidad</SeccionEtiqueta>
            <DatoLista
              items={[
                { label: "Slug", value: product.slug },
                { label: "Tipo", value: tipoInfo.label },
                { label: "Elemento", value: elementoLabel },
                { label: "Creado", value: fechaCorta(product.createdAt) },
                { label: "Actualizado", value: fechaCorta(product.updatedAt) },
              ]}
            />
            <p className="pista">Slug, tipo y elemento no se editan: los usa el checkout y las URL públicas.</p>
          </div>

          <div>
            <SeccionEtiqueta>Público</SeccionEtiqueta>
            <Boton tone="texto" href={publicHref} external>
              Ver en el sitio
            </Boton>
          </div>
        </aside>
      </div>
    </div>
  );
}
