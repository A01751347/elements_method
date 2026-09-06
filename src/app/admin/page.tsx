import Link from "next/link";
import { asc, count, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/shared/db/client";
import {
  orders,
  enterpriseQuotes,
  inscriptions,
  blogComments,
  testimonials,
  calendarRetreats,
  arcoRequests,
} from "@/shared/db/schema";
import { getBankDetails } from "@/shared/payments/bank";
import { getTrackingConfig } from "@/shared/integrations/siteConfig";
import {
  PageHeader,
  SeccionEtiqueta,
  CifraGrid,
  Cifra,
  Tabla,
  Th,
  Td,
  FilaEnlace,
  EnlaceFila,
  Insignia,
  EstadoVacio,
  Banner,
  Boton,
} from "./_components/ui";
import { IconoFlecha, IconoAviso } from "./_components/icons";
import { mxn, fechaCompleta, fechaCorta, fechaIso } from "./_lib/format";
import { ORDER_STATUS, RETREAT_STATUS, estado } from "./_lib/status";

export const dynamic = "force-dynamic";

interface Resumen {
  revenueMonth: number;
  revenueYear: number;
  revenueAll: number;
  paidOrders: number;
  pendingPayment: number;
  pendingTransfer: number;
  inscriptionsMonth: number;
  inscriptionsTotal: number;
  inscriptionsNew: number;
  arcoOpen: number;
  quotesNew: number;
  quotesTotal: number;
  commentsPending: number;
  testimonialsPending: number;
}

const RESUMEN_VACIO: Resumen = {
  revenueMonth: 0,
  revenueYear: 0,
  revenueAll: 0,
  paidOrders: 0,
  pendingPayment: 0,
  pendingTransfer: 0,
  inscriptionsMonth: 0,
  inscriptionsTotal: 0,
  inscriptionsNew: 0,
  arcoOpen: 0,
  quotesNew: 0,
  quotesTotal: 0,
  commentsPending: 0,
  testimonialsPending: 0,
};

/** KPIs y colas del día. Todo en un solo try/catch: si la DB falla, todo degrada a 0. */
async function loadResumen(): Promise<Resumen> {
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);
  const inicioAnio = new Date(inicioMes.getFullYear(), 0, 1);

  try {
    const [
      mesAgg,
      anioAgg,
      totalAgg,
      pagadasAgg,
      pendientePagoAgg,
      pendienteTransferAgg,
      inscripcionesMesAgg,
      inscripcionesTotalAgg,
      inscripcionesNuevasAgg,
      cotizacionesNuevasAgg,
      cotizacionesTotalAgg,
      comentariosAgg,
      testimonialesAgg,
      arcoAbiertasAgg,
    ] = await Promise.all([
      db
        .select({ sum: sql<string>`COALESCE(SUM(${orders.total}), 0)` })
        .from(orders)
        .where(sql`${orders.status} = 'paid' AND ${orders.paidAt} >= ${inicioMes}`),
      db
        .select({ sum: sql<string>`COALESCE(SUM(${orders.total}), 0)` })
        .from(orders)
        .where(sql`${orders.status} = 'paid' AND ${orders.paidAt} >= ${inicioAnio}`),
      db
        .select({ sum: sql<string>`COALESCE(SUM(${orders.total}), 0)` })
        .from(orders)
        .where(eq(orders.status, "paid")),
      db.select({ n: count() }).from(orders).where(eq(orders.status, "paid")),
      db.select({ n: count() }).from(orders).where(eq(orders.status, "pending_payment")),
      db.select({ n: count() }).from(orders).where(eq(orders.status, "pending_transfer_validation")),
      db.select({ n: count() }).from(inscriptions).where(gte(inscriptions.createdAt, inicioMes)),
      db.select({ n: count() }).from(inscriptions),
      db.select({ n: count() }).from(inscriptions).where(eq(inscriptions.status, "new")),
      db.select({ n: count() }).from(enterpriseQuotes).where(eq(enterpriseQuotes.status, "nueva")),
      db.select({ n: count() }).from(enterpriseQuotes),
      db.select({ n: count() }).from(blogComments).where(eq(blogComments.status, "pending")),
      db.select({ n: count() }).from(testimonials).where(eq(testimonials.approvedByAdmin, false)),
      db
        .select({ n: count() })
        .from(arcoRequests)
        .where(inArray(arcoRequests.status, ["nueva", "identidad_pendiente", "en_proceso"])),
    ]);

    return {
      revenueMonth: Number(mesAgg[0]?.sum ?? 0),
      revenueYear: Number(anioAgg[0]?.sum ?? 0),
      revenueAll: Number(totalAgg[0]?.sum ?? 0),
      paidOrders: pagadasAgg[0]?.n ?? 0,
      pendingPayment: pendientePagoAgg[0]?.n ?? 0,
      pendingTransfer: pendienteTransferAgg[0]?.n ?? 0,
      inscriptionsMonth: inscripcionesMesAgg[0]?.n ?? 0,
      inscriptionsTotal: inscripcionesTotalAgg[0]?.n ?? 0,
      inscriptionsNew: inscripcionesNuevasAgg[0]?.n ?? 0,
      quotesNew: cotizacionesNuevasAgg[0]?.n ?? 0,
      quotesTotal: cotizacionesTotalAgg[0]?.n ?? 0,
      commentsPending: comentariosAgg[0]?.n ?? 0,
      testimonialsPending: testimonialesAgg[0]?.n ?? 0,
      arcoOpen: arcoAbiertasAgg[0]?.n ?? 0,
    };
  } catch (e) {
    console.error("[admin/resumen] carga de KPIs fallida", e);
    return RESUMEN_VACIO;
  }
}

