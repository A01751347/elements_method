/**
 * Elements Method — Executive Experiences (próximos cursos).
 *
 * Source of truth: docs/productos/
 *   · "LANDING PAGE - Elements Awakening.docx"
 *   · "Landing_EQUINOX.docx"
 *   · "Landing_SOUL Discovery.docx"
 *
 * Spanish copy is taken from those documents; English is a faithful
 * translation. Prices/dates live BOTH here (display) and in the products
 * catalog seed (src/shared/db/seeds/products.ts) which is what checkout
 * actually charges — keep them in sync.
 */

import type { ElementKey } from "./content";

/** Bilingual string. */
export interface L {
  es: string;
  en: string;
}

export interface ExperiencePhase {
  key: string;
  /** Accent color source when the phase maps to an element (Awakening). */
  elementKey?: ElementKey;
  name: L;
  tagline: L;
  body: L;
}

export interface ExperienceSection {
  eyebrow?: L;
  headline: L;
  paragraphs?: L[];
  items?: L[];
  note?: L;
}

export interface ExperienceFacilitator {
  name: string;
  role: L;
  paragraphs: L[];
  image?: string;
}

export interface ExperienceFaq {
  q: L;
  a: L;
}

export interface ExperienceFact {
  label: L;
  value: L;
}

export interface Experience {
  slug: string;
  /** Catalog product slug checkout charges. null = apply-first (no direct sale). */
  productSlug: string | null;
  ctaMode: "checkout" | "apply";
  /** ISO start date (YYYY-MM-DD) — drives "next upcoming" promos site-wide. */
  startDateIso: string;
  elementKey: ElementKey;
  brand: L;
  title: string;
  tagline: L;
  lead: L;
  dateLabel: L;
  duration: L;
  location: L;
  modality: L;
  /** Lugares reales del grupo — el número que se comunica en todo el sitio. */
  seats: number;
  /** Official price in MXN. null = investment TBD. */
  priceMxn: number | null;
  earlyPriceMxn?: number;
  /** ISO date (inclusive) until which the early price applies. */
  earlyDeadlineIso?: string;
  earlyLabel?: L;
  includes: L;
  heroCta: L;
  intro: ExperienceSection;
  about: ExperienceSection;
  architecture: ExperienceSection;
  phases: ExperiencePhase[];
  outcomes: ExperienceSection;
  format: ExperienceSection;
  extras?: ExperienceSection[];
  venue: ExperienceSection & { pending?: boolean };
  facilitators: ExperienceFacilitator[];
  duo: ExperienceSection;
  facts: ExperienceFact[];
  faqs: ExperienceFaq[];
  closing: ExperienceSection & { cta: L; metaLine: L };
}

// ────────────────────────────────────────────────────────────────────────────
// ELEMENTS AWAKENING — retiro ejecutivo · 16-18 octubre 2026
// ────────────────────────────────────────────────────────────────────────────

