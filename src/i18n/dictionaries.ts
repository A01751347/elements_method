import type { Locale } from "./config";

export interface Dict {
  nav: {
    home: string;
    about: string;
    paths: string;
    method: string;
    companies: string;
    retreats: string;
    blog: string;
    cta: string;
  };
  common: {
    learnMore: string;
    book: string;
    request: string;
    book_short: string;
    subscribe: string;
    enterEmail: string;
    seeAll: string;
    soon: string;
    noVat: string;
  };
  home: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    philosophyEyebrow: string;
    philosophyTitle: string;
    philosophyBody: string;
    elementsEyebrow: string;
    elementsTitle: string;
    elementsLead: string;
    experienceEyebrow: string;
    experienceTitle: string;
    experienceLead: string;
    testimonialsEyebrow: string;
    testimonialsTitle: string;
    companiesEyebrow: string;
    companiesTitle: string;
    companiesLead: string;
    companiesCta: string;
    logosEyebrow: string;
  };
  about: {
    eyebrow: string;
    title: string;
    lead: string;
  };
  paths: { eyebrow: string; title: string; lead: string };
  method: { eyebrow: string; title: string; lead: string };
  companies: {
    eyebrow: string;
    title: string;
    lead: string;
    benefits: { title: string; body: string }[];
    cta: string;
  };
  retreats: {
    eyebrow: string;
    title: string;
    lead: string;
    status: {
      open: string;
      lowSeats: string;
      closed: string;
      sold: string;
    };
  };
  blog: { eyebrow: string; title: string; lead: string; readMore: string };
  footer: {
    tagline: string;
    newsletterTitle: string;
    newsletterCopy: string;
    nav: { explore: string; services: string; legal: string };
    rights: string;
    privacy: string;
    cookies: string;
  };
  cookies: {
    title: string;
    body: string;
    accept: string;
    essential: string;
    settings: string;
  };
  language: { label: string; es: string; en: string };
}

