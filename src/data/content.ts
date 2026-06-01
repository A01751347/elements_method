/**
 * Mock static content for the public frontend.
 * In production this is fed from the database (products, retreats, testimonials...).
 * Bilingual fields keep the API shape the real CMS will use.
 */

import type { Locale } from "@/i18n/config";

export type ElementKey = "agua" | "fuego" | "aire" | "tierra";

export interface ElementInfo {
  key: ElementKey;
  nameEs: string;
  nameEn: string;
  qualityEs: string;
  qualityEn: string;
  natureEs: string;
  natureEn: string;
  personEs: string;
  personEn: string;
  methodEs: string;
  methodEn: string;
  bodyEs: string;
  bodyEn: string;
  accent: string;
  accentSoft: string;
  animClass: string;
}

export const elementImages: Record<ElementKey, string> = {
  agua: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=1200&q=80&auto=format&fit=crop",
  fuego: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop",
  aire: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?w=1200&q=80&auto=format&fit=crop",
  tierra: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80&auto=format&fit=crop",
};

export const elements: ElementInfo[] = [
  {
    key: "agua",
    nameEs: "Agua",
    nameEn: "Water",
    qualityEs: "Claridad, flujo, profundidad",
    qualityEn: "Clarity, flow, depth",
    natureEs:
      "El agua disuelve, transporta y revela. Encuentra su forma adaptándose al cauce sin perder su naturaleza.",
    natureEn:
      "Water dissolves, carries and reveals. It finds its form by adapting to the channel without losing its nature.",
    personEs:
      "Escucha profunda, adaptabilidad, lectura emocional del entorno. La capacidad de cambiar sin disolverse.",
    personEn:
      "Deep listening, adaptability, emotional reading of the environment. The capacity to change without dissolving.",
    methodEs:
      "Frameworks de escucha activa, lectura no verbal, modulación del estado emocional propio antes de decidir.",
    methodEn:
      "Active listening frameworks, non-verbal reading, modulating your own emotional state before deciding.",
    bodyEs: "Inmersión fría, contrast therapy, prácticas con cascada.",
    bodyEn: "Cold immersion, contrast therapy, waterfall practices.",
    accent: "var(--color-water)",
    accentSoft: "var(--color-water-soft)",
    animClass: "anim-water",
  },
  {
    key: "fuego",
    nameEs: "Fuego",
    nameEn: "Fire",
    qualityEs: "Visión, coraje, activación",
    qualityEn: "Vision, courage, activation",
    natureEs:
      "El fuego transforma irreversiblemente. No deja la materia como estaba: la convierte, la libera, la libera de lo que sobraba.",
    natureEn:
      "Fire transforms irreversibly. It doesn't leave matter as it was — it converts it and releases what was excess.",
    personEs:
      "Inspiración, movimiento hacia lo que importa, capacidad de quemar lo que no sirve sin culpa.",
    personEn:
      "Inspiration, movement toward what matters, capacity to burn what doesn't serve without guilt.",
    methodEs:
      "Frameworks de activación, definición de propósito operativo, decisión bajo incertidumbre.",
    methodEn:
      "Activation frameworks, operational purpose definition, decision under uncertainty.",
    bodyEs: "Sauna, movimiento intenso, ceremonia de fuego.",
    bodyEn: "Sauna, intense movement, fire ceremony.",
    accent: "var(--color-fire)",
    accentSoft: "var(--color-fire-soft)",
    animClass: "anim-fire",
  },
  {
    key: "aire",
    nameEs: "Aire",
    nameEn: "Air",
    qualityEs: "Perspectiva, comunicación, libertad",
    qualityEn: "Perspective, communication, freedom",
    natureEs:
      "El aire conecta y separa. Permite la distancia justa para ver, la respiración que sostiene cualquier acto.",
    natureEn:
      "Air connects and separates. It allows the right distance to see, the breath that sustains any act.",
    personEs:
      "Visión del panorama, comunicación precisa, espacio para que el otro piense.",
    personEn:
      "Panoramic view, precise communication, space for the other to think.",
    methodEs:
      "Frameworks de comunicación ejecutiva, narrativa, claridad estructural.",
    methodEn:
      "Executive communication frameworks, narrative, structural clarity.",
    bodyEs: "Breathwork, altura, prácticas de pausa.",
    bodyEn: "Breathwork, altitude, pause practices.",
    accent: "var(--color-air)",
    accentSoft: "var(--color-air-soft)",
    animClass: "anim-air",
  },
  {
    key: "tierra",
    nameEs: "Tierra",
    nameEn: "Earth",
    qualityEs: "Arraigo, confianza, raíces",
    qualityEn: "Rootedness, trust, roots",
    natureEs:
      "La tierra sostiene sin pedir explicación. Acepta lo que cae y lo convierte en condición para que crezca lo siguiente.",
    natureEn:
      "Earth sustains without asking for explanation. It accepts what falls and turns it into the condition for what grows next.",
    personEs:
      "Anclaje, confianza duradera, entornos donde florecer en lugar de aguantar.",
    personEn:
      "Grounding, durable trust, environments to flourish in rather than endure.",
    methodEs:
      "Frameworks de fundamento personal, estructura, hábitos sostenibles.",
    methodEn: "Personal foundation frameworks, structure, sustainable habits.",
    bodyEs: "Caminata silenciosa, contacto con tierra, ceremonia de arraigo.",
    bodyEn: "Silent hike, earthing, rooting ceremony.",
    accent: "var(--color-earth)",
    accentSoft: "var(--color-earth-soft)",
    animClass: "anim-earth",
  },
];

