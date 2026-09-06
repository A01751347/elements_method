import { Boton, Campo, Checkbox, Input, SeccionEtiqueta } from "../_components/ui";
import { BotonPendiente } from "../_components/client";
import { createLogo } from "./actions";

/**
 * Create form for a client logo. The <form action={createLogo}> is a real
 * server action, so Save persists to the DB and revalidates the public home
 * marquee surfaces (/es, /en).
 */
export function LogoForm() {
  return (
    <form action={createLogo} className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <SeccionEtiqueta>Logo de cliente</SeccionEtiqueta>
        <Campo label="Empresa" htmlFor="companyName" required>
          <Input id="companyName" name="companyName" />
        </Campo>
        <Campo
          label="URL del logo"
          htmlFor="logoUrl"
          hint="URL pública de la imagen (PNG o SVG con fondo transparente)."
          required
        >
          <Input id="logoUrl" name="logoUrl" type="url" />
        </Campo>
        <Campo label="Sitio web" htmlFor="websiteUrl">
          <Input id="websiteUrl" name="websiteUrl" type="url" />
        </Campo>
        <Campo
          label="Autorización de uso"
          htmlFor="usageAuthorizationUrl"
          hint="Enlace a la autorización de uso de marca, si la tienes."
        >
          <Input id="usageAuthorizationUrl" name="usageAuthorizationUrl" type="url" />
        </Campo>
        <Checkbox name="active" label="Mostrar en el sitio público" defaultChecked />
      </div>

      <div className="flex items-center gap-3">
        <BotonPendiente pendingLabel="Subiendo…">Subir logo</BotonPendiente>
        <Boton tone="secundario" href="/admin/logos">
          Cancelar
        </Boton>
      </div>
    </form>
  );
}
