/**
 * Elements Method — launch data layer (auto-generated June 2026).
 *
 * Source: workflow-generated structured content from docs/Elements work plan.
 *
 * EVERY `isPlaceholder: true` field is documented in /PLACEHOLDERS.md.
 * Replace through the admin panel before October 1, 2026 launch.
 */

import type { ElementKey } from "./content";

// ────────────────────────────────────────────────────────────────────────────
// CALENDAR — 9 retreats (Oct 2026 → Q4 2027)
// ────────────────────────────────────────────────────────────────────────────

export type RetreatStatus = "open" | "waitlist" | "closed" | "sold";
export type VenueState = "confirmed" | "tentative" | "tbd";

export interface CalendarRetreat {
  slug: string;
  orderIdx: number;
  themeEs: string;
  themeEn: string;
  elementKey: ElementKey;
  startDate: string; // ISO YYYY-MM-DD
  endDate: string;
  dateLabelEs: string;
  dateLabelEn: string;
  venueState: VenueState;
  venueLabelEs: string;
  venueLabelEn: string;
  venueNote: string;
  summaryEs: string;
  summaryEn: string;
  status: RetreatStatus;
  capacity: number;
  seatsLeft: number;
  investmentLabelEs: string;
  investmentLabelEn: string;
  isPlaceholder: boolean;
  placeholderFields: string[];
}

export const calendarRetreats: CalendarRetreat[] = [
  // Próximas Executive Experiences — fuente: docs/productos/*.docx
  // Las landings completas viven en src/data/experiences.ts (mismo slug).
  {
    slug: "equinox",
    orderIdx: 1,
    themeEs: "EQUINOX · El arte de la transición interior",
    themeEn: "EQUINOX · The art of inner transition",
    elementKey: "agua",
    startDate: "2026-09-22",
    endDate: "2026-09-22",
    dateLabelEs: "Martes 22 de septiembre de 2026 · 9:00–19:00",
    dateLabelEn: "Tuesday, September 22, 2026 · 9:00–19:00",
    venueState: "tbd",
    venueLabelEs: "Ciudad de México · dirección exacta 7 días antes",
    venueLabelEn: "Mexico City · exact address 7 days before",
    venueNote: "Sede en Ciudad de México. La dirección e indicaciones de llegada se envían por correo 7 días antes de la experiencia.",
    summaryEs:
      "Una experiencia de transformación humana de un día, inspirada en el equinoccio de septiembre, para observar, soltar, reconfigurar, realinear y emerger. Neurociencia, coaching, movimiento, naturaleza, arte y prácticas contemplativas para entrar conscientemente en tu próxima etapa.",
    summaryEn:
      "A one-day human transformation experience inspired by the September equinox — to observe, release, reconfigure, realign and emerge. Neuroscience, coaching, movement, nature, art and contemplative practices to enter your next season consciously.",
    status: "open",
    capacity: 20,
    seatsLeft: 20,
    investmentLabelEs: "$7,500 MXN · Early Access $5,900 hasta el 6 de septiembre",
    investmentLabelEn: "MX$7,500 · Early Access MX$5,900 through Sep 6",
    isPlaceholder: true,
    placeholderFields: ["venue", "capacity", "seatsLeft"],
  },
  {
    slug: "elements-awakening",
    orderIdx: 2,
    themeEs: "ELEMENTS AWAKENING · Lead Your True Nature",
    themeEn: "ELEMENTS AWAKENING · Lead Your True Nature",
    elementKey: "eter",
    startDate: "2026-10-16",
    endDate: "2026-10-18",
    dateLabelEs: "Viernes 16 — Domingo 18 de octubre de 2026",
    dateLabelEn: "Friday Oct 16 — Sunday Oct 18, 2026",
    venueState: "confirmed",
    venueLabelEs: "Misión del Sol · Jiutepec, Morelos",
    venueLabelEn: "Misión del Sol · Jiutepec, Morelos",
    venueNote: "Misión del Sol Resort & Spa — sede confirmada",
    summaryEs:
      "Una experiencia inmersiva de liderazgo de 2.5 días para quienes han llegado lejos hacia afuera y están listos para ir más profundo hacia adentro. Cinco dimensiones del liderazgo —Tierra, Agua, Fuego, Aire y Éter— exploradas e integradas en una sola forma de liderar.",
    summaryEn:
      "A 2.5-day immersive leadership experience for those who have gone far on the outside and are ready to go deeper within. Five dimensions of leadership —Earth, Water, Fire, Air and Ether— explored and integrated into a single way of leading.",
    status: "open",
    capacity: 15,
    seatsLeft: 15,
    investmentLabelEs: "Por invitación · la inversión se comparte en la conversación de acceso",
    investmentLabelEn: "By invitation · investment shared in the access conversation",
    isPlaceholder: true,
    placeholderFields: ["capacity", "seatsLeft", "investment"],
  },
  {
    slug: "soul-discovery",
    orderIdx: 3,
    themeEs: "SOUL Discovery · Descubre quién eres",
    themeEn: "SOUL Discovery · Discover who you are",
    elementKey: "tierra",
    startDate: "2026-11-20",
    endDate: "2026-11-20",
    dateLabelEs: "Viernes 20 de noviembre de 2026",
    dateLabelEn: "Friday, November 20, 2026",
    venueState: "tbd",
    venueLabelEs: "Ciudad de México · dirección exacta 7 días antes",
    venueLabelEn: "Mexico City · exact address 7 days before",
    venueNote: "Sede en Ciudad de México. La dirección e indicaciones de llegada se envían por correo 7 días antes de la experiencia.",
    summaryEs:
      "Workshop intensivo de un día de autoconocimiento aplicado al personal branding. Explora tu historia, talentos, patrones y valores, y conviértelos en tu SOUL PRINT: un primer mapa estratégico de identidad, diferenciación y posicionamiento personal.",
    summaryEn:
      "A one-day intensive workshop of self-knowledge applied to personal branding. Explore your history, talents, patterns and values, and turn them into your SOUL PRINT: a first strategic map of identity, differentiation and personal positioning.",
    status: "open",
    capacity: 20,
    seatsLeft: 20,
    investmentLabelEs: "$7,500 MXN · Early Access $5,900 hasta el 11 de octubre",
    investmentLabelEn: "MX$7,500 · Early Access MX$5,900 through Oct 11",
    isPlaceholder: true,
    placeholderFields: ["venue", "capacity", "seatsLeft"],
  }
];

export const findRetreatBySlug = (slug: string) => calendarRetreats.find((r) => r.slug === slug);


// ────────────────────────────────────────────────────────────────────────────
// PROVIDERS — 16 disciplines / facilitators
// ────────────────────────────────────────────────────────────────────────────

export type ProviderStatus = "confirmed" | "in-contact" | "pending" | "researching";

export interface ProviderInfo {
  slug: string;
  disciplineEs: string;
  disciplineEn: string;
  elementAffinity: ElementKey;
  descriptionEs: string;
  descriptionEn: string;
  providerName: string;
  providerContact: string;
  status: ProviderStatus;
  notesEs: string;
  notesEn: string;
  isPlaceholder: boolean;
  placeholderFields: string[];
}

