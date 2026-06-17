/**
 * Elements Method — content layer.
 *
 * STRICT RULE: every fact, framework, exercise name, statistic, methodology and
 * structural detail in this file is sourced VERBATIM from one of:
 *   - docs/golden_circle.md
 *   - docs/proyecto.md
 *   - docs/elements-method-presentation.md
 *   - docs/elements-methodologies.md
 *   - docs/Elements/elements-master document.docx
 *   - docs/Elements/elements-website-content.pptx
 *
 * Anything not present in those documents is either omitted or marked TBD.
 */

import type { Locale } from "@/i18n/config";

/** The four trainable elements + the integrating fifth (Éter / Núcleo). */
export type ElementKey = "agua" | "fuego" | "aire" | "tierra" | "eter";

export interface ElementInfo {
  key: ElementKey;
  nameEs: string;
  nameEn: string;
  /** Framework acronym (ROOTS / IGNITE / FLOW / CLEAR). Éter has no acronym. */
  framework: string | null;
  /** Tagline triad from elements-website-content.pptx slide 7. */
  qualityEs: string;
  qualityEn: string;
  /** Long descriptor verbatim from pptx slides 3 + 7. */
  cultivaEs: string;
  cultivaEn: string;
  /** Pull-quote from master doc — guion maestro de medios. */
  quoteEs: string;
  quoteEn: string;
  /** "En la naturaleza" — essence-of-element from presentation. */
  natureEs: string;
  natureEn: string;
  /** Framework breakdown (the X letters of FLOW / IGNITE / CLEAR / ROOTS). */
  methodEs: string;
  methodEn: string;
  /** Aligned modality stack from elements-methodologies.md. */
  bodyEs: string;
  bodyEn: string;
  /** Immersion experience headline from pptx slide 5. */
  experienceEs: string;
  experienceEn: string;
  /** Official brand colors from master doc. */
  accent: string;
  accentSoft: string;
  /** AAA-compliant dark variant of `accent` (≥7:1 on Lino). Use for any
   *  element-colored TEXT or small icon; `accent` is for fills/decoration. */
  accentInk: string;
  animClass: string;
}

export const elementImages: Record<ElementKey, string> = {
  agua: "https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=1200&q=80&auto=format&fit=crop",
  fuego: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop",
  aire: "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?w=1200&q=80&auto=format&fit=crop",
  tierra: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80&auto=format&fit=crop",
  eter: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&q=80&auto=format&fit=crop",
};