export interface PathInfo {
  slug: string;
  nameEs: string;
  nameEn: string;
  shortEs: string;
  shortEn: string;
  longEs: string;
  longEn: string;
  includesEs: string[];
  includesEn: string[];
  modalityEs: string;
  modalityEn: string;
  durationEs: string;
  durationEn: string;
  priceMxn: number;
  priceUsd: number;
}

export const paths: PathInfo[] = [
  {
    slug: "raices",
    nameEs: "Raíces",
    nameEn: "Roots",
    shortEs: "Inmersión de cuatro meses · uno por elemento.",
    shortEn: "Four-month immersion · one per element.",
    longEs:
      "Recorrido completo por los cuatro elementos a lo largo de cuatro meses. Una inmersión presencial mensual, dos sesiones de coaching individual al mes y una sesión grupal virtual. Para quienes quieren un cambio profundo con calendario sostenible.",
    longEn:
      "Full journey across the four elements over four months. One in-person immersion per month, two 1:1 coaching sessions per month and one virtual group session. For those who want deep change at a sustainable pace.",
    includesEs: [
      "4 inmersiones presenciales",
      "8 sesiones de coaching individual",
      "4 sesiones grupales virtuales",
      "Acceso a comunidad de egresados",
      "Material de seguimiento",
    ],
    includesEn: [
      "4 in-person immersions",
      "8 one-on-one coaching sessions",
      "4 virtual group sessions",
      "Alumni community access",
      "Follow-up materials",
    ],
    modalityEs: "Híbrido · presencial + virtual",
    modalityEn: "Hybrid · in-person + virtual",
    durationEs: "4 meses",
    durationEn: "4 months",
    priceMxn: 86000,
    priceUsd: 4900,
  },
  {
    slug: "corriente",
    nameEs: "Corriente",
    nameEn: "Stream",
    shortEs: "Intensivo grupal acelerado en dos meses.",
    shortEn: "Accelerated group intensive over two months.",
    longEs:
      "Mismos cuatro elementos en mitad del tiempo. Dos inmersiones presenciales por mes, dos sesiones de coaching individual mensuales, integración acelerada. Para quienes ya tienen claridad y quieren intensidad.",
    longEn:
      "Same four elements, half the time. Two in-person immersions per month, two individual coaching sessions per month, accelerated integration. For those who already have clarity and want intensity.",
    includesEs: [
      "4 inmersiones presenciales en 2 meses",
      "4 sesiones de coaching individual",
      "2 sesiones grupales virtuales",
      "Acceso a comunidad",
    ],
    includesEn: [
      "4 in-person immersions in 2 months",
      "4 one-on-one coaching sessions",
      "2 virtual group sessions",
      "Community access",
    ],
    modalityEs: "Híbrido · presencial + virtual",
    modalityEn: "Hybrid · in-person + virtual",
    durationEs: "2 meses",
    durationEn: "2 months",
    priceMxn: 64000,
    priceUsd: 3700,
  },
  {
    slug: "fuente",
    nameEs: "Fuente",
    nameEn: "Source",
    shortEs: "Inmersión total individual diseñada a la medida.",
    shortEn: "Bespoke total individual immersion.",
    longEs:
      "Programa diseñado a la medida con mapeo de liderazgo 1:1, integración de retiro ejecutivo individual y acompañamiento continuo. Para liderazgo de alto impacto que requiere confidencialidad y diseño propio.",
    longEn:
      "Bespoke program with 1:1 leadership mapping, individual executive retreat integration and continuous accompaniment. For high-impact leadership that requires confidentiality and tailored design.",
    includesEs: [
      "Mapeo de liderazgo 1:1",
      "Retiro ejecutivo individual",
      "Acompañamiento continuo durante 6 meses",
      "Acceso prioritario a inmersiones grupales",
    ],
    includesEn: [
      "1:1 leadership mapping",
      "Individual executive retreat",
      "Continuous accompaniment for 6 months",
      "Priority access to group immersions",
    ],
    modalityEs: "Individual · presencial y virtual",
    modalityEn: "Individual · in-person and virtual",
    durationEs: "6 meses",
    durationEn: "6 months",
    priceMxn: 148000,
    priceUsd: 8500,
  },
];

