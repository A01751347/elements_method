/**
 * Mapas de estado → { label, tone } para todo el admin.
 *
 * Las claves son los valores literales que guardan las columnas de DB
 * (ver src/shared/db/schema/{enums,orders,operations,enterprise,blog,
 * testimonials,forms,integrations}.ts). Las etiquetas van en español,
 * singular femenino ("la orden queda...", ver doc de marca §8.1 regla 4).
 */

export type Tono = "ok" | "alerta" | "acento" | "neutra" | "peligro" | "invertida" | "contorno";

export interface Estado {
  label: string;
  tone: Tono;
}

type Mapa = Record<string, Estado>;

export const ORDER_STATUS: Mapa = {
  pending_documents: { label: "Documentos pendientes", tone: "alerta" },
  pending_payment: { label: "Pendiente de pago", tone: "alerta" },
  pending_transfer_validation: { label: "Comprobante enviado", tone: "acento" },
  paid: { label: "Pagada", tone: "ok" },
  refunded: { label: "Reembolsada", tone: "neutra" },
  cancelled: { label: "Cancelada", tone: "peligro" },
};

export const PAYMENT_METHOD: Mapa = {
  stripe: { label: "Stripe", tone: "contorno" },
  transferencia: { label: "Transferencia", tone: "contorno" },
};

export const INSCRIPTION_STATUS: Mapa = {
  new: { label: "Nueva", tone: "alerta" },
  contacted: { label: "Contactada", tone: "acento" },
  qualified: { label: "Calificada", tone: "ok" },
  converted: { label: "Convertida", tone: "invertida" },
  archived: { label: "Archivada", tone: "neutra" },
};

export const INSCRIPTION_SOURCE: Mapa = {
  apply: { label: "Aplicación", tone: "contorno" },
  contact: { label: "Contacto", tone: "contorno" },
  newsletter: { label: "Newsletter", tone: "contorno" },
  corporate: { label: "Empresas", tone: "contorno" },
};

export const QUOTE_STATUS: Mapa = {
  nueva: { label: "Nueva", tone: "alerta" },
  contactada: { label: "Contactada", tone: "acento" },
  aceptada: { label: "Aceptada", tone: "ok" },
  cerrada: { label: "Cerrada", tone: "invertida" },
};

export const RETREAT_STATUS: Mapa = {
  open: { label: "Abierta", tone: "ok" },
  waitlist: { label: "Lista de espera", tone: "alerta" },
  closed: { label: "Cerrada", tone: "neutra" },
  sold: { label: "Sin cupo", tone: "peligro" },
};

/** Estado administrativo de la sede (columna `venues.state`). */
export const VENUE_STATE_ADMIN: Mapa = {
  confirmed: { label: "Confirmada", tone: "ok" },
  "cotizacion-en-proceso": { label: "Cotización en proceso", tone: "acento" },
  "sin-respuesta": { label: "Sin respuesta", tone: "peligro" },
  researching: { label: "En búsqueda", tone: "neutra" },
  "available-2027": { label: "Disponible 2027", tone: "alerta" },
};

/** Estado de la sede tal como se muestra en el calendario público (`calendar_retreats.venueState`). */
export const VENUE_STATE: Mapa = {
  confirmed: { label: "Confirmada", tone: "ok" },
  tentative: { label: "Tentativa", tone: "alerta" },
  tbd: { label: "Por definir", tone: "neutra" },
};

export const PROVIDER_STATUS: Mapa = {
  confirmed: { label: "Confirmado", tone: "ok" },
  "in-contact": { label: "En conversación", tone: "acento" },
  pending: { label: "Pendiente", tone: "alerta" },
  researching: { label: "En búsqueda", tone: "neutra" },
};

export const COMMENT_STATUS: Mapa = {
  pending: { label: "Pendiente", tone: "alerta" },
  approved: { label: "Aprobado", tone: "ok" },
  rejected: { label: "Rechazado", tone: "peligro" },
  spam: { label: "Spam", tone: "neutra" },
};

export const BLOG_STATUS: Mapa = {
  draft: { label: "Borrador", tone: "alerta" },
  published: { label: "Publicado", tone: "ok" },
};

export const MAILCHIMP_STATUS: Mapa = {
  subscribed: { label: "Suscrito", tone: "ok" },
  pending: { label: "Pendiente", tone: "alerta" },
  unsubscribed: { label: "Dado de baja", tone: "neutra" },
  cleaned: { label: "Limpiado", tone: "peligro" },
};

/** Estado calculado de un `form_token` (no es una columna: se deriva de usedAt/expiresAt). */
export const TOKEN_STATE: Mapa = {
  pendiente: { label: "Pendiente", tone: "alerta" },
  respondido: { label: "Respondido", tone: "ok" },
  expirado: { label: "Expirado", tone: "peligro" },
};

export const PRODUCT_TYPE: Mapa = {
  elemento: { label: "Elemento", tone: "contorno" },
  camino: { label: "Camino", tone: "contorno" },
  retiro_inmersivo: { label: "Retiro inmersivo", tone: "contorno" },
  programa_corporativo: { label: "Programa corporativo", tone: "contorno" },
  experiencia: { label: "Experiencia", tone: "contorno" },
};

/** Devuelve el estado de `map[key]`, o un neutro con la clave cruda si no existe. */
export function estado(map: Mapa, key: string | null | undefined): Estado {
  if (key && map[key]) return map[key];
  return { label: key ?? "—", tone: "neutra" };
}

/** Solicitudes de derechos ARCO (`arco_requests.status`). */
export const ARCO_STATUS: Mapa = {
  nueva: { label: "Nueva", tone: "alerta" },
  identidad_pendiente: { label: "Identidad pendiente", tone: "acento" },
  en_proceso: { label: "En proceso", tone: "acento" },
  resuelta: { label: "Resuelta", tone: "ok" },
  rechazada: { label: "Improcedente", tone: "neutra" },
};

/** Derecho ejercido (`arco_requests.right`). */
export const ARCO_RIGHT: Mapa = {
  acceso: { label: "Acceso", tone: "contorno" },
  rectificacion: { label: "Rectificación", tone: "contorno" },
  cancelacion: { label: "Cancelación", tone: "contorno" },
  oposicion: { label: "Oposición", tone: "contorno" },
  revocacion: { label: "Revocación", tone: "contorno" },
};