export const providersInventory: ProviderInfo[] = [
  {
    "slug": "caballos",
    "disciplineEs": "Caballos",
    "disciplineEn": "Equine Facilitation",
    "elementAffinity": "tierra",
    "descriptionEs": "El trabajo con caballos espeja al liderazgo desde la honestidad somática del elemento tierra. El caballo, como ser de manada altamente sensible al estado interno del humano, devuelve al líder una lectura instantánea de su congruencia, presencia y autoridad serena. Cada interacción se convierte en un laboratorio vivo para entrenar el cuerpo del líder en arraigo, claridad y comunicación no verbal.",
    "descriptionEn": "Working with horses mirrors leadership through the somatic honesty of the earth element. As a herd being acutely attuned to the human's inner state, the horse returns instant feedback on the leader's congruence, presence, and grounded authority. Each interaction becomes a living laboratory for training the leader's body in rootedness, clarity, and non-verbal communication.",
    "providerName": "Proveedor por confirmar",
    "providerContact": "Pendiente",
    "status": "in-contact",
    "notesEs": "Prioridad alta segun el plan de trabajo. Validar disponibilidad de rancho, seguros y facilitador certificado en equine assisted learning (EAL) cerca de la sede principal del retiro.",
    "notesEn": "High priority per the work plan. Validate ranch availability, insurance coverage, and an Equine Assisted Learning (EAL) certified facilitator near the main retreat venue.",
    "isPlaceholder": true,
    "placeholderFields": [
      "providerName",
      "providerContact"
    ]
  },
  {
    "slug": "cuencos-tibetanos",
    "disciplineEs": "Cuencos Tibetanos",
    "disciplineEn": "Tibetan Singing Bowls",
    "elementAffinity": "aire",
    "descriptionEs": "Los cuencos tibetanos trabajan al lider desde el elemento aire: vibracion, frecuencia y respiracion sutil. El bano sonoro disuelve patrones mentales rigidos y abre estados de coherencia cerebral utiles para la toma de decisiones bajo presion. Para el lider, es una herramienta de reset neural antes de momentos de alto impacto.",
    "descriptionEn": "Tibetan singing bowls work the leader through the air element: vibration, frequency, and subtle breath. The sound bath dissolves rigid mental patterns and opens states of brain coherence useful for decision-making under pressure. For the leader, it is a neural reset tool ahead of high-stakes moments.",
    "providerName": "Proveedor por confirmar",
    "providerContact": "Pendiente",
    "status": "researching",
    "notesEs": "Confirmar set completo de cuencos (7 chakras minimo) y experiencia del facilitador en grupos ejecutivos. Evaluar si se puede combinar con gong bath en la misma sesion.",
    "notesEn": "Confirm complete bowl set (minimum 7 chakras) and facilitator experience with executive groups. Evaluate whether it can be combined with gong bath in the same session.",
    "isPlaceholder": true,
    "placeholderFields": [
      "providerName",
      "providerContact"
    ]
  },
  {
    "slug": "breathwork",
    "disciplineEs": "Breathwork",
    "disciplineEn": "Breathwork",
    "elementAffinity": "aire",
    "descriptionEs": "El breathwork es la puerta directa al elemento aire y al sistema nervioso autonomo del lider. A traves de respiraciones conscientes el participante aprende a auto-regularse, liberar carga emocional acumulada y acceder a estados expandidos de claridad estrategica. Es una de las practicas mas escalables para integrarse en la rutina diaria post-retiro.",
    "descriptionEn": "Breathwork is the direct doorway to the air element and to the leader's autonomic nervous system. Through conscious breathing the participant learns to self-regulate, release accumulated emotional load, and access expanded states of strategic clarity. It is one of the most scalable practices to integrate into daily routine after the retreat.",
    "providerName": "Proveedor por confirmar",
    "providerContact": "Pendiente",
    "status": "researching",
    "notesEs": "Definir modalidad: holotropico, Wim Hof, rebirthing o pranayama. Cada uno tiene perfil de riesgo y nivel de contencion distinto para grupos corporativos.",
    "notesEn": "Define modality: holotropic, Wim Hof, rebirthing, or pranayama. Each has a distinct risk profile and containment level for corporate groups.",
    "isPlaceholder": true,
    "placeholderFields": [
      "providerName",
      "providerContact"
    ]
  },
  {
    "slug": "gong-baths",
    "disciplineEs": "Baños de Gong",
    "disciplineEn": "Gong Baths",
    "elementAffinity": "aire",
    "descriptionEs": "El gong envuelve al lider en un campo vibracional que recorre la masa corporal entera, despejando ruido mental y desbloqueando intuicion. Como practica del elemento aire amplificado, ayuda a procesar decisiones complejas en estado theta y a integrar aprendizajes profundos del retiro. Es un cierre potente despues de jornadas de alta exigencia cognitiva.",
    "descriptionEn": "The gong envelops the leader in a vibrational field that traverses the entire body, clearing mental noise and unlocking intuition. As a practice of amplified air, it helps process complex decisions in theta state and integrate deep retreat learnings. It is a powerful closing after cognitively demanding sessions.",
    "providerName": "Proveedor por confirmar",
    "providerContact": "Pendiente",
    "status": "researching",
    "notesEs": "Validar transporte del gong (instrumento grande y fragil) y acustica del espacio. Idealmente el mismo proveedor que cuencos tibetanos para optimizar logistica.",
    "notesEn": "Validate transport of the gong (large, fragile instrument) and venue acoustics. Ideally the same provider as Tibetan bowls to streamline logistics.",
    "isPlaceholder": true,
    "placeholderFields": [
      "providerName",
      "providerContact"
    ]
  },
  {
    "slug": "yoga",
    "disciplineEs": "Yoga",
    "disciplineEn": "Yoga",
    "elementAffinity": "tierra",
    "descriptionEs": "El yoga ancla al lider en el cuerpo, su primer territorio de autoridad. La practica de asanas, alineacion y respiracion devuelve la conciencia al elemento tierra: postura, equilibrio y centro fisico. Para el ejecutivo es una herramienta de higiene neuromuscular que sostiene jornadas largas sin perder presencia.",
    "descriptionEn": "Yoga anchors the leader in the body, their first territory of authority. The practice of asanas, alignment, and breath returns awareness to the earth element: posture, balance, and physical center. For the executive it is a neuromuscular hygiene tool that sustains long days without losing presence.",
    "providerName": "Proveedor por confirmar",
    "providerContact": "Pendiente",
    "status": "researching",
    "notesEs": "Definir estilo segun objetivo de la sesion (hatha para integracion, vinyasa para activacion, yin para descarga emocional). Preferir facilitador bilingue.",
    "notesEn": "Define style according to session goal (hatha for integration, vinyasa for activation, yin for emotional release). Prefer a bilingual facilitator.",
    "isPlaceholder": true,
    "placeholderFields": [
      "providerName",
      "providerContact"
    ]
  },
  {
    "slug": "caminar-en-fuego",
    "disciplineEs": "Caminar en Fuego",
    "disciplineEn": "Firewalking",
    "elementAffinity": "fuego",
    "descriptionEs": "Caminar sobre brasas confronta al lider con su umbral de miedo de manera incontestable. El elemento fuego se vuelve maestro: lo que la mente etiqueta como imposible, el cuerpo lo realiza en cuestion de segundos cuando hay foco, decision y presencia. Es la metafora viva del coraje ejecutivo y la accion bajo incertidumbre.",
    "descriptionEn": "Walking on hot coals confronts the leader with their fear threshold in an undeniable way. The fire element becomes the teacher: what the mind labels impossible, the body accomplishes in seconds when there is focus, decision, and presence. It is the living metaphor of executive courage and action under uncertainty.",
    "providerName": "Proveedor por confirmar",
    "providerContact": "Pendiente",
    "status": "researching",
    "notesEs": "Requiere facilitador certificado (FIRE / Sundoor o equivalente), permisos del recinto y protocolo medico de respaldo. Riesgo legal a mitigar via consentimiento informado.",
    "notesEn": "Requires a certified facilitator (FIRE / Sundoor or equivalent), venue permits, and a medical backup protocol. Legal risk to mitigate via informed consent.",
    "isPlaceholder": true,
    "placeholderFields": [
      "providerName",
      "providerContact"
    ]
  },
  {
    "slug": "chaman-temazcal",
    "disciplineEs": "Chamán y Temazcal",
    "disciplineEn": "Shaman and Temazcal",
    "elementAffinity": "fuego",
    "descriptionEs": "El temazcal es el utero ancestral donde fuego, agua, tierra y aire se encuentran para una purga profunda. Guiado por un temazcalero o chamana de linaje, el lider entrega cargas heredadas, ego endurecido y dialogos internos obsoletos. Sale renacido, listo para liderar desde un lugar mas limpio y conectado con su mision.",
    "descriptionEn": "The temazcal is the ancestral womb where fire, water, earth, and air meet for deep purging. Guided by a lineage-rooted temazcalero or shaman, the leader surrenders inherited burdens, hardened ego, and obsolete inner dialogues. They emerge reborn, ready to lead from a cleaner place connected to their mission.",
    "providerName": "Proveedor por confirmar",
    "providerContact": "Pendiente",
    "status": "pending",
    "notesEs": "Buscar linaje legitimo (no apropiacion cultural). Verificar permisos comunitarios, contraindicaciones medicas (embarazo, hipertension) y disponibilidad de temazcal fijo cerca de la sede.",
    "notesEn": "Seek a legitimate lineage (avoid cultural appropriation). Verify community permissions, medical contraindications (pregnancy, hypertension), and availability of a fixed temazcal near the venue.",
    "isPlaceholder": true,
    "placeholderFields": [
      "providerName",
      "providerContact"
    ]
  },
  {
    "slug": "dmr-deep-meditation-reconnection",
    "disciplineEs": "DMR (Meditación Profunda y Reconexión)",
    "disciplineEn": "DMR (Deep Meditation and Reconnection)",
    "elementAffinity": "eter",
    "descriptionEs": "La DMR opera en el plano de la integracion: silencio expandido, percepcion no ordinaria y reconexion con la fuente interna de proposito. Para el lider es el espacio donde se reformatean los para que profundos detras de su trabajo y se accede a vision estrategica de largo plazo. Es una de las practicas mas integradoras del metodo.",
    "descriptionEn": "DMR operates on the subtle plane of ether: expanded silence, non-ordinary perception, and reconnection with the inner source of purpose. For the leader it is the space where the deep why behind their work is reformatted and long-term strategic vision becomes accessible. It is one of the most integrative practices of the method.",
    "providerName": "Proveedor por confirmar",
    "providerContact": "Pendiente",
    "status": "researching",
    "notesEs": "Aclarar exactamente que metodologia es DMR (puede confundirse con tecnicas registradas). Documentar el linaje y el marco que se usara internamente para evitar conflicto de marca.",
    "notesEn": "Clarify exactly which methodology DMR refers to (it may be confused with trademarked techniques). Document the lineage and framework used internally to avoid brand conflict.",
    "isPlaceholder": true,
    "placeholderFields": [
      "providerName",
      "providerContact"
    ]
  },
  {
    "slug": "paddle-yoga",
    "disciplineEs": "Paddle Yoga",
    "disciplineEn": "Paddle Yoga (SUP Yoga)",
    "elementAffinity": "agua",
    "descriptionEs": "Practicar yoga sobre una tabla flotante introduce al lider al elemento agua en su forma mas pedagogica: cualquier rigidez se traduce en caida. El equilibrio se logra solo desde la flexibilidad, la respiracion y la lectura constante del entorno. Es una metafora corporal directa del liderazgo adaptativo.",
    "descriptionEn": "Practicing yoga on a floating board introduces the leader to the water element in its most pedagogical form: any rigidity translates into a fall. Balance is achieved only through flexibility, breath, and constant reading of the environment. It is a direct embodied metaphor of adaptive leadership.",
    "providerName": "Proveedor por confirmar",
    "providerContact": "Pendiente",
    "status": "researching",
    "notesEs": "Requiere cuerpo de agua tranquilo cerca de la sede (laguna, presa, mar protegido). Validar renta de tablas, chalecos, instructor certificado y seguro de actividad acuatica.",
    "notesEn": "Requires calm water near the venue (lake, reservoir, sheltered sea). Validate board rental, life vests, certified instructor, and aquatic activity insurance.",
    "isPlaceholder": true,
    "placeholderFields": [
      "providerName",
      "providerContact"
    ]
  },
  {
    "slug": "audifonos-terapia-sonora",
    "disciplineEs": "Audífonos de Terapia Sonora",
    "disciplineEn": "Sound Therapy Headphones",
    "elementAffinity": "aire",
    "descriptionEs": "La terapia sonora por audifonos entrega al lider frecuencias binaurales y paisajes acusticos disenados para inducir estados especificos: foco profundo, descanso reparador o integracion emocional. Es la version escalable y portatil del elemento aire que el participante se lleva a su rutina diaria post-retiro. Funciona como puente entre la experiencia inmersiva y la vida cotidiana.",
    "descriptionEn": "Headphone-based sound therapy delivers binaural frequencies and acoustic landscapes designed to induce specific states: deep focus, restorative rest, or emotional integration. It is the scalable, portable version of the air element that participants carry into their daily routine after the retreat. It works as a bridge between the immersive experience and everyday life.",
    "providerName": "Proveedor por confirmar",
    "providerContact": "Pendiente",
    "status": "researching",
    "notesEs": "Evaluar hardware (Sensate, Apollo Neuro, Hapbee o equivalentes) vs. software puro (Endel, Hemi-Sync). Definir si se entregan en kit fisico al cliente o se recomiendan via app.",
    "notesEn": "Evaluate hardware (Sensate, Apollo Neuro, Hapbee, or equivalents) vs. pure software (Endel, Hemi-Sync). Decide whether to deliver as a physical kit to the client or recommend via app.",
    "isPlaceholder": true,
    "placeholderFields": [
      "providerName",
      "providerContact"
    ]
  },
  {
    "slug": "heart-math",
    "disciplineEs": "HeartMath",
    "disciplineEn": "HeartMath",
    "elementAffinity": "agua",
    "descriptionEs": "HeartMath entrena al lider en coherencia cardiaca medible: el corazon como organo de inteligencia emocional y como modulador del sistema nervioso. Asociado al elemento agua por su naturaleza fluida y emocional, permite al ejecutivo regular reactividad en tiempo real, especialmente en conversaciones dificiles. Su valor diferencial es que la transformacion es cuantificable via biofeedback.",
    "descriptionEn": "HeartMath trains the leader in measurable heart coherence: the heart as an organ of emotional intelligence and as a modulator of the nervous system. Associated with the water element for its fluid, emotional nature, it allows the executive to regulate reactivity in real time, especially during difficult conversations. Its differential value is that transformation is quantifiable through biofeedback.",
    "providerName": "Proveedor por confirmar",
    "providerContact": "Pendiente",
    "status": "researching",
    "notesEs": "Cuestionar acceso a certificacion HeartMath oficial (Resilient Heart, Stress & Well-Being Assessment) y costo de licencias del Inner Balance / emWave para uso corporativo.",
    "notesEn": "Question access to official HeartMath certification (Resilient Heart, Stress & Well-Being Assessment) and license cost of Inner Balance / emWave for corporate use.",
    "isPlaceholder": true,
    "placeholderFields": [
      "providerName",
      "providerContact"
    ]
  },
  {
    "slug": "forest-bathing",
    "disciplineEs": "Baño de Bosque (Shinrin-Yoku)",
    "disciplineEn": "Forest Bathing (Shinrin-Yoku)",
    "elementAffinity": "tierra",
    "descriptionEs": "El bano de bosque sumerge al lider en el elemento tierra a traves de los sentidos: olor a humedad, textura de corteza, sonido de copas. La ciencia japonesa demuestra reducciones medibles de cortisol y aumento de celulas NK tras dos horas de inmersion. Para el ejecutivo es un antidoto directo al sobreestimulo digital y un retorno al ritmo biologico.",
    "descriptionEn": "Forest bathing immerses the leader in the earth element through the senses: damp scent, bark texture, canopy sound. Japanese science demonstrates measurable cortisol reductions and increased NK cells after two hours of immersion. For the executive it is a direct antidote to digital overstimulation and a return to biological rhythm.",
    "providerName": "Proveedor por confirmar",
    "providerContact": "Pendiente",
    "status": "researching",
    "notesEs": "Buscar guia certificado por ANFT o equivalente. Mapear sendero seguro y estacionalmente accesible cerca de la sede; idealmente con punto de te ceremonial al cierre.",
    "notesEn": "Look for an ANFT-certified guide or equivalent. Map a safe, seasonally accessible trail near the venue; ideally with a ceremonial tea point at closing.",
    "isPlaceholder": true,
    "placeholderFields": [
      "providerName",
      "providerContact"
    ]
  },
  {
    "slug": "meditaciones",
    "disciplineEs": "Meditaciones",
    "disciplineEn": "Meditations",
    "elementAffinity": "eter",
    "descriptionEs": "Las meditaciones son el hilo conductor que sostiene la arquitectura del metodo: pausas estructuradas de silencio que devuelven al lider a su nucleo, al espacio anterior al pensamiento. Cultivan testigo interno, capacidad de no reaccionar y discernimiento. Son la practica mas portable y la que mas se busca integrar como habito diario despues del retiro.",
    "descriptionEn": "Meditations are the connecting thread that holds the method's architecture: structured pauses of silence that return the leader to the ether element, the space before thought. They cultivate inner witness, non-reactivity, and discernment. They are the most portable practice and the one most often integrated as a daily habit after the retreat.",
    "providerName": "Proveedor por confirmar",
    "providerContact": "Pendiente",
    "status": "researching",
    "notesEs": "Curar 3-4 estilos complementarios (vipassana, metta, visualizacion guiada, mindfulness laboral). Posible biblioteca de audios propia para entregar al cliente como activo post-retiro.",
    "notesEn": "Curate 3-4 complementary styles (vipassana, metta, guided visualization, workplace mindfulness). Possible proprietary audio library to deliver to the client as a post-retreat asset.",
    "isPlaceholder": true,
    "placeholderFields": [
      "providerName",
      "providerContact"
    ]
  },
  {
    "slug": "quiropractico",
    "disciplineEs": "Quiropráctico",
    "disciplineEn": "Chiropractor",
    "elementAffinity": "tierra",
    "descriptionEs": "El ajuste quiropractico devuelve al lider su eje fisico: una columna alineada es prerequisito de presencia y resistencia ejecutiva. Trabaja al elemento tierra desde la estructura osea, la inervacion y la postura cotidiana frente a la pantalla. Para muchos participantes es la primera vez que reciben evaluacion biomecanica profesional y se llevan diagnostico accionable.",
    "descriptionEn": "Chiropractic adjustment restores the leader's physical axis: an aligned spine is a prerequisite for executive presence and resilience. It works the earth element through bone structure, innervation, and daily posture at the screen. For many participants it is the first time they receive a professional biomechanical assessment and leave with an actionable diagnosis.",
    "providerName": "Proveedor por confirmar",
    "providerContact": "Pendiente",
    "status": "researching",
    "notesEs": "Definir si el servicio es 1:1 individual durante el retiro o sesion educativa grupal. Confirmar cedula profesional y seguro de mala practica del especialista.",
    "notesEn": "Decide whether the service is individual 1:1 during the retreat or a group educational session. Confirm the specialist's professional license and malpractice insurance.",
    "isPlaceholder": true,
    "placeholderFields": [
      "providerName",
      "providerContact"
    ]
  },
  {
    "slug": "terapias-de-luz-infrarroja",
    "disciplineEs": "Terapias de Luz Infrarroja",
    "disciplineEn": "Infrared Light Therapy",
    "elementAffinity": "fuego",
    "descriptionEs": "La luz infrarroja es fuego biotecnologico: longitudes de onda especificas que penetran piel y mitocondria para acelerar recuperacion, reducir inflamacion y mejorar calidad de sueno. Para el lider sometido a viajes, jet lag y agendas intensas, es una intervencion regenerativa directa. Encarna el elemento fuego en su expresion mas precisa y cientifica.",
    "descriptionEn": "Infrared light is biotechnological fire: specific wavelengths that penetrate skin and mitochondria to accelerate recovery, reduce inflammation, and improve sleep quality. For leaders facing travel, jet lag, and intense schedules, it is a direct regenerative intervention. It embodies the fire element in its most precise and scientific expression.",
    "providerName": "Proveedor por confirmar",
    "providerContact": "Pendiente",
    "status": "researching",
    "notesEs": "Decidir formato: sauna infrarroja completa (alto capex, alto wow), paneles red light (Joovv, Mito) o ambos. Validar protocolos de uso y contraindicaciones (fotosensibilidad, medicamentos).",
    "notesEn": "Decide format: full infrared sauna (high capex, high wow), red light panels (Joovv, Mito) or both. Validate usage protocols and contraindications (photosensitivity, medications).",
    "isPlaceholder": true,
    "placeholderFields": [
      "providerName",
      "providerContact"
    ]
  },
  {
    "slug": "reconexion-energetica",
    "disciplineEs": "Reconexión Energética",
    "disciplineEn": "Energy Reconnection",
    "elementAffinity": "eter",
    "descriptionEs": "La reconexion energetica trabaja directamente sobre el nucleo: el campo donde se almacenan patrones, contratos y heridas no resueltas. Para el lider es la oportunidad de liberar bloqueos invisibles que sabotean decisiones importantes y reconectar con su mision esencial. Es la practica de cierre que sella la integracion del trabajo hecho con los cuatro elementos.",
    "descriptionEn": "Energy reconnection works directly with the ether element: the subtle field where patterns, contracts, and unresolved wounds are stored. For the leader it is the opportunity to release invisible blocks that sabotage important decisions and reconnect with their essential mission. It is the closing practice that seals the integration of work done with the other elements.",
    "providerName": "Proveedor por confirmar",
    "providerContact": "Pendiente",
    "status": "researching",
    "notesEs": "Definir linaje (Reconnective Healing de Eric Pearl, registros akashicos, biomagnetismo, etc.) para evitar ambiguedad con el cliente corporativo y poder comunicarlo con rigor.",
    "notesEn": "Define lineage (Eric Pearl's Reconnective Healing, akashic records, biomagnetism, etc.) to avoid ambiguity with the corporate client and communicate it with rigor.",
    "isPlaceholder": true,
    "placeholderFields": [
      "providerName",
      "providerContact"
    ]
  }
];

