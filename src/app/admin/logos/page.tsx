import { asc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { clientLogos } from "@/shared/db/schema/testimonials";
import {
  AdminPageHeader,
  AdminTable,
  AdminPrimaryButton,
  EmptyState,
  StatusPill,
  Td,
  Th,
} from "../_components/admin-ui";
import { deleteLogo, toggleLogoActive } from "./actions";

async function loadLogos() {
  try {
    return await db.select().from(clientLogos).orderBy(asc(clientLogos.companyName));
  } catch (e) {
    console.error("[admin/logos] DB read failed", e);
    return [];
  }
}

export default async function AdminLogosPage() {
  const list = await loadLogos();

  return (
    <>
      <AdminPageHeader
        title="Logos de clientes"
        subtitle="Logotipos de organizaciones que han trabajado con Elements Method (marquee en la home)."
        count={list.length}
        action={
          <AdminPrimaryButton href="/admin/logos/nuevo">+ Subir logo</AdminPrimaryButton>
        }
      />

      {list.length === 0 ? (
        <EmptyState
          title="Sin logos"
          body="Cuando subas logos de clientes corporativos, aparecerán aquí y en la sección de logos del home."
        />
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <Th>Empresa</Th>
              <Th>Logo</Th>
              <Th>Activo</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((l) => (
              <tr key={l.id} className="hover:bg-zinc-50">
                <Td className="font-medium">{l.companyName}</Td>
                <Td>
                  {l.logoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={l.logoUrl}
                      alt={l.companyName}
                      className="h-8 max-w-[160px] object-contain bg-white border border-zinc-100 px-2"
                    />
                  ) : (
                    "—"
                  )}
                </Td>
                <Td>
                  <StatusPill
                    status={l.active ? "Activo" : "Inactivo"}
                    variant={l.active ? "green" : "neutral"}
                  />
                </Td>
                <Td>
                  <div className="flex items-center gap-4">
                    <form action={toggleLogoActive.bind(null, l.id, !l.active)}>
                      <button
                        type="submit"
                        className="text-sm text-zinc-600 hover:text-zinc-900 hover:underline"
                      >
                        {l.active ? "Desactivar" : "Activar"}
                      </button>
                    </form>
                    <form action={deleteLogo.bind(null, l.id)}>
                      <button
                        type="submit"
                        className="text-sm text-red-700 hover:text-red-900 hover:underline"
                      >
                        Eliminar
                      </button>
                    </form>
                  </div>
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
