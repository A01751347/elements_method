"use server";

/**
 * Mutaciones de orden compartidas por /admin/pagos (lista + ficha) y
 * /admin/transferencias. La validación de un comprobante de transferencia y
 * el "marcar como pagada" desde la ficha son, para la base de datos, la misma
 * operación: la orden pasa a `paid`, se registran las marcas de tiempo y el
 * comprador recibe el correo de confirmación. Esa lógica vivía en
 * `transferencias/actions.ts`; se mueve aquí y `transferencias/actions.ts` la
 * reexporta para no duplicarla.
 */
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orders } from "@/shared/db/schema";
import { requireAdmin, str } from "@/shared/admin/action";
import { sendPaymentConfirmation } from "@/shared/integrations/orderEmails";

/** Revalida cada superficie del admin que muestra estado de una orden. */
function revalidateOrderSurfaces(folio?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/pagos");
  if (folio) revalidatePath(`/admin/pagos/${folio}`);
  revalidatePath("/admin/transferencias");
  revalidatePath("/admin/compradores");
}

/**
 * Marca una orden como pagada: sella `paidAt`/`transferValidatedAt`, registra
 * qué admin validó y manda el correo de confirmación (el mismo que dispara
 * Stripe). Protegido contra doble clic: si ya estaba pagada, no vuelve a
 * mandar el correo ni a pisar las marcas de tiempo.
 */
export async function markOrderPaid(orderId: string): Promise<void> {
  const admin = await requireAdmin();
  const now = new Date();

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) throw new Error("Orden no encontrada.");
  if (order.status === "paid") {
    revalidateOrderSurfaces(order.folio);
    return;
  }

  await db
    .update(orders)
    .set({
      status: "paid",
      paidAt: now,
      transferValidatedAt: now,
      transferValidatedBy: admin.email,
      updatedAt: now,
    })
    .where(eq(orders.id, orderId));

  await sendPaymentConfirmation(
    {
      ...order,
      status: "paid",
      paidAt: now,
      transferValidatedAt: now,
      transferValidatedBy: admin.email,
    },
    {
      method: order.paymentMethod === "transferencia" ? "transferencia" : "stripe",
      validatedBy: admin.email,
    },
  );

  revalidateOrderSurfaces(order.folio);
}

/** Wrapper de `markOrderPaid` para `ConfirmarAccion` (recibe el id por un campo oculto). */
export async function marcarPagada(fd: FormData): Promise<void> {
  const orderId = str(fd, "orderId");
  if (!orderId) throw new Error("Falta el identificador de la orden.");
  await markOrderPaid(orderId);
}

/**
 * Cancela una orden sin pagar. No manda correo ni devuelve dinero: solo
 * cierra el registro. Protegido contra doble clic igual que `markOrderPaid`.
 */
export async function cancelarOrden(fd: FormData): Promise<void> {
  await requireAdmin();
  const orderId = str(fd, "orderId");
  if (!orderId) throw new Error("Falta el identificador de la orden.");

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) throw new Error("Orden no encontrada.");
  if (order.status === "cancelled") {
    revalidateOrderSurfaces(order.folio);
    return;
  }

  await db
    .update(orders)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(orders.id, orderId));

  revalidateOrderSurfaces(order.folio);
}

/**
 * Registra el reembolso de una orden pagada. El reembolso real (en Stripe o
 * el depósito de vuelta) lo hace el admin fuera del panel; aquí solo se
 * refleja el estado.
 */
export async function registrarReembolso(fd: FormData): Promise<void> {
  await requireAdmin();
  const orderId = str(fd, "orderId");
  if (!orderId) throw new Error("Falta el identificador de la orden.");

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) throw new Error("Orden no encontrada.");
  if (order.status === "refunded") {
    revalidateOrderSurfaces(order.folio);
    return;
  }
  if (order.status !== "paid") throw new Error("Solo se puede reembolsar una orden pagada.");

  await db
    .update(orders)
    .set({ status: "refunded", updatedAt: new Date() })
    .where(eq(orders.id, orderId));

  revalidateOrderSurfaces(order.folio);
}