const elementsAwakening: Experience = {
  slug: "elements-awakening",
  productSlug: null,
  ctaMode: "apply",
  startDateIso: "2026-10-16",
  elementKey: "eter",
  brand: {
    es: "An Elements Method Executive Experience",
    en: "An Elements Method Executive Experience",
  },
  title: "ELEMENTS AWAKENING",
  tagline: { es: "Lead Your True Nature.", en: "Lead Your True Nature." },
  lead: {
    es: "Una experiencia inmersiva de liderazgo para quienes han llegado lejos hacia afuera y están listos para ir más profundo hacia adentro.",
    en: "An immersive leadership experience for those who have gone far on the outside and are ready to go deeper within.",
  },
  dateLabel: {
    es: "16, 17 y 18 de octubre de 2026",
    en: "October 16, 17 & 18, 2026",
  },
  duration: { es: "2.5 días", en: "2.5 days" },
  location: { es: "Misión del Sol · Morelos", en: "Misión del Sol · Morelos" },
  modality: {
    es: "Presencial · Grupo reducido",
    en: "In person · Small group",
  },
  seats: 15,
  priceMxn: null,
  includes: {
    es: "Hospedaje, alimentos, materiales y actividades",
    en: "Lodging, meals, materials and activities",
  },
  heroCta: { es: "Solicitar invitación", en: "Request an invitation" },
  intro: {
    headline: {
      es: "The higher you lead, the deeper you must know yourself.",
      en: "The higher you lead, the deeper you must know yourself.",
    },
    paragraphs: [
      {
        es: "Liderar una empresa exige visión, estrategia y capacidad de decisión. Pero existe una dimensión del liderazgo que rara vez tiene espacio entre reuniones, resultados, responsabilidades y decisiones constantes: la capacidad de conocerte profundamente a ti mismo.",
        en: "Leading a company demands vision, strategy and decisiveness. But there is a dimension of leadership that rarely finds space between meetings, results, responsibilities and constant decisions: the capacity to know yourself deeply.",
      },
      {
        es: "Elements Awakening crea ese espacio. 2.5 días fuera del entorno cotidiano para observar cómo piensas, cómo reaccionas, cómo decides, cómo te relacionas y desde dónde estás liderando.",
        en: "Elements Awakening creates that space. 2.5 days outside your everyday environment to observe how you think, how you react, how you decide, how you relate and where you are leading from.",
      },
      {
        es: "No para convertirte en alguien diferente. Para liderar con mayor conciencia desde quien realmente eres.",
        en: "Not to become someone different. To lead with greater awareness from who you truly are.",
      },
    ],
  },
  about: {
    headline: {
      es: "Una experiencia ejecutiva creada por Elements Method",
      en: "An executive experience created by Elements Method",
    },
    paragraphs: [
      {
        es: "Una experiencia ejecutiva creada por Elements Method que combina naturaleza, autoconocimiento, reflexión estratégica y experiencias diseñadas para explorar cinco dimensiones del liderazgo.",
        en: "An executive experience created by Elements Method combining nature, self-knowledge, strategic reflection and experiences designed to explore five dimensions of leadership.",
      },
      {
        es: "A lo largo de 2.5 días, el proceso invita a detener el ruido, observar patrones, experimentar nuevas posibilidades e integrar los hallazgos en decisiones y prácticas que puedan regresar contigo a la vida real.",
        en: "Over 2.5 days, the process invites you to stop the noise, observe patterns, experiment with new possibilities and integrate the findings into decisions and practices that can return with you to real life.",
      },
    ],
  },
  architecture: {
    eyebrow: {
      es: "The Elements Method Architecture",
      en: "The Elements Method Architecture",
    },
    headline: {
      es: "From self awareness to conscious leadership",
      en: "From self awareness to conscious leadership",
    },
    paragraphs: [
      {
        es: "Cinco dimensiones naturales del ser, exploradas individualmente e integradas en una sola forma de liderar.",
        en: "Five natural dimensions of being, explored individually and integrated into a single way of leading.",
      },
    ],
    note: {
      es: "Self-awareness → 5 Elements → Integration → Conscious Leadership",
      en: "Self-awareness → 5 Elements → Integration → Conscious Leadership",
    },
  },
  phases: [
    {
      key: "tierra",
      elementKey: "tierra",
      name: { es: "Tierra · Grounding", en: "Earth · Grounding" },
      tagline: { es: "Ground yourself.", en: "Ground yourself." },
      body: {
        es: "Reconocer dónde estás parado, qué te sostiene y qué necesita mayor estructura. Presencia · estabilidad · límites · estructura.",
        en: "Recognize where you stand, what sustains you and what needs more structure. Presence · stability · boundaries · structure.",
      },
    },
    {
      key: "agua",
      elementKey: "agua",
      name: { es: "Agua · Adaptability", en: "Water · Adaptability" },
      tagline: { es: "Flow consciously.", en: "Flow consciously." },
      body: {
        es: "Observar tus emociones, relaciones y capacidad para adaptarte sin perder dirección. Inteligencia emocional · vínculo · flexibilidad · escucha.",
        en: "Observe your emotions, relationships and capacity to adapt without losing direction. Emotional intelligence · connection · flexibility · listening.",
      },
    },
    {
      key: "fuego",
      elementKey: "fuego",
      name: { es: "Fuego · Intention", en: "Fire · Intention" },
      tagline: { es: "Ignite your intention.", en: "Ignite your intention." },
      body: {
        es: "Reconectar con aquello que te mueve, confrontar lo que limita tu avance y transformar intención en acción. Propósito · energía · decisión · acción.",
        en: "Reconnect with what moves you, confront what limits your progress and turn intention into action. Purpose · energy · decision · action.",
      },
    },
    {
      key: "aire",
      elementKey: "aire",
      name: { es: "Aire · Perspective", en: "Air · Perspective" },
      tagline: {
        es: "Expand your perspective.",
        en: "Expand your perspective.",
      },
      body: {
        es: "Crear distancia del ruido para observar con mayor claridad, ampliar perspectiva y tomar mejores decisiones. Claridad · pensamiento · visión · posibilidad.",
        en: "Create distance from the noise to observe more clearly, widen perspective and make better decisions. Clarity · thinking · vision · possibility.",
      },
    },
    {
      key: "eter",
      elementKey: "eter",
      name: { es: "Éter · Integration", en: "Ether · Integration" },
      tagline: {
        es: "Integrate who you are.",
        en: "Integrate who you are.",
      },
      body: {
        es: "Unir los aprendizajes de los otros elementos para liderar con mayor coherencia, presencia y sentido. Consciencia · coherencia · integración · sentido.",
        en: "Bring together the learnings of the other elements to lead with greater coherence, presence and meaning. Awareness · coherence · integration · meaning.",
      },
    },
  ],
  outcomes: {
    headline: {
      es: "What changes when you lead from within?",
      en: "What changes when you lead from within?",
    },
    paragraphs: [
      {
        es: "Elements Awakening está diseñado para abrir una pausa que permita observar, integrar y elegir con mayor consciencia. Cada participante recorrerá el proceso desde su propia realidad.",
        en: "Elements Awakening is designed to open a pause that allows you to observe, integrate and choose with greater awareness. Each participant walks the process from their own reality.",
      },
    ],
    items: [
      {
        es: "Mayor claridad para reconocer qué requiere atención ahora.",
        en: "Greater clarity to recognize what needs attention now.",
      },
      {
        es: "Más autoconocimiento sobre patrones, reacciones y formas de relacionarte.",
        en: "More self-knowledge about patterns, reactions and ways of relating.",
      },
      {
        es: "Recursos para regular emociones y responder con mayor presencia.",
        en: "Resources to regulate emotions and respond with greater presence.",
      },
      {
        es: "Perspectiva para tomar decisiones menos automáticas y más conscientes.",
        en: "Perspective to make decisions that are less automatic and more conscious.",
      },
      {
        es: "Reconexión con intención, energía y sentido personal.",
        en: "Reconnection with intention, energy and personal meaning.",
      },
      {
        es: "Un marco integrador que puedas seguir utilizando después del retiro.",
        en: "An integrative framework you can keep using after the retreat.",
      },
    ],
  },
  format: {
    headline: {
      es: "2.5 days to step out of the noise — and back into yourself.",
      en: "2.5 days to step out of the noise — and back into yourself.",
    },
    paragraphs: [
      {
        es: "El recorrido alterna conversaciones guiadas, reflexión individual, prácticas experienciales, movimiento, naturaleza, integración y espacios de pausa. El ritmo está diseñado para profundizar sin saturar y para dejar que cada descubrimiento encuentre su lugar.",
        en: "The journey alternates guided conversations, individual reflection, experiential practices, movement, nature, integration and spaces to pause. The rhythm is designed to go deep without saturating, letting each discovery find its place.",
      },
    ],
    items: [
      {
        es: "Sesiones facilitadas y conversaciones en grupo reducido.",
        en: "Facilitated sessions and small-group conversations.",
      },
      {
        es: "Ejercicios individuales de observación e integración.",
        en: "Individual observation and integration exercises.",
      },
      {
        es: "Experiencias en contacto con la naturaleza.",
        en: "Experiences in contact with nature.",
      },
      {
        es: "Movimiento y pausas conscientes.",
        en: "Movement and conscious pauses.",
      },
      {
        es: "Momentos de silencio, descanso y convivencia.",
        en: "Moments of silence, rest and shared time.",
      },
      {
        es: "Cierre con integración personal y próximos pasos.",
        en: "Closing with personal integration and next steps.",
      },
    ],
    note: {
      es: "No es una conferencia. No es turismo de bienestar. Es un proceso cuidadosamente diseñado en el que contenido, entorno y ritmo forman parte de una misma experiencia de conocimiento y aprendizaje en liderazgo de alto rendimiento.",
      en: "It is not a conference. It is not wellness tourism. It is a carefully designed process where content, environment and rhythm are part of one single experience of knowledge and learning in high-performance leadership.",
    },
  },
  venue: {
    headline: {
      es: "El lugar también es parte del proceso",
      en: "The place is also part of the process",
    },
    paragraphs: [
      {
        es: "Elements Awakening tendrá lugar en Misión del Sol, un espacio concebido alrededor del bienestar, la naturaleza y la pausa consciente.",
        en: "Elements Awakening takes place at Misión del Sol, a space conceived around wellbeing, nature and conscious pause.",
      },
      {
        es: "Rodeado de jardines y vegetación, su arquitectura abierta, sus espacios de contemplación y su propuesta enfocada en el bienestar crean las condiciones para alejarnos del ritmo habitual de la ciudad y entrar verdaderamente en la experiencia.",
        en: "Surrounded by gardens and vegetation, its open architecture, contemplation spaces and wellbeing-focused approach create the conditions to leave the city's usual rhythm behind and truly enter the experience.",
      },
      {
        es: "Más que hospedarnos en un hotel, buscamos crear un entorno que acompañe el proceso. Naturaleza. Silencio. Movimiento. Alimentación consciente. Descanso. Todo el espacio se convierte en parte de Elements Awakening.",
        en: "More than staying at a hotel, we seek to create an environment that accompanies the process. Nature. Silence. Movement. Conscious nourishment. Rest. The entire space becomes part of Elements Awakening.",
      },
    ],
  },
  facilitators: [
    {
      name: "Ana Michelle",
      role: {
        es: "Facilitadora de Elements Method Executive Experiences",
        en: "Facilitator, Elements Method Executive Experiences",
      },
      image: "/images/founders/ana-michelle.jpg",
      paragraphs: [
        {
          es: "Ana Michelle es coach de resultados y bienestar. Tras más de dos décadas liderando equipos a nivel directivo en organizaciones globales, dejó el mundo corporativo para acompañar a líderes de alto rendimiento en procesos de desarrollo humano y liderazgo desde una perspectiva que integra autoconocimiento, consciencia, herramientas de coaching y trabajo experiencial.",
          en: "Ana Michelle is a results and wellbeing coach. After more than two decades leading executive-level teams in global organizations, she left the corporate world to accompany high-performance leaders through human development and leadership processes from a perspective that integrates self-knowledge, awareness, coaching tools and experiential work.",
        },
        {
          es: "Durante Elements Awakening será quien conduzca al grupo a través de los diferentes elementos, conversaciones, ejercicios de coaching internacional, neurociencia, programación neurolingüística y práctica somática, acompañados por momentos de reflexión que conforman el proceso.",
          en: "During Elements Awakening she leads the group through the different elements, conversations, international coaching exercises, neuroscience, neuro-linguistic programming and somatic practice, accompanied by the moments of reflection that shape the process.",
        },
        {
          es: "Su papel no es decirte cómo debes liderar. Es crear las preguntas, herramientas y condiciones necesarias para que puedas observarte con mayor profundidad y encontrar tus propias respuestas.",
          en: "Her role is not to tell you how to lead. It is to create the questions, tools and conditions you need to observe yourself more deeply and find your own answers.",
        },
      ],
    },
    {
      name: "Andrés Flores",
      role: {
        es: "Experience Curator de Elements Method Executive Experiences",
        en: "Experience Curator, Elements Method Executive Experiences",
      },
      image: "/images/founders/andres-flores.jpg",
      paragraphs: [
        {
          es: "Publicista y estratega creativo con experiencia desarrollando proyectos y campañas en México, Estados Unidos, España y Japón para marcas globales. Su trabajo ha evolucionado hacia la creación de experiencias que conectan estrategia comercial, comportamiento humano, naturaleza y transformación personal, así como procesos de Personal Branding y construcción de identidad.",
          en: "Advertising professional and creative strategist with experience developing projects and campaigns in Mexico, the United States, Spain and Japan for global brands. His work has evolved toward creating experiences that connect commercial strategy, human behavior, nature and personal transformation, as well as Personal Branding and identity-building processes.",
        },
        {
          es: "En Elements Awakening, Andrés es responsable de cuidar la experiencia completa: desde la narrativa y los momentos de transición entre las dinámicas de cada módulo, así como la relación con la naturaleza y los detalles que rodean el estado emocional del participante.",
          en: "In Elements Awakening, Andrés is responsible for caring for the complete experience: from the narrative and the transitions between each module's dynamics, to the relationship with nature and the details surrounding each participant's emotional state.",
        },
        {
          es: "Porque una experiencia transformadora no depende únicamente de lo que sucede dentro de una sesión. Depende de cómo se siente todo lo que ocurre alrededor de ella.",
          en: "Because a transformative experience does not depend only on what happens inside a session. It depends on how everything around it feels.",
        },
      ],
    },
  ],
  duo: {
    headline: {
      es: "Two perspectives. One experience.",
      en: "Two perspectives. One experience.",
    },
    items: [
      {
        es: "Ana Michelle conduce el proceso interior.",
        en: "Ana Michelle leads the inner process.",
      },
      {
        es: "Andrés Flores cuida la experiencia exterior.",
        en: "Andrés Flores curates the outer experience.",
      },
    ],
    paragraphs: [
      {
        es: "Dos perspectivas complementarias —desarrollo humano y diseño estratégico de experiencias— integradas bajo Elements Method para crear un retiro donde contenido, entorno, naturaleza y cada momento formen parte de una misma narrativa.",
        en: "Two complementary perspectives —human development and strategic experience design— integrated under Elements Method to create a retreat where content, environment, nature and every moment are part of one single narrative.",
      },
    ],
  },
  facts: [
    {
      label: { es: "Fecha", en: "Date" },
      value: {
        es: "16, 17 y 18 de octubre de 2026",
        en: "October 16, 17 & 18, 2026",
      },
    },
    { label: { es: "Duración", en: "Duration" }, value: { es: "2.5 días", en: "2.5 days" } },
    {
      label: { es: "Lugar", en: "Venue" },
      value: { es: "Misión del Sol · Morelos", en: "Misión del Sol · Morelos" },
    },
    {
      label: { es: "Modalidad", en: "Format" },
      value: {
        es: "Presencial · Grupo reducido",
        en: "In person · Small group",
      },
    },
    {
      label: { es: "Inversión", en: "Investment" },
      value: { es: "Por confirmar", en: "To be confirmed" },
    },
    {
      label: { es: "Incluye", en: "Includes" },
      value: {
        es: "Hospedaje, alimentos, materiales y actividades",
        en: "Lodging, meals, materials and activities",
      },
    },
  ],
  faqs: [
    {
      q: { es: "¿Necesito experiencia previa?", en: "Do I need prior experience?" },
      a: {
        es: "No. La experiencia está diseñada para participar desde tu propia realidad. Sólo se requiere apertura y disposición para involucrarte en el proceso.",
        en: "No. The experience is designed so you participate from your own reality. All it takes is openness and willingness to engage in the process.",
      },
    },
    {
      q: {
        es: "¿Es un retiro espiritual o terapéutico?",
        en: "Is this a spiritual or therapeutic retreat?",
      },
      a: {
        es: "Es una experiencia de liderazgo y autoconocimiento. No sustituye psicoterapia, atención médica ni tratamiento clínico.",
        en: "It is a leadership and self-knowledge experience. It does not replace psychotherapy, medical care or clinical treatment.",
      },
    },
    {
      q: {
        es: "¿Cómo funciona la solicitud de invitación?",
        en: "How does the invitation request work?",
      },
      a: {
        es: "Completa una aplicación. El equipo revisará la disponibilidad y composición del grupo, y se pondrá en contacto contigo.",
        en: "Complete an application. The team reviews availability and the group's composition, and will get in touch with you.",
      },
    },
    {
      q: { es: "¿Qué incluye la inversión?", en: "What does the investment include?" },
      a: {
        es: "Hospedaje, alimentación, materiales, sesiones y actividades.",
        en: "Lodging, meals, materials, sessions and activities.",
      },
    },
    {
      q: { es: "¿Cómo llego a Misión del Sol?", en: "How do I get to Misión del Sol?" },
      a: {
        es: "Misión del Sol Resort & Spa. Gral. Diego Díaz González Mtz. 31, José G. Parres, 62564 Jiutepec, Morelos. Mapa: https://maps.app.goo.gl/RFbSDNeey8Q324818",
        en: "Misión del Sol Resort & Spa. Gral. Diego Díaz González Mtz. 31, José G. Parres, 62564 Jiutepec, Morelos. Map: https://maps.app.goo.gl/RFbSDNeey8Q324818",
      },
    },
    {
      q: { es: "¿Qué debo llevar?", en: "What should I bring?" },
      a: {
        es: "Ropa cómoda para clima caluroso, algo para cubrirte por la noche, ropa de hiking, tenis cómodos, traje de baño y bloqueador.",
        en: "Comfortable clothes for warm weather, a layer for the evening, hiking clothes, comfortable sneakers, a swimsuit and sunscreen.",
      },
    },
  ],
  closing: {
    headline: { es: "Elements Awakening", en: "Elements Awakening" },
    paragraphs: [
      {
        es: "Una pausa para observarte. Reconoce los elementos para conectar con tu verdadero poder. Una forma más consciente de volver a liderar.",
        en: "A pause to observe yourself. Recognize the elements to connect with your true power. A more conscious way to return to leading.",
      },
    ],
    metaLine: {
      es: "Octubre 2026 · Misión del Sol, Morelos · 2.5 días · Grupo limitado",
      en: "October 2026 · Misión del Sol, Morelos · 2.5 days · Limited group",
    },
    cta: { es: "Solicitar invitación", en: "Request an invitation" },
  },
};

