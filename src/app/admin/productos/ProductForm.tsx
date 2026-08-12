import Link from "next/link";
import type { Product } from "@/shared/db/schema/products";
import {
  AdminPrimaryButton,
  AdminSecondaryButton,
} from "../_components/admin-ui";
import { updateProduct } from "./actions";

/**
 * Edit form for a catalog product. Binds updateProduct with the product's serial
 * id, so Save persists the editable fields to the DB and revalidates the public
 * catalog surfaces. Read-only identity fields (slug, type, element) are shown for
 * context but not submitted.
 */
export function ProductForm({ product }: { product: Product }) {
  const action = updateProduct.bind(null, product.id);

  return (
    <form action={action} className="space-y-8 max-w-3xl">
      <Section title="Identidad (solo lectura)">
        <Row label="Slug">
          <ReadonlyValue>{product.slug}</ReadonlyValue>
        </Row>
        <Row label="Tipo">
          <ReadonlyValue>{product.type}</ReadonlyValue>
        </Row>
        <Row label="Elemento">
          <ReadonlyValue>{product.element ?? "—"}</ReadonlyValue>
        </Row>
      </Section>

      <Section title="Contenido">
        <Row label="Nombre (ES)">
          <Input name="nameEs" defaultValue={product.nameEs} />
        </Row>
        <Row label="Nombre (EN)">
          <Input name="nameEn" defaultValue={product.nameEn ?? ""} />
        </Row>
        <Row label="Descripción (ES)">
          <Textarea name="descriptionEs" defaultValue={product.descriptionEs} />
        </Row>
        <Row label="Descripción (EN)">
          <Textarea name="descriptionEn" defaultValue={product.descriptionEn ?? ""} />
        </Row>
        <Row label="Incluye (ES)">
          <Textarea name="includesEs" defaultValue={product.includesEs ?? ""} />
        </Row>
        <Row label="Incluye (EN)">
          <Textarea name="includesEn" defaultValue={product.includesEn ?? ""} />
        </Row>
        <Row label="Modalidad">
          <Input name="modality" defaultValue={product.modality ?? ""} />
        </Row>
        <Row label="Duración">
          <Input name="duration" defaultValue={product.duration ?? ""} />
        </Row>
      </Section>

      <Section title="Comercial">
        <Row label="Precio MXN">
          <Input
            name="priceMxn"
            type="number"
            step="0.01"
            defaultValue={product.priceMxn}
            className="w-40"
          />
        </Row>
        <Row label="Precio USD">
          <Input
            name="priceUsd"
            type="number"
            step="0.01"
            defaultValue={product.priceUsd ?? ""}
            className="w-40"
          />
        </Row>
        <Row label="Stripe Price ID (MXN)">
          <Input name="stripePriceIdMxn" defaultValue={product.stripePriceIdMxn ?? ""} />
        </Row>
        <Row label="Stripe Price ID (USD)">
          <Input name="stripePriceIdUsd" defaultValue={product.stripePriceIdUsd ?? ""} />
        </Row>
      </Section>

      <Section title="Publicación">
        <Row label="Orden">
          <Input
            name="sortOrder"
            type="number"
            defaultValue={String(product.sortOrder ?? 0)}
            className="w-24"
          />
        </Row>
        <Row label="Activo">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="active"
              defaultChecked={product.active}
              className="h-4 w-4 rounded border-zinc-300"
            />
            <span className="text-zinc-600">Visible en el catálogo público</span>
          </label>
        </Row>
      </Section>

      <div className="flex items-center gap-3 pt-4 border-t border-zinc-200">
        <AdminPrimaryButton type="submit">Guardar cambios</AdminPrimaryButton>
        <AdminSecondaryButton href="/admin/productos">Cancelar</AdminSecondaryButton>
        <Link
          href="/es/los-caminos"
          target="_blank"
          className="ml-auto inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
        >
          Ver público →
        </Link>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <h2 className="text-sm font-medium mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
      <label className="text-xs uppercase tracking-[0.14em] text-zinc-500 pt-2">
        {label}
      </label>
      <div>{children}</div>
    </div>
  );
}

function ReadonlyValue({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-mono text-zinc-600">
      {children}
    </span>
  );
}

function Input({
  name,
  defaultValue,
  type = "text",
  step,
  className = "",
}: {
  name: string;
  defaultValue?: string;
  type?: string;
  step?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      name={name}
      step={step}
      defaultValue={defaultValue}
      className={`w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 ${className}`}
    />
  );
}

function Textarea({ name, defaultValue }: { name: string; defaultValue?: string }) {
  return (
    <textarea
      name={name}
      defaultValue={defaultValue}
      rows={4}
      className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
    />
  );
}