export const findProviderBySlug = (slug: string) => providersInventory.find((p) => p.slug === slug);


// ────────────────────────────────────────────────────────────────────────────
// VENUES — 13 candidate locations
// ────────────────────────────────────────────────────────────────────────────

export type VenueStateAdmin =
  | "confirmed"
  | "cotizacion-en-proceso"
  | "sin-respuesta"
  | "researching"
  | "available-2027";

export interface VenueInfo {
  slug: string;
  name: string;
  city: string;
  state: VenueStateAdmin;
  capacity: string;
  notesEs: string;
  url: string;
  rangeMxn: string;
  isPlaceholder: boolean;
  placeholderFields: string[];
}

export const venuesInventory: VenueInfo[] = [
  {
    "slug": "bosque-geometrico",
    "name": "Bosque Geométrico",
    "city": "Tepoztlán",
    "state": "researching",
    "capacity": "Cabañas 2 personas c/u",
    "notesEs": "Contacto: Aurora. Cabañas para 2 personas. Tarifa por persona/noche entre $1,800 y $4,800 MXN.",
    "url": "",
    "rangeMxn": "$1,800–$4,800 por persona/noche",
    "isPlaceholder": true,
    "placeholderFields": [
      "url"
    ]
  },
  {
    "slug": "soulspring",
    "name": "Soulspring",
    "city": "Cuernavaca",
    "state": "researching",
    "capacity": "Por confirmar",
    "notesEs": "Contacto: Jesús Hernández. Pendiente confirmar capacidad y tarifas.",
    "url": "",
    "rangeMxn": "Por confirmar",
    "isPlaceholder": true,
    "placeholderFields": [
      "capacity",
      "url",
      "rangeMxn"
    ]
  },
  {
    "slug": "casa-suna",
    "name": "Casa Suna",
    "city": "Los Cabos",
    "state": "researching",
    "capacity": "Por confirmar",
    "notesEs": "Listada vía Airbnb. Pendiente confirmar capacidad y tarifas.",
    "url": "",
    "rangeMxn": "Por confirmar",
    "isPlaceholder": true,
    "placeholderFields": [
      "capacity",
      "url",
      "rangeMxn"
    ]
  },
  {
    "slug": "casa-juana",
    "name": "Casa Juana",
    "city": "Tepoztlán",
    "state": "researching",
    "capacity": "12 camas",
    "notesEs": "Reservas vía casitamx.com. 12 camas. Tarifa $30,000 MXN por noche (renta completa).",
    "url": "https://casitamx.com",
    "rangeMxn": "$30,000 por noche (renta completa)",
    "isPlaceholder": false,
    "placeholderFields": []
  },
  {
    "slug": "casa-eterea",
    "name": "Casa Etérea",
    "city": "San Miguel de Allende",
    "state": "researching",
    "capacity": "2 personas",
    "notesEs": "Capacidad para 2 personas. Estancia mínima 2 noches. Tarifa $15,000 MXN.",
    "url": "",
    "rangeMxn": "$15,000 MXN (mín. 2 noches)",
    "isPlaceholder": true,
    "placeholderFields": [
      "url"
    ]
  },
  {
    "slug": "villa-alpina",
    "name": "Villa Alpina",
    "city": "Por confirmar",
    "state": "researching",
    "capacity": "Por confirmar",
    "notesEs": "Contacto vía Instagram @_villalpina_. Pendiente confirmar ubicación, capacidad y tarifas.",
    "url": "https://instagram.com/_villalpina_",
    "rangeMxn": "Por confirmar",
    "isPlaceholder": true,
    "placeholderFields": [
      "city",
      "capacity",
      "rangeMxn"
    ]
  },
  {
    "slug": "estacion-san-miguel-chapultepec",
    "name": "Estación San Miguel Chapultepec",
    "city": "Ciudad de México",
    "state": "cotizacion-en-proceso",
    "capacity": "40-100 personas",
    "notesEs": "Capacidad para 40-100 personas. Cotización en proceso.",
    "url": "",
    "rangeMxn": "Por confirmar",
    "isPlaceholder": true,
    "placeholderFields": [
      "url",
      "rangeMxn"
    ]
  },
  {
    "slug": "espacio-florecer",
    "name": "Espacio Florecer",
    "city": "Desierto de los Leones",
    "state": "sin-respuesta",
    "capacity": "Por confirmar",
    "notesEs": "Sin respuesta a la solicitud de cotización. Pendiente reintentar contacto.",
    "url": "",
    "rangeMxn": "Por confirmar",
    "isPlaceholder": true,
    "placeholderFields": [
      "capacity",
      "url",
      "rangeMxn"
    ]
  },
  {
    "slug": "krasiba",
    "name": "Krasiba",
    "city": "Por confirmar",
    "state": "researching",
    "capacity": "Sin hospedaje (espacio diurno)",
    "notesEs": "Bosque y caballos. No cuenta con hospedaje, sólo espacio para actividades. Pendiente confirmar tarifas.",
    "url": "",
    "rangeMxn": "Por confirmar",
    "isPlaceholder": true,
    "placeholderFields": [
      "city",
      "url",
      "rangeMxn"
    ]
  },
  {
    "slug": "el-santuario",
    "name": "El Santuario",
    "city": "Valle de Bravo",
    "state": "cotizacion-en-proceso",
    "capacity": "Por confirmar",
    "notesEs": "Contacto: Ariana Ramírez. Cotización en proceso.",
    "url": "",
    "rangeMxn": "Por confirmar",
    "isPlaceholder": true,
    "placeholderFields": [
      "capacity",
      "url",
      "rangeMxn"
    ]
  },
  {
    "slug": "khungi",
    "name": "KHUNGI",
    "city": "Valle de Bravo",
    "state": "available-2027",
    "capacity": "19 cabañas, 2 personas c/u · mín. 18 / máx. 38 personas",
    "notesEs": "Contacto: Lluvia. 19 cabañas para 2 personas cada una. Mínimo 18 y máximo 38 personas. Tarifa $2,750-$4,250 MXN por persona/noche. Disponibilidad a partir de 2027.",
    "url": "",
    "rangeMxn": "$2,750–$4,250 por persona/noche",
    "isPlaceholder": true,
    "placeholderFields": [
      "url"
    ]
  },
  {
    "slug": "aldea-pachamama",
    "name": "Aldea Pachamama",
    "city": "Popocatépetl",
    "state": "researching",
    "capacity": "Por confirmar",
    "notesEs": "Ubicación en la zona del Popocatépetl. Pendiente confirmar capacidad y tarifas.",
    "url": "",
    "rangeMxn": "Por confirmar",
    "isPlaceholder": true,
    "placeholderFields": [
      "capacity",
      "url",
      "rangeMxn"
    ]
  },
  {
    "slug": "hacienda-san-gabriel",
    "name": "Hacienda San Gabriel",
    "city": "Cuernavaca",
    "state": "researching",
    "capacity": "Por confirmar",
    "notesEs": "Sitio web haciendasangabriel.com. Pendiente confirmar capacidad y tarifas.",
    "url": "https://haciendasangabriel.com",
    "rangeMxn": "Por confirmar",
    "isPlaceholder": true,
    "placeholderFields": [
      "capacity",
      "rangeMxn"
    ]
  }
];

