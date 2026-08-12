import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { calendarRetreats } from "@/shared/db/schema";
import type { CalendarRetreat } from "@/data/launchData";
import { safeRead } from "./safe";

/** Map a DB row to the canonical CalendarRetreat shape the UI consumes. */
function toCalendarRetreat(r: typeof calendarRetreats.$inferSelect): CalendarRetreat {
  return {
    slug: r.slug,
    orderIdx: r.orderIdx,
    themeEs: r.themeEs,
    themeEn: r.themeEn,
    elementKey: r.elementKey as CalendarRetreat["elementKey"],
    startDate: r.startDate,
    endDate: r.endDate,
    dateLabelEs: r.dateLabelEs,
    dateLabelEn: r.dateLabelEn,
    venueState: r.venueState as CalendarRetreat["venueState"],
    venueLabelEs: r.venueLabelEs,
    venueLabelEn: r.venueLabelEn,
    venueNote: r.venueNote,
    summaryEs: r.summaryEs,
    summaryEn: r.summaryEn,
    status: r.status as CalendarRetreat["status"],
    capacity: r.capacity,
    seatsLeft: r.seatsLeft,
    investmentLabelEs: r.investmentLabelEs,
    investmentLabelEn: r.investmentLabelEn,
    isPlaceholder: r.isPlaceholder,
    placeholderFields: r.placeholderFields ?? [],
  };
}

/** All calendar retreats ordered by orderIdx (admin + public). */
export async function getCalendarRetreats(): Promise<CalendarRetreat[]> {
  return safeRead([], async () => {
    const rows = await db
      .select()
      .from(calendarRetreats)
      .orderBy(asc(calendarRetreats.orderIdx));
    return rows.map(toCalendarRetreat);
  });
}

/** Single calendar retreat by slug, or null. */
export async function getCalendarRetreatBySlug(
  slug: string,
): Promise<CalendarRetreat | null> {
  return safeRead(null, async () => {
    const rows = await db
      .select()
      .from(calendarRetreats)
      .where(eq(calendarRetreats.slug, slug))
      .limit(1);
    return rows[0] ? toCalendarRetreat(rows[0]) : null;
  });
}
