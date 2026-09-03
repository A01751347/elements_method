/**
 * Cal.com URL builders. We embed the public booking URL — the Cal API key
 * (server-side) is reserved for admin-side syncing of event types and bookings
 * (RF-CAL-04, RF-CAL-05) which lives elsewhere.
 */

export const CAL_USERNAME =
  process.env.NEXT_PUBLIC_CAL_USERNAME || "elementsmethod";

/** Origin the embed script talks to. Cal's own snippet uses cal.com. */
export const CAL_ORIGIN = "https://cal.com";

export function calLink(
  eventType?: string,
  params?: Record<string, string>,
): string {
  const slug = eventType ? `/${eventType}` : "";
  const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
  return `https://cal.com/${CAL_USERNAME}${slug}${qs}`;
}

/**
 * Live Cal.com event types.
 *
 * These slugs must exist in the workspace or the embed renders a Cal 404 and
 * the page falls back to a dead link. The workspace currently publishes
 * `15min`, `30min` and `empresas` — there is NO `diagnostico` event, which is
 * why the scheduling page never loaded a calendar.
 *
 * When a dedicated event is created in Cal (e.g. `diagnostico`), point the
 * slug at it from the environment instead of editing this file:
 *   NEXT_PUBLIC_CAL_EVENT_INDIVIDUAL=diagnostico
 *   NEXT_PUBLIC_CAL_EVENT_ENTERPRISE=empresas
 */
const INDIVIDUAL = process.env.NEXT_PUBLIC_CAL_EVENT_INDIVIDUAL || "30min";
const ENTERPRISE = process.env.NEXT_PUBLIC_CAL_EVENT_ENTERPRISE || "empresas";

export const CAL_EVENT_TYPES = {
  discoveryEnterprise: ENTERPRISE,
  discoveryIndividual: INDIVIDUAL,
  diagnostic: INDIVIDUAL,
} as const;

/** Query params the founders use on the public enterprise booking link. */
export const CAL_ENTERPRISE_PARAMS = { overlayCalendar: "true" } as const;
