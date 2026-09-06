import { PageHeader, Tarjeta } from "../../_components/ui";
import { TestimonialForm } from "../TestimonialForm";

export const dynamic = "force-dynamic";

export default function AdminTestimonialNewPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Nuevo testimonial"
        subtitle="Crea un testimonial. Aparecerá en las superficies públicas al publicarlo."
      />
      <Tarjeta>
        <TestimonialForm />
      </Tarjeta>
    </div>
  );
}