export interface RetreatInfo {
  id: string;
  nameEs: string;
  nameEn: string;
  startDate: string;
  endDate: string;
  location: string;
  modalityEs: string;
  modalityEn: string;
  elementsCovered: ElementKey[];
  priceMxn: number;
  priceUsd: number;
  capacity: number;
  sold: number;
  imageHue: string;
  image: string;
}

export const retreats: RetreatInfo[] = [
  {
    id: "tepoztlan-feb-2026",
    nameEs: "Tepoztlán · Inmersión de cuatro elementos",
    nameEn: "Tepoztlán · Four elements immersion",
    startDate: "2026-02-19",
    endDate: "2026-02-22",
    location: "Tepoztlán, Morelos",
    modalityEs: "Presencial · 3 noches",
    modalityEn: "In-person · 3 nights",
    elementsCovered: ["agua", "fuego", "aire", "tierra"],
    priceMxn: 38000,
    priceUsd: 2200,
    capacity: 14,
    sold: 6,
    imageHue: "var(--color-earth-soft)",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80&auto=format&fit=crop",
  },
  {
    id: "valle-de-bravo-may-2026",
    nameEs: "Valle de Bravo · Aire y agua",
    nameEn: "Valle de Bravo · Air and water",
    startDate: "2026-05-07",
    endDate: "2026-05-10",
    location: "Valle de Bravo, Edo. México",
    modalityEs: "Presencial · 3 noches",
    modalityEn: "In-person · 3 nights",
    elementsCovered: ["aire", "agua"],
    priceMxn: 32000,
    priceUsd: 1850,
    capacity: 12,
    sold: 12,
    imageHue: "var(--color-water-soft)",
    image: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?w=1600&q=80&auto=format&fit=crop",
  },
  {
    id: "huasteca-sep-2026",
    nameEs: "Huasteca · Fuego y tierra",
    nameEn: "Huasteca · Fire and earth",
    startDate: "2026-09-17",
    endDate: "2026-09-21",
    location: "Huasteca Potosina",
    modalityEs: "Presencial · 4 noches",
    modalityEn: "In-person · 4 nights",
    elementsCovered: ["fuego", "tierra"],
    priceMxn: 44000,
    priceUsd: 2550,
    capacity: 12,
    sold: 3,
    imageHue: "var(--color-fire-soft)",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&q=80&auto=format&fit=crop",
  },
  {
    id: "tepoztlan-nov-2026",
    nameEs: "Tepoztlán · Cierre de año ejecutivo",
    nameEn: "Tepoztlán · Executive year-end",
    startDate: "2026-11-26",
    endDate: "2026-11-29",
    location: "Tepoztlán, Morelos",
    modalityEs: "Presencial · 3 noches",
    modalityEn: "In-person · 3 nights",
    elementsCovered: ["agua", "fuego", "aire", "tierra"],
    priceMxn: 42000,
    priceUsd: 2400,
    capacity: 14,
    sold: 9,
    imageHue: "var(--color-air-soft)",
    image: "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=1600&q=80&auto=format&fit=crop",
  },
];