export const elements: ElementInfo[] = [
  {
    key: "tierra",
    nameEs: "Tierra",
    nameEn: "Earth",
    framework: "ROOTS",
    qualityEs: "Arraigo · Confianza · Raíces",
    qualityEn: "Groundedness · Trust · Roots",
    cultivaEs:
      "Encarna al líder que ancla a su equipo, construye confianza duradera y crea entornos donde personas y organizaciones florecen. La Tierra enseña que la fuerza real crece desde raíces profundas.",
    cultivaEn:
      "Embody the leader who anchors their team, builds lasting trust, and creates environments where people and organizations flourish. Earth teaches us that true strength grows from deep roots.",
    quoteEs: "Todo gran árbol creció primero hacia abajo.",
    quoteEn: "Every great tree first grew downward.",
    natureEs:
      "La tierra es el elemento más paciente. No se apresura. No actúa. Sostiene — el peso de las montañas, las raíces de los bosques, los cuerpos de todo lo vivo. Es el elemento de la confiabilidad profunda: el tipo de presencia que hace posible el crecimiento genuino.",
    natureEn:
      "Earth is the most patient element. It does not hurry. It does not perform. It holds — the weight of mountains, the roots of forests, the bodies of every living thing. Earth is the element of deep reliability: the kind of presence that makes genuine growth possible.",
    methodEs:
      "Framework ROOTS — Reliability (confiabilidad consistente), Ownership (responsabilidad total), Openness (estabilidad receptiva), Truth (honestidad radical), Stability (presencia regulada).",
    methodEn:
      "ROOTS framework — Reliability (consistent trustworthiness), Ownership (full accountability), Openness (receptive stability), Truth (radical honesty), Stability (regulated presence).",
    bodyEs:
      "Yoga Yin · Animal Flow · Temazcal · Shinrin-yoku · Grounding/Earthing · Trabajo corporal · Escalada · Coaching con caballos · Schema Therapy · Teoría del Apego · HRV Coherencia · Interocepción.",
    bodyEn:
      "Yin Yoga · Animal Flow · Temazcal · Shinrin-yoku · Grounding/Earthing · Bodywork · Climbing · Equine-Assisted Coaching · Schema Therapy · Attachment Theory · HRV Coherence · Interoception.",
    experienceEs: "Forest Grounding & Roots Ritual",
    experienceEn: "Forest Grounding & Roots Ritual",
    accent: "#3D5A3E",
    accentSoft: "#C8D4C0",
    accentInk: "#2A3E2B",
    animClass: "anim-earth",
  },
  {
    key: "fuego",
    nameEs: "Fuego",
    nameEn: "Fire",
    framework: "IGNITE",
    qualityEs: "Visión · Coraje · Activación",
    qualityEn: "Vision · Courage · Activation",
    cultivaEs:
      "Enciende al líder que transforma, inspira y moviliza a otros hacia lo que importa. El Fuego enseña a quemar lo innecesario e iluminar lo esencial.",
    cultivaEn:
      "Ignite the leader who transforms, inspires, and moves others toward what matters. Fire teaches us to burn away the unnecessary and illuminate what's essential.",
    quoteEs: "El fuego no se disculpa por la luz que crea.",
    quoteEn: "Fire does not apologize for the light it creates.",
    natureEs:
      "El fuego es el elemento más transformador. No preserva — convierte. Todo lo que toca cambia: la madera se vuelve calor y luz, el mineral se vuelve metal, la masa se vuelve pan. El fuego quema lo que ya no sirve e ilumina lo que importa.",
    natureEn:
      "Fire is the most transformative element. It does not preserve — it converts. Everything fire touches is changed: wood becomes heat and light, ore becomes metal, dough becomes bread. Fire burns away what no longer serves and illuminates what matters.",
    methodEs:
      "Framework IGNITE — Intention (dirección con propósito), Generativity (activación creativa), Nerve (acción valiente), Intensity (presencia apasionada), Transformation (liderazgo del cambio), Energizing (inspirar y activar).",
    methodEn:
      "IGNITE framework — Intention (purposeful direction), Generativity (creative activation), Nerve (courageous action), Intensity (passionate presence), Transformation (change leadership), Energizing (inspiration and activation).",
    bodyEs:
      "Hot Yoga · Bikram · Artes marciales (Muay Thai, BJJ, Boxeo) · Bioenergética y catarsis · Sauna finlandesa · Sauna infrarrojo · HIIT y sprints · Temazcal · Contraste ritual fuego-hielo · Logoterapia · Psicología positiva · Narrativa · CBT creencias nucleares.",
    bodyEn:
      "Hot Yoga · Bikram · Martial Arts (Muay Thai, BJJ, Boxing) · Bioenergetics & cathartic release · Finnish sauna · Infrared sauna · HIIT & sprint training · Temazcal · Ritual fire-ice contrast · Logotherapy · Positive Psychology · Narrative Therapy · CBT core beliefs.",
    experienceEs: "Vision Ceremony",
    experienceEn: "Vision Ceremony",
    accent: "#C4622D",
    accentSoft: "#E8C9B0",
    accentInk: "#7A2F0E",
    animClass: "anim-fire",
  },
  {
    key: "agua",
    nameEs: "Agua",
    nameEn: "Water",
    framework: "FLOW",
    qualityEs: "Claridad · Flujo · Profundidad",
    qualityEn: "Clarity · Flow · Depth",
    cultivaEs:
      "Cultiva al líder que escucha profundo, se adapta con fluidez y mantiene la claridad incluso en condiciones turbulentas. El Agua enseña a encontrar el camino sin perder la dirección.",
    cultivaEn:
      "Cultivate the leader who listens deeply, adapts fluidly, and holds clarity even in turbulent conditions. Water teaches us to find the path of least resistance without losing direction.",
    quoteEs: "El líder más poderoso que conozco no lucha contra la corriente.",
    quoteEn: "The most powerful leader I know does not fight the current.",
    natureEs:
      "El agua es la fuerza más adaptativa de la naturaleza. Toma la forma de cada recipiente, encuentra el camino de menor resistencia, y con el tiempo talla cañones en piedra sólida. El poder del agua no nace de la fuerza, sino de la persistencia, la claridad y la inteligencia del flujo.",
    natureEn:
      "Water is the most adaptive force in nature. It takes the shape of every container, finds the path of least resistance, and yet — over time — carves canyons in solid rock. Water's power comes not from force, but from persistence, clarity, and the intelligence of flow.",
    methodEs:
      "Framework FLOW — Feel (inteligencia emocional y escucha), Let Go (flexibilidad adaptativa), Orient (claridad direccional), Witness (presencia reflexiva).",
    methodEn:
      "FLOW framework — Feel (emotional intelligence and listening), Let Go (adaptive flexibility), Orient (directional clarity), Witness (reflective presence).",
    bodyEs:
      "Watsu · Somatic Experiencing · TRE · Cold Plunge · Terapia de contraste · Tanque de flotación · Hidroterapia · Forest Bathing acuático · ACT Defusión · Focusing · EFT · DBT · Teoría Polivagal · Default Mode Network · Clean Language.",
    bodyEn:
      "Watsu · Somatic Experiencing · TRE · Cold Plunge · Contrast Therapy · Float Tank · Hydrotherapy · Aquatic Forest Bathing · ACT Defusion · Focusing · EFT · DBT · Polyvagal Theory · Default Mode Network · Clean Language.",
    experienceEs: "Riverine Reflection & Deep Listening",
    experienceEn: "Riverine Reflection & Deep Listening",
    accent: "#2B6B8A",
    accentSoft: "#B5D0DE",
    accentInk: "#1A4257",
    animClass: "anim-water",
  },
  {
    key: "aire",
    nameEs: "Aire",
    nameEn: "Air",
    framework: "CLEAR",
    qualityEs: "Perspectiva · Comunicación · Libertad",
    qualityEn: "Perspective · Communication · Freedom",
    cultivaEs:
      "Desarrolla al líder que ve el panorama completo, comunica con precisión y crea espacio para que otros respiren y crezcan. El Aire enseña a elevarse y mirar más lejos.",
    cultivaEn:
      "Develop the leader who sees the full landscape, communicates with precision, and creates space for others to breathe and grow. Air teaches us to rise above and look forward.",
    quoteEs: "El líder que se eleva no abandona a su gente.",
    quoteEn: "The leader who rises does not abandon their people.",
    natureEs:
      "El aire es el elemento que más damos por sentado — porque es invisible, porque es constante, porque lo respiramos sin pensar. Y sin él, nada vive. El aire es la inteligencia de la perspectiva: la capacidad de ver el paisaje completo mientras se mantiene contacto con los detalles que importan.",
    natureEn:
      "Air is the element we most take for granted — because it is invisible, because it is constant, because we breathe it without thinking. And yet without it, nothing lives. Air is the intelligence of perspective: the capacity to see the full landscape while remaining in contact with the details that matter.",
    methodEs:
      "Framework CLEAR — Context (perspectiva sistémica), Lightness (libertad del ego), Elevation (altitud estratégica), Articulation (comunicación precisa), Resonance (conexión e impacto).",
    methodEn:
      "CLEAR framework — Context (systemic perspective), Lightness (freedom from ego), Elevation (strategic altitude), Articulation (precise communication), Resonance (connection and impact).",
    bodyEs:
      "Pranayama (Nadi Shodhana, Ujjayi, Kapalabhati, Box Breathing) · Wim Hof Method · Cuencos tibetanos · Baños de gong · Trabajo de voz · Binaural beats · Qigong · Tai Chi · Meditación formal · Retiro de silencio · IFS · Gestalt · MBCT · Meta-Modelo · Posiciones perceptuales.",
    bodyEn:
      "Pranayama (Nadi Shodhana, Ujjayi, Kapalabhati, Box Breathing) · Wim Hof Method · Tibetan Singing Bowls · Gong Baths · Voice work · Binaural Beats · Qigong · Tai Chi · Formal meditation · Silent retreat · IFS · Gestalt · MBCT · Meta-Model · Perceptual Positions.",
    experienceEs: "Summit Perspective",
    experienceEn: "Summit Perspective",
    accent: "#7A9BAD",
    accentSoft: "#D2DCE4",
    accentInk: "#2E4754",
    animClass: "anim-air",
  },
  {
    key: "eter",
    nameEs: "Éter",
    nameEn: "Éter",
    framework: null,
    qualityEs: "Consciencia · Propósito · Legado",
    qualityEn: "Consciousness · Purpose · Legacy",
    cultivaEs:
      "El Éter es la energía principal del Núcleo. Es el quinto elemento que integra a los otros cuatro y revela la esencia trascendente del líder.",
    cultivaEn:
      "Éter is the principal energy of the Nucleus. It is the fifth element that integrates the other four and reveals the leader's transcendent essence.",
    quoteEs: "Quien eres es la herramienta que más usas.",
    quoteEn: "Who you are is the tool you use most.",
    natureEs:
      "En el Éter se concentra: el autoconocimiento, el propósito trascendental, la sabiduría, la intención, la plenitud, la conexión humana, la gratitud, el servicio, el legado. Es la base de los otros cuatro elementos — energía, movimiento, cambio y transformación.",
    natureEn:
      "Éter concentrates: self-knowledge, transcendent purpose, wisdom, intention, plenitude, human connection, gratitude, service, legacy. It is the base of the other four elements — energy, movement, change and transformation.",
    methodEs:
      "El Éter no tiene framework de letras. Es el quinto elemento del Núcleo: quién y qué es la esencia nueva tuya como Líder. Se trabaja al integrar Tierra, Fuego, Agua y Aire en el ser completo del líder.",
    methodEn:
      "Éter has no letter framework. It is the fifth element of the Nucleus: who and what is your new essence as a Leader. It is worked by integrating Earth, Fire, Water and Air into the leader's complete being.",
    bodyEs:
      "Prácticas contemplativas integradas · Silencio extendido · Meditación de presencia plena · Ritual de integración · Diario de propósito trascendental · Conversaciones de legado.",
    bodyEn:
      "Integrated contemplative practice · Extended silence · Full presence meditation · Integration ritual · Transcendent purpose journaling · Legacy conversations.",
    experienceEs: "Integration & Essence",
    experienceEn: "Integration & Essence",
    accent: "#C9A96E",
    accentSoft: "#EBDCBE",
    accentInk: "#57441A",
    animClass: "anim-air",
  },
];

