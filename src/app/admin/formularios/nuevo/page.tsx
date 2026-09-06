import { PageHeader } from "../../_components/ui";
import { FormBuilder } from "../FormBuilder";
import { createForm } from "../actions";

export const dynamic = "force-dynamic";

export default function AdminFormNewPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Nuevo formulario"
        subtitle="Arma el cuestionario pregunta por pregunta. Marca una de texto como Testimonial para que su respuesta llegue a /admin/testimoniales."
      />
      <FormBuilder action={createForm} submitLabel="Crear formulario" />
    </div>
  );
}
