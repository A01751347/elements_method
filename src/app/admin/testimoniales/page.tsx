import { desc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { testimonials } from "@/shared/db/schema/testimonials";
import {
  AdminPageHeader,
  AdminTable,
  AdminPrimaryButton,
  EmptyState,
  StatusPill,
  Td,
  Th,
} from "../_components/admin-ui";

async function loadTestimonials() {
  try {
    return await db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt))
      .limit(100);
  } catch (e) {
    console.error("[admin/testimoniales] DB read failed", e);
    return [];
  }
}

export default async function AdminTestimonialsPage() {
  const list = await loadTestimonials();

  return (
    <>
      <AdminPageHeader
        title="Testimoniales"
        subtitle="Quotes y videos de líderes que pasaron por el programa."
        count={list.length}
        action={
          <AdminPrimaryButton href="/admin/testimoniales/nuevo">+ Nuevo</AdminPrimaryButton>
        }
      />

      {list.length === 0 ? (
        <EmptyState
          title="Sin testimoniales"
          body="Hoy /el-metodo renderiza el testimonial verbatim de Alexandra Reyes desde content.ts. Cuando uses la DB, los testimoniales de aquí sustituyen esa fuente."
        />
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <Th>Nombre</Th>
              <Th>Empresa</Th>
              <Th>Tipo</Th>
              <Th>Publicado</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-50">
                <Td className="font-medium">{t.authorName}</Td>
                <Td className="text-xs">{t.companyName ?? "—"}</Td>
                <Td className="text-xs uppercase tracking-[0.14em]">{t.type}</Td>
                <Td>
                  <StatusPill
                    status={t.published ? "Sí" : "No"}
                    variant={t.published ? "green" : "amber"}
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
