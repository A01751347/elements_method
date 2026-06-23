import Link from "next/link";
import { ExternalLink, Database, ListChecks } from "lucide-react";
import { AdminPageHeader, PlaceholderNote } from "./admin-ui";

export interface AdminStubSection {
  heading: string;
  body: string;
  bullets?: string[];
}

export function AdminStub({
  title,
  subtitle,
  table,
  count,
  sections,
  publicHref,
  relatedAdmin,
}: {
  title: string;
  subtitle: string;
  table?: string;
  count?: number;
  sections: AdminStubSection[];
  publicHref?: string;
  relatedAdmin?: { href: string; label: string }[];
}) {
  return (
    <>
      <AdminPageHeader
        title={title}
        subtitle={subtitle}
        count={count}
        action={
          publicHref ? (
            <Link
              href={publicHref}
              target="_blank"
              className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
            >
              <ExternalLink className="h-4 w-4" />
              Ver público
            </Link>
          ) : undefined
        }
      />
      <PlaceholderNote />

      {table && (
        <div className="mb-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 flex items-start gap-3 text-sm text-zinc-700">
          <Database className="h-4 w-4 mt-0.5 text-zinc-500 shrink-0" strokeWidth={1.5} />
          <div>
            <strong className="text-zinc-900">Tabla DB:</strong>{" "}
            <code className="font-mono text-xs bg-white px-1.5 py-0.5 border border-zinc-200">
              {table}
            </code>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {sections.map((s) => (
          <div
            key={s.heading}
            className="rounded-lg border border-zinc-200 bg-white p-5"
          >
            <h2 className="text-sm font-medium mb-2 flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-zinc-500" strokeWidth={1.5} />
              {s.heading}
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">{s.body}</p>
            {s.bullets && s.bullets.length > 0 && (
              <ul className="mt-3 text-sm text-zinc-600 space-y-1.5 list-disc pl-5">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {relatedAdmin && relatedAdmin.length > 0 && (
        <div className="mt-8 pt-6 border-t border-zinc-200">
          <h3 className="text-xs uppercase tracking-[0.18em] text-zinc-500 mb-3">
            Relacionado
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedAdmin.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="inline-flex items-center gap-1.5 bg-white border border-zinc-300 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50"
              >
                {r.label} →
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
