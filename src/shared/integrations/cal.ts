/**
 * Cal.com URL builders. We embed the public booking URL — the Cal API key
 * (server-side) is reserved for admin-side syncing of event types and bookings
 * (RF-CAL-04, RF-CAL-05) which lives elsewhere.
 */

const USERNAME = process.env.NEXT_PUBLIC_CAL_USERNAME || "elementsmethod";

export function calLink(
  eventType?: string,
  params?: Record<string, string>,
): string {
  const slug = eventType ? `/${eventType}` : "";
  const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
  return `https://cal.com/${USERNAME}${slug}${qs}`;
}

/**
 * Live Cal.com event types (sep 2026). Only two events exist in the
 * workspace — cal.com/elementsmethod/diagnostico and
 * cal.com/elementsmethod/empresas — so every individual-flavored CTA
 * resolves to the diagnostic event.
 */
export const CAL_EVENT_TYPES = {
  discoveryEnterprise: "empresas",
  discoveryIndividual: "diagnostico",
  diagnostic: "diagnostico",
} as const;

/** Query params the founders use on the public enterprise booking link. */
export const CAL_ENTERPRISE_PARAMS = { overlayCalendar: "true" } as const;
