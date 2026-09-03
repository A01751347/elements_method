import type { ElementKey } from "./content";

/**
 * "Descubre tu elemento dominante" — the test the home hero has always
 * promised. Nine situations, four responses each, one per element. No right
 * answers: the result is which of the four forces the leader already leans on,
 * which one backs it up, and which one is missing — the last being the actual
 * sales conversation.
 */
export interface TestOption {
  key: Exclude<ElementKey, "eter">;
  es: string;
  en: string;
}

export interface TestQuestion {
  es: string;
  en: string;
  options: TestOption[];
}

export const elementTest: TestQuestion[] = [
  {
    es: "Tu equipo entra en tensión. Lo primero que haces es…",
    en: "Your team gets tense. The first thing you do is…",
    options: [
      { key: "tierra", es: "Sostener: bajar el ritmo y devolver certeza.", en: "Hold: slow the pace and restore certainty." },
      { key: "agua", es: "Escuchar: entender qué está pasando debajo.", en: "Listen: understand what's going on underneath." },
      { key: "fuego", es: "Activar: poner rumbo y mover al equipo.", en: "Activate: set a direction and get the team moving." },
      { key: "aire", es: "Subir un nivel: nombrar lo que nadie está viendo.", en: "Zoom out: name what nobody is seeing." },
    ],
  },
  {
    es: "La retroalimentación que más se repite sobre ti…",
    en: "The feedback you hear most often about yourself…",
    options: [
      { key: "fuego", es: "“Contigo las cosas pasan.”", en: "“Things happen when you're there.”" },
      { key: "tierra", es: "“Contigo se siente seguro.”", en: "“It feels safe with you.”" },
      { key: "aire", es: "“Ves cosas que los demás no ven.”", en: "“You see things others don't.”" },
      { key: "agua", es: "“Contigo la gente se abre.”", en: "“People open up around you.”" },
    ],
  },
  {
    es: "En una decisión difícil, confías más en…",
    en: "In a hard decision, you trust most in…",
    options: [
      { key: "aire", es: "El análisis y la perspectiva amplia.", en: "Analysis and the wide view." },
      { key: "agua", es: "Lo que sientes cuando te quedas en silencio.", en: "What you feel when you sit in silence." },
      { key: "tierra", es: "Tus principios: lo que no negocias.", en: "Your principles: what you don't negotiate." },
      { key: "fuego", es: "Tu instinto de movimiento: decidir y corregir.", en: "Your instinct to move: decide and correct." },
    ],
  },
  {
    es: "Lo que más te agota de liderar…",
    en: "What drains you most about leading…",
    options: [
      { key: "agua", es: "Cargar con lo emocional de todos.", en: "Carrying everyone's emotional weight." },
      { key: "fuego", es: "La lentitud y la falta de decisión.", en: "Slowness and indecision." },
      { key: "tierra", es: "Ser el punto de apoyo de todos, siempre.", en: "Being everyone's anchor, always." },
      { key: "aire", es: "Explicar una y otra vez lo que ya viste.", en: "Explaining again what you already saw." },
    ],
  },
  {
    es: "Tu manera de entrar a una sala…",
    en: "The way you walk into a room…",
    options: [
      { key: "fuego", es: "Con energía: la temperatura sube.", en: "With energy: the temperature rises." },
      { key: "tierra", es: "Con presencia serena: el ruido baja.", en: "With steady presence: the noise drops." },
      { key: "aire", es: "Observando primero, hablando después.", en: "Observing first, speaking after." },
      { key: "agua", es: "Leyendo el ánimo antes que la agenda.", en: "Reading the mood before the agenda." },
    ],
  },
  {
    es: "Cuando algo sale mal, tu primer reflejo es…",
    en: "When something goes wrong, your first reflex is…",
    options: [
      { key: "tierra", es: "Asumirlo: la responsabilidad es mía.", en: "Own it: the responsibility is mine." },
      { key: "aire", es: "Entenderlo: por qué ocurrió realmente.", en: "Understand it: why it actually happened." },
      { key: "fuego", es: "Corregirlo: siguiente intento, ya.", en: "Fix it: next attempt, now." },
      { key: "agua", es: "Cuidar a la gente antes que al problema.", en: "Care for the people before the problem." },
    ],
  },
  {
    es: "Lo que tu equipo te agradece cuando estás en tu mejor versión…",
    en: "What your team thanks you for when you're at your best…",
    options: [
      { key: "aire", es: "Claridad: entienden hacia dónde y por qué.", en: "Clarity: they understand where and why." },
      { key: "agua", es: "Escucha real, sin prisa.", en: "Real listening, without hurry." },
      { key: "fuego", es: "Coraje: tomas la decisión que nadie toma.", en: "Courage: you make the call nobody makes." },
      { key: "tierra", es: "Consistencia: eres el mismo todos los días.", en: "Consistency: you're the same every day." },
    ],
  },
  {
    es: "Un día entero sin agenda. Lo usas para…",
    en: "A whole day with no agenda. You use it to…",
    options: [
      { key: "agua", es: "Estar cerca del agua, sin plan.", en: "Be near water, with no plan." },
      { key: "tierra", es: "Trabajar con las manos o caminar en el bosque.", en: "Work with your hands or walk in the forest." },
      { key: "fuego", es: "Moverte fuerte: entrenar, subir, competir.", en: "Move hard: train, climb, compete." },
      { key: "aire", es: "Leer, escribir y pensar sin interrupciones.", en: "Read, write and think uninterrupted." },
    ],
  },
  {
    es: "La frase que más se parece a cómo lideras hoy…",
    en: "The sentence closest to how you lead today…",
    options: [
      { key: "tierra", es: "“Aquí estoy, y voy a seguir estando.”", en: "“I'm here, and I'll keep being here.”" },
      { key: "fuego", es: "“Vamos, y lo resolvemos en el camino.”", en: "“Let's go, we'll solve it on the way.”" },
      { key: "agua", es: "“Cuéntame qué está pasando de verdad.”", en: "“Tell me what's really going on.”" },
      { key: "aire", es: "“Antes de movernos, veamos el mapa completo.”", en: "“Before we move, let's see the whole map.”" },
    ],
  },
];

