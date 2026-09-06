import { PageHeader, Tarjeta } from "../../_components/ui";
import { LogoForm } from "../LogoForm";

export const dynamic = "force-dynamic";

export default function AdminLogoNewPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Nuevo logo"
        subtitle="Agrega un logo de cliente. Aparecerá en el carrusel de la portada al guardar."
      />
      <Tarjeta>
        <LogoForm />
      </Tarjeta>
    </div>
  );
}
