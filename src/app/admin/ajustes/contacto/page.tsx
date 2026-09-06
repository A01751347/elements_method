import { asc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { contactInfo, contactSocials } from "@/shared/db/schema";
import { PageHeader, Banner, Tarjeta, SeccionEtiqueta, Campo, Input, AntesDeConfirmar } from "../../_components/ui";
import { BotonPendiente } from "../../_components/client";
import { guardarContacto } from "./actions";
import { RedesEditor } from "./RedesEditor";

export const dynamic = "force-dynamic";

export default async function AjustesContactoPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const [infoRows, socialRows] = await Promise.all([
    db.select().from(contactInfo).limit(1),
    db.select().from(contactSocials).orderBy(asc(contactSocials.sortOrder)),
  ]);
  const info = infoRows[0];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Contacto"
        subtitle="Teléfono, WhatsApp, correo y redes que se muestran en el pie de página y en las páginas de contacto del sitio."
      />

      {ok === "1" && <Banner tone="info">Contacto guardado.</Banner>}

      <Tarjeta>
        <form action={guardarContacto} className="flex flex-col gap-8">
          <div>
            <SeccionEtiqueta>Teléfono</SeccionEtiqueta>
            <div className="flex flex-col gap-5">
              <Campo
                label="Teléfono (formato México)"
                htmlFor="phoneDisplayMx"
                hint="Como se muestra: +52 55 1234 5678"
              >
                <Input id="phoneDisplayMx" name="phoneDisplayMx" defaultValue={info?.phoneDisplayMx ?? ""} />
              </Campo>
              <Campo
                label="Teléfono (formato internacional)"
                htmlFor="phoneE164"
                hint="Formato internacional sin espacios: +525512345678"
              >
                <Input id="phoneE164" name="phoneE164" defaultValue={info?.phoneE164 ?? ""} />
              </Campo>
              <Campo label="Enlace de WhatsApp" htmlFor="whatsappLink" hint="https://wa.me/525512345678">
                <Input id="whatsappLink" name="whatsappLink" defaultValue={info?.whatsappLink ?? ""} />
              </Campo>
            </div>
          </div>

          <div>
            <SeccionEtiqueta>Correo y dirección</SeccionEtiqueta>
            <div className="flex flex-col gap-5">
              <Campo label="Correo general" htmlFor="emailGeneral">
                <Input id="emailGeneral" name="emailGeneral" type="email" defaultValue={info?.emailGeneral ?? ""} />
              </Campo>
              <Campo label="Dirección (español)" htmlFor="addressLabelEs">
                <Input id="addressLabelEs" name="addressLabelEs" defaultValue={info?.addressLabelEs ?? ""} />
              </Campo>
              <Campo label="Dirección (inglés)" htmlFor="addressLabelEn">
                <Input id="addressLabelEn" name="addressLabelEn" defaultValue={info?.addressLabelEn ?? ""} />
              </Campo>
            </div>
          </div>

          <div>
            <SeccionEtiqueta>Redes</SeccionEtiqueta>
            <RedesEditor
              filasIniciales={socialRows.map((s) => ({ platform: s.platform, handle: s.handle, url: s.url }))}
            />
          </div>

          <AntesDeConfirmar boton={<BotonPendiente pendingLabel="Guardando el contacto…">Guardar contacto</BotonPendiente>}>
            Se actualizan los datos de contacto en todo el sitio público (pie de página, contacto, gracias).
          </AntesDeConfirmar>
        </form>
      </Tarjeta>
    </div>
  );
}
