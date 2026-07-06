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
  /** "The X Leadership Paradox" — verbatim from elements-method-presentation.docx. Null for Éter. */
  paradoxEs: string | null;
  paradoxEn: string | null;
  /** "Key Components of X Leadership" — 4 named components verbatim from presentation. Null for Éter. */
  components: { nameEs: string; nameEn: string; bodyEs: string; bodyEn: string }[] | null;
  /** Closing invitation question — verbatim from master doc media script for this element. Null for Éter. */
  invitationEs: string | null;
  invitationEn: string | null;
  /** Official brand colors from master doc. */
  accent: string;
  accentSoft: string;
  /** AAA-compliant dark variant of `accent` (≥7:1 on Lino). Use for any
   *  element-colored TEXT or small icon; `accent` is for fills/decoration. */
  accentInk: string;
  animClass: string;
}

export const elementImages: Record<ElementKey, string> = {
  agua: "/images/elements/agua.jpg",
  fuego: "/images/elements/fuego.jpg",
  aire: "/images/elements/aire.jpg",
  tierra: "/images/elements/tierra.jpg",
  eter: "/images/elements/elements_logo.jpeg",
};

/**
 * Framework-specific imagery (ROOTS / IGNITE / FLOW / CLEAR).
 * Sourced from /public/images/modules/{framework}.jpg
 */
