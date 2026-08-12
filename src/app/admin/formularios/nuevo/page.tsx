import { AdminPageHeader } from "../../_components/admin-ui";
import { FormBuilder } from "../FormBuilder";
import { createForm } from "../actions";

export default function AdminFormNewPage() {
  return (
    <>
      <AdminPageHeader
        title="Nuevo formulario"
        subtitle="Arma el cuestionario pregunta por pregunta. Marca una de texto como Testimonial para que su respuesta llegue a /admin/testimoniales."
      />
      <FormBuilder action={createForm} submitLabel="Crear formulario" />
    </>
  );
}

export const dynamic = "force-dynamic";
