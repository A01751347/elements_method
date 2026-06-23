import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Brand logo files (added Jun 23, 2026):
 *   - `/images/elements/elements_logo_nobg.png` — transparent PNG, use on
 *     any colored background (header, footer, admin sidebar, dark sections).
 *   - `/images/elements/elements_logo.jpeg` — opaque JPEG with background,
 *     use for emails, PDFs, OG images, anywhere a transparent file isn't
 *     supported.
 *
 * Both are 1024×1024 squares — rendered through next/image with explicit
 * dimensions so layout doesn't shift.
 */
export const LOGO_PNG = "/images/elements/elements_logo_nobg.png";
export const LOGO_OPAQUE = "/images/elements/elements_logo.jpeg";

export function Logo({
  locale,
  inverted,
  className,
  showWordmark = true,
  size = "default",
}: {
  locale: Locale;
  inverted?: boolean;
  className?: string;
  showWordmark?: boolean;
  size?: "default" | "sm" | "lg";
}) {
  const markSize =
    size === "sm" ? 28 : size === "lg" ? 44 : 34;
  const textCls =
    size === "sm"
      ? "text-[0.95rem]"
      : size === "lg"
        ? "text-[1.25rem]"
        : "text-[1.0625rem]";
  return (
    <Link
      href={`/${locale}`}
      aria-label="Elements Method"
      className={cn(
        "group inline-flex items-center gap-2.5",
        inverted ? "text-[var(--color-paper)]" : "text-[var(--color-ink)]",
        className,
      )}
      style={
        inverted
          ? { textShadow: "0 1px 2px rgba(0,0,0,0.4)" }
          : undefined
      }
    >
      <LogoMark size={markSize} />
      {showWordmark && (
        <span
          className={cn(
            "font-[family-name:var(--font-display)] tracking-tight leading-none",
            textCls,
          )}
        >
          Elements <span className="italic font-light">Method</span>
        </span>
      )}
    </Link>
  );
}

/**
 * Square logo mark — the PNG with no background. Works over any color.
 * Pass `inverted` only as legacy alias; the PNG itself is color-fixed.
 */
export function LogoMark({
  size = 32,
  className,
}: {
  inverted?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={LOGO_PNG}
      width={size}
      height={size}
      alt=""
      aria-hidden
      priority
      className={cn("shrink-0 select-none", className)}
      style={{ width: size, height: size }}
    />
  );
}

/**
 * Opaque logo — use in emails, PDFs, anywhere a transparent PNG isn't ideal.
 */
export function LogoOpaque({
  size = 64,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={LOGO_OPAQUE}
      width={size}
      height={size}
      alt="Elements Method"
      className={cn("shrink-0 select-none", className)}
      style={{ width: size, height: size }}
    />
  );
}