export interface PathInfo {
  slug: string;
  nameEs: string;
  nameEn: string;
  tagEs: string;
  tagEn: string;
  headlineEs: string;
  headlineEn: string;
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
  ctaEs: string;
  ctaEn: string;
}

export const paths: PathInfo[] = [
  {
    slug: "raices",
    nameEs: "Raíces",
    nameEn: "Roots",
    tagEs: "El Camino · Grupal",
    tagEn: "The Journey · Group",
    headlineEs: "Encuentra tu fundamento. Lidera desde tus profundidades.",
    headlineEn: "Find your foundation. Lead from your depths.",
    shortEs: "Programa de inmersión de 5 meses.",
    shortEn: "5-month immersion program.",
    longEs:
      "El programa de entrada al universo Elements Method. Diseñado para líderes que buscan profundidad con comunidad de práctica. Cada mes: una inmersión presencial en naturaleza, una metodología y espacio de reflexión.",
    longEn:
      "The entry point to the Elements Method universe. Designed for leaders who want depth with community of practice. Each month: one in-person nature immersion, one methodology, and space for reflection.",
    includesEs: [
      "1 inmersión presencial en naturaleza por mes",
      "4 metodologías a implementar y practicar",
      "Entornos naturales seleccionados",
      "Recorrido por los 4 elementos + Éter",
      "Acceso a comunidad de práctica y coaches",
      "Acceso especial a programa de continuidad — 2 sesiones de coaching individual por mes durante 6 meses (costo adicional)",
    ],
    includesEn: [
      "1 in-person nature immersion per month",
      "4 methodologies to implement and practice",
      "Curated natural environments",
      "Journey through all 4 elements + Éter",
      "Access to community of practice and coaches",
      "Special access to continuation program — 2 individual coaching sessions per month for 6 months (additional cost)",
    ],
    modalityEs: "Grupal · hasta 15 participantes",
    modalityEn: "Group · up to 15 participants",
    durationEs: "5 meses",
    durationEn: "5 months",
    capacityEs: "Hasta 15 participantes",
    capacityEn: "Up to 15 participants",
    ctaEs: "Comenzar Raíces",
    ctaEn: "Begin Roots",
  },
  {
    slug: "corriente",
    nameEs: "Corriente",
    nameEn: "Current",
    tagEs: "Intensivo · Grupal",
    tagEn: "Intensive · Group",
    headlineEs: "Doble la inmersión. Doble el momentum.",
    headlineEn: "Double the immersion. Double the momentum.",
    shortEs: "Experiencia de inmersión acelerada · 3 meses.",
    shortEn: "Accelerated immersion experience · 3 months.",
    longEs:
      "Para líderes que necesitan transformación a mayor velocidad. El doble de inmersiones por mes crea una frecuencia de contacto con los elementos que produce integración acelerada.",
    longEn:
      "For leaders who need transformation at greater speed. Double the immersions per month creates a contact frequency with the elements that produces accelerated integration.",
    includesEs: [
      "2 inmersiones presenciales en naturaleza por mes",
      "2 metodologías por mes a implementar",
      "Entornos naturales seleccionados",
      "Recorrido por los 4 elementos + Éter",
      "Integración e implementación acelerada por elemento",
      "Acceso a comunidad de práctica y coaches",
      "Acceso especial a programa de continuidad — 2 sesiones de coaching por mes durante 6 meses (costo adicional)",
    ],
    includesEn: [
      "2 in-person nature immersions per month",
      "2 methodologies per month to implement",
      "Curated natural environments",
      "Journey through all 4 elements + Éter",
      "Accelerated integration and implementation per element",
      "Access to community of practice and coaches",
      "Special access to continuation program — 2 coaching sessions per month for 6 months (additional cost)",
    ],
    modalityEs: "Grupal · hasta 15 participantes",
    modalityEn: "Group · up to 15 participants",
    durationEs: "3 meses",
    durationEn: "3 months",
    capacityEs: "Hasta 15 participantes",
    capacityEn: "Up to 15 participants",
    ctaEs: "Comenzar Corriente",
    ctaEn: "Begin Current",
  },
  {
    slug: "fuente",
    nameEs: "Fuente",
    nameEn: "Source",
    tagEs: "Inmersión Total · Retiro 3 días",
    tagEn: "Full Immersion · 3-day Retreat",
    headlineEs: "La transformación más completa.",
    headlineEn: "The most complete transformation.",
    shortEs: "Retiro grupal de 3 días + programa de coaching individual de 6 meses.",
    shortEn: "3-day group retreat + 6-month individual coaching program.",
    longEs:
      "La oferta más completa y exclusiva de Elements Method. Un retiro de tres días donde se realizan cuatro inmersiones presenciales y se exploran los cuatro elementos con sus metodologías. Seguido de un programa de coaching individualizado que da continuidad a lo aprendido durante seis meses.",
    longEn:
      "The most complete and exclusive Elements Method offering. A three-day retreat with four in-person nature immersions exploring all four elements with their methodologies. Followed by a six-month individual coaching program that sustains everything learned.",
    includesEs: [
      "Retiro de 3 días (jueves a sábado)",
      "4 inmersiones presenciales en naturaleza",
      "Recorrido por los 4 elementos + Éter",
      "12 sesiones de coaching individual post-retiro (mínimo 6 meses, 2/mes)",
      "Diseño de curriculum personalizado para el proceso de coaching",
      "Mapa de liderazgo 1:1 por elemento",
      "Coach senior de mayor experiencia",
      "Acceso a comunidad de retiros ejecutivos",
    ],
    includesEn: [
      "3-day retreat (Thursday to Saturday)",
      "4 in-person nature immersions",
      "Journey through all 4 elements + Éter",
      "12 individual post-retreat coaching sessions (minimum 6 months, 2/month)",
      "Personalized curriculum design for coaching process",
      "1:1 leadership map per element",
      "Most senior coach",
      "Access to executive retreats community",
    ],
    modalityEs: "Retiro grupal · hasta 15 líderes",
    modalityEn: "Group retreat · up to 15 leaders",
    durationEs: "3 días + 6 meses de coaching",
    durationEn: "3 days + 6 months of coaching",
    capacityEs: "Hasta 15 líderes",
    capacityEn: "Up to 15 leaders",
    ctaEs: "Comenzar Fuente",
    ctaEn: "Begin Source",
  },
];

/**
 * Origin — Custom-built retreats for organizations.
 * Mentioned in pptx slide 5 footer as a fourth offering.
 */
export const originProgram = {
  nameEs: "Origin",
  nameEn: "Origin",
  tagEs: "Retiros corporativos a la medida",
  tagEn: "Custom-built corporate retreats",
  bodyEs:
    "Elements Method ofrece programas organizacionales a la medida diseñados alrededor de inmersiones de equipo, desarrollo de cultura de liderazgo y transformación organizacional. Un programa puede llevar a un equipo directivo completo a través del marco de los Cuatro Elementos, creando lenguaje compartido, confianza profundizada y cultura organizacional alineada.",
  bodyEn:
    "Elements Method offers bespoke organizational programs designed around team immersions, leadership culture development, and organizational transformation. A single corporate program can bring an entire leadership team through the Four Elements framework, creating shared language, deepened trust, and aligned organizational culture.",
  ctaEs: "Iniciar conversación",
  ctaEn: "Begin the conversation",
};

