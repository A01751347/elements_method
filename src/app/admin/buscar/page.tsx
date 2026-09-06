import { count, desc, ilike, or } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { orders, inscriptions, enterpriseQuotes, arcoRequests } from "@/shared/db/schema";
import { PageHeader, SeccionEtiqueta, Tabla, Th, Td, FilaEnlace, EnlaceFila, Insignia, EstadoVacio } from "../_components/ui";
import { ORDER_STATUS, INSCRIPTION_STATUS, QUOTE_STATUS, ARCO_STATUS, ARCO_RIGHT, estado } from "../_lib/status";
import { mxn } from "../_lib/format";

export const dynamic = "force-dynamic";

async function buscarOrdenes(pat: string) {
  try {
    return await db
      .select()
      .from(orders)
      .where(
        or(
          ilike(orders.folio, pat),
          ilike(orders.buyerName, pat),
          ilike(orders.buyerEmail, pat),
          ilike(orders.buyerCompany, pat),
        ),
      )
      .orderBy(desc(orders.createdAt))
      .limit(20);
  } catch (e) {
    console.error("[admin/buscar] órdenes fallida", e);
    return [];
  }
}

async function buscarCompradores(pat: string) {
  try {
    return await db
      .select({
        email: orders.buyerEmail,
        nombre: orders.buyerName,
        ordenes: count(),
      })
      .from(orders)
      .where(or(ilike(orders.buyerEmail, pat), ilike(orders.buyerName, pat), ilike(orders.buyerCompany, pat)))
      .groupBy(orders.buyerEmail, orders.buyerName)
      .limit(20);
  } catch (e) {
    console.error("[admin/buscar] compradores fallida", e);
    return [];
  }
}

async function buscarInscripciones(pat: string) {
  try {
    return await db
      .select()
      .from(inscriptions)
      .where(or(ilike(inscriptions.name, pat), ilike(inscriptions.email, pat), ilike(inscriptions.organization, pat)))
      .orderBy(desc(inscriptions.createdAt))
      .limit(20);
  } catch (e) {
    console.error("[admin/buscar] inscripciones fallida", e);
    return [];
  }
}

async function buscarCotizaciones(pat: string) {
  try {
    return await db
      .select()
      .from(enterpriseQuotes)
      .where(
        or(
          ilike(enterpriseQuotes.quoteNumber, pat),
          ilike(enterpriseQuotes.companyName, pat),
          ilike(enterpriseQuotes.contactName, pat),
          ilike(enterpriseQuotes.contactEmail, pat),
        ),
      )
      .orderBy(desc(enterpriseQuotes.createdAt))
      .limit(20);
  } catch (e) {
    console.error("[admin/buscar] cotizaciones fallida", e);
    return [];
  }
}

