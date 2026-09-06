import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { inscriptions } from "@/shared/db/schema/operations";
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
} from "../_components/ui";
import { INSCRIPTION_STATUS, INSCRIPTION_SOURCE, estado } from "../_lib/status";
import { fechaCorta } from "../_lib/format";

export const dynamic = "force-dynamic";

const FILTROS_ESTADO = [
  { value: "", label: "Todas" },
  ...Object.entries(INSCRIPTION_STATUS).map(([value, s]) => ({ value, label: s.label })),
];

const FILTROS_FUENTE = [
  { value: "", label: "Todas las fuentes" },
  ...Object.entries(INSCRIPTION_SOURCE).map(([value, s]) => ({ value, label: s.label })),
];

async function loadInscriptions(estadoFiltro: string, fuenteFiltro: string, q: string) {
  return safeRead([], async () => {
    const condiciones = [
      estadoFiltro ? eq(inscriptions.status, estadoFiltro) : undefined,
      fuenteFiltro ? eq(inscriptions.source, fuenteFiltro) : undefined,
      q
        ? or(
            ilike(inscriptions.name, `%${q}%`),
            ilike(inscriptions.email, `%${q}%`),
            ilike(inscriptions.organization, `%${q}%`),
          )
        : undefined,
    ].filter((c): c is NonNullable<typeof c> => Boolean(c));

    return db
      .select()
      .from(inscriptions)
      .where(condiciones.length > 0 ? and(...condiciones) : undefined)
      .orderBy(desc(inscriptions.createdAt))
      .limit(200);
  });
}

async function loadCounts() {
  return safeRead(
    { new: 0, contacted: 0, qualified: 0, converted: 0 },
    async () => {
      const rows = await db.select().from(inscriptions).limit(2000);
      return {
        new: rows.filter((r) => r.status === "new").length,
        contacted: rows.filter((r) => r.status === "contacted").length,
        qualified: rows.filter((r) => r.status === "qualified").length,
        converted: rows.filter((r) => r.status === "converted").length,
      };
    },
  );
}

export default async function AdminInscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; fuente?: string; q?: string }>;
}) {
  const {
    estado: estadoFiltro = "",
    fuente: fuenteFiltro = "",
    q = "",
  } = await searchParams;

  const [lista, counts] = await Promise.all([
    loadInscriptions(estadoFiltro, fuenteFiltro, q),
    loadCounts(),
  ]);

  const qs = (overrides: { estado?: string; fuente?: string }) => {
    const params = new URLSearchParams();
    const e = overrides.estado ?? estadoFiltro;
    const f = overrides.fuente ?? fuenteFiltro;
    if (e) params.set("estado", e);
    if (f) params.set("fuente", f);
    if (q) params.set("q", q);
    const s = params.toString();
    return s ? `/admin/inscripciones?${s}` : "/admin/inscripciones";
  };

  return (
    <>
      <PageHeader
        title="Inscripciones"
        subtitle="Leads de los formularios de aplicación, contacto y empresas. Cada fila abre la ficha."
      />

      <CifraGrid>
        <Cifra label="Nuevas" value={counts.new} tone="alerta" note="Por contactar" />
        <Cifra label="Contactadas" value={counts.contacted} note="En seguimiento" tone="acento" />
        <Cifra label="Calificadas" value={counts.qualified} tone="ok" note="Listas para convertir" />
        <Cifra label="Convertidas" value={counts.converted} note="Se volvieron clientes" />
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
          items={FILTROS_FUENTE.map((f) => ({
            href: qs({ fuente: f.value }),
            label: f.label,
            active: fuenteFiltro === f.value,
          }))}
        />
        <form action="/admin/inscripciones" method="get" className="flex gap-2" style={{ maxWidth: 420 }}>
          {estadoFiltro && <input type="hidden" name="estado" value={estadoFiltro} />}
          {fuenteFiltro && <input type="hidden" name="fuente" value={fuenteFiltro} />}
          <Input type="search" name="q" defaultValue={q} placeholder="Nombre, correo u organización…" />
          <Boton tone="secundario" type="submit">
            Buscar
          </Boton>
        </form>
      </div>

      <div className="mb-4">
        <Conteo n={lista.length} singular="inscripción encontrada" plural="inscripciones encontradas" />
      </div>

      {lista.length === 0 ? (
        <EstadoVacio
          title="Todavía no hay inscripciones."
          body="Cuando alguien envíe el formulario de aplicación, contacto o empresas del sitio público, aparecerá aquí."
        />
      ) : (
        <Tabla>
          <thead>
            <tr>
              <Th>Fecha</Th>
              <Th>Nombre</Th>
              <Th>Correo</Th>
              <Th>Fuente</Th>
              <Th>Programa</Th>
              <Th>Estado</Th>
              <Th>Notas</Th>
            </tr>
          </thead>
          <tbody>
            {lista.map((l) => {
              const est = estado(INSCRIPTION_STATUS, l.status);
              const fuente = estado(INSCRIPTION_SOURCE, l.source);
              const programa = l.retreatSlug || l.pathSlug;
              return (
                <FilaEnlace key={l.id}>
                  <Td>{fechaCorta(l.createdAt)}</Td>
                  <Td>
                    <EnlaceFila href={`/admin/inscripciones/${l.id}`}>{l.name}</EnlaceFila>
                    {l.organization && <div className="celda-secundaria">{l.organization}</div>}
                  </Td>
                  <Td>
                    <a href={`mailto:${l.email}`} className="sobre-fila">
                      {l.email}
                    </a>
                  </Td>
                  <Td>
                    <Insignia tone={fuente.tone}>{fuente.label}</Insignia>
                  </Td>
                  <Td>
                    {programa ? (
                      <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: 12 }}>
                        {programa}
                      </span>
                    ) : (
                      "—"
                    )}
                  </Td>
                  <Td>
                    <Insignia tone={est.tone}>{est.label}</Insignia>
                  </Td>
                  <Td>{l.notes ? "✎" : "—"}</Td>
                </FilaEnlace>
              );
            })}
          </tbody>
        </Tabla>
      )}
    </>
  );
}
