/**
 * Derechos ARCO — constantes compartidas por el sitio público, la API y el
 * admin. Sin dependencias de servidor: se importa también desde componentes
 * cliente (formulario) y desde los correos.
 *
 * Marco legal: Ley Federal de Protección de Datos Personales en Posesión de
 * los Particulares (LFPDPPP). El titular puede Acceder, Rectificar, Cancelar
 * u Oponerse al tratamiento de sus datos, y revocar su consentimiento.
 *
 * Plazos (en días hábiles):
 *   - 20 para comunicar al titular la respuesta a su solicitud.
 *   - 15 adicionales, si procede, para hacerla efectiva.
 *   - 5 para requerir al titular información/identificación faltante,
 *     y 10 para que el titular la entregue (suspende el plazo de 20).
 */

import type { Locale } from "@/i18n/config";

export interface L {
  es: string;
  en: string;
}

export const ARCO_RIGHTS = [
  "acceso",
  "rectificacion",
  "cancelacion",
  "oposicion",
  "revocacion",
] as const;
export type ArcoRight = (typeof ARCO_RIGHTS)[number];

export const ARCO_STATUSES = [
  "nueva",
  "identidad_pendiente",
  "en_proceso",
  "resuelta",
  "rechazada",
] as const;
export type ArcoStatus = (typeof ARCO_STATUSES)[number];

/** Estados en los que la solicitud sigue abierta (cuenta el plazo legal). */
export const ARCO_OPEN_STATUSES: readonly ArcoStatus[] = [
  "nueva",
  "identidad_pendiente",
  "en_proceso",
];

export const ARCO_RELATIONS = [
  "participante",
  "comprador",
  "empresa",
  "suscriptor",
  "otro",
] as const;
export type ArcoRelation = (typeof ARCO_RELATIONS)[number];

export interface ArcoRightInfo {
  key: ArcoRight;
  /** Letra que se muestra en el botón (A · R · C · O · +). */
  letter: string;
  label: L;
  description: L;
  example: L;
}

export const ARCO_RIGHT_INFO: Record<ArcoRight, ArcoRightInfo> = {
  acceso: {
    key: "acceso",
    letter: "A",
    label: { es: "Acceso", en: "Access" },
    description: {
      es: "Conocer qué datos personales tenemos sobre ti, para qué los usamos y con quién los compartimos.",
      en: "Know which personal data we hold about you, what we use it for and who we share it with.",
    },
    example: {
      es: "«Quiero una copia de los datos que tienen de mí.»",
      en: "“I want a copy of the data you hold about me.”",
    },
  },
  rectificacion: {
    key: "rectificacion",
    letter: "R",
    label: { es: "Rectificación", en: "Rectification" },
    description: {
      es: "Corregir datos inexactos, incompletos o desactualizados.",
      en: "Correct data that is inaccurate, incomplete or out of date.",
    },
    example: {
      es: "«Cambió mi correo, mi teléfono o mi razón social.»",
      en: "“My email, phone or company name changed.”",
    },
  },
  cancelacion: {
    key: "cancelacion",
    letter: "C",
    label: { es: "Cancelación", en: "Cancellation" },
    description: {
      es: "Que eliminemos tus datos de nuestros registros cuando ya no sean necesarios para las finalidades del aviso.",
      en: "Have your data deleted from our records once it is no longer needed for the purposes in the notice.",
    },
    example: {
      es: "«Ya no quiero que conserven mi información.»",
      en: "“I no longer want you to keep my information.”",
    },
  },
  oposicion: {
    key: "oposicion",
    letter: "O",
    label: { es: "Oposición", en: "Objection" },
    description: {
      es: "Que dejemos de usar tus datos para una finalidad concreta, por ejemplo comunicaciones sobre nuevos programas.",
      en: "Have us stop using your data for a specific purpose, for example communications about new programs.",
    },
    example: {
      es: "«No quiero recibir información de nuevos programas.»",
      en: "“I don't want to receive information about new programs.”",
    },
  },
  revocacion: {
    key: "revocacion",
    letter: "+",
    label: { es: "Revocar consentimiento", en: "Withdraw consent" },
    description: {
      es: "Retirar el consentimiento que nos diste para tratar tus datos. No afecta lo ya realizado ni las obligaciones legales vigentes.",
      en: "Withdraw the consent you gave us to process your data. It does not affect processing already carried out or current legal obligations.",
    },
    example: {
      es: "«Retiro mi autorización para el uso de mis datos.»",
      en: "“I withdraw my authorization to use my data.”",
    },
  },
};

