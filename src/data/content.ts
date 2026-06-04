/**
 * Elements Method — content layer.
 *
 * STRICT RULE: every fact, framework, exercise name, statistic, methodology and
 * pricing in this file is sourced from one of the four reference documents:
 *   - golden_circle.md
 *   - proyecto.md
 *   - elements-method-presentation.md
 *   - elements-methodologies.md
 *
 * Anything not present in those documents is either omitted or marked as TBD /
 * Lorem ipsum placeholder for the client to fill in.
 */

import type { Locale } from "@/i18n/config";

export type ElementKey = "agua" | "fuego" | "aire" | "tierra";

export interface ElementInfo {
  key: ElementKey;
  nameEs: string;
  nameEn: string;
  /** Framework acronym from elements-method-presentation.md */
  framework: string;
  /** Short label from proyecto.md "LOS 4 ELEMENTOS" */
  qualityEs: string;
  qualityEn: string;
  /** "The Essence of X Leadership" paragraph from presentation */
  natureEs: string;
  natureEn: string;
  /** Leadership translation from presentation */
  personEs: string;
  personEn: string;
  /** Framework breakdown (5 dimensions) from presentation */
  methodEs: string;
  methodEn: string;
  /** Aligned modalities from elements-methodologies.md */
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
    key: "tierra",
    nameEs: "Tierra",
    nameEn: "Earth",
    framework: "ROOTS",
    qualityEs: "Identidad, estabilidad y dirección",
    qualityEn: "Identity, stability, direction",
    natureEs:
      "La tierra es el elemento más paciente. No se apresura. No actúa. Sostiene — el peso de las montañas, las raíces de los bosques, los cuerpos de todo lo vivo. Es el elemento de la confiabilidad profunda: el tipo de presencia que hace posible el crecimiento genuino.",
    natureEn:
      "Earth is the most patient element. It does not hurry. It does not perform. It holds — the weight of mountains, the roots of forests, the bodies of every living thing. Earth is the element of deep reliability: the kind of presence that makes genuine growth possible.",
    personEs:
      "Liderazgo Tierra es la capacidad de ser una presencia estable y confiable en la que otros pueden enraizarse. Es estar arraigado bajo presión, consistente en el tiempo, y el auto-conocimiento profundo que permite al líder no temblar cuando todo a su alrededor tiembla.",
    personEn:
      "Earth leadership is the capacity to be a stable, trustworthy presence that others can root themselves in. It is groundedness under pressure, consistency over time, and the deep self-knowledge that allows a leader to be unshaken when everything around them shakes.",
    methodEs:
      "Framework ROOTS — Reliability (confiabilidad consistente), Ownership (responsabilidad total), Openness (estabilidad receptiva), Truth (honestidad radical), Stability (presencia regulada).",
    methodEn:
      "ROOTS framework — Reliability (consistent trustworthiness), Ownership (full accountability), Openness (receptive stability), Truth (radical honesty), Stability (regulated presence).",
    bodyEs:
      "Yoga (Yin, Restorative, Hatha, Ashtanga), Animal Flow, temazcal, Forest Bathing (Shinrin-yoku), Grounding/Earthing, Masaje y bodywork, Trail Running, Climbing, Equine-Assisted Coaching.",
    bodyEn:
      "Yoga (Yin, Restorative, Hatha, Ashtanga), Animal Flow, temazcal, Forest Bathing (Shinrin-yoku), Grounding/Earthing, Massage and bodywork, Trail Running, Climbing, Equine-Assisted Coaching.",
    accent: "var(--color-earth)",
    accentSoft: "var(--color-earth-soft)",
    animClass: "anim-earth",
  },
  {
    key: "fuego",
    nameEs: "Fuego",
    nameEn: "Fire",
    framework: "IGNITE",
    qualityEs: "Acción, energía y transformación",
    qualityEn: "Action, energy, transformation",
    natureEs:
      "El fuego es el elemento más transformador. No preserva — convierte. Todo lo que toca cambia: la madera se vuelve calor y luz, el mineral se vuelve metal, la masa se vuelve pan. El fuego quema lo que ya no sirve e ilumina lo que importa.",
    natureEn:
      "Fire is the most transformative element. It does not preserve — it converts. Everything fire touches is changed: wood becomes heat and light, ore becomes metal, dough becomes bread. Fire burns away what no longer serves and illuminates what matters.",
    personEs:
      "Liderazgo Fuego es la capacidad de sostener y comunicar una visión convincente, activar a otros hacia la acción con propósito, y tener el coraje de arder — arriesgar, fallar, transformarse — al servicio de algo que genuinamente importa.",
    personEn:
      "Fire leadership is the capacity to hold and communicate a compelling vision, to activate others into purposeful action, and to have the courage to burn — to risk, to fail, to transform — in service of something that genuinely matters.",
    methodEs:
      "Framework IGNITE — Intention (dirección con propósito), Generativity (activación creativa), Nerve (acción valiente), Intensity (presencia apasionada), Transformation (liderazgo del cambio), Energizing (inspirar y activar).",
    methodEn:
      "IGNITE framework — Intention (purposeful direction), Generativity (creative activation), Nerve (courageous action), Intensity (passionate presence), Transformation (change leadership), Energizing (inspiration and activation).",
    bodyEs:
      "Hot Yoga / Bikram, artes marciales dinámicas (Muay Thai, BJJ, Boxeo), bioenergética y liberación catártica, sauna y heat therapy, sauna infrarrojo, HIIT y sprint training, temazcal, cold-to-heat contrast.",
    bodyEn:
      "Hot Yoga / Bikram, dynamic martial arts (Muay Thai, BJJ, Boxing), bioenergetic and cathartic release, sauna and heat therapy, infrared sauna, HIIT and sprint training, temazcal, cold-to-heat contrast.",
    accent: "var(--color-fire)",
    accentSoft: "var(--color-fire-soft)",
    animClass: "anim-fire",
  },
  {
    key: "agua",
    nameEs: "Agua",
    nameEn: "Water",
    framework: "FLOW",
    qualityEs: "Inteligencia emocional, adaptabilidad y conexión",
    qualityEn: "Emotional intelligence, adaptability, connection",
    natureEs:
      "El agua es la fuerza más adaptativa de la naturaleza. Toma la forma de cada recipiente, encuentra el camino de menor resistencia, y con el tiempo talla cañones en piedra sólida. El poder del agua no nace de la fuerza, sino de la persistencia, la claridad y la inteligencia del flujo.",
    natureEn:
      "Water is the most adaptive force in nature. It takes the shape of every container, finds the path of least resistance, and yet — over time — carves canyons in solid rock. Water's power comes not from force, but from persistence, clarity, and the intelligence of flow.",
    personEs:
      "Liderazgo Agua es la capacidad de moverse con fluidez en la complejidad, escuchar a profundidad, mantener claridad interna en condiciones turbulentas y adaptarse sin perder dirección.",
    personEn:
      "Water leadership is the capacity to move fluidly through complexity, listen at depth, maintain inner clarity even in turbulent conditions, and adapt without losing direction.",
    methodEs:
      "Framework FLOW — Feel (inteligencia emocional y escucha), Let Go (flexibilidad adaptativa), Orient (claridad direccional), Witness (presencia reflexiva).",
    methodEn:
      "FLOW framework — Feel (emotional intelligence and listening), Let Go (adaptive flexibility), Orient (directional clarity), Witness (reflective presence).",
    bodyEs:
      "Watsu (Water Shiatsu), Somatic Experiencing, TRE, Dance/Movement Therapy, Cold Plunge e inmersión en agua fría, Contrast Therapy, Float Tank, Hidroterapia y Forest Bathing junto al agua.",
    bodyEn:
      "Watsu (Water Shiatsu), Somatic Experiencing, TRE, Dance/Movement Therapy, Cold Plunge and cold-water immersion, Contrast Therapy, Float Tank, Hydrotherapy and water-based Forest Bathing.",
    accent: "var(--color-water)",
    accentSoft: "var(--color-water-soft)",
    animClass: "anim-water",
  },
  {
    key: "aire",
    nameEs: "Aire",
    nameEn: "Air",
    framework: "CLEAR",
    qualityEs: "Pensamiento estratégico, perspectiva y visión",
    qualityEn: "Strategic thinking, perspective, vision",
    natureEs:
      "El aire es el elemento que más damos por sentado — porque es invisible, porque es constante, porque lo respiramos sin pensar. Y sin él, nada vive. El aire es la inteligencia de la perspectiva: la capacidad de ver el paisaje completo mientras se mantiene contacto con los detalles que importan.",
    natureEn:
      "Air is the element we most take for granted — because it is invisible, because it is constant, because we breathe it without thinking. And yet without it, nothing lives. Air is the intelligence of perspective: the capacity to see the full landscape while remaining in contact with the details that matter.",
    personEs:
      "Liderazgo Aire es la capacidad de pensar sistémicamente, comunicar con precisión y potencia, crear espacio donde otros puedan respirar y crecer, y sostener una perspectiva lo suficientemente amplia para servir a todos en el sistema.",
    personEn:
      "Air leadership is the capacity to think systemically, communicate with precision and power, create space where others can breathe and grow, and hold a perspective broad enough to serve everyone in the system.",
    methodEs:
      "Framework CLEAR — Context (perspectiva sistémica), Lightness (libertad del ego), Elevation (altitud estratégica), Articulation (comunicación precisa), Resonance (conexión e impacto).",
    methodEn:
      "CLEAR framework — Context (systemic perspective), Lightness (freedom from ego), Elevation (strategic altitude), Articulation (precise communication), Resonance (connection and impact).",
    bodyEs:
      "Pranayama (Nadi Shodhana, Ujjayi, Kapalabhati, Box Breathing 4-4-4-4), Wim Hof Method, Sound Healing y trabajo vocal, Tibetan Singing Bowls, Binaural Beats, Voice Activation y Toning, Gong Baths, Qigong y Tai Chi, Sensory Deprivation, Altitude Training, Meditación formal, Retiros de silencio.",
    bodyEn:
      "Pranayama (Nadi Shodhana, Ujjayi, Kapalabhati, Box Breathing 4-4-4-4), Wim Hof Method, Sound Healing and vocal work, Tibetan Singing Bowls, Binaural Beats, Voice Activation and Toning, Gong Baths, Qigong and Tai Chi, Sensory Deprivation, Altitude Training, formal meditation, silent retreats.",
    accent: "var(--color-air)",
    accentSoft: "var(--color-air-soft)",
    animClass: "anim-air",
  },
];

