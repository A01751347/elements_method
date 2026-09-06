/**
 * Privacidad — solicitudes de derechos ARCO (LFPDPPP).
 *
 * Una fila por solicitud recibida desde /privacidad/arco (o capturada a mano
 * por el equipo). Los valores de `right`, `relation` y `status` son los
 * literales de src/data/arco.ts; se guardan como texto para que `db:push`
 * no requiera enums nuevos.
 *
 * Plazos: `responseDueAt` se calcula al recibir (20 días hábiles). La fecha
 * límite para hacer efectiva la respuesta (15 días hábiles más) se deriva de
 * `respondedAt` en la UI del admin.
 */
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const arcoRequests = pgTable("arco_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  folio: text("folio").notNull().unique(),
  right: text("arco_right").notNull(), // acceso | rectificacion | cancelacion | oposicion | revocacion
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  relation: text("relation"), // participante | comprador | empresa | suscriptor | otro
  isRepresentative: boolean("is_representative").default(false).notNull(),
  titularName: text("titular_name"),
  description: text("description").notNull(),
  locale: text("locale").default("es").notNull(),
  status: text("status").default("nueva").notNull(), // nueva | identidad_pendiente | en_proceso | resuelta | rechazada
  receivedAt: timestamp("received_at").defaultNow().notNull(),
  responseDueAt: timestamp("response_due_at").notNull(),
  identityRequestedAt: timestamp("identity_requested_at"),
  identityVerifiedAt: timestamp("identity_verified_at"),
  respondedAt: timestamp("responded_at"),
  resolution: text("resolution"),
  notes: text("notes"),
  privacyAcceptedAt: timestamp("privacy_accepted_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ArcoRequest = typeof arcoRequests.$inferSelect;
export type NewArcoRequest = typeof arcoRequests.$inferInsert;
