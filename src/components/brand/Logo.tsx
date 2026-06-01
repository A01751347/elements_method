import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function Logo({
  locale,
  inverted,
  className,
}: {
  locale: Locale;
  inverted?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/${locale}`}
      aria-label="Elements Method"
      className={cn(
        "group inline-flex items-center gap-2.5",
        inverted ? "text-[var(--color-paper)]" : "text-[var(--color-ink)]",
        className,
      )}
    >
      <LogoMark inverted={inverted} />
      <span
        className="font-[family-name:var(--font-display)] text-[1.0625rem] tracking-tight leading-none"
      >
        Elements <span className="italic font-light">Method</span>
      </span>
    </Link>
  );
}

export function LogoMark({
  inverted,
  className,
}: {
  inverted?: boolean;
  className?: string;
}) {
  const stroke = inverted ? "var(--color-paper)" : "var(--color-ink)";
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Four element marks composed in a circle */}
      <circle
        cx="14"
        cy="14"
        r="13"
        stroke={stroke}
        strokeWidth="1"
        opacity="0.35"
      />
      {/* Water (top-left): wave */}
      <path
        d="M5 9 Q7 8 9 9 T13 9"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Fire (top-right): flame */}
      <path
        d="M19 6 Q22 9 19 12 Q16 9 19 6 Z"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Air (bottom-left): three lines */}
      <path
        d="M5 17 H11 M5 19.5 H9 M5 22 H10"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Earth (bottom-right): triangle */}
      <path
        d="M16 22 L19 17 L22 22 Z"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