export function retreatStatus(r: RetreatInfo, threshold = 5):
  | { kind: "open" }
  | { kind: "low"; left: number }
  | { kind: "closed" } {
  const left = r.capacity - r.sold;
  if (left <= 0) return { kind: "closed" };
  if (left <= threshold) return { kind: "low", left };
  return { kind: "open" };
}

export interface Testimonial {
  id: string;
  type: "quote" | "video" | "company";
  authorName?: string;
  authorRole?: string;
  company?: string;
  quoteEs?: string;
  quoteEn?: string;
  image?: string;
  pathTaken?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    type: "quote",
    authorName: "Mariana Velasco",
    authorRole: "VP de Operaciones",
    company: "Alfa Holdings",
    quoteEs:
      "Llegué con la agenda llena y la cabeza dispersa. Tres meses después, mi equipo me dice que escucho distinto. Eso, para mí, ya valió todo.",
    quoteEn:
      "I arrived with a full calendar and a scattered head. Three months later, my team says I listen differently. That alone made it worth it.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80&auto=format&fit=crop",
    pathTaken: "Raíces",
  },
  {
    id: "t2",
    type: "quote",
    authorName: "Diego Hernández",
    authorRole: "Director General",
    company: "Tinta Estudio",
    quoteEs:
      "No es un curso, es una práctica. Hoy decido más rápido y con menos ruido interno. La sensación es de estar parado en piso firme.",
    quoteEn:
      "It isn't a course, it's a practice. I decide faster now and with less internal noise. The feeling is standing on firm ground.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop",
    pathTaken: "Corriente",
  },
  {
    id: "t3",
    type: "quote",
    authorName: "Lucía Ortega",
    authorRole: "Fundadora",
    company: "Maderera Ortega",
    quoteEs:
      "El trabajo con tierra me obligó a revisar a quién tengo cerca y a quién no. Difícil, pero necesario.",
    quoteEn:
      "The earth work forced me to revisit who I have close and who I don't. Hard but necessary.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&auto=format&fit=crop",
    pathTaken: "Fuente",
  },
  {
    id: "t4",
    type: "quote",
    authorName: "Roberto Sandoval",
    authorRole: "Director Comercial",
    company: "Grupo Fénix",
    quoteEs:
      "Antes operaba en piloto automático. Ahora hago pausas conscientes antes de cada decisión grande. Mi equipo lo nota — yo lo noto más.",
    quoteEn:
      "I used to operate on autopilot. Now I make conscious pauses before each big decision. My team notices it — I notice it more.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80&auto=format&fit=crop",
    pathTaken: "Raíces",
  },
];

export const stats = [
  { value: 240, suffix: "+", labelEs: "Líderes formados", labelEn: "Leaders trained" },
  { value: 42, suffix: "", labelEs: "Retiros completados", labelEn: "Retreats held" },
  { value: 96, suffix: "%", labelEs: "Recomendación", labelEn: "Recommendation rate" },
  { value: 7, suffix: " años", labelEs: "Método en práctica", labelEn: "Years in practice" },
];

export const processSteps = [
  {
    n: "01",
    titleEs: "Conversación inicial",
    titleEn: "First conversation",
    bodyEs: "Sin agenda comercial. Conversamos sobre dónde estás, qué pesa y qué quieres mover. Treinta minutos.",
    bodyEn: "No sales agenda. We talk about where you are, what weighs, and what you want to move. Thirty minutes.",
  },
  {
    n: "02",
    titleEs: "Diagnóstico de elementos",
    titleEn: "Elements diagnosis",
    bodyEs: "Identificamos cuál de los cuatro elementos está faltando o sobrando en tu liderazgo actual.",
    bodyEn: "We identify which of the four elements is missing or excessive in your current leadership.",
  },
  {
    n: "03",
    titleEs: "Diseño del camino",
    titleEn: "Path design",
    bodyEs: "Elegimos uno de los tres caminos o construimos uno a la medida. Calendario y compromiso definidos.",
    bodyEn: "We choose one of the three paths or build a custom one. Calendar and commitment defined.",
  },
  {
    n: "04",
    titleEs: "Práctica continua",
    titleEn: "Continuous practice",
    bodyEs: "Inmersiones, sesiones individuales, integración. No es teoría — es operación semanal y entrenamiento.",
    bodyEn: "Immersions, individual sessions, integration. Not theory — weekly operation and training.",
  },
];

