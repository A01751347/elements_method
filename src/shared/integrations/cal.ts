/**
 * Cal.com URL builders. We embed the public booking URL — the Cal API key
 * (server-side) is reserved for admin-side syncing of event types and bookings
 * (RF-CAL-04, RF-CAL-05) which lives elsewhere.
 */

const USERNAME = process.env.NEXT_PUBLIC_CAL_USERNAME || "elementsmethod";

export function calLink(eventType?: string): string {
  const slug = eventType ? `/${eventType}` : "";
  return `https://cal.com/${USERNAME}${slug}`;
}

/** Default event types we expect to configure in Cal.com (RF-CAL-03). */
export const CAL_EVENT_TYPES = {
  discoveryEnterprise: "empresas",
  discoveryIndividual: "exploracion-individual",
  diagnostic: "diagnostico",
} as const;