export const ARCO_RELATION_LABEL: Record<ArcoRelation, L> = {
  participante: {
    es: "Participé o apliqué a un programa o experiencia",
    en: "I took part in or applied to a program or experience",
  },
  comprador: {
    es: "Compré un programa o experiencia",
    en: "I purchased a program or experience",
  },
  empresa: {
    es: "Represento a una empresa que cotizó o contrató",
    en: "I represent a company that requested a quote or hired us",
  },
  suscriptor: {
    es: "Estoy suscrito al newsletter",
    en: "I subscribe to the newsletter",
  },
  otro: { es: "Otra relación", en: "Other" },
};

export const ARCO_RESPONSE_BUSINESS_DAYS = 20;
export const ARCO_EXECUTION_BUSINESS_DAYS = 15;
export const ARCO_REQUIREMENT_BUSINESS_DAYS = 5;
export const ARCO_IDENTITY_BUSINESS_DAYS = 10;

export const t = (l: L, locale: Locale) => (locale === "en" ? l.en : l.es);

/* ── Días hábiles (zona horaria de Ciudad de México) ─────────────────────── */

const TZ = "America/Mexico_City";

const ISO_FMT = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** "YYYY-MM-DD" de una fecha, vista desde Ciudad de México. */
export function isoDateMx(d: Date): string {
  return ISO_FMT.format(d);
}

/** n-ésimo día de la semana (0 = domingo) de un mes, en UTC. */
function nthWeekday(year: number, month: number, weekday: number, n: number): string {
  const first = new Date(Date.UTC(year, month, 1, 12));
  const offset = (weekday - first.getUTCDay() + 7) % 7;
  const day = 1 + offset + (n - 1) * 7;
  return new Date(Date.UTC(year, month, day, 12)).toISOString().slice(0, 10);
}

/**
 * Días de descanso obligatorio (Ley Federal del Trabajo, art. 74). Los días
 * de elecciones federales no se incluyen porque se fijan por decreto.
 */
export function mexicanHolidays(year: number): Set<string> {
  const days = [
    `${year}-01-01`,
    nthWeekday(year, 1, 1, 1), // primer lunes de febrero
    nthWeekday(year, 2, 1, 3), // tercer lunes de marzo
    `${year}-05-01`,
    `${year}-09-16`,
    nthWeekday(year, 10, 1, 3), // tercer lunes de noviembre
    `${year}-12-25`,
  ];
  // Transmisión del Poder Ejecutivo Federal: 1 de octubre cada seis años.
  if ((year - 2024) % 6 === 0) days.push(`${year}-10-01`);
  return new Set(days);
}

function isBusinessDay(iso: string, holidays: Map<number, Set<string>>): boolean {
  const d = new Date(`${iso}T12:00:00Z`);
  const dow = d.getUTCDay();
  if (dow === 0 || dow === 6) return false;
  const year = d.getUTCFullYear();
  if (!holidays.has(year)) holidays.set(year, mexicanHolidays(year));
  return !holidays.get(year)!.has(iso);
}

function shiftIso(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Suma `days` días hábiles a `from`. El conteo empieza el día hábil siguiente
 * (así funciona el cómputo legal de plazos). Devuelve la fecha a mediodía UTC
 * del día de vencimiento, que en Ciudad de México sigue siendo ese día.
 */
export function addBusinessDays(from: Date, days: number): Date {
  const holidays = new Map<number, Set<string>>();
  let iso = isoDateMx(from);
  let remaining = days;
  while (remaining > 0) {
    iso = shiftIso(iso, 1);
    if (isBusinessDay(iso, holidays)) remaining -= 1;
  }
  return new Date(`${iso}T12:00:00Z`);
}

/**
 * Días hábiles que faltan para `due` contados desde `now` (negativo si ya
 * venció). 0 = vence hoy.
 */
export function businessDaysUntil(due: Date, now: Date = new Date()): number {
  const holidays = new Map<number, Set<string>>();
  const start = isoDateMx(now);
  const end = isoDateMx(due);
  if (start === end) return 0;
  const forward = start < end;
  let iso = start;
  let n = 0;
  while (iso !== end) {
    iso = shiftIso(iso, forward ? 1 : -1);
    if (isBusinessDay(iso, holidays)) n += 1;
  }
  return forward ? n : -n;
}

/** Folio legible: ARCO-260906-K7F2A. */
export function newArcoFolio(now: Date = new Date()): string {
  const ymd = isoDateMx(now).replace(/-/g, "").slice(2);
  const rand = globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 5).toUpperCase();
  return `ARCO-${ymd}-${rand}`;
}
