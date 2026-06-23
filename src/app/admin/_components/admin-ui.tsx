/**
 * Shared admin UI primitives for all CRUD pages.
 *
 * Server-friendly — these are pure presentational components. The CRUD pages
 * pass already-fetched/computed data in.
 */
import Link from "next/link";
import type { ReactNode } from "react";

export function AdminPageHeader({
  title,
  subtitle,
  action,
  count,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  count?: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-6 border-b border-zinc-200">
      <div>
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
          {typeof count === "number" && (
            <span className="text-sm tabular-nums text-zinc-500">
              {count} {count === 1 ? "registro" : "registros"}
            </span>
          )}
        </div>
        {subtitle && <p className="mt-2 text-sm text-zinc-600 max-w-2xl">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function AdminTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <th
      className={`text-left text-[0.7rem] uppercase tracking-[0.16em] text-zinc-500 font-medium px-4 py-3 border-b border-zinc-200 ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 align-top border-b border-zinc-100 last:border-b-0 ${className}`}>
      {children}
    </td>
  );
}

export function StatusPill({
  status,
  variant = "neutral",
}: {
  status: string;
  variant?: "green" | "amber" | "red" | "blue" | "neutral";
}) {
  const cls = {
    green: "bg-emerald-50 text-emerald-800 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    red: "bg-red-50 text-red-800 border-red-200",
    blue: "bg-blue-50 text-blue-800 border-blue-200",
    neutral: "bg-zinc-100 text-zinc-700 border-zinc-200",
  }[variant];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.14em] border px-2 py-0.5 ${cls}`}
    >
      {status}
    </span>
  );
}

export function PlaceholderBadge({ fields }: { fields: string[] }) {
  if (!fields?.length) return null;
  return (
    <span
      title={`Campos placeholder: ${fields.join(", ")}`}
      className="inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.14em] border border-amber-300 bg-amber-50 text-amber-800 px-2 py-0.5"
    >
      <span>PH</span>
      <span className="tabular-nums">{fields.length}</span>
    </span>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-12 text-center">
      <h3 className="font-medium text-zinc-900">{title}</h3>
      {body && <p className="mt-2 text-sm text-zinc-600 max-w-md mx-auto">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function AdminPrimaryButton({
  href,
  children,
  onClick,
  type = "button",
}: {
  href?: string;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const className =
    "inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 text-sm hover:bg-zinc-800 transition-colors";
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
}

export function AdminSecondaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 bg-white border border-zinc-300 text-zinc-700 px-3 py-1.5 text-xs hover:bg-zinc-50 transition-colors"
    >
      {children}
    </Link>
  );
}

export function PlaceholderNote() {
  return (
    <div className="mb-6 border-l-2 border-amber-500 bg-amber-50 px-4 py-3 text-xs text-amber-900">
      <strong>Datos placeholder.</strong> Esta vista lee de{" "}
      <code className="font-mono">src/data/launchData.ts</code>. Los CRUD persisten en{" "}
      memoria del cliente — la persistencia real (Drizzle + Neon) está cableada vía{" "}
      seeds; los handlers de form están listos para conectar a server actions.{" "}
      Ver{" "}
      <Link href="/PLACEHOLDERS.md" className="underline">
        PLACEHOLDERS.md
      </Link>
      .
    </div>
  );
}
