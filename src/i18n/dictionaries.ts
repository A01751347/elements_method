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
    secondaryCta: string;
    philosophyEyebrow: string;
    philosophyTitle: string;
    philosophyBody: string;
    elementsEyebrow: string;
    elementsTitle: string;
    elementsLead: string;
    programsEyebrow: string;
    programsTitle: string;
    programsLead: string;
    experienceEyebrow: string;
    experienceTitle: string;
    experienceLead: string;
    retreatsEyebrow: string;
    retreatsTitle: string;
    retreatsLead: string;
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
    retreats: "Experiencia",
    blog: "Artículos",
    cta: "Cotizar para mi organización",
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
      "Elements Method es un programa de desarrollo personal con impacto profesional, basado en inmersiones en la naturaleza. Está diseñado para devolver a las personas —especialmente a quienes lideran— a su fuente esencial de poder, y en ese proceso transformar no solo al individuo, sino a sus entornos y a las organizaciones que lo rodean.",
    primaryCta: "Descubre tu elemento",
    secondaryCta: "Explorar programas",
    philosophyEyebrow: "La filosofía",
    philosophyTitle: "La naturaleza no gestiona. La naturaleza lidera.",
    philosophyBody:
      "La naturaleza no tiene una crisis de liderazgo. Nosotros sí. Quizá porque dejamos de aprender de ella.",
    elementsEyebrow: "Los cinco elementos",
    elementsTitle: "Cinco fuerzas. Un líder integrado.",
    elementsLead:
      "Cuando un líder se reconecta con su propia naturaleza — cuando encuentra su Agua, su Fuego, su Aire y su Tierra, y aprende a integrarlos en el Éter — no necesita más herramientas. Se reconecta con su ser completo.",
    programsEyebrow: "Elige tu Camino",
    programsTitle: "Distintos niveles de profundidad. Un mismo método.",
    programsLead:
      "Fluir, Momentum, Raíz, Brújula y Oneness comparten metodología y framework. Lo que cambia es la duración, la cadencia, la profundidad y el grado de personalización. Eliges según tu momento y el resultado que buscas.",
    experienceEyebrow: "La experiencia de inmersión",
    experienceTitle: "Las actividades cambian. La estructura no.",
    experienceLead:
      "Cada generación de retiro es irrepetible. Cada inmersión sigue el mismo arco: presencia, contacto con el elemento, metodología, reflexión, diálogo, integración.",
    retreatsEyebrow: "Calendario",
    retreatsTitle: "Inmersiones por elemento.",
    retreatsLead:
      "Inmersiones presenciales de día completo en entornos naturales seleccionados. Cupo limitado a 15 líderes.",
    testimonialsEyebrow: "Voces del programa",
    testimonialsTitle: "Lo que dicen quienes ya pasaron.",
    companiesEyebrow: "Para organizaciones",
    companiesTitle:
      "El nivel de resultados de una empresa no supera el nivel de claridad mental de quien la dirige.",
    companiesLead:
      "Origin — retiros corporativos diseñados a la medida alrededor de inmersiones de equipo, desarrollo de cultura de liderazgo y transformación organizacional.",
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
    eyebrow: "Programas",
    title: "Elige tu Camino.",
    lead:
      "Fluir, Momentum, Raíz, Brújula y Oneness comparten metodología y framework. Lo que cambia es la duración, la cadencia, la profundidad y el grado de personalización.",
  },
  method: {
    eyebrow: "El Método",
    title: "Cinco elementos. Un Núcleo. Múltiples métodos que te conectan con tu estado interno.",
    lead:
      "La mayoría intenta cambiar sus resultados sin transformar el sistema interno desde donde los producen. Elements interviene ese sistema usando los cinco elementos —Agua, Fuego, Aire, Tierra y el Éter que los integra— como base, la naturaleza como entorno interno y externo, y metodologías que integran neurociencia, psicología y un liderazgo expansivo, adaptativo y humano. Todo en búsqueda de tus mejores resultados.",
  },
  companies: {
    eyebrow: "Organizaciones",
    title: "Origin — Retiros corporativos hechos a la medida.",
    lead:
      "Elements Method ofrece programas organizacionales hechos a la medida, diseñados alrededor de inmersiones de equipo, desarrollo de cultura de liderazgo y transformación organizacional. Un programa puede llevar a un equipo directivo completo a través del marco de los Cinco Elementos.",
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
    eyebrow: "La experiencia",
    title: "Cuatro inmersiones por elemento.",
    lead:
      "Cada inmersión sigue el mismo arco de seis fases: Liberación, Encuentro, Metodología, Reflexión, Diálogo, Integración. Las actividades cambian — la estructura no.",
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
      "Lecturas breves desde las inmersiones, las sesiones de coaching y las conversaciones de descubrimiento. Próximamente.",
    readMore: "Leer artículo",
  },
  footer: {
    tagline:
      "Leadership Immersion Programs. La naturaleza no gestiona. La naturaleza lidera.",
    newsletterTitle: "Notas del campo",
    newsletterCopy:
      "Notas ocasionales desde las inmersiones y las próximas fechas. Cuando haya algo que valga la pena escribir.",
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
    retreats: "Experience",
    blog: "Articles",
    cta: "Quote for my organization",
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
      "Elements Method is a leadership development program built on nature immersions, designed to return leaders to their essential source of power — and in that process, transform not only the individuals, but the organizations they lead.",
    primaryCta: "Discover your element",
    secondaryCta: "Explore programs",
    philosophyEyebrow: "The philosophy",
    philosophyTitle: "Nature doesn't manage. Nature leads.",
    philosophyBody:
      "Nature doesn't have a leadership crisis. We do. Perhaps because we stopped learning from it.",
    elementsEyebrow: "The five elements",
    elementsTitle: "Five forces. One integrated leader.",
    elementsLead:
      "When a leader reconnects with their own nature — when they find their Water, their Fire, their Air and their Earth, and learn to integrate them in Ether — they don't need more tools. They reconnect with their complete being.",
    programsEyebrow: "Choose your Journey",
    programsTitle: "Different depths. One method.",
    programsLead:
      "Flow, Momentum, Root, Compass and Oneness share methodology and framework. What changes is duration, cadence, depth, and the degree of personalization. You choose by your moment and the result you're after.",
    experienceEyebrow: "The immersion experience",
    experienceTitle: "Activities change. The structure doesn't.",
    experienceLead:
      "Every retreat generation is unrepeatable. Each immersion follows the same arc: presence, contact with the element, methodology, reflection, dialogue, integration.",
    retreatsEyebrow: "Calendar",
    retreatsTitle: "Immersions by element.",
    retreatsLead:
      "Full-day in-person immersions in curated natural environments. Capacity capped at 15 leaders.",
    testimonialsEyebrow: "Program voices",
    testimonialsTitle: "What those who walked through say.",
    companiesEyebrow: "For organizations",
    companiesTitle:
      "An organization's results do not exceed the mental clarity of the person who leads it.",
    companiesLead:
      "Origin — bespoke corporate retreats designed around team immersions, leadership culture development, and organizational transformation.",
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
    eyebrow: "Programs",
    title: "Choose your Journey.",
    lead:
      "Flow, Momentum, Root, Compass and Oneness share methodology and framework. What changes is duration, cadence, depth and the degree of personalization.",
  },
  method: {
    eyebrow: "The Method",
    title: "Five elements. One Nucleus. Multiple methods that connect you to your inner state.",
    lead:
      "Most try to change their results without transforming the inner system that produces them. Elements intervenes in that system using the five elements —Water, Fire, Air, Earth and the Ether that integrates them— as its base, nature as both inner and outer environment, and methodologies that integrate neuroscience, psychology and an expansive, adaptive, human leadership. All in pursuit of your best results.",
  },
  companies: {
    eyebrow: "Organizations",
    title: "Origin — Bespoke corporate retreats.",
    lead:
      "Elements Method offers bespoke organizational programs designed around team immersions, leadership culture development, and organizational transformation. A single program can bring an entire leadership team through the Five Elements framework.",
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
    eyebrow: "The experience",
    title: "Four immersions per element.",
    lead:
      "Each immersion follows the same six-phase arc: Release, Encounter, Methodology, Reflection, Dialogue, Integration. The activities change — the structure does not.",
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
      "Short reads from immersions, coaching sessions and discovery conversations. Coming soon.",
    readMore: "Read article",
  },
  footer: {
    tagline:
      "Leadership Immersion Programs. Nature doesn't manage. Nature leads.",
    newsletterTitle: "Field notes",
    newsletterCopy:
      "Occasional notes from the immersions and upcoming dates. When there's something worth writing.",
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
