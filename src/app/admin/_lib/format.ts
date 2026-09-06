/**
 * Formatos del admin — dinero y fechas en es-MX, zona America/Mexico_City.
 *
 * Todas las funciones de fecha aceptan `Date | string | null | undefined` y
 * devuelven "—" cuando no hay valor o no se puede interpretar. Se extraen los
 * componentes de fecha con `Intl.DateTimeFormat` fijando la zona horaria, y
 * se arman las cadenas a mano (sin depender de los nombres de mes/día que da
 * el locale) para garantizar el formato exacto del doc de marca (§8.3).
 */

const ZONA = "America/Mexico_City";

const MESES_CORTOS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

const MESES_LARGOS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const DIAS_SEMANA = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

const DIAS_SEMANA_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type FechaEntrada = Date | string | null | undefined;

function aFecha(d: FechaEntrada): Date | null {
  if (d === null || d === undefined || d === "") return null;
  const fecha = d instanceof Date ? d : new Date(d);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
}

interface PartesFecha {
  anio: number;
  mes: number; // 0-11
  dia: number;
  diaSemana: number; // 0-6, domingo = 0
  hora: number; // 0-23
  minuto: number;
}

const FORMATEADOR_PARTES = new Intl.DateTimeFormat("en-US", {
  timeZone: ZONA,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: false,
  weekday: "short",
});

function partes(fecha: Date): PartesFecha {
  const partesFmt = FORMATEADOR_PARTES.formatToParts(fecha);
  const obtener = (tipo: string) => partesFmt.find((p) => p.type === tipo)?.value ?? "";
  const horaRaw = Number(obtener("hour"));
  return {
    anio: Number(obtener("year")),
    mes: Number(obtener("month")) - 1,
    dia: Number(obtener("day")),
    diaSemana: Math.max(0, DIAS_SEMANA_EN.indexOf(obtener("weekday"))),
    hora: horaRaw === 24 ? 0 : horaRaw,
    minuto: Number(obtener("minute")),
  };
}

/** "$3,560" si es entero; "$899.95" si tiene centavos. Intl es-MX. */
export function mxn(n: number | string | null | undefined, currency: "MXN" | "USD" = "MXN"): string {
  if (n === null || n === undefined || n === "") return "—";
  const valor = typeof n === "string" ? Number(n) : n;
  if (!Number.isFinite(valor)) return "—";
  const tieneCentavos = Math.round(Math.abs(valor) * 100) % 100 !== 0;
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    minimumFractionDigits: tieneCentavos ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(valor);
}

/** "4 sep" */
export function fechaCorta(d: FechaEntrada): string {
  const fecha = aFecha(d);
  if (!fecha) return "—";
  const p = partes(fecha);
  return `${p.dia} ${MESES_CORTOS[p.mes]}`;
}

/** "sábado 29 de agosto" */
export function fechaLarga(d: FechaEntrada): string {
  const fecha = aFecha(d);
  if (!fecha) return "—";
  const p = partes(fecha);
  return `${DIAS_SEMANA[p.diaSemana]} ${p.dia} de ${MESES_LARGOS[p.mes]}`;
}

/** "19:00" (24h) */
export function hora(d: FechaEntrada): string {
  const fecha = aFecha(d);
  if (!fecha) return "—";
  const p = partes(fecha);
  return `${String(p.hora).padStart(2, "0")}:${String(p.minuto).padStart(2, "0")}`;
}

/** "4 sep, 23:16" */
export function fechaHora(d: FechaEntrada): string {
  const fecha = aFecha(d);
  if (!fecha) return "—";
  return `${fechaCorta(fecha)}, ${hora(fecha)}`;
}

/** "sábado, 5 de septiembre de 2026" */
export function fechaCompleta(d: FechaEntrada): string {
  const fecha = aFecha(d);
  if (!fecha) return "—";
  const p = partes(fecha);
  return `${DIAS_SEMANA[p.diaSemana]}, ${p.dia} de ${MESES_LARGOS[p.mes]} de ${p.anio}`;
}

/** "2026-09-05" */
export function fechaIso(d: FechaEntrada): string {
  const fecha = aFecha(d);
  if (!fecha) return "—";
  const p = partes(fecha);
  return `${p.anio}-${String(p.mes + 1).padStart(2, "0")}-${String(p.dia).padStart(2, "0")}`;
}
