import "server-only";
import { auth } from "@/shared/auth/config";

/**
 * Shared guard for admin server actions.
 *
 * Every mutating admin action must call `await requireAdmin()` first. It throws
 * if there is no authenticated admin session, so a mutation can never run for an
 * unauthenticated request even if the form is somehow POSTed directly. The admin
 * middleware already blocks the UI, but this is defense-in-depth at the data
 * layer.
 */
export async function requireAdmin(): Promise<{ id: string; email: string }> {
  const session = await auth();
  const user = session?.user;
  if (!user?.email) {
    throw new Error("No autorizado: se requiere sesión de administrador.");
  }
  return { id: user.id ?? "", email: user.email };
}

/**
 * Small FormData helpers — server actions receive a FormData and we pull typed
 * values out of it. All admin forms use plain string inputs, so these normalize
 * the common conversions.
 */
export function str(fd: FormData, name: string): string {
  const v = fd.get(name);
  return typeof v === "string" ? v.trim() : "";
}

export function strOrNull(fd: FormData, name: string): string | null {
  const v = str(fd, name);
  return v.length > 0 ? v : null;
}

export function num(fd: FormData, name: string, fallback = 0): number {
  const v = Number(str(fd, name));
  return Number.isFinite(v) ? v : fallback;
}

export function bool(fd: FormData, name: string): boolean {
  const v = fd.get(name);
  return v === "on" || v === "true" || v === "1";
}

/** Split a "A · B · C" or newline / comma list into a trimmed string[]. */
export function list(fd: FormData, name: string): string[] {
  return str(fd, name)
    .split(/[\n·•|,]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}
