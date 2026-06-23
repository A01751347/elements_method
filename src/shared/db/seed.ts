import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "./client";
import {
  calculatorConfig,
  documentTemplates,
  forms,
  productCombinations,
  products,
  retreats,
  venues,
  providers,
  subscriptionTiers,
} from "./schema";

import { productSeeds } from "./seeds/products";
import { discountSeeds } from "./seeds/discounts";
import { documentSeeds } from "./seeds/documents";
import { formSeeds } from "./seeds/forms";
import { calculatorConfigSeeds } from "./seeds/calculator";
import { retreatSeeds } from "./seeds/retreats";
import {
  venueSeeds,
  providerSeeds,
  subscriptionTierSeeds,
  calendarRetreatSeeds,
  operationsSeedStats,
} from "./seeds/operations";

async function seedProducts() {
  console.log("→ products");
  for (const p of productSeeds) {
    await db
      .insert(products)
      .values(p)
      .onConflictDoUpdate({
        target: products.slug,
        set: {
          type: p.type,
          element: p.element ?? null,
          nameEs: p.nameEs,
          nameEn: p.nameEn ?? null,
          descriptionEs: p.descriptionEs,
          descriptionEn: p.descriptionEn ?? null,
          includesEs: p.includesEs ?? null,
          includesEn: p.includesEn ?? null,
          duration: p.duration ?? null,
          modality: p.modality ?? null,
          priceMxn: p.priceMxn,
          priceUsd: p.priceUsd ?? null,
          sortOrder: p.sortOrder ?? 0,
          updatedAt: new Date(),
        },
      });
  }
  console.log(`  ✓ ${productSeeds.length} products upserted`);
}

async function seedDiscounts() {
  console.log("→ product_combinations");
  const all = await db.select({ id: products.id, slug: products.slug }).from(products);
  const idBySlug = new Map(all.map((p) => [p.slug, p.id]));

  // Wipe existing seeded ones (idempotent re-runs)
  for (const d of discountSeeds) {
    const ids = d.requiredSlugs.map((s) => {
      const id = idBySlug.get(s);
      if (!id) throw new Error(`Discount "${d.name}" references unknown product slug "${s}"`);
      return id;
    });
    // Find by name (unique enough for our seeds)
    const existing = await db
      .select({ id: productCombinations.id })
      .from(productCombinations)
      .where(sql`${productCombinations.name} = ${d.name}`)
      .limit(1);
    if (existing.length > 0) {
      await db
        .update(productCombinations)
        .set({
          requiredProductIds: ids,
          discountType: d.discountType,
          discountValue: d.discountValue,
          active: d.active,
        })
        .where(sql`${productCombinations.id} = ${existing[0].id}`);
    } else {
      await db.insert(productCombinations).values({
        name: d.name,
        requiredProductIds: ids,
        discountType: d.discountType,
        discountValue: d.discountValue,
        active: d.active,
      });
    }
  }
  console.log(`  ✓ ${discountSeeds.length} discount rules upserted`);
}

async function seedDocuments() {
  console.log("→ document_templates");
  for (const d of documentSeeds) {
    await db
      .insert(documentTemplates)
      .values(d)
      .onConflictDoUpdate({
        target: documentTemplates.slug,
        set: {
          nameEs: d.nameEs,
          nameEn: d.nameEn ?? null,
          templateHtmlEs: d.templateHtmlEs,
          templateHtmlEn: d.templateHtmlEn ?? null,
          requiredForPurchase: d.requiredForPurchase,
          acceptanceType: d.acceptanceType,
          appliesTo: d.appliesTo,
          updatedAt: new Date(),
        },
      });
  }
  console.log(`  ✓ ${documentSeeds.length} document templates upserted`);
}

async function seedForms() {
  console.log("→ forms");
  for (const f of formSeeds) {
    await db
      .insert(forms)
      .values({
        slug: f.slug,
        titleEs: f.titleEs,
        titleEn: f.titleEn,
        descriptionEs: f.descriptionEs,
        descriptionEn: f.descriptionEn,
        category: f.category,
        isAnonymous: f.isAnonymous,
        fields: f.fields,
      })
      .onConflictDoUpdate({
        target: forms.slug,
        set: {
          titleEs: f.titleEs,
          titleEn: f.titleEn,
          descriptionEs: f.descriptionEs,
          descriptionEn: f.descriptionEn,
          category: f.category,
          isAnonymous: f.isAnonymous,
          fields: f.fields,
          updatedAt: new Date(),
        },
      });
  }
  console.log(`  ✓ ${formSeeds.length} forms upserted`);
}

async function seedCalculator() {
  console.log("→ calculator_config");
  for (const c of calculatorConfigSeeds) {
    await db
      .insert(calculatorConfig)
      .values({ key: c.key, value: c.value as never })
      .onConflictDoUpdate({
        target: calculatorConfig.key,
        set: { value: c.value as never, updatedAt: new Date() },
      });
  }
  console.log(`  ✓ ${calculatorConfigSeeds.length} calculator config entries upserted`);
}

