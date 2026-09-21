/**
 * Panel de tráfico — analítica propia (tabla `page_views`).
 *
 * Responde, sin depender de Google ni de Meta, las preguntas operativas:
 * cuánta gente entra, de dónde viene, qué páginas mira, qué experiencia le
 * interesa y hasta qué punto del embudo llega antes de pagar.
 *
 * La configuración de pixels de terceros vive en /admin/analytics/pixels.
 */
import { findExperienceBySlug } from "@/data/experiences";
import {
  getResumen,
  getSerie,
  getPaginas,
  getFuentes,
  getDispositivos,
  getPaises,
  getCampanas,
  getEmbudo,
  getExperiencias,
  getEstadoTabla,
  type FilaConteo,
  type FilaSerie,
} from "./queries";
import {
  PageHeader,
  Cifra,
  CifraGrid,
  Filtros,
  Tabla,
  Th,
  Td,
  Tarjeta,
  SeccionEtiqueta,
  Banner,
  Boton,
  EstadoVacio,
} from "../_components/ui";

export const dynamic = "force-dynamic";

const RANGOS = [
  { dias: 7, label: "7 días" },
  { dias: 30, label: "30 días" },
  { dias: 90, label: "90 días" },
  { dias: 365, label: "12 meses" },
];

const PASO_LABEL: Record<string, string> = {
  home: "Inicio",
  retiros: "Listado de experiencias",
  experiencia: "Landing de una experiencia",
  checkout: "Checkout",
  gracias: "Compra confirmada",
};

const FUENTE_LABEL: Record<string, string> = {
  directo: "Directo / sin referente",
  google: "Google",
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  x: "X / Twitter",
  bing: "Bing",
  ia: "Buscadores IA (ChatGPT, Perplexity…)",
  correo: "Correo",
};

const DISPOSITIVO_LABEL: Record<string, string> = {
  desktop: "Computadora",
  mobile: "Celular",
  tablet: "Tablet",
};

function duracion(ms: number): string {
  if (!ms) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
}

