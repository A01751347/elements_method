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
import {
  toggleTestimonialPublished,
  approveTestimonial,
  rejectTestimonial,
} from "./actions";

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
          body="Cuando un participante responda la pregunta testimonial de una encuesta (y autorice publicarla), aparecerá aquí como pendiente. Al aceptarla se publica directo en la página principal."
        />
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <Th>Nombre</Th>
              <Th>Frase</Th>
              <Th>Origen</Th>
              <Th>Publicado</Th>
              <Th>Aprobado</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((t) => (
              <tr key={t.id} className="hover:bg-zinc-50">
                <Td className="font-medium">
                  {t.authorName ?? <span className="text-zinc-400 italic">Anónimo</span>}
                  {t.companyName && (
                    <div className="text-xs text-zinc-500 font-normal">{t.companyName}</div>
                  )}
                </Td>
                <Td className="text-xs max-w-md">
                  <span className="line-clamp-2 italic" title={t.quoteEs ?? undefined}>
                    {t.quoteEs ? `“${t.quoteEs}”` : "—"}
                  </span>
                </Td>
                <Td>
                  <StatusPill
                    status={t.sourceFormResponseId ? "Encuesta" : "Manual"}
                    variant={t.sourceFormResponseId ? "blue" : "neutral"}
                  />
                </Td>
                <Td>
                  <StatusPill
                    status={t.published ? "Sí" : "No"}
                    variant={t.published ? "green" : "amber"}
                  />
                </Td>
                <Td>
                  <StatusPill
                    status={t.approvedByAdmin ? "Sí" : "No"}
                    variant={t.approvedByAdmin ? "green" : "amber"}
                  />
                </Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <form
                      action={toggleTestimonialPublished.bind(
                        null,
                        t.id,
                        !t.published
                      )}
                    >
                      <button
                        type="submit"
                        className="text-xs text-zinc-700 hover:text-zinc-900 hover:underline"
                      >
                        {t.published ? "Despublicar" : "Publicar"}
                      </button>
                    </form>
                    {!t.approvedByAdmin && (
                      <>
                        <form action={approveTestimonial.bind(null, t.id)}>
                          <button
                            type="submit"
                            className="text-xs text-emerald-700 hover:text-emerald-900 hover:underline"
                          >
                            Aceptar y publicar
                          </button>
                        </form>
                        {t.sourceFormResponseId && (
                          <form action={rejectTestimonial.bind(null, t.id)}>
                            <button
                              type="submit"
                              className="text-xs text-red-700 hover:text-red-900 hover:underline"
                            >
                              Rechazar
                            </button>
                          </form>
                        )}
                      </>
                    )}
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