/**
 * The 5-month arc of Roots — verbatim from master doc.
 */
export const rootsArc = [
  {
    month: 1,
    elementKey: "tierra" as ElementKey,
    titleEs: "Arraigo y construcción de confianza",
    titleEn: "Grounding and trust-building",
  },
  {
    month: 2,
    elementKey: "fuego" as ElementKey,
    titleEs: "Visión y activación del propósito",
    titleEn: "Vision and purpose activation",
  },
  {
    month: 3,
    elementKey: "agua" as ElementKey,
    titleEs: "Claridad y escucha profunda",
    titleEn: "Clarity and deep listening",
  },
  {
    month: 4,
    elementKey: "aire" as ElementKey,
    titleEs: "Perspectiva y comunicación auténtica",
    titleEn: "Perspective and authentic communication",
  },
  {
    month: 5,
    elementKey: "eter" as ElementKey,
    titleEs: "Quién y qué es la esencia nueva tuya como Líder",
    titleEn: "Who and what is your new essence as a Leader",
  },
];

/**
 * Retreats / module calendar. Locations not yet published.
 * Pricing is no longer per module — programs are sold as integrated journeys.
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
  capacity: number;
  sold: number;
  imageHue: string;
  image: string;
  experienceEs: string;
  experienceEn: string;
}

export const retreats: RetreatInfo[] = [
  {
    id: "earth-immersion",
    nameEs: "Inmersión Tierra · ROOTS",
    nameEn: "Earth Immersion · ROOTS",
    startDate: null,
    endDate: null,
    location: null,
    modalityEs: "Inmersión presencial · jornada completa",
    modalityEn: "In-person immersion · full day",
    elementsCovered: ["tierra"],
    capacity: 15,
    sold: 0,
    imageHue: "#C8D4C0",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=85&auto=format&fit=crop",
    experienceEs: "Forest Grounding & Roots Ritual",
    experienceEn: "Forest Grounding & Roots Ritual",
  },
  {
    id: "fire-immersion",
    nameEs: "Inmersión Fuego · IGNITE",
    nameEn: "Fire Immersion · IGNITE",
    startDate: null,
    endDate: null,
    location: null,
    modalityEs: "Inmersión presencial · jornada completa",
    modalityEn: "In-person immersion · full day",
    elementsCovered: ["fuego"],
    capacity: 15,
    sold: 0,
    imageHue: "#E8C9B0",
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&q=85&auto=format&fit=crop",
    experienceEs: "Vision Ceremony",
    experienceEn: "Vision Ceremony",
  },
  {
    id: "water-immersion",
    nameEs: "Inmersión Agua · FLOW",
    nameEn: "Water Immersion · FLOW",
    startDate: null,
    endDate: null,
    location: null,
    modalityEs: "Inmersión presencial · jornada completa",
    modalityEn: "In-person immersion · full day",
    elementsCovered: ["agua"],
    capacity: 15,
    sold: 0,
    imageHue: "#B5D0DE",
    image:
      "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?w=1600&q=85&auto=format&fit=crop",
    experienceEs: "Riverine Reflection & Deep Listening",
    experienceEn: "Riverine Reflection & Deep Listening",
  },
  {
    id: "air-immersion",
    nameEs: "Inmersión Aire · CLEAR",
    nameEn: "Air Immersion · CLEAR",
    startDate: null,
    endDate: null,
    location: null,
    modalityEs: "Inmersión presencial · jornada completa",
    modalityEn: "In-person immersion · full day",
    elementsCovered: ["aire"],
    capacity: 15,
    sold: 0,
    imageHue: "#D2DCE4",
    image:
      "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=1600&q=85&auto=format&fit=crop",
    experienceEs: "Summit Perspective",
    experienceEn: "Summit Perspective",
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
 * Testimonials. The only real testimonial sourced from the documents.
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

export const testimonials: Testimonial[] = [
  {
    id: "alexandra-reyes",
    type: "quote",
    authorName: "Alexandra Reyes",
    authorRole: "Chief Executive Officer",
    company: "Global Operations",
    quoteEs:
      "El Elements Method no me enseñó cómo liderar. Me recordé quién ya soy — y me dio la naturaleza para probarlo.",
    quoteEn:
      "The Elements Method didn't teach me how to lead. It reminded me of who I already am — and gave me the nature to prove it.",
    pathTaken: "Source",
  },
];

/**
 * Stats sourced from elements-method-presentation.md and elements-master doc.
 */
export const stats = [
  {
    value: 21,
    suffix: "%",
    labelEs: "Menos cortisol tras 20 minutos en naturaleza",
    labelEn: "Less cortisol after 20 minutes in nature",
    source: "Hunter et al. · 2019",
  },
  {
    value: 50,
    suffix: "%",
    labelEs: "Más células NK del sistema inmune tras 2h de Shinrin-yoku",
    labelEn: "More NK immune cells after 2h Shinrin-yoku",
    source: "Li · 2008",
  },
  {
    value: 3,
    suffix: "x",
    labelEs: "Más engagement bajo líderes auto-conscientes",
    labelEn: "Higher engagement under self-aware leaders",
    source: "Eurich · Harvard Business Review",
  },
  {
    value: 27,
    suffix: "%",
    labelEs: "Más crecimiento de revenue en culturas con seguridad psicológica",
    labelEn: "Higher revenue growth in psychologically safe cultures",
    source: "Google · Project Aristotle",
  },
];

/**
 * Disconnection Protocol — verbatim from elements-master doc.
 * Note: master doc lists 6 phases (Methodology added as phase 3).
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
    titleEs: "Liberación",
    titleEn: "Release",
    durationEs: "0–60 min",
    durationEn: "0–60 min",
    bodyEs:
      "Llegar físicamente. Depositar dispositivos. Dejar que el sistema nervioso comience a asentarse.",
    bodyEn:
      "Physically arrive. Put down devices. Let the nervous system begin to settle.",
  },
  {
    n: "02",
    titleEs: "Encuentro",
    titleEn: "Encounter",
    durationEs: "1–3 hrs",
    durationEn: "1–3 hrs",
    bodyEs:
      "Contacto directo con el elemento a través de experiencia sensorial y presencia somática.",
    bodyEn:
      "Direct contact with the element through sensory experience and somatic presence.",
  },
  {
    n: "03",
    titleEs: "Metodología",
    titleEn: "Methodology",
    durationEs: "1–2 hrs",
    durationEn: "1–2 hrs",
    bodyEs:
      "Presentación del elemento, su metodología y práctica de la misma.",
    bodyEn:
      "Presentation of the element, its methodology and practice of it.",
  },
  {
    n: "04",
    titleEs: "Reflexión",
    titleEn: "Reflection",
    durationEs: "30–60 min",
    durationEn: "30–60 min",
    bodyEs:
      "Diario individual y reflexión silenciosa. El elemento como espejo del liderazgo actual.",
    bodyEn:
      "Individual journaling and silent reflection. The element as a mirror of current leadership.",
  },
  {
    n: "05",
    titleEs: "Diálogo",
    titleEn: "Dialogue",
    durationEs: "60–90 min",
    durationEn: "60–90 min",
    bodyEs:
      "Conversación grupal facilitada. Qué emergió, qué sorprendió, qué reveló el elemento.",
    bodyEn:
      "Facilitated group conversation. What emerged, what surprised, what the element revealed.",
  },
  {
    n: "06",
    titleEs: "Integración",
    titleEn: "Integration",
    durationEs: "30–60 min",
    durationEn: "30–60 min",
    bodyEs:
      "Ritual de cierre con el elemento. Un compromiso. Una intención. El puente de regreso.",
    bodyEn:
      "Closing ritual with the element. One commitment. One intention. The bridge back.",
  },
];

/**
 * FAQs grounded in the documents.
 */