export const frameworkImages: Record<ElementKey, string | null> = {
  tierra: "/images/modules/roots.jpg",
  fuego: "/images/modules/ignite.jpg",
  agua: "/images/modules/flow.jpg",
  aire: "/images/modules/clear.jpg",
  eter: null,
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
    paradoxEs:
      "Los líderes que más necesitan Tierra suelen ser los más capaces — y por lo tanto los más demandados. Se mueven constantemente entre exigencias, contextos y relaciones. Están en todas partes, lo que significa que no están en ninguna. La Tierra los invita a descubrir que la presencia — genuina, sin prisa, arraigada — es lo más raro y más poderoso que pueden ofrecer.",
    paradoxEn:
      "The leaders who most need Earth are often those who are most capable — and therefore most in demand. They move constantly between demands, contexts, and relationships. They are everywhere, which means they are nowhere. Earth invites them to discover that presence — genuine, unhurried, rooted presence — is the rarest and most powerful thing they can offer.",
    components: [
      {
        nameEs: "Confianza profunda",
        nameEn: "Deep Trust",
        bodyEs:
          "La confianza no se construye en momentos dramáticos. Se construye en la acumulación de diez mil pequeñas decisiones de ser consistente, honesto y confiable. El líder de Tierra entiende que siempre está haciendo un depósito o un retiro en la cuenta de confianza de cada relación — y elige depósitos, diaria y deliberadamente.",
        bodyEn:
          "Trust is not built in dramatic moments. It is built in the accumulation of ten thousand small choices to be consistent, honest, and reliable. Earth leaders understand that they are always making a deposit or a withdrawal in the trust account of every relationship — and they choose deposits, daily and deliberately.",
      },
      {
        nameEs: "Presencia encarnada",
        nameEn: "Embodied Presence",
        bodyEs:
          "El liderazgo de Tierra se siente antes de escucharse. El líder verdaderamente arraigado crea un campo de seguridad alrededor simplemente por estar presente — físicamente asentado, emocionalmente regulado, sin prisa. La gente sabe instintivamente si la persona con quien habla está realmente ahí. El líder de Tierra está ahí.",
        bodyEn:
          "Earth leadership is felt before it is heard. The leader who is truly grounded creates a field of safety around them simply by being present — physically settled, emotionally regulated, unhurried. People know instinctively whether the person they are speaking to is actually there. Earth leaders are there.",
      },
      {
        nameEs: "La función de sostener",
        nameEn: "The Holding Function",
        bodyEs:
          "En la ecología organizacional, el rol primario del líder durante períodos de cambio, incertidumbre o estrés no es resolver — es sostener. Sostener el espacio para que el equipo piense. Sostener la ansiedad para que otros sean productivos. Sostener la visión cuando otros no pueden verla. Esta es la función de Tierra: el líder como el suelo bajo los pies de otros.",
        bodyEn:
          "In organizational ecology, the leader's primary role during periods of change, uncertainty, or stress is not to solve — it is to hold. To hold the space for the team to think. To hold the anxiety so others can be productive. To hold the vision when others cannot see it. This is the Earth function: the leader as the ground beneath others' feet.",
      },
      {
        nameEs: "Honestidad radical con uno mismo",
        nameEn: "Radical Self-Honesty",
        bodyEs:
          "La Tierra no pretende. El suelo es lo que es — el resultado rico en nutrientes de todo lo que se descompuso antes. El líder de Tierra desarrolla la capacidad de honestidad inflexible sobre sus propios patrones, miedos, puntos ciegos y bordes de crecimiento. Esta auto-honestidad se vuelve el fundamento de su integridad — y la integridad es la única fuente verdadera de confianza duradera.",
        bodyEn:
          "Earth doesn't pretend. Soil is what it is — the nutrient-rich result of everything that has decomposed before. Earth leaders develop the capacity for unflinching honesty about their own patterns, fears, blindspots, and growing edges. This self-honesty becomes the foundation of their integrity — and integrity is the only true source of lasting trust.",
      },
    ],
    invitationEs: "¿Qué profundizaría tu liderazgo si tus raíces fueran más hondas?",
    invitationEn: "What would deepen your leadership if your roots were deeper?",
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
    paradoxEs:
      "Los líderes que más temen al Fuego son aquellos que cargan la pasión más reprimida. Han aprendido a gestionar su intensidad — a parecer mesurados, profesionales, contenidos. El Fuego los invita a reclamar lo que han estado gestionando: el calor que, cuando se canaliza con destreza, se convierte en la fuerza más poderosa para la transformación organizacional.",
    paradoxEn:
      "The leaders who most fear Fire are those who carry the most suppressed passion. They have learned to manage their intensity — to seem measured, professional, contained. Fire invites them to reclaim what they have been managing: the heat that, when channeled with skill, becomes the most powerful force for organizational transformation.",
    components: [
      {
        nameEs: "Visión — la llama que otros pueden ver",
        nameEn: "Vision — The Flame That Others Can See",
        bodyEs:
          "La visión en la tradición del Fuego no es un plan a cinco años. Es una llama viva — un sentido vívido y sentido de un futuro digno de crearse, que el líder carga en su cuerpo, no solo en su mente. Cuando hay visión genuina en un líder, la gente la siente. Cuando está ausente, también la sienten.",
        bodyEn:
          "Vision in the Fire tradition is not a five-year plan. It is a living flame — a vivid, felt sense of a future worth creating that the leader carries in their body, not just their mind. When genuine vision is present in a leader, people can feel it. When it is absent, they can feel that too.",
      },
      {
        nameEs: "Coraje — arder cuando cuesta algo",
        nameEn: "Courage — Burning When It Costs Something",
        bodyEs:
          "El coraje del Fuego no es imprudencia. Es la voluntad de actuar en alineación con los valores incluso cuando esa acción carga un riesgo real. El líder de Fuego dice las cosas difíciles en las reuniones. Hace los cambios que otros han evitado. Permanece en el calor.",
        bodyEn:
          "Fire courage is not recklessness. It is the willingness to act in alignment with values even when that action carries real risk. Fire leaders say the difficult things in meetings. They make the changes others have avoided. They stand in the heat.",
      },
      {
        nameEs: "Activación — encender fuegos en otros",
        nameEn: "Activation — Lighting Fires in Others",
        bodyEs:
          "La cualidad más importante del fuego es que es contagioso. Una sola llama puede encender mil otras sin disminuirse. El líder de Fuego entiende que su rol primario no es hacer el trabajo — es encender el fuego en aquellos que lo harán. La activación es el arte de conectar a las personas con su propio sentido de propósito.",
        bodyEn:
          "The most important quality of fire is that it is contagious. A single flame can light a thousand others without being diminished. Fire leaders understand that their primary role is not to do the work — it is to ignite the fire in those who will. Activation is the art of connecting people to their own sense of purpose.",
      },
      {
        nameEs: "Transformación — quemar lo que ya no sirve",
        nameEn: "Transformation — Burning What No Longer Serves",
        bodyEs:
          "El fuego es el gran renovador de la naturaleza. Los incendios forestales crean las condiciones para el nuevo crecimiento. El líder de Fuego está dispuesto a arder — a terminar lo que necesita terminar, a soltar lo que ya no sirve, y a confiar en que lo esencial sobrevivirá la transformación.",
        bodyEn:
          "Fire is nature's great renewer. Forest fires create the conditions for new growth. Fire leaders are willing to burn — to end what needs ending, to release what no longer serves, and to trust that what is essential will survive the transformation.",
      },
    ],
    invitationEs: "¿Cuál es el fuego que has mantenido demasiado pequeño?",
    invitationEn: "What is the fire you have been keeping too small?",
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
    paradoxEs:
      "Los líderes que más necesitan Agua suelen ser los que lideran con más fuerza. Confunden la rigidez con la fortaleza, y el control con la competencia. El Agua les enseña la lección más difícil: que el poder real emerge cuando se cede.",
    paradoxEn:
      "The leaders who most need Water are often those who lead with the most force. They mistake rigidity for strength, and control for competence. Water teaches them the more difficult lesson: that real power emerges from yielding.",
    components: [
      {
        nameEs: "Escucha profunda",
        nameEn: "Deep Listening",
        bodyEs:
          "La mayoría de los líderes escucha para responder. El líder de Agua escucha para entender — y a menudo, simplemente para recibir. La escucha profunda es la capacidad de estar plenamente presente con la experiencia de otra persona sin la necesidad de arreglar, aconsejar o redirigir.",
        bodyEn:
          "Most leaders listen to respond. Water leaders listen to understand — and often, to simply receive. Deep listening is the capacity to be fully present with another person's experience without the need to fix, advise, or redirect.",
      },
      {
        nameEs: "Claridad emocional",
        nameEn: "Emotional Clarity",
        bodyEs:
          "Como el agua, las emociones en movimiento son saludables. Las emociones que se suprimen, se desvían o se represan se vuelven destructivas. El liderazgo de Agua implica desarrollar una relación directa y honesta con la propia experiencia emocional — usándola como información en lugar de gestionándola hacia afuera.",
        bodyEn:
          "Like water, emotions in motion are healthy. Emotions that are suppressed, diverted, or dammed up become destructive. Water leadership involves developing a direct, honest relationship with one's emotional experience — using it as information rather than managing it away.",
      },
      {
        nameEs: "Flujo adaptativo",
        nameEn: "Adaptive Flow",
        bodyEs:
          "El agua nunca deja de moverse. Cuando se bloquea, encuentra otro camino. El líder de Agua desarrolla alta tolerancia a la ambigüedad y la flexibilidad creativa para navegar desafíos organizacionales complejos y no lineales sin recurrir al control rígido.",
        bodyEn:
          "Water never stops moving. When blocked, it finds another path. Water leaders develop high tolerance for ambiguity and the creative flexibility to navigate complex, non-linear organizational challenges without defaulting to rigid control.",
      },
      {
        nameEs: "Profundidad reflexiva",
        nameEn: "Reflective Depth",
        bodyEs:
          "El agua quieta muestra un reflejo claro. El líder con profundidad reflexiva tiene la capacidad de dar un paso atrás de la urgencia de la vida organizacional y verse a sí mismo, a sus equipos y sus situaciones con claridad y perspectiva.",
        bodyEn:
          "Still water shows a clear reflection. Leaders with reflective depth have the capacity to step back from the urgency of organizational life and see themselves, their teams, and their situations with clarity and perspective.",
      },
    ],
    invitationEs: "¿Dónde en tu liderazgo estás luchando contra la corriente?",
    invitationEn: "Where in your leadership are you fighting the current?",
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
    paradoxEs:
      "Los líderes que más necesitan Aire son a menudo aquellos con las habilidades de comunicación más sofisticadas en la superficie — y cuya comunicación, sin embargo, crea el menor entendimiento genuino. Son articulados pero no escuchados. Confiados pero sin conectar. El Aire los invita a descubrir que la comunicación real es menos sobre hablar y más sobre crear las condiciones para la verdad.",
    paradoxEn:
      "The leaders who most need Air are often those who have the most sophisticated communication skills on the surface — and yet whose communication creates the least genuine understanding. They are articulate but not heard. Confident but not connecting. Air invites them to discover that real communication is less about speaking and more about creating the conditions for truth.",
    components: [
      {
        nameEs: "Perspectiva sistémica",
        nameEn: "Systemic Perspective",
        bodyEs:
          "El líder de Aire sostiene la complejidad sin ser abrumado por ella. Entiende que los desafíos organizacionales raramente son resultado de fallas individuales — son patrones en sistemas. El liderazgo de Aire desarrolla la capacidad de ver sistemas enteros: mapear las dinámicas, entender la historia e intervenir en el punto de máxima palanca.",
        bodyEn:
          "Air leaders hold complexity without being overwhelmed by it. They understand that organizational challenges are rarely the result of individual failings — they are patterns in systems. Air leadership develops the capacity to see systems whole: to map the dynamics, understand the history, and intervene at the point of highest leverage.",
      },
      {
        nameEs: "Libertad y no-apego",
        nameEn: "Freedom & Non-Attachment",
        bodyEs:
          "El aire no se puede contener. El líder de Aire carga una cualidad de libertad psicológica — no está capturado por el estatus, por la necesidad de tener razón, ni por el apego a resultados particulares. Esta libertad le permite escuchar verdades difíciles, cambiar de opinión con gracia y liderar sin el peso del ego.",
        bodyEn:
          "Air cannot be contained. Air leaders carry a quality of psychological freedom — they are not captured by status, by the need to be right, or by attachment to particular outcomes. This freedom allows them to hear difficult truths, change their minds gracefully, and lead without the weight of ego.",
      },
      {
        nameEs: "El espacio entre las palabras",
        nameEn: "The Space Between Words",
        bodyEs:
          "El líder de Aire más poderoso entiende que lo que no dice es tan importante como lo que dice. Crea espacio — en conversaciones, en reuniones, en la cultura organizacional — para que otras voces sean escuchadas. Entiende que un líder que llena cada silencio es un líder que no tiene idea de lo que realmente sucede en su organización.",
        bodyEn:
          "The most powerful Air leaders understand that what they don't say is as important as what they do. They create space — in conversations, in meetings, in organizational culture — for others' voices to be heard. They understand that a leader who fills every silence is a leader who has no idea what is really happening in their organization.",
      },
      {
        nameEs: "Precisión de expresión",
        nameEn: "Precision of Expression",
        bodyEs:
          "El líder de Aire elige las palabras con cuidado. Sabe que el lenguaje da forma a la cultura — que las historias que un líder cuenta sobre las personas, los desafíos y la posibilidad, se vuelven la realidad que los rodea. Es arquitecto de significado.",
        bodyEn:
          "Air leaders choose words with care. They know that language shapes culture — that the stories a leader tells about people, about challenges, about possibility, become the reality those around them inhabit. They are architects of meaning.",
      },
    ],
    invitationEs: "¿Qué vería de tu liderazgo desde mayor altura?",
    invitationEn: "What would I see of your leadership from a greater altitude?",
    accent: "#7A9BAD",
    accentSoft: "#D2DCE4",
    accentInk: "#2E4754",
    animClass: "anim-air",
  },
  {
    key: "eter",
    nameEs: "Éter",
    nameEn: "Ether",
    framework: "ECOS",
    qualityEs: "Integración · Unidad · Trascendencia",
    qualityEn: "Integration · Unity · Transcendence",
    cultivaEs:
      "El Éter no es otro elemento en la secuencia — es el espacio que contiene a los otros cuatro. Representa su integración: el campo silencioso desde el que un líder sostiene, a la vez, fluidez, visión, perspectiva y arraigo.",
    cultivaEn:
      "Ether is not another element in the sequence — it is the space that contains the other four. It represents their integration: the silent field from which a leader can simultaneously hold fluidity, vision, perspective, and groundedness.",
    quoteEs: "El Éter siempre cierra. Nunca abre. La integración solo es posible tras encontrarse con cada elemento por separado.",
    quoteEn: "Ether always closes. Never opens. Integration is only possible after meeting each element separately.",
    natureEs:
      "Donde Agua, Fuego, Aire y Tierra representan fuerzas específicas del liderazgo, el Éter representa su integración. Es el campo silencioso donde el líder deja de elegir entre elementos y aprende a orquestarlos según lo que cada momento pide.",
    natureEn:
      "Where Water, Fire, Air, and Earth represent specific forces of leadership, Ether represents their integration. It is the silent field where the leader stops choosing between elements and learns to orchestrate them according to what each moment demands.",
    methodEs:
      "Framework ECOS — Espacio (el campo que contiene), Conciencia (presencia integradora), Orquestación (acceso fluido a los cuatro elementos), Silencio (la quietud desde donde se elige). El Éter siempre cierra el arco; nunca lo abre.",
    methodEn:
      "ECOS framework — Espacio (the containing field), Conciencia (integrating awareness), Orquestación (fluid access to all four elements), Silencio (the stillness one chooses from). Ether always closes the arc; it never opens it.",
    bodyEs:
      "AQAL · Ceremonia del Mandala de Liderazgo · Prácticas contemplativas integradas · Silencio extendido · Ritual de integración · Escaneo de los 4 elementos.",
    bodyEn:
      "AQAL · Leadership Mandala ceremony · Integrated contemplative practice · Extended silence · Integration ritual · The 4-Element Scan.",
    experienceEs: "Integración & Mandala de Liderazgo",
    experienceEn: "Integration & Leadership Mandala",
    paradoxEs: null,
    paradoxEn: null,
    components: null,
    invitationEs: "¿Sabes cuándo usar cada elemento — o solo conoces los cuatro por separado?",
    invitationEn: "Do you know when to use each element — or do you only know the four separately?",
    accent: "#6B5B95",
    accentSoft: "#D8D1E6",
    accentInk: "#423861",
    animClass: "anim-eter",
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

/**
 * Programs, ordered from longest to shortest duration (client request).
 * NOTE: route `slug`s are kept stable (raices/corriente/fuente/…) so existing
 * URLs, redirects and the [slug] detail page's conditionals keep working —
 * only the display names changed (Fluir / Momentum / Raíz / Brújula / Oneness).
 */
export const paths: PathInfo[] = [
  {
    slug: "raices",
    nameEs: "Fluir",
    nameEn: "Flow",
    tagEs: "El Camino · Grupal",
    tagEn: "The Journey · Group",
    headlineEs: "Sin prisa, pero sin pausa. La profundidad a su propio ritmo.",
    headlineEn: "No hurry, no pause. Depth at its own pace.",
    shortEs: "Programa de profundidad de 5 meses.",
    shortEn: "5-month depth program.",
    longEs:
      "Nuestro programa de mayor profundidad. Cada mes se dedica a un solo elemento — Agua, Fuego, Aire y Tierra en los primeros cuatro meses; el quinto cierra integrando todo el aprendizaje y las vivencias. Con una salida mensual donde se trabajan dos metodologías completas del elemento del mes. Como el agua que fluye a su propio ritmo, cada mes construye sobre el anterior de forma orgánica.",
    longEn:
      "Our deepest program. Each month is devoted to a single element — Water, Fire, Air and Earth across the first four months; the fifth closes by integrating all the learning and lived experience. One monthly outing works two complete methodologies of that month's element. Like water flowing at its own pace, each month builds organically on the one before.",
    includesEs: [
      "1 salida mensual de inmersión en naturaleza",
      "2 metodologías completas por elemento",
      "Entornos naturales seleccionados",
      "Recorrido por los 5 elementos — cierre con Éter",
      "Acceso a comunidad de práctica y coaches",
      "Acceso especial a programa de continuidad — 2 sesiones de coaching individual por mes durante 6 meses (costo adicional)",
    ],
    includesEn: [
      "1 monthly nature-immersion outing",
      "2 complete methodologies per element",
      "Curated natural environments",
      "Journey through all 5 elements — closing with Ether",
      "Access to community of practice and coaches",
      "Special access to continuation program — 2 individual coaching sessions per month for 6 months (additional cost)",
    ],
    modalityEs: "Grupal · hasta 15 participantes",
    modalityEn: "Group · up to 15 participants",
    durationEs: "5 meses",
    durationEn: "5 months",
    capacityEs: "Hasta 15 participantes",
    capacityEn: "Up to 15 participants",
    ctaEs: "Comenzar Fluir",
    ctaEn: "Begin Flow",
  },
  {
    slug: "corriente",
    nameEs: "Momentum",
    nameEn: "Momentum",
    tagEs: "Intensivo · Grupal",
    tagEn: "Intensive · Group",
    headlineEs: "La fuerza acumulada de un cuerpo en movimiento.",
    headlineEn: "The accumulated force of a body in motion.",
    shortEs: "Programa acelerado de 3 meses.",
    shortEn: "Accelerated 3-month program.",
    longEs:
      "Nuestro programa de mayor intensidad y velocidad: 3 meses con dos salidas mensuales, donde cada jornada cubre dos metodologías y dos experiencias en un solo día — el doble de densidad que cualquier otro programa grupal. El sexto y último encuentro se dedica enteramente a una metodología y a la integración de todo lo vivido. Pensado para quien enfrenta un momento crítico — una transición de rol, una ventana de 90 días donde el cambio debe ser visible y medible.",
    longEn:
      "Our most intense, fast-moving program: 3 months with two monthly outings, where each day covers two methodologies and two experiences — twice the density of any other group program. The sixth and final gathering is devoted entirely to one methodology and to integrating everything lived. For anyone facing a critical moment — a role transition, a 90-day window where change must be visible and measurable.",
    includesEs: [
      "2 salidas de inmersión por mes",
      "2 metodologías y 2 experiencias por jornada",
      "Entornos naturales seleccionados",
      "Recorrido por los 5 elementos — cierre con Éter",
      "Integración e implementación acelerada por elemento",
      "Acceso a comunidad de práctica y coaches",
      "Acceso especial a programa de continuidad — 2 sesiones de coaching por mes durante 6 meses (costo adicional)",
    ],
    includesEn: [
      "2 immersion outings per month",
      "2 methodologies and 2 experiences per day",
      "Curated natural environments",
      "Journey through all 5 elements — closing with Ether",
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
    ctaEs: "Comenzar Momentum",
    ctaEn: "Begin Momentum",
  },
  {
    slug: "fuente",
    nameEs: "Raíz",
    nameEn: "Root",
    tagEs: "Inmersión Total · Retiro 3 días",
    tagEn: "Full Immersion · 3-day Retreat",
    headlineEs: "La puerta de entrada. Los cinco elementos en un solo fin de semana.",
    headlineEn: "The gateway. All five elements in a single weekend.",
    shortEs: "Retiro de 3 días.",
    shortEn: "3-day retreat.",
    longEs:
      "La puerta de entrada al universo Elements Method: un retiro intensivo de 3 días donde cada jornada se dedica a un elemento, seguido de un cierre integrador en la mañana final. Selecciona la experiencia más potente y representativa de cada elemento, priorizando la vivencia completa del arco de los cuatro elementos. Ideal como primera experiencia, como retiro anual de equipo directivo, o como introducción antes de un programa de mayor duración.",
    longEn:
      "The gateway to the Elements Method universe: an intensive 3-day retreat where each day is devoted to one element, followed by an integrative close on the final morning. It selects the most powerful, representative experience of each element, prioritizing the full arc of the four elements. Ideal as a first experience, an annual leadership-team retreat, or an introduction before a longer program.",
    includesEs: [
      "Retiro de 3 días (jueves a sábado)",
      "4 inmersiones presenciales en naturaleza",
      "Recorrido por los 5 elementos — cierre con Éter",
      "Cierre integrador en la mañana final",
      "Entornos naturales seleccionados",
      "Acceso a comunidad de retiros ejecutivos",
    ],
    includesEn: [
      "3-day retreat (Thursday to Saturday)",
      "4 in-person nature immersions",
      "Journey through all 5 elements — closing with Ether",
      "Integrative close on the final morning",
      "Curated natural environments",
      "Access to executive retreats community",
    ],
    modalityEs: "Retiro grupal · hasta 15 participantes",
    modalityEn: "Group retreat · up to 15 participants",
    durationEs: "3 días",
    durationEn: "3 days",
    capacityEs: "Hasta 15 participantes",
    capacityEn: "Up to 15 participants",
    ctaEs: "Comenzar Raíz",
    ctaEn: "Begin Root",
  },
  {
    slug: "brujula",
    nameEs: "Brújula",
    nameEn: "Compass",
    tagEs: "Taller a la medida · 1 día",
    tagEn: "Custom Workshop · 1 day",
    headlineEs: "Un día para reencontrar tu norte.",
    headlineEn: "One day to find your north again.",
    shortEs: "Taller de un día hecho a la medida.",
    shortEn: "Custom one-day workshop.",
    longEs:
      "Un taller de un día diseñado a la medida del grupo o la organización. Concentra una experiencia inmersiva completa en una sola jornada: contacto con la naturaleza, una metodología central y un espacio de reflexión e integración. Ideal como primera aproximación al método, como activación de equipo o como jornada de reencuadre en un momento clave.",
    longEn:
      "A one-day workshop custom-designed for the group or organization. It concentrates a complete immersive experience into a single day: contact with nature, one core methodology, and space for reflection and integration. Ideal as a first taste of the method, a team activation, or a reset day at a pivotal moment.",
    includesEs: [
      "1 jornada completa de inmersión",
      "1 metodología central del método",
      "Contenido diseñado a la medida del grupo",
      "Entorno natural seleccionado",
      "Espacio de reflexión e integración",
    ],
    includesEn: [
      "1 full immersion day",
      "1 core methodology of the method",
      "Content tailored to the group",
      "Curated natural environment",
      "Space for reflection and integration",
    ],
    modalityEs: "Grupal a la medida · organización o equipo",
    modalityEn: "Custom group · organization or team",
    durationEs: "1 día",
    durationEn: "1 day",
    capacityEs: "A definir con el grupo",
    capacityEn: "Defined with the group",
    ctaEs: "Diseñar mi Brújula",
    ctaEn: "Design my Compass",
  },
  {
    slug: "soulfull",
    nameEs: "Oneness",
    nameEn: "Oneness",
    tagEs: "Inmersión Individual · Privado",
    tagEn: "Individual Immersion · Private",
    headlineEs: "Tu proceso, completamente tuyo.",
    headlineEn: "Your process, entirely your own.",
    shortEs: "Inmersión individual completamente personalizada.",
    shortEn: "Fully personalized individual immersion.",
    longEs:
      "Una inmersión individual, diseñada por completo alrededor de una sola persona y del resultado que busca. Cada inmersión, cada sesión de coaching y cada locación son exclusivamente para ti. Para quien prefiere crecer en un entorno privado o requiere confidencialidad absoluta — la máxima personalización del método.",
    longEn:
      "An individual immersion, designed entirely around one person and the result they seek. Every immersion, coaching session and location is exclusively for you. For those who prefer to grow in a private setting or need absolute confidentiality — the method at its most personalized.",
    includesEs: [
      "Programa completamente privado e individual",
      "Diseño a la medida del resultado que buscas",
      "Recorrido por los 5 elementos — cierre con Éter",
      "Coaching individual con coach senior",
      "Locaciones curadas para tu proceso",
      "Confidencialidad absoluta",
    ],
    includesEn: [
      "Fully private, individual program",
      "Designed around the result you seek",
      "Journey through all 5 elements — closing with Ether",
      "Individual coaching with a senior coach",
      "Curated locations for your process",
      "Absolute confidentiality",
    ],
    modalityEs: "Individual · privado",
    modalityEn: "Individual · private",
    durationEs: "A la medida",
    durationEn: "Custom",
    capacityEs: "1 persona",
    capacityEn: "1 person",
    ctaEs: "Comenzar Oneness",
    ctaEn: "Begin Oneness",
  },
];

/**
 * Origin — Custom-built retreats for organizations.
 * Mentioned in pptx slide 5 footer as a fourth offering.
 */
export const originProgram = {
  nameEs: "Origin",
  nameEn: "Origin",
  tagEs: "Retiros corporativos hechos a la medida",
  tagEn: "Custom-built corporate retreats",
  bodyEs:
    "Elements Method ofrece programas organizacionales hechos a la medida, diseñados alrededor de inmersiones de equipo, desarrollo de cultura de liderazgo y transformación organizacional. Un programa puede llevar a un equipo directivo completo a través del marco de los Cuatro Elementos, creando lenguaje compartido, confianza profundizada y cultura organizacional alineada.",
  bodyEn:
    "Elements Method offers bespoke organizational programs designed around team immersions, leadership culture development, and organizational transformation. A single corporate program can bring an entire leadership team through the Four Elements framework, creating shared language, deepened trust, and aligned organizational culture.",
  ctaEs: "Iniciar conversación",
  ctaEn: "Begin the conversation",
};

/**
 * The elemental arc — the sequence every program traverses.
 * Numbered by phase (not month): each program spans this arc over a
 * different duration, so we avoid "Mes N" per client feedback. The closing
 * phase is the integration into the Núcleo (the person themselves), not a
 * separate "Éter" step.
 */
/**
 * Coaching + Community sections — from elements-web-content.docx (Sections 6 & 7).
 */
export const coachingSection = {
  eyebrowEs: "El acompañamiento",
  eyebrowEn: "The coaching",
  headlineEs: "Una inmersión abre la puerta. El acompañamiento sostenido es lo que asegura que el líder cruce — y se quede del otro lado.",
  headlineEn: "An immersion opens the door. Sustained coaching is what ensures the leader crosses — and stays on the other side.",
  bodyEs: "Cada programa grupal — Raíz, Momentum, Fluir y Brújula — incluye la opción de continuar con 6 meses de coaching individual quincenal. Lo guía un coach certificado del Elements Method que conoce el programa exacto que completaste. No es coaching genérico. Es la continuación natural del programa: lo que viviste en la naturaleza se traduce, semana tras semana, en tu práctica diaria de liderazgo.",
  bodyEn: "Every group program — Root, Momentum, Flow and Compass — includes the option to continue with 6 months of individual bi-weekly coaching. It's led by a certified Elements Method coach who knows the exact program you completed. This is not generic coaching. It's the natural continuation of the program: what you lived in nature translates, week after week, into your daily leadership practice.",
  items: [
    {
      titleEs: "Raíz",
      titleEn: "Root",
      bodyEs: "Comienza cuando cierra el retiro de 3 días. El foco: llevar el intensivo a tu práctica diaria, para que lo vivido no se quede en el fin de semana.\n\nSesiones de 50–60 min quincenales · presenciales o virtuales · 6 meses · tarifa preferencial para participantes.",
      bodyEn: "Begins when the 3-day retreat closes. The focus: integrate the intensive into your daily practice, so what you lived doesn't stay in the weekend.\n\n50–60 min sessions, bi-weekly · in person or virtual · 6 months · preferential rate for participants.",
    },
    {
      titleEs: "Momentum",
      titleEn: "Momentum",
      bodyEs: "Comienza durante el programa y se extiende 3 meses más allá. El foco: sostener en el tiempo la intensidad del trimestre, para que el impulso no se apague al terminar.\n\nSesiones de 50–60 min quincenales · presenciales o virtuales · 6 meses · tarifa preferencial para participantes.",
      bodyEn: "Begins during the program and extends 3 months beyond it. The focus: sustain the quarter's intensity over time, so the momentum doesn't fade once it ends.\n\n50–60 min sessions, bi-weekly · in person or virtual · 6 months · preferential rate for participants.",
    },
    {
      titleEs: "Fluir",
      titleEn: "Flow",
      bodyEs: "Comienza durante el programa y continúa después del cierre. El foco: profundizar la aplicación de cada elemento trabajado, mes a mes, en tu día a día.\n\nSesiones de 50–60 min quincenales · presenciales o virtuales · 6 meses · tarifa preferencial para participantes.",
      bodyEn: "Begins during the program and continues after it closes. The focus: deepen the application of each element worked, month by month, in your everyday practice.\n\n50–60 min sessions, bi-weekly · in person or virtual · 6 months · preferential rate for participants.",
    },
    {
      titleEs: "Brújula",
      titleEn: "Compass",
      bodyEs: "Comienza después del taller de 1 día. El foco: profundizar el elemento que tu equipo eligió, para que la jornada se vuelva práctica sostenida.\n\nSesiones de 50–60 min quincenales · presenciales o virtuales · 6 meses · tarifa preferencial para participantes.",
      bodyEn: "Begins after the 1-day workshop. The focus: deepen the element your team chose, so the day becomes sustained practice.\n\n50–60 min sessions, bi-weekly · in person or virtual · 6 months · preferential rate for participants.",
    },
  ],
};

export const communitySection = {
  eyebrowEs: "La comunidad",
  eyebrowEn: "The community",
  headlineEs: "Una comunidad de líderes que se descubren un poco más cada día — para liderar mejor en su vida y en la de quienes lideran.",
  headlineEn: "A community of leaders who discover themselves a little more every day — to lead better in their lives and in the lives of those they lead.",
  bodyEs: "Cuando terminas cualquier camino — Raíz, Momentum, Flow, Compass u Oneness — no entras a una lista de egresados. Entras a una comunidad viva, comprometida con la misma práctica: seguir descubriéndote, cada día, como forma de vida y no como un evento aislado.\n\nEsta comunidad existe porque el trabajo real nunca termina. Sigue haciéndote las preguntas. Sigue escuchando qué elemento necesita cada situación. Sigue afinando tu ritmo entre Agua, Fuego, Aire, Tierra y Éter. Una comunidad de pares que comparten ese compromiso multiplica las probabilidades de que la práctica se sostenga.",
  bodyEn: "When you complete any path — Raíz, Momentum, Flow, Compass or Oneness — you don't just join an alumni list. You join a living community committed to the same practice: continuous self-discovery, every day, as a way of life and not an isolated event.\n\nThis community exists because the real work never ends. Keep asking the questions. Keep listening for the element each situation needs. Keep refining your rhythm between Water, Fire, Air, Earth and Ether. A community of peers who share that commitment multiplies the odds the practice sustains.",
};

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
    titleEs: "Éter — la integración: orquestar los cuatro elementos según lo que cada momento pide",
    titleEn: "Ether — integration: orchestrating the four elements to what each moment demands",
  },
];

