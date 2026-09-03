/**
 * Seed the public calendar_retreats table from the canonical static
 * `calendarRetreats` array (src/data/launchData.ts). Idempotent: upsert by slug.
 */
import { inArray } from "drizzle-orm";
import { calendarRetreats as staticCalendarRetreats } from "@/data/launchData";
import { db } from "../../client";
import { calendarRetreats } from "../../schema";

/**
 * Slugs of the retired 2026-2027 placeholder calendar (aug 2026). They were
 * replaced by the Executive Experiences and must leave the DB or the public
 * /retiros listing keeps showing them. Listed explicitly — never delete by
 * "not in static list", or retreats created through the admin would be wiped.
 */
const RETIRED_SLUGS = [
  "octubre-2026",
  "noviembre-2026",
  "diciembre-2026",
  "enero-2027",
  "febrero-2027",
  "marzo-2027",
  "junio-2027",
  "julio-2027",
  "octubre-2027",
];

export async function seedCalendarRetreatsContent() {
  const removed = await db
    .delete(calendarRetreats)
    .where(inArray(calendarRetreats.slug, RETIRED_SLUGS))
    .returning({ slug: calendarRetreats.slug });
  if (removed.length > 0) {
    console.log(
      `  ✓ ${removed.length} retired calendar_retreats removed (${removed.map((r) => r.slug).join(", ")})`,
    );
  }
  for (const r of staticCalendarRetreats) {
    await db
      .insert(calendarRetreats)
      .values({
        slug: r.slug,
        orderIdx: r.orderIdx,
        themeEs: r.themeEs,
        themeEn: r.themeEn,
        elementKey: r.elementKey,
        startDate: r.startDate,
        endDate: r.endDate,
        dateLabelEs: r.dateLabelEs,
        dateLabelEn: r.dateLabelEn,
        venueState: r.venueState,
        venueLabelEs: r.venueLabelEs,
        venueLabelEn: r.venueLabelEn,
        venueNote: r.venueNote,
        summaryEs: r.summaryEs,
        summaryEn: r.summaryEn,
        status: r.status,
        capacity: r.capacity,
        seatsLeft: r.seatsLeft,
        investmentLabelEs: r.investmentLabelEs,
        investmentLabelEn: r.investmentLabelEn,
        isPlaceholder: r.isPlaceholder,
        placeholderFields: r.placeholderFields,
      })
      .onConflictDoUpdate({
        target: calendarRetreats.slug,
        set: {
          orderIdx: r.orderIdx,
          themeEs: r.themeEs,
          themeEn: r.themeEn,
          elementKey: r.elementKey,
          startDate: r.startDate,
          endDate: r.endDate,
          dateLabelEs: r.dateLabelEs,
          dateLabelEn: r.dateLabelEn,
          venueState: r.venueState,
          venueLabelEs: r.venueLabelEs,
          venueLabelEn: r.venueLabelEn,
          venueNote: r.venueNote,
          summaryEs: r.summaryEs,
          summaryEn: r.summaryEn,
          status: r.status,
          capacity: r.capacity,
          seatsLeft: r.seatsLeft,
          investmentLabelEs: r.investmentLabelEs,
          investmentLabelEn: r.investmentLabelEn,
          isPlaceholder: r.isPlaceholder,
          placeholderFields: r.placeholderFields,
          updatedAt: new Date(),
        },
      });
  }
  console.log(`  ✓ ${staticCalendarRetreats.length} calendar_retreats seeded`);
}
