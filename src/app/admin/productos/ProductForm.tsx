import type { Product } from "@/shared/db/schema/products";
import { SeccionEtiqueta, Campo, Input, Textarea, Checkbox, Boton } from "../_components/ui";
import { BotonPendiente } from "../_components/client";
import { updateProduct } from "./actions";

/** Format a Date as "YYYY-MM-DDTHH:mm" in America/Mexico_City wall time, for a datetime-local input. */
function toDatetimeLocalMx(d: Date | string | null | undefined): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "";
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

/**
 * Edit form for a catalog product. Binds updateProduct with the product's serial
 * id, so Save persists the editable fields to the DB and revalidates the public
 * catalog surfaces. Read-only identity fields (slug, type, element) live in the
 * ficha's work column instead of this form.
 */
export function ProductForm({ product }: { product: Product }) {
  const action = updateProduct.bind(null, product.id);

  return (
    <form action={action} className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <SeccionEtiqueta>Contenido</SeccionEtiqueta>
        <div className="grid grid-cols-2 gap-4">
          <Campo label="Nombre (ES)" htmlFor="nameEs" required>
            <Input id="nameEs" name="nameEs" defaultValue={product.nameEs} required />
          </Campo>
          <Campo label="Nombre (EN)" htmlFor="nameEn">
            <Input id="nameEn" name="nameEn" defaultValue={product.nameEn ?? ""} />
          </Campo>
        </div>
        <Campo label="Descripción (ES)" htmlFor="descriptionEs" required>
          <Textarea id="descriptionEs" name="descriptionEs" rows={4} defaultValue={product.descriptionEs} required />
        </Campo>
        <Campo label="Descripción (EN)" htmlFor="descriptionEn">
          <Textarea id="descriptionEn" name="descriptionEn" rows={4} defaultValue={product.descriptionEn ?? ""} />
        </Campo>
        <Campo label="Incluye (ES)" htmlFor="includesEs">
          <Textarea id="includesEs" name="includesEs" rows={3} defaultValue={product.includesEs ?? ""} />
        </Campo>
        <Campo label="Incluye (EN)" htmlFor="includesEn">
          <Textarea id="includesEn" name="includesEn" rows={3} defaultValue={product.includesEn ?? ""} />
        </Campo>
        <div className="grid grid-cols-2 gap-4">
          <Campo label="Modalidad" htmlFor="modality">
            <Input id="modality" name="modality" defaultValue={product.modality ?? ""} />
          </Campo>
          <Campo label="Duración" htmlFor="duration">
            <Input id="duration" name="duration" defaultValue={product.duration ?? ""} />
          </Campo>
        </div>
        <Campo
          label="Portada (URL)"
          htmlFor="coverImageUrl"
          hint="Se usa en la tarjeta del catálogo público y en la ficha del retiro."
        >
          <Input id="coverImageUrl" name="coverImageUrl" defaultValue={product.coverImageUrl ?? ""} placeholder="https://…" />
        </Campo>
      </section>

      <section className="flex flex-col gap-4">
        <SeccionEtiqueta>Precio</SeccionEtiqueta>
        <div className="grid grid-cols-2 gap-4">
          <Campo label="Precio MXN" htmlFor="priceMxn" required>
            <Input id="priceMxn" name="priceMxn" type="number" step="0.01" min="0" defaultValue={product.priceMxn} required />
          </Campo>
          <Campo label="Precio USD" htmlFor="priceUsd">
            <Input id="priceUsd" name="priceUsd" type="number" step="0.01" min="0" defaultValue={product.priceUsd ?? ""} />
          </Campo>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Campo label="Precio early access MXN" htmlFor="earlyPriceMxn" hint="Déjalo vacío si no hay early access.">
            <Input id="earlyPriceMxn" name="earlyPriceMxn" type="number" step="0.01" min="0" defaultValue={product.earlyPriceMxn ?? ""} />
          </Campo>
          <Campo
            label="Vence el"
            htmlFor="earlyDeadline"
            hint="Hora de Ciudad de México. Al vencer, el checkout cobra el precio normal automáticamente."
          >
            <Input
              id="earlyDeadline"
              name="earlyDeadline"
              type="datetime-local"
              defaultValue={toDatetimeLocalMx(product.earlyDeadline)}
            />
          </Campo>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Campo
            label="Stripe Price ID (MXN)"
            htmlFor="stripePriceIdMxn"
            hint="Mientras el early access esté activo, el checkout ignora el price ID y cobra el monto."
          >
            <Input id="stripePriceIdMxn" name="stripePriceIdMxn" defaultValue={product.stripePriceIdMxn ?? ""} />
          </Campo>
          <Campo label="Stripe Price ID (USD)" htmlFor="stripePriceIdUsd">
            <Input id="stripePriceIdUsd" name="stripePriceIdUsd" defaultValue={product.stripePriceIdUsd ?? ""} />
          </Campo>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SeccionEtiqueta>Publicación</SeccionEtiqueta>
        <Campo label="Orden en el catálogo" htmlFor="sortOrder">
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={String(product.sortOrder ?? 0)} className="max-w-[140px]" />
        </Campo>
        <Checkbox name="active" label="Visible en el catálogo público" defaultChecked={product.active} />
      </section>

      <div className="flex items-center gap-3">
        <BotonPendiente pendingLabel="Guardando el producto…">Guardar cambios</BotonPendiente>
        <Boton tone="secundario" href="/admin/productos">
          Cancelar
        </Boton>
      </div>
    </form>
  );
}