export const faqs = [
  {
    qEs: "¿Qué es exactamente Elements Method?",
    qEn: "What exactly is Elements Method?",
    aEs:
      "Un programa de desarrollo de liderazgo basado en inmersiones en la naturaleza, diseñado para devolver a los líderes a su fuente esencial de poder. Integra neurociencia, programación neurolingüística, coaching internacional, frameworks estratégicos y práctica somática en cada sesión.",
    aEn:
      "A nature-based leadership development program designed to return leaders to their essential source of power. It integrates neuroscience, NLP, international coaching, strategic frameworks and somatic practice in every session.",
  },
  {
    qEs: "¿Cuál es la diferencia con un retiro o un curso de liderazgo?",
    qEn: "How is this different from a retreat or a leadership course?",
    aEs:
      "Esto no es un retiro. Es un regreso. La inmersión total en entornos naturales — no salas de conferencia — y el marco de los cuatro elementos como filosofía de desarrollo (no metáfora decorativa) son los diferenciadores. Trabajamos desde adentro hacia afuera: el líder primero, las herramientas después.",
    aEn:
      "This is not a retreat. It is a return. Total immersion in natural environments — not conference rooms — and the four elements framework as a development philosophy (not decorative metaphor) are the differentiators. We work from the inside out: the leader first, the tools after.",
  },
  {
    qEs: "¿Para quién está diseñado?",
    qEn: "Who is it designed for?",
    aEs:
      "Ejecutivos senior en momentos de transición, líderes que sienten que su liderazgo no refleja quiénes son, fundadores en puntos de inflexión, directivos enfrentando agotamiento, y líderes buscando integrar lo personal con lo profesional.",
    aEn:
      "Senior executives in transition, leaders whose leadership doesn't reflect who they are, founders at inflection points, directors facing burnout, and leaders seeking to integrate the personal with the professional.",
  },
  {
    qEs: "¿Qué programas ofrecen?",
    qEn: "What programs do you offer?",
    aEs:
      "Tres programas: Raíces (5 meses, grupal hasta 15), Corriente (3 meses intensivo grupal) y Fuente (retiro de 3 días + 6 meses de coaching individual). Para organizaciones existe Origin — retiros corporativos a la medida.",
    aEn:
      "Three programs: Roots (5 months, group up to 15), Current (3-month intensive group) and Source (3-day retreat + 6 months individual coaching). For organizations there is Origin — bespoke corporate retreats.",
  },
  {
    qEs: "¿Qué resultados puedo esperar?",
    qEn: "What results can I expect?",
    aEs:
      "Mayor auto-consciencia y claridad de propósito, herramientas prácticas para los 4 dominios del liderazgo, una red de pares comprometidos con el mismo método, y un plan de desarrollo personal para los 12 meses siguientes.",
    aEn:
      "Greater self-awareness and clarity of purpose, practical tools for the 4 leadership domains, a network of peers committed to the same method, and a personal development plan for the next 12 months.",
  },
];