export const es: Dict = {
  nav: {
    home: "Inicio",
    about: "Quiénes Somos",
    paths: "Programas",
    method: "El Método",
    companies: "Organizaciones",
    retreats: "Experiencias",
    blog: "Artículos",
    cta: "Reservar",
  },
  common: {
    learnMore: "Conocer más",
    book: "Aplicar",
    request: "Solicitar información",
    book_short: "Aplicar",
    subscribe: "Suscribirme",
    enterEmail: "Tu correo",
    seeAll: "Ver todos",
    soon: "Próximamente",
    noVat: "Inversión a confirmar",
  },
  home: {
    eyebrow: "Programas inmersivos basados en la naturaleza",
    title: "Tu camino hacia la maestría de tu ser",
    subtitle:
      "Un programa de desarrollo con impacto personal y profesional, basado en inmersiones en la naturaleza: devuelve a quienes lideran a su fuente esencial de poder.",
    primaryCta: "Descubre tu elemento dominante",
    philosophyEyebrow: "La filosofía",
    philosophyTitle: "La naturaleza no gestiona. La naturaleza lidera.",
    philosophyBody:
      "La naturaleza no tiene una crisis de liderazgo. Nosotros sí. Quizá porque dejamos de aprender de ella.",
    elementsEyebrow: "Los cuatro elementos",
    elementsTitle: "Cuatro fuerzas. Un líder integrado.",
    elementsLead:
      "Cuando un líder se reconecta con su propia naturaleza — cuando encuentra su Agua, su Fuego, su Aire y su Tierra, y aprende a integrarlos en su núcleo — no necesita más herramientas. Se reconecta con su ser completo.",
    experienceEyebrow: "La experiencia de inmersión",
    experienceTitle: "Las actividades cambian. La estructura no.",
    experienceLead:
      "Cada generación de retiro es irrepetible. Cada inmersión sigue el mismo arco: presencia, contacto con el elemento, metodología, reflexión, diálogo, integración.",
    testimonialsEyebrow: "Voces del programa",
    testimonialsTitle: "Lo que dicen quienes ya pasaron.",
    companiesEyebrow: "Para líderes y organizaciones",
    companiesTitle:
      "El nivel de resultados de una empresa no supera el nivel de claridad mental de quien la dirige.",
    companiesLead:
      "El mismo método, diseñado a la medida del equipo: inmersiones conjuntas, desarrollo de cultura de liderazgo y transformación organizacional.",
    companiesCta: "Iniciar conversación",
    logosEyebrow: "Han trabajado con nosotros",
  },
  about: {
    eyebrow: "Quiénes somos",
    title: "26 años escuchando a líderes en el Caribe, Estados Unidos y América Latina.",
    lead:
      "Elements Method nace de un patrón consistente identificado a lo largo de 26 años de trabajo con líderes: los más capaces son aquellos que viven en consciencia, con intención, y priorizan su trabajo interior.",
  },
  paths: {
    eyebrow: "Executive Experiences",
    title: "Elige tu experiencia.",
    lead:
      "Tres experiencias presenciales diseñadas por Elements Method para 2026: un día para entrar conscientemente en tu próxima etapa, un retiro inmersivo de liderazgo y un workshop intensivo de identidad y marca personal. Grupos reducidos, cupo limitado.",
  },
  method: {
    eyebrow: "El Método",
    title: "Cuatro elementos. Un Núcleo. Múltiples métodos que te conectan con tu estado interno.",
    lead:
      "La mayoría intenta cambiar sus resultados sin transformar el sistema interno desde donde los producen. Elements interviene ese sistema: los cuatro elementos como base, y tú, el Núcleo, como el centro que los integra.",
  },
  companies: {
    eyebrow: "Para líderes y organizaciones",
    title: "Programas a la medida para líderes y organizaciones.",
    lead:
      "El mismo método que transforma a una persona que lidera, diseñado a la medida del equipo que dirige: inmersiones conjuntas, cultura de liderazgo y transformación organizacional.",
    benefits: [
      {
        title: "Mejora medible en confianza de equipo y seguridad psicológica",
        body:
          "Indicadores documentados en organizaciones que invierten en desarrollo de liderazgo basado en naturaleza.",
      },
      {
        title: "Mayor calidad de comunicación y conflicto constructivo",
        body:
          "Equipos reportan mejor capacidad de sostener conversaciones difíciles tras los procesos elementales.",
      },
      {
        title: "Mayor retención de líderes desarrollados",
        body:
          "Reducción de riesgo de salida en líderes que completan el proceso.",
      },
      {
        title: "Respuestas más adaptativas e innovadoras a desafíos",
        body:
          "Culturas de liderazgo que atraen talento y sostienen alto desempeño.",
      },
    ],
    cta: "Solicitar conversación",
  },
  retreats: {
    eyebrow: "Próximas fechas",
    title: "Próximas experiencias.",
    lead:
      "El calendario 2026 de Elements Method Executive Experiences: EQUINOX en septiembre, Elements Awakening en octubre y SOUL Discovery en noviembre. Experiencias presenciales, de cupo limitado, diseñadas para profundizar sin saturar.",
    status: {
      open: "Abierto",
      lowSeats: "{n} cupos disponibles",
      closed: "Cerrado",
      sold: "Sin cupo",
    },
  },
  blog: {
    eyebrow: "Artículos",
    title: "Artículos de interés.",
    lead:
      "Profundización en la metodología, casos de nuestras inmersiones, estudios de neurociencia, PNL y psicología aplicados al liderazgo del ser.",
    readMore: "Leer artículo",
  },
  footer: {
    tagline:
      "Programas de liderazgo inmersivos en la naturaleza. La naturaleza no gestiona. La naturaleza lidera.",
    newsletterTitle: "Notas del campo",
    newsletterCopy:
      "Casos de éxito de nuestras inmersiones, los datos y estudios que sostienen la metodología, y artículos de neurociencia, PNL y psicología aplicados al liderazgo del ser. Una nota al mes, sin ruido.",
    nav: {
      explore: "Explorar",
      services: "Programas",
      legal: "Legal",
    },
    rights: "Todos los derechos reservados",
    privacy: "Aviso de privacidad",
    cookies: "Preferencias de cookies",
  },
  cookies: {
    title: "Cookies en este sitio.",
    body:
      "Usamos cookies necesarias para que el sitio funcione. Las de analítica y marketing solo se activan si las aceptas.",
    accept: "Aceptar todas",
    essential: "Solo necesarias",
    settings: "Configurar",
  },
  language: {
    label: "Idioma",
    es: "Español",
    en: "English",
  },
};

