import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { legalDocs } from "@/data/launchData";
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

export default function AdminLegalDocsPage() {
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
    </>
  );
}
