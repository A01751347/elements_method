"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") window.print();
      }}
      className="inline-flex items-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-2.5 text-sm tracking-wide hover:bg-[var(--color-ink)]/90 transition-colors w-full justify-center"
    >
      <Printer className="h-4 w-4" strokeWidth={1.5} />
      {label}
    </button>
  );
}