// ────────────────────────────────────────────────────────────────────────────
// LEGAL — 3 documents (Contrato / NDA / Relevo)
// ────────────────────────────────────────────────────────────────────────────

export type LegalSlug = "contrato" | "nda" | "relevo";

export interface LegalDoc {
  slug: LegalSlug;
  titleEs: string;
  titleEn: string;
  summaryEs: string;
  summaryEn: string;
  bodyEs: string;
  bodyEn: string;
  placeholderFields: string[];
}

export const legalDocs: LegalDoc[] = [
  {
    "slug": "contrato",
    "titleEs": "Contrato de Participación — Elements Method",
    "titleEn": "Participation Agreement — Elements Method",
    "summaryEs": "Acuerdo que regula la participación del asistente en el retiro o experiencia inmersiva ofrecida por Elements Method, incluyendo inversión, cancelaciones y obligaciones de las partes.",
    "summaryEn": "Agreement governing the participant's involvement in the retreat or immersive experience offered by Elements Method, including investment, cancellations, and obligations of the parties.",
    "bodyEs": "> ⚠ [DOCUMENTO BORRADOR — PENDIENTE REVISIÓN LEGAL · NO USAR EN PRODUCCIÓN]\n\n## 1. Partes\n\nEl presente Contrato de Participación (en adelante, el \"Contrato\") se celebra entre:\n\n- **\"El Organizador\"**: {{ORGANIZADOR_RAZON_SOCIAL}}, con domicilio en {{ORGANIZADOR_DOMICILIO}}, RFC {{ORGANIZADOR_RFC}}, representado por {{ORGANIZADOR_REPRESENTANTE}}.\n- **\"El Participante\"**: {{PARTICIPANTE_NOMBRE}}, con domicilio en {{PARTICIPANTE_DOMICILIO}}, identificación oficial {{PARTICIPANTE_ID}}, correo {{PARTICIPANTE_EMAIL}}.\n\n## 2. Objeto\n\nEl Organizador prestará al Participante los servicios correspondientes al programa \"{{NOMBRE_PROGRAMA}}\" (en adelante, el \"Retiro\"), a celebrarse del {{FECHA_INICIO}} al {{FECHA_FIN}}, en {{VENUE}}.\n\nEl Retiro incluye: hospedaje, alimentación según menú comunicado, facilitación de sesiones, materiales y actividades descritas en el itinerario adjunto como Anexo A.\n\n## 3. Inversión y Forma de Pago\n\nEl monto total de la inversión es de **{{INVERSION_MXN}} MXN** (más IVA cuando aplique), pagadero conforme al siguiente calendario:\n\n- Anticipo: {{ANTICIPO_MXN}} a la firma.\n- Saldo: {{SALDO_MXN}} a más tardar el {{FECHA_SALDO}}.\n\nLas transferencias se realizarán a la cuenta {{CUENTA_BANCARIA}}. El comprobante fiscal se emitirá conforme a los datos proporcionados por el Participante.\n\n## 4. Cancelaciones y Reembolsos\n\n- Cancelación con más de {{DIAS_CANCELACION_TOTAL}} días previos a {{FECHA_INICIO}}: reembolso del {{PORCENTAJE_REEMBOLSO_TOTAL}}%.\n- Cancelación entre {{DIAS_CANCELACION_PARCIAL}} y {{DIAS_CANCELACION_TOTAL}} días previos: reembolso del {{PORCENTAJE_REEMBOLSO_PARCIAL}}%.\n- Cancelación con menos de {{DIAS_CANCELACION_PARCIAL}} días previos o no presentarse: sin reembolso.\n\nEn caso de fuerza mayor declarada por el Organizador, se ofrecerá reagendar para una fecha futura conforme a la política vigente.\n\n## 5. Obligaciones del Participante\n\nEl Participante se compromete a: (i) llegar puntualmente a {{VENUE}}; (ii) acatar el reglamento interno; (iii) respetar a facilitadores y demás asistentes; (iv) declarar veracidad sobre su estado de salud mediante el formulario médico adjunto.\n\n## 6. Confidencialidad\n\nEl Participante reconoce que durante el Retiro podrá tener acceso a información, prácticas y vivencias de otros participantes. Se obliga a mantener la confidencialidad conforme al Acuerdo de Confidencialidad (NDA) firmado por separado.\n\n## 7. Salud y Riesgos\n\nLa participación en el Retiro implica riesgos inherentes a actividades físicas, emocionales y de inmersión. El Participante firmará por separado el Relevo de Responsabilidades correspondiente.\n\n## 8. Propiedad Intelectual\n\nTodo el material, metodología, marca y contenido del Retiro es propiedad exclusiva del Organizador y no podrá ser reproducido sin autorización por escrito.\n\n## 9. Ley Aplicable y Jurisdicción\n\nEl presente Contrato se rige por las leyes de {{LEY_APLICABLE}}. Para cualquier controversia, las partes se someten a los tribunales competentes de {{CIUDAD_JURISDICCION}}, renunciando a cualquier otro fuero.\n\n## 10. Firmas\n\nLeído y aceptado en {{CIUDAD_FIRMA}}, a {{FECHA_FIRMA}}.\n\n_________________________  \n{{PARTICIPANTE_NOMBRE}}  \nEl Participante\n\n_________________________  \n{{ORGANIZADOR_REPRESENTANTE}}  \nEl Organizador",
    "bodyEn": "> ⚠ [DOCUMENTO BORRADOR — PENDIENTE REVISIÓN LEGAL · NO USAR EN PRODUCCIÓN]\n\n## 1. Parties\n\nThis Participation Agreement (the \"Agreement\") is entered into by:\n\n- **\"The Organizer\"**: {{ORGANIZADOR_RAZON_SOCIAL}}, with address at {{ORGANIZADOR_DOMICILIO}}, tax ID {{ORGANIZADOR_RFC}}, represented by {{ORGANIZADOR_REPRESENTANTE}}.\n- **\"The Participant\"**: {{PARTICIPANTE_NOMBRE}}, with address at {{PARTICIPANTE_DOMICILIO}}, official ID {{PARTICIPANTE_ID}}, email {{PARTICIPANTE_EMAIL}}.\n\n## 2. Purpose\n\nThe Organizer shall provide the Participant with services corresponding to the \"{{NOMBRE_PROGRAMA}}\" program (the \"Retreat\"), to be held from {{FECHA_INICIO}} through {{FECHA_FIN}}, at {{VENUE}}.\n\nThe Retreat includes: lodging, meals per published menu, session facilitation, materials and activities described in the itinerary attached as Annex A.\n\n## 3. Investment and Payment\n\nThe total investment is **{{INVERSION_MXN}} MXN** (plus VAT where applicable), payable as follows:\n\n- Deposit: {{ANTICIPO_MXN}} upon signing.\n- Balance: {{SALDO_MXN}} no later than {{FECHA_SALDO}}.\n\nPayments shall be wired to account {{CUENTA_BANCARIA}}. Tax receipts will be issued per the Participant's billing information.\n\n## 4. Cancellations and Refunds\n\n- Cancellation more than {{DIAS_CANCELACION_TOTAL}} days before {{FECHA_INICIO}}: {{PORCENTAJE_REEMBOLSO_TOTAL}}% refund.\n- Cancellation between {{DIAS_CANCELACION_PARCIAL}} and {{DIAS_CANCELACION_TOTAL}} days prior: {{PORCENTAJE_REEMBOLSO_PARCIAL}}% refund.\n- Cancellation with less than {{DIAS_CANCELACION_PARCIAL}} days notice or no-show: no refund.\n\nIn the event of force majeure declared by the Organizer, a future-date rescheduling will be offered per the current policy.\n\n## 5. Participant Obligations\n\nThe Participant agrees to: (i) arrive on time at {{VENUE}}; (ii) abide by internal rules; (iii) respect facilitators and other attendees; (iv) truthfully disclose health status through the attached medical form.\n\n## 6. Confidentiality\n\nThe Participant acknowledges that during the Retreat they may access information, practices and experiences of other participants. They agree to maintain confidentiality per the separately signed NDA.\n\n## 7. Health and Risks\n\nParticipation involves risks inherent to physical, emotional and immersive activities. The Participant shall sign the corresponding Release of Liability separately.\n\n## 8. Intellectual Property\n\nAll material, methodology, brand and content of the Retreat is the exclusive property of the Organizer and may not be reproduced without written authorization.\n\n## 9. Governing Law and Jurisdiction\n\nThis Agreement is governed by the laws of {{LEY_APLICABLE}}. Any disputes shall be submitted to the competent courts of {{CIUDAD_JURISDICCION}}, waiving any other jurisdiction.\n\n## 10. Signatures\n\nRead and accepted in {{CIUDAD_FIRMA}}, on {{FECHA_FIRMA}}.\n\n_________________________  \n{{PARTICIPANTE_NOMBRE}}  \nThe Participant\n\n_________________________  \n{{ORGANIZADOR_REPRESENTANTE}}  \nThe Organizer",
    "placeholderFields": [
      "{{ORGANIZADOR_RAZON_SOCIAL}}",
      "{{ORGANIZADOR_DOMICILIO}}",
      "{{ORGANIZADOR_RFC}}",
      "{{ORGANIZADOR_REPRESENTANTE}}",
      "{{PARTICIPANTE_NOMBRE}}",
      "{{PARTICIPANTE_DOMICILIO}}",
      "{{PARTICIPANTE_ID}}",
      "{{PARTICIPANTE_EMAIL}}",
      "{{NOMBRE_PROGRAMA}}",
      "{{FECHA_INICIO}}",
      "{{FECHA_FIN}}",
      "{{VENUE}}",
      "{{INVERSION_MXN}}",
      "{{ANTICIPO_MXN}}",
      "{{SALDO_MXN}}",
      "{{FECHA_SALDO}}",
      "{{CUENTA_BANCARIA}}",
      "{{DIAS_CANCELACION_TOTAL}}",
      "{{DIAS_CANCELACION_PARCIAL}}",
      "{{PORCENTAJE_REEMBOLSO_TOTAL}}",
      "{{PORCENTAJE_REEMBOLSO_PARCIAL}}",
      "{{LEY_APLICABLE}}",
      "{{CIUDAD_JURISDICCION}}",
      "{{CIUDAD_FIRMA}}",
      "{{FECHA_FIRMA}}"
    ]
  },
  {
    "slug": "nda",
    "titleEs": "Acuerdo de Confidencialidad (NDA) — Elements Method",
    "titleEn": "Non-Disclosure Agreement (NDA) — Elements Method",
    "summaryEs": "Acuerdo de confidencialidad que protege la metodología, materiales y experiencias compartidas durante los retiros y programas de Elements Method.",
    "summaryEn": "Confidentiality agreement protecting the methodology, materials and shared experiences during Elements Method retreats and programs.",
    "bodyEs": "> ⚠ [DOCUMENTO BORRADOR — PENDIENTE REVISIÓN LEGAL · NO USAR EN PRODUCCIÓN]\n\n## 1. Partes\n\nEl presente Acuerdo de Confidencialidad (en adelante, el \"NDA\") se celebra entre:\n\n- **\"El Divulgador\"**: {{ORGANIZADOR_RAZON_SOCIAL}}, representado por {{ORGANIZADOR_REPRESENTANTE}}.\n- **\"El Receptor\"**: {{PARTICIPANTE_NOMBRE}}, con correo {{PARTICIPANTE_EMAIL}}.\n\n## 2. Objeto\n\nEl Receptor participará en el programa \"{{NOMBRE_PROGRAMA}}\" del {{FECHA_INICIO}} al {{FECHA_FIN}} en {{VENUE}}. Durante dicha participación tendrá acceso a información confidencial cuya divulgación se regula por este NDA.\n\n## 3. Definición de Información Confidencial\n\nSe considera Información Confidencial, de manera enunciativa mas no limitativa:\n\n- La metodología, marcos conceptuales y secuencias de prácticas de Elements Method.\n- Materiales escritos, audiovisuales, manuales y cuadernillos entregados.\n- Identidad, testimonios, procesos personales y vivencias de otros participantes.\n- Información comercial, financiera, de proveedores y de alianzas del Divulgador.\n- Cualquier información marcada como \"confidencial\" o que por su naturaleza deba entenderse como tal.\n\n## 4. Obligaciones del Receptor\n\nEl Receptor se obliga a:\n\n1. No divulgar, publicar ni reproducir la Información Confidencial por ningún medio (incluyendo redes sociales, podcasts, libros o ponencias) sin autorización previa por escrito del Divulgador.\n2. No utilizar la Información Confidencial para fines distintos a su crecimiento personal en el contexto del Retiro.\n3. No replicar, enseñar ni comercializar la metodología, ejercicios o materiales recibidos.\n4. Mantener absoluta reserva sobre los procesos y testimonios de otros participantes, incluso después de finalizado el Retiro.\n\n## 5. Excepciones\n\nNo se considerará violación a este NDA la divulgación que: (i) sea de dominio público sin culpa del Receptor; (ii) sea requerida por autoridad competente, previo aviso al Divulgador siempre que la ley lo permita.\n\n## 6. Vigencia\n\nLas obligaciones de confidencialidad permanecerán vigentes por un plazo de {{PLAZO_VIGENCIA_ANIOS}} años contados a partir del {{FECHA_RETIRO}}, y se mantendrán indefinidamente respecto de información personal de otros participantes.\n\n## 7. Penalidad y Daños\n\nEl incumplimiento de este NDA dará derecho al Divulgador a reclamar daños y perjuicios, así como una pena convencional de **{{PENA_CONVENCIONAL_MXN}} MXN** sin perjuicio de las acciones civiles o penales que correspondan.\n\n## 8. Propiedad Intelectual\n\nNada en este NDA otorga al Receptor licencia, cesión o derecho alguno sobre la propiedad intelectual del Divulgador.\n\n## 9. Ley Aplicable y Jurisdicción\n\nEste NDA se rige por las leyes de {{LEY_APLICABLE}}. Las partes se someten a los tribunales de {{CIUDAD_JURISDICCION}} para resolver cualquier controversia.\n\n## 10. Firmas\n\nFirmado en {{CIUDAD_FIRMA}}, a {{FECHA_FIRMA}}.\n\n_________________________  \n{{PARTICIPANTE_NOMBRE}}  \nEl Receptor\n\n_________________________  \n{{ORGANIZADOR_REPRESENTANTE}}  \nEl Divulgador",
    "bodyEn": "> ⚠ [DOCUMENTO BORRADOR — PENDIENTE REVISIÓN LEGAL · NO USAR EN PRODUCCIÓN]\n\n## 1. Parties\n\nThis Non-Disclosure Agreement (the \"NDA\") is entered into by:\n\n- **\"The Disclosing Party\"**: {{ORGANIZADOR_RAZON_SOCIAL}}, represented by {{ORGANIZADOR_REPRESENTANTE}}.\n- **\"The Receiving Party\"**: {{PARTICIPANTE_NOMBRE}}, email {{PARTICIPANTE_EMAIL}}.\n\n## 2. Purpose\n\nThe Receiving Party will participate in the \"{{NOMBRE_PROGRAMA}}\" program from {{FECHA_INICIO}} through {{FECHA_FIN}} at {{VENUE}}. During such participation they will access confidential information governed by this NDA.\n\n## 3. Definition of Confidential Information\n\nConfidential Information includes, without limitation:\n\n- The Elements Method methodology, conceptual frameworks and practice sequences.\n- Written and audiovisual materials, manuals and workbooks provided.\n- Identity, testimonies, personal processes and experiences of other participants.\n- Commercial, financial, supplier and partnership information of the Disclosing Party.\n- Any information marked as \"confidential\" or which by its nature should be understood as such.\n\n## 4. Receiving Party Obligations\n\nThe Receiving Party agrees to:\n\n1. Not disclose, publish or reproduce the Confidential Information by any means (including social media, podcasts, books or talks) without prior written consent.\n2. Not use the Confidential Information for purposes other than their personal growth in the Retreat context.\n3. Not replicate, teach or commercialize the methodology, exercises or materials received.\n4. Maintain strict confidentiality about the processes and testimonies of other participants, even after the Retreat ends.\n\n## 5. Exceptions\n\nThis NDA does not apply to disclosures that: (i) are public domain through no fault of the Receiving Party; (ii) are required by competent authority, with prior notice to the Disclosing Party where legally permissible.\n\n## 6. Term\n\nConfidentiality obligations shall remain in force for {{PLAZO_VIGENCIA_ANIOS}} years from {{FECHA_RETIRO}}, and indefinitely with respect to other participants' personal information.\n\n## 7. Penalty and Damages\n\nBreach of this NDA entitles the Disclosing Party to claim damages plus a contractual penalty of **{{PENA_CONVENCIONAL_MXN}} MXN**, without prejudice to applicable civil or criminal actions.\n\n## 8. Intellectual Property\n\nNothing in this NDA grants the Receiving Party any license, assignment or right over the Disclosing Party's intellectual property.\n\n## 9. Governing Law and Jurisdiction\n\nThis NDA is governed by the laws of {{LEY_APLICABLE}}. The parties submit to the courts of {{CIUDAD_JURISDICCION}} for any controversy.\n\n## 10. Signatures\n\nSigned in {{CIUDAD_FIRMA}}, on {{FECHA_FIRMA}}.\n\n_________________________  \n{{PARTICIPANTE_NOMBRE}}  \nThe Receiving Party\n\n_________________________  \n{{ORGANIZADOR_REPRESENTANTE}}  \nThe Disclosing Party",
    "placeholderFields": [
      "{{ORGANIZADOR_RAZON_SOCIAL}}",
      "{{ORGANIZADOR_REPRESENTANTE}}",
      "{{PARTICIPANTE_NOMBRE}}",
      "{{PARTICIPANTE_EMAIL}}",
      "{{NOMBRE_PROGRAMA}}",
      "{{FECHA_INICIO}}",
      "{{FECHA_FIN}}",
      "{{VENUE}}",
      "{{PLAZO_VIGENCIA_ANIOS}}",
      "{{FECHA_RETIRO}}",
      "{{PENA_CONVENCIONAL_MXN}}",
      "{{LEY_APLICABLE}}",
      "{{CIUDAD_JURISDICCION}}",
      "{{CIUDAD_FIRMA}}",
      "{{FECHA_FIRMA}}"
    ]
  },
  {
    "slug": "relevo",
    "titleEs": "Relevo y Deslinde de Responsabilidades — Elements Method",
    "titleEn": "Release and Waiver of Liability — Elements Method",
    "summaryEs": "Documento mediante el cual el participante reconoce los riesgos inherentes al retiro y libera al Organizador de responsabilidad por eventos derivados de su participación voluntaria.",
    "summaryEn": "Document by which the participant acknowledges the risks inherent to the retreat and releases the Organizer from liability arising from their voluntary participation.",
    "bodyEs": "> ⚠ [DOCUMENTO BORRADOR — PENDIENTE REVISIÓN LEGAL · NO USAR EN PRODUCCIÓN]\n\n## 1. Partes\n\nEl presente Relevo y Deslinde de Responsabilidades (en adelante, el \"Relevo\") es otorgado por:\n\n- **\"El Participante\"**: {{PARTICIPANTE_NOMBRE}}, mayor de edad, identificación oficial {{PARTICIPANTE_ID}}, correo {{PARTICIPANTE_EMAIL}}, contacto de emergencia {{CONTACTO_EMERGENCIA}}.\n\nA favor de:\n\n- **\"El Organizador\"**: {{ORGANIZADOR_RAZON_SOCIAL}}, representado por {{ORGANIZADOR_REPRESENTANTE}}, así como sus facilitadores, colaboradores, proveedores y aliados.\n\n## 2. Objeto\n\nEl Participante se inscribe voluntariamente al programa \"{{NOMBRE_PROGRAMA}}\" del {{FECHA_INICIO}} al {{FECHA_FIN}} en {{VENUE}} (la \"Actividad\").\n\n## 3. Naturaleza Voluntaria\n\nEl Participante declara que su asistencia es totalmente voluntaria, que no se encuentra bajo coacción y que ha tenido oportunidad de revisar el itinerario, prácticas y reglamento del Retiro.\n\n## 4. Reconocimiento de Riesgos\n\nEl Participante reconoce que la Actividad incluye, entre otros, los siguientes riesgos:\n\n- Físicos: caminatas, ejercicios de respiración, exposición a temperatura, ayunos parciales, prácticas corporales.\n- Emocionales y psicológicos: trabajo de introspección, liberación emocional, contacto con experiencias personales sensibles.\n- Ambientales: traslado a {{VENUE}}, fauna local, condiciones climáticas, altitud.\n- Riesgos derivados de su propia condición médica o psicológica previa.\n\nEl Participante asume estos riesgos con pleno conocimiento.\n\n## 5. Declaración de Salud\n\nEl Participante declara bajo protesta de decir verdad que:\n\n1. Ha respondido con veracidad el cuestionario médico entregado al Organizador.\n2. No padece condiciones médicas o psicológicas no declaradas que contraindiquen su participación.\n3. Se compromete a informar al Organizador cualquier cambio en su estado de salud antes y durante la Actividad.\n4. Cuenta con seguro médico vigente: {{SEGURO_MEDICO}}.\n\n## 6. Deslinde de Responsabilidades\n\nEn la medida máxima permitida por la legislación aplicable, el Participante libera al Organizador, sus representantes, facilitadores y proveedores de toda responsabilidad civil, penal o administrativa por daños, lesiones, accidentes, pérdidas o afectaciones derivadas de su participación, salvo aquellos casos en que medie dolo o negligencia grave directamente imputable al Organizador.\n\n## 7. Atención de Emergencias\n\nEl Participante autoriza al Organizador a tomar medidas razonables de atención médica de emergencia en su nombre, incluyendo traslado a {{HOSPITAL_REFERENCIA}}, asumiendo los costos asociados.\n\n## 8. Conducta y Sustancias\n\nEl Participante se obliga a no introducir ni consumir sustancias prohibidas durante la Actividad. El incumplimiento es causa de expulsión inmediata sin reembolso.\n\n## 9. Uso de Imagen\n\nEl Participante {{AUTORIZA_O_NO_IMAGEN}} el uso de su imagen para fines de difusión del Organizador, conforme al Aviso de Privacidad.\n\n## 10. Ley Aplicable y Firmas\n\nEste Relevo se rige por las leyes de {{LEY_APLICABLE}}, con jurisdicción en {{CIUDAD_JURISDICCION}}.\n\nFirmado en {{CIUDAD_FIRMA}}, a {{FECHA_FIRMA}}.\n\n_________________________  \n{{PARTICIPANTE_NOMBRE}}  \nEl Participante\n\n_________________________  \nTestigo: {{TESTIGO_NOMBRE}}",
    "bodyEn": "> ⚠ [DOCUMENTO BORRADOR — PENDIENTE REVISIÓN LEGAL · NO USAR EN PRODUCCIÓN]\n\n## 1. Parties\n\nThis Release and Waiver of Liability (the \"Release\") is granted by:\n\n- **\"The Participant\"**: {{PARTICIPANTE_NOMBRE}}, of legal age, official ID {{PARTICIPANTE_ID}}, email {{PARTICIPANTE_EMAIL}}, emergency contact {{CONTACTO_EMERGENCIA}}.\n\nIn favor of:\n\n- **\"The Organizer\"**: {{ORGANIZADOR_RAZON_SOCIAL}}, represented by {{ORGANIZADOR_REPRESENTANTE}}, along with its facilitators, collaborators, suppliers and partners.\n\n## 2. Purpose\n\nThe Participant voluntarily enrolls in the \"{{NOMBRE_PROGRAMA}}\" program from {{FECHA_INICIO}} through {{FECHA_FIN}} at {{VENUE}} (the \"Activity\").\n\n## 3. Voluntary Nature\n\nThe Participant declares that attendance is entirely voluntary, free from coercion, and that they have had the opportunity to review the itinerary, practices and Retreat rules.\n\n## 4. Acknowledgment of Risks\n\nThe Participant acknowledges that the Activity includes, among others, the following risks:\n\n- Physical: hikes, breathwork, temperature exposure, partial fasting, embodiment practices.\n- Emotional and psychological: introspection work, emotional release, contact with sensitive personal experiences.\n- Environmental: travel to {{VENUE}}, local wildlife, weather conditions, altitude.\n- Risks arising from the Participant's own pre-existing medical or psychological condition.\n\nThe Participant knowingly assumes these risks.\n\n## 5. Health Declaration\n\nThe Participant declares under oath that:\n\n1. They have truthfully completed the medical questionnaire delivered to the Organizer.\n2. They have no undisclosed medical or psychological conditions that contraindicate participation.\n3. They will inform the Organizer of any change in their health status before and during the Activity.\n4. They hold valid medical insurance: {{SEGURO_MEDICO}}.\n\n## 6. Release of Liability\n\nTo the maximum extent permitted by applicable law, the Participant releases the Organizer, its representatives, facilitators and suppliers from any civil, criminal or administrative liability for damages, injuries, accidents, losses or harm arising from participation, except for cases of willful misconduct or gross negligence directly attributable to the Organizer.\n\n## 7. Emergency Care\n\nThe Participant authorizes the Organizer to take reasonable emergency medical actions on their behalf, including transfer to {{HOSPITAL_REFERENCIA}}, assuming associated costs.\n\n## 8. Conduct and Substances\n\nThe Participant agrees not to bring or consume prohibited substances during the Activity. Breach results in immediate expulsion without refund.\n\n## 9. Image Use\n\nThe Participant {{AUTORIZA_O_NO_IMAGEN}} the use of their image for the Organizer's promotional purposes, subject to the Privacy Notice.\n\n## 10. Governing Law and Signatures\n\nThis Release is governed by the laws of {{LEY_APLICABLE}}, with jurisdiction in {{CIUDAD_JURISDICCION}}.\n\nSigned in {{CIUDAD_FIRMA}}, on {{FECHA_FIRMA}}.\n\n_________________________  \n{{PARTICIPANTE_NOMBRE}}  \nThe Participant\n\n_________________________  \nWitness: {{TESTIGO_NOMBRE}}",
    "placeholderFields": [
      "{{PARTICIPANTE_NOMBRE}}",
      "{{PARTICIPANTE_ID}}",
      "{{PARTICIPANTE_EMAIL}}",
      "{{CONTACTO_EMERGENCIA}}",
      "{{ORGANIZADOR_RAZON_SOCIAL}}",
      "{{ORGANIZADOR_REPRESENTANTE}}",
      "{{NOMBRE_PROGRAMA}}",
      "{{FECHA_INICIO}}",
      "{{FECHA_FIN}}",
      "{{VENUE}}",
      "{{SEGURO_MEDICO}}",
      "{{HOSPITAL_REFERENCIA}}",
      "{{AUTORIZA_O_NO_IMAGEN}}",
      "{{LEY_APLICABLE}}",
      "{{CIUDAD_JURISDICCION}}",
      "{{CIUDAD_FIRMA}}",
      "{{FECHA_FIRMA}}",
      "{{TESTIGO_NOMBRE}}"
    ]
  }
];

