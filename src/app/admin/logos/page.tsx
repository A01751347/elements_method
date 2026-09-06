import { asc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { clientLogos } from "@/shared/db/schema/testimonials";
import { Boton, Conteo, EstadoVacio, Insignia, PageHeader, Tabla, Td, Th } from "../_components/ui";
import { BotonPendiente, ConfirmarAccion } from "../_components/client";
import { deleteLogo, toggleLogoActive } from "./actions";

export const dynamic = "force-dynamic";

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
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Logos de clientes"
        subtitle="Organizaciones que han trabajado con Elements Method, en el carrusel de la portada."
        actions={
          <Boton tone="primario" href="/admin/logos/nuevo">
            + Nuevo logo
          </Boton>
        }
      />

      <Conteo n={list.length} singular="logo encontrado" plural="logos encontrados" />

      {list.length === 0 ? (
        <EstadoVacio
          title="Todavía no hay logos."
          body="Cuando subas logos de clientes corporativos, aparecerán aquí y en el carrusel de la portada."
          action={
            <Boton tone="secundario" href="/admin/logos/nuevo">
              + Nuevo logo
            </Boton>
          }
        />
      ) : (
        <Tabla>
          <thead>
            <tr>
              <Th>Empresa</Th>
              <Th>Logo</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((l) => (
              <tr key={l.id}>
                <Td>
                  {l.companyName}
                  {l.websiteUrl && <p className="pista">{l.websiteUrl}</p>}
                </Td>
                <Td>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={l.logoUrl}
                    alt={l.companyName}
                    className="h-8 max-w-[160px] object-contain"
                    style={{ background: "var(--tarjeta)", border: "1px solid var(--hair)", padding: "4px 8px" }}
                  />
                </Td>
                <Td>
                  <Insignia tone={l.active ? "ok" : "neutra"}>{l.active ? "Activo" : "Inactivo"}</Insignia>
                </Td>
                <Td>
                  <div className="flex items-center gap-2 sobre-fila">
                    <form action={toggleLogoActive}>
                      <input type="hidden" name="id" value={l.id} />
                      <input type="hidden" name="next" value={(!l.active).toString()} />
                      <BotonPendiente tone="secundario" className="boton-chico" pendingLabel="Guardando…">
                        {l.active ? "Desactivar" : "Activar"}
                      </BotonPendiente>
                    </form>
                    <ConfirmarAccion
                      trigger="Eliminar"
                      title="Eliminar logo"
                      body="El logo desaparece del carrusel de la portada."
                      confirmLabel="Sí, eliminar el logo"
                      pendingLabel="Eliminando…"
                      action={deleteLogo}
                      tone="peligro"
                      size="chico"
                      hidden={[{ name: "id", value: l.id }]}
                    />
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Tabla>
      )}
    </div>
  );
}
