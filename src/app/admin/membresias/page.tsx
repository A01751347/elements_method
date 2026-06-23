import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { subscriptionTiers, subscriptionFlow } from "@/data/launchData";
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

export default function AdminSubscriptionsPage() {
  return (
    <>
      <AdminPageHeader
        title="Membresías"
        subtitle="Tiers de continuidad — Campo / Núcleo / Círculo."
        count={subscriptionTiers.length}
        action={
          <Link
            href="/es/membresia"
            target="_blank"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
          >
            <ExternalLink className="h-4 w-4" />
            Ver público
          </Link>
        }
      />
      <PlaceholderNote />

      <AdminTable>
        <thead>
          <tr>
            <Th>Tier</Th>
            <Th>Cadencia</Th>
            <Th>Precio (MXN)</Th>
            <Th>Precio (USD)</Th>
            <Th>Incluye</Th>
            <Th>PH</Th>
            <Th>Status</Th>
            <Th className="text-right">Acciones</Th>
          </tr>
        </thead>
        <tbody>
          {subscriptionTiers.map((t) => (
            <tr key={t.slug} className="hover:bg-zinc-50">
              <Td>
                <div className="font-medium">{t.nameEs}</div>
                <div className="text-xs text-zinc-500 mt-0.5 italic">{t.taglineEs}</div>
              </Td>
              <Td className="text-xs">{t.cadenceEs}</Td>
              <Td className="text-xs tabular-nums">{t.priceLabelMxn}</Td>
              <Td className="text-xs tabular-nums">{t.priceLabelEn}</Td>
              <Td className="text-xs tabular-nums">{t.includesEs.length}</Td>
              <Td>
                <PlaceholderBadge fields={t.placeholderFields} />
              </Td>
              <Td>
                <StatusPill status="Borrador" variant="amber" />
              </Td>
              <Td className="text-right">
                <AdminSecondaryButton href={`/admin/membresias/${t.slug}`}>
                  Editar
                </AdminSecondaryButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </AdminTable>

      <div className="mt-10">
        <h2 className="text-sm font-medium mb-4">Flujo de inscripción ({subscriptionFlow.length} pasos)</h2>
        <ol className="grid sm:grid-cols-4 gap-px bg-zinc-200 border border-zinc-200 rounded overflow-hidden">
          {subscriptionFlow.map((step) => (
            <li key={step.stepNumber} className="bg-white p-5">
              <div className="font-[family-name:var(--font-display)] text-3xl text-zinc-300 tabular-nums leading-none mb-3">
                {String(step.stepNumber).padStart(2, "0")}
              </div>
              <div className="font-medium text-sm">{step.titleEs}</div>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{step.bodyEs}</p>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
