import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { testimonials } from "@/shared/db/schema/testimonials";
import { forms, formResponses } from "@/shared/db/schema/forms";
import { Boton, DatoLista, FichaHeader, Insignia, SeccionEtiqueta } from "../../_components/ui";
import { ConfirmarAccion } from "../../_components/client";
import { fechaCorta } from "../../_lib/format";
import { TestimonialForm } from "../TestimonialForm";
import { deleteTestimonial } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialFichaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [testimonial] = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.id, id))
    .limit(1);
  if (!testimonial) notFound();

  let origen: { formSlug: string | null; formTitle: string | null } | null = null;
  if (testimonial.sourceFormResponseId) {
    const [resuelto] = await db
      .select({ formSlug: forms.slug, formTitle: forms.titleEs })
      .from(formResponses)
      .leftJoin(forms, eq(formResponses.formId, forms.id))
      .where(eq(formResponses.id, testimonial.sourceFormResponseId))
      .limit(1);
    origen = resuelto ?? null;
  }

  return (
    <div className="flex flex-col gap-8">
      <FichaHeader
        back={{ href: "/admin/testimoniales", label: "Testimoniales" }}
        kicker={`Testimonial · ${testimonial.sourceFormResponseId ? "Encuesta" : "Manual"}`}
        title={testimonial.authorName || "Anónimo"}
        badge={
          <Insignia tone={testimonial.published ? "ok" : "neutra"}>
            {testimonial.published ? "Publicado" : "Sin publicar"}
          </Insignia>
        }
        meta={[testimonial.companyName, testimonial.authorRole, fechaCorta(testimonial.createdAt)]
          .filter(Boolean)
          .join(" · ")}
        aside={{ label: "Aprobado", value: testimonial.approvedByAdmin ? "Sí" : "No" }}
      />

      <div className="ficha-columnas">
        <TestimonialForm testimonial={testimonial} />

        <div className="ficha-trabajo">
          {testimonial.sourceFormResponseId && (
            <div className="flex flex-col gap-3">
              <SeccionEtiqueta>Origen</SeccionEtiqueta>
              <DatoLista
                items={[
                  {
                    label: "Respuesta del cuestionario",
                    value: origen?.formSlug ? (
                      <Boton tone="texto" href={`/admin/formularios/${origen.formSlug}`}>
                        {origen.formTitle ?? origen.formSlug} →
                      </Boton>
                    ) : (
                      testimonial.sourceFormResponseId
                    ),
                  },
                ]}
              />
            </div>
          )}

          <div className="flex flex-col gap-3">
            <SeccionEtiqueta>Zona de riesgo</SeccionEtiqueta>
            <ConfirmarAccion
              trigger="Eliminar testimonial"
              title="Eliminar testimonial"
              body="Se borra este testimonial. Si viene de un cuestionario, la frase queda registrada en la respuesta original."
              confirmLabel="Sí, eliminar el testimonial"
              pendingLabel="Eliminando…"
              action={deleteTestimonial}
              tone="peligro"
              hidden={[{ name: "id", value: testimonial.id }]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
