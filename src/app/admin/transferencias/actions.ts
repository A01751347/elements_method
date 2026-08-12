"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orders } from "@/shared/db/schema/orders";
import { requireAdmin } from "@/shared/admin/action";

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
  revalidateOrderSurfaces();
}
