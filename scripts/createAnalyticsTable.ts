/**
 * Crea SOLO la tabla `page_views` (analítica propia).
 *
 *   pnpm db:analytics
 *
 * Alternativa mínima a `pnpm db:push`: no sincroniza ningún otro objeto, no
 * borra ni altera columnas y no siembra datos (eso lo hace `pnpm db:seed`,
 * que sí volvería a insertar productos, sedes, proveedores, etc.).
 *
 * Es idempotente: si la tabla ya existe no hace nada. El DDL corresponde a
 * src/shared/db/schema/analytics.ts; si esa definición cambia, actualizar aquí.
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const DDL = `
CREATE TABLE IF NOT EXISTS "page_views" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "path" text NOT NULL,
  "locale" text DEFAULT 'es' NOT NULL,
  "funnel_step" text DEFAULT 'otro' NOT NULL,
  "entity_slug" text,
  "referrer_host" text,
  "source" text DEFAULT 'directo' NOT NULL,
  "medium" text,
  "campaign" text,
  "device" text DEFAULT 'desktop' NOT NULL,
  "country" text,
  "visitor_hash" text NOT NULL,
  "session_id" text NOT NULL,
  "duration_ms" integer,
  "viewed_at" timestamp DEFAULT now() NOT NULL
);
`;

const INDEXES = [
  `CREATE INDEX IF NOT EXISTS "page_views_viewed_at_idx" ON "page_views" ("viewed_at");`,
  `CREATE INDEX IF NOT EXISTS "page_views_path_idx" ON "page_views" ("path");`,
  `CREATE INDEX IF NOT EXISTS "page_views_visitor_idx" ON "page_views" ("visitor_hash");`,
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no está definida en .env");
  const sql = neon(url);

  const before = await sql`select 1 from information_schema.tables where table_schema = 'public' and table_name = 'page_views'`;
  if (before.length > 0) {
    console.log("✓ La tabla page_views ya existe. Solo se revisan los índices.");
  } else {
    await sql.query(DDL);
  }

  for (const stmt of INDEXES) await sql.query(stmt);

  const after = await sql`select count(*)::int as n from information_schema.columns where table_schema = 'public' and table_name = 'page_views'`;
  console.log(`✓ Tabla page_views lista (${(after[0] as { n: number }).n} columnas) + 3 índices. Ningún otro objeto fue tocado.`);
}

main().catch((e) => {
  console.error("✗ No se pudo crear la tabla:", e instanceof Error ? e.message : e);
  process.exit(1);
});