export interface LocationInfo {
  slug: string;
  nameEs: string;
  nameEn: string;
  regionEs: string;
  regionEn: string;
  elementEs: string;
  elementEn: string;
  narrativeEs: string;
  narrativeEn: string;
  image: string;
  coordinatesLabel: string;
  altitude: string;
  primaryElement: ElementKey;
}

export const locations: LocationInfo[] = [
  {
    slug: "tepoztlan",
    nameEs: "Tepoztlán",
    nameEn: "Tepoztlán",
    regionEs: "Morelos · México",
    regionEn: "Morelos · Mexico",
    elementEs: "Tierra que mira al cielo",
    elementEn: "Earth that looks at the sky",
    narrativeEs:
      "Un pueblo enclavado entre paredes de roca volcánica que se elevan hasta el Tepozteco. Aquí la tierra no es plana: es presencia que obliga a mirar hacia arriba. Ceremonias de temazcal, caminatas al amanecer, fuego en círculo.",
    narrativeEn:
      "A town nested between volcanic rock walls that rise to the Tepozteco. Here the earth isn't flat — it's a presence that forces you to look up. Temazcal ceremonies, dawn hikes, fire in a circle.",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=85&auto=format&fit=crop",
    coordinatesLabel: "18.98°N · 99.10°W",
    altitude: "1,701 m",
    primaryElement: "tierra",
  },
  {
    slug: "valle-de-bravo",
    nameEs: "Valle de Bravo",
    nameEn: "Valle de Bravo",
    regionEs: "Estado de México",
    regionEn: "State of Mexico",
    elementEs: "Lago y viento",
    elementEn: "Lake and wind",
    narrativeEs:
      "Un valle alto donde el lago refleja el cielo y el viento entra por todas las ventanas. Trabajamos agua y aire: inmersión en el lago al amanecer, breathwork al atardecer, sesiones bajo cielo abierto.",
    narrativeEn:
      "A high valley where the lake mirrors the sky and the wind enters through every window. We work water and air: lake immersion at dawn, breathwork at sunset, sessions under open sky.",
    image:
      "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?w=1600&q=85&auto=format&fit=crop",
    coordinatesLabel: "19.19°N · 100.13°W",
    altitude: "1,830 m",
    primaryElement: "aire",
  },
  {
    slug: "huasteca",
    nameEs: "Huasteca Potosina",
    nameEn: "Huasteca Potosina",
    regionEs: "San Luis Potosí",
    regionEn: "San Luis Potosí",
    elementEs: "Agua viva y fuego",
    elementEn: "Living water and fire",
    narrativeEs:
      "Selva, cascadas turquesa y noches con hoguera bajo cielos sin contaminación lumínica. Trabajamos agua y fuego con la intensidad que solo permite la naturaleza salvaje. No para los tibios.",
    narrativeEn:
      "Jungle, turquoise waterfalls and bonfire nights under light-pollution-free skies. We work water and fire with the intensity only wild nature allows. Not for the tepid.",
    image:
      "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1600&q=85&auto=format&fit=crop",
    coordinatesLabel: "21.36°N · 98.94°W",
    altitude: "120 m",
    primaryElement: "agua",
  },
];

export interface PracticeInfo {
  iconName:
    | "Waves"
    | "Flame"
    | "Wind"
    | "Mountain"
    | "Sun"
    | "Moon"
    | "Footprints"
    | "Leaf"
    | "Snowflake"
    | "Sparkles";
  titleEs: string;
  titleEn: string;
  bodyEs: string;
  bodyEn: string;
  durationEs: string;
  durationEn: string;
  element: ElementKey;
}

