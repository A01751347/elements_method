import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { arcoRequests } from "@/shared/db/schema/privacy";
import {
  FichaHeader,
  Insignia,
  Etiqueta,
  DatoLista,
  Select,
  Textarea,
  Boton,
  Banner,
} from "../../_components/ui";
import { BotonPendiente, ConfirmarAccion } from "../../_components/client";
import { ARCO_STATUS, ARCO_RIGHT, estado } from "../../_lib/status";
import { fechaHora, fechaCompleta } from "../../_lib/format";
import {
  ARCO_OPEN_STATUSES,
  ARCO_RELATION_LABEL,
  ARCO_EXECUTION_BUSINESS_DAYS,
  ARCO_IDENTITY_BUSINESS_DAYS,
  addBusinessDays,
  businessDaysUntil,
  type ArcoRelation,
  type ArcoStatus,
} from "@/data/arco";
import {
  actualizarSeguimiento,
  solicitarIdentificacion,
  marcarIdentidadVerificada,
  responderTitular,
} from "../actions";

export const dynamic = "force-dynamic";

async function loadRequest(id: string) {
  try {
    const rows = await db.select().from(arcoRequests).where(eq(arcoRequests.id, id)).limit(1);
    return rows[0] ?? null;
  } catch {
    // Un id que no es UUID hace fallar la consulta: se trata como no encontrado.
    return null;
  }
}

