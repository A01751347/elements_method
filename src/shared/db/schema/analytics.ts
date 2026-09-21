/**
 * Analítica propia — una fila por vista de página.
 *
 * Sustituye la dependencia de GA4 para las preguntas básicas del negocio:
 * cuánta gente entra, a qué páginas llega, de dónde viene y hasta qué punto
 * del embudo avanza. Se escribe desde /api/track (POST) y se lee en
 * /admin/analytics.
 *
 * Privacidad (LFPDPPP): NO se guarda IP, ni user-agent completo, ni cookies
 * de identificación. `visitorHash` es un hash diario, irreversible y sin sal
 * persistente entre días, que solo sirve para no contar diez veces al mismo
 * visitante dentro del mismo día. `sessionId` vive en sessionStorage y muere
 * al cerrar la pestaña. Por eso esta medición es "esencial/agregada" y no
 * requiere consentimiento de marketing.
 */
import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const pageViews = pgTable(
  "page_views",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    path: text("path").notNull(),
    locale: text("locale").default("es").notNull(),
    // Clasificación del embudo, derivada del path en el servidor:
    // home | experiencia | retiros | blog | checkout | gracias | empresas | otro
    funnelStep: text("funnel_step").default("otro").notNull(),
    // Slug de la experiencia/producto cuando el path lo identifica.
    entitySlug: text("entity_slug"),
    referrerHost: text("referrer_host"), // solo el host, nunca la URL completa
    source: text("source").default("directo").notNull(), // utm_source o host normalizado
    medium: text("medium"), // utm_medium
    campaign: text("campaign"), // utm_campaign
    device: text("device").default("desktop").notNull(), // desktop | mobile | tablet
    country: text("country"), // de los headers del edge, si existe
    visitorHash: text("visitor_hash").notNull(), // hash diario, no identifica
    sessionId: text("session_id").notNull(),
    durationMs: integer("duration_ms"), // tiempo en página, si alcanzó a enviarse
    viewedAt: timestamp("viewed_at").defaultNow().notNull(),
  },
  (t) => [
    index("page_views_viewed_at_idx").on(t.viewedAt),
    index("page_views_path_idx").on(t.path),
    index("page_views_visitor_idx").on(t.visitorHash),
  ],
);

export type PageView = typeof pageViews.$inferSelect;
export type NewPageView = typeof pageViews.$inferInsert;
