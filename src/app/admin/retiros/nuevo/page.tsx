import { AdminPageHeader } from "../../_components/admin-ui";
import { RetreatForm } from "../RetreatForm";

export default function AdminRetreatNewPage() {
  return (
    <>
      <AdminPageHeader
        title="Nuevo retiro"
        subtitle="Crea un retiro del calendario. Aparecerá en /retiros al guardar."
      />
      <RetreatForm />
    </>
  );
}
