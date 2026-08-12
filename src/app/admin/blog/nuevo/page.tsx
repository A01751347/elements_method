import { AdminPageHeader } from "../../_components/admin-ui";
import { BlogForm } from "../BlogForm";

export default function AdminBlogNewPage() {
  return (
    <>
      <AdminPageHeader
        title="Nuevo post"
        subtitle="Crea una publicación del blog. Aparecerá en el listado al guardar."
      />
      <BlogForm />
    </>
  );
}
