import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { processStepsContent } from "@/shared/db/schema";
import type { ProcessStep } from "@/data/content";
import { safeRead } from "./safe";

/**
 * Read query: process steps — the Disconnection Protocol.
 *
 * Source table: process_steps_content (processStepsContent)
 * Returns: ProcessStep[] ordered by sortOrder.
 *
 * Drop-in replacement for the static `processSteps` export from
 * `@/data/content`: a page/component can do `const steps = await getProcessSteps()`
 * and pass the result straight to <ProcessSteps> / the retiros table unchanged.
 *
 * The target table has no `active` column, so no active filter is applied.
 * Empty DB returns [] (never throws).
 */
export async function getProcessSteps(): Promise<ProcessStep[]> {
  return safeRead([], async () => {
    const rows = await db
      .select()
      .from(processStepsContent)
      .orderBy(asc(processStepsContent.sortOrder));

    return rows.map(
      (r): ProcessStep => ({
        n: r.n,
        titleEs: r.titleEs,
        titleEn: r.titleEn,
        durationEs: r.durationEs,
        durationEn: r.durationEn,
        bodyEs: r.bodyEs,
        bodyEn: r.bodyEn,
      }),
    );
  });
}
