"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orders } from "@/shared/db/schema/orders";
import { requireAdmin } from "@/shared/admin/action";
import { sendPaymentConfirmation } from "@/shared/integrations/orderEmails";

/** Revalidate every surface that reflects order/payment state after a write. */
function revalidateOrderSurfaces() {
  revalidatePath("/admin/transferencias");
  revalidatePath("/admin/pagos");
  revalidatePath("/admin/compradores");
  revalidatePath("/admin");
}

/**
 * Validate a pending SPEI transfer: mark the order as paid, stamp the payment
 * and validation timestamps, and record which admin validated it.
 *
 * This is an inline toggle from the transfers list, so it only revalidates the
 * affected admin surfaces — no redirect.
 */
export async function markOrderPaid(orderId: string) {
  const admin = await requireAdmin();
  const now = new Date();

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);
  if (!order) throw new Error("Orden no encontrada.");
  // Guard against a double click re-stamping the payment and re-emailing.
  if (order.status === "paid") {
    revalidateOrderSurfaces();
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

  // Transfers previously settled in silence — the buyer got no confirmation and
  // no receipt. Same email Stripe payments produce.
  await sendPaymentConfirmation(
    { ...order, status: "paid", paidAt: now, transferValidatedAt: now, transferValidatedBy: admin.email },
    { method: "transferencia", validatedBy: admin.email },
  );

  revalidateOrderSurfaces();
}