/**
 * The three programs from the presentation (Roots / Current / Source).
 * Pricing for these programs is NOT in the documents — we leave it as TBD.
 * Only single-module pricing is published (see `singleModulePricing` below).
 */
export interface PathInfo {
  slug: string;
  nameEs: string;
  nameEn: string;
  tagEs: string;
  tagEn: string;
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
  capacityEs: string;
  capacityEn: string;
  /** Pricing for full programs is not published in the source docs. */
  priceMxn: number | null;
  priceUsd: number | null;
}

export const paths: PathInfo[] = [
  {
    slug: "roots",
    nameEs: "Roots",
    nameEn: "Roots",
    tagEs: "The Journey",
    tagEn: "The Journey",
    shortEs: "Programa grupal · 4 meses · hasta 8 participantes.",
    shortEn: "Group Program · 4 Months · Up to 8 Participants.",
    longEs:
      "Recorrido de cuatro meses por los cuatro elementos. Cada mes se enfoca en un elemento — una inmersión presencial, dos sesiones de coaching individual y un círculo grupal virtual de integración. Diseñado para líderes que buscan profundidad y comunidad.",
    longEn:
      "A four-month journey through all four elements. Each month focuses on one element — one in-person immersion, two individual coaching sessions, and one virtual group integration circle. Designed for leaders who want depth and community.",
    includesEs: [
      "4 inmersiones presenciales de día completo en naturaleza",
      "8 sesiones de coaching individual",
      "4 círculos grupales virtuales",
      "Material del programa y journal",
    ],
    includesEn: [
      "4 full-day nature immersions",
      "8 coaching sessions",
      "4 group virtual circles",
      "Program materials and journal",
    ],
    modalityEs: "Grupal · hasta 8 participantes",
    modalityEn: "Group · up to 8 participants",
    durationEs: "4 meses",
    durationEn: "4 months",
    capacityEs: "Hasta 8 participantes",
    capacityEn: "Up to 8 participants",
    priceMxn: null,
    priceUsd: null,
  },
  {
    slug: "current",
    nameEs: "Current",
    nameEn: "Current",
    tagEs: "The Intensive",
    tagEn: "The Intensive",
    shortEs: "Programa grupal · sostenido · hasta 8 participantes.",
    shortEn: "Group Program · Ongoing · Up to 8 Participants.",
    longEs:
      "Programa de inmersión acelerado para líderes que buscan transformación más rápida y profunda. Dos inmersiones presenciales por mes y dos sesiones de coaching individual al mes. La frecuencia aumentada crea momentum sostenido e integración elemental rápida.",
    longEn:
      "An accelerated immersion program for leaders who want faster, deeper transformation. Two in-person nature immersions per month and two individual coaching sessions. The increased frequency creates sustained momentum and rapid elemental integration.",
    includesEs: [
      "2 inmersiones presenciales de día completo / mes",
      "2 sesiones de coaching individual / mes",
      "Acceso prioritario al coach",
      "Material del programa",
    ],
    includesEn: [
      "2 full-day nature immersions / month",
      "2 coaching sessions / month",
      "Priority coach access",
      "Program materials",
    ],
    modalityEs: "Grupal · hasta 8 participantes",
    modalityEn: "Group · up to 8 participants",
    durationEs: "Sostenido (ongoing)",
    durationEn: "Ongoing",
    capacityEs: "Hasta 8 participantes",
    capacityEn: "Up to 8 participants",
    priceMxn: null,
    priceUsd: null,
  },
  {
    slug: "source",
    nameEs: "Source",
    nameEn: "Source",
    tagEs: "Full Immersion",
    tagEn: "Full Immersion",
    shortEs: "Programa individual · sostenido · 1:1.",
    shortEn: "Individual Program · Ongoing · One Leader.",
    longEs:
      "Nuestra oferta más completa, diseñada exclusivamente para líderes individuales. Cuatro inmersiones presenciales por mes, cuatro sesiones de coaching, y un programa enteramente diseñado alrededor del líder — su contexto, sus filos, su arco de desarrollo. Es desarrollo de liderazgo al nivel más profundo posible.",
    longEn:
      "Our most complete offering, designed exclusively for individual leaders. Four in-person nature immersions per month, four coaching sessions, and a program that is entirely designed around the specific leader — their context, their edges, their developmental arc. This is leadership development at the deepest possible level.",
    includesEs: [
      "4 inmersiones presenciales de día completo / mes",
      "4 sesiones de coaching individual / mes",
      "Diseño curricular a la medida",
      "Coach senior",
      "Integración con retiro ejecutivo",
    ],
    includesEn: [
      "4 full-day nature immersions / month",
      "4 coaching sessions / month",
      "Custom curriculum design",
      "Senior coach",
      "Executive retreat integration",
    ],
    modalityEs: "Individual · 1:1",
    modalityEn: "Individual · 1:1",
    durationEs: "Sostenido (ongoing)",
    durationEn: "Ongoing",
    capacityEs: "Un líder",
    capacityEn: "One leader",
    priceMxn: null,
    priceUsd: null,
  },
];