/**
 * Three methodology axes, grouping the modality stack from elements-methodologies.md.
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
  primaryElement: ElementKey;
}

export const modalityAxes: ModalityAxis[] = [
  {
    slug: "coaching-nlp",
    nameEs: "Coaching y PNL",
    nameEn: "Coaching & NLP",
    taglineEs: "Mente · lenguaje · decisión",
    taglineEn: "Mind · language · decision",
    bodyEs:
      "Métodos de coaching internacional y Programación Neurolingüística. Trabajan el nivel de la representación interna y los patrones inconscientes.",
    bodyEn:
      "International coaching methods and Neuro-Linguistic Programming. They work the level of internal representation and unconscious patterning.",
    modalitiesEs: [
      "Clean Language (David Grove)",
      "NLP Meta-Modelo · Reencuadre · Posiciones Perceptuales",
      "Coaching de Resultados · GROW · WOOP",
      "Coaching Co-Activo · Ontológico (Echeverría)",
      "Coaching Provocativo (Farrelly)",
      "Entrevista Motivacional (MI)",
      "Coaching Sistémico y Constelaciones",
      "Coaching de Presencia Ejecutiva",
    ],
    modalitiesEn: [
      "Clean Language (David Grove)",
      "NLP Meta-Model · Reframing · Perceptual Positions",
      "Results Coaching · GROW · WOOP",
      "Co-Active · Ontological Coaching (Echeverría)",
      "Provocative Coaching (Farrelly)",
      "Motivational Interviewing (MI)",
      "Systemic Coaching & Constellations",
      "Executive Presence Coaching",
    ],
    primaryElement: "aire",
  },
  {
    slug: "psychology-neuroscience",
    nameEs: "Psicología y neurociencia",
    nameEn: "Psychology & neuroscience",
    taglineEs: "Regulación · perspectiva · sentido",
    taglineEn: "Regulation · perspective · meaning",
    bodyEs:
      "Frameworks psicológicos y descubrimientos de neurociencia aplicados al desempeño. Lo que ya está probado en clínica, traducido al liderazgo.",
    bodyEn:
      "Psychological frameworks and neuroscience findings applied to performance. What's already proven in clinic, translated for leadership.",
    modalitiesEs: [
      "ACT Defusión · Focusing (Gendlin) · EFT · DBT",
      "Internal Family Systems (Schwartz)",
      "Logoterapia (Frankl) · Psicología Positiva PERMA",
      "Terapia Narrativa · CBT · MBCT · Schema Therapy",
      "Psicología Profunda Junguiana",
      "Teoría Polivagal (Porges) · Default Mode Network",
      "HRV Coherencia · Interocepción · Embodied Cognition",
      "Sistemas de Dopamina · Regulación de Amígdala · PFC",
    ],
    modalitiesEn: [
      "ACT Defusion · Focusing (Gendlin) · EFT · DBT",
      "Internal Family Systems (Schwartz)",
      "Logotherapy (Frankl) · Positive Psychology PERMA",
      "Narrative Therapy · CBT · MBCT · Schema Therapy",
      "Jungian Depth Psychology",
      "Polyvagal Theory (Porges) · Default Mode Network",
      "HRV Coherence · Interoception · Embodied Cognition",
      "Dopamine systems · Amygdala regulation · PFC",
    ],
    primaryElement: "agua",
  },
  {
    slug: "somatic-physiological",
    nameEs: "Práctica somática y fisiológica",
    nameEn: "Somatic & physiological practice",
    taglineEs: "Cuerpo · respiración · regulación",
    taglineEn: "Body · breath · regulation",
    bodyEs:
      "Las modalidades que tocan el sistema nervioso directamente — donde el lenguaje no llega. Lo que entrena la fisiología que sostiene el liderazgo.",
    bodyEn:
      "Modalities that touch the nervous system directly — where language can't reach. What trains the physiology that holds leadership.",
    modalitiesEs: [
      "Pranayama · Wim Hof Method · Holotropic Breathwork",
      "Cold Plunge · Contrast Therapy · Float Tank",
      "Sauna finlandesa · Infrarrojo · HIIT · Sprints",
      "Temazcal ceremonial · Hot Yoga · Bioenergética",
      "Yin Yoga · Restaurativo · Animal Flow",
      "Watsu · Somatic Experiencing · TRE",
      "Cuencos tibetanos · Gong baths · Trabajo de voz",
      "Forest Bathing · Grounding · Qigong · Tai Chi",
    ],
    modalitiesEn: [
      "Pranayama · Wim Hof Method · Holotropic Breathwork",
      "Cold Plunge · Contrast Therapy · Float Tank",
      "Finnish Sauna · Infrared · HIIT · Sprints",
      "Ceremonial Temazcal · Hot Yoga · Bioenergetics",
      "Yin Yoga · Restorative · Animal Flow",
      "Watsu · Somatic Experiencing · TRE",
      "Tibetan Bowls · Gong Baths · Voice work",
      "Forest Bathing · Grounding · Qigong · Tai Chi",
    ],
    primaryElement: "fuego",
  },
];

/**
 * Practitioner exercises documented verbatim in elements-master doc and
 * elements-method-presentation.md. Three per element.
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
    | "Cloud"
    | "Map";
  titleEs: string;
  titleEn: string;
  bodyEs: string;
  bodyEn: string;
  durationEs: string;
  durationEn: string;
  element: ElementKey;
}

export const practices: PracticeInfo[] = [
  // EARTH — 3 exercises
  {
    iconName: "Trees",
    titleEs: "El Contacto con las Raíces",
    titleEn: "The Root Contact",
    bodyEs:
      "Descalzo sobre tierra de bosque, 30 minutos en silencio con manos en el suelo. Una instrucción: notar dónde sí y dónde no sientes el suelo en tu cuerpo. Earthing documentado reduce inflamación y regula cortisol.",
    bodyEn:
      "Barefoot on forest soil, 30 minutes in silence with hands on the ground. One instruction: notice where in your body you feel the ground — and where you don't. Documented earthing reduces inflammation and regulates cortisol.",
    durationEs: "60 min · individual",
    durationEn: "60 min · individual",
    element: "tierra",
  },
  {
    iconName: "PenLine",
    titleEs: "La Auditoría de Confianza",
    titleEn: "The Trust Audit",
    bodyEs:
      "Auditoría personal — no de los demás, de uno mismo. Para cada relación clave: ¿esta persona me experimenta como confiable? ¿Le digo la verdad o una versión administrada? Compromiso específico a 30 días.",
    bodyEn:
      "Personal trust audit — not of others, of yourself. For each key relationship: does this person experience me as reliable? Do I tell them the truth or a managed version? 30-day specific commitment.",
    durationEs: "90 min · pares",
    durationEn: "90 min · pairs",
    element: "tierra",
  },
  {
    iconName: "Mountain",
    titleEs: "El Árbol Ancestral",
    titleEn: "The Ancestor Tree",
    bodyEs:
      "Cada participante encuentra un árbol grande y antiguo. Pasan 30 minutos con él: tocándolo, sentados contra él, examinando sus raíces y copa. Pregunta central: '¿Qué sabe este árbol sobre la permanencia que yo aún no sé sobre mí mismo?'",
    bodyEn:
      "Each participant finds a large, ancient tree. They spend 30 minutes with it: touching it, sitting against it, examining its roots and canopy. Central question: 'What does this tree know about permanence that I do not yet know about myself?'",
    durationEs: "2 h · individual + grupo",
    durationEn: "2 h · individual + group",
    element: "tierra",
  },
  // FIRE — 3 exercises
  {
    iconName: "Flame",
    titleEs: "El Consejo del Fuego",
    titleEn: "The Fire Council",
    bodyEs:
      "Círculo alrededor de una fogata sin agenda los primeros 60 minutos — solo el fuego. Dos preguntas: ¿cuál es la visión que cargas y no has dicho completamente? ¿Cuál es el fuego que has mantenido demasiado pequeño?",
    bodyEn:
      "Circle around a fire with no agenda for the first 60 minutes — only the fire. Two questions: what is the vision you carry that you have not yet fully spoken? What is the fire you have been keeping too small?",
    durationEs: "3–4 h · grupo",
    durationEn: "3–4 h · group",
    element: "fuego",
  },
  {
    iconName: "PenLine",
    titleEs: "La Carta de la Quema",
    titleEn: "The Burning Letter",
    bodyEs:
      "Dos cartas. Una a la identidad de liderazgo que sueltas — los patrones, miedos, estrategias que ya no sirven. Otra desde tu yo futuro — el líder en proceso de devenir. La primera se quema. La segunda se lee en voz alta.",
    bodyEn:
      "Two letters. One to the leadership identity you are releasing — the patterns, fears, strategies that no longer serve. Another from your future self — the leader you are becoming. The first is burned. The second is read aloud.",
    durationEs: "60–90 min · individual",
    durationEn: "60–90 min · individual",
    element: "fuego",
  },
  {
    iconName: "Sparkles",
    titleEs: "La Activación de Visión",
    titleEn: "The Vision Activation",
    bodyEs:
      "Caminata solitaria de 30 minutos con una pregunta: '¿Qué construiría si supiera que no puede fallar?' Capturas la respuesta en 20 minutos en cualquier formato. Presentas tu visión al grupo en menos de 3 minutos como declaración — no como plan.",
    bodyEn:
      "30-minute solitary walk with one question: 'What would I build if I knew it could not fail?' You capture the answer in 20 minutes in any format. You present your vision to the group in under 3 minutes as a declaration — not a plan.",
    durationEs: "90 min · individual + grupo",
    durationEn: "90 min · individual + group",
    element: "fuego",
  },
  // WATER — 3 exercises
  {
    iconName: "Eye",
    titleEs: "El Testigo del Río",
    titleEn: "The River Witness",
    bodyEs:
      "Solo, junto a agua en movimiento, mínimo 20 minutos en silencio. Una instrucción: 'Observa el agua y nota lo que te muestra de tu propio liderazgo.' Tres preguntas: ¿dónde luchas contra la corriente? ¿Qué soltaría el río? ¿Qué sabe tu agua que tu mente no sabe?",
    bodyEn:
      "Alone, beside moving water, minimum 20 minutes in silence. One instruction: 'Observe the water and notice what it shows you of your own leadership.' Three questions: where are you fighting the current? What would the river let go? What does your water know that your mind does not?",
    durationEs: "45–60 min · individual",
    durationEn: "45–60 min · individual",
    element: "agua",
  },
  {
    iconName: "MessageCircle",
    titleEs: "La Entrevista de Profundidad",
    titleEn: "The Depth Interview",
    bodyEs:
      "Pareja: Orador y Oyente Profundo. El Oyente solo puede preguntar '¿Y qué más?' o 'Cuéntame más de eso.' Sin arreglar, sin consejo, sin redirigir. El momento de querer intervenir es el dato central.",
    bodyEn:
      "Pair: Speaker and Deep Listener. The Listener may only ask 'And what else?' or 'Tell me more about that.' No fixing, no advice, no redirecting. The urge to intervene is the central data.",
    durationEs: "60 min · pares",
    durationEn: "60 min · pairs",
    element: "agua",
  },
  {
    iconName: "Map",
    titleEs: "El Mapa del Río",
    titleEn: "The River Map",
    bodyEs:
      "Cada participante dibuja su 'mapa de río' — su trayectoria de liderazgo como un río: la fuente, los afluentes, los rápidos, las represas y la dirección actual del flujo. Debrief grupal para descubrir patrones comunes.",
    bodyEn:
      "Each participant draws their 'river map' — their leadership trajectory as a river: the source, tributaries, rapids, dams and current direction of flow. Group debrief to discover common patterns.",
    durationEs: "45 min · individual + grupo",
    durationEn: "45 min · individual + group",
    element: "agua",
  },
  // AIR — 3 exercises
  {
    iconName: "Mountain",
    titleEs: "La Perspectiva de la Cumbre",
    titleEn: "The Summit Perspective",
    bodyEs:
      "Asciende a un punto elevado. 20 minutos en silencio observando el paisaje. Tres preguntas que van de lo literal a lo metafórico: ¿qué ves desde aquí que no ves abajo? ¿Qué requiere de ti esta altitud? ¿Qué harías diferente si pudieras ver siempre desde aquí?",
    bodyEn:
      "Climb to an elevated point. 20 minutes in silence observing the landscape. Three questions from literal to metaphorical: what do you see from here that you do not see below? What does this altitude require of you? What would you do differently if you could always see from here?",
    durationEs: "60 min · individual",
    durationEn: "60 min · individual",
    element: "aire",
  },
  {
    iconName: "Wind",
    titleEs: "La Práctica del Silencio",
    titleEn: "The Silence Practice",
    bodyEs:
      "90 minutos en silencio completo en la naturaleza — caminando, sentados, observando — sin agenda, sin diarios, sin teléfono. Solo estar con el aire, el sonido, el movimiento y el espacio. Al regresar: '¿Qué hizo espacio el silencio?'",
    bodyEn:
      "90 minutes in complete silence in nature — walking, sitting, observing — no agenda, no journals, no phone. Just being with the air, the sound, the movement and the space. Returning: 'What did the silence make space for?'",
    durationEs: "2 h · grupo",
    durationEn: "2 h · group",
    element: "aire",
  },
  {
    iconName: "PenLine",
    titleEs: "La Verdad de 100 Palabras",
    titleEn: "The 100-Word Truth",
    bodyEs:
      "Escribe exactamente 100 palabras sobre tu desafío de liderazgo más importante. Luego 10 palabras: la esencia. Luego 1 palabra: el centro. La palabra final se convierte en tu brújula de liderazgo para los meses siguientes.",
    bodyEn:
      "Write exactly 100 words about your most important leadership challenge. Then 10 words: the essence. Then 1 word: the center. The final word becomes your leadership compass for the months ahead.",
    durationEs: "45 min · individual + grupo",
    durationEn: "45 min · individual + group",
    element: "aire",
  },
];

/**
 * Lexicon — terms from the new website-content pptx and master doc.
 */