export default async function AdminArcoFichaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const r = await loadRequest(id);
  if (!r) notFound();

  const est = estado(ARCO_STATUS, r.status);
  const der = estado(ARCO_RIGHT, r.right);
  const abierta = ARCO_OPEN_STATUSES.includes(r.status as ArcoStatus);
  const dias = businessDaysUntil(r.responseDueAt);
  const relacion = r.relation
    ? (ARCO_RELATION_LABEL[r.relation as ArcoRelation]?.es ?? r.relation)
    : "—";
  const ejecutarAntesDe =
    r.status === "resuelta" && r.respondedAt
      ? addBusinessDays(r.respondedAt, ARCO_EXECUTION_BUSINESS_DAYS)
      : null;
  const asuntoCorreo = encodeURIComponent(`Elements Method · Solicitud ${r.folio}`);

  const plazoTexto = !abierta
    ? "Cerrada"
    : dias < 0
      ? `Vencida hace ${-dias} d.h.`
      : dias === 0
        ? "Vence hoy"
        : `${dias} d.h. restantes`;

  return (
    <>
      <FichaHeader
        back={{ href: "/admin/arco", label: "Derechos ARCO" }}
        kicker={`Solicitud ARCO · ${der.label}`}
        title={r.fullName}
        badge={<Insignia tone={est.tone}>{est.label}</Insignia>}
        meta={`${r.folio} · recibida ${fechaHora(r.receivedAt)} · ${r.locale}`}
        aside={{ label: "Responder antes de", value: `${fechaCompleta(r.responseDueAt)} · ${plazoTexto}` }}
      />

      <div className="ficha-columnas">
        <div className="flex flex-col gap-8">
          {abierta && dias < 0 && (
            <Banner tone="error">
              El plazo legal de {`20`} días hábiles ya venció. Responde hoy mismo y documenta el motivo del retraso.
            </Banner>
          )}
          {abierta && dias >= 0 && dias <= 5 && (
            <Banner tone="aviso">Quedan {dias} día(s) hábil(es) para responder al titular.</Banner>
          )}
          {r.status === "identidad_pendiente" && (
            <Banner tone="info">
              Se pidió identificación el {fechaHora(r.identityRequestedAt)}. El titular tiene{" "}
              {ARCO_IDENTITY_BUSINESS_DAYS} días hábiles para enviarla; mientras tanto el plazo legal está
              suspendido. Si no llega, la solicitud se tiene por no presentada (márcala como improcedente
              explicándolo).
            </Banner>
          )}

          <div>
            <Etiqueta as="h2">Titular</Etiqueta>
            <div className="mt-3">
              <DatoLista
                columns={3}
                items={[
                  { label: "Correo", value: <a href={`mailto:${r.email}`}>{r.email}</a> },
                  { label: "Teléfono", value: r.phone || "—" },
                  { label: "Relación", value: relacion },
                  {
                    label: "Representante",
                    value: r.isRepresentative ? `Sí · titular: ${r.titularName ?? "—"}` : "No",
                  },
                  { label: "Idioma", value: r.locale },
                  { label: "Aviso aceptado", value: fechaHora(r.privacyAcceptedAt) },
                ]}
              />
            </div>
          </div>

          <div>
            <Etiqueta as="h2">Solicitud</Etiqueta>
            <div className="mt-3 renglon-destacado">
              <p style={{ whiteSpace: "pre-wrap" }}>{r.description}</p>
            </div>
          </div>

          <div>
            <Etiqueta as="h2">Plazos</Etiqueta>
            <div className="mt-3">
              <DatoLista
                columns={2}
                items={[
                  { label: "Recibida", value: fechaCompleta(r.receivedAt) },
                  { label: "Responder antes de (20 d.h.)", value: fechaCompleta(r.responseDueAt) },
                  { label: "Identificación solicitada", value: fechaHora(r.identityRequestedAt) },
                  { label: "Identidad acreditada", value: fechaHora(r.identityVerifiedAt) },
                  { label: "Respondida", value: fechaHora(r.respondedAt) },
                  {
                    label: "Hacer efectiva antes de (15 d.h.)",
                    value: ejecutarAntesDe ? fechaCompleta(ejecutarAntesDe) : "—",
                  },
                ]}
              />
            </div>
          </div>

          {r.resolution && (
            <div>
              <Etiqueta as="h2">Respuesta enviada al titular</Etiqueta>
              <div className="mt-3 renglon-destacado">
                <p style={{ whiteSpace: "pre-wrap" }}>{r.resolution}</p>
              </div>
            </div>
          )}
        </div>

        <div className="ficha-trabajo">
          <div>
            <Etiqueta as="h2">Seguimiento</Etiqueta>
            <form action={actualizarSeguimiento.bind(null, r.id)} className="flex flex-col gap-4 mt-3">
              <div className="campo">
                <label className="etiqueta" htmlFor="status">
                  Estado
                </label>
                <Select id="status" name="status" defaultValue={r.status}>
                  {Object.entries(ARCO_STATUS).map(([value, s]) => (
                    <option key={value} value={value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="campo">
                <label className="etiqueta" htmlFor="notes">
                  Notas
                </label>
                <Textarea
                  id="notes"
                  name="notes"
                  rows={5}
                  defaultValue={r.notes ?? ""}
                  placeholder="Qué se revisó, dónde estaban los datos, qué se hizo…"
                />
                <p className="pista">Solo lo ve el equipo. Sirve como bitácora ante la autoridad.</p>
              </div>
              <BotonPendiente pendingLabel="Guardando…">Guardar seguimiento</BotonPendiente>
            </form>
          </div>

          <div>
            <Etiqueta as="h2">Identidad</Etiqueta>
            <p className="pista" style={{ marginBottom: 12 }}>
              La ley obliga a acreditar la identidad del titular antes de atender el fondo.
            </p>
            <div className="flex flex-wrap gap-2">
              {!r.identityVerifiedAt && (
                <ConfirmarAccion
                  trigger="Pedir identificación"
                  title="Pedir identificación al titular"
                  body={`Se envía un correo a ${r.email} pidiendo una identificación oficial. La solicitud pasa a «identidad pendiente» y el plazo legal queda suspendido hasta que responda.`}
                  confirmLabel="Sí, enviar correo"
                  pendingLabel="Enviando…"
                  action={solicitarIdentificacion}
                  hidden={[{ name: "id", value: r.id }]}
                />
              )}
              {!r.identityVerifiedAt && (
                <ConfirmarAccion
                  trigger="Marcar identidad acreditada"
                  title="Identidad acreditada"
                  body="Confirma que recibiste y revisaste la identificación oficial del titular (y, si aplica, el documento de representación). La solicitud pasa a «en proceso»."
                  confirmLabel="Sí, acreditada"
                  pendingLabel="Guardando…"
                  action={marcarIdentidadVerificada}
                  hidden={[{ name: "id", value: r.id }]}
                />
              )}
              {r.identityVerifiedAt && (
                <Insignia tone="ok">Acreditada el {fechaHora(r.identityVerifiedAt)}</Insignia>
              )}
            </div>
          </div>

          {abierta && (
            <div>
              <Etiqueta as="h2">Responder al titular</Etiqueta>
              <form action={responderTitular.bind(null, r.id)} className="flex flex-col gap-4 mt-3">
                <div className="campo">
                  <label className="etiqueta" htmlFor="sentido">
                    Sentido de la respuesta
                  </label>
                  <Select id="sentido" name="sentido" defaultValue="resuelta">
                    <option value="resuelta">Procedente · se atiende la solicitud</option>
                    <option value="rechazada">Improcedente · se explica el motivo</option>
                  </Select>
                </div>
                <div className="campo">
                  <label className="etiqueta" htmlFor="resolution">
                    Respuesta
                  </label>
                  <Textarea
                    id="resolution"
                    name="resolution"
                    rows={8}
                    required
                    minLength={10}
                    placeholder="Qué datos se encontraron, qué se hizo (o por qué no procede) y cómo se hará efectivo…"
                  />
                  <p className="pista">
                    Se envía por correo al titular tal cual, con el folio y, si procede, la fecha límite de
                    ejecución ({ARCO_EXECUTION_BUSINESS_DAYS} d.h.). Cierra la solicitud.
                  </p>
                </div>
                <BotonPendiente pendingLabel="Enviando…">Enviar respuesta y cerrar</BotonPendiente>
              </form>
            </div>
          )}

          <div>
            <Etiqueta as="h2">Contactar</Etiqueta>
            <div className="flex flex-wrap gap-2 mt-3">
              <Boton tone="secundario" href={`mailto:${r.email}?subject=${asuntoCorreo}`}>
                Escribir correo ✉
              </Boton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