/** Gráfica de barras en SVG: sin librerías, legible en claro y oscuro. */
function Tendencia({ serie }: { serie: FilaSerie[] }) {
  if (serie.length === 0) return null;
  const max = Math.max(...serie.map((d) => d.vistas), 1);
  const ancho = 100;
  const alto = 32;
  const paso = ancho / serie.length;

  return (
    <figure style={{ margin: 0 }}>
      <svg
        viewBox={`0 0 ${ancho} ${alto}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height: "8rem", display: "block" }}
        role="img"
        aria-label={`Vistas por día: ${serie.map((d) => `${d.dia}, ${d.vistas}`).join("; ")}`}
      >
        {serie.map((d, i) => {
          const h = (d.vistas / max) * (alto - 2);
          return (
            <rect
              key={d.dia}
              x={i * paso + paso * 0.15}
              y={alto - h}
              width={paso * 0.7}
              height={h}
              fill="currentColor"
              opacity={0.75}
            />
          );
        })}
      </svg>
      <figcaption className="pista" style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{serie[0]?.dia}</span>
        <span>{serie[serie.length - 1]?.dia}</span>
      </figcaption>
    </figure>
  );
}

/** Tabla de ranking con barra proporcional. */
function Ranking({
  filas,
  encabezado,
  etiquetas,
}: {
  filas: FilaConteo[];
  encabezado: string;
  etiquetas?: Record<string, string>;
}) {
  if (filas.length === 0) {
    return <p className="pista">Sin datos todavía.</p>;
  }
  const max = Math.max(...filas.map((f) => f.vistas), 1);
  return (
    <Tabla caption={encabezado}>
      <thead>
        <tr>
          <Th>{encabezado}</Th>
          <Th align="right">Visitantes</Th>
          <Th align="right">Vistas</Th>
        </tr>
      </thead>
      <tbody>
        {filas.map((f) => (
          <tr key={f.clave}>
            <Td>
              <span style={{ display: "block" }}>{etiquetas?.[f.clave] ?? f.clave}</span>
              <span
                aria-hidden="true"
                style={{
                  display: "block",
                  marginTop: "0.35rem",
                  height: "2px",
                  width: `${Math.max((f.vistas / max) * 100, 2)}%`,
                  background: "currentColor",
                  opacity: 0.25,
                }}
              />
            </Td>
            <Td numeric>{f.visitantes.toLocaleString("es-MX")}</Td>
            <Td numeric secondary>
              {f.vistas.toLocaleString("es-MX")}
            </Td>
          </tr>
        ))}
      </tbody>
    </Tabla>
  );
}

export default async function AdminTraficoPage({
  searchParams,
}: {
  searchParams: Promise<{ dias?: string }>;
}) {
  const { dias: diasParam } = await searchParams;
  const dias = RANGOS.some((r) => String(r.dias) === diasParam) ? Number(diasParam) : 30;

  const estado = await getEstadoTabla();

  const [resumen, serie, paginas, fuentes, dispositivos, paises, campanas, embudo, experiencias] =
    await Promise.all([
      getResumen(dias),
      getSerie(dias),
      getPaginas(dias),
      getFuentes(dias),
      getDispositivos(dias),
      getPaises(dias),
      getCampanas(dias),
      getEmbudo(dias),
      getExperiencias(dias),
    ]);

  const cabeza = embudo[0]?.visitantes ?? 0;
  const compras = embudo.find((e) => e.paso === "gracias")?.visitantes ?? 0;
  const conversion = cabeza > 0 ? (compras / cabeza) * 100 : 0;
  const vistasPorSesion = resumen.sesiones > 0 ? resumen.vistas / resumen.sesiones : 0;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Tráfico"
        subtitle="Quién visita el sitio, de dónde llega y hasta dónde avanza. Medición propia y agregada: no usa cookies de identificación ni depende de Google."
        actions={
          <Boton tone="secundario" href="/admin/analytics/pixels">
            Pixels y etiquetas
          </Boton>
        }
      />

      {estado === "sin_tabla" && (
        <Banner tone="aviso">
          La tabla <code>page_views</code> todavía no existe. Ejecuta{" "}
          <code>pnpm db:analytics</code> una sola vez para crearla; a partir de ese momento
          se empieza a registrar el tráfico. (No uses <code>db:seed</code>.)
        </Banner>
      )}

      <Filtros
        items={RANGOS.map((r) => ({
          href: `/admin/analytics?dias=${r.dias}`,
          label: r.label,
          active: r.dias === dias,
        }))}
      />

      <CifraGrid>
        <Cifra
          label="Visitantes únicos"
          value={resumen.visitantes.toLocaleString("es-MX")}
          note={`En los últimos ${dias} días`}
          tone="acento"
        />
        <Cifra label="Vistas de página" value={resumen.vistas.toLocaleString("es-MX")} />
        <Cifra
          label="Sesiones"
          value={resumen.sesiones.toLocaleString("es-MX")}
          note={vistasPorSesion ? `${vistasPorSesion.toFixed(1)} páginas por sesión` : undefined}
        />
        <Cifra
          label="Tiempo medio en página"
          value={duracion(resumen.duracionMediaMs)}
          note="Solo de quienes no cierran de inmediato"
        />
      </CifraGrid>

      {estado === "lista" && resumen.vistas === 0 ? (
        <EstadoVacio
          title="Todavía no hay visitas registradas"
          body="La medición ya está activa. En cuanto alguien entre al sitio público, las cifras aparecen aquí (se actualizan al recargar)."
        />
      ) : (
        <>
          <Tarjeta>
            <SeccionEtiqueta>Tendencia diaria</SeccionEtiqueta>
            <Tendencia serie={serie} />
          </Tarjeta>

          <Tarjeta>
            <SeccionEtiqueta>Embudo hasta la compra</SeccionEtiqueta>
            <p className="pista">
              Visitantes únicos que llegaron a cada punto del recorrido. Conversión de inicio a
              compra: <strong>{conversion.toFixed(1)}%</strong>.
            </p>
            <Tabla caption="Embudo">
              <thead>
                <tr>
                  <Th>Paso</Th>
                  <Th align="right">Visitantes</Th>
                  <Th align="right">% del inicio</Th>
                </tr>
              </thead>
              <tbody>
                {embudo.map((e) => (
                  <tr key={e.paso}>
                    <Td>{PASO_LABEL[e.paso] ?? e.paso}</Td>
                    <Td numeric>{e.visitantes.toLocaleString("es-MX")}</Td>
                    <Td numeric secondary>
                      {cabeza > 0 ? `${((e.visitantes / cabeza) * 100).toFixed(0)}%` : "—"}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Tabla>
          </Tarjeta>

          <Tarjeta>
            <SeccionEtiqueta>Interés por experiencia</SeccionEtiqueta>
            <Ranking
              filas={experiencias}
              encabezado="Experiencia"
              etiquetas={Object.fromEntries(
                experiencias.map((e) => [e.clave, findExperienceBySlug(e.clave)?.title ?? e.clave]),
              )}
            />
          </Tarjeta>

          <Tarjeta>
            <SeccionEtiqueta>De dónde llegan</SeccionEtiqueta>
            <Ranking filas={fuentes} encabezado="Fuente" etiquetas={FUENTE_LABEL} />
          </Tarjeta>

          <Tarjeta>
            <SeccionEtiqueta>Páginas más vistas</SeccionEtiqueta>
            <Ranking filas={paginas} encabezado="Página" />
          </Tarjeta>

          {campanas.length > 0 && (
            <Tarjeta>
              <SeccionEtiqueta>Campañas (UTM)</SeccionEtiqueta>
              <Ranking filas={campanas} encabezado="Campaña" />
            </Tarjeta>
          )}

          <Tarjeta>
            <SeccionEtiqueta>Dispositivo</SeccionEtiqueta>
            <Ranking filas={dispositivos} encabezado="Dispositivo" etiquetas={DISPOSITIVO_LABEL} />
          </Tarjeta>

          {paises.length > 0 && (
            <Tarjeta>
              <SeccionEtiqueta>País</SeccionEtiqueta>
              <Ranking filas={paises} encabezado="País" />
            </Tarjeta>
          )}
        </>
      )}
    </div>
  );
}