export const findLegalDoc = (slug: string) => legalDocs.find((d) => d.slug === slug);


// ────────────────────────────────────────────────────────────────────────────
// ITINERARY — sample 3-day immersion schedule
// ────────────────────────────────────────────────────────────────────────────

export type PhaseKey = "liberacion" | "encuentro" | "metodologia" | "reflexion" | "dialogo" | "integracion";

export interface ItineraryBlock {
  time: string;
  titleEs: string;
  titleEn: string;
  bodyEs: string;
  bodyEn: string;
  phaseKey: PhaseKey;
  elementKey: ElementKey;
}

export interface ItineraryDay {
  dayNumber: number;
  dayLabelEs: string;
  dayLabelEn: string;
  themeEs: string;
  themeEn: string;
  blocks: ItineraryBlock[];
}

export const sampleItinerary: ItineraryDay[] = [
  {
    "dayNumber": 1,
    "dayLabelEs": "Jueves · Día 01 — Aterrizaje y descenso",
    "dayLabelEn": "Thursday · Day 01 — Landing and descent",
    "themeEs": "El cuerpo cruza el umbral, suelta la ciudad y reconoce que ya pertenece al territorio.",
    "themeEn": "The body crosses the threshold, lets go of the city, and recognizes it already belongs to the land.",
    "blocks": [
      {
        "time": "14:00 – 16:00",
        "titleEs": "Llegada y entrega de dispositivos",
        "titleEn": "Arrival and device handover",
        "bodyEs": "Recepción en el portal del retiro: depósito voluntario de teléfonos y relojes, té de bienvenida y asignación de cabaña. Cada participante recibe el cuaderno de campo y la piedra de anclaje que lo acompañará los tres días.",
        "bodyEn": "Reception at the retreat portal: voluntary handover of phones and watches, welcome tea, and cabin assignment. Each participant receives the field notebook and the anchor stone that will accompany them for three days.",
        "phaseKey": "liberacion",
        "elementKey": "tierra"
      },
      {
        "time": "16:30 – 17:45",
        "titleEs": "El Contacto con las Raíces",
        "titleEn": "Contact with the Roots",
        "bodyEs": "Caminata descalza guiada por el sendero del bosque. Reconocimiento sensorial del suelo, los árboles y la respiración corta de quien recién llega. Cierre con un gesto de soltar lo que se trajo de afuera.",
        "bodyEn": "Barefoot walk guided through the forest path. Sensory recognition of the soil, the trees, and the shallow breath of one who has just arrived. Closing with a gesture of releasing what was brought from the outside.",
        "phaseKey": "liberacion",
        "elementKey": "tierra"
      },
      {
        "time": "18:00 – 19:00",
        "titleEs": "Círculo de apertura: los nombres y el territorio",
        "titleEn": "Opening circle: names and territory",
        "bodyEs": "Encuentro inaugural alrededor del fogón menor. Cada persona ofrece su nombre, el lugar del que viene y una sola palabra para lo que necesita soltar. Los facilitadores nombran el pacto del retiro y las seis fases del Protocolo de Desconexión.",
        "bodyEn": "Inaugural gathering around the small hearth. Each person offers their name, the place they come from, and a single word for what they need to release. Facilitators name the retreat pact and the six phases of the Disconnection Protocol.",
        "phaseKey": "encuentro",
        "elementKey": "tierra"
      },
      {
        "time": "19:30 – 21:00",
        "titleEs": "Cena de la tierra compartida",
        "titleEn": "Shared earth supper",
        "bodyEs": "Cena comunal de raíces, granos y caldos de la región, servida en mesa larga. Se come en silencio durante los primeros veinte minutos para que el cuerpo registre el cambio de ritmo; después se abre la conversación a la mesa.",
        "bodyEn": "Communal supper of roots, grains, and regional broths, served at a long table. The first twenty minutes are eaten in silence so the body can register the change of pace; afterward conversation opens at the table.",
        "phaseKey": "encuentro",
        "elementKey": "tierra"
      },
      {
        "time": "21:15 – 22:00",
        "titleEs": "Lectura del cuerpo y bitácora del descenso",
        "titleEn": "Body reading and descent log",
        "bodyEs": "Práctica suave de respiración en el suelo y escritura corta en el cuaderno: tres líneas sobre lo que pesa y tres líneas sobre lo que ya empieza a aflojarse. Recordatorio del silencio nocturno hasta el desayuno.",
        "bodyEn": "Gentle floor breathing practice and a short notebook entry: three lines on what feels heavy and three lines on what is beginning to loosen. Reminder of nighttime silence until breakfast.",
        "phaseKey": "encuentro",
        "elementKey": "tierra"
      },
      {
        "time": "22:00 – 06:30",
        "titleEs": "Descanso en silencio",
        "titleEn": "Rest in silence",
        "bodyEs": "Noche en silencio total, sin pantallas ni lecturas externas. Se invita a dormir temprano para llegar al fuego del día siguiente con el cuerpo asentado en la tierra.",
        "bodyEn": "Full-silence night, without screens or outside reading. Participants are invited to sleep early so they arrive at the next day's fire with the body settled in the earth.",
        "phaseKey": "encuentro",
        "elementKey": "tierra"
      }
    ]
  },
  {
    "dayNumber": 2,
    "dayLabelEs": "Viernes · Día 02 — Fuego, método y espejo",
    "dayLabelEn": "Friday · Day 02 — Fire, method, and mirror",
    "themeEs": "La metodología se enciende: el fuego pone nombre a los patrones y la reflexión los devuelve al cuerpo.",
    "themeEn": "The methodology ignites: fire names the patterns and reflection returns them to the body.",
    "blocks": [
      {
        "time": "06:30 – 07:30",
        "titleEs": "Despertar con brasas",
        "titleEn": "Awakening with embers",
        "bodyEs": "Práctica de cuerpo al amanecer junto al fogón principal. Movimiento articular, respiración de fuego suave y encendido ritual de la brasa que permanecerá viva hasta la noche.",
        "bodyEn": "Sunrise body practice beside the main hearth. Joint mobilization, gentle fire breath, and ritual lighting of the ember that will stay alive until nightfall.",
        "phaseKey": "metodologia",
        "elementKey": "fuego"
      },
      {
        "time": "08:00 – 09:00",
        "titleEs": "Desayuno y apertura del día",
        "titleEn": "Breakfast and opening of the day",
        "bodyEs": "Desayuno comunal con frutas, semillas y bebidas calientes. Breve indicación del facilitador sobre el arco del día: entrar en la metodología por la mañana y atravesar la reflexión por la tarde.",
        "bodyEn": "Communal breakfast with fruit, seeds, and hot drinks. A brief facilitator note on the day's arc: enter the methodology in the morning and traverse the reflection in the afternoon.",
        "phaseKey": "metodologia",
        "elementKey": "fuego"
      },
      {
        "time": "09:30 – 12:30",
        "titleEs": "El Consejo del Fuego",
        "titleEn": "The Council of Fire",
        "bodyEs": "Sesión central de metodología. Se trabaja en círculo alrededor del fuego con los mapas del método: identificación de los patrones que queman, distinción entre combustible útil y residuo, y trazado de la primera decisión a tomar al regreso.",
        "bodyEn": "Core methodology session. Work happens in a circle around the fire with the method's maps: identifying patterns that burn, distinguishing useful fuel from residue, and sketching the first decision to make upon return.",
        "phaseKey": "metodologia",
        "elementKey": "fuego"
      },
      {
        "time": "13:00 – 14:30",
        "titleEs": "Comida y descanso bajo techo",
        "titleEn": "Midday meal and rest under cover",
        "bodyEs": "Comida ligera y siesta corta. Espacio sin agenda para permitir que el material del Consejo decante en el cuerpo antes de la práctica silenciosa.",
        "bodyEn": "Light meal and short nap. Unscheduled space so the Council's material can settle in the body before the silent practice.",
        "phaseKey": "metodologia",
        "elementKey": "fuego"
      },
      {
        "time": "15:00 – 17:00",
        "titleEs": "El Testigo del Río — práctica silenciosa",
        "titleEn": "The Witness of the River — silent practice",
        "bodyEs": "Caminata solitaria hasta el río con consigna de observación. Cada participante encuentra su piedra y permanece sentado, sin hablar, dejando que la corriente devuelva una imagen del patrón trabajado en la mañana.",
        "bodyEn": "Solo walk to the river with an observation prompt. Each participant finds their stone and sits in silence, letting the current return an image of the pattern worked on in the morning.",
        "phaseKey": "reflexion",
        "elementKey": "fuego"
      },
      {
        "time": "17:30 – 19:00",
        "titleEs": "Bitácora del fuego y espejo en parejas",
        "titleEn": "Fire log and partner mirror",
        "bodyEs": "Regreso a la sala. Escritura extendida en el cuaderno y, después, ejercicio en parejas: uno habla cinco minutos, el otro solo escucha y devuelve una frase espejo. Se intercambia y se cierra en silencio.",
        "bodyEn": "Return to the hall. Extended notebook writing followed by a partner exercise: one speaks for five minutes, the other only listens and returns a single mirror sentence. Roles switch and the practice closes in silence.",
        "phaseKey": "reflexion",
        "elementKey": "fuego"
      },
      {
        "time": "19:30 – 21:00",
        "titleEs": "Cena junto al fogón",
        "titleEn": "Dinner by the hearth",
        "bodyEs": "Cena alrededor del fuego con conversación libre y atemperada. Se evita el tono de taller: la consigna es comer despacio y no devolver al grupo el material íntimo del día.",
        "bodyEn": "Dinner around the fire with free, tempered conversation. Workshop tone is avoided: the prompt is to eat slowly and not return the day's intimate material to the group.",
        "phaseKey": "reflexion",
        "elementKey": "fuego"
      },
      {
        "time": "21:15 – 22:15",
        "titleEs": "Vigilia corta y cierre del día",
        "titleEn": "Short vigil and closing of the day",
        "bodyEs": "Quince minutos de mirada al fuego sin palabras y cierre con una respiración compartida. Se invita a quien lo desee a quedarse hasta que la brasa baje, con la indicación de no llevarse el material a la cabaña.",
        "bodyEn": "Fifteen minutes of wordless gazing at the fire and closing with a shared breath. Those who wish may stay until the ember lowers, with the instruction not to carry the material back to the cabin.",
        "phaseKey": "reflexion",
        "elementKey": "fuego"
      }
    ]
  },
  {
    "dayNumber": 3,
    "dayLabelEs": "Sábado · Día 03 — Palabra, vínculo y regreso",
    "dayLabelEn": "Saturday · Day 03 — Word, bond, and return",
    "themeEs": "Lo trabajado se vuelve lenguaje compartido y se integra en una forma que puede sostenerse al volver a casa.",
    "themeEn": "What was worked becomes shared language and integrates into a form that can hold once back home.",
    "blocks": [
      {
        "time": "06:30 – 07:30",
        "titleEs": "Práctica de aire al amanecer",
        "titleEn": "Air practice at dawn",
        "bodyEs": "Sesión de respiración y voz al aire libre. Se trabaja la apertura del diafragma y la calidad del sonido antes de que el grupo entre en diálogo extendido.",
        "bodyEn": "Open-air breath and voice session. Diaphragm opening and sound quality are worked before the group enters extended dialogue.",
        "phaseKey": "dialogo",
        "elementKey": "eter"
      },
      {
        "time": "08:00 – 09:00",
        "titleEs": "Desayuno en mesa abierta",
        "titleEn": "Breakfast at the open table",
        "bodyEs": "Desayuno con conversación libre y sin facilitación. Es la primera comida en la que el silencio inicial se suspende: la palabra ya tiene sitio.",
        "bodyEn": "Breakfast with free, unfacilitated conversation. It is the first meal where the opening silence is suspended: the word now has a place.",
        "phaseKey": "dialogo",
        "elementKey": "eter"
      },
      {
        "time": "09:30 – 12:00",
        "titleEs": "La Verdad de 100 Palabras",
        "titleEn": "The Truth of 100 Words",
        "bodyEs": "Cada participante escribe en exactamente cien palabras lo que se lleva del retiro. Después, en círculo, cada uno lee su texto sin comentarios cruzados; el grupo solo sostiene la escucha.",
        "bodyEn": "Each participant writes, in exactly one hundred words, what they take from the retreat. Afterward, in a circle, everyone reads their text without cross-commentary; the group only holds the listening.",
        "phaseKey": "dialogo",
        "elementKey": "eter"
      },
      {
        "time": "12:30 – 14:00",
        "titleEs": "Comida de cierre",
        "titleEn": "Closing meal",
        "bodyEs": "Comida más amplia y festiva, preparada con los cocineros del retiro. Se permite el brindis con agua y se nombra públicamente la gratitud por la cocina y el territorio.",
        "bodyEn": "A larger, more festive meal prepared with the retreat's cooks. A water toast is allowed and gratitude for the kitchen and the territory is named aloud.",
        "phaseKey": "dialogo",
        "elementKey": "eter"
      },
      {
        "time": "14:30 – 16:30",
        "titleEs": "Mapa de integración personal",
        "titleEn": "Personal integration map",
        "bodyEs": "Trabajo guiado para traducir la Verdad de 100 Palabras en un mapa de regreso: tres decisiones concretas, dos prácticas diarias y un vínculo del grupo que se mantendrá vivo después del retiro.",
        "bodyEn": "Guided work to translate the Truth of 100 Words into a return map: three concrete decisions, two daily practices, and one bond from the group that will be kept alive after the retreat.",
        "phaseKey": "integracion",
        "elementKey": "eter"
      },
      {
        "time": "17:00 – 18:30",
        "titleEs": "Ceremonia de devolución de dispositivos",
        "titleEn": "Device-return ceremony",
        "bodyEs": "Se devuelven los teléfonos y relojes en círculo, uno a uno, con una sola pregunta: con qué cuerpo y con qué atención los recibes ahora. La piedra de anclaje queda en manos de cada participante.",
        "bodyEn": "Phones and watches are returned in a circle, one by one, with a single question: with what body and with what attention do you receive them now. The anchor stone stays with each participant.",
        "phaseKey": "integracion",
        "elementKey": "eter"
      },
      {
        "time": "19:00 – 20:30",
        "titleEs": "Cena ligera y palabra final",
        "titleEn": "Light dinner and final word",
        "bodyEs": "Cena breve y de cierre. Cada persona ofrece una sola frase para el grupo y los facilitadores nombran el seguimiento posterior al retiro y la red de acompañamiento.",
        "bodyEn": "Brief closing dinner. Each person offers a single sentence to the group and facilitators name the post-retreat follow-up and the accompaniment network.",
        "phaseKey": "integracion",
        "elementKey": "eter"
      },
      {
        "time": "20:45 – 22:00",
        "titleEs": "Salida del territorio",
        "titleEn": "Departure from the territory",
        "bodyEs": "Despedida en el portal del retiro. Quienes parten esa misma noche lo hacen acompañados; quienes se quedan a dormir tienen indicación de descanso temprano y salida silenciosa al amanecer.",
        "bodyEn": "Farewell at the retreat portal. Those leaving that same night are accompanied; those staying overnight are asked to rest early and depart in silence at dawn.",
        "phaseKey": "integracion",
        "elementKey": "eter"
      }
    ]
  }
];