/** Copy for the result screen — what the dominant element means, in one line. */
export const elementVerdict: Record<
  Exclude<ElementKey, "eter">,
  { es: string; en: string }
> = {
  tierra: {
    es: "Lideras desde el arraigo. Tu gente te busca cuando necesita suelo firme — y tu riesgo es cargar sola o solo el peso de sostener a todos.",
    en: "You lead from grounding. Your people come to you for solid ground — and your risk is carrying the weight of holding everyone alone.",
  },
  fuego: {
    es: "Lideras desde la activación. Contigo las cosas se mueven — y tu riesgo es quemar la mecha, la tuya y la del equipo, antes de tiempo.",
    en: "You lead from activation. Things move when you're there — and your risk is burning the fuse, yours and the team's, too early.",
  },
  agua: {
    es: "Lideras desde la escucha. La gente se abre contigo — y tu riesgo es absorber lo de todos hasta perder tu propio cauce.",
    en: "You lead from listening. People open up with you — and your risk is absorbing everyone's weight until you lose your own course.",
  },
  aire: {
    es: "Lideras desde la perspectiva. Ves antes que los demás — y tu riesgo es quedarte a la altura de la idea sin bajar al cuerpo y al equipo.",
    en: "You lead from perspective. You see before others do — and your risk is staying at the altitude of the idea without landing in body and team.",
  },
};

/** The missing element is where the next work is — this frames the invitation. */
export const elementGap: Record<
  Exclude<ElementKey, "eter">,
  { es: string; en: string }
> = {
  tierra: {
    es: "Tierra es lo que menos aparece: arraigo, consistencia y confianza sostenida. Es el trabajo que te toca.",
    en: "Earth is what shows up least: grounding, consistency and sustained trust. That's the work ahead of you.",
  },
  fuego: {
    es: "Fuego es lo que menos aparece: visión, coraje y activación. Es el trabajo que te toca.",
    en: "Fire is what shows up least: vision, courage and activation. That's the work ahead of you.",
  },
  agua: {
    es: "Agua es lo que menos aparece: claridad emocional, flujo y profundidad. Es el trabajo que te toca.",
    en: "Water is what shows up least: emotional clarity, flow and depth. That's the work ahead of you.",
  },
  aire: {
    es: "Aire es lo que menos aparece: perspectiva, comunicación y libertad. Es el trabajo que te toca.",
    en: "Air is what shows up least: perspective, communication and freedom. That's the work ahead of you.",
  },
};
