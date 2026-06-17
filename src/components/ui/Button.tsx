import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 font-normal uppercase tracking-[0.16em] leading-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        // ink fill → gold on hover (the leader's gold core)
        primary:
          "bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] active:translate-y-px",
        secondary:
          "border border-[var(--color-ink)]/25 text-[var(--color-ink)] hover:border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]",
        ghost:
          "text-[var(--color-ink)] hover:text-[var(--color-gold-deep)] underline-offset-[6px] hover:underline",
        // paper fill on dark imagery (hero CTAs) → gold on hover
        solidLight:
          "bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)] active:translate-y-px",
        outlineLight:
          "border border-[var(--color-paper)]/45 text-[var(--color-paper)] hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]",
      },
      size: {
        sm: "h-10 px-5 text-[0.65rem]",
        md: "h-12 px-7 text-[0.7rem]",
        lg: "h-14 px-9 text-[0.74rem]",
      },
      shape: {
        pill: "rounded-full",
        square: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      shape: "square",
    },
  },
);

type CommonProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children: React.ReactNode;
  trailingArrow?: boolean;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant, size, shape, className, children, trailingArrow } = props;

  const content = (
    <>
      <span>{children}</span>
      {trailingArrow && (
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  );

  const cls = cn(
    "group",
    buttonVariants({ variant, size, shape }),
    className,
  );

  if ("href" in props && props.href) {
    const { href, external, ...rest } = props as ButtonAsLink;
    const linkRest = rest as Omit<ButtonAsLink, "href" | "external">;
    if (external) {
      return (
        <a
          href={href}
          className={cls}
          target="_blank"
          rel="noopener noreferrer"
          {...linkRest}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...linkRest}>
        {content}
      </Link>
    );
  }

  const { ...rest } = props as ButtonAsButton;
  return (
    <button className={cls} {...rest}>
      {content}
    </button>
  );
}
