import "server-only";

/**
 * Run a DB read and fall back gracefully if it throws.
 *
 * The public site reads editorial content from the DB, but must keep rendering
 * even when:
 *   - the tables don't exist yet (before `db:push`),
 *   - the DB is unreachable at build/prerender time,
 *   - a table is empty.
 *
 * Every content query wraps its DB access in `safeRead(fallback, fn)`. On any
 * error the caller gets the static fallback, so pages degrade to the bundled
 * content instead of crashing the request or the build.
 */
export async function safeRead<T>(fallback: T, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[content] DB read failed, using static fallback:",
        err instanceof Error ? err.message : err,
      );
    }
    return fallback;
  }
}