/**
 * Single-module pricing — the only public pricing in proyecto.md.
 * "4 módulos independientes · 1 día al mes cada uno · cupo limitado a 15"
 */
export const singleModulePricing = {
  standardMxn: 25000,
  earlyBirdMxn: 22000,
  groupMxn: 20000, // 3+
  capacity: 15,
};

/**
 * Single-day modules calendar — the documents describe the format (4 modules,
 * 1 day per month, 15-person capacity) but do NOT publish specific dates or
 * locations. We expose the structure with TBD details for the client to fill.
 */
export interface RetreatInfo {
  id: string;
  nameEs: string;
  nameEn: string;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  modalityEs: string;
  modalityEn: string;
  elementsCovered: ElementKey[];
  priceMxn: number;
  priceUsd: number | null;
  capacity: number;
  sold: number;
  imageHue: string;
  image: string;
}

export const retreats: RetreatInfo[] = [
  {
    id: "earth-module",
    nameEs: "Módulo Tierra · ROOTS",
    nameEn: "Earth Module · ROOTS",
    startDate: null,
    endDate: null,
    location: null,
    modalityEs: "Inmersión · 1 día completo · cupo 15",
    modalityEn: "Immersion · 1 full day · capacity 15",
    elementsCovered: ["tierra"],
    priceMxn: singleModulePricing.standardMxn,
    priceUsd: null,
    capacity: 15,
    sold: 0,
    imageHue: "var(--color-earth-soft)",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=85&auto=format&fit=crop",
  },
  {
    id: "water-module",
    nameEs: "Módulo Agua · FLOW",
    nameEn: "Water Module · FLOW",
    startDate: null,
    endDate: null,
    location: null,
    modalityEs: "Inmersión · 1 día completo · cupo 15",
    modalityEn: "Immersion · 1 full day · capacity 15",
    elementsCovered: ["agua"],
    priceMxn: singleModulePricing.standardMxn,
    priceUsd: null,
    capacity: 15,
    sold: 0,
    imageHue: "var(--color-water-soft)",
    image:
      "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?w=1600&q=85&auto=format&fit=crop",
  },
  {
    id: "fire-module",
    nameEs: "Módulo Fuego · IGNITE",
    nameEn: "Fire Module · IGNITE",
    startDate: null,
    endDate: null,
    location: null,
    modalityEs: "Inmersión · 1 día completo · cupo 15",
    modalityEn: "Immersion · 1 full day · capacity 15",
    elementsCovered: ["fuego"],
    priceMxn: singleModulePricing.standardMxn,
    priceUsd: null,
    capacity: 15,
    sold: 0,
    imageHue: "var(--color-fire-soft)",
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&q=85&auto=format&fit=crop",
  },
  {
    id: "air-module",
    nameEs: "Módulo Aire · CLEAR",
    nameEn: "Air Module · CLEAR",
    startDate: null,
    endDate: null,
    location: null,
    modalityEs: "Inmersión · 1 día completo · cupo 15",
    modalityEn: "Immersion · 1 full day · capacity 15",
    elementsCovered: ["aire"],
    priceMxn: singleModulePricing.standardMxn,
    priceUsd: null,
    capacity: 15,
    sold: 0,
    imageHue: "var(--color-air-soft)",
    image:
      "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=1600&q=85&auto=format&fit=crop",
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

/**
 * Testimonials. The source documents do not include any specific testimonial
 * quotes, names, or companies. Left empty for client to populate.
 */
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

export const testimonials: Testimonial[] = [];

/**
 * Stats sourced directly from elements-method-presentation.md (pages 4 and 8).
 */
export const stats = [
  {
    value: 76,
    suffix: "%",
    labelEs: "Líderes con burnout o agotamiento emocional",
    labelEn: "Leaders reporting burnout or emotional depletion",
    source: "Cited in Elements Method presentation",
  },
  {
    value: 3,
    suffix: "x",
    labelEs: "Más engagement bajo líderes auto-conscientes",
    labelEn: "Higher engagement under self-aware leaders",
    source: "Tasha Eurich · Harvard Business Review",
  },
  {
    value: 27,
    suffix: "%",
    labelEs: "Más crecimiento de revenue en culturas con seguridad psicológica",
    labelEn: "Higher revenue growth in psychologically safe cultures",
    source: "Google · Project Aristotle",
  },
  {
    value: 21,
    suffix: "%",
    labelEs: "Menos cortisol tras 20 minutos en naturaleza",
    labelEn: "Less cortisol after 20 minutes in nature",
    source: "University of Michigan · Hunter et al. 2019",
  },
];

/**
 * Disconnection Protocol — verbatim from elements-method-presentation.md page 8.
 */
export interface ProcessStep {
  n: string;
  titleEs: string;
  titleEn: string;
  durationEs: string;
  durationEn: string;
  bodyEs: string;
  bodyEn: string;
}

export const processSteps: ProcessStep[] = [
  {
    n: "01",
    titleEs: "Release · Liberar",
    titleEn: "Release",
    durationEs: "0–60 min",
    durationEn: "0–60 min",
    bodyEs:
      "Llegar físicamente. Soltar los dispositivos. Dejar que el sistema nervioso comience a aterrizar. El silencio es bienvenido.",
    bodyEn:
      "Physically arrive. Put down devices. Let the nervous system begin to settle. Silence is welcome.",
  },
  {
    n: "02",
    titleEs: "Encounter · Encontrar",
    titleEn: "Encounter",
    durationEs: "1–3 hrs",
    durationEn: "1–3 hrs",
    bodyEs:
      "Encuentro con el elemento — a través de experiencia sensorial directa, observación facilitada y presencia somática.",
    bodyEn:
      "Meet the element — through direct sensory experience, facilitated observation, and somatic presence.",
  },
  {
    n: "03",
    titleEs: "Reflection · Reflejar",
    titleEn: "Reflection",
    durationEs: "30–60 min",
    durationEn: "30–60 min",
    bodyEs:
      "Journaling individual y reflexión en silencio. El elemento como espejo. ¿Qué me muestra sobre mi liderazgo?",
    bodyEn:
      "Individual journaling and silent reflection. The element as mirror. What is it showing me about my leadership?",
  },
  {
    n: "04",
    titleEs: "Dialogue · Dialogar",
    titleEn: "Dialogue",
    durationEs: "60–90 min",
    durationEn: "60–90 min",
    bodyEs:
      "Conversación grupal facilitada. ¿Qué emergió? ¿Qué sorprendió? ¿Cuál es el filo que este elemento revela?",
    bodyEn:
      "Facilitated group conversation. What emerged? What surprised? What is the edge this element reveals?",
  },
  {
    n: "05",
    titleEs: "Integration · Integrar",
    titleEn: "Integration",
    durationEs: "30–60 min",
    durationEn: "30–60 min",
    bodyEs:
      "Ritual de cierre ligado al elemento. Un compromiso. Una intención. El puente de regreso a la vida organizacional.",
    bodyEn:
      "Closing ritual tied to the element. One commitment. One intention. The bridge back to organizational life.",
  },
];

/**
 * FAQs. The source documents don't have an explicit FAQ section, so we
 * only include questions whose answer is grounded in the documents.
 */
export const faqs = [
  {
    qEs: "¿Qué es Elements Method exactamente?",
    qEn: "What exactly is Elements Method?",
    aEs:
      "Una intervención estratégica diseñada para fortalecer la calidad de pensamiento, la regulación emocional y la capacidad de decisión del líder moderno. Trabajamos sobre el sistema interno desde donde se decide — no añadimos herramientas, intervenimos el estado interno.",
    aEn:
      "A strategic intervention designed to strengthen the modern leader's quality of thinking, emotional regulation and decision-making capacity. We work on the inner system you decide from — we don't add tools, we intervene the inner state.",
  },
  {
    qEs: "¿Qué metodologías integra?",
    qEn: "Which methodologies does it integrate?",
    aEs:
      "Neurociencia aplicada al desempeño, Programación Neurolingüística (PNL), Coaching internacional, Frameworks estratégicos y Técnicas de regulación interna (meditación, breathwork, journaling, introspección).",
    aEn:
      "Applied performance neuroscience, Neuro-Linguistic Programming (NLP), international coaching, strategic frameworks, and inner-regulation techniques (meditation, breathwork, journaling, introspection).",
  },
  {
    qEs: "¿Para quién está diseñado?",
    qEn: "Who is it designed for?",
    aEs:
      "Líderes empresariales, directores, fundadores y tomadores de decisión. Personas que entienden que evolucionar su liderazgo es una ventaja competitiva.",
    aEn:
      "Business leaders, directors, founders and decision-makers. People who understand that evolving their leadership is a competitive advantage.",
  },
  {
    qEs: "¿Cuál es el formato?",
    qEn: "What is the format?",
    aEs:
      "Cuatro módulos independientes. Un día al mes cada uno. Cupo limitado a 15 participantes por módulo. Formato intensivo.",
    aEn:
      "Four independent modules. One day per month each. Capacity capped at 15 participants per module. Intensive format.",
  },
  {
    qEs: "¿Cuáles son los resultados esperados?",
    qEn: "What are the expected results?",
    aEs:
      "Mayor claridad estratégica, mejor priorización, decisiones con mayor precisión, reducción de ruido mental, mejor regulación de presión, mayor congruencia personal-profesional, control de emociones, estructura mental, alcance de objetivos personales y profesionales.",
    aEn:
      "Greater strategic clarity, better prioritization, more precise decisions, reduced mental noise, better pressure regulation, greater personal-professional congruence, emotional control, mental structure, achievement of personal and professional objectives.",
  },
];

/**
 * Three axes drawn from the methodology categories of elements-methodologies.md.
 * Each axis groups modalities the practitioner can deploy.
 */
export interface ModalityAxis {
  slug: string;
  nameEs: string;
  nameEn: string;
  taglineEs: string;
  taglineEn: string;
  bodyEs: string;
  bodyEn: string;
  modalitiesEs: string[];
  modalitiesEn: string[];
  image: string;
  primaryElement: ElementKey;
}

export const modalityAxes: ModalityAxis[] = [
  {
    slug: "cognitive",
    nameEs: "Coaching y PNL",
    nameEn: "Coaching & NLP",
    taglineEs: "Mente · lenguaje · decisión",
    taglineEn: "Mind · language · decision",
    bodyEs:
      "Métodos de coaching internacional y Programación Neurolingüística. Trabajan el nivel de la representación interna y los patrones inconscientes.",
    bodyEn:
      "International coaching methods and Neuro-Linguistic Programming. They work the level of internal representation and unconscious patterning.",
    modalitiesEs: [
      "NLP Meta-Model · Reframing · Perceptual Positions",
      "Clean Language (David Grove)",
      "Milton Model · Submodalities · Anchoring",
      "Motivational Interviewing · OARS",
      "Results Coaching · GROW · WOOP",
      "Co-Active Coaching · Ontological Coaching",
      "Executive Presence Coaching · Systemic Coaching",
    ],
    modalitiesEn: [
      "NLP Meta-Model · Reframing · Perceptual Positions",
      "Clean Language (David Grove)",
      "Milton Model · Submodalities · Anchoring",
      "Motivational Interviewing · OARS",
      "Results Coaching · GROW · WOOP",
      "Co-Active Coaching · Ontological Coaching",
      "Executive Presence Coaching · Systemic Coaching",
    ],
    image:
      "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=1600&q=85&auto=format&fit=crop",
    primaryElement: "aire",
  },
  {
    slug: "psychological",
    nameEs: "Psicología y neurociencia",
    nameEn: "Psychology & neuroscience",
    taglineEs: "Regulación · perspectiva · sentido",
    taglineEn: "Regulation · perspective · meaning",
    bodyEs:
      "Frameworks psicológicos y descubrimientos de neurociencia aplicados al desempeño. Lo que ya está probado en clínica, traducido al liderazgo.",
    bodyEn:
      "Psychological frameworks and neuroscience findings applied to performance. What's already proven in clinic, translated for leadership.",
    modalitiesEs: [
      "ACT · Defusion · Psychological Flexibility",
      "Focusing (Eugene Gendlin) · EFT · DBT",
      "Internal Family Systems (Richard Schwartz)",
      "Logotherapy (Frankl) · Positive Psychology (PERMA)",
      "CBT · MBCT · Schema Therapy · Narrative Therapy",
      "Polyvagal Theory (Porges) · Default Mode Network",
      "Dopamine systems · Amygdala regulation · PFC activation",
    ],
    modalitiesEn: [
      "ACT · Defusion · Psychological Flexibility",
      "Focusing (Eugene Gendlin) · EFT · DBT",
      "Internal Family Systems (Richard Schwartz)",
      "Logotherapy (Frankl) · Positive Psychology (PERMA)",
      "CBT · MBCT · Schema Therapy · Narrative Therapy",
      "Polyvagal Theory (Porges) · Default Mode Network",
      "Dopamine systems · Amygdala regulation · PFC activation",
    ],
    image:
      "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?w=1600&q=85&auto=format&fit=crop",
    primaryElement: "agua",
  },
  {
    slug: "somatic",
    nameEs: "Práctica somática y fisiológica",
    nameEn: "Somatic & physiological practice",
    taglineEs: "Cuerpo · respiración · regulación",
    taglineEn: "Body · breath · regulation",
    bodyEs:
      "Las modalidades que tocan el sistema nervioso directamente — donde el lenguaje no llega. Lo que entrena la fisiología que sostiene el liderazgo.",
    bodyEn:
      "Modalities that touch the nervous system directly — where language can't reach. What trains the physiology that holds leadership.",
    modalitiesEs: [
      "Pranayama (Nadi Shodhana, Ujjayi, Kapalabhati, Box Breathing)",
      "Wim Hof Method · Holotropic Breathwork",
      "Cold Plunge · Contrast Therapy · Float Tank",
      "Sauna · Heat Therapy · Infrared · HIIT",
      "Temazcal ceremonial · Hot Yoga · Bioenergetics",
      "Yin Yoga · Restorative · Animal Flow",
      "Watsu · Somatic Experiencing · TRE",
      "Forest Bathing · Grounding · Sound Healing · Qigong",
    ],
    modalitiesEn: [
      "Pranayama (Nadi Shodhana, Ujjayi, Kapalabhati, Box Breathing)",
      "Wim Hof Method · Holotropic Breathwork",
      "Cold Plunge · Contrast Therapy · Float Tank",
      "Sauna · Heat Therapy · Infrared · HIIT",
      "Ceremonial Temazcal · Hot Yoga · Bioenergetics",
      "Yin Yoga · Restorative · Animal Flow",
      "Watsu · Somatic Experiencing · TRE",
      "Forest Bathing · Grounding · Sound Healing · Qigong",
    ],
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&q=85&auto=format&fit=crop",
    primaryElement: "fuego",
  },
];

/**
 * Practitioner-grade exercises documented in the presentation (pages 11-25).
 * Names and descriptions taken verbatim from the source.
 */
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
    | "Sparkles"
    | "Eye"
    | "MessageCircle"
    | "PenLine"
    | "Trees"
    | "Cloud";
  titleEs: string;
  titleEn: string;
  bodyEs: string;
  bodyEn: string;
  durationEs: string;
  durationEn: string;
  element: ElementKey;
}

export const practices: PracticeInfo[] = [
  // EARTH (ROOTS) — three exercises from page 23-25
  {
    iconName: "Trees",
    titleEs: "The Root Contact",
    titleEn: "The Root Contact",
    bodyEs:
      "Descalzo sobre la tierra del bosque, 30 minutos en silencio. Contacto directo con el suelo: textura, temperatura, olor. Una sola instrucción: notar dónde sí, y dónde no, sientes el suelo en tu cuerpo. Tres preguntas de cierre.",
    bodyEn:
      "Barefoot on forest ground, 30 minutes in silence. Direct contact with the soil: texture, temperature, smell. One instruction: notice where in your body you feel the ground — and where you don't. Three closing questions.",
    durationEs: "60 min · individual",
    durationEn: "60 min · individual",
    element: "tierra",
  },
  {
    iconName: "PenLine",
    titleEs: "The Trust Audit",
    titleEn: "The Trust Audit",
    bodyEs:
      "Auditoría personal de confianza — no de los demás, de uno mismo. Para cada relación clave: ¿esta persona me experimenta como confiable? ¿Le digo la verdad o una versión administrada? Compromiso a 30 días.",
    bodyEn:
      "Personal trust audit — not of others, of yourself. For each key relationship: does this person experience me as reliable? Do I tell them the truth or a managed version? 30-day commitment.",
    durationEs: "90 min · pares",
    durationEn: "90 min · pairs",
    element: "tierra",
  },
  // FIRE (IGNITE) — three exercises from page 15-17
  {
    iconName: "Flame",
    titleEs: "The Fire Council",
    titleEn: "The Fire Council",
    bodyEs:
      "Círculo alrededor del fuego sin agenda los primeros 60 minutos. Dos preguntas: ¿cuál es la visión que cargas y aún no has hablado completamente? ¿Cuál es el fuego que has mantenido demasiado pequeño — y por qué? El grupo escucha en silencio.",
    bodyEn:
      "Circle around a fire with no agenda for the first 60 minutes. Two questions: what is the vision you carry that you have not yet fully spoken? What is the fire you have been keeping too small — and why? The group listens in silence.",
    durationEs: "3–4 h · grupo",
    durationEn: "3–4 h · group",
    element: "fuego",
  },
  {
    iconName: "PenLine",
    titleEs: "The Burning Letter",
    titleEn: "The Burning Letter",
    bodyEs:
      "Dos cartas. La primera: a la identidad de liderazgo que estás soltando. La segunda: desde tu yo futuro. La primera se quema. La segunda se lee en voz alta a una pareja. Cierre neurológico genuino que el reconocimiento intelectual no logra.",
    bodyEn:
      "Two letters. The first: to the leadership identity you are releasing. The second: from your future self. The first is burned. The second is read aloud to a trusted partner. Genuine neurological closure intellectual acknowledgment alone cannot achieve.",
    durationEs: "60–90 min · individual",
    durationEn: "60–90 min · individual",
    element: "fuego",
  },
  // WATER (FLOW) — three exercises from page 11-13
  {
    iconName: "Eye",
    titleEs: "The River Witness",
    titleEn: "The River Witness",
    bodyEs:
      "Solo, junto a agua en movimiento, mínimo 20 minutos en silencio. Una instrucción: observa el agua y nota qué te muestra sobre tu liderazgo. Tres preguntas: ¿dónde peleas la corriente? ¿Qué soltarías? ¿Qué sabe tu agua que tu mente no?",
    bodyEn:
      "Alone, beside moving water, minimum 20 minutes in silence. One instruction: observe the water and notice what it shows you about your leadership. Three questions: where are you fighting the current? What would the river let go? What does your water know that your mind doesn't?",
    durationEs: "45–60 min · individual",
    durationEn: "45–60 min · individual",
    element: "agua",
  },
  {
    iconName: "MessageCircle",
    titleEs: "The Depth Interview",
    titleEn: "The Depth Interview",
    bodyEs:
      "Pareja: hablante y oyente profundo. El oyente solo puede preguntar 'cuéntame más' o 'qué más'. Sin arreglar, sin consejo, sin redirigir. El impulso de interrumpir es la data.",
    bodyEn:
      "Pair: speaker and deep listener. The listener may only ask 'what else?' or 'say more about that.' No fixing, no advice, no redirecting. The urge to interrupt is the data.",
    durationEs: "60 min · pares",
    durationEn: "60 min · pairs",
    element: "agua",
  },
  // AIR (CLEAR) — three exercises from page 19-21
  {
    iconName: "Mountain",
    titleEs: "The Summit Perspective",
    titleEn: "The Summit Perspective",
    bodyEs:
      "Asciende a un punto elevado — colina, acantilado, paisaje abierto. 20 minutos en silencio observando. Tres preguntas que van de lo literal a lo metafórico: ¿qué ves desde aquí que no se ve abajo? ¿Qué requiere de ti esta altitud? ¿Qué harías distinto si pudieras ver siempre desde aquí?",
    bodyEn:
      "Climb to an elevated position — hilltop, cliff, open landscape. 20 minutes in silence observing. Three questions from literal to metaphorical: what can you see from here that you cannot see from the ground? What in your organization requires you to be at this altitude? What would you do differently if you could always see from here?",
    durationEs: "60 min · individual",
    durationEn: "60 min · individual",
    element: "aire",
  },
  {
    iconName: "PenLine",
    titleEs: "The 100-Word Truth",
    titleEn: "The 100-Word Truth",
    bodyEs:
      "Escribe exactamente 100 palabras sobre tu desafío de liderazgo más importante. Ni más, ni menos. Lee en voz alta al grupo; el grupo responde con tres palabras que les marcaron. Segunda ronda: 10 palabras. Tercera ronda: una sola palabra — la brújula de los meses siguientes.",
    bodyEn:
      "Write exactly 100 words about the most important leadership challenge you are facing. No more, no fewer. Read aloud to the group; the group responds with the three words that captured them. Round two: 10 words. Round three: one single word — your compass for the months ahead.",
    durationEs: "45 min · individual + grupo",
    durationEn: "45 min · individual + group",
    element: "aire",
  },
];

/**
 * "WHAT WE OFFER" — three programs structure from presentation page 2.
 * Used as a lexicon strip on the home (just the names and their qualities).
 */
export const lexiconEs = [
  "Pensar mejor",
  "Decidir mejor",
  "Liderar mejor",
  "Tierra · ROOTS",
  "Fuego · IGNITE",
  "Agua · FLOW",
  "Aire · CLEAR",
  "Release",
  "Encounter",
  "Reflection",
  "Dialogue",
  "Integration",
];

export const lexiconEn = [
  "Better thinking",
  "Better decisions",
  "Better leadership",
  "Earth · ROOTS",
  "Fire · IGNITE",
  "Water · FLOW",
  "Air · CLEAR",
  "Release",
  "Encounter",
  "Reflection",
  "Dialogue",
  "Integration",
];

/**
 * Five Circles of Impact — verbatim from elements-method-presentation.md page 6.
 */
export interface ImpactCircleInfo {
  level: string;
  whoEs: string;
  whoEn: string;
  titleEs: string;
  titleEn: string;
  bodyEs: string;
  bodyEn: string;
}

export const impactCircles: ImpactCircleInfo[] = [
  {
    level: "01",
    whoEs: "El líder (self)",
    whoEn: "The leader (self)",
    titleEs: "Nucleus",
    titleEn: "Nucleus",
    bodyEs:
      "Estado interno · Valores · Sistema nervioso · Presencia · Propósito · Identidad.",
    bodyEn:
      "Inner state · Values · Nervous system · Presence · Purpose · Identity.",
  },
  {
    level: "02",
    whoEs: "Reportes directos · Equipo",
    whoEn: "Direct reports · Team",
    titleEs: "Relationship",
    titleEn: "Relationship",
    bodyEs:
      "Confianza · Seguridad · Comunicación · Motivación · Desarrollo.",
    bodyEn:
      "Trust · Safety · Communication · Motivation · Development.",
  },
  {
    level: "03",
    whoEs: "Departamento · División",
    whoEn: "Department · Division",
    titleEs: "Culture",
    titleEn: "Culture",
    bodyEs:
      "Normas · Rituales · Patrones de decisión · Estilo de conflicto · Energía.",
    bodyEn:
      "Norms · Rituals · Decision patterns · Conflict style · Energy.",
  },
  {
    level: "04",
    whoEs: "Compañía completa",
    whoEn: "Whole company",
    titleEs: "Organization",
    titleEn: "Organization",
    bodyEs:
      "Estrategia · Marca · Resultados · Innovación · Resiliencia.",
    bodyEn:
      "Strategy · Brand · Results · Innovation · Resilience.",
  },
  {
    level: "05",
    whoEs: "Comunidad · Industria",
    whoEn: "Community · Industry",
    titleEs: "World",
    titleEn: "World",
    bodyEs:
      "Legado · Impacto · Contribución · Liderazgo regenerativo.",
    bodyEn:
      "Legacy · Impact · Contribution · Regenerative leadership.",
  },
];

/**
 * The core mantra — combines the central line of golden_circle.md and
 * the insight that opens proyecto.md.
 */
export const mantraEs =
  "La calidad de nuestras decisiones determina la calidad de nuestros resultados — y la calidad de nuestras decisiones depende del estado interno desde donde pensamos.";
export const mantraEn =
  "The quality of our decisions determines the quality of our results — and the quality of our decisions depends on the inner state we think from.";

/**
 * Client logos. The documents do not name specific client companies.
 * Lorem ipsum placeholders left for the client to replace.
 */
export const clientLogos = [
  { name: "Lorem", initials: "LR" },
  { name: "Ipsum", initials: "IP" },
  { name: "Dolor", initials: "DR" },
  { name: "Sit", initials: "ST" },
  { name: "Amet", initials: "AM" },
  { name: "Consectetur", initials: "CN" },
];

/**
 * Blog posts. Not present in the source documents.
 * Empty array — the section either hides or shows a placeholder.
 */
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

export const blogPosts: BlogPost[] = [];

/**
 * Results listed in proyecto.md ("RESULTADOS" section) — used in the
 * "What you'll get" copy across pages.
 */
export const resultsEs = [
  "Mayor claridad estratégica",
  "Mejor priorización",
  "Decisiones con mayor precisión",
  "Reducción de ruido mental",
  "Mejor regulación de presión",
  "Mayor congruencia personal-profesional",
  "Control de emociones",
  "Estructura mental",
  "Alcance de objetivos personales y profesionales",
];

export const resultsEn = [
  "Greater strategic clarity",
  "Better prioritization",
  "More precise decisions",
  "Reduced mental noise",
  "Better pressure regulation",
  "Greater personal-professional congruence",
  "Emotional control",
  "Mental structure",
  "Achievement of personal and professional objectives",
];

/**
 * Audience listed in proyecto.md ("PARA QUIÉN ES" section).
 */
export const audienceEs = [
  "Líderes empresariales",
  "Directores",
  "Fundadores",
  "Tomadores de decisión",
];

export const audienceEn = [
  "Business leaders",
  "Directors",
  "Founders",
  "Decision-makers",
];

export function pickLocale<T extends Record<string, unknown>>(
  obj: T,
  locale: Locale,
  baseKey: string,
): string {
  const key = `${baseKey}${locale === "es" ? "Es" : "En"}` as keyof T;
  return (obj[key] ?? obj[`${baseKey}Es` as keyof T]) as string;
}
