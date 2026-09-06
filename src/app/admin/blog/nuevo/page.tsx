import { PageHeader, Tarjeta } from "../../_components/ui";
import { BlogForm } from "../BlogForm";

export const dynamic = "force-dynamic";

export default function AdminBlogNewPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Nuevo artículo"
        subtitle="Se guarda como borrador hasta que lo marques como publicado."
      />
      <Tarjeta>
        <BlogForm />
      </Tarjeta>
    </div>
  );
}
