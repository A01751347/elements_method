import type { ReactNode } from "react";

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <h2 className="text-sm font-medium mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function FormRow({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-4 items-start">
      <label className="text-xs uppercase tracking-[0.14em] text-zinc-500 pt-2">
        {label}
      </label>
      <div>{children}</div>
    </div>
  );
}

export function Input({
  name,
  defaultValue,
  type = "text",
  className = "",
  placeholder,
}: {
  name: string;
  defaultValue?: string;
  type?: string;
  className?: string;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      name={name}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className={`w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 ${className}`}
    />
  );
}

export function Textarea({
  name,
  defaultValue,
  rows = 4,
}: {
  name: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <textarea
      name={name}
      defaultValue={defaultValue}
      rows={rows}
      className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-zinc-900"
    />
  );
}

export function Select({
  name,
  defaultValue,
  children,
}: {
  name: string;
  defaultValue?: string;
  children: ReactNode;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
    >
      {children}
    </select>
  );
}
