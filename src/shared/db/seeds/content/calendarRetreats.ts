/**
 * Seed the public calendar_retreats table from the canonical static
 * `calendarRetreats` array (src/data/launchData.ts). Idempotent: upsert by slug.
 */
import { calendarRetreats as staticCalendarRetreats } from "@/data/launchData";
import { db } from "../../client";
import { calendarRetreats } from "../../schema";

export async function seedCalendarRetreatsContent() {
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
