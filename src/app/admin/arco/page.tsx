import { and, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { arcoRequests, type ArcoRequest } from "@/shared/db/schema/privacy";
import { safeRead } from "@/modules/content/safe";
import {
  PageHeader,
  Cifra,
  CifraGrid,
  Filtros,
  Conteo,
  Tabla,
  Th,
  Td,
  FilaEnlace,
  EnlaceFila,
  Insignia,
  EstadoVacio,
  Input,
  Boton,
  Banner,
} from "../_components/ui";
import { ARCO_STATUS, ARCO_RIGHT, estado, type Tono } from "../_lib/status";
import { fechaCorta } from "../_lib/format";
import {
  ARCO_OPEN_STATUSES,
  ARCO_RESPONSE_BUSINESS_DAYS,
  businessDaysUntil,
  type ArcoStatus,
} from "@/data/arco";

export const dynamic = "force-dynamic";

const ABIERTAS = [...ARCO_OPEN_STATUSES];

const FILTROS_ESTADO = [
  { value: "", label: "Todas" },
  { value: "abiertas", label: "Abiertas" },
  ...Object.entries(ARCO_STATUS).map(([value, s]) => ({ value, label: s.label })),
];

const FILTROS_DERECHO = [
  { value: "", label: "Todos los derechos" },
  ...Object.entries(ARCO_RIGHT).map(([value, s]) => ({ value, label: s.label })),
];

const esAbierta = (r: ArcoRequest) => ABIERTAS.includes(r.status as ArcoStatus);

/** Días hábiles que quedan (o que pasaron) para responder; solo si sigue abierta. */
function plazo(r: ArcoRequest): { label: string; tone: Tono } | null {
  if (!esAbierta(r)) return null;
  const n = businessDaysUntil(r.responseDueAt);
  if (n < 0) return { label: `Vencida hace ${-n} d.h.`, tone: "peligro" };
  if (n === 0) return { label: "Vence hoy", tone: "peligro" };
  if (n <= 5) return { label: `${n} d.h.`, tone: "alerta" };
  return { label: `${n} d.h.`, tone: "neutra" };
}

async function loadRequests(estadoFiltro: string, derechoFiltro: string, q: string) {
  return safeRead([] as ArcoRequest[], async () => {
    const condiciones = [
      estadoFiltro === "abiertas"
        ? inArray(arcoRequests.status, ABIERTAS)
        : estadoFiltro
          ? eq(arcoRequests.status, estadoFiltro)
          : undefined,
      derechoFiltro ? eq(arcoRequests.right, derechoFiltro) : undefined,
      q
        ? or(
            ilike(arcoRequests.folio, `%${q}%`),
            ilike(arcoRequests.fullName, `%${q}%`),
            ilike(arcoRequests.email, `%${q}%`),
          )
        : undefined,
    ].filter((c): c is NonNullable<typeof c> => Boolean(c));

    return db
      .select()
      .from(arcoRequests)
      .where(condiciones.length > 0 ? and(...condiciones) : undefined)
      .orderBy(desc(arcoRequests.receivedAt))
      .limit(200);
  });
}

async function loadCounts() {
  return safeRead({ abiertas: 0, porVencer: 0, vencidas: 0, resueltas: 0 }, async () => {
    const rows = await db.select().from(arcoRequests).limit(2000);
    const abiertas = rows.filter(esAbierta);
    const dias = (r: ArcoRequest) => businessDaysUntil(r.responseDueAt);
    return {
      abiertas: abiertas.length,
      porVencer: abiertas.filter((r) => dias(r) >= 0 && dias(r) <= 5).length,
      vencidas: abiertas.filter((r) => dias(r) < 0).length,
      resueltas: rows.filter((r) => r.status === "resuelta" || r.status === "rechazada").length,
    };
  });
}

export default async function AdminArcoPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; derecho?: string; q?: string }>;
}) {
  const { estado: estadoFiltro = "", derecho: derechoFiltro = "", q = "" } = await searchParams;

  const [lista, counts] = await Promise.all([
    loadRequests(estadoFiltro, derechoFiltro, q),
    loadCounts(),
  ]);

  const qs = (overrides: { estado?: string; derecho?: string }) => {
    const params = new URLSearchParams();
    const e = overrides.estado ?? estadoFiltro;
    const d = overrides.derecho ?? derechoFiltro;
    if (e) params.set("estado", e);
    if (d) params.set("derecho", d);
    if (q) params.set("q", q);
    const s = params.toString();
    return s ? `/admin/arco?${s}` : "/admin/arco";
  };

  return (
    <>
      <PageHeader
        title="Derechos ARCO"
        subtitle="Solicitudes de acceso, rectificación, cancelación, oposición y revocación recibidas desde el sitio. Cada fila abre la ficha."
      />

      {counts.vencidas > 0 ? (
        <Banner tone="error">
          Hay {counts.vencidas} solicitud(es) con el plazo legal de respuesta vencido. Responder fuera de plazo
          expone a la empresa a sanciones; atiéndelas primero.
        </Banner>
      ) : (
        <Banner tone="info">
          La ley da {ARCO_RESPONSE_BUSINESS_DAYS} días hábiles para responder cada solicitud y 15 más para
          hacerla efectiva. Antes de atender el fondo hay que acreditar la identidad del titular.
        </Banner>
      )}

      <CifraGrid>
        <Cifra label="Abiertas" value={counts.abiertas} tone="alerta" note="Con plazo corriendo" />
        <Cifra label="Vencen en ≤ 5 d.h." value={counts.porVencer} tone="acento" note="Atender esta semana" />
        <Cifra label="Vencidas" value={counts.vencidas} tone={counts.vencidas > 0 ? "alerta" : "ok"} note="Fuera de plazo legal" />
        <Cifra label="Cerradas" value={counts.resueltas} note="Resueltas o improcedentes" />
      </CifraGrid>

      <div className="flex flex-col gap-3 mt-8 mb-2">
        <Filtros
          items={FILTROS_ESTADO.map((f) => ({
            href: qs({ estado: f.value }),
            label: f.label,
            active: estadoFiltro === f.value,
          }))}
        />
        <Filtros
          items={FILTROS_DERECHO.map((f) => ({
            href: qs({ derecho: f.value }),
            label: f.label,
            active: derechoFiltro === f.value,
          }))}
        />
        <form action="/admin/arco" method="get" className="flex gap-2" style={{ maxWidth: 420 }}>
          {estadoFiltro && <input type="hidden" name="estado" value={estadoFiltro} />}
          {derechoFiltro && <input type="hidden" name="derecho" value={derechoFiltro} />}
          <Input type="search" name="q" defaultValue={q} placeholder="Folio, nombre o correo…" />
          <Boton tone="secundario" type="submit">
            Buscar
          </Boton>
        </form>
      </div>

      <div className="mb-4">
        <Conteo n={lista.length} singular="solicitud encontrada" plural="solicitudes encontradas" />
      </div>

      {lista.length === 0 ? (
        <EstadoVacio
          title="Todavía no hay solicitudes ARCO."
          body="Cuando alguien ejerza un derecho desde /privacidad/arco (o desde los botones del aviso de privacidad), aparecerá aquí con su folio y su plazo legal."
        />
      ) : (
        <Tabla>
          <thead>
            <tr>
              <Th>Folio</Th>
              <Th>Recibida</Th>
              <Th>Titular</Th>
              <Th>Derecho</Th>
              <Th>Estado</Th>
              <Th>Vence</Th>
            </tr>
          </thead>
          <tbody>
            {lista.map((r) => {
              const est = estado(ARCO_STATUS, r.status);
              const der = estado(ARCO_RIGHT, r.right);
              const p = plazo(r);
              return (
                <FilaEnlace key={r.id}>
                  <Td style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: 12 }}>
                    <EnlaceFila href={`/admin/arco/${r.id}`}>{r.folio}</EnlaceFila>
                  </Td>
                  <Td>{fechaCorta(r.receivedAt)}</Td>
                  <Td>
                    {r.fullName}
                    <div className="celda-secundaria">
                      <a href={`mailto:${r.email}`} className="sobre-fila">
                        {r.email}
                      </a>
                    </div>
                  </Td>
                  <Td>
                    <Insignia tone={der.tone}>{der.label}</Insignia>
                  </Td>
                  <Td>
                    <Insignia tone={est.tone}>{est.label}</Insignia>
                  </Td>
                  <Td>
                    {p ? (
                      <>
                        {fechaCorta(r.responseDueAt)}{" "}
                        <Insignia tone={p.tone}>{p.label}</Insignia>
                      </>
                    ) : (
                      "—"
                    )}
                  </Td>
                </FilaEnlace>
              );
            })}
          </tbody>
        </Tabla>
      )}
    </>
  );
}
