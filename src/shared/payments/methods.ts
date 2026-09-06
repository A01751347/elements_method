/**
 * Which payment methods the public checkout offers.
 *
 * Card is OFF until `CHECKOUT_CARD_ENABLED=true`: the Stripe account is still
 * being configured and test keys must never face a real buyer. Set the flag
 * locally to exercise card checkout against the Stripe sandbox. Deposit is ON
 * unless `CHECKOUT_TRANSFER_ENABLED=false`.
 *
 * Read on the server only; the list is passed down to the client button as a
 * prop and re-checked by /api/checkout so a hidden method can't be reached by
 * hand-crafting the request.
 */
export type PaymentMethod = "stripe" | "transferencia";

export function enabledPaymentMethods(): PaymentMethod[] {
  const list: PaymentMethod[] = [];
  if (process.env.CHECKOUT_CARD_ENABLED === "true") list.push("stripe");
  if (process.env.CHECKOUT_TRANSFER_ENABLED !== "false") list.push("transferencia");
  return list;
}

export function isPaymentMethodEnabled(method: PaymentMethod): boolean {
  return enabledPaymentMethods().includes(method);
}
