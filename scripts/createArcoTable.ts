/**
 * Crea SOLO la tabla `arco_requests` en la base de datos (derechos ARCO).
 *
 *   pnpm db:arco
 *
 * Alternativa mínima a `pnpm db:push`: no sincroniza ningún otro objeto, no
 * borra ni altera columnas y no siembra datos (eso lo hace `pnpm db:seed`,
 * que sí volvería a insertar productos, sedes, proveedores, etc.).
 *
 * Es idempotente: si la tabla ya existe no hace nada. El DDL es el que genera
 * drizzle-kit a partir de src/shared/db/schema/privacy.ts; si esa definición
 * cambia, regenerar con `drizzle-kit generate` y actualizar aquí.
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const DDL = `
CREATE TABLE IF NOT EXISTS "arco_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "folio" text NOT NULL,
  "arco_right" text NOT NULL,
  "full_name" text NOT NULL,
  "email" text NOT NULL,
  "phone" text,
  "relation" text,
  "is_representative" boolean DEFAULT false NOT NULL,
  "titular_name" text,
  "description" text NOT NULL,
  "locale" text DEFAULT 'es' NOT NULL,
  "status" text DEFAULT 'nueva' NOT NULL,
  "received_at" timestamp DEFAULT now() NOT NULL,
  "response_due_at" timestamp NOT NULL,
  "identity_requested_at" timestamp,
  "identity_verified_at" timestamp,
  "responded_at" timestamp,
  "resolution" text,
  "notes" text,
  "privacy_accepted_at" timestamp NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "arco_requests_folio_unique" UNIQUE("folio")
);
`;

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no está definida en .env");
  const sql = neon(url);

  const before = await sql`select 1 from information_schema.tables where table_schema = 'public' and table_name = 'arco_requests'`;
  if (before.length > 0) {
    console.log("✓ La tabla arco_requests ya existe. No se hizo nada.");
    return;
  }

  await sql.query(DDL);

  const after = await sql`select count(*)::int as n from information_schema.columns where table_schema = 'public' and table_name = 'arco_requests'`;
  console.log(`✓ Tabla arco_requests creada (${(after[0] as { n: number }).n} columnas). Ningún otro objeto fue tocado.`);
}

main().catch((e) => {
  console.error("✗ No se pudo crear la tabla:", e instanceof Error ? e.message : e);
  process.exit(1);
});