export const practices: PracticeInfo[] = [
  {
    iconName: "Snowflake",
    titleEs: "Inmersión fría",
    titleEn: "Cold immersion",
    bodyEs:
      "Plunge en agua a 6–10°C. El cuerpo aprende a no huir de la incomodidad y la mente baja revoluciones. Disciplina de un líder que decide.",
    bodyEn:
      "Plunge in 6–10°C water. The body learns to stop fleeing discomfort and the mind quiets. Discipline of a leader who decides.",
    durationEs: "3–5 min",
    durationEn: "3–5 min",
    element: "agua",
  },
  {
    iconName: "Flame",
    titleEs: "Ceremonia de fuego",
    titleEn: "Fire ceremony",
    bodyEs:
      "Círculo nocturno con brasas. Lo que ya no sostiene se nombra, se escribe, se quema. Sin discurso espiritual barato — sí con peso real.",
    bodyEn:
      "Nightly circle with embers. What no longer holds is named, written, burned. No cheap spiritual rhetoric — real weight.",
    durationEs: "90 min",
    durationEn: "90 min",
    element: "fuego",
  },
  {
    iconName: "Wind",
    titleEs: "Breathwork guiado",
    titleEn: "Guided breathwork",
    bodyEs:
      "Respiración consciente con protocolos derivados de pranayama y Wim Hof. Acceso directo al sistema nervioso autónomo.",
    bodyEn:
      "Conscious breathing with pranayama and Wim Hof protocols. Direct access to the autonomic nervous system.",
    durationEs: "45 min",
    durationEn: "45 min",
    element: "aire",
  },
  {
    iconName: "Footprints",
    titleEs: "Caminata silenciosa",
    titleEn: "Silent hike",
    bodyEs:
      "Tres horas sin palabra, sin celular, sin reloj. El cuerpo recupera su tempo y la conversación interna se sincroniza con el paso.",
    bodyEn:
      "Three hours without words, phones, or watches. The body recovers its tempo and inner dialogue syncs with each step.",
    durationEs: "3 h",
    durationEn: "3 h",
    element: "tierra",
  },
  {
    iconName: "Sun",
    titleEs: "Sauna ceremonial",
    titleEn: "Ceremonial sauna",
    bodyEs:
      "Sauna a 90°C con aufguss y aceites esenciales. Calor que limpia, contraste con frío que despierta. Práctica nórdica adaptada.",
    bodyEn:
      "90°C sauna with aufguss and essential oils. Heat that cleans, cold contrast that awakens. Adapted Nordic practice.",
    durationEs: "60 min",
    durationEn: "60 min",
    element: "fuego",
  },
  {
    iconName: "Waves",
    titleEs: "Inmersión en cascada",
    titleEn: "Waterfall immersion",
    bodyEs:
      "Cuando hay cascada, hay cascada. Bajo el flujo se trabaja escucha, presencia y la capacidad de sostenerse en lo intenso.",
    bodyEn:
      "When there's a waterfall, there's a waterfall. Under the flow we work listening, presence, and the capacity to stand in intensity.",
    durationEs: "20 min",
    durationEn: "20 min",
    element: "agua",
  },
  {
    iconName: "Moon",
    titleEs: "Círculo de luna",
    titleEn: "Moon circle",
    bodyEs:
      "Reunión nocturna sin agenda, con preguntas que sí importan. Honestidad sin terapia, dirección sin coaching, presencia sin retórica.",
    bodyEn:
      "Nightly gathering with no agenda and questions that matter. Honesty without therapy, direction without coaching, presence without rhetoric.",
    durationEs: "2 h",
    durationEn: "2 h",
    element: "aire",
  },
  {
    iconName: "Leaf",
    titleEs: "Contacto con tierra",
    titleEn: "Earthing",
    bodyEs:
      "Pies descalzos sobre tierra húmeda al amanecer. Veinte minutos. La fisiología cambia — la postura ejecutiva también.",
    bodyEn:
      "Bare feet on damp earth at dawn. Twenty minutes. Physiology changes — so does executive posture.",
    durationEs: "20 min",
    durationEn: "20 min",
    element: "tierra",
  },
];

