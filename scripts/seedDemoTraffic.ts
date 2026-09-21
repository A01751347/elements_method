/**
 * Genera tráfico DE DEMOSTRACIÓN en `page_views` (una semana, ~7 visitantes/día).
 *
 *   pnpm demo:trafico          # inserta 7 días de historial
 *   pnpm demo:trafico --limpiar # borra SOLO lo generado por este script
 *
 * Para qué sirve: poblar el panel /admin/analytics y ver cómo se comporta
 * con datos antes de que llegue tráfico real.
 *
 * ⚠ Son datos FICTICIOS escritos en la base real. Cada fila lleva un
 * session_id con el prefijo DEMO_PREFIX, así que se pueden borrar de golpe
 * con --limpiar sin tocar una sola visita auténtica. Conviene limpiarlos en
 * cuanto el sitio reciba tráfico de verdad, para no mezclar cifras.
 *
 * El modelo no inserta filas sueltas: simula SESIONES. Cada visitante entra
 * por una página, navega una secuencia verosímil y solo a veces avanza en el
 * embudo, de modo que las tasas de conversión, las fuentes y los horarios se
 * parezcan a los de un sitio real.
 */
import "dotenv/config";
import { createHash, randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";

const DEMO_PREFIX = "demo-";
const DIAS = 7;
const VISITANTES_POR_DIA = 7; // ±2

const BLOG = [
  "cuando-el-estres-se-vuelve-un-patron",
  "cuando-ya-superaste-lo-que-antes-era-correcto",
  "decisiones-invisibles",
  "la-arquitectura-de-una-transformacion",
  "la-experiencia-de-liderazgo",
  "que-pasa-en-una-sesion-de-coaching",
  "quizas-tu-equipo-no-es-el-problema",
  "soluciones-viejas-para-problemas-nuevos",
];

const EXPERIENCIAS = ["equinox", "elements-awakening", "soul-discovery"];

/** Fuentes con su peso relativo: de dónde llega la gente, y con qué probabilidad. */
const FUENTES: { source: string; peso: number; host: string | null; medium?: string; campaign?: string }[] = [
  { source: "instagram", peso: 58, host: "www.instagram.com" },
  { source: "directo", peso: 42, host: null },
];

const PAISES = [{ c: "MX", peso: 100 }];

const DISPOSITIVOS = [
  { d: "mobile", peso: 64 },
  { d: "desktop", peso: 31 },
  { d: "tablet", peso: 5 },
];

type Fila = {
  path: string;
  locale: string;
  funnel_step: string;
  entity_slug: string | null;
  referrer_host: string | null;
  source: string;
  medium: string | null;
  campaign: string | null;
  device: string;
  country: string;
  visitor_hash: string;
  session_id: string;
  duration_ms: number | null;
  viewed_at: Date;
};

const rnd = (n: number) => Math.floor(Math.random() * n);
const pick = <T,>(a: T[]): T => a[rnd(a.length)];
const chance = (p: number) => Math.random() < p;

function pesado<T extends { peso: number }>(items: T[]): T {
  const total = items.reduce((s, i) => s + i.peso, 0);
  let r = Math.random() * total;
  for (const i of items) {
    r -= i.peso;
    if (r <= 0) return i;
  }
  return items[items.length - 1];
}

/** Duración verosímil según el tipo de página (en ms). */
function duracion(step: string): number | null {
  if (chance(0.12)) return null; // se fue antes de que el beacon saliera
  const rangos: Record<string, [number, number]> = {
    home: [8_000, 70_000],
    retiros: [15_000, 110_000],
    experiencia: [40_000, 320_000],
    blog: [50_000, 400_000],
    checkout: [30_000, 180_000],
    gracias: [5_000, 40_000],
    empresas: [20_000, 150_000],
    otro: [8_000, 90_000],
  };
  const [min, max] = rangos[step] ?? rangos.otro;
  return min + rnd(max - min);
}

/** Hora del día con forma realista: poco de madrugada, picos a media mañana y noche. */
function horaDelDia(): number {
  const pesos = [1, 1, 1, 1, 1, 2, 4, 7, 10, 12, 11, 9, 8, 8, 9, 9, 8, 8, 9, 11, 12, 9, 5, 2];
  const total = pesos.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let h = 0; h < 24; h++) {
    r -= pesos[h];
    if (r <= 0) return h;
  }
  return 20;
}