// ────────────────────────────────────────────────────────────────────────────
// EQUINOX — el arte de la transición interior · 22 septiembre 2026
// ────────────────────────────────────────────────────────────────────────────

const equinox: Experience = {
  slug: "equinox",
  productSlug: "equinox",
  ctaMode: "checkout",
  startDateIso: "2026-09-22",
  elementKey: "agua",
  brand: {
    es: "An Elements Method Executive Experience",
    en: "An Elements Method Executive Experience",
  },
  title: "EQUINOX",
  tagline: {
    es: "El arte de la transición interior.",
    en: "The art of inner transition.",
  },
  lead: {
    es: "Tu vida también tiene estaciones. Una experiencia de transformación humana para observar, soltar, reconfigurar, realinear y emerger.",
    en: "Your life has seasons too. A human transformation experience to observe, release, reconfigure, realign and emerge.",
  },
  dateLabel: {
    es: "22 de septiembre de 2026 · 9:00–19:00",
    en: "September 22, 2026 · 9:00–19:00",
  },
  duration: { es: "Un día", en: "One day" },
  location: {
    es: "Ciudad de México · dirección exacta 7 días antes",
    en: "Mexico City · exact address 7 days before",
  },
  modality: { es: "Presencial · 20 lugares", en: "In person · 20 seats" },
  seats: 20,
  priceMxn: 7500,
  earlyPriceMxn: 5900,
  earlyDeadlineIso: "2026-09-06",
  earlyLabel: {
    es: "Early Access $5,900 MXN hasta el 6 de septiembre",
    en: "Early Access MX$5,900 through September 6",
  },
  includes: {
    es: "Experiencia, journal, materiales, alimentos y 30 días de integración",
    en: "The experience, journal, materials, meals and 30 days of integration",
  },
  heroCta: { es: "Reserva tu lugar", en: "Reserve your seat" },
  intro: {
    headline: {
      es: "Hay momentos en los que sabes que necesitas evolucionar",
      en: "There are moments when you know you need to evolve",
    },
    paragraphs: [
      {
        es: "Hay momentos en los que la vida cambia antes de que encontremos palabras para explicarlo. Tal vez estás creciendo, tomando decisiones, cerrando una etapa, comenzando otra, redefiniendo tu liderazgo o simplemente sintiendo que algo dentro de ti pide evolucionar.",
        en: "There are moments when life changes before we find words to explain it. Maybe you are growing, making decisions, closing one chapter, beginning another, redefining your leadership — or simply feeling that something inside you is asking to evolve.",
      },
      {
        es: "A veces la señal es silenciosa: lo que antes te movía ya no lo hace. Una identidad se siente pequeña. Un patrón dejó de servir. Una conversación o una decisión siguen esperando.",
        en: "Sometimes the signal is silent: what used to move you no longer does. An identity feels small. A pattern stopped serving. A conversation or a decision keeps waiting.",
      },
      {
        es: "EQUINOX crea un día para escuchar esa transición antes de seguir avanzando por inercia.",
        en: "EQUINOX creates one day to listen to that transition before moving forward on inertia.",
      },
    ],
  },
  about: {
    headline: {
      es: "Inspirada en el equinoccio de septiembre",
      en: "Inspired by the September equinox",
    },
    paragraphs: [
      {
        es: "EQUINOX — El Arte de la Transición Interior es una experiencia de alto nivel para el desarrollo humano inspirada en el equinoccio de septiembre.",
        en: "EQUINOX — The Art of Inner Transition is a high-level human development experience inspired by the September equinox.",
      },
      {
        es: "Integra neurociencia y aprendizaje, coaching, herramientas de NLP utilizadas responsablemente, movimiento accesible, naturaleza, arte, reflexión y prácticas contemplativas en un recorrido diseñado para reconocer qué está terminando, qué está emergiendo y qué necesita práctica deliberada.",
        en: "It integrates neuroscience and learning, coaching, responsibly used NLP tools, accessible movement, nature, art, reflection and contemplative practices in a journey designed to recognize what is ending, what is emerging and what needs deliberate practice.",
      },
      {
        es: "No para convertirte en alguien distinto de la noche a la mañana. Para volverte más consciente de lo que eliges practicar después.",
        en: "Not to turn you into someone different overnight. To make you more aware of what you choose to practice next.",
      },
    ],
  },
  architecture: {
    eyebrow: { es: "The Art of Inner Transition", en: "The Art of Inner Transition" },
    headline: {
      es: "Cinco movimientos para entrar conscientemente en tu próxima etapa",
      en: "Five movements to enter your next season consciously",
    },
    paragraphs: [
      {
        es: "El proceso avanza desde la conciencia hacia la acción: observar lo que es verdad ahora, crear espacio, ensayar nuevas respuestas, recuperar dirección y convertir una elección en práctica.",
        en: "The process moves from awareness to action: observing what is true now, creating space, rehearsing new responses, recovering direction and turning one choice into practice.",
      },
    ],
    note: {
      es: "Observa → Suelta → Reconfigura → Realinea → Emerge",
      en: "Observe → Release → Reconfigure → Realign → Emerge",
    },
  },
  phases: [
    {
      key: "observa",
      name: { es: "Observa", en: "Observe" },
      tagline: { es: "Reconoce antes de cambiar.", en: "Recognize before changing." },
      body: {
        es: "Mapea la estación actual de tu cuerpo, mente, emociones, relaciones, propósito, trabajo/liderazgo y vida interior. Nombra sin juicio lo que pide atención.",
        en: "Map the current season of your body, mind, emotions, relationships, purpose, work/leadership and inner life. Name what asks for attention, without judgment.",
      },
    },
    {
      key: "suelta",
      name: { es: "Suelta", en: "Release" },
      tagline: {
        es: "Crear espacio también es avanzar.",
        en: "Creating space is also moving forward.",
      },
      body: {
        es: "Explora la relación entre creencias, comportamientos y resultados. Cuestiona lo que aprendiste a sostener y elige qué deja de guiarte.",
        en: "Explore the relationship between beliefs, behaviors and results. Question what you learned to carry and choose what stops guiding you.",
      },
    },
    {
      key: "reconfigura",
      name: { es: "Reconfigura", en: "Reconfigure" },
      tagline: {
        es: "Cambiar no es sólo querer. También es practicar.",
        en: "Change is not just wanting. It is also practicing.",
      },
      body: {
        es: "Interrumpe el piloto automático mediante novedad, atención, coordinación, movimiento y pequeñas respuestas repetibles.",
        en: "Interrupt the autopilot through novelty, attention, coordination, movement and small repeatable responses.",
      },
    },
    {
      key: "realinea",
      name: { es: "Realinea", en: "Realign" },
      tagline: { es: "Haz visible lo que importa.", en: "Make what matters visible." },
      body: {
        es: "Ordena valores, energía y prioridades. Define una decisión, una conversación y un límite que protejan tu próxima etapa.",
        en: "Order values, energy and priorities. Define one decision, one conversation and one boundary that protect your next season.",
      },
    },
    {
      key: "emerge",
      name: { es: "Emerge", en: "Emerge" },
      tagline: {
        es: "La intención cobra forma en la acción.",
        en: "Intention takes shape in action.",
      },
      body: {
        es: "Integra el recorrido en una visión de futuro y un plan de 30 días con prácticas observables y apoyo de seguimiento.",
        en: "Integrate the journey into a vision of the future and a 30-day plan with observable practices and follow-up support.",
      },
    },
  ],
  outcomes: {
    headline: {
      es: "La experiencia termina. La práctica continúa.",
      en: "The experience ends. The practice continues.",
    },
    paragraphs: [
      {
        es: "No sales únicamente inspirado. Sales con un siguiente paso que puedes observar, practicar y revisar.",
        en: "You don't leave merely inspired. You leave with a next step you can observe, practice and review.",
      },
    ],
    items: [
      {
        es: "Claridad sobre la etapa que estás viviendo.",
        en: "Clarity about the season you are living.",
      },
      {
        es: "Una creencia o patrón que deseas interrumpir.",
        en: "One belief or pattern you want to interrupt.",
      },
      {
        es: "Una respuesta nueva, específica y repetible.",
        en: "One new, specific, repeatable response.",
      },
      {
        es: "Una decisión, una conversación y un límite definidos.",
        en: "One decision, one conversation and one boundary, defined.",
      },
      {
        es: "EQUINOX Transformation Journal.",
        en: "EQUINOX Transformation Journal.",
      },
      { es: "Tu mapa “My Next Season”.", en: "Your “My Next Season” map." },
      { es: "Carta de tu Yo Futuro.", en: "A letter from your Future Self." },
      {
        es: "Sistema guiado de integración durante 30 días.",
        en: "A guided 30-day integration system.",
      },
    ],
  },
  format: {
    headline: {
      es: "Un día fuera de la rutina. Un recorrido hacia lo que sigue.",
      en: "One day outside the routine. A journey toward what comes next.",
    },
    paragraphs: [
      {
        es: "EQUINOX alterna atención enfocada, reflexión, novedad, movimiento y descanso. La experiencia privilegia aprender haciendo: conversaciones cuidadas, actividades de poder y momentos de introspección guiados para el objetivo de cada participante.",
        en: "EQUINOX alternates focused attention, reflection, novelty, movement and rest. The experience privileges learning by doing: careful conversations, powerful activities and guided introspection aimed at each participant's objective.",
      },
    ],
    items: [
      { es: "Mapa de Estaciones Interiores.", en: "Inner Seasons Map." },
      {
        es: "Árbol de Creencias y preguntas de reencuadre.",
        en: "Belief Tree and reframing questions.",
      },
      {
        es: "Laboratorio de neuroplasticidad y práctica de nuevas respuestas.",
        en: "Neuroplasticity lab and new-response practice.",
      },
      {
        es: "Movimiento accesible y caminata sensorial en naturaleza.",
        en: "Accessible movement and a sensory walk in nature.",
      },
      {
        es: "Perspectivas: yo, la otra persona, observador y yo futuro.",
        en: "Perspectives: self, the other person, observer and future self.",
      },
      {
        es: "Creación artística no verbal: lo que termina y lo que emerge.",
        en: "Non-verbal artistic creation: what ends and what emerges.",
      },
      {
        es: "Brújula Interior y carta del Yo Futuro.",
        en: "Inner Compass and Future Self letter.",
      },
      {
        es: "Ritual de transición alrededor del momento del equinoccio.",
        en: "A transition ritual around the moment of the equinox.",
      },
    ],
    note: {
      es: "Toda práctica corporal o en pareja es opcional.",
      en: "Every body-based or partner practice is optional.",
    },
  },
  extras: [
    {
      headline: {
        es: "Una misma experiencia. Distintas transiciones.",
        en: "One same experience. Different transitions.",
      },
      paragraphs: [
        {
          es: "EQUINOX reúne líderes, empresarios, profesionales y creadores que desean entrar en su próxima etapa con mayor conciencia.",
          en: "EQUINOX brings together leaders, entrepreneurs, professionals and creators who want to enter their next season with greater awareness.",
        },
      ],
      items: [
        {
          es: "Estás creciendo y la versión anterior de ti ya no alcanza.",
          en: "You are growing and the previous version of you is no longer enough.",
        },
        {
          es: "Lideras cambios para otros y necesitas observar el tuyo.",
          en: "You lead change for others and need to observe your own.",
        },
        {
          es: "Estás cerrando, comenzando o redefiniendo una etapa.",
          en: "You are closing, beginning or redefining a chapter.",
        },
        {
          es: "Necesitas recuperar perspectiva antes de decidir.",
          en: "You need to recover perspective before deciding.",
        },
        {
          es: "Quieres trabajar contigo sin entrar en un retiro tradicional.",
          en: "You want to work on yourself without entering a traditional retreat.",
        },
      ],
    },
    {
      headline: {
        es: "Profundidad humana. Crecimiento intelectual.",
        en: "Human depth. Intellectual growth.",
      },
      paragraphs: [
        {
          es: "La ciencia no es decoración. EQUINOX utiliza principios asociados con aprendizaje dependiente de la experiencia, atención, movimiento, mindfulness y contacto con la naturaleza para diseñar condiciones que pueden favorecer reflexión y aprendizaje.",
          en: "The science is not decoration. EQUINOX uses principles associated with experience-dependent learning, attention, movement, mindfulness and contact with nature to design conditions that can favor reflection and learning.",
        },
        {
          es: "La metáfora de las estaciones aporta sentido; el coaching y el arte abren perspectivas; la integración convierte hallazgos en práctica. EQUINOX es una experiencia educativa y de desarrollo humano.",
          en: "The seasons metaphor brings meaning; coaching and art open perspectives; integration turns findings into practice. EQUINOX is an educational, human-development experience.",
        },
      ],
    },
  ],
  venue: {
    pending: true,
    headline: {
      es: "El lugar también es parte del proceso",
      en: "The place is also part of the process",
    },
    paragraphs: [
      {
        es: "La experiencia será en la Ciudad de México. El venue y las indicaciones de llegada se confirmarán próximamente.",
        en: "The experience takes place in Mexico City. The venue and arrival details will be confirmed soon.",
      },
    ],
  },
  facilitators: [
    {
      name: "Ana Michelle",
      role: {
        es: "Facilitadora de Elements Method Executive Experiences",
        en: "Facilitator, Elements Method Executive Experiences",
      },
      image: "/images/founders/ana-michelle.jpg",
      paragraphs: [
        {
          es: "Ana Michelle es coach de resultados y bienestar. Tras más de dos décadas liderando equipos a nivel directivo en organizaciones globales, dejó el mundo corporativo para acompañar a líderes de alto rendimiento en procesos de desarrollo humano y liderazgo desde una perspectiva que integra autoconocimiento, consciencia, herramientas de coaching y trabajo experiencial.",
          en: "Ana Michelle is a results and wellbeing coach. After more than two decades leading executive-level teams in global organizations, she left the corporate world to accompany high-performance leaders through human development and leadership processes from a perspective that integrates self-knowledge, awareness, coaching tools and experiential work.",
        },
        {
          es: "Durante EQUINOX será quien conduzca al grupo a través de conversaciones, ejercicios de coaching internacional, neurociencia, programación neurolingüística y práctica somática, acompañados por momentos de reflexión que conforman el proceso.",
          en: "During EQUINOX she leads the group through conversations, international coaching exercises, neuroscience, neuro-linguistic programming and somatic practice, accompanied by the moments of reflection that shape the process.",
        },
        {
          es: "Su papel no es decirte cómo debes liderar. Es crear las preguntas, herramientas y condiciones necesarias para que puedas observarte con mayor profundidad y encontrar tus propias respuestas.",
          en: "Her role is not to tell you how to lead. It is to create the questions, tools and conditions you need to observe yourself more deeply and find your own answers.",
        },
      ],
    },
    {
      name: "Andrés Flores",
      role: {
        es: "Experience Curator de Elements Method Executive Experiences",
        en: "Experience Curator, Elements Method Executive Experiences",
      },
      image: "/images/founders/andres-flores.jpg",
      paragraphs: [
        {
          es: "Publicista y estratega creativo con experiencia desarrollando proyectos y campañas en México, Estados Unidos, España y Japón para marcas globales. Su trabajo ha evolucionado hacia la creación de experiencias que conectan estrategia comercial, comportamiento humano, naturaleza y transformación personal.",
          en: "Advertising professional and creative strategist with experience developing projects and campaigns in Mexico, the United States, Spain and Japan for global brands. His work has evolved toward creating experiences that connect commercial strategy, human behavior, nature and personal transformation.",
        },
        {
          es: "En EQUINOX, Andrés es responsable de cuidar la experiencia completa: desde la narrativa y los momentos de transición entre las dinámicas de cada módulo, así como la relación con la naturaleza y los detalles que rodean el estado emocional del participante.",
          en: "In EQUINOX, Andrés is responsible for caring for the complete experience: from the narrative and the transitions between each module's dynamics, to the relationship with nature and the details surrounding each participant's emotional state.",
        },
      ],
    },
  ],
  duo: {
    headline: {
      es: "Two perspectives. One experience.",
      en: "Two perspectives. One experience.",
    },
    items: [
      {
        es: "Ana Michelle conduce el proceso interior.",
        en: "Ana Michelle leads the inner process.",
      },
      {
        es: "Andrés Flores cuida la experiencia exterior.",
        en: "Andrés Flores curates the outer experience.",
      },
    ],
    paragraphs: [
      {
        es: "Dos perspectivas complementarias —desarrollo humano y diseño estratégico de experiencias— integradas bajo Elements Method para crear una experiencia donde contenido, entorno y cada momento formen parte de una misma narrativa.",
        en: "Two complementary perspectives —human development and strategic experience design— integrated under Elements Method to create an experience where content, environment and every moment are part of one single narrative.",
      },
    ],
  },
  facts: [
    {
      label: { es: "Fecha", en: "Date" },
      value: {
        es: "22 de septiembre de 2026 · 9:00–19:00",
        en: "September 22, 2026 · 9:00–19:00",
      },
    },
    { label: { es: "Duración", en: "Duration" }, value: { es: "Un día", en: "One day" } },
    {
      label: { es: "Lugar", en: "Venue" },
      value: {
        es: "Ciudad de México · por confirmar",
        en: "Mexico City · to be confirmed",
      },
    },
    {
      label: { es: "Modalidad", en: "Format" },
      value: { es: "Presencial · Cupo limitado", en: "In person · Limited seats" },
    },
    {
      label: { es: "Inversión", en: "Investment" },
      value: {
        es: "$7,500 MXN · Early Access $5,900 hasta el 6 de septiembre",
        en: "MX$7,500 · Early Access MX$5,900 through September 6",
      },
    },
    {
      label: { es: "Incluye", en: "Includes" },
      value: {
        es: "Experiencia, journal, materiales, alimentos y 30 días de integración",
        en: "Experience, journal, materials, meals and 30 days of integration",
      },
    },
  ],
  faqs: [
    {
      q: { es: "¿Necesito experiencia previa?", en: "Do I need prior experience?" },
      a: {
        es: "No. La experiencia está diseñada para participar desde tu propia realidad. Sólo se requiere apertura y disposición para involucrarte en el proceso.",
        en: "No. The experience is designed so you participate from your own reality. All it takes is openness and willingness to engage in the process.",
      },
    },
    {
      q: {
        es: "¿Es un retiro espiritual o terapéutico?",
        en: "Is this a spiritual or therapeutic retreat?",
      },
      a: {
        es: "Es una experiencia de liderazgo y autoconocimiento. No sustituye psicoterapia, atención médica ni tratamiento clínico.",
        en: "It is a leadership and self-knowledge experience. It does not replace psychotherapy, medical care or clinical treatment.",
      },
    },
    {
      q: { es: "¿Qué incluye mi entrada?", en: "What does my ticket include?" },
      a: {
        es: "La experiencia, journal, materiales, alimentos y 30 días de integración.",
        en: "The experience, journal, materials, meals and 30 days of integration.",
      },
    },
    {
      q: { es: "¿Puedo asistir con alguien?", en: "Can I attend with someone?" },
      a: {
        es: "Sí. Existe una modalidad para dos personas y paquetes corporativos, sujetos a disponibilidad.",
        en: "Yes. There is a two-person option and corporate packages, subject to availability.",
      },
    },
    {
      q: { es: "¿Dónde será?", en: "Where will it be?" },
      a: {
        es: "En Ciudad de México. El venue y las indicaciones de llegada se confirmarán antes de la experiencia.",
        en: "In Mexico City. The venue and arrival details will be confirmed before the experience.",
      },
    },
    {
      q: {
        es: "¿Necesito estar atravesando una crisis?",
        en: "Do I need to be going through a crisis?",
      },
      a: {
        es: "No. EQUINOX también es para momentos de crecimiento, redefinición o una señal silenciosa de que algo necesita evolucionar.",
        en: "No. EQUINOX is also for moments of growth, redefinition, or a silent signal that something needs to evolve.",
      },
    },
  ],
  closing: {
    headline: {
      es: "La estación cambia. ¿Qué elegirás tú?",
      en: "The season changes. What will you choose?",
    },
    paragraphs: [
      {
        es: "Un día para observar lo que es verdad, soltar lo que ya no corresponde, practicar nuevas posibilidades y entrar con intención en lo que sigue.",
        en: "One day to observe what is true, release what no longer fits, practice new possibilities and enter what comes next with intention.",
      },
    ],
    metaLine: {
      es: "22 de septiembre de 2026 · Ciudad de México · 9:00–19:00 · Cupo limitado",
      en: "September 22, 2026 · Mexico City · 9:00–19:00 · Limited seats",
    },
    cta: { es: "Reserva tu lugar", en: "Reserve your seat" },
  },
};

