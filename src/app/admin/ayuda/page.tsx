import type { ReactNode } from "react";
import {
  PageHeader,
  SeccionEtiqueta,
  Etiqueta,
  Tarjeta,
  Insignia,
  Boton,
  Banner,
  Cifra,
  CifraGrid,
  Tabla,
  Th,
  Td,
  FilaEnlace,
  EnlaceFila,
  Filtros,
  Conteo,
  Paginacion,
  EstadoVacio,
  Campo,
  Input,
  Select,
  Textarea,
  Checkbox,
  Detalle,
  DatoLista,
  PasoGuiado,
  AntesDeConfirmar,
} from "../_components/ui";
import { BotonPendiente, ConfirmarAccion } from "../_components/client";
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  INSCRIPTION_STATUS,
  INSCRIPTION_SOURCE,
  QUOTE_STATUS,
  RETREAT_STATUS,
  VENUE_STATE_ADMIN,
  VENUE_STATE,
  PROVIDER_STATUS,
  COMMENT_STATUS,
  BLOG_STATUS,
  MAILCHIMP_STATUS,
  TOKEN_STATE,
  PRODUCT_TYPE,
  type Tono,
} from "../_lib/status";
import { mxn, fechaCorta, fechaLarga, fechaHora, hora, fechaCompleta, fechaIso } from "../_lib/format";

export const dynamic = "force-dynamic";

async function demoNoOp() {
  "use server";
  await new Promise((resolve) => setTimeout(resolve, 800));
}

