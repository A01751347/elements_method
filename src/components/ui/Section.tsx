import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  contained?: boolean;
  size?: "narrow" | "default" | "wide";
  spacing?: "tight" | "default" | "loose";
  tone?: "paper" | "warm" | "ink";
}

export function Section({
  contained = true,
  size = "default",
  spacing = "default",
  tone = "paper",
  className,
  children,
  ...props
}: SectionProps) {
  const inner = contained ? (
    <Container size={size} className={className}>
      {children}
    </Container>
  ) : (
    <div className={className}>{children}</div>
  );

  return (
    <section
      data-tone={tone}
      className={cn(
        "relative",
        spacing === "tight" && "py-12 md:py-16",
        spacing === "default" && "py-20 md:py-28",
        spacing === "loose" && "py-28 md:py-40",
        tone === "warm" && "bg-[var(--color-paper-warm)]",
        tone === "ink" && "bg-[var(--color-ink)] text-[var(--color-paper)]",
      )}
      {...props}
    >
      {inner}
    </section>
  );
}

export function Eyebrow({
  children,
  className,
  inverted,
}: {
  children: React.ReactNode;
  className?: string;
  inverted?: boolean;
}) {
  return (
    <div
      className={cn(
        "eyebrow flex items-center gap-3",
        inverted && "text-[var(--color-paper)]/70",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-px w-8",
          inverted
            ? "bg-[var(--color-paper)]/40"
            : "bg-[var(--color-ink)]/30",
        )}
      />
      {children}
    </div>
  );
}
