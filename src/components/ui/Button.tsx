import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-[var(--color-moss-700)] active:translate-y-px",
        secondary:
          "border border-[var(--color-ink)]/20 text-[var(--color-ink)] hover:border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]",
        ghost:
          "text-[var(--color-ink)] hover:text-[var(--color-moss-700)] underline-offset-[6px] hover:underline",
        outlineLight:
          "border border-[var(--color-paper)]/30 text-[var(--color-paper)] hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]",
      },
      size: {
        sm: "h-9 px-4 text-[0.8125rem]",
        md: "h-11 px-5 text-[0.875rem]",
        lg: "h-12 px-6 text-[0.9375rem]",
      },
      shape: {
        pill: "rounded-full",
        square: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      shape: "pill",
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
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