export const lexiconEs = [
  "Respirar",
  "Arraigar",
  "Fluir",
  "Encender",
  "Escuchar",
  "Sostener",
  "Soltar",
  "Activar",
  "Habitar",
  "Decidir",
  "Pausar",
  "Quemar lo que sobra",
  "Volver al cuerpo",
  "Mirar el cielo",
  "Pisar firme",
];

export const lexiconEn = [
  "Breathe",
  "Root",
  "Flow",
  "Ignite",
  "Listen",
  "Hold",
  "Release",
  "Activate",
  "Inhabit",
  "Decide",
  "Pause",
  "Burn what's excess",
  "Return to the body",
  "Look at the sky",
  "Stand firm",
];

export interface SeasonInfo {
  monthsEs: string;
  monthsEn: string;
  elementKey: ElementKey;
  titleEs: string;
  titleEn: string;
  bodyEs: string;
  bodyEn: string;
}

export const seasons: SeasonInfo[] = [
  {
    monthsEs: "Diciembre – Febrero",
    monthsEn: "December – February",
    elementKey: "tierra",
    titleEs: "Invierno · Raíz",
    titleEn: "Winter · Root",
    bodyEs:
      "El año aprieta hacia adentro. Tiempo de mirar qué se sostiene y qué no. Sesiones largas, fuego, sopa caliente, sueños largos.",
    bodyEn:
      "The year tightens inward. Time to look at what holds and what doesn't. Long sessions, fire, hot soup, long dreams.",
  },
  {
    monthsEs: "Marzo – Mayo",
    monthsEn: "March – May",
    elementKey: "aire",
    titleEs: "Primavera · Brote",
    titleEn: "Spring · Sprout",
    bodyEs:
      "Comienza el movimiento que estuvo esperando. Es el momento del aire: comunicar, abrir conversaciones, soltar viejos pactos.",
    bodyEn:
      "The movement that was waiting begins. Time for air: communicating, opening conversations, releasing old pacts.",
  },
  {
    monthsEs: "Junio – Agosto",
    monthsEn: "June – August",
    elementKey: "fuego",
    titleEs: "Verano · Fuego",
    titleEn: "Summer · Fire",
    bodyEs:
      "Activación pura. Ejecutar lo que se decidió, sin reservas. Quemar la duda con la acción que la duda misma estaba pidiendo.",
    bodyEn:
      "Pure activation. Executing what was decided, no reserves. Burning doubt with the action doubt itself was asking for.",
  },
  {
    monthsEs: "Septiembre – Noviembre",
    monthsEn: "September – November",
    elementKey: "agua",
    titleEs: "Otoño · Cauce",
    titleEn: "Autumn · Stream",
    bodyEs:
      "La fuerza se canaliza. Lo que floreció ahora se ordena, se filtra, se prepara para el descanso. Trabajo de agua: cauce y forma.",
    bodyEn:
      "Strength is channeled. What bloomed is now organized, filtered, prepared for rest. Water work: channel and form.",
  },
];

export const mantraEs =
  "El liderazgo se entrena como se entrena un cuerpo. La naturaleza no enseña con palabras — enseña con presencia.";
export const mantraEn =
  "Leadership is trained like a body is trained. Nature doesn't teach with words — it teaches with presence.";