function hash(seed: string): string {
  return createHash("sha256").update(seed).digest("hex").slice(0, 32);
}

/**
 * Construye la secuencia de páginas de una visita.
 * El embudo se estrecha en cada paso, como en un sitio real.
 */
function recorrido(forzarCompra = false): { path: string; step: string; slug: string | null }[] {
  const pasos: { path: string; step: string; slug: string | null }[] = [];
  const exp = pick(EXPERIENCIAS);

  // Entrada. Con el tráfico llegando solo de Instagram y de visitas directas,
  // la enorme mayoría aterriza en la home (el enlace de la bio) y desde ahí
  // navega; entrar directo a una landing o al blog es minoritario. Esto
  // mantiene la home como cabeza real del embudo, de modo que cada paso
  // siguiente sea un subconjunto suyo y los porcentajes nunca superen 100%.
  const entrada = forzarCompra ? 0 : Math.random();
  if (entrada < 0.78) {
    pasos.push({ path: "/es", step: "home", slug: null });
  } else if (entrada < 0.92) {
    pasos.push({ path: `/es/blog/${pick(BLOG)}`, step: "blog", slug: null });
    if (chance(0.3)) pasos.push({ path: `/es/blog/${pick(BLOG)}`, step: "blog", slug: null });
    if (chance(0.45)) pasos.push({ path: "/es", step: "home", slug: null });
  } else {
    pasos.push({ path: "/es/empresas", step: "empresas", slug: null });
  }

  const yaEnLanding = pasos.some((p) => p.step === "experiencia");

  // Del home/blog, una parte mira el listado de experiencias. El comprador
  // recorre siempre este camino completo, para que su compra exista.
  if (!yaEnLanding && (forzarCompra || chance(0.5))) {
    pasos.push({ path: "/es/retiros", step: "retiros", slug: null });

    // …y de esos, una parte entra a una landing concreta.
    if (forzarCompra || chance(0.62)) {
      pasos.push({ path: `/es/retiros/${exp}`, step: "experiencia", slug: exp });
      if (chance(0.25)) {
        const otra = pick(EXPERIENCIAS.filter((e) => e !== exp));
        pasos.push({ path: `/es/retiros/${otra}`, step: "experiencia", slug: otra });
      }
    }
  }

  // Páginas de contexto que la gente consulta antes de decidir.
  if (chance(0.3)) pasos.push({ path: "/es/el-metodo", step: "otro", slug: null });
  if (chance(0.18)) pasos.push({ path: "/es/quienes-somos", step: "otro", slug: null });

  // Checkout: solo desde una landing, y solo una minoría llega.
  // La compra NO se deja al azar: la completa únicamente el visitante que
  // el generador marca con `forzarCompra`, de modo que la semana cierre con
  // exactamente una venta. Los demás que entran al checkout lo abandonan,
  // que es lo que hace visible la caída del último paso del embudo.
  const landing = [...pasos].reverse().find((p) => p.step === "experiencia");
  if (landing && (forzarCompra || chance(0.16))) {
    pasos.push({ path: "/es/checkout", step: "checkout", slug: landing.slug });
    if (forzarCompra) {
      pasos.push({ path: "/es/gracias", step: "gracias", slug: landing.slug });
    }
  }

  return pasos;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no está definida en .env");
  const sql = neon(url);

  if (process.argv.includes("--limpiar")) {
    const r = await sql`delete from page_views where session_id like ${DEMO_PREFIX + "%"} returning id`;
    console.log(`✓ ${r.length} filas de demostración eliminadas. El tráfico real no se tocó.`);
    return;
  }

  const existentes = await sql`select count(*)::int as n from page_views where session_id like ${DEMO_PREFIX + "%"}`;
  if ((existentes[0] as { n: number }).n > 0) {
    console.log(`⚠ Ya hay ${(existentes[0] as { n: number }).n} filas de demostración.`);
    console.log("  Ejecuta primero: pnpm demo:trafico --limpiar");
    return;
  }

  const filas: Fila[] = [];
  const hoy = new Date();

  // Una sola compra en la semana: con ~40 visitantes, encadenar las tasas
  // reales deja el embudo en cero demasiado a menudo, así que se fija el
  // día y el visitante que completan (ver nota en recorrido()).
  const diaDeLaCompra = rnd(DIAS);

  for (let d = DIAS - 1; d >= 0; d--) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() - d);

    // 7 ±2 entre semana; el fin de semana baja alrededor de un tercio, como
    // suele ocurrir en un público B2B. Se aplica el ajuste antes del ruido
    // aleatorio para que un sábado no termine siendo el día más alto.
    const finDeSemana = [0, 6].includes(fecha.getDay());
    const total = finDeSemana
      ? Math.max(2, VISITANTES_POR_DIA - 3 + rnd(2)) // 4-5: siempre por debajo
      : Math.max(3, VISITANTES_POR_DIA + (rnd(5) - 2)); // 5-9

    // El visitante marcado de este día completa la compra.
    const compradorDelDia = d === diaDeLaCompra ? rnd(total) : -1;

    for (let v = 0; v < total; v++) {
      const fuente = pesado(FUENTES);
      const device = pesado(DISPOSITIVOS).d;
      const country = pesado(PAISES).c;
      const sessionId = DEMO_PREFIX + randomUUID();
      // El hash es por visitante y por día, igual que en producción.
      const visitorHash = hash(`${fecha.toISOString().slice(0, 10)}|demo|${v}|${sessionId}`);
      const locale = chance(0.08) ? "en" : "es";

      const h = horaDelDia();
      const base = new Date(fecha);
      base.setHours(h, rnd(60), rnd(60), 0);

      let offset = 0;
      for (const paso of recorrido(v === compradorDelDia)) {
        const viewedAt = new Date(base.getTime() + offset);
        if (viewedAt > hoy) break; // nunca en el futuro
        const dur = duracion(paso.step);
        filas.push({
          path: locale === "en" ? paso.path.replace("/es", "/en") : paso.path,
          locale,
          funnel_step: paso.step,
          entity_slug: paso.slug,
          referrer_host: offset === 0 ? fuente.host : null,
          source: fuente.source,
          medium: fuente.medium ?? null,
          campaign: fuente.campaign ?? null,
          device,
          country,
          visitor_hash: visitorHash,
          session_id: sessionId,
          duration_ms: dur,
          viewed_at: viewedAt,
        });
        offset += (dur ?? 30_000) + 3_000 + rnd(12_000);
      }
    }
  }

  // Inserción por lotes para no hacer cientos de viajes a la base.
  for (let i = 0; i < filas.length; i += 100) {
    const lote = filas.slice(i, i + 100);
    await sql.query(
      `insert into page_views
        (path, locale, funnel_step, entity_slug, referrer_host, source, medium, campaign,
         device, country, visitor_hash, session_id, duration_ms, viewed_at)
       values ${lote
         .map(
           (_, j) =>
             `($${j * 14 + 1},$${j * 14 + 2},$${j * 14 + 3},$${j * 14 + 4},$${j * 14 + 5},$${j * 14 + 6},$${j * 14 + 7},$${j * 14 + 8},$${j * 14 + 9},$${j * 14 + 10},$${j * 14 + 11},$${j * 14 + 12},$${j * 14 + 13},$${j * 14 + 14})`,
         )
         .join(",")}`,
      lote.flatMap((f) => [
        f.path, f.locale, f.funnel_step, f.entity_slug, f.referrer_host, f.source,
        f.medium, f.campaign, f.device, f.country, f.visitor_hash, f.session_id,
        f.duration_ms, f.viewed_at.toISOString(),
      ]),
    );
  }

  const visitantes = new Set(filas.map((f) => f.visitor_hash)).size;
  const compras = filas.filter((f) => f.funnel_step === "gracias").length;
  console.log(`✓ ${filas.length} vistas de DEMOSTRACIÓN insertadas.`);
  console.log(`  ${visitantes} visitantes en ${DIAS} días · ${compras} compras simuladas.`);
  console.log(`  Para borrarlas: pnpm demo:trafico --limpiar`);
}

main().catch((e) => {
  console.error("✗ Falló la generación:", e instanceof Error ? e.message : e);
  process.exit(1);
});
