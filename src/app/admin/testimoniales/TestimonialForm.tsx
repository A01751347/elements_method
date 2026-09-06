import type { Testimonial } from "@/shared/db/schema/testimonials";
import { Boton, Campo, Checkbox, Input, Select, SeccionEtiqueta, Textarea } from "../_components/ui";
import { BotonPendiente } from "../_components/client";
import { actualizarTestimonial, createTestimonial } from "./actions";

/**
 * Shared create/edit form for a testimonial. When `testimonial` is provided
 * it edits (binds `actualizarTestimonial` with the id); otherwise it creates.
 */
export function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  const isEdit = Boolean(testimonial);
  const action = isEdit ? actualizarTestimonial.bind(null, testimonial!.id) : createTestimonial;

  return (
    <form action={action} className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <SeccionEtiqueta>Autor</SeccionEtiqueta>
        <Campo label="Tipo" htmlFor="type">
          <Select id="type" name="type" defaultValue={testimonial?.type ?? "quote_only"}>
            <option value="video">Video</option>
            <option value="photo_quote">Foto + frase</option>
            <option value="quote_only">Solo frase</option>
            <option value="company_logo">Logo de empresa</option>
          </Select>
        </Campo>
        <Campo label="Nombre del autor" htmlFor="authorName">
          <Input id="authorName" name="authorName" defaultValue={testimonial?.authorName ?? ""} />
        </Campo>
        <Campo label="Rol del autor" htmlFor="authorRole">
          <Input id="authorRole" name="authorRole" defaultValue={testimonial?.authorRole ?? ""} />
        </Campo>
        <Campo label="Empresa" htmlFor="companyName">
          <Input id="companyName" name="companyName" defaultValue={testimonial?.companyName ?? ""} />
        </Campo>
      </div>

      <div className="flex flex-col gap-4">
        <SeccionEtiqueta>Contenido</SeccionEtiqueta>
        <Campo label="Frase (ES)" htmlFor="quoteEs">
          <Textarea id="quoteEs" name="quoteEs" rows={5} defaultValue={testimonial?.quoteEs ?? ""} />
        </Campo>
        <Campo label="Frase (EN)" htmlFor="quoteEn">
          <Textarea id="quoteEn" name="quoteEn" rows={5} defaultValue={testimonial?.quoteEn ?? ""} />
        </Campo>
        <Campo label="Video (URL)" htmlFor="videoUrl">
          <Input id="videoUrl" name="videoUrl" type="url" defaultValue={testimonial?.videoUrl ?? ""} />
        </Campo>
        <Campo label="Foto (URL)" htmlFor="photoUrl">
          <Input id="photoUrl" name="photoUrl" type="url" defaultValue={testimonial?.photoUrl ?? ""} />
        </Campo>
      </div>

      <div className="flex flex-col gap-4">
        <SeccionEtiqueta>Publicación</SeccionEtiqueta>
        <Checkbox name="published" label="Visible en el sitio" defaultChecked={testimonial?.published} />
        {isEdit && (
          <Checkbox name="approvedByAdmin" label="Aprobado" defaultChecked={testimonial?.approvedByAdmin} />
        )}
      </div>

      <div className="flex items-center gap-3">
        <BotonPendiente pendingLabel={isEdit ? "Guardando…" : "Creando…"}>
          {isEdit ? "Guardar cambios" : "Crear testimonial"}
        </BotonPendiente>
        <Boton tone="secundario" href="/admin/testimoniales">
          Cancelar
        </Boton>
      </div>
    </form>
  );
}