export const lexiconEs = [
  "Tierra · ROOTS",
  "Fuego · IGNITE",
  "Agua · FLOW",
  "Aire · CLEAR",
  "Éter · Núcleo",
  "Liberación",
  "Encuentro",
  "Metodología",
  "Reflexión",
  "Diálogo",
  "Integración",
  "Esto no es un retiro — es un regreso",
];

export const lexiconEn = [
  "Earth · ROOTS",
  "Fire · IGNITE",
  "Water · FLOW",
  "Air · CLEAR",
  "Éter · Nucleus",
  "Release",
  "Encounter",
  "Methodology",
  "Reflection",
  "Dialogue",
  "Integration",
  "This is not a retreat — it is a return",
];

/**
 * Five Circles of Impact — from master doc and presentation page 6.
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
    whoEs: "El líder mismo",
    whoEn: "The leader",
    titleEs: "Núcleo",
    titleEn: "Nucleus",
    bodyEs:
      "Estado interior · Valores · Presencia · Propósito · Intención · Consciencia.",
    bodyEn:
      "Inner state · Values · Presence · Purpose · Intention · Consciousness.",
  },
  {
    level: "02",
    whoEs: "Reportes directos",
    whoEn: "Direct reports",
    titleEs: "Relación",
    titleEn: "Relationship",
    bodyEs:
      "Confianza · Seguridad · Comunicación · Desarrollo.",
    bodyEn:
      "Trust · Safety · Communication · Development.",
  },
  {
    level: "03",
    whoEs: "Departamento · División",
    whoEn: "Department · Division",
    titleEs: "Cultura",
    titleEn: "Culture",
    bodyEs:
      "Normas · Rituales · Estilo de decisión · Comunicación · Integración · Manejo de conflicto.",
    bodyEn:
      "Norms · Rituals · Decision style · Communication · Integration · Conflict handling.",
  },
  {
    level: "04",
    whoEs: "La empresa completa",
    whoEn: "Whole company",
    titleEs: "Organización",
    titleEn: "Organization",
    bodyEs:
      "Estrategia · Visión · Misión · Resultados · Innovación · Impacto · Contribución.",
    bodyEn:
      "Strategy · Vision · Mission · Results · Innovation · Impact · Contribution.",
  },
  {
    level: "05",
    whoEs: "Comunidad · Legado",
    whoEn: "Community · Legacy",
    titleEs: "Mundo",
    titleEn: "World",
    bodyEs:
      "Impacto y contribución global · Liderazgo regenerativo y humano.",
    bodyEn:
      "Global impact and contribution · Regenerative and human leadership.",
  },
];

/**
 * Elemental Shadow Profile — table from master doc.
 * Each leader has a primary, secondary, underdeveloped and shadow element.
 */
export interface ShadowProfileRow {
  element: ElementKey;
  bestEs: string;
  bestEn: string;
  stressEs: string;
  stressEn: string;
  giftEs: string;
  giftEn: string;
  shadowEs: string;
  shadowEn: string;
}

