/**
 * Editorial content seed orchestrator.
 *
 * Runs every editorial-domain seed in dependency order. Each seed imports the
 * canonical static data from src/data/content.ts / launchData.ts and upserts it
 * into the normalized content tables, so the DB becomes the single source of
 * truth the public site reads from.
 *
 * Idempotent: safe to re-run (each seed upserts by unique key or
 * delete-then-insert for keyless collections).
 */
import { seedElements } from "./elements";
import { seedPaths } from "./paths";
import { seedProgramDetails } from "./programDetails";
import { seedStats } from "./stats";
import { seedFaqs } from "./faqs";
import { seedPractices } from "./practices";
import { seedProcessSteps } from "./processSteps";
import { seedModalityAxes } from "./modalityAxes";
import { seedImpactCircles } from "./impactCircles";
import { seedShadowProfile } from "./shadowProfile";
import { seedFounders } from "./founders";
import { seedLexicon } from "./lexicon";
import { seedSiteSections } from "./siteSections";
import { seedContact } from "./contact";
import { seedCalendarRetreatsContent } from "./calendarRetreats";

export async function seedEditorialContent() {
  console.log("\n→ editorial content");
  await seedElements();
  await seedPaths();
  await seedProgramDetails();
  await seedStats();
  await seedFaqs();
  await seedPractices();
  await seedProcessSteps();
  await seedModalityAxes();
  await seedImpactCircles();
  await seedShadowProfile();
  await seedFounders();
  await seedLexicon();
  await seedSiteSections();
  await seedContact();
  await seedCalendarRetreatsContent();
  console.log("  ✓ editorial content seeded");
}