async function loadOrdenesPorAtender() {
  try {
    return await db
      .select()
      .from(orders)
      .where(
        inArray(orders.status, [
          "pending_documents",
          "pending_payment",
          "pending_transfer_validation",
        ]),
      )
      .orderBy(desc(orders.createdAt))
      .limit(6);
  } catch (e) {
    console.error("[admin/resumen] órdenes por atender fallida", e);
    return [];
  }
}

async function loadProximosRetiros() {
  try {
    const hoy = fechaIso(new Date());
    return await db
      .select()
      .from(calendarRetreats)
      .where(gte(calendarRetreats.startDate, hoy))
      .orderBy(asc(calendarRetreats.startDate))
      .limit(5);
  } catch (e) {
    console.error("[admin/resumen] próximos retiros fallida", e);
    return [];
  }
}

interface Prioridad {
  key: string;
  n: number;
  titulo: string;
  detalle: string;
  href: string;
  urgente?: boolean;
}

export default async function AdminResumenPage() {
  const [resumen, ordenes, retiros] = await Promise.all([
    loadResumen(),
    loadOrdenesPorAtender(),
    loadProximosRetiros(),
  ]);

  const banco = getBankDetails();
  const tieneStripe = Boolean(process.env.STRIPE_SECRET_KEY?.trim());
  const tracking = await getTrackingConfig();
  const tieneTracking = Object.values(tracking).some((v) => v.length > 0);
  const hayBanners = !banco.configured || !tieneStripe || !tieneTracking;

  const candidatas: Prioridad[] = [
    {
      key: "transferencias",
      n: resumen.pendingTransfer,
      titulo: `Validar ${resumen.pendingTransfer} comprobante(s) de transferencia`,
      detalle: "El dinero puede estar en el banco; confírmalo y el comprador recibe su comprobante.",
      href: "/admin/transferencias",
      urgente: true,
    },
    {
      key: "arco",
      n: resumen.arcoOpen,
      titulo: `Atender ${resumen.arcoOpen} solicitud(es) de derechos ARCO`,
      detalle: "Tienen plazo legal de 20 días hábiles; primero acredita la identidad del titular y luego responde.",
      href: "/admin/arco?estado=abiertas",
      urgente: true,
    },
    {
      key: "inscripciones",
      n: resumen.inscriptionsNew,
      titulo: `Contactar ${resumen.inscriptionsNew} inscripción(es) nueva(s)`,
      detalle: "Llegaron por los formularios públicos de aplicar o contacto; contáctalas antes de que se enfríen.",
      href: "/admin/inscripciones?estado=new",
    },
    {
      key: "cotizaciones",
      n: resumen.quotesNew,
      titulo: `Dar seguimiento a ${resumen.quotesNew} cotización(es)`,
      detalle: "Empresas que usaron la calculadora pública y esperan una respuesta.",
      href: "/admin/empresas?estado=nueva",
    },
    {
      key: "comentarios",
      n: resumen.commentsPending,
      titulo: `Moderar ${resumen.commentsPending} comentario(s)`,
      detalle: "Están esperando aprobación antes de mostrarse en el blog.",
      href: "/admin/comentarios",
    },
    {
      key: "testimoniales",
      n: resumen.testimonialsPending,
      titulo: `Revisar ${resumen.testimonialsPending} testimonial(es)`,
      detalle: "No aparecen en el sitio público hasta que los apruebes.",
      href: "/admin/testimoniales?estado=por-aprobar",
    },
  ];
  const prioridades = candidatas.filter((p) => p.n > 0).slice(0, 4);

  return (
    <div className="flex flex-col gap-10">
      <PageHeader title="Resumen del día" subtitle={fechaCompleta(new Date())} />

      <CifraGrid>
        <Cifra
          label="Ingresos del mes"
          value={mxn(resumen.revenueMonth)}
          tone="ok"
          note={`Este año: ${mxn(resumen.revenueYear)} · histórico ${mxn(resumen.revenueAll)}`}
        />
        <Cifra
          label="Órdenes pagadas"
          value={resumen.paidOrders}
          note={`${resumen.pendingPayment + resumen.pendingTransfer} pendientes de pago o validación`}
          href="/admin/pagos"
        />
        <Cifra
          label="Inscripciones nuevas"
          value={resumen.inscriptionsMonth}
          tone={resumen.inscriptionsMonth > 0 ? "alerta" : "neutro"}
          note={`${resumen.inscriptionsTotal} en total`}
          href="/admin/inscripciones"
        />
        <Cifra
          label="Cotizaciones nuevas"
          value={resumen.quotesNew}
          note={`${resumen.quotesTotal} cotizaciones en total`}
          href="/admin/empresas"
        />
      </CifraGrid>

      <section className="flex flex-col gap-3">
        <SeccionEtiqueta>Tu siguiente paso</SeccionEtiqueta>
        {prioridades.length === 0 ? (
          <EstadoVacio
            title="Nada pendiente por hoy."
            body="Las colas de transferencias, inscripciones, cotizaciones, comentarios y testimoniales están al día."
          />
        ) : (
          <div className="flex flex-col">
            {prioridades.map((p) => (
              <Link
                key={p.key}
                href={p.href}
                className="detalle flex items-center gap-3"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span
                  aria-hidden="true"
                  className="flex items-center justify-center shrink-0"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "var(--radio)",
                    background: "var(--acento-suave)",
                    color: "var(--acento-tinta)",
                  }}
                >
                  {p.urgente ? <IconoAviso size={18} /> : <IconoFlecha size={18} />}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block" style={{ fontSize: 14, fontWeight: 600 }}>
                    {p.titulo}
                  </span>
                  <span className="celda-secundaria texto-tenue">{p.detalle}</span>
                </span>
                <span aria-hidden="true" className="texto-sutil texto-13">
                  →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {hayBanners && (
        <div className="flex flex-col gap-3">
          {!banco.configured && (
            <Banner tone="aviso">
              Los datos bancarios (BANK_*) no están configurados: las órdenes por transferencia no muestran la
              CLABE al comprador.
            </Banner>
          )}
          {!tieneStripe && (
            <Banner tone="aviso">
              Stripe no tiene llaves configuradas: el checkout con tarjeta no puede cobrar.
            </Banner>
          )}
          {!tieneTracking && (
            <Banner tone="info">
              No hay pixeles de analítica configurados. <Link href="/admin/analytics">Ajusta Analytics →</Link>
            </Banner>
          )}
        </div>
      )}

      <section className="flex flex-col gap-3">
        <SeccionEtiqueta action={<Boton tone="texto" href="/admin/pagos">Ver todas →</Boton>}>
          Órdenes por atender
        </SeccionEtiqueta>
        {ordenes.length === 0 ? (
          <EstadoVacio title="Ninguna orden espera atención." />
        ) : (
          <Tabla>
            <thead>
              <tr>
                <Th>Folio</Th>
                <Th>Fecha</Th>
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
                    <Td secondary>{fechaCorta(o.createdAt)}</Td>
                    <Td>{o.buyerName}</Td>
                    <Td numeric>{mxn(o.total)}</Td>
                    <Td>
                      <Insignia tone={e.tone}>{e.label}</Insignia>
                    </Td>
                  </FilaEnlace>
                );
              })}
            </tbody>
          </Tabla>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <SeccionEtiqueta action={<Boton tone="texto" href="/admin/retiros">Ver calendario →</Boton>}>
          Próximos retiros
        </SeccionEtiqueta>
        {retiros.length === 0 ? (
          <EstadoVacio
            title="No hay retiros próximos en el calendario."
            action={<Boton tone="secundario" href="/admin/retiros/nuevo">+ Nuevo retiro</Boton>}
          />
        ) : (
          <Tabla>
            <thead>
              <tr>
                <Th>Retiro</Th>
                <Th>Fecha</Th>
                <Th>Sede</Th>
                <Th align="right">Cupo</Th>
                <Th>Estado</Th>
              </tr>
            </thead>
            <tbody>
              {retiros.map((r) => {
                const e = estado(RETREAT_STATUS, r.status);
                return (
                  <FilaEnlace key={r.id}>
                    <Td>
                      <EnlaceFila href={`/admin/retiros/${r.slug}`}>{r.themeEs}</EnlaceFila>
                    </Td>
                    <Td secondary>{r.dateLabelEs}</Td>
                    <Td>{r.venueLabelEs}</Td>
                    <Td numeric>
                      {r.seatsLeft}/{r.capacity}
                    </Td>
                    <Td>
                      <Insignia tone={e.tone}>{e.label}</Insignia>
                    </Td>
                  </FilaEnlace>
                );
              })}
            </tbody>
          </Tabla>
        )}
      </section>

      <p className="pista">
        <a href="https://analytics.google.com/" target="_blank" rel="noreferrer">
          Analytics en Google ↗
        </a>
      </p>
    </div>
  );
}
