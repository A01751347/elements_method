import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "./client";

async function main() {
  const counts = await db.execute(sql`
    SELECT 'products' AS t, COUNT(*)::int AS n FROM products UNION ALL
    SELECT 'product_combinations', COUNT(*)::int FROM product_combinations UNION ALL
    SELECT 'document_templates', COUNT(*)::int FROM document_templates UNION ALL
    SELECT 'forms', COUNT(*)::int FROM forms UNION ALL
    SELECT 'calculator_config', COUNT(*)::int FROM calculator_config UNION ALL
    SELECT 'retreats', COUNT(*)::int FROM retreats ORDER BY t
  `);
  console.log("\nCounts:");
  console.table(counts.rows ?? counts);

  const sample = await db.execute(sql`
    SELECT slug, type, name_es, price_mxn::text AS price_mxn FROM products ORDER BY sort_order
  `);
  console.log("\nProducts:");
  console.table(sample.rows ?? sample);

  const discounts = await db.execute(sql`
    SELECT name, discount_type, discount_value::text AS value, active FROM product_combinations ORDER BY name
  `);
  console.log("\nDiscount rules:");
  console.table(discounts.rows ?? discounts);
}

main();