export default function AyudaPage() {
  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        title="Ayuda"
        subtitle="Galería viva de los componentes del admin y glosario del oficio. Todo lo que ves aquí sale de las mismas primitivas que usa el resto del panel — no hay estilos aparte."
      />

      {/* ── COMPONENTES ─────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-10">
        <SeccionEtiqueta>Componentes</SeccionEtiqueta>

        <Tarjeta title="Etiqueta">
          <div className="flex flex-wrap gap-6">
            <Etiqueta>Tenue (por defecto)</Etiqueta>
            <Etiqueta tone="tinta">Tinta</Etiqueta>
            <Etiqueta tone="acento">Acento</Etiqueta>
            <Etiqueta tone="peligro">Peligro</Etiqueta>
          </div>
        </Tarjeta>

        <Tarjeta title="Insignias">
          <div className="flex flex-wrap gap-3">
            <Insignia tone="ok">Pagada</Insignia>
            <Insignia tone="alerta">Pendiente de pago</Insignia>
            <Insignia tone="acento">Comprobante enviado</Insignia>
            <Insignia tone="neutra">Reembolsada</Insignia>
            <Insignia tone="peligro">Cancelada</Insignia>
            <Insignia tone="invertida">Cerrada</Insignia>
            <Insignia tone="contorno">Stripe</Insignia>
            <Insignia tone="contador">3</Insignia>
          </div>
        </Tarjeta>

        <Tarjeta title="Botones">
          <div className="flex flex-wrap items-center gap-3">
            <Boton tone="primario">Guardar el retiro</Boton>
            <Boton tone="secundario">Cancelar</Boton>
            <Boton tone="peligro">Borrar</Boton>
            <Boton tone="texto">Ver todas →</Boton>
            <Boton tone="primario" className="boton-chico">
              Marcar pagada
            </Boton>
            <Boton tone="primario" disabled>
              Deshabilitado
            </Boton>
          </div>
          <p className="pista" style={{ marginTop: 16 }}>
            BotonPendiente (envía un formulario de verdad a un server action que espera 800ms):
          </p>
          <form action={demoNoOp} style={{ marginTop: 8 }}>
            <BotonPendiente pendingLabel="Guardando…">Guardar cambios</BotonPendiente>
          </form>
        </Tarjeta>

        <Tarjeta title="Banners">
          <div className="flex flex-col gap-3">
            <Banner tone="info">Los cambios se guardaron. El comprador recibe su comprobante por correo.</Banner>
            <Banner tone="aviso">Los datos bancarios no están configurados: las transferencias no pueden validarse.</Banner>
            <Banner tone="error">No pudimos completar la solicitud. Vuelve a intentar en un momento.</Banner>
          </div>
        </Tarjeta>

        <Tarjeta title="Cifras">
          <CifraGrid>
            <Cifra label="Ingresos del mes" value={mxn(184500)} note="12 órdenes pagadas en septiembre" />
            <Cifra label="Órdenes pagadas" value="12" note="3 pendientes de pago" tone="ok" />
            <Cifra label="Por validar" value="2" note="Comprobantes SPEI en espera" tone="alerta" />
            <Cifra label="Contactadas" value="6" note="En seguimiento" tone="acento" />
            <Cifra label="Ver órdenes" value="48" note="Historial completo" href="/admin/pagos" />
          </CifraGrid>
        </Tarjeta>

        <Tarjeta title="Tabla, fila-enlace, conteo y paginación">
          <div className="flex flex-col gap-4">
            <Conteo n={3} singular="orden encontrada" plural="órdenes encontradas" />
            <Tabla>
              <thead>
                <tr>
                  <Th>Folio</Th>
                  <Th>Comprador</Th>
                  <Th align="right">Total</Th>
                  <Th>Estado</Th>
                  <Th>Venta</Th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    folio: "EM-0926-0001",
                    nombre: "Ana Torres",
                    correo: "ana@ejemplo.com",
                    total: 8900,
                    estado: "ok" as const,
                    venta: { texto: "Abierta", clase: "texto-ok" },
                  },
                  {
                    folio: "EM-0926-0002",
                    nombre: "Luis Peña",
                    correo: "luis@ejemplo.com",
                    total: 5900,
                    estado: "alerta" as const,
                    venta: { texto: "Parcial", clase: "texto-alerta" },
                  },
                  {
                    folio: "EM-0926-0003",
                    nombre: "Marta Ruiz",
                    correo: "marta@ejemplo.com",
                    total: 12400,
                    estado: "acento" as const,
                    venta: { texto: "Cerrada", clase: "texto-tenue" },
                  },
                ].map((fila) => (
                  <FilaEnlace key={fila.folio}>
                    <Td>
                      <EnlaceFila href="/admin/ayuda">{fila.folio}</EnlaceFila>
                      <span className="celda-secundaria">{fila.correo}</span>
                    </Td>
                    <Td>{fila.nombre}</Td>
                    <Td numeric>{mxn(fila.total)}</Td>
                    <Td>
                      <Insignia tone={fila.estado}>
                        {fila.estado === "ok" ? "Pagada" : fila.estado === "alerta" ? "Pendiente de pago" : "Comprobante enviado"}
                      </Insignia>
                    </Td>
                    <Td>
                      <span className={`texto-12 ${fila.venta.clase}`}>{fila.venta.texto}</span>
                    </Td>
                  </FilaEnlace>
                ))}
              </tbody>
            </Tabla>
            <p className="pista">
              La celda «Comprador» usa <code>.celda-secundaria</code> para el correo bajo el nombre sin
              teñir la celda entera; la columna «Venta» usa <code>.texto-*</code> (texto de 12 px
              coloreado, sin insignia) como pide §6.7.
            </p>
            <Paginacion page={1} pages={4} hrefFor={(p) => `/admin/ayuda?pagina=${p}`} />
          </div>
        </Tarjeta>

        <Tarjeta title="Filtros y estado vacío">
          <div className="flex flex-col gap-4">
            <Filtros
              items={[
                { href: "/admin/ayuda", label: "Todas", active: true },
                { href: "/admin/ayuda", label: "Pagadas", count: 12 },
                { href: "/admin/ayuda", label: "Pendientes", count: 3 },
              ]}
            />
            <EstadoVacio
              title="Hoy no hay retiros programados."
              body="Cuando publiques uno desde “+ Nuevo retiro”, aparecerá aquí con su cupo y su fecha."
              action={<Boton tone="secundario">+ Nuevo retiro</Boton>}
            />
          </div>
        </Tarjeta>

        <Tarjeta title="Formulario">
          <div className="flex flex-col gap-4" style={{ maxWidth: 420 }}>
            <Campo label="Nombre del retiro" htmlFor="ayuda-nombre" required>
              <Input id="ayuda-nombre" name="nombre" placeholder="EQUINOX · Tepoztlán" />
            </Campo>
            <Campo label="Sede" htmlFor="ayuda-sede" hint="Puedes cambiarla después desde la ficha.">
              <Select id="ayuda-sede" name="sede" defaultValue="">
                <option value="" disabled>
                  Elige una sede
                </option>
                <option value="tepoztlan">Tepoztlán</option>
                <option value="valle">Valle de Bravo</option>
              </Select>
            </Campo>
            <Campo label="Notas internas" htmlFor="ayuda-notas">
              <Textarea id="ayuda-notas" name="notas" rows={3} placeholder="Solo lo ve el equipo…" />
            </Campo>
            <Checkbox name="activo" label="Publicar de inmediato en el calendario" defaultChecked />
            <label className="opcion-tarjeta flex items-start gap-3">
              <input type="radio" name="modalidad" defaultChecked />
              <span>
                <span className="opcion-tarjeta-titulo block">Presencial</span>
                <span className="opcion-tarjeta-explicacion block">El grupo viaja a la sede.</span>
              </span>
            </label>
            <div className="flex gap-2">
              <button type="button" className="chip" aria-pressed="true">
                Agua
              </button>
              <button type="button" className="chip" aria-pressed="false">
                Fuego
              </button>
              <button type="button" className="chip" aria-pressed="false">
                Tierra
              </button>
            </div>
          </div>
        </Tarjeta>

        <Tarjeta title="Detalle y lista de datos">
          <div className="flex flex-col gap-4">
            <Detalle summary="Documentos aceptados" open>
              <p>El comprador aceptó 2 de 2 documentos requeridos.</p>
            </Detalle>
            <Detalle summary="Historial de la orden">
              <p>Sin cambios de estado todavía.</p>
            </Detalle>
            <DatoLista
              items={[
                { label: "Comprador", value: "Ana Torres" },
                { label: "Correo", value: "ana@ejemplo.com" },
                { label: "Método", value: "Transferencia" },
              ]}
            />
            <p className="pista">
              <code>columns={"{1}"}</code> apila un solo valor por renglón — así se ve el bloque «Pago»
              de una ficha de orden:
            </p>
            <DatoLista
              columns={1}
              items={[
                { label: "Referencia SPEI", value: "MBAN01000012345678" },
                { label: "Comprobante", value: "comprobante-em-0926-0001.pdf" },
              ]}
            />
          </div>
        </Tarjeta>

        <Tarjeta title="Paso guiado y antes de confirmar">
          <PasoGuiado numero="01" pregunta="¿Cómo se llama el retiro?" hint="Aparece en el calendario público tal cual lo escribas.">
            <Input name="tema" placeholder="EQUINOX" />
          </PasoGuiado>
          <AntesDeConfirmar
            boton={
              <Boton tone="primario" type="submit">
                Crear retiro y publicarlo
              </Boton>
            }
          >
            El retiro queda visible en el calendario público de inmediato, con cupo abierto.
          </AntesDeConfirmar>
        </Tarjeta>

        <Tarjeta title="Confirmar acción (modal)">
          <div className="flex flex-wrap gap-3">
            <ConfirmarAccion
              trigger="Marcar como pagada"
              title="Marcar la orden como pagada"
              body="La orden queda pagada y el comprador recibe su comprobante por correo."
              confirmLabel="Sí, marcar pagada"
              pendingLabel="Guardando…"
              action={demoNoOp}
              tone="tinta"
            />
            <ConfirmarAccion
              trigger="Cancelar la orden"
              title="Cancelar esta orden"
              body="La orden pasa a «cancelada» y libera el cupo. Esta acción no se puede deshacer."
              confirmLabel="Sí, cancelar el pago"
              pendingLabel="Cancelando…"
              action={demoNoOp}
              tone="peligro"
              size="chico"
            />
          </div>
        </Tarjeta>
      </section>

      {/* ── ESTADOS ─────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-6">
        <SeccionEtiqueta>Estados</SeccionEtiqueta>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <TablaEstados titulo="Orden (orders.status)" mapa={ORDER_STATUS} />
          <TablaEstados titulo="Método de pago (orders.paymentMethod)" mapa={PAYMENT_METHOD} />
          <TablaEstados titulo="Inscripción (inscriptions.status)" mapa={INSCRIPTION_STATUS} />
          <TablaEstados titulo="Origen de inscripción (inscriptions.source)" mapa={INSCRIPTION_SOURCE} />
          <TablaEstados titulo="Cotización (enterprise_quotes.status)" mapa={QUOTE_STATUS} />
          <TablaEstados titulo="Retiro (calendar_retreats.status)" mapa={RETREAT_STATUS} />
          <TablaEstados titulo="Sede — admin (venues.state)" mapa={VENUE_STATE_ADMIN} />
          <TablaEstados titulo="Sede — calendario público (calendar_retreats.venueState)" mapa={VENUE_STATE} />
          <TablaEstados titulo="Proveedor (providers.status)" mapa={PROVIDER_STATUS} />
          <TablaEstados titulo="Comentario (blog_comments.status)" mapa={COMMENT_STATUS} />
          <TablaEstados titulo="Blog (blog_posts.status)" mapa={BLOG_STATUS} />
          <TablaEstados titulo="Mailchimp (subscribers.mailchimpStatus)" mapa={MAILCHIMP_STATUS} />
          <TablaEstados titulo="Token de formulario (calculado)" mapa={TOKEN_STATE} />
          <TablaEstados titulo="Tipo de producto (products.type)" mapa={PRODUCT_TYPE} />
        </div>
      </section>

      {/* ── GLOSARIO ────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <SeccionEtiqueta>Glosario</SeccionEtiqueta>
        <DatoLista
          columns={2}
          items={[
            { label: "Folio", value: "Código único de una orden (EM-0926-0001) o una cotización (EMQ-…)." },
            { label: "Orden", value: "El registro de una compra: uno o más productos, un comprador, un estado de pago." },
            { label: "Comprobante", value: "El archivo o la validación manual que confirma una transferencia SPEI." },
            { label: "Cotización", value: "La propuesta enviada a una empresa, calculada con la fórmula de calculator_config." },
            { label: "Inscripción", value: "Un lead que llega por los formularios públicos de Aplicar o Contacto." },
            { label: "Retiro", value: "Una edición programada de un retiro inmersivo, con fecha, sede y cupo." },
            { label: "Sede", value: "Una locación candidata o confirmada para alojar un retiro." },
            { label: "Proveedor", value: "Quien facilita una disciplina dentro de un retiro (yoga, respiración, caballos…)." },
            { label: "Plantilla", value: "El documento legal versionado que un comprador debe aceptar antes de pagar." },
            { label: "Token", value: "El enlace de un solo uso que abre un cuestionario para un comprador o inscrito." },
          ]}
        />
      </section>

      {/* ── FORMATOS ────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <SeccionEtiqueta>Formatos</SeccionEtiqueta>
        <Tabla>
          <thead>
            <tr>
              <Th>Función</Th>
              <Th>Salida de hoy</Th>
            </tr>
          </thead>
          <tbody>
            <FilaFormato nombre="mxn(3560)" salida={mxn(3560)} />
            <FilaFormato nombre="mxn(899.95)" salida={mxn(899.95)} />
            <FilaFormato nombre="fechaCorta(hoy)" salida={fechaCorta(new Date())} />
            <FilaFormato nombre="fechaLarga(hoy)" salida={fechaLarga(new Date())} />
            <FilaFormato nombre="fechaHora(hoy)" salida={fechaHora(new Date())} />
            <FilaFormato nombre="hora(hoy)" salida={hora(new Date())} />
            <FilaFormato nombre="fechaCompleta(hoy)" salida={fechaCompleta(new Date())} />
            <FilaFormato nombre="fechaIso(hoy)" salida={fechaIso(new Date())} />
          </tbody>
        </Tabla>
      </section>
    </div>
  );
}

function TablaEstados({ titulo, mapa }: { titulo: string; mapa: Record<string, { label: string; tone: Tono }> }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="etiqueta etiqueta-seccion">{titulo}</p>
      <Tabla>
        <thead>
          <tr>
            <Th>Clave</Th>
            <Th>Insignia</Th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(mapa).map(([clave, valor]) => (
            <tr key={clave}>
              <Td secondary>{clave}</Td>
              <Td>
                <Insignia tone={valor.tone}>{valor.label}</Insignia>
              </Td>
            </tr>
          ))}
        </tbody>
      </Tabla>
    </div>
  );
}

function FilaFormato({ nombre, salida }: { nombre: string; salida: ReactNode }) {
  return (
    <tr>
      <Td secondary>{nombre}</Td>
      <Td>{salida}</Td>
    </tr>
  );
}