async function buscarArco(pat: string) {
  try {
    return await db
      .select()
      .from(arcoRequests)
      .where(or(ilike(arcoRequests.folio, pat), ilike(arcoRequests.fullName, pat), ilike(arcoRequests.email, pat)))
      .orderBy(desc(arcoRequests.receivedAt))
      .limit(20);
  } catch (e) {
    console.error("[admin/buscar] arco fallida", e);
    return [];
  }
}

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: qRaw } = await searchParams;
  const q = (qRaw ?? "").trim();

  if (!q) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader title="Búsqueda" />
        <EstadoVacio
          title="Escribe algo para buscar."
          body="Busca folios de orden, nombres o correos de compradores, inscripciones y cotizaciones de empresas por folio, nombre, correo o empresa."
        />
      </div>
    );
  }

  const pat = `%${q}%`;
  const [ordenes, compradores, inscripcionesRes, cotizaciones, arco] = await Promise.all([
    buscarOrdenes(pat),
    buscarCompradores(pat),
    buscarInscripciones(pat),
    buscarCotizaciones(pat),
    buscarArco(pat),
  ]);

  const totalResultados =
    ordenes.length + compradores.length + inscripcionesRes.length + cotizaciones.length + arco.length;

  return (
    <div className="flex flex-col gap-10">
      <PageHeader title="Búsqueda" subtitle={`Resultados para «${q}»`} />

      {totalResultados === 0 ? (
        <EstadoVacio title={`Nada coincide con «${q}».`} body="Busca por folio, nombre, correo o empresa." />
      ) : (
        <>
          {ordenes.length > 0 && (
            <section className="flex flex-col gap-3">
              <SeccionEtiqueta>{`Órdenes · ${ordenes.length}`}</SeccionEtiqueta>
              <Tabla>
                <thead>
                  <tr>
                    <Th>Folio</Th>
                    <Th>Comprador</Th>
                    <Th align="right">Total</Th>
                    <Th>Estado</Th>
                  </tr>
                </thead>
                <tbody>
                  {ordenes.map((o) => {
                    const e = estado(ORDER_STATUS, o.status);
                    return (
                      <FilaEnlace key={o.id}>
                        <Td>
                          <EnlaceFila href={`/admin/pagos/${o.folio}`}>{o.folio}</EnlaceFila>
                        </Td>
                        <Td secondary>
                          {o.buyerName}
                          <br />
                          {o.buyerEmail}
                        </Td>
                        <Td numeric>{mxn(o.total)}</Td>
                        <Td>
                          <Insignia tone={e.tone}>{e.label}</Insignia>
                        </Td>
                      </FilaEnlace>
                    );
                  })}
                </tbody>
              </Tabla>
            </section>
          )}

          {compradores.length > 0 && (
            <section className="flex flex-col gap-3">
              <SeccionEtiqueta>{`Compradores · ${compradores.length}`}</SeccionEtiqueta>
              <Tabla>
                <thead>
                  <tr>
                    <Th>Nombre</Th>
                    <Th>Correo</Th>
                    <Th align="right">Órdenes</Th>
                  </tr>
                </thead>
                <tbody>
                  {compradores.map((c) => (
                    <FilaEnlace key={c.email}>
                      <Td>
                        <EnlaceFila href={`/admin/compradores/${encodeURIComponent(c.email)}`}>
                          {c.nombre || c.email}
                        </EnlaceFila>
                      </Td>
                      <Td secondary>{c.email}</Td>
                      <Td numeric>{c.ordenes}</Td>
                    </FilaEnlace>
                  ))}
                </tbody>
              </Tabla>
            </section>
          )}

          {inscripcionesRes.length > 0 && (
            <section className="flex flex-col gap-3">
              <SeccionEtiqueta>{`Inscripciones · ${inscripcionesRes.length}`}</SeccionEtiqueta>
              <Tabla>
                <thead>
                  <tr>
                    <Th>Nombre</Th>
                    <Th>Correo</Th>
                    <Th>Organización</Th>
                    <Th>Estado</Th>
                  </tr>
                </thead>
                <tbody>
                  {inscripcionesRes.map((i) => {
                    const e = estado(INSCRIPTION_STATUS, i.status);
                    return (
                      <FilaEnlace key={i.id}>
                        <Td>
                          <EnlaceFila href={`/admin/inscripciones/${i.id}`}>{i.name}</EnlaceFila>
                        </Td>
                        <Td secondary>{i.email}</Td>
                        <Td secondary>{i.organization || "—"}</Td>
                        <Td>
                          <Insignia tone={e.tone}>{e.label}</Insignia>
                        </Td>
                      </FilaEnlace>
                    );
                  })}
                </tbody>
              </Tabla>
            </section>
          )}

          {cotizaciones.length > 0 && (
            <section className="flex flex-col gap-3">
              <SeccionEtiqueta>{`Cotizaciones · ${cotizaciones.length}`}</SeccionEtiqueta>
              <Tabla>
                <thead>
                  <tr>
                    <Th>Folio</Th>
                    <Th>Empresa</Th>
                    <Th>Contacto</Th>
                    <Th>Estado</Th>
                  </tr>
                </thead>
                <tbody>
                  {cotizaciones.map((c) => {
                    const e = estado(QUOTE_STATUS, c.status);
                    return (
                      <FilaEnlace key={c.id}>
                        <Td style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: 12 }}>
                          <EnlaceFila href={`/admin/empresas/${c.quoteNumber}`}>{c.quoteNumber}</EnlaceFila>
                        </Td>
                        <Td>{c.companyName}</Td>
                        <Td secondary>
                          {c.contactName}
                          <br />
                          {c.contactEmail}
                        </Td>
                        <Td>
                          <Insignia tone={e.tone}>{e.label}</Insignia>
                        </Td>
                      </FilaEnlace>
                    );
                  })}
                </tbody>
              </Tabla>
            </section>
          )}

          {arco.length > 0 && (
            <section className="flex flex-col gap-3">
              <SeccionEtiqueta>{`Derechos ARCO · ${arco.length}`}</SeccionEtiqueta>
              <Tabla>
                <thead>
                  <tr>
                    <Th>Folio</Th>
                    <Th>Titular</Th>
                    <Th>Derecho</Th>
                    <Th>Estado</Th>
                  </tr>
                </thead>
                <tbody>
                  {arco.map((r) => {
                    const e = estado(ARCO_STATUS, r.status);
                    const d = estado(ARCO_RIGHT, r.right);
                    return (
                      <FilaEnlace key={r.id}>
                        <Td style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: 12 }}>
                          <EnlaceFila href={`/admin/arco/${r.id}`}>{r.folio}</EnlaceFila>
                        </Td>
                        <Td secondary>
                          {r.fullName}
                          <br />
                          {r.email}
                        </Td>
                        <Td>
                          <Insignia tone={d.tone}>{d.label}</Insignia>
                        </Td>
                        <Td>
                          <Insignia tone={e.tone}>{e.label}</Insignia>
                        </Td>
                      </FilaEnlace>
                    );
                  })}
                </tbody>
              </Tabla>
            </section>
          )}
        </>
      )}
    </div>
  );
}