async function seedRetreats() {
  console.log("→ retreats (demo data)");
  // Link each retreat to its single-element product when possible
  const elementProducts = await db
    .select({ id: products.id, slug: products.slug })
    .from(products);
  const productBySlug = new Map(elementProducts.map((p) => [p.slug, p.id]));

  for (const r of retreatSeeds) {
    const elementSlug = r.elementsCovered[0];
    const productId = elementSlug ? productBySlug.get(elementSlug) ?? null : null;
    // Don't have a natural unique key here. Match by (nameEs, startDate).
    const existing = await db
      .select({ id: retreats.id })
      .from(retreats)
      .where(sql`${retreats.nameEs} = ${r.nameEs} AND ${retreats.startDate} = ${r.startDate}`)
      .limit(1);
    if (existing.length > 0) {
      await db
        .update(retreats)
        .set({
          nameEn: r.nameEn,
          endDate: r.endDate,
          location: r.location,
          modality: r.modality,
          elementsCovered: r.elementsCovered,
          descriptionEs: r.descriptionEs ?? null,
          descriptionEn: r.descriptionEn ?? null,
          imageUrl: r.imageUrl ?? null,
          priceMxn: r.priceMxn,
          priceUsd: r.priceUsd ?? null,
          capacity: r.capacity,
          lowSeatsThreshold: r.lowSeatsThreshold ?? 10,
          active: r.active ?? true,
          productId,
          updatedAt: new Date(),
        })
        .where(sql`${retreats.id} = ${existing[0].id}`);
    } else {
      await db.insert(retreats).values({ ...r, productId });
    }
  }
  console.log(`  ✓ ${retreatSeeds.length} retreats upserted`);
}

async function seedVenues() {
  console.log("→ venues (operations)");
  for (const v of venueSeeds) {
    await db
      .insert(venues)
      .values(v)
      .onConflictDoUpdate({
        target: venues.slug,
        set: {
          name: v.name,
          city: v.city,
          state: v.state,
          capacity: v.capacity ?? null,
          notesEs: v.notesEs ?? null,
          url: v.url ?? null,
          rangeMxn: v.rangeMxn ?? null,
          active: v.active ?? true,
          isPlaceholder: v.isPlaceholder ?? false,
          placeholderFields: v.placeholderFields ?? null,
          updatedAt: new Date(),
        },
      });
  }
  console.log(`  ✓ ${venueSeeds.length} venues upserted`);
}

async function seedProviders() {
  console.log("→ providers (operations)");
  for (const p of providerSeeds) {
    await db
      .insert(providers)
      .values(p)
      .onConflictDoUpdate({
        target: providers.slug,
        set: {
          disciplineEs: p.disciplineEs,
          disciplineEn: p.disciplineEn,
          elementAffinity: p.elementAffinity,
          descriptionEs: p.descriptionEs ?? null,
          descriptionEn: p.descriptionEn ?? null,
          providerName: p.providerName ?? null,
          providerContact: p.providerContact ?? null,
          status: p.status,
          notesEs: p.notesEs ?? null,
          notesEn: p.notesEn ?? null,
          active: p.active ?? true,
          isPlaceholder: p.isPlaceholder ?? true,
          placeholderFields: p.placeholderFields ?? null,
          updatedAt: new Date(),
        },
      });
  }
  console.log(`  ✓ ${providerSeeds.length} providers upserted`);
}

async function seedSubscriptionTiers() {
  console.log("→ subscription_tiers (operations)");
  for (const t of subscriptionTierSeeds) {
    await db
      .insert(subscriptionTiers)
      .values(t)
      .onConflictDoUpdate({
        target: subscriptionTiers.slug,
        set: {
          nameEs: t.nameEs,
          nameEn: t.nameEn,
          taglineEs: t.taglineEs ?? null,
          taglineEn: t.taglineEn ?? null,
          cadenceEs: t.cadenceEs ?? null,
          cadenceEn: t.cadenceEn ?? null,
          includesEs: t.includesEs ?? null,
          includesEn: t.includesEn ?? null,
          priceLabelMxn: t.priceLabelMxn ?? null,
          priceLabelEn: t.priceLabelEn ?? null,
          highlight: t.highlight ?? false,
          sortOrder: t.sortOrder ?? 0,
          status: t.status ?? "draft",
          isPlaceholder: t.isPlaceholder ?? true,
          placeholderFields: t.placeholderFields ?? null,
          updatedAt: new Date(),
        },
      });
  }
  console.log(`  ✓ ${subscriptionTierSeeds.length} subscription tiers upserted`);
}

async function seedCalendarRetreats() {
  console.log("→ retreats (production calendar 2026-2027)");
  for (const r of calendarRetreatSeeds) {
    const existing = await db
      .select({ id: retreats.id })
      .from(retreats)
      .where(sql`${retreats.nameEs} = ${r.nameEs} AND ${retreats.startDate} = ${r.startDate}`)
      .limit(1);
    if (existing.length > 0) {
      await db
        .update(retreats)
        .set({
          nameEn: r.nameEn,
          endDate: r.endDate,
          location: r.location,
          modality: r.modality,
          elementsCovered: r.elementsCovered,
          descriptionEs: r.descriptionEs ?? null,
          descriptionEn: r.descriptionEn ?? null,
          imageUrl: r.imageUrl ?? null,
          priceMxn: r.priceMxn,
          priceUsd: r.priceUsd ?? null,
          capacity: r.capacity,
          lowSeatsThreshold: r.lowSeatsThreshold ?? 5,
          active: r.active ?? true,
          updatedAt: new Date(),
        })
        .where(sql`${retreats.id} = ${existing[0].id}`);
    } else {
      await db.insert(retreats).values(r);
    }
  }
  console.log(`  ✓ ${calendarRetreatSeeds.length} production retreats upserted`);
}

async function main() {
  console.log("Seeding Elements Method DB…\n");
  await seedProducts();
  await seedDiscounts();
  await seedDocuments();
  await seedForms();
  await seedCalculator();
  await seedRetreats();
  await seedVenues();
  await seedProviders();
  await seedSubscriptionTiers();
  await seedCalendarRetreats();
  console.log(`\n  Operations placeholders: ${operationsSeedStats.placeholdersTotal} fields across`);
  console.log(`    ${operationsSeedStats.retreats} retreats · ${operationsSeedStats.venues} venues · ${operationsSeedStats.providers} providers · ${operationsSeedStats.subscriptionTiers} tiers`);
  console.log("\n✓ done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
