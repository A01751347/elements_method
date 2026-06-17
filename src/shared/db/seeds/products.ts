import type { NewProduct } from "../schema/products";

/**
 * LEGACY pricing model — kept in seed for backwards compatibility with the
 * Stripe/orders schema. The current public site no longer publishes per-module
 * prices: programs (Roots / Current / Source / Origin) are sold as integrated
 * journeys with pricing TBD pending founder confirmation. See content.ts.
 */
const MXN_PER_USD = 18;
const usd = (mxn: number) => Math.round(mxn / MXN_PER_USD) * 1; // round to nearest dollar

export const productSeeds: NewProduct[] = [
  // ─── 4 Elements (individual modules) ──────────────────────────────────
  {
    slug: "tierra",
    type: "elemento",
    element: "tierra",
    nameEs: "Tierra",
    nameEn: "Earth",
    descriptionEs:
      "Identidad, estabilidad y dirección. Un módulo intensivo de un día para entrenar la presencia que hace posible el liderazgo: arraigo bajo presión, consistencia, autoconocimiento profundo. Framework ROOTS — Reliability, Ownership, Openness, Truth, Stability.",
    descriptionEn:
      "Identity, stability, direction. A one-day intensive to train the presence that makes leadership possible: groundedness under pressure, consistency, deep self-knowledge. ROOTS framework — Reliability, Ownership, Openness, Truth, Stability.",
    includesEs:
      "Inmersión de día completo en naturaleza · Disconnection Protocol (Release, Encounter, Reflection, Dialogue, Integration) · Ejercicios Root Contact, Trust Audit, Ancestor Tree · Material de programa y journal · Café/comida durante la jornada",
    includesEn:
      "Full-day nature immersion · Disconnection Protocol (Release, Encounter, Reflection, Dialogue, Integration) · Root Contact, Trust Audit, Ancestor Tree exercises · Program materials and journal · Coffee/meals during the day",
    duration: "1 día",
    modality: "Presencial",
    priceMxn: "25000.00",
    priceUsd: String(usd(25000)),
    sortOrder: 10,
  },
  {
    slug: "fuego",
    type: "elemento",
    element: "fuego",
    nameEs: "Fuego",
    nameEn: "Fire",
    descriptionEs:
      "Visión, decisión y acción. Un módulo intensivo para sostener visión convincente, activar a otros hacia la acción con propósito y tener el coraje de transformar lo que ya no sirve. Framework IGNITE — Intention, Generativity, Nerve, Intensity, Transformation, Energizing.",
    descriptionEn:
      "Vision, decision, action. An intensive to hold a compelling vision, activate others into purposeful action, and find the courage to transform what no longer serves. IGNITE framework — Intention, Generativity, Nerve, Intensity, Transformation, Energizing.",
    includesEs:
      "Inmersión de día completo en naturaleza · Fire Council, Burning Letter, Vision Activation · Disconnection Protocol completo · Material de programa y journal · Café/comida",
    includesEn:
      "Full-day nature immersion · Fire Council, Burning Letter, Vision Activation · Full Disconnection Protocol · Program materials and journal · Coffee/meals",
    duration: "1 día",
    modality: "Presencial",
    priceMxn: "25000.00",
    priceUsd: String(usd(25000)),
    sortOrder: 20,
  },
  {
    slug: "agua",
    type: "elemento",
    element: "agua",
    nameEs: "Agua",
    nameEn: "Water",
    descriptionEs:
      "Regulación emocional, escucha profunda y fluidez adaptativa. Un módulo intensivo para moverse fluidamente a través de la complejidad, escuchar en profundidad y mantener claridad interna en condiciones turbulentas. Framework FLOW — Feel, Let Go, Orient, Witness.",
    descriptionEn:
      "Emotional regulation, deep listening, adaptive flow. An intensive to move fluidly through complexity, listen at depth, and maintain inner clarity in turbulent conditions. FLOW framework — Feel, Let Go, Orient, Witness.",
    includesEs:
      "Inmersión de día completo junto al agua · River Witness, Depth Interview, Adaptation Map · Disconnection Protocol completo · Material de programa y journal · Café/comida",
    includesEn:
      "Full-day immersion beside water · River Witness, Depth Interview, Adaptation Map · Full Disconnection Protocol · Program materials and journal · Coffee/meals",
    duration: "1 día",
    modality: "Presencial",
    priceMxn: "25000.00",
    priceUsd: String(usd(25000)),
    sortOrder: 30,
  },
  {
    slug: "aire",
    type: "elemento",
    element: "aire",
    nameEs: "Aire",
    nameEn: "Air",
    descriptionEs:
      "Perspectiva estratégica, comunicación precisa y libertad mental. Un módulo intensivo para pensar sistémicamente, comunicar con precisión y poder, y sostener perspectiva amplia. Framework CLEAR — Context, Lightness, Elevation, Articulation, Resonance.",
    descriptionEn:
      "Strategic perspective, precise communication, mental freedom. An intensive to think systemically, communicate with precision and power, and hold broad perspective. CLEAR framework — Context, Lightness, Elevation, Articulation, Resonance.",
    includesEs:
      "Inmersión de día completo en cumbre o paisaje abierto · Summit Perspective, Silence Practice, 100-Word Truth · Disconnection Protocol completo · Material de programa y journal · Café/comida",
    includesEn:
      "Full-day immersion on a summit or open landscape · Summit Perspective, Silence Practice, 100-Word Truth · Full Disconnection Protocol · Program materials and journal · Coffee/meals",
    duration: "1 día",
    modality: "Presencial",
    priceMxn: "25000.00",
    priceUsd: String(usd(25000)),
    sortOrder: 40,
  },

  // ─── 3 Programas (Caminos) ────────────────────────────────────────────
  // Source: elements-method-presentation.md "Our Programs"
  // Prices: TBD by client — using placeholder calculations.
  // Roots = 4 elementos + 8 coaching sessions + 4 grupos virtuales
  //       ≈ (4 * 25k) + value of 8 sessions + facilitación de grupos
  //       Placeholder: 130,000 MXN
  // Current = ongoing, 2 immersions/month + 2 coaching/month
  //       Placeholder MONTHLY: 50,000 MXN (subscription-like)
  // Source = ongoing, 4 immersions/month + 4 coaching/month, 1:1
  //       Placeholder MONTHLY: 120,000 MXN
  {
    slug: "roots",
    type: "camino",
    nameEs: "Roots — El Viaje",
    nameEn: "Roots — The Journey",
    descriptionEs:
      "Programa grupal de cuatro meses. Un viaje completo a través de los cuatro elementos, un mes por elemento. Una inmersión presencial al mes, dos sesiones de coaching individual y un círculo virtual grupal mensual. Para líderes que buscan profundidad y comunidad. Hasta 8 participantes.",
    descriptionEn:
      "Four-month group program. A full journey through all four elements, one element per month. One in-person immersion, two individual coaching sessions, and a monthly virtual group circle. For leaders seeking depth and community. Up to 8 participants.",
    includesEs:
      "4 inmersiones de día completo · 8 sesiones de coaching individual · 4 círculos virtuales grupales · Material de programa y journal · Acceso a comunidad de cohorte",
    includesEn:
      "4 full-day nature immersions · 8 individual coaching sessions · 4 group virtual circles · Program materials and journal · Cohort community access",
    duration: "4 meses",
    modality: "Presencial + virtual · Hasta 8 participantes",
    priceMxn: "130000.00",
    priceUsd: String(usd(130000)),
    sortOrder: 100,
  },
  {
    slug: "current",
    type: "camino",
    nameEs: "Current — La Intensiva",
    nameEn: "Current — The Intensive",
    descriptionEs:
      "Programa grupal continuo de cadencia acelerada para líderes que buscan transformación rápida y profunda. Dos inmersiones presenciales al mes y dos sesiones de coaching individual mensuales. La frecuencia aumentada genera momentum sostenido e integración elemental acelerada. Hasta 8 participantes.",
    descriptionEn:
      "Ongoing, accelerated group program for leaders seeking faster, deeper transformation. Two in-person nature immersions per month and two individual coaching sessions. The increased frequency creates sustained momentum and rapid elemental integration. Up to 8 participants.",
    includesEs:
      "2 inmersiones de día completo al mes · 2 sesiones de coaching individual al mes · Acceso prioritario al coach · Material de programa",
    includesEn:
      "2 full-day nature immersions/month · 2 coaching sessions/month · Priority coach access · Program materials",
    duration: "Continuo (mensual)",
    modality: "Presencial + virtual · Hasta 8 participantes",
    priceMxn: "50000.00",
    priceUsd: String(usd(50000)),
    sortOrder: 110,
  },
  {
    slug: "source",
    type: "camino",
    nameEs: "Source — Inmersión Total",
    nameEn: "Source — Full Immersion",
    descriptionEs:
      "Programa individual 1:1, nuestro ofrecimiento más completo. Diseñado exclusivamente para líderes individuales: cuatro inmersiones presenciales al mes, cuatro sesiones de coaching y un currículum diseñado completamente alrededor de tu contexto, tus filos y tu arco de desarrollo. Desarrollo de liderazgo al nivel más profundo posible.",
    descriptionEn:
      "Individual 1:1 program, our most complete offering. Designed exclusively for individual leaders: four in-person nature immersions per month, four coaching sessions, and a curriculum entirely designed around your specific context, edges, and developmental arc. Leadership development at the deepest possible level.",
    includesEs:
      "4 inmersiones de día completo al mes · 4 sesiones de coaching al mes · Diseño de currículum personalizado · Coach senior · Integración con retiros ejecutivos",
    includesEn:
      "4 full-day nature immersions/month · 4 coaching sessions/month · Custom curriculum design · Senior coach · Executive retreat integration",
    duration: "Continuo (mensual)",
    modality: "Presencial + virtual · 1 líder",
    priceMxn: "120000.00",
    priceUsd: String(usd(120000)),
    sortOrder: 120,
  },

  // ─── Retiro inmersivo (multi-día) ─────────────────────────────────────
  // Precio TBD por cliente — placeholder
  {
    slug: "retiro-inmersivo-3-dias",
    type: "retiro_inmersivo",
    nameEs: "Retiro Inmersivo · 3 días",
    nameEn: "Immersive Retreat · 3 days",
    descriptionEs:
      "Retiro inmersivo presencial de tres días que cubre los cuatro elementos en una sola experiencia continua. Diseñado para líderes que buscan transformación profunda en un formato concentrado.",
    descriptionEn:
      "Three-day in-person immersive retreat covering all four elements in a single continuous experience. Designed for leaders seeking deep transformation in a concentrated format.",
    includesEs:
      "Hospedaje y alimentación · Inmersiones por elemento (Tierra, Fuego, Agua, Aire) · Coaching grupal · Material y journal",
    includesEn:
      "Lodging and meals · Element-based immersions (Earth, Fire, Water, Air) · Group coaching · Materials and journal",
    duration: "3 días",
    modality: "Presencial",
    priceMxn: "85000.00",
    priceUsd: String(usd(85000)),
    sortOrder: 200,
  },

  // ─── Programa corporativo (cotización a la medida) ────────────────────
  {
    slug: "programa-corporativo",
    type: "programa_corporativo",
    nameEs: "Programa Corporativo",
    nameEn: "Corporate Program",
    descriptionEs:
      "Programas a la medida diseñados alrededor de inmersiones de equipo, desarrollo de cultura de liderazgo y transformación organizacional. Un programa puede llevar a un equipo directivo completo a través del marco de los Cuatro Elementos, creando lenguaje compartido, confianza y cultura alineada. Cotización a la medida.",
    descriptionEn:
      "Custom programs designed around team immersions, leadership culture development, and organizational transformation. A single program can bring an entire leadership team through the Four Elements framework, creating shared language, deepened trust, and aligned culture. Custom quote.",
    includesEs:
      "Discovery con dirección y RH · Diseño a la medida · Inmersiones por equipo · Indicadores de impacto · Cotización con desglose",
    includesEn:
      "Discovery with leadership and HR · Custom design · Team immersions · Impact indicators · Itemized quote",
    duration: "A definir",
    modality: "A definir",
    priceMxn: "0.00",
    priceUsd: "0",
    sortOrder: 300,
  },
];
