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
    elementsEyebrow: string;
    elementsTitle: string;
    elementsLead: string;
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
    andres: { role: string; bio: string };
    michelle: { role: string; bio: string };
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
    paths: "Los Caminos",
    method: "El Método",
    companies: "Empresas",
    retreats: "Retiros",
    blog: "Blog",
    cta: "Cotizar para tu equipo",
  },
  common: {
    learnMore: "Conocer más",
    book: "Comprar",
    request: "Solicitar cotización",
    book_short: "Comprar",
    subscribe: "Suscribirme",
    enterEmail: "Tu correo",
    seeAll: "Ver todos",
    soon: "Próximamente",
    noVat: "no incluye IVA",
  },
  home: {
    eyebrow: "Liderazgo experiencial · Reconexión con los cuatro elementos",
    title: "Lidera desde los cuatro elementos.",
    subtitle:
      "Un método para devolver tu liderazgo al ritmo de la naturaleza. Agua, fuego, aire y tierra como territorios entrenables: cascada al amanecer, breathwork, hoguera, caminata silenciosa, ceremonia y silencio. Para quienes ya no se conforman con teoría.",
    primaryCta: "Explorar los caminos",
    secondaryCta: "Próximos retiros",
    elementsEyebrow: "El método",
    elementsTitle: "Cuatro fuerzas, una práctica integrada.",
    elementsLead:
      "Cada elemento se entrena con un marco propio, prácticas corporales y herramientas de liderazgo. No es metáfora; es operación.",
    retreatsEyebrow: "Calendario 2026",
    retreatsTitle: "Inmersiones presenciales.",
    retreatsLead:
      "Retiros guiados en locaciones diseñadas para integrar el método. Cupos limitados.",
    testimonialsEyebrow: "Voces del programa",
    testimonialsTitle: "Lo que cuenta quien ya lo vivió.",
    companiesEyebrow: "Para tu organización",
    companiesTitle: "Cuando el equipo necesita liderazgo de verdad.",
    companiesLead:
      "Diseñamos programas para equipos directivos y mandos medios. Calculadora con desglose, contrato y cotización en minutos.",
    companiesCta: "Construir una cotización",
    logosEyebrow: "Confían en el método",
  },
  about: {
    eyebrow: "Quiénes somos",
    title: "Dos prácticas, una misma raíz.",
    lead:
      "Andrés y Ana Michelle crearon Elements Method para ofrecer un camino exigente, simbólico y profundamente práctico al liderazgo contemporáneo.",
    andres: {
      role: "Coach ejecutivo · Cofundador",
      bio:
        "Diez años acompañando equipos directivos en transición. Andrés trabaja desde la activación —fuego y tierra— para que la decisión se traduzca en movimiento.",
    },
    michelle: {
      role: "Facilitadora · Cofundadora",
      bio:
        "Especialista en cuerpo, voz y presencia. Michelle abre el agua y el aire: lo que se escucha y lo que se respira antes de decidir.",
    },
  },
  paths: {
    eyebrow: "Los caminos",
    title: "Tres formas de entrar.",
    lead:
      "Cada camino tiene una geometría distinta. Elige según tu calendario, tu intensidad y la conversación que tu liderazgo necesita ahora.",
  },
  method: {
    eyebrow: "El método",
    title: "Cuatro elementos. Una práctica.",
    lead:
      "Cada elemento se trabaja en cuatro capas: la naturaleza, la persona, la metodología y la fisiología. Lo simbólico no sustituye lo concreto; lo organiza.",
  },
  companies: {
    eyebrow: "Empresas",
    title: "Liderazgo medible para equipos exigentes.",
    lead:
      "Diseñamos programas para mandos medios y dirección. Combinamos sesiones, inmersiones y seguimiento individual. Cotización transparente, fórmula visible.",
    benefits: [
      {
        title: "Diagnóstico previo",
        body:
          "Conversamos con dirección y un muestreo del equipo antes de proponer.",
      },
      {
        title: "Modalidad híbrida",
        body:
          "Presencial donde se requiere intensidad, virtual donde se requiere continuidad.",
      },
      {
        title: "Indicadores claros",
        body:
          "Comunicación, decisión, sostenimiento. Lo que se mide se sostiene.",
      },
      {
        title: "Documentación formal",
        body:
          "Contrato, NDA y comprobante fiscal. Operamos como proveedor serio.",
      },
    ],
    cta: "Ir a la calculadora",
  },
  retreats: {
    eyebrow: "Retiros",
    title: "Calendario de inmersiones.",
    lead:
      "Sesiones presenciales multi-día que cubren los cuatro elementos en una sola experiencia.",
    status: {
      open: "Abierto",
      lowSeats: "{n} cupos disponibles",
      closed: "Cerrado",
      sold: "Sin cupo",
    },
  },
  blog: {
    eyebrow: "Diario",
    title: "Notas desde el método.",
    lead:
      "Lecturas breves sobre liderazgo, atención, cuerpo y decisiones difíciles. Sin frecuencia obligatoria.",
    readMore: "Leer artículo",
  },
  footer: {
    tagline:
      "Programa de liderazgo experiencial articulado en los cuatro elementos.",
    newsletterTitle: "Boletín mensual",
    newsletterCopy:
      "Una nota breve cada mes. Lectura, fecha de próximo retiro, una pregunta abierta.",
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
    paths: "The Paths",
    method: "The Method",
    companies: "Companies",
    retreats: "Retreats",
    blog: "Journal",
    cta: "Quote for your team",
  },
  common: {
    learnMore: "Learn more",
    book: "Book",
    request: "Request a quote",
    book_short: "Book",
    subscribe: "Subscribe",
    enterEmail: "Your email",
    seeAll: "See all",
    soon: "Coming soon",
    noVat: "VAT not included",
  },
  home: {
    eyebrow: "Experiential leadership · Reconnection with the four elements",
    title: "Lead from the four elements.",
    subtitle:
      "A method to return your leadership to the rhythm of nature. Water, fire, air and earth as trainable terrains: waterfall at dawn, breathwork, bonfire, silent hike, ceremony and silence. For those no longer satisfied with theory.",
    primaryCta: "Explore the paths",
    secondaryCta: "Upcoming retreats",
    elementsEyebrow: "The method",
    elementsTitle: "Four forces, one integrated practice.",
    elementsLead:
      "Each element is trained with its own framework, embodied practices and leadership tools. Not metaphor — operation.",
    retreatsEyebrow: "2026 calendar",
    retreatsTitle: "In-person immersions.",
    retreatsLead:
      "Guided retreats in locations chosen to integrate the method. Limited seats.",
    testimonialsEyebrow: "Voices",
    testimonialsTitle: "From those who already walked it.",
    companiesEyebrow: "For your organization",
    companiesTitle: "When the team needs real leadership.",
    companiesLead:
      "We design programs for executive teams and middle management. Quote with full breakdown in minutes.",
    companiesCta: "Build a quote",
    logosEyebrow: "Trusted by",
  },
  about: {
    eyebrow: "Who we are",
    title: "Two practices, one root.",
    lead:
      "Andrés and Ana Michelle created Elements Method to offer a demanding, symbolic and deeply practical path to contemporary leadership.",
    andres: {
      role: "Executive coach · Cofounder",
      bio:
        "Ten years guiding leadership teams through transition. Andrés works from activation — fire and earth — so decisions become movement.",
    },
    michelle: {
      role: "Facilitator · Cofounder",
      bio:
        "Specialist in body, voice and presence. Michelle opens water and air: what is heard and what is breathed before deciding.",
    },
  },
  paths: {
    eyebrow: "The paths",
    title: "Three ways to enter.",
    lead:
      "Each path has its own geometry. Choose by calendar, intensity, and the conversation your leadership needs now.",
  },
  method: {
    eyebrow: "The method",
    title: "Four elements. One practice.",
    lead:
      "Each element is worked across four layers: nature, person, methodology, physiology. The symbolic doesn't replace the concrete; it organizes it.",
  },
  companies: {
    eyebrow: "Companies",
    title: "Measurable leadership for demanding teams.",
    lead:
      "Programs for management teams. Sessions, immersions and individual follow-up. Transparent quote, visible formula.",
    benefits: [
      {
        title: "Prior diagnosis",
        body: "We talk with leadership and a sample of the team before proposing.",
      },
      {
        title: "Hybrid format",
        body:
          "In-person where intensity is required, virtual where continuity is required.",
      },
      {
        title: "Clear indicators",
        body:
          "Communication, decision, sustainment. What gets measured gets sustained.",
      },
      {
        title: "Formal documentation",
        body: "Contract, NDA and tax invoice. We operate as a serious vendor.",
      },
    ],
    cta: "Go to the calculator",
  },
  retreats: {
    eyebrow: "Retreats",
    title: "Immersion calendar.",
    lead:
      "Multi-day in-person sessions that cover the four elements in a single experience.",
    status: {
      open: "Open",
      lowSeats: "{n} seats left",
      closed: "Closed",
      sold: "Sold out",
    },
  },
  blog: {
    eyebrow: "Journal",
    title: "Notes from the method.",
    lead:
      "Short reads on leadership, attention, body and hard decisions. No mandatory cadence.",
    readMore: "Read article",
  },
  footer: {
    tagline:
      "Experiential leadership program articulated around the four elements.",
    newsletterTitle: "Monthly journal",
    newsletterCopy:
      "A short note each month. A reading, the next retreat date, an open question.",
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
