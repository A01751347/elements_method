import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";
import { asc } from "drizzle-orm";
import { legalDocs } from "@/data/launchData";
import { db } from "@/shared/db/client";
import { documentTemplates } from "@/shared/db/schema";
import {
  AdminPageHeader,
  AdminSecondaryButton,
  AdminTable,
  PlaceholderBadge,
  PlaceholderNote,
  StatusPill,
  Td,
  Th,
} from "../_components/admin-ui";

export const dynamic = "force-dynamic";

async function loadTemplates() {
  try {
    return await db
      .select()
      .from(documentTemplates)
      .orderBy(asc(documentTemplates.nameEs));
  } catch {
    return [];
  }
}

export default async function AdminLegalDocsPage() {
  const templates = await loadTemplates();
  return (
    <>
      <AdminPageHeader
        title="Documentos legales"
        subtitle="Contrato, NDA y Relevo. Todos en borrador pendiente de revisión legal."
        count={legalDocs.length}
      />
      <PlaceholderNote />

      <AdminTable>
        <thead>
          <tr>
            <Th>Slug</Th>
            <Th>Título</Th>
            <Th>Resumen</Th>
            <Th>Tokens</Th>
            <Th>Status</Th>
            <Th className="text-right">Acciones</Th>
          </tr>
        </thead>
        <tbody>
          {legalDocs.map((d) => (
            <tr key={d.slug} className="hover:bg-zinc-50">
              <Td className="font-mono text-xs">{d.slug}</Td>
              <Td className="font-medium">{d.titleEs}</Td>
              <Td className="text-xs text-zinc-600 max-w-md">{d.summaryEs}</Td>
              <Td>
                <PlaceholderBadge fields={d.placeholderFields} />
              </Td>
              <Td>
                <StatusPill status="Borrador" variant="amber" />
              </Td>
              <Td className="text-right whitespace-nowrap">
                <div className="flex justify-end gap-1.5">
                  <Link
                    href={`/es/legal/${d.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 bg-white border border-zinc-300 text-zinc-700 px-3 py-1.5 text-xs hover:bg-zinc-50"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Ver público
                  </Link>
                  <AdminSecondaryButton href={`/admin/documentos/${d.slug}`}>
                    Editar
                  </AdminSecondaryButton>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </AdminTable>

      {templates.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-medium mb-1 flex items-center gap-2">
            <FileText className="h-4 w-4 text-zinc-500" strokeWidth={1.5} />
            Plantillas en base de datos (generación PDF)
          </h2>
          <p className="text-xs text-zinc-500 mb-4">
            Estas plantillas alimentan la generación de PDF con tokens
            personalizados. Agrega <code className="font-mono">?folio=EM-…</code>{" "}
            para rellenar con los datos de una orden.
          </p>
          <AdminTable>
            <thead>
              <tr>
                <Th>Slug</Th>
                <Th>Nombre</Th>
                <Th>Aplica a</Th>
                <Th className="text-right">PDF</Th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-50">
                  <Td className="font-mono text-xs">{t.slug}</Td>
                  <Td className="font-medium">{t.nameEs}</Td>
                  <Td className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                    {t.appliesTo}
                  </Td>
                  <Td className="text-right whitespace-nowrap">
                    <a
                      href={`/api/documento/${t.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-zinc-600 hover:text-zinc-900 underline underline-offset-2"
                    >
                      Ver PDF
                    </a>
                  </Td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        </div>
      )}
    </>
  );
}