export const en: Dict = {
  nav: {
    home: "Home",
    about: "Who We Are",
    paths: "Programs",
    method: "The Method",
    companies: "Organizations",
    retreats: "Experiences",
    blog: "Articles",
    cta: "Reserve",
  },
  common: {
    learnMore: "Learn more",
    book: "Apply",
    request: "Request information",
    book_short: "Apply",
    subscribe: "Subscribe",
    enterEmail: "Your email",
    seeAll: "See all",
    soon: "Coming soon",
    noVat: "Investment TBD",
  },
  home: {
    eyebrow: "Leadership Immersion Programs · Water · Fire · Air · Earth",
    title: "Lead from your true nature",
    subtitle:
      "A development program with personal and professional impact, built on nature immersions: it returns those who lead to their essential source of power.",
    primaryCta: "Discover your dominant element",
    philosophyEyebrow: "The philosophy",
    philosophyTitle: "Nature doesn't manage. Nature leads.",
    philosophyBody:
      "Nature doesn't have a leadership crisis. We do. Perhaps because we stopped learning from it.",
    elementsEyebrow: "The four elements",
    elementsTitle: "Four forces. One integrated leader.",
    elementsLead:
      "When a leader reconnects with their own nature — when they find their Water, their Fire, their Air and their Earth, and learn to integrate them in their core — they don't need more tools. They reconnect with their complete being.",
    experienceEyebrow: "The immersion experience",
    experienceTitle: "Activities change. The structure doesn't.",
    experienceLead:
      "Every retreat generation is unrepeatable. Each immersion follows the same arc: presence, contact with the element, methodology, reflection, dialogue, integration.",
    testimonialsEyebrow: "Program voices",
    testimonialsTitle: "What those who walked through say.",
    companiesEyebrow: "For leaders and organizations",
    companiesTitle:
      "An organization's results do not exceed the mental clarity of the person who leads it.",
    companiesLead:
      "The same method, built to fit the team: joint immersions, leadership-culture development and organizational transformation.",
    companiesCta: "Begin the conversation",
    logosEyebrow: "Have worked with us",
  },
  about: {
    eyebrow: "Who we are",
    title: "26 years listening to leaders across the Caribbean, the United States, and Latin America.",
    lead:
      "Elements Method was born from a consistent pattern identified over 26 years of work with leaders: the most capable are those who live with consciousness, with intention, and who prioritize their inner work.",
  },
  paths: {
    eyebrow: "Executive Experiences",
    title: "Choose your experience.",
    lead:
      "Three in-person experiences designed by Elements Method for 2026: one day to enter your next season consciously, an immersive leadership retreat, and an intensive identity and personal-branding workshop. Small groups, limited seats.",
  },
  method: {
    eyebrow: "The Method",
    title: "Four elements. One Core. Multiple methods that connect you to your inner state.",
    lead:
      "Most try to change their results without transforming the inner system that produces them. Elements intervenes in that system: the four elements as its base, and you, the Core, as the centre that integrates them.",
  },
  companies: {
    eyebrow: "For leaders and organizations",
    title: "Bespoke programs for leaders and organizations.",
    lead:
      "The same method that transforms the person who leads, built to fit the team they lead: joint immersions, leadership culture and organizational transformation.",
    benefits: [
      {
        title: "Measurable improvement in team trust and psychological safety",
        body:
          "Documented indicators in organizations investing in nature-based leadership development.",
      },
      {
        title: "Stronger quality of communication and constructive conflict",
        body:
          "Teams report better capacity to sustain difficult conversations after elemental processes.",
      },
      {
        title: "Higher retention of developed leaders",
        body:
          "Reduced flight risk in leaders who complete the full process.",
      },
      {
        title: "More adaptive, innovative responses to organizational challenges",
        body:
          "Leadership cultures that attract talent and sustain high performance.",
      },
    ],
    cta: "Request a conversation",
  },
  retreats: {
    eyebrow: "Upcoming dates",
    title: "Upcoming experiences.",
    lead:
      "The 2026 calendar of Elements Method Executive Experiences: EQUINOX in September, Elements Awakening in October and SOUL Discovery in November. In-person experiences with limited seats, designed to go deep without saturating.",
    status: {
      open: "Open",
      lowSeats: "{n} seats left",
      closed: "Closed",
      sold: "Sold out",
    },
  },
  blog: {
    eyebrow: "Articles",
    title: "Articles worth your time.",
    lead:
      "Deep dives into the methodology, cases from our immersions, and studies in neuroscience, NLP and psychology applied to the leadership of the self.",
    readMore: "Read article",
  },
  footer: {
    tagline:
      "Leadership Immersion Programs. Nature doesn't manage. Nature leads.",
    newsletterTitle: "Field notes",
    newsletterCopy:
      "Success stories from our immersions, the data and studies behind the methodology, and articles on neuroscience, NLP and psychology applied to the leadership of the self. One note a month, no noise.",
    nav: {
      explore: "Explore",
      services: "Programs",
      legal: "Legal",
    },
    rights: "All rights reserved",
    privacy: "Privacy notice",
    cookies: "Cookie preferences",
  },
  cookies: {
    title: "Cookies on this site.",
    body:
      "We use necessary cookies for the site to work. Analytics and marketing cookies only run if you accept them.",
    accept: "Accept all",
    essential: "Only essential",
    settings: "Settings",
  },
  language: {
    label: "Language",
    es: "Español",
    en: "English",
  },
};

const dictionaries: Record<Locale, Dict> = { es, en };

export function getDictionary(locale: Locale): Dict {
  return dictionaries[locale] ?? dictionaries.es;
}
