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
    paths: "Programas",
    method: "El Método",
    companies: "Organizaciones",
    retreats: "Módulos",
    blog: "Diario",
    cta: "Cotizar para mi organización",
  },
  common: {
    learnMore: "Conocer más",
    book: "Aplicar",
    request: "Solicitar cotización",
    book_short: "Aplicar",
    subscribe: "Suscribirme",
    enterEmail: "Tu correo",
    seeAll: "Ver todos",
    soon: "Próximamente",
    noVat: "no incluye IVA",
  },
  home: {
    eyebrow: "Leadership Immersion Programs · Water · Fire · Air · Earth",
    title: "Mejor pensamiento. Mejores decisiones. Mejor liderazgo.",
    subtitle:
      "Elements Method es una intervención estratégica diseñada para fortalecer la calidad de pensamiento, la regulación emocional y la capacidad de decisión del líder moderno. Trabajamos sobre el sistema interno desde donde se decide — no sobre la empresa.",
    primaryCta: "Conocer los programas",
    secondaryCta: "Próximos módulos",
    elementsEyebrow: "El método",
    elementsTitle: "Cuatro elementos. Cuatro dimensiones del liderazgo.",
    elementsLead:
      "Tierra, fuego, agua y aire como marco para entrenar identidad, acción, regulación y perspectiva. Cada elemento integra coaching internacional, neurociencia, PNL, prácticas somáticas y frameworks estratégicos.",
    retreatsEyebrow: "Calendario 2026",
    retreatsTitle: "Módulos de un día por elemento.",
    retreatsLead:
      "Inmersiones intensivas de día completo en naturaleza. Un elemento por sesión. Cupo limitado a 15 líderes — porque el método requiere intimidad para funcionar.",
    testimonialsEyebrow: "Voces del programa",
    testimonialsTitle: "Lo que dicen quienes ya pasaron.",
    companiesEyebrow: "Para tu organización",
    companiesTitle: "El nivel de tu organización no excede el nivel de claridad mental de quien la dirige.",
    companiesLead:
      "Diseñamos programas corporativos a la medida para equipos directivos. Diagnóstico con dirección y RH, propuesta personalizada, cotización con desglose. Indicadores claros desde el inicio.",
    companiesCta: "Construir una cotización",
    logosEyebrow: "Han trabajado con nosotros",
  },
  about: {
    eyebrow: "Quiénes somos",
    title: "Lorem ipsum dolor sit amet.",
    lead:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. (Bio de los cofundadores pendiente.)",
    andres: {
      role: "Cofundador · [rol pendiente]",
      bio:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    },
    michelle: {
      role: "Cofundadora · [rol pendiente]",
      bio:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    },
  },
  paths: {
    eyebrow: "Programas",
    title: "Tres rutas. Tres profundidades.",
    lead:
      "Roots, Current y Source comparten metodología y framework. Lo que cambia es la cadencia, el formato y el nivel de personalización. Eliges según el momento de tu liderazgo.",
  },
  method: {
    eyebrow: "El método",
    title: "Cuatro elementos. Una intervención en el estado interno.",
    lead:
      "La mayoría de las personas intenta cambiar sus resultados sin transformar el sistema interno desde el que los producen. Elements interviene ese sistema — usando los cuatro elementos como gramática y la naturaleza como metodología.",
  },
  companies: {
    eyebrow: "Organizaciones",
    title: "El nivel de resultados de una empresa no excede el nivel de claridad mental de quien la dirige.",
    lead:
      "Elements Method ofrece programas corporativos a la medida diseñados alrededor de inmersiones de equipo, desarrollo de cultura de liderazgo y transformación organizacional. Un programa puede llevar a un equipo directivo completo a través del marco de los Cuatro Elementos, creando lenguaje compartido, confianza y cultura alineada.",
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
          "Reducción de riesgo de salida en los líderes que pasan por el proceso completo.",
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
    eyebrow: "Módulos",
    title: "Calendario de inmersiones por elemento.",
    lead:
      "Cada módulo es una inmersión intensiva de un día completo enfocada en un solo elemento. Diseño basado en el Disconnection Protocol: Release, Encounter, Reflection, Dialogue, Integration.",
    status: {
      open: "Abierto",
      lowSeats: "{n} cupos disponibles",
      closed: "Cerrado",
      sold: "Sin cupo",
    },
  },
  blog: {
    eyebrow: "Diario",
    title: "Notas sobre pensamiento, decisión y liderazgo.",
    lead:
      "Lecturas breves sobre lo que vemos en sesiones, inmersiones y conversaciones de discovery. Sin coaching genérico, sin tips reciclados.",
    readMore: "Leer artículo",
  },
  footer: {
    tagline:
      "Leadership Immersion Programs. Una intervención estratégica para la calidad de pensamiento del líder moderno.",
    newsletterTitle: "Boletín mensual",
    newsletterCopy:
      "Una nota corta cada mes. Lectura, fecha del próximo módulo, una pregunta abierta. Sin venta.",
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
    retreats: "Modules",
    blog: "Journal",
    cta: "Quote for my organization",
  },
  common: {
    learnMore: "Learn more",
    book: "Apply",
    request: "Request a quote",
    book_short: "Apply",
    subscribe: "Subscribe",
    enterEmail: "Your email",
    seeAll: "See all",
    soon: "Coming soon",
    noVat: "VAT not included",
  },
  home: {
    eyebrow: "Leadership Immersion Programs · Water · Fire · Air · Earth",
    title: "Better thinking. Better decisions. Better leadership.",
    subtitle:
      "Elements Method is a strategic intervention designed to strengthen the quality of thinking, emotional regulation and decision-making capacity of the modern leader. We work on the inner system you decide from — not on the company.",
    primaryCta: "See the programs",
    secondaryCta: "Upcoming modules",
    elementsEyebrow: "The method",
    elementsTitle: "Four elements. Four leadership dimensions.",
    elementsLead:
      "Earth, fire, water and air as a framework to train identity, action, regulation and perspective. Each element integrates international coaching, neuroscience, NLP, somatic practices and strategic frameworks.",
    retreatsEyebrow: "2026 calendar",
    retreatsTitle: "One-day modules by element.",
    retreatsLead:
      "Full-day intensive nature immersions. One element per session. Capacity capped at 15 leaders — because the method requires intimacy to work.",
    testimonialsEyebrow: "Program voices",
    testimonialsTitle: "What those who walked through say.",
    companiesEyebrow: "For your organization",
    companiesTitle: "Your organization doesn't exceed the mental clarity of those who lead it.",
    companiesLead:
      "We design custom corporate programs for executive teams. Discovery with leadership and HR, personalized proposal, itemized quote. Clear indicators from the start.",
    companiesCta: "Build a quote",
    logosEyebrow: "Have worked with us",
  },
  about: {
    eyebrow: "Who we are",
    title: "Lorem ipsum dolor sit amet.",
    lead:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. (Founders' bios pending.)",
    andres: {
      role: "Cofounder · [role TBD]",
      bio:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    },
    michelle: {
      role: "Cofounder · [role TBD]",
      bio:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    },
  },
  paths: {
    eyebrow: "Programs",
    title: "Three routes. Three depths.",
    lead:
      "Roots, Current and Source share methodology and framework. What changes is cadence, format and level of personalization. You choose based on your leadership moment.",
  },
  method: {
    eyebrow: "The method",
    title: "Four elements. An intervention in the inner state.",
    lead:
      "Most people try to change their results without transforming the inner system that produces them. Elements intervenes that system — using the four elements as grammar and nature as methodology.",
  },
  companies: {
    eyebrow: "Organizations",
    title: "An organization's results do not exceed the mental clarity of those who lead it.",
    lead:
      "Elements Method offers bespoke organizational programs designed around team immersions, leadership culture development, and organizational transformation. A single corporate program can bring an entire leadership team through the Four Elements framework, creating shared language, deepened trust, and aligned organizational culture.",
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
    eyebrow: "Modules",
    title: "Element-based immersion calendar.",
    lead:
      "Each module is a full-day intensive immersion focused on a single element. Design based on the Disconnection Protocol: Release, Encounter, Reflection, Dialogue, Integration.",
    status: {
      open: "Open",
      lowSeats: "{n} seats left",
      closed: "Closed",
      sold: "Sold out",
    },
  },
  blog: {
    eyebrow: "Journal",
    title: "Notes on thinking, decision and leadership.",
    lead:
      "Short reads on what we see in sessions, immersions and discovery conversations. No generic coaching, no recycled tips.",
    readMore: "Read article",
  },
  footer: {
    tagline:
      "Leadership Immersion Programs. A strategic intervention for the modern leader's quality of thinking.",
    newsletterTitle: "Monthly journal",
    newsletterCopy:
      "A short note each month. Reading, next module date, an open question. No selling.",
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