export const faqs = [
  {
    qEs: "¿En qué se diferencia de un coaching tradicional?",
    qEn: "How is this different from traditional coaching?",
    aEs: "El coaching tradicional trabaja casi siempre con conversación. Nosotros incorporamos el cuerpo, la respiración, prácticas físicas y la simbología de los cuatro elementos como gramática operativa. No es metáfora: cada elemento es un terreno entrenable.",
    aEn: "Traditional coaching mostly works through conversation. We incorporate the body, breath, physical practices and the symbolism of the four elements as operational grammar. Not metaphor: each element is a trainable terrain.",
  },
  {
    qEs: "¿Es presencial u online?",
    qEn: "Is it in-person or online?",
    aEs: "Los tres caminos son híbridos. Las inmersiones son presenciales (en locaciones cuidadosamente elegidas), las sesiones de coaching son virtuales. Los retiros son 100% presenciales.",
    aEn: "All three paths are hybrid. The immersions are in-person (in carefully chosen locations), coaching sessions are virtual. Retreats are 100% in-person.",
  },
  {
    qEs: "¿Cuánto tiempo demanda semanalmente?",
    qEn: "How much time does it demand weekly?",
    aEs: "Entre 3 y 5 horas dependiendo del camino: dos horas de coaching, una sesión grupal, y prácticas autoguiadas de 30 a 60 minutos. Más una inmersión presencial al mes.",
    aEn: "Between 3 and 5 hours depending on the path: two hours of coaching, one group session, and self-guided practices of 30 to 60 minutes. Plus one in-person immersion per month.",
  },
  {
    qEs: "¿Puedo contratar para mi empresa?",
    qEn: "Can I contract for my company?",
    aEs: "Sí. Diseñamos programas a la medida para equipos directivos y mandos medios. Pasa por la calculadora de cotización para obtener un desglose completo en minutos.",
    aEn: "Yes. We design tailored programs for executive teams and middle management. Go through the quote calculator for a full breakdown in minutes.",
  },
  {
    qEs: "¿Qué pasa si tengo que pausar?",
    qEn: "What if I need to pause?",
    aEs: "Tenemos política de pausa de hasta 60 días sin penalización. Te conectamos con tu coach asignado para retomar cuando estés listo, sin perder progreso.",
    aEn: "We have a pause policy of up to 60 days without penalty. We connect you with your assigned coach to resume when you're ready, without losing progress.",
  },
];

export const clientLogos = [
  { name: "Banorte", initials: "BN" },
  { name: "Cemex", initials: "CX" },
  { name: "Bimbo", initials: "BB" },
  { name: "Femsa", initials: "FM" },
  { name: "Alfa", initials: "AL" },
  { name: "Liverpool", initials: "LV" },
];

export interface BlogPost {
  slug: string;
  titleEs: string;
  titleEn: string;
  excerptEs: string;
  excerptEn: string;
  author: string;
  date: string;
  readMinutes: number;
  tag: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "decidir-bajo-niebla",
    titleEs: "Decidir bajo niebla",
    titleEn: "Deciding in fog",
    excerptEs:
      "Lo que llamamos intuición ejecutiva suele ser la suma de un cuerpo entrenado y una atención dispuesta. Notas sobre por qué los líderes deciden mejor cuando dejan de pelearle a la incertidumbre.",
    excerptEn:
      "What we call executive intuition is usually the sum of a trained body and an available attention. Notes on why leaders decide better when they stop fighting uncertainty.",
    author: "Andrés Flores",
    date: "2026-05-12",
    readMinutes: 6,
    tag: "Decisión",
  },
  {
    slug: "el-cuerpo-tambien-piensa",
    titleEs: "El cuerpo también piensa",
    titleEn: "The body thinks too",
    excerptEs:
      "Antes de la palabra, el sistema nervioso ya tiene una respuesta. Por qué la inteligencia somática es central para el liderazgo, y por qué seguimos sin entrenarla.",
    excerptEn:
      "Before language, the nervous system already has an answer. Why somatic intelligence is central to leadership — and why we still don't train it.",
    author: "Ana Michelle",
    date: "2026-04-28",
    readMinutes: 8,
    tag: "Cuerpo",
  },
  {
    slug: "tierra-no-es-paciencia",
    titleEs: "Tierra no es paciencia",
    titleEn: "Earth isn't patience",
    excerptEs:
      "Confundimos enraizamiento con aguante. No son lo mismo: uno sostiene, el otro desgasta. Sobre cómo distinguir cuándo te estás parando firme y cuándo te estás cargando algo que no te corresponde.",
    excerptEn:
      "We confuse rootedness with endurance. They aren't the same: one sustains, the other erodes. How to tell when you're standing firm and when you're carrying something that isn't yours.",
    author: "Andrés Flores",
    date: "2026-04-09",
    readMinutes: 5,
    tag: "Tierra",
  },
];

export function pickLocale<T extends Record<string, unknown>>(
  obj: T,
  locale: Locale,
  baseKey: string,
): string {
  const key = `${baseKey}${locale === "es" ? "Es" : "En"}` as keyof T;
  return (obj[key] ?? obj[`${baseKey}Es` as keyof T]) as string;
}
