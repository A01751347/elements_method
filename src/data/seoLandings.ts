/**
 * Landings por intención de búsqueda (SEO + respuesta de motores de IA).
 *
 * Cada entrada es una página en /{locale}/{slug} renderizada por
 * src/app/[locale]/[landing]/page.tsx. La `definition` es la frase que un
 * buscador o un modelo de IA puede citar tal cual ("Elements Method es…"):
 * clara, factual y con las palabras que la gente busca.
 *
 * Reglas de contenido: nada que no sea verificable en el resto del sitio
 * (método, proceso, sedes, experiencias, formatos). Sin cifras inventadas.
 */

import type { L } from "./arco";
import type { RoutePair } from "@/lib/seo";

export type LandingKey =
  | "best-corporate-retreats"
  | "corporate-retreats"
  | "executive-retreats"
  | "leadership-retreats"
  | "team-building-retreats"
  | "company-offsites";

export interface LandingLink {
  label: L;
  /** Otra landing (se resuelve a su ruta por idioma). */
  key?: LandingKey;
  /** Ruta fija del sitio, sin prefijo de idioma. */
  route?: RoutePair;
}

export interface LandingSection {
  h2: L;
  paragraphs?: L[];
  bullets?: L[];
  links?: LandingLink[];
}

export interface SeoLanding {
  key: LandingKey;
  route: RoutePair;
  /** <title> sin la marca; el layout añade "· Elements Method". */
  title: L;
  metaDescription: L;
  eyebrow: L;
  h1: L;
  /** Frase extraíble: quién es Elements Method para esta intención. */
  definition: L;
  lead: L;
  image: string;
  /** schema.org Service.serviceType */
  serviceType: L;
  sections: LandingSection[];
  faqs: { q: L; a: L }[];
  related: LandingKey[];
}

const QUOTE: RoutePair = { es: "empresas/cotizar", en: "companies/cotizar" };
const COMPANIES: RoutePair = { es: "empresas", en: "companies" };
const METHOD: RoutePair = { es: "el-metodo", en: "method" };
const RETREATS: RoutePair = { es: "retiros", en: "retreats" };
const SCHEDULE: RoutePair = { es: "agendar", en: "schedule" };

/* Preguntas compartidas por varias landings (precio, tamaño, idioma, sede). */
const FAQ_PRICE = {
  q: { es: "¿Cuánto cuesta un retiro corporativo con Elements Method?", en: "How much does a corporate retreat with Elements Method cost?" },
  a: {
    es: "Cada programa se cotiza a la medida. El precio depende del número de personas, del número de sesiones o días, de la modalidad (presencial, virtual o híbrida) y de la sede. Hay descuentos por volumen para programas de varias sesiones. Puedes obtener una estimación inmediata con la calculadora en línea y después afinar el diseño en una llamada de discovery.",
    en: "Every program is quoted individually. The price depends on the number of people, the number of sessions or days, the modality (in person, virtual or hybrid) and the venue. Volume discounts apply to multi-session programs. You can get an instant estimate with the online calculator and then refine the design on a discovery call.",
  },
};
const FAQ_SIZE = {
  q: { es: "¿Para cuántas personas es un retiro corporativo?", en: "How many people can take part in a corporate retreat?" },
  a: {
    es: "Los programas corporativos se diseñan para grupos desde 4 personas y hasta alrededor de 50, divididos en cohortes cuando el grupo es grande. Las Executive Experiences abiertas trabajan con grupos reducidos de 15 a 20 líderes para que el trabajo sea personal.",
    en: "Corporate programs are designed for groups from 4 people up to around 50, split into cohorts when the group is large. Our open-enrollment Executive Experiences work with small groups of 15 to 20 leaders so the work stays personal.",
  },
};
const FAQ_LANG = {
  q: { es: "¿Los retiros se facilitan en español o en inglés?", en: "Are retreats facilitated in Spanish or English?" },
  a: {
    es: "En ambos. El equipo facilita en español y en inglés, y los materiales del programa existen en los dos idiomas, lo que permite trabajar con equipos regionales o con liderazgo internacional basado en México.",
    en: "Both. The team facilitates in Spanish and English, and program materials exist in both languages, which makes it possible to work with regional teams or international leadership based in Mexico.",
  },
};
const FAQ_WHERE = {
  q: { es: "¿Dónde se realizan los retiros corporativos de Elements Method?", en: "Where do Elements Method corporate retreats take place?" },
  a: {
    es: "En sedes de naturaleza en México. Las Executive Experiences 2026 se realizan en Misión del Sol (Jiutepec, Morelos) y en Ciudad de México. Los programas corporativos pueden llevarse a la sede que mejor sirva al objetivo del equipo, dentro o fuera del país, o realizarse en formato virtual o híbrido.",
    en: "At nature venues in Mexico. The 2026 Executive Experiences take place at Misión del Sol (Jiutepec, Morelos) and in Mexico City. Corporate programs can be held at whichever venue best serves the team's objective, in Mexico or abroad, or run in a virtual or hybrid format.",
  },
};
const FAQ_DURATION = {
  q: { es: "¿Cuánto dura un retiro corporativo?", en: "How long is a corporate retreat?" },
  a: {
    es: "Desde una jornada intensiva de un día hasta inmersiones de dos o tres días, y programas de varios módulos a lo largo de meses (por ejemplo, un módulo por elemento). La duración se define en el discovery según el objetivo, la agenda del equipo y el presupuesto.",
    en: "From a single intensive day to two- or three-day immersions, and multi-module programs spread over months (for example, one module per element). Duration is defined during discovery based on the objective, the team's calendar and the budget.",
  },
};