/* ────────────────────────────────────────────────────────────────────────
 * PROGRAM DETAIL DATA — verbatim from elements-website-content.pptx
 * slides 9-17. Used by /los-caminos/[slug] detail pages.
 * ──────────────────────────────────────────────────────────────────────── */

export interface ProgramStat {
  value: string;
  labelEs: string;
  labelEn: string;
}

export interface ProgramDetail {
  slug: "raices" | "corriente" | "fuente" | "brujula" | "soulfull";
  url: string;
  headerKickerEs: string;
  headerKickerEn: string;
  nameEs: string;
  nameEn: string;
  taglineEs: string;
  taglineEn: string;
  stats: ProgramStat[];
  /** Section heading for the "everything you need" block (slide 11 / 13 / 16). */
  includesHeadingEs: string;
  includesHeadingEn: string;
  includesBlocks: {
    titleEs: string;
    titleEn: string;
    bodyEs: string;
    bodyEn: string;
  }[];
  whoForHeadingEs: string;
  whoForHeadingEn: string;
  whoForItems: {
    titleEs: string;
    titleEn: string;
    bodyEs: string;
    bodyEn: string;
  }[];
  /** Optional "typical month/week" cadence block. */
  cadenceHeadingEs?: string;
  cadenceHeadingEn?: string;
  cadence?: {
    label: string;
    titleEs: string;
    titleEn: string;
    bulletsEs: string[];
    bulletsEn: string[];
  }[];
  /** Optional comparativa (used by Current). */
  comparativaEs?: { left: string[]; right: string[] };
  comparativaEn?: { left: string[]; right: string[] };
  /** Optional closing note (Source). */
  closingNoteEs?: string;
  closingNoteEn?: string;
  closingTitleEs?: string;
  closingTitleEn?: string;
  closingBodyEs?: string;
  closingBodyEn?: string;
  ctaEs: string;
  ctaEn: string;
  /** Slug of element shown in hero image background (visual cue). */
  primaryElement: ElementKey;
}

