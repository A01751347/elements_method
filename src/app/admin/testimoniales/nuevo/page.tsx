import { AdminPageHeader } from "../../_components/admin-ui";
import { TestimonialForm } from "../TestimonialForm";

export default function AdminTestimonialNewPage() {
  return (
    <>
      <AdminPageHeader
        title="Nuevo testimonial"
        subtitle="Crea un testimonial. Aparecerá en las superficies públicas al publicarlo."
      />
      <TestimonialForm />
    </>
  );
}
