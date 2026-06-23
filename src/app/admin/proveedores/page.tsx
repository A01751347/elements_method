import { Plus } from "lucide-react";
import { providersInventory } from "@/data/launchData";
import { elements } from "@/data/content";
import {
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  AdminTable,
  PlaceholderBadge,
  PlaceholderNote,
  StatusPill,
  Td,
  Th,
} from "../_components/admin-ui";

const STATUS_VARIANT: Record<string, "green" | "amber" | "neutral" | "red"> = {
  confirmed: "green",
  "in-contact": "blue" as never,
  pending: "amber",
  researching: "neutral",
};

export default function AdminProvidersPage() {
  return (
    <>
      <AdminPageHeader
        title="Proveedores"
        subtitle="Disciplinas y facilitadores disponibles para asignar a inmersiones."
        count={providersInventory.length}
        action={
          <AdminPrimaryButton href="/admin/proveedores/nuevo">
            <Plus className="h-4 w-4" />
            Nuevo proveedor
          </AdminPrimaryButton>
        }
      />
      <PlaceholderNote />

      <AdminTable>
        <thead>
          <tr>
            <Th>Disciplina</Th>
            <Th>Elemento</Th>
            <Th>Proveedor</Th>
            <Th>Contacto</Th>
            <Th>Status</Th>
            <Th>PH</Th>
            <Th className="text-right">Acciones</Th>
          </tr>
        </thead>
        <tbody>
          {providersInventory.map((p) => {
            const el = elements.find((e) => e.key === p.elementAffinity);
            return (
              <tr key={p.slug} className="hover:bg-zinc-50">
                <Td>
                  <div className="font-medium">{p.disciplineEs}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{p.disciplineEn}</div>
                </Td>
                <Td>
                  <span
                    className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.14em]"
                    style={{ color: el?.accentInk }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: el?.accent }}
                    />
                    {el?.nameEs}
                  </span>
                </Td>
                <Td className="text-xs text-zinc-700">{p.providerName}</Td>
                <Td className="text-xs text-zinc-500">{p.providerContact}</Td>
                <Td>
                  <StatusPill
                    status={p.status}
                    variant={STATUS_VARIANT[p.status] ?? "neutral"}
                  />
                </Td>
                <Td>
                  <PlaceholderBadge fields={p.placeholderFields} />
                </Td>
                <Td className="text-right">
                  <AdminSecondaryButton href={`/admin/proveedores/${p.slug}`}>
                    Editar
                  </AdminSecondaryButton>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </AdminTable>
    </>
  );
}
