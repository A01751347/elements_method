import "server-only";

/**
 * Consultas del panel de analítica propia (tabla `page_views`).
 *
 * Todo se agrega en SQL y se limita a una ventana de días para que el panel
 * siga siendo barato cuando la tabla crezca. Cada consulta pasa por
 * `safeRead`, así que el panel se despliega con ceros mientras la tabla no
 * exista (antes de `pnpm db:analytics`) en lugar de romperse.
 */
import { sql } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { safeRead } from "@/modules/content/safe";

export interface Resumen {
  vistas: number;
  visitantes: number;
  sesiones: number;
  duracionMediaMs: number;
}

export interface FilaSerie {
  dia: string;
  vistas: number;
  visitantes: number;
}

export interface FilaConteo {
  clave: string;
  vistas: number;
  visitantes: number;
}

export interface Embudo {
  paso: string;
  visitantes: number;
}

/** Ventana temporal como intervalo de Postgres. */
const desde = (dias: number) => sql`now() - ${`${dias} days`}::interval`;

export async function getResumen(dias: number): Promise<Resumen> {
  return safeRead({ vistas: 0, visitantes: 0, sesiones: 0, duracionMediaMs: 0 }, async () => {
    const r = await db.execute(sql`
      select
        count(*)::int                                as vistas,
        count(distinct visitor_hash)::int            as visitantes,
        count(distinct session_id)::int              as sesiones,
        coalesce(avg(duration_ms) filter (where duration_ms is not null), 0)::int as duracion
      from page_views
      where viewed_at >= ${desde(dias)}
    `);
    const row = (r.rows?.[0] ?? {}) as Record<string, number>;
    return {
      vistas: Number(row.vistas ?? 0),
      visitantes: Number(row.visitantes ?? 0),
      sesiones: Number(row.sesiones ?? 0),
      duracionMediaMs: Number(row.duracion ?? 0),
    };
  });
}

/** Serie diaria para la gráfica de tendencia. */
export async function getSerie(dias: number): Promise<FilaSerie[]> {
  return safeRead([] as FilaSerie[], async () => {
    const r = await db.execute(sql`
      select
        to_char(date_trunc('day', viewed_at), 'YYYY-MM-DD') as dia,
        count(*)::int                                       as vistas,
        count(distinct visitor_hash)::int                   as visitantes
      from page_views
      where viewed_at >= ${desde(dias)}
      group by 1
      order by 1 asc
    `);
    return (r.rows ?? []).map((x) => {
      const row = x as Record<string, unknown>;
      return {
        dia: String(row.dia),
        vistas: Number(row.vistas ?? 0),
        visitantes: Number(row.visitantes ?? 0),
      };
    });
  });
}

/** Agrupación genérica por una columna (path, source, device, country…). */
async function porColumna(columna: string, dias: number, limite: number): Promise<FilaConteo[]> {
  return safeRead([] as FilaConteo[], async () => {
    const col = sql.raw(`"${columna}"`);
    const r = await db.execute(sql`
      select
        coalesce(${col}::text, '—')       as clave,
        count(*)::int                     as vistas,
        count(distinct visitor_hash)::int as visitantes
      from page_views
      where viewed_at >= ${desde(dias)}
      group by 1
      order by vistas desc
      limit ${limite}
    `);
    return (r.rows ?? []).map((x) => {
      const row = x as Record<string, unknown>;
      return {
        clave: String(row.clave),
        vistas: Number(row.vistas ?? 0),
        visitantes: Number(row.visitantes ?? 0),
      };
    });
  });
}

export const getPaginas = (dias: number, limite = 12) => porColumna("path", dias, limite);
export const getFuentes = (dias: number, limite = 10) => porColumna("source", dias, limite);
export const getDispositivos = (dias: number) => porColumna("device", dias, 5);
export const getPaises = (dias: number, limite = 8) => porColumna("country", dias, limite);
export const getCampanas = (dias: number, limite = 10) => porColumna("campaign", dias, limite);

/** Visitantes únicos por paso del embudo, en el orden del recorrido de compra. */
export async function getEmbudo(dias: number): Promise<Embudo[]> {
  const ORDEN = ["home", "retiros", "experiencia", "checkout", "gracias"];
  return safeRead(
    ORDEN.map((paso) => ({ paso, visitantes: 0 })),
    async () => {
      const r = await db.execute(sql`
        select funnel_step, count(distinct visitor_hash)::int as visitantes
        from page_views
        where viewed_at >= ${desde(dias)}
        group by 1
      `);
      const mapa = new Map<string, number>();
      for (const x of r.rows ?? []) {
        const row = x as Record<string, unknown>;
        mapa.set(String(row.funnel_step), Number(row.visitantes ?? 0));
      }
      return ORDEN.map((paso) => ({ paso, visitantes: mapa.get(paso) ?? 0 }));
    },
  );
}

/** Interés por experiencia: qué landing de producto se mira más. */
export async function getExperiencias(dias: number): Promise<FilaConteo[]> {
  return safeRead([] as FilaConteo[], async () => {
    const r = await db.execute(sql`
      select
        entity_slug                       as clave,
        count(*)::int                     as vistas,
        count(distinct visitor_hash)::int as visitantes
      from page_views
      where viewed_at >= ${desde(dias)}
        and entity_slug is not null
        and funnel_step in ('experiencia', 'checkout')
      group by 1
      order by visitantes desc
      limit 10
    `);
    return (r.rows ?? []).map((x) => {
      const row = x as Record<string, unknown>;
      return {
        clave: String(row.clave),
        vistas: Number(row.vistas ?? 0),
        visitantes: Number(row.visitantes ?? 0),
      };
    });
  });
}

/** ¿Hay datos? Distingue "nadie ha entrado" de "la tabla aún no existe". */
export async function getEstadoTabla(): Promise<"lista" | "sin_tabla"> {
  return safeRead("sin_tabla" as const, async () => {
    await db.execute(sql`select 1 from page_views limit 1`);
    return "lista" as const;
  });
}
