/**
 * Default forms (RF-FRM-06): inicio, durante, cierre.
 * The cierre form has a "shareable phrase" field that feeds testimonials.
 */

interface FormField {
  key: string;
  type:
    | "short_text"
    | "long_text"
    | "single_choice"
    | "multi_choice"
    | "scale"
    | "nps"
    | "date"
    | "email"
    | "number"
    | "rating";
  labelEs: string;
  labelEn: string;
  required: boolean;
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  /** marks this field's content as shareable (testimonial source) */
  shareablePhrase?: boolean;
}

interface FormSeed {
  slug: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string | null;
  descriptionEn: string | null;
  category: "inicio" | "durante" | "cierre" | "custom";
  isAnonymous: boolean;
  fields: FormField[];
}

export const formSeeds: FormSeed[] = [
  {
    slug: "cuestionario-inicio",
    titleEs: "Cuestionario de inicio",
    titleEn: "Opening questionnaire",
    descriptionEs:
      "Una calibración antes de empezar. Lo que respondas no será compartido con el grupo a menos que tú lo decidas.",
    descriptionEn:
      "A calibration before we begin. What you answer will not be shared with the group unless you decide so.",
    category: "inicio",
    isAnonymous: false,
    fields: [
      {
        key: "name",
        type: "short_text",
        labelEs: "Tu nombre",
        labelEn: "Your name",
        required: true,
      },
      {
        key: "leadership_challenge",
        type: "long_text",
        labelEs: "¿Cuál es el reto de liderazgo más vivo para ti hoy?",
        labelEn: "What is the most alive leadership challenge for you today?",
        required: true,
      },
      {
        key: "intention",
        type: "long_text",
        labelEs: "¿Con qué intención llegas a esta inmersión?",
        labelEn: "What intention are you bringing to this immersion?",
        required: true,
      },
      {
        key: "energy_today",
        type: "scale",
        labelEs: "Nivel de energía / claridad hoy (0–10)",
        labelEn: "Energy / clarity level today (0–10)",
        required: false,
        scaleMin: 0,
        scaleMax: 10,
      },
    ],
  },
  {
    slug: "cuestionario-durante",
    titleEs: "Cuestionario durante experiencia",
    titleEn: "Mid-experience questionnaire",
    descriptionEs:
      "Un check-in mientras el proceso está vivo. Brevedad bienvenida.",
    descriptionEn: "A check-in while the process is alive. Brevity welcome.",
    category: "durante",
    isAnonymous: false,
    fields: [
      {
        key: "what_arose",
        type: "long_text",
        labelEs: "¿Qué está surgiendo que no esperabas?",
        labelEn: "What is arising that you didn't expect?",
        required: true,
      },
      {
        key: "edge",
        type: "long_text",
        labelEs: "¿Dónde está tu filo en este momento?",
        labelEn: "Where is your edge right now?",
        required: false,
      },
      {
        key: "presence",
        type: "scale",
        labelEs: "Presencia ahora (0–10)",
        labelEn: "Presence right now (0–10)",
        required: false,
        scaleMin: 0,
        scaleMax: 10,
      },
    ],
  },
  {
    slug: "cuestionario-cierre",
    titleEs: "Cuestionario de cierre",
    titleEn: "Closing questionnaire",
    descriptionEs:
      "Tu reflexión final. La frase final puede ser compartida públicamente si así lo eliges.",
    descriptionEn:
      "Your final reflection. The closing phrase may be shared publicly if you so choose.",
    category: "cierre",
    isAnonymous: false,
    fields: [
      {
        key: "shift",
        type: "long_text",
        labelEs: "¿Qué cambió en ti durante este proceso?",
        labelEn: "What shifted in you during this process?",
        required: true,
      },
      {
        key: "commitment",
        type: "long_text",
        labelEs: "¿Cuál es tu compromiso al regresar?",
        labelEn: "What is your commitment as you return?",
        required: true,
      },
      {
        key: "nps",
        type: "nps",
        labelEs:
          "¿Qué tan probable es que recomiendes Elements a otro líder? (0–10)",
        labelEn: "How likely are you to recommend Elements to another leader? (0–10)",
        required: true,
      },
      {
        key: "shareable_phrase",
        type: "long_text",
        labelEs:
          "Una frase que resume tu experiencia (compartible públicamente con tu autorización)",
        labelEn:
          "One phrase summarizing your experience (publicly shareable with your authorization)",
        required: false,
        shareablePhrase: true,
      },
      {
        key: "allow_publication",
        type: "single_choice",
        labelEs: "¿Autorizas publicar esa frase con tu nombre/cargo/empresa?",
        labelEn: "Do you authorize publishing that phrase with your name/role/company?",
        required: true,
        options: ["Sí, con mi nombre y cargo", "Sí, anónimo", "No"],
      },
    ],
  },
];