export const shadowProfile: ShadowProfileRow[] = [
  {
    element: "agua",
    bestEs: "Claro, adaptable, profundamente presente",
    bestEn: "Clear, adaptable, deeply present",
    stressEs: "Indeciso, evitativo, sobre-acomodador",
    stressEn: "Indecisive, evasive, over-accommodating",
    giftEs: "Escucha profunda · Flujo creativo",
    giftEn: "Deep listening · Creative flow",
    shadowEs: "Disolverse en las agendas de otros",
    shadowEn: "Dissolving into the agendas of others",
  },
  {
    element: "fuego",
    bestEs: "Visionario, valiente, activador",
    bestEn: "Visionary, courageous, activating",
    stressEs: "Controlador, consumidor, dominante",
    stressEn: "Controlling, consuming, dominating",
    giftEs: "Inspiración · Transformación · Movimiento",
    giftEn: "Inspiration · Transformation · Movement",
    shadowEs: "Quemar todo lo que lo rodea",
    shadowEn: "Burning everything around them",
  },
  {
    element: "aire",
    bestEs: "Perspectival, preciso, liberador",
    bestEn: "Perspectival, precise, liberating",
    stressEs: "Distante, sobre-pensador, frío",
    stressEn: "Distant, over-thinking, cold",
    giftEs: "Pensamiento sistémico · Veracidad",
    giftEn: "Systemic thinking · Truthfulness",
    shadowEs: "Volar tan alto que pierde a la gente",
    shadowEn: "Flying so high they lose their people",
  },
  {
    element: "tierra",
    bestEs: "Arraigado, confiable, sostenedor",
    bestEn: "Grounded, reliable, holding",
    stressEs: "Rígido, controlador, resistente al cambio",
    stressEn: "Rigid, controlling, resistant to change",
    giftEs: "Construcción de confianza · Presencia estable",
    giftEn: "Trust-building · Steady presence",
    shadowEs: "Volverse inamovible cuando se necesita flujo",
    shadowEn: "Becoming immovable when flow is needed",
  },
];

/**
 * Founder profile — only Ana Michelle Concepción appears in the new docs.
 */
export const founder = {
  nameEs: "Ana Michelle Concepción",
  nameEn: "Ana Michelle Concepción",
  roleEs: "Fundadora · Elements Method",
  roleEn: "Founder · Elements Method",
  bioEs:
    "En 25 años de trabajo con líderes en el Caribe, Estados Unidos y América Latina, Ana Michelle Concepción identificó un patrón consistente: los líderes más capaces son aquellos que viven en consciencia, con intención, y quienes priorizan su trabajo interior. Son coherentes con sus valores, tienen claridad de propósito, cuidan su cuerpo, sus emociones, su mente y su espíritu. Conectan con su naturaleza esencial y autenticidad. Elements Method nace como respuesta a ese diagnóstico.",
  bioEn:
    "Across 25 years working with leaders in the Caribbean, the United States, and Latin America, Ana Michelle Concepción identified a consistent pattern: the most capable leaders are those who live with consciousness and intention, and who prioritize their inner work. They are coherent with their values, hold clarity of purpose, and tend to their body, emotions, mind and spirit. They connect with their essential nature and authenticity. Elements Method was born as a response to that diagnosis.",
};

/**
 * Core values list — from proyecto.md "RESULTADOS".
 */
export const resultsEs = [
  "Mayor autoconsciencia y claridad de propósito",
  "Herramientas prácticas para los 4 dominios del liderazgo",
  "Red de pares comprometidos con el mismo método",
  "Plan de desarrollo personal para los 12 meses siguientes",
];

export const resultsEn = [
  "Greater self-awareness and clarity of purpose",
  "Practical tools for the 4 leadership domains",
  "A network of peers committed to the same method",
  "A personal development plan for the next 12 months",
];

/**
 * Audience listed in proyecto.md and master doc.
 */
export const audienceEs = [
  "Ejecutivos senior en momentos de transición o búsqueda de evolución",
  "Líderes que sienten que su liderazgo no refleja quiénes son",
  "Fundadores en puntos de inflexión del negocio",
  "Directivos enfrentando agotamiento o burnout",
  "Líderes buscando propósito que integre lo personal con lo profesional",
];

export const audienceEn = [
  "Senior executives in transition or seeking evolution",
  "Leaders whose leadership doesn't reflect who they are",
  "Founders at business inflection points",
  "Directors facing exhaustion or burnout",
  "Leaders seeking purpose that integrates personal with professional",
];

/**
 * Differentiators — verbatim from master doc.
 */
export const differentiatorsEs = [
  "Inmersión total en entornos naturales — no salas de conferencia",
  "Marco de los Cuatro Elementos como filosofía de desarrollo, no metáfora decorativa",
  "Trabajo desde adentro hacia afuera — el líder primero, las herramientas después",
  "Integración de neurociencia, NLP, psicología y práctica somática en cada sesión",
  "Dirigido por expertos con más de 25 años de experiencia",
  "Cada experiencia de retiro es inmersiva y diferente",
  "Te haces parte de una comunidad de líderes que buscan crecimiento y evolución",
];

export const differentiatorsEn = [
  "Total immersion in natural environments — not conference rooms",
  "The Four Elements framework as a development philosophy, not decorative metaphor",
  "Inside-out work — the leader first, the tools after",
  "Integration of neuroscience, NLP, psychology and somatic practice in every session",
  "Led by experts with over 25 years of experience",
  "Every retreat experience is immersive and distinct",
  "You become part of a community of leaders seeking growth and evolution",
];

/**
 * The 4-Element Daily Scan — from master doc.
 */
export const dailyScanEs = [
  {
    element: "agua" as ElementKey,
    promptEs:
      "¿Qué necesito escuchar más profundamente? ¿Dónde estoy resistiendo en lugar de fluyendo?",
  },
  {
    element: "fuego" as ElementKey,
    promptEs:
      "¿Qué necesito tener el coraje de decir o hacer? ¿Qué visión no estoy respaldando completamente?",
  },
  {
    element: "aire" as ElementKey,
    promptEs:
      "¿Qué perspectiva me falta? ¿Dónde necesito elevarme sobre mi vantage point actual?",
  },
  {
    element: "tierra" as ElementKey,
    promptEs:
      "¿Dónde necesito ser más consistente, más presente, más digno de confianza? ¿Qué fundamento necesita fortalecerse?",
  },
];

export const dailyScanEn = [
  {
    element: "agua" as ElementKey,
    promptEn:
      "What do I need to listen to more deeply? Where am I resisting instead of flowing?",
  },
  {
    element: "fuego" as ElementKey,
    promptEn:
      "What do I need to have the courage to say or do? What vision am I not fully backing?",
  },
  {
    element: "aire" as ElementKey,
    promptEn:
      "What perspective am I missing? Where do I need to rise above my current vantage point?",
  },
  {
    element: "tierra" as ElementKey,
    promptEn:
      "Where do I need to be more consistent, more present, more trustworthy? What foundation needs strengthening?",
  },
];

/**
 * The core mantra — combines the central line of golden_circle.md and
 * the pptx slide 3 / 7 opening tagline.
 */
export const mantraEs =
  "La naturaleza no gestiona. La naturaleza lidera. Esto no es un retiro — es un regreso.";
export const mantraEn =
  "Nature doesn't manage. Nature leads. This is not a retreat — it is a return.";

/**
 * Client logos — none documented. Placeholders only.
 */
export const clientLogos = [
  { name: "Lorem", initials: "LR" },
  { name: "Ipsum", initials: "IP" },
  { name: "Dolor", initials: "DR" },
  { name: "Sit", initials: "ST" },
  { name: "Amet", initials: "AM" },
  { name: "Consectetur", initials: "CN" },
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

export const blogPosts: BlogPost[] = [];

export function pickLocale<T extends Record<string, unknown>>(
  obj: T,
  locale: Locale,
  baseKey: string,
): string {
  const key = `${baseKey}${locale === "es" ? "Es" : "En"}` as keyof T;
  return (obj[key] ?? obj[`${baseKey}Es` as keyof T]) as string;
}
