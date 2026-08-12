import { AdminPageHeader } from "../../_components/admin-ui";
import { LogoForm } from "../LogoForm";

export default function AdminLogoNewPage() {
  return (
    <>
      <AdminPageHeader
        title="Subir logo"
        subtitle="Agrega un logo de cliente. Aparecerá en el marquee del home al guardar."
      />
      <LogoForm />
    </>
  );
}