// ────────────────────────────────────────────────────────────────────────────
// SOUL DISCOVERY — workshop intensivo · 20 noviembre 2026
// ────────────────────────────────────────────────────────────────────────────

const soulDiscovery: Experience = {
  slug: "soul-discovery",
  productSlug: "soul-discovery",
  ctaMode: "checkout",
  startDateIso: "2026-11-20",
  elementKey: "tierra",
  brand: {
    es: "An Elements Method Executive Experience",
    en: "An Elements Method Executive Experience",
  },
  title: "SOUL DISCOVERY",
  tagline: {
    es: "Descubre quién eres. Define lo que representas.",
    en: "Discover who you are. Define what you stand for.",
  },
  lead: {
    es: "Workshop intensivo. Un día para descubrir los patrones, talentos, valores y experiencias que forman tu identidad y convertirlos en un primer mapa estratégico de marca personal.",
    en: "An intensive workshop. One day to uncover the patterns, talents, values and experiences that shape your identity — and turn them into a first strategic map of your personal brand.",
  },
  dateLabel: {
    es: "20 de noviembre de 2026",
    en: "November 20, 2026",
  },
  duration: { es: "Un día intensivo", en: "One intensive day" },
  location: {
    es: "Ciudad de México · dirección exacta 7 días antes",
    en: "Mexico City · exact address 7 days before",
  },
  modality: { es: "Presencial · 20 lugares", en: "In person · 20 seats" },
  seats: 20,
  priceMxn: 7500,
  earlyPriceMxn: 5900,
  earlyDeadlineIso: "2026-10-11",
  earlyLabel: {
    es: "Early Access $5,900 MXN hasta el 11 de octubre",
    en: "Early Access MX$5,900 through October 11",
  },
  includes: {
    es: "Alimentos, materiales y actividades",
    en: "Meals, materials and activities",
  },
  heroCta: { es: "Reserva tu lugar", en: "Reserve your seat" },
  intro: {
    headline: {
      es: "¿Qué vas a comunicar cuando todavía no tienes claro quién eres, qué te diferencia y qué quieres representar?",
      en: "What will you communicate when you're still not clear on who you are, what sets you apart and what you want to stand for?",
    },
    paragraphs: [
      {
        es: "Tal vez tienes muchas cosas que quieres hacer, pero no sabes cómo conectarlas. Tal vez sabes que tienes algo que aportar, pero todavía no logras ponerlo en palabras. Tu imagen profesional ya no te representa. Tu contenido no se siente como tú. O haces muchas cosas, pero no sabes desde qué lugar posicionarte.",
        en: "Maybe you have many things you want to do but don't know how to connect them. Maybe you know you have something to contribute but haven't yet put it into words. Your professional image no longer represents you. Your content doesn't feel like you. Or you do many things but don't know where to position yourself from.",
      },
      {
        es: "El problema no siempre es falta de talento. Muchas veces es falta de claridad. Porque no puedes resolver únicamente desde afuera algo que primero necesita claridad interna.",
        en: "The problem is not always a lack of talent. It is often a lack of clarity. Because you can't solve only from the outside something that first needs inner clarity.",
      },
    ],
  },
  about: {
    headline: { es: "¿Qué es SOUL Discovery?", en: "What is SOUL Discovery?" },
    paragraphs: [
      {
        es: "SOUL Discovery es una experiencia presencial de autoconocimiento aplicado al personal branding. Durante un día explorarás tu historia, talentos, patrones, fortalezas, valores, motivaciones, percepción externa, contradicciones, propósito, energía, símbolos y aspiraciones.",
        en: "SOUL Discovery is an in-person experience of self-knowledge applied to personal branding. Over one day you will explore your history, talents, patterns, strengths, values, motivations, external perception, contradictions, purpose, energy, symbols and aspirations.",
      },
      {
        es: "Después organizarás esos descubrimientos para comenzar a construir hipótesis de esencia, territorio conceptual, arquetipo, mood, diferenciación y posicionamiento personal.",
        en: "You will then organize those discoveries to start building hypotheses of essence, conceptual territory, archetype, mood, differentiation and personal positioning.",
      },
      {
        es: "No es un curso de Instagram. No es un taller de contenido. No es una capacitación de ventas. Es el trabajo que debe suceder antes.",
        en: "It is not an Instagram course. It is not a content workshop. It is not sales training. It is the work that must happen before all of that.",
      },
    ],
  },
  architecture: {
    eyebrow: {
      es: "Primero identidad. Después estrategia. Finalmente comunicación.",
      en: "Identity first. Then strategy. Finally communication.",
    },
    headline: {
      es: "Tu identidad no es una etiqueta. Es un sistema de señales.",
      en: "Your identity is not a label. It is a system of signals.",
    },
    paragraphs: [
      {
        es: "Una marca personal sólida no comienza con una paleta de color, una fotografía o un calendario de publicaciones. Comienza al reconocer la persona, la historia y la evidencia que sostendrán cada decisión posterior.",
        en: "A solid personal brand doesn't start with a color palette, a photograph or a posting calendar. It starts by recognizing the person, the story and the evidence that will support every later decision.",
      },
      {
        es: "SOUL PRINT es el mapa que sintetiza los descubrimientos del día. No pretende encerrar quién eres; organiza evidencia para que puedas reconocer patrones, conexiones y posibilidades de posicionamiento. Origen · Capacidad · Núcleo · Espejo · Tensión · Expresión · Proyección.",
        en: "SOUL PRINT is the map that synthesizes the day's discoveries. It doesn't try to box in who you are; it organizes evidence so you can recognize patterns, connections and positioning possibilities. Origin · Capacity · Core · Mirror · Tension · Expression · Projection.",
      },
    ],
    note: {
      es: "Your identity, made visible.",
      en: "Your identity, made visible.",
    },
  },
  phases: [
    {
      key: "recolecta",
      name: { es: "Recolecta", en: "Collect" },
      tagline: { es: "Observa la evidencia.", en: "Observe the evidence." },
      body: {
        es: "Recupera historias, decisiones, momentos y experiencias que han construido quién eres.",
        en: "Recover the stories, decisions, moments and experiences that have built who you are.",
      },
    },
    {
      key: "reconoce",
      name: { es: "Reconoce", en: "Recognize" },
      tagline: {
        es: "Identifica lo que se repite.",
        en: "Identify what repeats.",
      },
      body: {
        es: "Encuentra patrones, talentos, fortalezas, motivaciones y señales presentes en distintos momentos de tu vida.",
        en: "Find patterns, talents, strengths, motivations and signals present across different moments of your life.",
      },
    },
    {
      key: "contrasta",
      name: { es: "Contrasta", en: "Contrast" },
      tagline: {
        es: "Mira desde dentro y desde fuera.",
        en: "Look from the inside and from the outside.",
      },
      body: {
        es: "Integra autopercepción, feedback y contradicciones para ampliar la imagen que tienes de ti.",
        en: "Integrate self-perception, feedback and contradictions to widen the image you hold of yourself.",
      },
    },
    {
      key: "sintetiza",
      name: { es: "Sintetiza", en: "Synthesize" },
      tagline: { es: "Organiza tu SOUL PRINT.", en: "Organize your SOUL PRINT." },
      body: {
        es: "Conecta la evidencia en una primera definición de esencia, territorio, símbolos y arquetipo.",
        en: "Connect the evidence into a first definition of essence, territory, symbols and archetype.",
      },
    },
    {
      key: "proyecta",
      name: { es: "Proyecta", en: "Project" },
      tagline: {
        es: "Convierte claridad en dirección.",
        en: "Turn clarity into direction.",
      },
      body: {
        es: "Formula hipótesis de diferenciación, posicionamiento y próximos pasos para tu marca personal.",
        en: "Formulate hypotheses of differentiation, positioning and next steps for your personal brand.",
      },
    },
  ],
  outcomes: {
    headline: {
      es: "De confusión personal a claridad estratégica",
      en: "From personal confusion to strategic clarity",
    },
    items: [
      {
        es: "Una lectura más profunda de tu historia y sus patrones.",
        en: "A deeper reading of your history and its patterns.",
      },
      {
        es: "Claridad sobre talentos, fortalezas y motivaciones recurrentes.",
        en: "Clarity about recurring talents, strengths and motivations.",
      },
      {
        es: "Una mirada contrastada entre cómo te ves y cómo te perciben.",
        en: "A contrasted view of how you see yourself and how others perceive you.",
      },
      {
        es: "Lenguaje inicial para expresar qué te diferencia.",
        en: "Initial language to express what sets you apart.",
      },
      {
        es: "Tu SOUL PRINT: mapa visual de identidad.",
        en: "Your SOUL PRINT: a visual identity map.",
      },
      {
        es: "Hipótesis de esencia, territorio conceptual y arquetipo.",
        en: "Hypotheses of essence, conceptual territory and archetype.",
      },
      {
        es: "Mood y símbolos con potencial expresivo.",
        en: "Mood and symbols with expressive potential.",
      },
      {
        es: "Una primera dirección de posicionamiento personal.",
        en: "A first direction for personal positioning.",
      },
      {
        es: "Próximos pasos para desarrollar estrategia y comunicación.",
        en: "Next steps to develop strategy and communication.",
      },
    ],
    note: {
      es: "No necesitas inventarte para construir una marca personal. Necesitas aprender a reconocer lo que ya existe en ti.",
      en: "You don't need to invent yourself to build a personal brand. You need to learn to recognize what already exists in you.",
    },
  },
  format: {
    headline: {
      es: "Para personas con algo que expresar — y una identidad que todavía necesita orden",
      en: "For people with something to express — and an identity that still needs order",
    },
    items: [
      {
        es: "Emprendedores cuya identidad está vinculada a su proyecto o empresa.",
        en: "Entrepreneurs whose identity is tied to their project or company.",
      },
      {
        es: "Consultores, coaches, médicos, abogados, arquitectos, terapeutas y especialistas.",
        en: "Consultants, coaches, physicians, lawyers, architects, therapists and specialists.",
      },
      {
        es: "Artistas, músicos, actores, performers y talentos.",
        en: "Artists, musicians, actors, performers and talent.",
      },
      {
        es: "Publicistas, diseñadores, fotógrafos, escritores, productores y creativos multidisciplinarios.",
        en: "Advertising professionals, designers, photographers, writers, producers and multidisciplinary creatives.",
      },
      {
        es: "Creadores que ya comunican, pero no han encontrado una dirección conceptual.",
        en: "Creators who already communicate but haven't found a conceptual direction.",
      },
      {
        es: "Profesionales entre etapas, reinventando su rol, reputación o proyecto propio.",
        en: "Professionals between chapters, reinventing their role, reputation or own project.",
      },
    ],
  },
  extras: [
    {
      headline: {
        es: "Claridad requiere energía, pausa y cuidado",
        en: "Clarity requires energy, pause and care",
      },
      paragraphs: [
        {
          es: "SOUL Discovery está pensado como una jornada intensiva con alimentación healthy & natural que acompaña el ritmo del trabajo: fresca, suficiente, flexible y visualmente coherente con la experiencia.",
          en: "SOUL Discovery is designed as an intensive day with healthy & natural food that accompanies the rhythm of the work: fresh, plentiful, flexible and visually coherent with the experience.",
        },
      ],
      items: [
        {
          es: "Coffee break de bienvenida con fruta, yogurt/granola, pan artesanal y bebidas.",
          en: "Welcome coffee break with fruit, yogurt/granola, artisanal bread and drinks.",
        },
        {
          es: "Buffet con barra fresca, quinoa, arroz integral o salvaje y vegetales rostizados.",
          en: "Buffet with a fresh bar, quinoa, brown or wild rice and roasted vegetables.",
        },
        {
          es: "Proteínas: pollo al limón y romero + falafel horneado.",
          en: "Proteins: lemon-rosemary chicken + baked falafel.",
        },
        {
          es: "Tostaditas de maíz azul, guacamole, hummus y salsas.",
          en: "Blue-corn tostaditas, guacamole, hummus and salsas.",
        },
        {
          es: "Postres naturales: fruta, yogurt con granola y energy bites.",
          en: "Natural desserts: fruit, yogurt with granola and energy bites.",
        },
        {
          es: "Hidratación continua: agua natural e infusionada, té frío, café e infusiones.",
          en: "Continuous hydration: still and infused water, iced tea, coffee and herbal teas.",
        },
        {
          es: "Alternativas veganas y vegetarianas; ingredientes y alérgenos señalizados.",
          en: "Vegan and vegetarian alternatives; ingredients and allergens labeled.",
        },
      ],
    },
  ],
  venue: {
    pending: true,
    headline: {
      es: "El lugar también es parte del proceso",
      en: "The place is also part of the process",
    },
    paragraphs: [
      {
        es: "El venue y las indicaciones de llegada se confirmarán próximamente.",
        en: "The venue and arrival details will be confirmed soon.",
      },
    ],
  },
  facilitators: [
    {
      name: "Andrés Flores",
      role: {
        es: "Estratega creativo y creador de SOUL Discovery",
        en: "Creative strategist and creator of SOUL Discovery",
      },
      image: "/images/founders/andres-flores.jpg",
      paragraphs: [
        {
          es: "Andrés Flores es publicista y estratega creativo con experiencia desarrollando proyectos y campañas en México, Estados Unidos, España y Japón para marcas como Corona, Victoria, Pacífico, Samsung y Huawei.",
          en: "Andrés Flores is an advertising professional and creative strategist with experience developing projects and campaigns in Mexico, the United States, Spain and Japan for brands such as Corona, Victoria, Pacífico, Samsung and Huawei.",
        },
        {
          es: "Su trabajo conecta estrategia, identidad, comportamiento humano y diseño de experiencias. En SOUL Discovery facilita el proceso para transformar historias, patrones, talentos y percepción en una primera dirección estratégica de marca personal.",
          en: "His work connects strategy, identity, human behavior and experience design. In SOUL Discovery he facilitates the process of turning stories, patterns, talents and perception into a first strategic direction for a personal brand.",
        },
        {
          es: "No entrega una personalidad prefabricada. Diseña preguntas, ejercicios y sistemas de síntesis para que cada participante reconozca su propia evidencia y pueda convertirla en una posición más clara.",
          en: "He doesn't hand over a prefabricated personality. He designs questions, exercises and synthesis systems so each participant recognizes their own evidence and can turn it into a clearer position.",
        },
      ],
    },
    {
      name: "Ana Michelle",
      role: {
        es: "Facilitadora de Elements Method Executive Experiences",
        en: "Facilitator, Elements Method Executive Experiences",
      },
      image: "/images/founders/ana-michelle.jpg",
      paragraphs: [
        {
          es: "Ana Michelle es coach de resultados y bienestar. Tras más de dos décadas liderando equipos a nivel directivo en organizaciones globales, dejó el mundo corporativo para acompañar a líderes de alto rendimiento en procesos de desarrollo humano y liderazgo desde una perspectiva que integra autoconocimiento, consciencia, herramientas de coaching y trabajo experiencial.",
          en: "Ana Michelle is a results and wellbeing coach. After more than two decades leading executive-level teams in global organizations, she left the corporate world to accompany high-performance leaders through human development and leadership processes from a perspective that integrates self-knowledge, awareness, coaching tools and experiential work.",
        },
        {
          es: "Su papel no es decirte cómo debes liderar. Es crear las preguntas, herramientas y condiciones necesarias para que puedas observarte con mayor profundidad y encontrar tus propias respuestas.",
          en: "Her role is not to tell you how to lead. It is to create the questions, tools and conditions you need to observe yourself more deeply and find your own answers.",
        },
      ],
    },
  ],
  duo: {
    headline: {
      es: "Two perspectives. One experience.",
      en: "Two perspectives. One experience.",
    },
    items: [
      {
        es: "Andrés Flores conduce la dirección estratégica.",
        en: "Andrés Flores leads the strategic direction.",
      },
      {
        es: "Ana Michelle acompaña el proceso interior.",
        en: "Ana Michelle accompanies the inner process.",
      },
    ],
    paragraphs: [
      {
        es: "Dos perspectivas complementarias —diseño estratégico de experiencias y desarrollo humano— integradas bajo Elements Method para crear una experiencia donde contenido, entorno y cada momento formen parte de una misma narrativa.",
        en: "Two complementary perspectives —strategic experience design and human development— integrated under Elements Method to create an experience where content, environment and every moment are part of one single narrative.",
      },
    ],
  },
  facts: [
    {
      label: { es: "Fecha", en: "Date" },
      value: { es: "20 de noviembre de 2026", en: "November 20, 2026" },
    },
    {
      label: { es: "Duración", en: "Duration" },
      value: { es: "1 día intensivo", en: "1 intensive day" },
    },
    {
      label: { es: "Lugar", en: "Venue" },
      value: { es: "Por confirmar", en: "To be confirmed" },
    },
    {
      label: { es: "Modalidad", en: "Format" },
      value: {
        es: "Presencial · Grupo reducido",
        en: "In person · Small group",
      },
    },
    {
      label: { es: "Inversión", en: "Investment" },
      value: {
        es: "$7,500 MXN · Early Access $5,900 hasta el 11 de octubre",
        en: "MX$7,500 · Early Access MX$5,900 through October 11",
      },
    },
    {
      label: { es: "Incluye", en: "Includes" },
      value: {
        es: "Alimentos, materiales y actividades",
        en: "Meals, materials and activities",
      },
    },
  ],
  faqs: [
    {
      q: {
        es: "¿Necesito tener una marca personal activa?",
        en: "Do I need an active personal brand?",
      },
      a: {
        es: "No. Puedes estar comenzando, reposicionándote o comunicando ya sin una dirección clara.",
        en: "No. You may be starting out, repositioning, or already communicating without a clear direction.",
      },
    },
    {
      q: {
        es: "¿Aprenderé a usar Instagram o crear contenido?",
        en: "Will I learn to use Instagram or create content?",
      },
      a: {
        es: "No es el objetivo central. SOUL Discovery trabaja la identidad y la dirección estratégica que deberían existir antes de definir contenido y canales.",
        en: "That is not the central goal. SOUL Discovery works on the identity and strategic direction that should exist before defining content and channels.",
      },
    },
    {
      q: {
        es: "¿Saldré con mi marca personal terminada?",
        en: "Will I leave with my personal brand finished?",
      },
      a: {
        es: "No. Saldrás con un mapa inicial de identidad, hipótesis estratégicas y próximos pasos para seguir construyéndola.",
        en: "No. You will leave with an initial identity map, strategic hypotheses and next steps to keep building it.",
      },
    },
    {
      q: { es: "¿Qué es el SOUL PRINT?", en: "What is the SOUL PRINT?" },
      a: {
        es: "Una síntesis visual y estratégica de historias, talentos, valores, percepción, propósito, símbolos y posibilidades de posicionamiento.",
        en: "A visual, strategic synthesis of stories, talents, values, perception, purpose, symbols and positioning possibilities.",
      },
    },
    {
      q: {
        es: "¿Qué incluye la alimentación?",
        en: "What does the food include?",
      },
      a: {
        es: "Coffee breaks, buffet healthy & natural, postres y bebidas, con alternativas vegetarianas y veganas.",
        en: "Coffee breaks, a healthy & natural buffet, desserts and drinks, with vegetarian and vegan alternatives.",
      },
    },
    {
      q: {
        es: "¿Dónde será y cuál es la inversión?",
        en: "Where will it be and what is the investment?",
      },
      a: {
        es: "La sede está por confirmar. La inversión es de $7,500 MXN, con Early Access de $5,900 MXN hasta el 11 de octubre.",
        en: "The venue is to be confirmed. The investment is MX$7,500, with Early Access at MX$5,900 through October 11.",
      },
    },
  ],
  closing: {
    headline: {
      es: "No construimos personajes. Revelamos identidades.",
      en: "We don't build characters. We reveal identities.",
    },
    paragraphs: [
      {
        es: "Un día para bajar el volumen del ruido, reconocer tu señal y convertir lo que ya existe en ti en una primera dirección estratégica de marca personal. Descubre quién eres. Define lo que representas.",
        en: "One day to turn down the noise, recognize your signal and turn what already exists in you into a first strategic direction for your personal brand. Discover who you are. Define what you stand for.",
      },
    ],
    metaLine: {
      es: "20 de noviembre de 2026 · Presencial · Grupo reducido · Early Access $5,900 hasta el 11 de octubre",
      en: "November 20, 2026 · In person · Small group · Early Access MX$5,900 through October 11",
    },
    cta: { es: "Reserva tu lugar", en: "Reserve your seat" },
  },
};

export const experiences: Experience[] = [equinox, elementsAwakening, soulDiscovery];

export const findExperienceBySlug = (slug: string): Experience | undefined =>
  experiences.find((e) => e.slug === slug);

/** Early-access window still open? Deadline date is inclusive, CDMX time (UTC-6). */
export function isEarlyAccessActive(e: Experience, now: Date = new Date()): boolean {
  if (e.earlyPriceMxn == null || !e.earlyDeadlineIso) return false;
  return now.getTime() <= new Date(`${e.earlyDeadlineIso}T23:59:59-06:00`).getTime();
}

/**
 * The nearest upcoming experience (start date not yet past, CDMX end-of-day).
 * Drives the header CTA and in-page promos. Undefined once all dates passed.
 */
export function getNextExperience(now: Date = new Date()): Experience | undefined {
  return experiences
    .filter(
      (e) =>
        now.getTime() <= new Date(`${e.startDateIso}T23:59:59-06:00`).getTime(),
    )
    .sort((a, b) => a.startDateIso.localeCompare(b.startDateIso))[0];
}