export const programDetails: ProgramDetail[] = [
  // ─── FLOW / FLUIR (route slug raices) — 5-month depth ─────────────────
  {
    slug: "raices",
    url: "elementsmethod.com/flow",
    headerKickerEs: "Programa de Profundidad · 5 Meses · Grupal",
    headerKickerEn: "Depth Program · 5 Months · Group",
    nameEs: "Fluir · Flow",
    nameEn: "Flow",
    taglineEs: "Sin prisa, pero sin pausa. La profundidad a su propio ritmo.",
    taglineEn: "No hurry, no pause. Depth at its own pace.",
    stats: [
      { value: "5", labelEs: "Meses", labelEn: "Months" },
      { value: "5", labelEs: "Salidas — 1 por mes", labelEn: "Outings — 1 per month" },
      { value: "8", labelEs: "Metodologías", labelEn: "Methodologies" },
      { value: "4", labelEs: "Elementos + Éter", labelEn: "Elements + Ether" },
    ],
    includesHeadingEs: "Todo lo que necesitas para ir a profundidad",
    includesHeadingEn: "Everything You Need to Go Deep",
    includesBlocks: [
      {
        titleEs: "Un elemento por mes, mes por mes",
        titleEn: "One element per month, month by month",
        bodyEs:
          "Cinco meses. Un elemento cada mes. Cada campo trabaja dos metodologías completas. M1 Agua — Focusing + Entrevista Motivacional. M2 Fuego — Logoterapia + Terapia Narrativa. M3 Aire — Espiral Dinámica + Metacognición/MBCT. M4 Tierra — Desarrollo Adulto + Confianza e Inspiración. M5 Éter — AQAL + ceremonia del Mandala de Liderazgo. El Éter siempre cierra: la integración solo llega después de encontrarte con cada elemento por separado.",
        bodyEn:
          "Five months. One element each month. Every field day works two complete methodologies. M1 Water — Focusing + Motivational Interviewing. M2 Fire — Logotherapy + Narrative Therapy. M3 Air — Spiral Dynamics + Metacognition/MBCT. M4 Earth — Adult Development + Trust & Inspire. M5 Ether — AQAL + the Leadership Mandala ceremony. Ether always closes: integration only arrives after you have met each element on its own.",
      },
      {
        titleEs: "Tiempo para que cada elemento se asiente",
        titleEn: "Time for each element to settle",
        bodyEs:
          "Éste es el programa grupal más profundo. Cada elemento tiene un mes completo para asentarse, integrarse y manifestarse en tu comportamiento real como líder antes de pasar al siguiente. La profundidad no se apura. Se le da tiempo.",
        bodyEn:
          "This is the deepest group program. Each element gets a full month to settle, integrate, and show up in your real leadership behavior before the next one begins. Depth cannot be rushed. It is given time.",
      },
      {
        titleEs: "Lo que te llevas",
        titleEn: "What you take home",
        bodyEs:
          "Dominio profundo de los cuatro elementos. Ocho metodologías completas, cada una con su tiempo de integración. Una comunidad de práctica entre pares durante cinco meses. Y un plan de desarrollo personal para los siguientes doce meses.",
        bodyEn:
          "Deep mastery of all four elements. Eight complete methodologies, each with its own integration time. A five-month peer practice community. And a personal development plan for the next twelve months.",
      },
      {
        titleEs: "Continuidad: coaching individual",
        titleEn: "Continuation: individual coaching",
        bodyEs:
          "Opción de 6 meses de coaching individual quincenal. Un acompañamiento uno a uno que sostiene lo aprendido y lo lleva del campo a tu día a día.",
        bodyEn:
          "Option of 6 months of bi-weekly individual coaching. One-on-one accompaniment that holds what you learned and carries it from the field into your everyday.",
      },
    ],
    whoForHeadingEs: "Fluir es para quienes...",
    whoForHeadingEn: "Flow is made for those who...",
    whoForItems: [
      {
        titleEs: "Desarrollan liderazgo senior",
        titleEn: "Develop senior leadership",
        bodyEs:
          "Ya cargas responsabilidad real. Buscas un desarrollo a la altura de tu rol, con espacio para que cale hondo.",
        bodyEn:
          "You already carry real responsibility. You want development that matches your role, with room to sink in.",
      },
      {
        titleEs: "Invierten en su cantera de líderes",
        titleEn: "Invest in their leadership pipeline",
        bodyEs:
          "Organizaciones que forman a su gente para el largo plazo, no para el trimestre. Fluir siembra líderes que sostienen.",
        bodyEn:
          "Organizations that grow their people for the long term, not for the quarter. Flow plants leaders who can hold.",
      },
      {
        titleEs: "Saben que la profundidad no se apura",
        titleEn: "Know deep change cannot be rushed",
        bodyEs:
          "Entiendes que el cambio real necesita tiempo para asentarse. Cinco meses le dan a cada elemento el suyo.",
        bodyEn:
          "You understand that real change needs time to settle. Five months give each element its own.",
      },
    ],
    ctaEs: "Comenzar Fluir",
    ctaEn: "Begin Flow",
    primaryElement: "agua",
  },
  // ─── MOMENTUM (route slug corriente) — 3-month intensive ──────────────
  {
    slug: "corriente",
    url: "elementsmethod.com/momentum",
    headerKickerEs: "Intensivo Grupal · 3 Meses · Doble Intensidad",
    headerKickerEn: "Intensive Group · 3 Months · Double Intensity",
    nameEs: "Momentum",
    nameEn: "Momentum",
    taglineEs: "La fuerza acumulada de un cuerpo en movimiento.",
    taglineEn: "The accumulated force of a body in motion.",
    stats: [
      { value: "3", labelEs: "Meses", labelEn: "Months" },
      { value: "6", labelEs: "Salidas — 2 por mes", labelEn: "Outings — 2 per month" },
      { value: "10", labelEs: "Metodologías", labelEn: "Methodologies" },
      { value: "4+", labelEs: "Elementos + Éter", labelEn: "Elements + Ether" },
    ],
    includesHeadingEs: "El doble de densidad. La mitad del tiempo.",
    includesHeadingEn: "Twice the density. Half the time.",
    includesBlocks: [
      {
        titleEs: "Seis jornadas, doble intensidad",
        titleEn: "Six field days, double intensity",
        bodyEs:
          "Dos salidas al mes durante tres meses. Cada jornada cubre dos metodologías y dos experiencias en un solo día. Son 10 metodologías completas en total — la exposición más profunda que ofrece el método, el doble de densidad que cualquier otro programa grupal.",
        bodyEn:
          "Two outings a month for three months. Each field day covers two methodologies and two experiences. Ten complete methodologies in all — the deepest methodology exposure the method offers, twice the density of any other group program.",
      },
      {
        titleEs: "El arco de los tres meses",
        titleEn: "The arc across three months",
        bodyEs:
          "Recorres los cuatro elementos y siempre cierras con Éter. Mes 1: Tierra (framework ROOTS · Forest Grounding & Roots Ritual) y Fuego (framework IGNITE · Vision Ceremony). Mes 2: Agua (framework FLOW · Riverine Reflection) y Aire (framework CLEAR · Summit Perspective). Mes 3: profundización elemental y una sesión completa de integración en Éter (framework ECOS) — el Mandala de Liderazgo. El Éter siempre cierra el arco; nunca lo abre.",
        bodyEn:
          "You move through the four elements and always close with Ether. Month 1: Earth (ROOTS framework · Forest Grounding & Roots Ritual) and Fire (IGNITE framework · Vision Ceremony). Month 2: Water (FLOW framework · Riverine Reflection) and Air (CLEAR framework · Summit Perspective). Month 3: elemental deepening and a full Ether integration session (ECOS framework) — the Leadership Mandala. Ether always closes the arc; it never opens it.",
      },
      {
        titleEs: "Cambio visible en 90 días",
        titleEn: "Visible change in 90 days",
        bodyEs:
          "Te llevas 10 metodologías completas, cambios de comportamiento medibles en una ventana corta, tu mandala de liderazgo personal y tu ritmo elemental. Momentum es lo que su nombre dice: la fuerza que crece con cada repetición.",
        bodyEn:
          "You take home 10 complete methodologies, measurable behavioral change in a short window, your personal leadership mandala and your elemental rhythm. Momentum is what its name says: force that grows with each repetition.",
      },
      {
        titleEs: "Continuidad opcional",
        titleEn: "Optional continuity",
        bodyEs:
          "Acceso especial a un programa de continuidad: coaching individual quincenal durante 6 meses (costo adicional). Para sostener el ritmo después de los tres meses.",
        bodyEn:
          "Special access to a continuity program: bi-weekly individual coaching for 6 months (additional cost). To hold the rhythm after the three months.",
      },
    ],
    whoForHeadingEs: "Para quién es Momentum",
    whoForHeadingEn: "Who Momentum is for",
    whoForItems: [
      {
        titleEs: "Atraviesas una transición crítica",
        titleEn: "You are in a critical transition",
        bodyEs:
          "Un cambio de rol, una decisión grande cerca. La cadencia doble te da el contacto frecuente que el momento exige.",
        bodyEn:
          "A role change, a big decision near. The double cadence gives you the frequent contact the moment demands.",
      },
      {
        titleEs: "Estás en una reestructuración organizacional",
        titleEn: "You are in an organizational restructuring",
        bodyEs:
          "Cuando todo alrededor se mueve, necesitas un cambio propio que sea visible y medible en 90 días. Momentum trabaja a esa velocidad.",
        bodyEn:
          "When everything around you is moving, you need a shift of your own that is visible and measurable in 90 days. Momentum works at that speed.",
      },
      {
        titleEs: "Aprendes por intensidad y repetición",
        titleEn: "You learn through intensity and repetition",
        bodyEs:
          "El cambio real necesita reiteración. Seis jornadas en tres meses te dan esa reiteración, cuerpo y ritmo.",
        bodyEn:
          "Real change needs reiteration. Six field days in three months give you that reiteration, body and rhythm.",
      },
    ],
    comparativaEs: {
      left: [
        "Fluir (Flow) · 5 meses",
        "1 salida / mes",
        "Un elemento por mes",
        "Prioriza la profundidad",
      ],
      right: [
        "Momentum · 3 meses",
        "2 salidas / mes",
        "Dos metodologías por jornada",
        "Prioriza la velocidad e intensidad",
        "Cierre con integración en Éter",
      ],
    },
    comparativaEn: {
      left: [
        "Flow · 5 months",
        "1 outing / month",
        "One element per month",
        "Prioritizes depth",
      ],
      right: [
        "Momentum · 3 months",
        "2 outings / month",
        "Two methodologies per day",
        "Prioritizes speed and intensity",
        "Closes with Ether integration",
      ],
    },
    ctaEs: "Comenzar Momentum",
    ctaEn: "Begin Momentum",
    primaryElement: "fuego",
  },
  // ─── RAÍZ / ROOT (route slug fuente) — 3-day retreat ──────────────────
  {
    slug: "fuente",
    url: "elementsmethod.com/root",
    headerKickerEs: "Retiro Inmersivo · 3 Días · Grupal",
    headerKickerEn: "Immersive Retreat · 3 Days · Group",
    nameEs: "Raíz · Root",
    nameEn: "Root",
    taglineEs: "La puerta de entrada. Los cinco elementos vividos en un solo fin de semana.",
    taglineEn: "The gateway. All five elements lived in a single weekend.",
    stats: [
      { value: "3", labelEs: "Días", labelEn: "Days" },
      { value: "4", labelEs: "Inmersiones", labelEn: "Immersions" },
      { value: "5", labelEs: "Elementos (con Éter)", labelEn: "Elements (with Ether)" },
      { value: "1", labelEs: "Cierre integrador", labelEn: "Integrative close" },
    ],
    includesHeadingEs: "El arco completo, vivido en tres días",
    includesHeadingEn: "The full arc, lived in three days",
    includesBlocks: [
      {
        titleEs: "Un elemento por día",
        titleEn: "One element per day",
        bodyEs:
          "Tres días, un elemento por jornada, cerrando con Éter. Día 1, Agua: escucha profunda y regulación del sistema nervioso. Día 2, Fuego: logoterapia y ceremonia de propósito. Día 3, Aire y Tierra: perspectiva, confianza y cierre con la integración de Éter. El arco de los cinco elementos en un fin de semana extendido.",
        bodyEn:
          "Three days, one element per day, closing with Ether. Day 1, Water: deep listening and nervous-system regulation. Day 2, Fire: logotherapy and purpose ceremony. Day 3, Air and Earth: perspective, trust, and closing with Ether integration. The arc of all five elements in a single extended weekend.",
      },
      {
        titleEs: "Lo que te llevas a casa",
        titleEn: "What you take home",
        bodyEs:
          "Un mapa elemental personal: tu elemento dominante y tu sombra. La práctica del Escaneo de los 4 Elementos para el día a día. Y la cohesión que solo se construye compartiendo una experiencia intensa.",
        bodyEn:
          "A personal elemental map: your dominant element and your shadow. The 4-Element Scan practice for daily use. And the cohesion that is only built through a shared, intense experience.",
      },
      {
        titleEs: "La experiencia más potente de cada elemento",
        titleEn: "Each element's most powerful experience",
        bodyEs:
          "Raíz no persigue muchas metodologías por elemento. Elige la más representativa de cada uno y prioriza vivir el arco completo. Éter siempre cierra: nunca abre. La integración solo es posible después de encontrarte con cada elemento por separado.",
        bodyEn:
          "Root doesn't chase many methodologies per element. It picks each one's most representative experience and prioritizes living the full arc. Ether always closes: it never opens. Integration is only possible after meeting each element separately.",
      },
      {
        titleEs: "La puerta de entrada al método",
        titleEn: "The gateway to the method",
        bodyEs:
          "Es el punto de partida a Elements Method. Puedes sumar, como opción, seis meses de coaching individual quincenal para sostener lo que despierta el retiro.",
        bodyEn:
          "It is the entry point to the Elements Method. You can add, as an option, six months of bi-weekly individual coaching to sustain what the retreat opens.",
      },
    ],
    whoForHeadingEs: "Raíz es para quien...",
    whoForHeadingEn: "Root is for those who...",
    whoForItems: [
      {
        titleEs: "Quieren su primera experiencia con el método",
        titleEn: "Want their first experience with the method",
        bodyEs:
          "La forma más directa de vivir los cinco elementos completos antes de comprometerte con un programa más largo.",
        bodyEn:
          "The most direct way to live all five elements before committing to a longer program.",
      },
      {
        titleEs: "Buscan un retiro anual de equipo directivo",
        titleEn: "Are looking for an annual leadership-team retreat",
        bodyEs:
          "Tres días fuera del ruido diario, en naturaleza, con las personas con quienes decides.",
        bodyEn:
          "Three days out of the daily noise, in nature, with the people you decide alongside.",
      },
      {
        titleEs: "Necesitan cohesión de alto impacto en el equipo",
        titleEn: "Need high-impact team cohesion",
        bodyEs:
          "Una experiencia intensa y compartida construye confianza más rápido que cualquier dinámica de oficina.",
        bodyEn:
          "An intense, shared experience builds trust faster than any office exercise.",
      },
    ],
    closingTitleEs: "Una nota sobre Raíz",
    closingTitleEn: "A note on Root",
    closingBodyEs:
      "Raíz es la puerta de entrada a Elements Method. Empieza aquí. Cada programa recorre los cinco elementos y siempre cierra con Éter — la integración que vuelve al núcleo que eres tú. Esto no es un formulario. Es el comienzo de una conversación.",
    closingBodyEn:
      "Root is the gateway to the Elements Method. Begin here. Every program moves through all five elements and always closes with Ether — the integration that returns to the core that is you. This is not a form. It's the start of a conversation.",
    ctaEs: "Comenzar Raíz",
    ctaEn: "Begin Root",
    primaryElement: "tierra",
  },
  // ─── BRÚJULA / COMPASS (route slug brujula) — 1-day workshop ──────────
  {
    slug: "brujula",
    url: "elementsmethod.com/compass",
    headerKickerEs: "Taller a la medida · Grupal · Elige tu elemento",
    headerKickerEn: "Custom Workshop · Group · Choose Your Element",
    nameEs: "Brújula · Compass",
    nameEn: "Compass",
    taglineEs: "Un día. Un elemento elegido a conciencia. El que tu equipo necesita ahora.",
    taglineEn: "One day. One element chosen on purpose. The one your team needs now.",
    stats: [
      { value: "1", labelEs: "Día", labelEn: "Day" },
      { value: "2", labelEs: "Metodologías", labelEn: "Methodologies" },
      { value: "1", labelEs: "Elemento elegido", labelEn: "Element chosen" },
      { value: "100%", labelEs: "A la medida", labelEn: "Custom" },
    ],
    includesHeadingEs: "Un día diseñado alrededor de una sola decisión",
    includesHeadingEn: "A day built around a single decision",
    includesBlocks: [
      {
        titleEs: "Primero, el diagnóstico",
        titleEn: "First, the diagnosis",
        bodyEs:
          "Empezamos por una pregunta honesta: ¿qué necesita tu equipo ahora? De esa respuesta sale el elemento. No lo elegimos por moda ni por gusto. Lo elegimos por necesidad real.",
        bodyEn:
          "We start with an honest question: what does your team need right now? The element comes from that answer. Not chosen by trend, not by taste. Chosen by real need.",
      },
      {
        titleEs: "Los cinco caminos posibles",
        titleEn: "The five possible paths",
        bodyEs:
          "Agua, cuando el equipo necesita escuchar y regularse. Fuego, cuando necesita visión y activación. Aire, cuando necesita perspectiva y comunicación. Tierra, cuando necesita reconstruir confianza. Éter, cuando necesita integrar todo lo vivido — solo para alumni. Eliges uno. Diseñamos el día entero a su alrededor.",
        bodyEn:
          "Water, when the team needs to listen and regulate. Fire, when it needs vision and activation. Air, when it needs perspective and communication. Earth, when it needs to rebuild trust. Ether, when it needs to integrate everything lived — alumni only. You choose one. We design the whole day around it.",
      },
      {
        titleEs: "Dos metodologías, dos naturalezas",
        titleEn: "Two methodologies, two natures",
        bodyEs:
          "Un día completo con 2 metodologías del método y 2 experiencias en naturaleza, alineadas con exactitud al elemento que elegiste. Nada genérico. Todo apunta a la misma necesidad.",
        bodyEn:
          "A full day with 2 methodologies from the method and 2 nature experiences, aligned exactly to the element you chose. Nothing generic. Everything points at the same need.",
      },
      {
        titleEs: "Cierre en Éter: la integración",
        titleEn: "Closing in Ether: integration",
        bodyEs:
          "Como todo en Elements Method, el día cierra integrando. Te vas con 2 metodologías completas, herramientas aplicables de inmediato a esa necesidad puntual, y un diagnóstico claro de los siguientes pasos.",
        bodyEn:
          "As with everything in Elements Method, the day closes by integrating. You leave with 2 complete methodologies, tools you can apply immediately to that specific need, and a clear diagnosis of the next steps.",
      },
    ],
    whoForHeadingEs: "Para quién es Brújula",
    whoForHeadingEn: "Who Compass is for",
    whoForItems: [
      {
        titleEs: "Un equipo con una necesidad concreta",
        titleEn: "A team with one specific need",
        bodyEs:
          "Ya sabes qué está pesando. Falta escucha, falta visión, falta confianza. Brújula ataca eso, y solo eso, en un día.",
        bodyEn:
          "You already know what's weighing on you. Missing listening, missing vision, missing trust. Compass tackles that, and only that, in a day.",
      },
      {
        titleEs: "Un primer contacto antes de comprometerte",
        titleEn: "A first touchpoint before committing",
        bodyEs:
          "Una forma de conocer el método por dentro antes de entrar a un programa más largo. Un día para sentir cómo trabajamos.",
        bodyEn:
          "A way to know the method from the inside before entering a longer program. One day to feel how we work.",
      },
      {
        titleEs: "Un piloto para Recursos Humanos",
        titleEn: "An HR pilot",
        bodyEs:
          "Quieres probar antes de escalar. Brújula te da una muestra real, con resultados tangibles, para decidir con base y no con fe.",
        bodyEn:
          "You want to test before you scale. Compass gives you a real sample, with tangible results, so you decide on evidence and not on faith.",
      },
      {
        titleEs: "Una sesión de mantenimiento para alumni",
        titleEn: "An alumni maintenance session",
        bodyEs:
          "Ya recorriste el arco completo. Vuelves por un día a Éter, a integrar de nuevo, a reafinar lo que se aflojó con el tiempo.",
        bodyEn:
          "You've already walked the full arc. You return for a day to Ether, to integrate again, to retune what loosened over time.",
      },
    ],
    ctaEs: "Elige tu elemento",
    ctaEn: "Choose your element",
    primaryElement: "aire",
  },
  // ─── ONENESS (route slug soulfull) — individual immersion ─────────────
  {
    slug: "soulfull",
    url: "elementsmethod.com/oneness",
    headerKickerEs: "Inmersión Individual · Privado · El único programa en solitario",
    headerKickerEn: "Individual Immersion · Private · The only solo program",
    nameEs: "Oneness",
    nameEn: "Oneness",
    taglineEs: "El método, rediseñado por completo para una sola persona. Tu proceso, entera y solamente tuyo.",
    taglineEn: "The method, entirely redesigned for one person. Your process, wholly and only yours.",
    stats: [
      { value: "1", labelEs: "Persona", labelEn: "Person" },
      { value: "100%", labelEs: "Personalización", labelEn: "Personalization" },
      { value: "5", labelEs: "Elementos + Éter", labelEn: "Elements + Ether" },
      { value: "40+", labelEs: "Metodologías disponibles", labelEn: "Methodologies available" },
    ],
    includesHeadingEs: "El método, rediseñado para ti",
    includesHeadingEn: "The method, redesigned around you",
    includesBlocks: [
      {
        titleEs: "La versión 1:1 de cualquier programa",
        titleEn: "The 1:1 version of any program",
        bodyEs:
          "Oneness es, por diseño, la versión individual de cualquiera de nuestros otros cuatro programas — rediseñada por completo para una persona. Tienes libertad total para combinar elementos, metodologías, duraciones y locaciones según tu necesidad específica. No es un programa grupal adaptado. Es un programa construido desde cero para ti.",
        bodyEn:
          "Oneness is, by design, the 1:1 version of any of our other four programs — completely redesigned for one person. You have full freedom to combine elements, methodologies, durations and locations for your specific need. It is not a group program adapted. It is a program built from scratch for you.",
      },
      {
        titleEs: "Lo que siempre permanece constante",
        titleEn: "What always stays constant",
        bodyEs:
          "Cuatro cosas no cambian nunca. Siempre recorres los cinco elementos. Siempre cierras con Éter, la integración. Siempre te acompañan nuestros coaches más senior. Y siempre está diseñado en exclusiva para una sola persona.",
        bodyEn:
          "Four things never change. You always move through all five elements. You always close with Ether — integration. You are always led by our most senior coaches. And it is always designed exclusively for one person.",
      },
      {
        titleEs: "Lo que siempre es a la medida",
        titleEn: "What is always custom",
        bodyEs:
          "La estructura y la duración del programa. Las metodologías específicas, elegidas entre más de 40 disponibles. Las locaciones, curadas solo para ti. El ritmo y la frecuencia del coaching. El coaching no es un extra que se suma — está integrado en el programa desde el primer día.",
        bodyEn:
          "The program structure and its duration. The specific methodologies, chosen from more than 40 available. The locations, curated just for you. The pacing and coaching frequency. Coaching is not an add-on — it is integrated into the program from day one.",
      },
    ],
    whoForHeadingEs: "Para quién es Oneness",
    whoForHeadingEn: "Who Oneness is for",
    whoForItems: [
      {
        titleEs: "Atraviesas una transición de liderazgo de alto riesgo",
        titleEn: "You are navigating a high-stakes leadership transition",
        bodyEs:
          "Un momento donde lo que está en juego no admite ensayo. Necesitas un proceso a tu medida y toda la atención de un coach senior.",
        bodyEn:
          "A moment where what's at stake leaves no room for rehearsal. You need a process built for you and the full attention of a senior coach.",
      },
      {
        titleEs: "La vulnerabilidad en grupo no es una opción",
        titleEn: "Group vulnerability isn't an option",
        bodyEs:
          "Por tu rol o tu exposición, abrirte frente a otros no es posible. Oneness te da un contenedor privado donde ese trabajo sí puede suceder.",
        bodyEn:
          "By your role or your exposure, opening up in front of others isn't possible. Oneness gives you a private container where that work can happen.",
      },
      {
        titleEs: "Traes un desafío muy específico",
        titleEn: "You bring a highly specific challenge",
        bodyEs:
          "No buscas un programa general. Buscas un proceso construido alrededor de una situación concreta y del resultado exacto que necesitas.",
        bodyEn:
          "You're not looking for a general program. You want a process built around a concrete situation and the exact result you need.",
      },
      {
        titleEs: "Prefieres el trabajo profundo en solitario",
        titleEn: "You prefer deep solo work",
        bodyEs:
          "No por falta de comunidad, sino porque tu proceso pide silencio, intimidad y un ritmo que solo es tuyo.",
        bodyEn:
          "Not for lack of community, but because your process asks for silence, intimacy and a pace that is only yours.",
      },
    ],
    closingTitleEs: "Una nota sobre Oneness",
    closingTitleEn: "A note on Oneness",
    closingBodyEs:
      "Como Oneness se diseña alrededor de una sola persona, no hay dos programas iguales. Todo empieza con una conversación: nos cuentas dónde estás y qué buscas, y desde ahí construimos tu recorrido por los cinco elementos, con cierre en Éter. Esto no es un formulario. Es una invitación a conversar.",
    closingBodyEn:
      "Because Oneness is designed around one person, no two programs are alike. It all begins with a conversation: you tell us where you are and what you're looking for, and from there we build your journey through all five elements, closing with Ether. This is not a form. It's an invitation to talk.",
    ctaEs: "Solicitar conversación",
    ctaEn: "Request a discovery conversation",
    primaryElement: "eter",
  },
];

