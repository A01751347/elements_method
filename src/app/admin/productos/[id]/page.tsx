import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/shared/db/client";
import { products } from "@/shared/db/schema/products";
import { AdminPageHeader } from "../../_components/admin-ui";
import { ProductForm } from "../ProductForm";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number.parseInt(id, 10);
  if (!Number.isInteger(numericId)) notFound();

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, numericId))
    .limit(1);
  if (!product) notFound();

  return (
    <>
      <AdminPageHeader
        title={`Producto: ${product.nameEs}`}
        subtitle={`${product.type} · ${product.slug}`}
      />
      <ProductForm product={product} />
    </>
  );
}

export const dynamic = "force-dynamic";
