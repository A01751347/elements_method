"use client";

import { useEffect, useRef } from "react";
import { trackPurchase } from "@/shared/integrations/tracking";

/**
 * Fires the Purchase conversion event exactly once when the thank-you page
 * loads with a real order. Rendered by the server thank-you page after it has
 * resolved the order total from the Stripe session id. No-ops when pixels
 * aren't loaded (no consent / not configured).
 */
export function PurchaseTracker({
  value,
  currency,
  transactionId,
}: {
  value: number;
  currency: string;
  transactionId?: string;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current || value <= 0) return;
    fired.current = true;
    trackPurchase({ value, currency, transactionId });
  }, [value, currency, transactionId]);
  return null;
}