export function findProgram(slug: string): ProgramDetail | null {
  return programDetails.find((p) => p.slug === slug) ?? null;
}

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
    image: "/images/modules/roots.jpg",
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
    image: "/images/modules/ignite.jpg",
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
    image: "/images/modules/flow.jpg",
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
    image: "/images/modules/clear.jpg",
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
 * Stats — every figure verified against its PRIMARY source (Jul 2026) and
 * corrected where the popular phrasing was wrong. Each has a `url` to the
 * source so the claim is clickable. Notes on corrections:
 *   - Cortisol 21% is a per-HOUR rate (not a 20-min total); 20–30 min is the
 *     most efficient dose. (Hunter 2019)
 *   - Memory +20% was after a ~50-min nature walk, not "20 min". (Berman 2008)
 *   - The 50% creativity gain is Atchley/Strayer 2012 (Kansas/Utah) after
 *     FOUR DAYS — NOT a Michigan 20-min effect. Kept as its own honest stat.
 *   - NK +50% is Li 2007; the >30-day persistence is the Li 2010 review.
 *   - No solid source ties "3× engagement" to self-aware leaders; the real,
 *     citable finding is Korn Ferry (self-aware-led firms → higher returns).
 *   - "27% revenue growth · Project Aristotle" is a myth: 27% is a Gallup
 *     TURNOVER reduction. Reframed to what Google actually found.
 *   - Hölzel 2011 gray-matter increase was the HIPPOCAMPUS, not the PFC.
 */