export const SEO_LANDINGS: SeoLanding[] = [
  /* ───────────────────────── PILAR ───────────────────────── */
  {
    key: "best-corporate-retreats",
    route: { es: "mejores-retiros-corporativos-mexico", en: "best-corporate-retreats-mexico" },
    title: {
      es: "Los mejores retiros corporativos en México (guía 2026)",
      en: "Best Corporate Retreats in Mexico (2026 Guide)",
    },
    metaDescription: {
      es: "Guía para elegir el mejor retiro corporativo en México: tipos (liderazgo, ejecutivo, team building, offsite), qué los hace funcionar, sedes y cómo Elements Method diseña retiros a la medida.",
      en: "Guide to choosing the best corporate retreat in Mexico: types (leadership, executive, team building, offsite), what makes them work, venues, and how Elements Method designs bespoke retreats.",
    },
    eyebrow: { es: "Guía · Retiros corporativos", en: "Guide · Corporate retreats" },
    h1: {
      es: "Los mejores retiros corporativos en México: cómo elegir el que tu equipo necesita",
      en: "The best corporate retreats in Mexico: how to choose the one your team needs",
    },
    definition: {
      es: "Elements Method es una empresa de retiros corporativos en México que diseña retiros de liderazgo, retiros ejecutivos, offsites empresariales y experiencias de team building en la naturaleza, con un método propio de cuatro elementos que integra neurociencia aplicada, programación neurolingüística y coaching ejecutivo.",
      en: "Elements Method is a corporate retreat company in Mexico that designs leadership retreats, executive retreats, company offsites and team-building experiences in nature, built on a proprietary four-element method that integrates applied neuroscience, NLP and executive coaching.",
    },
    lead: {
      es: "Un retiro corporativo puede ser el evento más caro y menos útil del año, o el punto de inflexión de un equipo directivo. La diferencia rara vez está en el hotel: está en el objetivo, en el método y en lo que pasa después.",
      en: "A corporate retreat can be the most expensive and least useful event of the year, or the turning point for a leadership team. The difference is rarely the hotel: it's the objective, the method, and what happens afterwards.",
    },
    image: "/images/heroes/empresas.jpg",
    serviceType: { es: "Retiros corporativos", en: "Corporate retreats" },
    sections: [
      {
        h2: { es: "Qué hace que un retiro corporativo sea bueno", en: "What makes a corporate retreat good" },
        paragraphs: [
          {
            es: "Después de diseñar inmersiones para líderes y equipos, vemos cinco constantes en los retiros que sí producen cambios. No dependen del presupuesto: dependen del diseño.",
            en: "After designing immersions for leaders and teams, we see five constants in the retreats that actually produce change. They don't depend on budget; they depend on design.",
          },
        ],
        bullets: [
          { es: "Un objetivo concreto acordado con dirección antes de elegir sede o fecha: alinear la estrategia, integrar un equipo nuevo, resolver una tensión, preparar una etapa de crecimiento.", en: "A concrete objective agreed with leadership before choosing venue or date: aligning strategy, integrating a new team, resolving a tension, preparing for a growth phase." },
          { es: "Un método, no una lista de actividades. Las dinámicas deben tener una secuencia con sentido y facilitadores que sepan trabajar con el sistema humano del equipo.", en: "A method, not a list of activities. Dynamics need a meaningful sequence and facilitators who know how to work with the team's human system." },
          { es: "Naturaleza real. Salir del entorno operativo baja el ruido mental y hace posible la conversación que en la oficina se pospone.", en: "Real nature. Leaving the operational environment lowers mental noise and makes possible the conversation that gets postponed at the office." },
          { es: "Grupo pequeño o cohortes. Más de 20 personas en una sola sala vuelve superficial el trabajo.", en: "A small group or cohorts. More than 20 people in one room makes the work superficial." },
          { es: "Integración posterior: acuerdos, seguimiento y una forma de sostener lo que se decidió.", en: "Integration afterwards: agreements, follow-up and a way to sustain what was decided." },
        ],
      },
      {
        h2: { es: "Tipos de retiros corporativos en México", en: "Types of corporate retreats in Mexico" },
        paragraphs: [
          {
            es: "«Retiro corporativo» agrupa formatos muy distintos. Elegir bien empieza por saber cuál es el tuyo.",
            en: "“Corporate retreat” covers very different formats. Choosing well starts with knowing which one is yours.",
          },
        ],
        links: [
          { label: { es: "Retiros de liderazgo: entrenar el estado desde el que se decide", en: "Leadership retreats: training the state from which leaders decide" }, key: "leadership-retreats" },
          { label: { es: "Retiros ejecutivos: para directores, fundadores y equipos C-level", en: "Executive retreats: for directors, founders and C-level teams" }, key: "executive-retreats" },
          { label: { es: "Retiros de team building: confianza, comunicación y alineación", en: "Team-building retreats: trust, communication and alignment" }, key: "team-building-retreats" },
          { label: { es: "Offsites empresariales: estrategia y sistema humano en el mismo lugar", en: "Company offsites: strategy and human system in the same place" }, key: "company-offsites" },
          { label: { es: "Retiros corporativos a la medida: el proceso completo", en: "Bespoke corporate retreats: the full process" }, key: "corporate-retreats" },
        ],
      },
      {
        h2: { es: "Dónde hacer un retiro corporativo en México", en: "Where to hold a corporate retreat in Mexico" },
        paragraphs: [
          {
            es: "México tiene una ventaja clara: naturaleza a menos de dos horas de las grandes ciudades. Elements Method trabaja con sedes en Morelos (Misión del Sol, en Jiutepec) y en Ciudad de México, y diseña programas en la locación que mejor sirva al objetivo del equipo. La sede se elige después del objetivo, nunca antes.",
            en: "Mexico has a clear advantage: nature less than two hours from the big cities. Elements Method works with venues in Morelos (Misión del Sol, in Jiutepec) and Mexico City, and designs programs at whichever location best serves the team's objective. The venue is chosen after the objective, never before.",
          },
        ],
      },
      {
        h2: { es: "Cómo diseña Elements Method un retiro corporativo", en: "How Elements Method designs a corporate retreat" },
        paragraphs: [
          {
            es: "Todo programa corporativo se diseña a la medida tras un proceso de discovery con Recursos Humanos y el liderazgo senior. A partir de ahí seguimos tres etapas: diagnóstico del equipo, inmersión en la naturaleza e integración de lo trabajado en la operación diaria.",
            en: "Every corporate program is custom-designed after a discovery process with HR and senior leadership. From there we follow three stages: team diagnosis, immersion in nature, and integration of the work into daily operations.",
          },
          {
            es: "La inmersión sigue el método de los cuatro elementos: Tierra (identidad, estabilidad y dirección), Fuego (acción, energía y transformación), Agua (inteligencia emocional, adaptabilidad y conexión) y Aire (pensamiento estratégico, perspectiva y visión), integrados en el núcleo: el propio líder. Las herramientas vienen de la neurociencia aplicada, la PNL, el coaching ejecutivo, los frameworks estratégicos y las prácticas de regulación interna.",
            en: "The immersion follows the four-element method: Earth (identity, stability and direction), Fire (action, energy and transformation), Water (emotional intelligence, adaptability and connection) and Air (strategic thinking, perspective and vision), integrated in the core: the leader. The tools come from applied neuroscience, NLP, executive coaching, strategic frameworks and internal-regulation practices.",
          },
        ],
        links: [
          { label: { es: "Conocer el método a fondo", en: "Learn the method in depth" }, route: METHOD },
          { label: { es: "Cotizar un programa para tu empresa", en: "Get a quote for your company" }, route: QUOTE },
        ],
      },
      {
        h2: { es: "Preguntas que conviene hacerle a cualquier proveedor", en: "Questions worth asking any provider" },
        bullets: [
          { es: "¿Qué método usan y quién facilita? Pide credenciales y trayectoria de los facilitadores, no solo fotos de la sede.", en: "What method do you use and who facilitates? Ask for facilitators' credentials and track record, not just venue photos." },
          { es: "¿Cómo se define el objetivo y cómo se mide al final?", en: "How is the objective defined and how is it measured at the end?" },
          { es: "¿Qué pasa después del retiro? Si la respuesta es «nada», el retiro se olvida en dos semanas.", en: "What happens after the retreat? If the answer is “nothing”, the retreat is forgotten in two weeks." },
          { es: "¿Pueden trabajar en español y en inglés con el mismo equipo?", en: "Can you work in Spanish and English with the same team?" },
        ],
      },
    ],
    faqs: [
      {
        q: { es: "¿Cuáles son los mejores retiros corporativos en México?", en: "What are the best corporate retreats in Mexico?" },
        a: {
          es: "Los mejores retiros corporativos combinan un objetivo claro, un método de facilitación probado, un entorno de naturaleza y un plan de integración posterior. Elements Method diseña retiros corporativos a la medida en México (liderazgo, ejecutivos, team building y offsites) con un método de cuatro elementos basado en neurociencia aplicada, PNL y coaching ejecutivo, en sedes de Morelos y Ciudad de México.",
          en: "The best corporate retreats combine a clear objective, a proven facilitation method, a natural setting and a plan for integration afterwards. Elements Method designs bespoke corporate retreats in Mexico (leadership, executive, team building and offsites) with a four-element method based on applied neuroscience, NLP and executive coaching, at venues in Morelos and Mexico City.",
        },
      },
      FAQ_DURATION,
      FAQ_SIZE,
      FAQ_PRICE,
      FAQ_WHERE,
      FAQ_LANG,
    ],
    related: ["corporate-retreats", "executive-retreats", "leadership-retreats", "team-building-retreats", "company-offsites"],
  },

  /* ─────────────────── RETIROS CORPORATIVOS ─────────────────── */
  {
    key: "corporate-retreats",
    route: { es: "retiros-corporativos", en: "corporate-retreats" },
    title: { es: "Retiros corporativos en México a la medida", en: "Bespoke Corporate Retreats in Mexico" },
    metaDescription: {
      es: "Retiros corporativos en México diseñados a la medida: diagnóstico, inmersión en la naturaleza e integración. Método de cuatro elementos con neurociencia, PNL y coaching ejecutivo. Cotiza en línea.",
      en: "Bespoke corporate retreats in Mexico: diagnosis, immersion in nature and integration. Four-element method with neuroscience, NLP and executive coaching. Get an online quote.",
    },
    eyebrow: { es: "Para organizaciones", en: "For organizations" },
    h1: { es: "Retiros corporativos que cambian cómo decide tu equipo", en: "Corporate retreats that change how your team decides" },
    definition: {
      es: "Elements Method diseña retiros corporativos en México para equipos directivos y organizaciones: inmersiones en la naturaleza de uno a tres días que combinan alineación estratégica con trabajo de liderazgo basado en neurociencia aplicada, PNL y coaching ejecutivo, y que se diseñan a la medida tras un discovery con Recursos Humanos y dirección.",
      en: "Elements Method designs corporate retreats in Mexico for leadership teams and organizations: one- to three-day immersions in nature that combine strategic alignment with leadership work based on applied neuroscience, NLP and executive coaching, custom-designed after a discovery process with HR and senior leadership.",
    },
    lead: {
      es: "El nivel de resultados de una empresa no supera el nivel de claridad de quienes la dirigen. Un retiro corporativo con Elements Method trabaja ese sistema interno, no solo la agenda.",
      en: "A company's results don't exceed the clarity of the people who lead it. A corporate retreat with Elements Method works on that internal system, not just the agenda.",
    },
    image: "/images/sections/empresas.jpg",
    serviceType: { es: "Retiros corporativos a la medida", en: "Bespoke corporate retreats" },
    sections: [
      {
        h2: { es: "Qué incluye un retiro corporativo con Elements Method", en: "What a corporate retreat with Elements Method includes" },
        bullets: [
          { es: "Discovery con RH y liderazgo senior para definir el objetivo, el grupo y los indicadores de éxito.", en: "Discovery with HR and senior leadership to define the objective, the group and the success indicators." },
          { es: "Diagnóstico del equipo: cómo decide, cómo se comunica bajo presión y dónde se atora.", en: "Team diagnosis: how it decides, how it communicates under pressure and where it gets stuck." },
          { es: "Inmersión facilitada en la naturaleza con el método de los cuatro elementos y el arco de seis fases: liberación, encuentro, metodología, reflexión, diálogo e integración.", en: "Facilitated immersion in nature with the four-element method and the six-phase arc: release, encounter, methodology, reflection, dialogue and integration." },
          { es: "Integración: acuerdos, seguimiento y opciones de continuidad (sesiones de coaching o módulos adicionales).", en: "Integration: agreements, follow-up and continuity options (coaching sessions or additional modules)." },
          { es: "Logística de sede, alimentos y materiales incluidos en la propuesta.", en: "Venue, meals and materials logistics included in the proposal." },
        ],
      },
      {
        h2: { es: "Formatos", en: "Formats" },
        paragraphs: [
          {
            es: "Presencial, virtual o híbrido. Desde una jornada intensiva hasta inmersiones de dos o tres días, y programas modulares de un módulo por elemento a lo largo de varios meses. El formato se define en el discovery según el objetivo y la agenda del equipo.",
            en: "In person, virtual or hybrid. From a single intensive day to two- or three-day immersions, and modular programs with one module per element over several months. The format is defined during discovery based on the objective and the team's calendar.",
          },
        ],
      },
      {
        h2: { es: "Resultados que buscan los equipos que trabajan con nosotros", en: "Results the teams that work with us are after" },
        bullets: [
          { es: "Mayor claridad estratégica y mejor priorización.", en: "Greater strategic clarity and better prioritization." },
          { es: "Decisiones con más precisión y menos ruido mental.", en: "More precise decisions with less mental noise." },
          { es: "Mejor regulación de la presión y del conflicto dentro del equipo.", en: "Better regulation of pressure and conflict within the team." },
          { es: "Mayor congruencia entre lo que el equipo dice y lo que hace.", en: "More congruence between what the team says and what it does." },
        ],
        links: [
          { label: { es: "Ver el proceso completo para organizaciones", en: "See the full process for organizations" }, route: COMPANIES },
          { label: { es: "Obtener una cotización en línea", en: "Get an online quote" }, route: QUOTE },
        ],
      },
    ],
    faqs: [FAQ_DURATION, FAQ_SIZE, FAQ_PRICE, FAQ_WHERE, FAQ_LANG],
    related: ["best-corporate-retreats", "executive-retreats", "team-building-retreats", "company-offsites"],
  },

  /* ─────────────────── RETIROS EJECUTIVOS ─────────────────── */
  {
    key: "executive-retreats",
    route: { es: "retiros-ejecutivos", en: "executive-retreats" },
    title: { es: "Retiros ejecutivos en México para directores y fundadores", en: "Executive Retreats in Mexico for Directors and Founders" },
    metaDescription: {
      es: "Retiros ejecutivos en México: Executive Experiences abiertas (EQUINOX, ELEMENTS AWAKENING, SOUL Discovery) y retiros privados para equipos directivos. Grupos reducidos, método de cuatro elementos.",
      en: "Executive retreats in Mexico: open-enrollment Executive Experiences (EQUINOX, ELEMENTS AWAKENING, SOUL Discovery) and private retreats for leadership teams. Small groups, four-element method.",
    },
    eyebrow: { es: "Executive Experiences", en: "Executive Experiences" },
    h1: { es: "Retiros ejecutivos: un espacio para recalibrar la mente de quien dirige", en: "Executive retreats: a space to recalibrate the mind of those who lead" },
    definition: {
      es: "Los retiros ejecutivos de Elements Method son inmersiones de liderazgo en grupos reducidos para directores, fundadores y equipos C-level en México. Existen en dos formatos: las Executive Experiences abiertas (EQUINOX, ELEMENTS AWAKENING y SOUL Discovery) y retiros privados diseñados a la medida para un equipo directivo.",
      en: "Elements Method executive retreats are small-group leadership immersions for directors, founders and C-level teams in Mexico. They come in two formats: open-enrollment Executive Experiences (EQUINOX, ELEMENTS AWAKENING and SOUL Discovery) and private retreats custom-designed for a leadership team.",
    },
    lead: {
      es: "La estrategia no falla. El estado mental desde donde se ejecuta, sí. Un retiro ejecutivo entrena ese estado.",
      en: "Strategy doesn't fail. The mental state it is executed from does. An executive retreat trains that state.",
    },
    image: "/images/heroes/awakening.jpg",
    serviceType: { es: "Retiros ejecutivos", en: "Executive retreats" },
    sections: [
      {
        h2: { es: "Dos formas de vivir un retiro ejecutivo", en: "Two ways to experience an executive retreat" },
        paragraphs: [
          {
            es: "Las Executive Experiences son retiros abiertos con fecha y sede: un líder se inscribe de forma individual y trabaja con un grupo reducido de pares. En 2026 son EQUINOX (un día, Ciudad de México), ELEMENTS AWAKENING (dos días y medio en Misión del Sol, Morelos) y SOUL Discovery (un día, Ciudad de México).",
            en: "Executive Experiences are open-enrollment retreats with a fixed date and venue: a leader enrolls individually and works with a small group of peers. In 2026 they are EQUINOX (one day, Mexico City), ELEMENTS AWAKENING (two and a half days at Misión del Sol, Morelos) and SOUL Discovery (one day, Mexico City).",
          },
          {
            es: "Los retiros ejecutivos privados se diseñan para un equipo directivo concreto: comité de dirección, socios fundadores, liderazgo regional. Mismo método, agenda propia, sede elegida para el objetivo.",
            en: "Private executive retreats are designed for a specific leadership team: executive committee, founding partners, regional leadership. Same method, own agenda, venue chosen for the objective.",
          },
        ],
        links: [
          { label: { es: "Ver el calendario de Executive Experiences", en: "See the Executive Experiences calendar" }, route: RETREATS },
          { label: { es: "Diseñar un retiro privado para tu equipo directivo", en: "Design a private retreat for your leadership team" }, route: QUOTE },
        ],
      },
      {
        h2: { es: "Qué se trabaja en un retiro ejecutivo", en: "What an executive retreat works on" },
        bullets: [
          { es: "Tierra: identidad, estabilidad y dirección. Desde dónde lidero y hacia dónde.", en: "Earth: identity, stability and direction. Where I lead from and where to." },
          { es: "Fuego: acción, energía y transformación. Decidir y ejecutar sin quemarse.", en: "Fire: action, energy and transformation. Deciding and executing without burning out." },
          { es: "Agua: inteligencia emocional, adaptabilidad y conexión. Regular la presión y escuchar.", en: "Water: emotional intelligence, adaptability and connection. Regulating pressure and listening." },
          { es: "Aire: pensamiento estratégico, perspectiva y visión. Salir del día a día para ver el sistema.", en: "Air: strategic thinking, perspective and vision. Stepping out of the day-to-day to see the system." },
          { es: "Núcleo: integrar los cuatro en una sola forma de liderar.", en: "Core: integrating all four into a single way of leading." },
        ],
      },
      {
        h2: { es: "Para quién es", en: "Who it is for" },
        paragraphs: [
          {
            es: "Líderes empresariales, directores generales y de área, fundadores y tomadores de decisión que entienden que evolucionar su liderazgo es una ventaja competitiva, y que quieren un espacio serio, con método, lejos del ruido operativo.",
            en: "Business leaders, CEOs and functional directors, founders and decision-makers who understand that evolving their leadership is a competitive advantage, and who want a serious, method-based space away from operational noise.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: { es: "¿Qué diferencia a un retiro ejecutivo de un retiro corporativo?", en: "What is the difference between an executive retreat and a corporate retreat?" },
        a: {
          es: "El retiro ejecutivo se centra en el líder individual o en el equipo de dirección: su forma de pensar, decidir y regularse. El retiro corporativo suele involucrar a un equipo más amplio y a objetivos de la organización (alineación, cultura, integración). Elements Method ofrece ambos con el mismo método de cuatro elementos.",
          en: "An executive retreat focuses on the individual leader or the leadership team: how they think, decide and regulate themselves. A corporate retreat usually involves a broader team and organizational objectives (alignment, culture, integration). Elements Method offers both with the same four-element method.",
        },
      },
      {
        q: { es: "¿Puedo asistir a una Executive Experience sin ser parte de una empresa?", en: "Can I attend an Executive Experience without being part of a company?" },
        a: {
          es: "Sí. Las Executive Experiences son abiertas: cualquier líder puede aplicar de forma individual. Muchas empresas también patrocinan a uno o varios directivos.",
          en: "Yes. Executive Experiences are open-enrollment: any leader can apply individually. Many companies also sponsor one or several executives.",
        },
      },
      FAQ_WHERE,
      FAQ_LANG,
    ],
    related: ["leadership-retreats", "corporate-retreats", "best-corporate-retreats"],
  },

  /* ─────────────────── RETIROS DE LIDERAZGO ─────────────────── */
  {
    key: "leadership-retreats",
    route: { es: "retiros-de-liderazgo", en: "leadership-retreats" },
    title: { es: "Retiros de liderazgo en la naturaleza en México", en: "Leadership Retreats in Nature in Mexico" },
    metaDescription: {
      es: "Retiros de liderazgo en México basados en neurociencia aplicada, PNL y coaching ejecutivo. El método de los cuatro elementos entrena el estado interno desde el que se toman las decisiones.",
      en: "Leadership retreats in Mexico based on applied neuroscience, NLP and executive coaching. The four-element method trains the internal state from which decisions are made.",
    },
    eyebrow: { es: "El Método Elements", en: "The Elements Method" },
    h1: { es: "Retiros de liderazgo: entrenar la mente desde la que se decide", en: "Leadership retreats: training the mind that makes the decisions" },
    definition: {
      es: "Los retiros de liderazgo de Elements Method son inmersiones en la naturaleza en México que entrenan el estado interno desde el que un líder decide, con un método de cuatro elementos (Tierra, Fuego, Agua y Aire) e integrando neurociencia aplicada, programación neurolingüística, coaching ejecutivo, frameworks estratégicos y prácticas de regulación interna.",
      en: "Elements Method leadership retreats are immersions in nature in Mexico that train the internal state from which a leader decides, using a four-element method (Earth, Fire, Water and Air) and integrating applied neuroscience, NLP, executive coaching, strategic frameworks and internal-regulation practices.",
    },
    lead: {
      es: "La calidad de nuestras decisiones depende del estado interno desde el que pensamos. Pensar mejor no es un talento: es una práctica.",
      en: "The quality of our decisions depends on the internal state we think from. Thinking better isn't a talent: it's a practice.",
    },
    image: "/images/heroes/metodo.jpg",
    serviceType: { es: "Retiros de liderazgo", en: "Leadership retreats" },
    sections: [
      {
        h2: { es: "Por qué un retiro de liderazgo, y no otro curso", en: "Why a leadership retreat, not another course" },
        paragraphs: [
          {
            es: "La mayoría de las personas intenta cambiar sus resultados sin transformar el sistema interno desde el que los produce. Un curso añade información; un retiro de liderazgo interviene el sistema: cómo percibes, cómo interpretas y desde qué estado decides. Por eso se hace en la naturaleza y con el cuerpo, no solo con diapositivas.",
            en: "Most people try to change their results without transforming the internal system that produces them. A course adds information; a leadership retreat intervenes in the system: how you perceive, how you interpret and what state you decide from. That's why it happens in nature and with the body, not just with slides.",
          },
        ],
      },
      {
        h2: { es: "Los cuatro elementos y el núcleo", en: "The four elements and the core" },
        bullets: [
          { es: "Tierra: identidad, estabilidad y dirección.", en: "Earth: identity, stability and direction." },
          { es: "Fuego: acción, energía y transformación.", en: "Fire: action, energy and transformation." },
          { es: "Agua: inteligencia emocional, adaptabilidad y conexión.", en: "Water: emotional intelligence, adaptability and connection." },
          { es: "Aire: pensamiento estratégico, perspectiva y visión.", en: "Air: strategic thinking, perspective and vision." },
          { es: "Núcleo: la integración de los cuatro en el líder. Siempre cierra el arco, nunca lo abre.", en: "Core: the integration of all four in the leader. It always closes the arc, never opens it." },
        ],
        links: [{ label: { es: "Explorar el método completo", en: "Explore the full method" }, route: METHOD }],
      },
      {
        h2: { es: "Cómo es una inmersión", en: "What an immersion looks like" },
        paragraphs: [
          {
            es: "Cada inmersión sigue el mismo arco de seis fases: liberación, encuentro, metodología, reflexión, diálogo e integración. La secuencia no es decorativa: está diseñada con neurociencia para que el aprendizaje se sostenga cuando el líder vuelve a su operación.",
            en: "Every immersion follows the same six-phase arc: release, encounter, methodology, reflection, dialogue and integration. The sequence isn't decorative: it is designed with neuroscience so the learning holds when the leader returns to operations.",
          },
          {
            es: "Las herramientas incluyen técnicas de regulación interna como breathwork, meditación y journaling, además de frameworks estratégicos y sesiones de coaching. Varían según el elemento que se trabaja.",
            en: "Tools include internal-regulation techniques such as breathwork, meditation and journaling, plus strategic frameworks and coaching sessions. They vary depending on the element being worked on.",
          },
        ],
      },
      {
        h2: { es: "Formatos para líderes y para equipos", en: "Formats for leaders and for teams" },
        paragraphs: [
          {
            es: "Un líder puede vivir el método en las Executive Experiences abiertas; un equipo directivo, en un retiro de liderazgo privado diseñado a la medida. Ambos comparten método y facilitadores.",
            en: "A leader can experience the method in the open-enrollment Executive Experiences; a leadership team, in a private leadership retreat designed to measure. Both share method and facilitators.",
          },
        ],
        links: [
          { label: { es: "Retiros ejecutivos y Executive Experiences", en: "Executive retreats and Executive Experiences" }, key: "executive-retreats" },
          { label: { es: "Descubre tu elemento dominante (test gratuito)", en: "Find your dominant element (free test)" }, route: { es: "test", en: "test" } },
        ],
      },
    ],
    faqs: [
      {
        q: { es: "¿Qué es un retiro de liderazgo?", en: "What is a leadership retreat?" },
        a: {
          es: "Un retiro de liderazgo es una inmersión de uno o varios días, fuera del entorno de trabajo, en la que un líder o un equipo trabaja su forma de pensar, decidir y relacionarse con ayuda de facilitadores. En Elements Method se hace en la naturaleza, con un método de cuatro elementos basado en neurociencia aplicada, PNL y coaching ejecutivo.",
          en: "A leadership retreat is a one- or multi-day immersion, away from the work environment, in which a leader or a team works on how they think, decide and relate with the help of facilitators. At Elements Method it takes place in nature, with a four-element method based on applied neuroscience, NLP and executive coaching.",
        },
      },
      {
        q: { es: "¿Necesito experiencia previa en coaching o meditación?", en: "Do I need previous coaching or meditation experience?" },
        a: {
          es: "No. Las prácticas se guían paso a paso y se adaptan al grupo. Lo único necesario es disposición para salir del piloto automático durante unos días.",
          en: "No. Practices are guided step by step and adapted to the group. All that's needed is willingness to step out of autopilot for a few days.",
        },
      },
      FAQ_DURATION,
      FAQ_LANG,
    ],
    related: ["executive-retreats", "corporate-retreats", "best-corporate-retreats"],
  },

  /* ─────────────────── TEAM BUILDING ─────────────────── */
  {
    key: "team-building-retreats",
    route: { es: "retiros-team-building", en: "team-building-retreats" },
    title: { es: "Retiros de team building en México con método", en: "Team-Building Retreats in Mexico, with a Method" },
    metaDescription: {
      es: "Retiros de team building en México que van más allá de las actividades: inmersiones facilitadas en la naturaleza para trabajar confianza, comunicación y alineación con el método de los cuatro elementos.",
      en: "Team-building retreats in Mexico that go beyond activities: facilitated immersions in nature to work on trust, communication and alignment with the four-element method.",
    },
    eyebrow: { es: "Equipos", en: "Teams" },
    h1: { es: "Retiros de team building que sí construyen equipo", en: "Team-building retreats that actually build the team" },
    definition: {
      es: "Los retiros de team building de Elements Method son inmersiones facilitadas en la naturaleza en México, para grupos de 4 a 50 personas, en las que el equipo trabaja confianza, comunicación, manejo del conflicto y alineación con el método de los cuatro elementos, en lugar de limitarse a actividades recreativas.",
      en: "Elements Method team-building retreats are facilitated immersions in nature in Mexico, for groups of 4 to 50 people, in which the team works on trust, communication, conflict handling and alignment with the four-element method, instead of limiting itself to recreational activities.",
    },
    lead: {
      es: "Quizás tu equipo no es el problema. Quizás nadie ha creado el espacio para tener la conversación que falta.",
      en: "Maybe your team isn't the problem. Maybe no one has created the space for the conversation that's missing.",
    },
    image: "/images/sections/comunidad.jpg",
    serviceType: { es: "Retiros de team building", en: "Team-building retreats" },
    sections: [
      {
        h2: { es: "Team building recreativo vs. desarrollo de equipo", en: "Recreational team building vs. team development" },
        paragraphs: [
          {
            es: "Una tirolesa genera anécdotas; no cambia cómo se toman decisiones el lunes. El desarrollo de equipo trabaja el sistema real: quién habla y quién calla, cómo se resuelve el desacuerdo, qué se tolera y qué se evita. Las actividades en Elements Method existen para provocar eso, no para sustituirlo.",
            en: "A zipline produces anecdotes; it doesn't change how decisions get made on Monday. Team development works on the real system: who speaks and who stays silent, how disagreement gets resolved, what is tolerated and what is avoided. Activities at Elements Method exist to provoke that, not to replace it.",
          },
        ],
      },
      {
        h2: { es: "Qué trabaja el equipo durante el retiro", en: "What the team works on during the retreat" },
        bullets: [
          { es: "Confianza y seguridad para decir lo que no se dice en la oficina.", en: "Trust and safety to say what doesn't get said at the office." },
          { es: "Comunicación bajo presión y escucha real (Agua).", en: "Communication under pressure and real listening (Water)." },
          { es: "Acuerdos de acción y responsabilidad compartida (Fuego).", en: "Action agreements and shared accountability (Fire)." },
          { es: "Identidad del equipo, roles y dirección común (Tierra).", en: "Team identity, roles and shared direction (Earth)." },
          { es: "Perspectiva sobre el sistema en el que operan (Aire).", en: "Perspective on the system they operate in (Air)." },
        ],
      },
      {
        h2: { es: "Actividades con propósito", en: "Activities with a purpose" },
        paragraphs: [
          {
            es: "Prácticas somáticas y de regulación (breathwork, movimiento, silencio), trabajo en la naturaleza, diálogo facilitado y ejercicios de frameworks estratégicos. Cada actividad se elige por el elemento que activa y por la conversación que abre. La agenda se diseña en el discovery con el líder del equipo y Recursos Humanos.",
            en: "Somatic and regulation practices (breathwork, movement, silence), work in nature, facilitated dialogue and strategic-framework exercises. Each activity is chosen for the element it activates and the conversation it opens. The agenda is designed during discovery with the team leader and HR.",
          },
        ],
        links: [
          { label: { es: "Cotizar un retiro para tu equipo", en: "Get a quote for your team's retreat" }, route: QUOTE },
          { label: { es: "Offsites empresariales: cuando además hay que hacer estrategia", en: "Company offsites: when strategy work is also on the table" }, key: "company-offsites" },
        ],
      },
    ],
    faqs: [
      {
        q: { es: "¿Cuál es la diferencia entre team building y un retiro de equipo?", en: "What is the difference between team building and a team retreat?" },
        a: {
          es: "El team building tradicional es un conjunto de actividades recreativas de unas horas. Un retiro de equipo es una inmersión facilitada, normalmente de uno a tres días y fuera de la oficina, en la que el equipo trabaja su forma de comunicarse, decidir y colaborar. Elements Method diseña retiros de equipo con método, en la naturaleza, en México.",
          en: "Traditional team building is a set of recreational activities lasting a few hours. A team retreat is a facilitated immersion, usually one to three days and away from the office, in which the team works on how it communicates, decides and collaborates. Elements Method designs team retreats with a method, in nature, in Mexico.",
        },
      },
      FAQ_SIZE,
      FAQ_PRICE,
      FAQ_WHERE,
    ],
    related: ["company-offsites", "corporate-retreats", "best-corporate-retreats"],
  },

  /* ─────────────────── OFFSITES ─────────────────── */
  {
    key: "company-offsites",
    route: { es: "offsites-empresariales-mexico", en: "company-offsites-mexico" },
    title: { es: "Offsites empresariales en México con facilitación", en: "Facilitated Company Offsites in Mexico" },
    metaDescription: {
      es: "Offsites empresariales en México que combinan sesiones de estrategia con inmersión de liderazgo. Sedes en Morelos y Ciudad de México, facilitación bilingüe y agenda diseñada a la medida.",
      en: "Company offsites in Mexico that combine strategy sessions with leadership immersion. Venues in Morelos and Mexico City, bilingual facilitation and a custom-designed agenda.",
    },
    eyebrow: { es: "Offsites", en: "Offsites" },
    h1: { es: "Offsites empresariales: estrategia y sistema humano en el mismo lugar", en: "Company offsites: strategy and the human system in the same place" },
    definition: {
      es: "Elements Method diseña y facilita offsites empresariales en México que combinan sesiones de trabajo estratégico con inmersión de liderazgo en la naturaleza, en sedes de Morelos y Ciudad de México o en la locación que el equipo elija, con facilitación en español e inglés.",
      en: "Elements Method designs and facilitates company offsites in Mexico that combine strategic work sessions with leadership immersion in nature, at venues in Morelos and Mexico City or at the location the team chooses, with facilitation in Spanish and English.",
    },
    lead: {
      es: "Un offsite sin facilitación es una junta larga en un lugar bonito. Con método, es el momento del año en que el equipo directivo se vuelve a alinear de verdad.",
      en: "An offsite without facilitation is a long meeting in a nice place. With a method, it's the moment of the year when the leadership team truly realigns.",
    },
    image: "/images/sections/locaciones.jpg",
    serviceType: { es: "Offsites empresariales facilitados", en: "Facilitated company offsites" },
    sections: [
      {
        h2: { es: "Qué incluye un offsite con Elements Method", en: "What an offsite with Elements Method includes" },
        bullets: [
          { es: "Diseño de agenda con dirección: qué decisiones deben salir del offsite y qué conversaciones hay que tener para llegar a ellas.", en: "Agenda design with leadership: which decisions must come out of the offsite and which conversations are needed to get there." },
          { es: "Bloques de estrategia facilitados con frameworks, alternados con bloques de trabajo de liderazgo y regulación.", en: "Facilitated strategy blocks using frameworks, alternated with leadership and regulation work blocks." },
          { es: "Sede, alimentos y logística coordinados en una sola propuesta.", en: "Venue, meals and logistics coordinated in a single proposal." },
          { es: "Cierre con acuerdos escritos y un plan de seguimiento.", en: "Closing with written agreements and a follow-up plan." },
        ],
      },
      {
        h2: { es: "Cómo se estructura un día", en: "How a day is structured" },
        paragraphs: [
          {
            es: "Cada jornada sigue el arco de seis fases del método: liberación (bajar el ruido operativo), encuentro (el equipo se ve de verdad), metodología (el trabajo estratégico o de liderazgo del día), reflexión, diálogo e integración (acuerdos). El orden importa: decidir estrategia antes de bajar el ruido produce las mismas decisiones de siempre.",
            en: "Each day follows the method's six-phase arc: release (lowering operational noise), encounter (the team truly sees itself), methodology (the day's strategic or leadership work), reflection, dialogue and integration (agreements). The order matters: deciding strategy before lowering the noise produces the same decisions as always.",
          },
        ],
      },
      {
        h2: { es: "Sedes y logística", en: "Venues and logistics" },
        paragraphs: [
          {
            es: "Trabajamos con sedes de naturaleza en Morelos, como Misión del Sol en Jiutepec, y con espacios en Ciudad de México para jornadas de un día. Si tu equipo ya tiene una locación, el programa se adapta a ella. Modalidad presencial, virtual o híbrida, y facilitación bilingüe para equipos regionales.",
            en: "We work with nature venues in Morelos, such as Misión del Sol in Jiutepec, and with spaces in Mexico City for one-day sessions. If your team already has a location, the program adapts to it. In-person, virtual or hybrid modality, and bilingual facilitation for regional teams.",
          },
        ],
      },
      {
        h2: { es: "Cuándo empezar a planearlo", en: "When to start planning" },
        paragraphs: [
          {
            es: "Recomendamos iniciar el discovery al menos seis semanas antes de la fecha: da tiempo para diagnosticar al equipo, reservar la sede y diseñar una agenda que no sea genérica. Puedes empezar con una estimación en la calculadora en línea y agendar una llamada.",
            en: "We recommend starting discovery at least six weeks before the date: it leaves time to diagnose the team, book the venue and design an agenda that isn't generic. You can start with an estimate on the online calculator and schedule a call.",
          },
        ],
        links: [
          { label: { es: "Cotizar un offsite", en: "Get an offsite quote" }, route: QUOTE },
          { label: { es: "Agendar una llamada de discovery", en: "Schedule a discovery call" }, route: SCHEDULE },
        ],
      },
    ],
    faqs: [
      {
        q: { es: "¿Qué es un offsite empresarial?", en: "What is a company offsite?" },
        a: {
          es: "Un offsite es una reunión de trabajo del equipo directivo o de un área fuera de la oficina, normalmente de uno a tres días, dedicada a estrategia, alineación y relaciones dentro del equipo. Elements Method lo facilita combinando sesiones de estrategia con trabajo de liderazgo en la naturaleza, en México.",
          en: "An offsite is a working meeting of the leadership team or a department away from the office, usually one to three days, dedicated to strategy, alignment and relationships within the team. Elements Method facilitates it by combining strategy sessions with leadership work in nature, in Mexico.",
        },
      },
      FAQ_DURATION,
      FAQ_PRICE,
      FAQ_WHERE,
      FAQ_LANG,
    ],
    related: ["corporate-retreats", "team-building-retreats", "best-corporate-retreats"],
  },
];

export const findLandingBySlug = (locale: "es" | "en", slug: string): SeoLanding | undefined =>
  SEO_LANDINGS.find((l) => l.route[locale] === slug);

export const findLandingByKey = (key: LandingKey): SeoLanding =>
  SEO_LANDINGS.find((l) => l.key === key)!;
