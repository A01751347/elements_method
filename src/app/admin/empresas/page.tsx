import { desc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { enterpriseQuotes } from "@/shared/db/schema/enterprise";
import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
  PlaceholderNote,
  StatusPill,
  Td,
  Th,
} from "../_components/admin-ui";

const QUOTE_STATUS_VARIANT: Record<string, "green" | "amber" | "neutral" | "blue" | "red"> = {
  pending: "amber",
  accepted: "green",
  rejected: "red",
  expired: "neutral",
};

async function loadQuotes() {
  try {
    return await db
      .select()
      .from(enterpriseQuotes)
      .orderBy(desc(enterpriseQuotes.createdAt))
      .limit(200);
  } catch (e) {
    console.error("[admin/empresas] DB read failed", e);
    return [];
  }
}

export default async function AdminEnterprisePage() {
  const quotes = await loadQuotes();

  return (
    <>
      <AdminPageHeader
        title="Empresas / Cotizaciones"
        subtitle="Cotizaciones de Origin (programas corporativos) generadas desde la calculadora pública."
        count={quotes.length}
      />
      <PlaceholderNote />

      {quotes.length === 0 ? (
        <EmptyState
          title="Sin cotizaciones"
          body="Cuando alguien complete la calculadora en /empresas, aparecerá aquí."
        />
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <Th>Folio</Th>
              <Th>Empresa</Th>
              <Th>Contacto</Th>
              <Th>Personas</Th>
              <Th>Modalidad</Th>
              <Th>Total</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.id} className="hover:bg-zinc-50">
                <Td className="font-mono text-xs">{q.quoteNumber}</Td>
                <Td className="font-medium">{q.companyName}</Td>
                <Td>
                  <div>{q.contactName}</div>
                  <div className="text-xs text-zinc-500">{q.contactEmail}</div>
                </Td>
                <Td className="tabular-nums text-sm">{q.numberOfPeople}</Td>
                <Td className="text-xs uppercase tracking-[0.14em]">{q.modality}</Td>
                <Td className="tabular-nums text-sm">
                  ${Number(q.totalMxn).toLocaleString("es-MX")} {q.currency}
                </Td>
                <Td>
                  <StatusPill
                    status={q.status}
                    variant={QUOTE_STATUS_VARIANT[q.status] ?? "neutral"}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </>
  );
}

export const dynamic = "force-dynamic";