/**
 * A stat. `metricEs/En` is the short highlighted figure ("21% / hora",
 * "4 días", "8 sem") shown large; `labelEs/En` is the sentence; `source` +
 * `url` make it a clickable citation. Some entries are qualitative — their
 * metric is a short phrase, not a percentage.
 */
export interface StatInfo {
  metricEs: string;
  metricEn: string;
  labelEs: string;
  labelEn: string;
  source: string;
  url: string;
}

export const stats: StatInfo[] = [
  {
    metricEs: "−21%",
    metricEn: "−21%",
    labelEs: "de cortisol por hora en naturaleza — el mayor beneficio se gana entre 20 y 30 minutos.",
    labelEn: "cortisol per hour in nature — the greatest benefit comes between 20 and 30 minutes.",
    source: "Hunter et al. · Frontiers in Psychology, 2019",
    url: "https://doi.org/10.3389/fpsyg.2019.00722",
  },
  {
    metricEs: "+20%",
    metricEn: "+20%",
    labelEs: "de memoria de trabajo y atención tras una caminata en la naturaleza.",
    labelEn: "in working memory and attention after a walk in nature.",
    source: "Berman, Jonides & Kaplan · University of Michigan · Psychological Science, 2008",
    url: "https://doi.org/10.1111/j.1467-9280.2008.02225.x",
  },
  {
    metricEs: "+50%",
    metricEn: "+50%",
    labelEs: "en resolución creativa de problemas tras cuatro días inmersos en la naturaleza.",
    labelEn: "in creative problem-solving after four days immersed in nature.",
    source: "Atchley, Strayer & Atchley · Kansas / Utah · PLoS ONE, 2012",
    url: "https://doi.org/10.1371/journal.pone.0051474",
  },
  {
    metricEs: "+50%",
    metricEn: "+50%",
    labelEs: "de actividad de células NK del sistema inmune tras un baño de bosque; el efecto persiste más de 30 días.",
    labelEn: "in NK immune-cell activity after a forest-bathing trip; the effect lasts over 30 days.",
    source: "Li · Nippon Medical School · Int. J. Immunopathol. Pharmacol., 2007",
    url: "https://pubmed.ncbi.nlm.nih.gov/17903349/",
  },
  {
    metricEs: "10–15%",
    metricEn: "10–15%",
    labelEs: "de las personas son realmente auto-conscientes, aunque el 95% cree serlo — la base de un mejor criterio.",
    labelEn: "of people are truly self-aware, though 95% believe they are — the basis of better judgment.",
    source: "Eurich · Harvard Business Review, 2018",
    url: "https://hbr.org/2018/01/what-self-awareness-really-is-and-how-to-cultivate-it",
  },
  {
    metricEs: "VFC ↑",
    metricEn: "HRV ↑",
    labelEs: "un sistema nervioso regulado (mayor variabilidad de frecuencia cardíaca) mejora la función ejecutiva y el criterio.",
    labelEn: "a regulated nervous system (higher heart-rate variability) improves executive function and judgment.",
    source: "Thayer et al. · Annals of Behavioral Medicine, 2009",
    url: "https://pubmed.ncbi.nlm.nih.gov/19424767/",
  },
  {
    metricEs: "27%",
    metricEn: "27%",
    labelEs: "menos rotación cuando la gente siente que su opinión cuenta — el poder de la seguridad psicológica.",
    labelEn: "lower turnover when people feel their opinions count — the power of psychological safety.",
    source: "Gallup, 2017 · concepto de Amy Edmondson, Harvard",
    url: "https://www.gallup.com/workplace/236198/create-culture-psychological-safety.aspx",
  },
  {
    metricEs: "8 sem",
    metricEn: "8 wks",
    labelEs: "de mindfulness (MBSR) aumentan la materia gris del hipocampo, medible por resonancia magnética.",
    labelEn: "of mindfulness (MBSR) increase hippocampal gray matter, measurable by MRI.",
    source: "Hölzel et al. · Psychiatry Research: Neuroimaging, 2011",
    url: "https://pubmed.ncbi.nlm.nih.gov/21071182/",
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
      "Un programa de desarrollo personal con impacto profesional, basado en inmersiones en la naturaleza, diseñado para devolver a las personas —especialmente a quienes lideran— a su fuente esencial de poder. Integra neurociencia, programación neurolingüística, coaching internacional, frameworks estratégicos y práctica somática en cada sesión.",
    aEn:
      "A nature-based personal development program with professional impact, designed to return people — especially those who lead — to their essential source of power. It integrates neuroscience, NLP, international coaching, strategic frameworks and somatic practice in every session.",
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
      "Para personas comprometidas con su desarrollo — especialmente quienes lideran. Ejecutivos senior en momentos de transición, líderes que sienten que su liderazgo no refleja quiénes son, fundadores en puntos de inflexión, directivos enfrentando agotamiento, y cualquier persona que busque integrar lo personal con lo profesional. Las organizaciones son nuestro foco principal, pero el método también acompaña procesos individuales.",
    aEn:
      "For people committed to their development — especially those who lead. Senior executives in transition, leaders whose leadership doesn't reflect who they are, founders at inflection points, directors facing burnout, and anyone seeking to integrate the personal with the professional. Organizations are our primary focus, yet the method also supports individual journeys.",
  },
  {
    qEs: "¿Qué programas ofrecen?",
    qEn: "What programs do you offer?",
    aEs:
      "Cinco caminos, ordenados de mayor a menor duración: Fluir (5 meses, grupal), Momentum (3 meses intensivo grupal), Raíz (retiro de 3 días), Brújula (taller de 1 día a la medida) y Oneness (inmersión individual). Para organizaciones existe Origin — retiros corporativos hechos a la medida.",
    aEn:
      "Five paths, from longest to shortest: Flow (5 months, group), Momentum (3-month intensive group), Root (3-day retreat), Compass (custom 1-day workshop) and Oneness (individual immersion). For organizations there is Origin — bespoke corporate retreats.",
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
  "Éter · ECOS",
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
  "Ether · ECOS",
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
 * Co-founders — brief, parallel bios for /quienes-somos.
 * The page centers on Elements Method; each founder gets a short semblanza
 * + one quote, not an extended personal résumé.
 *
 * `image` is a placeholder path — drop the real photo at that path to use it.
 * Ana's bio is a DRAFT condensed from her longer profile (below) for review.
 */
export interface FounderInfo {
  slug: string;
  name: string;
  roleEs: string;
  roleEn: string;
  locationEs: string;
  locationEn: string;
  image: string;
  bioEs: string;
  bioEn: string;
  quoteEs: string;
  quoteEn: string;
  socials: { platform: string; handle: string; url: string }[];
}

export const founders: FounderInfo[] = [
  {
    slug: "ana-michelle-concepcion",
    name: "Ana Michelle Concepción",
    roleEs: "Cofundadora de Elements Method",
    roleEn: "Co-founder of Elements Method",
    locationEs: "Ciudad de México",
    locationEn: "Mexico City",
    image: "/images/founders/ana-michelle.jpg",
    bioEs:
      "Ana Michelle Concepción es coach de resultados y bienestar, y cofundadora de Elements Method. Tras más de dos décadas liderando equipos a nivel directivo en organizaciones globales, dejó el mundo corporativo convencida de que los mejores resultados no nacen de más herramientas, sino de un líder que cuida su cuerpo, su mente y sus emociones, y que actúa con consciencia y propósito.\n\nDesde esa convicción fundó The Healing House e integró coaching internacional, neurociencia, programación neurolingüística y práctica somática en un mismo camino de desarrollo. En Elements Method une esa experiencia con el poder de la naturaleza para devolver a las personas —y a quienes lideran— a su fuente esencial de poder, y desde ahí transformar sus entornos y sus organizaciones.",
    bioEn:
      "Ana Michelle Concepción is a results and wellness coach and co-founder of Elements Method. After more than two decades leading teams at executive level in global organizations, she left the corporate world convinced that the best results come not from more tools, but from a leader who tends to their body, mind and emotions, and acts with consciousness and purpose.\n\nFrom that conviction she founded The Healing House and integrated international coaching, neuroscience, NLP and somatic practice into a single path of development. At Elements Method she brings that experience together with the power of nature to return people — and those who lead — to their essential source of power, and from there transform their environments and organizations.",
    quoteEs:
      "Nuestras emociones son la base de todo lo que hacemos; si cuidas tu cuerpo, tu mente y tus emociones, tus acciones te llevan al éxito.",
    quoteEn:
      "Our emotions are the foundation of everything we do; if you care for your body, your mind and your emotions, your actions lead to success.",
    socials: [
      {
        platform: "LinkedIn",
        handle: "ana-michelle-concepcion-esterrich",
        url: "https://www.linkedin.com/in/ana-michelle-concepcion-esterrich-51b7017/",
      },
      {
        platform: "Instagram",
        handle: "@anamichellecoach",
        url: "https://www.instagram.com/anamichellecoach/",
      },
    ],
  },
  {
    slug: "andres-flores-pedroza",
    name: "Andrés Flores Pedroza",
    roleEs: "Cofundador de Elements Method",
    roleEn: "Co-founder of Elements Method",
    locationEs: "México",
    locationEn: "Mexico",
    image: "/images/founders/andres-flores.jpg",
    bioEs:
      "Andrés Flores Pedroza es estratega, facilitador de procesos de transformación y cofundador de Elements Method. Desde hace más de 18 años ha acompañado a personas, equipos y organizaciones a generar cambios significativos, convencido de que toda transformación sostenible comienza en el desarrollo de quien lidera.\n\nSu trayectoria en estrategia, innovación y construcción de marcas le permitió comprender que los mejores resultados no dependen únicamente del conocimiento técnico, sino de la claridad mental, la inteligencia emocional y la capacidad de conectar con un propósito auténtico. Impulsado por esa visión, amplió su formación en liderazgo, desarrollo humano y Psylvotherapy (Terapia de Bosque), integrando el poder de la naturaleza como una herramienta para fortalecer el bienestar, la creatividad, la resiliencia y la toma de decisiones conscientes.\n\nEs fundador de Arquetipik, una iniciativa que diseña experiencias inmersivas en la naturaleza para promover el crecimiento personal y el liderazgo consciente, y de SOUL Strategy, una metodología que acompaña a personas y líderes a descubrir, expresar y alinear su identidad con el impacto que desean generar. En Elements Method, Andrés integra estrategia, naturaleza y desarrollo humano para acompañar a líderes y organizaciones a construir una nueva forma de liderar: más consciente, auténtica y profundamente humana.",
    bioEn:
      "Andrés Flores Pedroza is a strategist, facilitator of transformation processes, and co-founder of Elements Method. For more than 18 years he has helped people, teams and organizations create meaningful change, convinced that all sustainable transformation begins in the development of the person who leads.\n\nHis background in strategy, innovation and brand-building led him to understand that the best results depend not only on technical knowledge, but on mental clarity, emotional intelligence and the capacity to connect with an authentic purpose. Driven by that vision, he expanded his training in leadership, human development and Psylvotherapy (Forest Therapy), integrating the power of nature as a tool to strengthen wellbeing, creativity, resilience and conscious decision-making.\n\nHe is the founder of Arquetipik, an initiative that designs immersive nature experiences for personal growth and conscious leadership, and of SOUL Strategy, a methodology that helps people and leaders discover, express and align their identity with the impact they want to create. At Elements Method, Andrés brings together strategy, nature and human development to help leaders and organizations build a new way of leading: more conscious, authentic and deeply human.",
    quoteEs:
      "Las organizaciones cambian cuando las personas cambian. Y las personas cambian cuando vuelven a conectar con su propia naturaleza.",
    quoteEn:
      "Organizations change when people change. And people change when they reconnect with their own nature.",
    socials: [],
  },
];

/**
 * Founder profile — extended Ana Michelle Concepción record (legacy).
 * Retained as a data source; the /quienes-somos page now uses `founders`.
 */
export const founder = {
  nameEs: "Ana Michelle Concepción Esterrich",
  nameEn: "Ana Michelle Concepción Esterrich",
  fullTitleEs:
    "Fundadora · Elements Method · CEO de The Healing House",
  fullTitleEn:
    "Founder · Elements Method · CEO of The Healing House",
  roleEs: "Fundadora · Elements Method",
  roleEn: "Founder · Elements Method",
  originEs: "San Juan, Puerto Rico",
  originEn: "San Juan, Puerto Rico",
  locationEs: "Ciudad de México",
  locationEn: "Mexico City",

  /** One-line headline — used in hero & social cards */
  headlineEs:
    "26 años liderando equipos VP-level en Microsoft, AT&T, América Móvil y Liberty antes de fundar The Healing House y Elements Method.",
  headlineEn:
    "26 years leading VP-level teams at Microsoft, AT&T, América Móvil and Liberty before founding The Healing House and Elements Method.",

  /** Short bio — the doc-maestro paragraph, kept verbatim. */
  bioEs:
    "En 25 años de trabajo con líderes en el Caribe, Estados Unidos y América Latina, Ana Michelle Concepción identificó un patrón consistente: los líderes más capaces son aquellos que viven en consciencia, con intención, y quienes priorizan su trabajo interior. Son coherentes con sus valores, tienen claridad de propósito, cuidan su cuerpo, sus emociones, su mente y su espíritu. Conectan con su naturaleza esencial y autenticidad. Elements Method nace como respuesta a ese diagnóstico.",
  bioEn:
    "Across 25 years working with leaders in the Caribbean, the United States, and Latin America, Ana Michelle Concepción identified a consistent pattern: the most capable leaders are those who live with consciousness and intention, and who prioritize their inner work. They are coherent with their values, hold clarity of purpose, and tend to their body, emotions, mind and spirit. They connect with their essential nature and authenticity. Elements Method was born as a response to that diagnosis.",

  /** Long-form story — corporate arc → coach transition (Mundo Ejecutivo). */
  storyEs: [
    "Antes de Elements Method, Ana Michelle dedicó más de 26 años al mundo corporativo. A nivel Vicepresidencia dirigió equipos operativos, comerciales, de servicio, técnicos y de manejo de emergencias en Microsoft, Liberty, AT&T y América Móvil en Puerto Rico, las Islas Vírgenes, República Dominicana, el sureste de Estados Unidos y México.",
    "Dejó la vida corporativa para convertirse en una de las coaches de resultados y bienestar más reconocidas en la Ciudad de México. Su frase clave: «He amado cada uno de los roles de mi carrera. Mi propósito siempre ha sido impactar positivamente a las personas a mi alrededor.»",
    "Es autora del libro «La valentía de una mujer» — un relato personal y profesional que entrelaza obstáculos como enfermedad, alcoholismo familiar y abuso, con ejercicios prácticos para la lectora.",
    "Hoy lidera The Healing House en CDMX y diseña Elements Method como su síntesis: 26 años de liderazgo corporativo más coaching multidisciplinario integrados en inmersiones en la naturaleza.",
  ],
  storyEn: [
    "Before Elements Method, Ana Michelle spent more than 26 years in the corporate world. At Vice-President level she led operations, sales, service, technical, and emergency-management teams at Microsoft, Liberty, AT&T, and América Móvil across Puerto Rico, the U.S. Virgin Islands, the Dominican Republic, the southeastern United States, and Mexico.",
    "She left corporate life to become one of the most recognized results and wellness coaches in Mexico City. Her north star: \"I have loved every single role of my career. My purpose has always been to positively impact the people around me.\"",
    "She is the author of «La valentía de una mujer» (The Courage of a Woman) — a personal and professional account that weaves through obstacles including illness, family alcoholism, and abuse, paired with practical exercises for the reader.",
    "Today she leads The Healing House in CDMX and designs Elements Method as her synthesis: 26 years of corporate leadership plus multidisciplinary coaching integrated through nature immersions.",
  ],

  /** Headline verbatim quotes — usable as pull-quotes anywhere on the site. */
  quotesEs: [
    "He amado cada uno de los roles de mi carrera. Mi propósito siempre ha sido impactar positivamente a las personas a mi alrededor.",
    "Nuestras emociones son la base de todo lo que hacemos; si cuidas tu cuerpo, tu mente y tus emociones, tus acciones te llevan al éxito.",
  ],
  quotesEn: [
    "I have loved every single role of my career. My purpose has always been to positively impact the people around me.",
    "Our emotions are the foundation of everything we do; if you care for your body, your mind, and your emotions, your actions lead to success.",
  ],

  /** Corporate roles — VP-level, 25+ year arc. */
  corporateRoles: [
    { company: "Microsoft", role: "VP-level leadership", region: "PR · US Virgin Islands · DR · SE United States · Mexico" },
    { company: "AT&T México", role: "VPGM Enterprise Business Solutions", region: "México" },
    { company: "AT&T", role: "VP Enterprise Business Solutions", region: "México" },
    { company: "América Móvil", role: "VP-level leadership", region: "Latin America" },
    { company: "Liberty", role: "VP-level leadership", region: "Puerto Rico" },
  ],

  /** Certifications & training — from speaker bio + LinkedIn. */
  credentialsEs: [
    "Certified Master Coach in Organizational Leadership · Symbiosis Centre for Distance Learning (2024)",
    "Results Coaching",
    "Organizational Development",
    "Integral Life and Health Coaching",
    "Programación Neurolingüística (NLP)",
    "Neurociencia para Negocios",
    "Yoga Master Certified · Método Iyengar",
    "Formación con Tony Robbins · mindfulness, mentalidad de resultados, mentalidad ilimitada",
    "Programas de Franklin Covey · John Maxwell · Dale Carnegie · Harvard Business Review",
  ],
  credentialsEn: [
    "Certified Master Coach in Organizational Leadership · Symbiosis Centre for Distance Learning (2024)",
    "Results Coaching",
    "Organizational Development",
    "Integral Life and Health Coaching",
    "Neuro-Linguistic Programming (NLP)",
    "Neuroscience for Business",
    "Certified Yoga Master · Iyengar Method",
    "Trained under Tony Robbins · mindfulness, results-oriented mindset, unlimited mindset",
    "Programs at Franklin Covey · John Maxwell · Dale Carnegie · Harvard Business Review",
  ],

  /** Speaking topics — selection from her ~20-topic catalog. */
  speakingTopicsEs: [
    "Romper creencias limitantes",
    "Mujeres en la cima",
    "Bienestar en el trabajo",
    "OKRs y dirección por propósito",
    "Comunicación efectiva",
    "Cultura de confianza",
    "Manejo del estrés",
    "Estrategias de éxito basadas en neurociencia",
  ],
  speakingTopicsEn: [
    "Breaking limiting beliefs",
    "Women at the top",
    "Workplace wellness",
    "OKRs and purpose-driven leadership",
    "Effective communication",
    "Building trust culture",
    "Stress management",
    "Neuroscience-based success strategies",
  ],

  /** Public appearances + published work. */
  workEs: {
    bookTitle: "La valentía de una mujer",
    bookDescription:
      "Libro autobiográfico que entrelaza enfermedad, alcoholismo familiar y abuso con ejercicios prácticos para la lectora.",
    media: ["NMás · Sábados de Foro", "Mundo Ejecutivo · Mujer Ejecutiva"],
  },
  workEn: {
    bookTitle: "The Courage of a Woman (La valentía de una mujer)",
    bookDescription:
      "Autobiographical book weaving illness, family alcoholism, and abuse with practical exercises for the reader.",
    media: ["NMás · Sábados de Foro (Mexican TV)", "Mundo Ejecutivo · Mujer Ejecutiva"],
  },

  /** Social + contact handles (real, verified Jun 23, 2026). */
  socials: [
    {
      platform: "LinkedIn",
      handle: "ana-michelle-concepcion-esterrich",
      url: "https://www.linkedin.com/in/ana-michelle-concepcion-esterrich-51b7017/",
    },
    {
      platform: "Instagram",
      handle: "@anamichellecoach",
      url: "https://www.instagram.com/anamichellecoach/",
    },
    {
      platform: "Facebook",
      handle: "anamichelle.concepcion",
      url: "https://www.facebook.com/anamichelle.concepcion/",
    },
  ],

  /** Other ventures she leads — context for /quienes-somos. */
  ventures: [
    { name: "The Healing House", roleEs: "CEO y fundadora", roleEn: "CEO & founder", url: null },
    { name: "Elements Method", roleEs: "Fundadora", roleEn: "Founder", url: null },
  ],
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
  {
    element: "eter" as ElementKey,
    promptEs:
      "¿Qué elemento pide realmente este momento? ¿Cómo integro los cuatro en una sola respuesta, en lugar de reaccionar desde uno solo?",
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
  {
    element: "eter" as ElementKey,
    promptEn:
      "What does this moment actually call for? How do I integrate all four into a single response, instead of reacting from just one?",
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