// ────────────────────────────────────────────────────────────────────────────
// CONTACT — placeholder phone, WhatsApp, social handles
// ────────────────────────────────────────────────────────────────────────────

export interface ContactInfo {
  phoneDisplayMx: string;
  phoneE164: string;
  whatsappLink: string;
  addressLabelEs: string;
  addressLabelEn: string;
  socialHandles: { name: string; handle: string; url: string }[];
  isPlaceholder: boolean;
  placeholderFields: string[];
}

export const contactInfo: ContactInfo = {
  "phoneDisplayMx": "+52 55 0000 0000",
  "phoneE164": "+525500000000",
  "whatsappLink": "https://wa.me/525500000000?text=Hola%20Elements%20Method",
  "addressLabelEs": "Ciudad de México · México",
  "addressLabelEn": "Ciudad de México · México",
  "socialHandles": [
    {
      "name": "instagram",
      "handle": "@elementsmethod",
      "url": "https://www.instagram.com/elementsmethod"
    },
    {
      "name": "linkedin",
      "handle": "/company/elementsmethod",
      "url": "https://www.linkedin.com/company/elementsmethod"
    },
    {
      "name": "tiktok",
      "handle": "@elementsmethod",
      "url": "https://www.tiktok.com/@elementsmethod"
    }
  ],
  "isPlaceholder": true,
  "placeholderFields": [
    "phoneDisplayMx",
    "phoneE164",
    "whatsappLink",
    "addressLabelEs",
    "addressLabelEn",
    "socialHandles"
  ]
};
