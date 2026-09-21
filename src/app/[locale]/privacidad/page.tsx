import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { pageMetadata, ROUTES } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Section, Eyebrow } from "@/components/ui/Section";
import { ArcoRightLinks } from "@/components/legal/ArcoRightLinks";
import { getContactInfo } from "@/modules/content/contact";
import { contactInfo as staticContact } from "@/data/launchData";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({
    locale,
    route: ROUTES.privacy,
    title: locale === "en" ? "Privacy Notice" : "Aviso de Privacidad",
    description:
      locale === "en"
        ? "Elements Method privacy notice under Mexican data protection law (LFPDPPP): what data we collect, what we use it for and how to exercise your rights."
        : "Aviso de privacidad de Elements Method conforme a la LFPDPPP: qué datos recabamos, para qué los usamos y cómo ejercer tus derechos ARCO.",
  });
}

interface Block {
  h: string;
  p: string[];
  /** Muestra los botones para ejercer cada derecho ARCO (sección 5). */
  arco?: boolean;
}

function contentEs(email: string): { intro: string; blocks: Block[] } {
  return {
    intro:
      "En cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), su Reglamento y los Lineamientos del Aviso de Privacidad, Elements Method pone a su disposición el presente Aviso de Privacidad.",
    blocks: [
      {
        h: "1. Responsable",
        p: [
          "Elements Method (el \"Responsable\") es responsable del tratamiento y protección de sus datos personales conforme al presente Aviso.",
          `Para cualquier asunto relacionado con sus datos personales, puede contactarnos en ${email}.`,
        ],
      },
      {
        h: "2. Datos personales que recabamos",
        p: [
          "Podemos recabar datos de identificación y contacto (nombre, correo electrónico, teléfono), datos de la empresa que representa (razón social, RFC, domicilio fiscal) y, cuando aplica para participar en nuestros programas, datos sobre su estado de salud declarados por usted en formularios específicos.",
        ],
      },
      {
        h: "3. Finalidades del tratamiento",
        p: [
          "Finalidades primarias: atender solicitudes de información y cotización, gestionar inscripciones y compras, emitir comprobantes y documentos, coordinar la logística de los programas y retiros, y dar cumplimiento a obligaciones legales.",
          "Finalidades secundarias: enviar comunicaciones sobre nuevos programas, contenidos y eventos. Usted puede oponerse a estas finalidades secundarias sin que ello afecte la relación principal.",
        ],
      },
      {
        h: "4. Transferencias",
        p: [
          "No transferimos sus datos personales a terceros sin su consentimiento, salvo las excepciones previstas en el artículo 37 de la LFPDPPP. Utilizamos proveedores de servicios (procesamiento de pagos, correo, alojamiento) que actúan como encargados y tratan sus datos únicamente por nuestra cuenta.",
        ],
      },
      {
        h: "5. Derechos ARCO",
        p: [
          "Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales (derechos ARCO), así como a revocar su consentimiento.",
          `Para ejercer estos derechos, use el formulario en línea (botones a continuación) o envíe su solicitud a ${email}, indicando su nombre, los datos sobre los que desea ejercer el derecho y una descripción clara de su solicitud. Le pediremos una identificación oficial para acreditar su identidad. Responderemos en un plazo máximo de 20 días hábiles y, si procede, la solicitud se hará efectiva dentro de los 15 días hábiles siguientes.`,
        ],
        arco: true,
      },
      {
        h: "6. Uso de cookies y tecnologías de rastreo",
        p: [
          "Nuestro sitio utiliza cookies y tecnologías similares. Las cookies de analítica y marketing de terceros (Google, Meta, LinkedIn) solo se activan con su consentimiento a través del banner de cookies; puede configurar sus preferencias en cualquier momento. De forma independiente, realizamos una medición propia y agregada del tráfico (páginas vistas, origen de la visita, tipo de dispositivo y país) que no utiliza cookies de identificación, no almacena su dirección IP ni su identidad, y emplea un identificador irreversible que se renueva cada día con el único fin de no contar varias veces a un mismo visitante. Esta medición no permite identificarle ni seguirle entre sitios.",
        ],
      },
      {
        h: "7. Cambios al Aviso",
        p: [
          "Nos reservamos el derecho de actualizar este Aviso de Privacidad. Cualquier modificación será publicada en esta página.",
        ],
      },
    ],
  };
}

function contentEn(email: string): { intro: string; blocks: Block[] } {
  return {
    intro:
      "In compliance with Mexico's Federal Law on Protection of Personal Data Held by Private Parties (LFPDPPP), Elements Method provides this Privacy Notice.",
    blocks: [
      {
        h: "1. Data Controller",
        p: [
          "Elements Method (the \"Controller\") is responsible for the processing and protection of your personal data under this Notice.",
          `For any matter related to your personal data, contact us at ${email}.`,
        ],
      },
      {
        h: "2. Personal data we collect",
        p: [
          "We may collect identification and contact data (name, email, phone), data about the company you represent (legal name, tax ID, address), and, where relevant to participate in our programs, health-status data you declare in specific forms.",
        ],
      },
      {
        h: "3. Purposes",
        p: [
          "Primary purposes: respond to information and quote requests, manage enrollments and purchases, issue receipts and documents, coordinate program and retreat logistics, and comply with legal obligations.",
          "Secondary purposes: send communications about new programs, content and events. You may object to these secondary purposes without affecting the primary relationship.",
        ],
      },
      {
        h: "4. Transfers",
        p: [
          "We do not transfer your personal data to third parties without your consent, except as provided in article 37 of the LFPDPPP. We use service providers (payment processing, email, hosting) that act as processors on our behalf.",
        ],
      },
      {
        h: "5. ARCO rights",
        p: [
          "You have the right to Access, Rectify, Cancel or Object to the processing of your personal data (ARCO rights), and to revoke your consent.",
          `To exercise these rights, use the online form (buttons below) or send your request to ${email} with your name, the data concerned and a clear description of your request. We will ask for an official ID to verify your identity. We will respond within 20 business days and, if granted, the request will take effect within the following 15 business days.`,
        ],
        arco: true,
      },
      {
        h: "6. Cookies and tracking",
        p: [
          "Our site uses cookies and similar technologies. Third-party analytics and marketing cookies (Google, Meta, LinkedIn) only activate with your consent via the cookie banner; you can configure your preferences at any time. Separately, we keep our own aggregate traffic measurement (pages viewed, visit origin, device type and country) that uses no identifying cookies, stores neither your IP address nor your identity, and relies on an irreversible identifier that rotates daily for the sole purpose of not counting the same visitor twice. This measurement cannot identify you or track you across sites.",
        ],
      },
      {
        h: "7. Changes to this Notice",
        p: [
          "We reserve the right to update this Privacy Notice. Any change will be published on this page.",
        ],
      },
    ],
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const contact = (await getContactInfo()) ?? staticContact;
  const emailGeneral = (contact as { emailGeneral?: string | null }).emailGeneral;
  const email =
    typeof emailGeneral === "string" && emailGeneral.length > 0
      ? emailGeneral
      : "hola@elementsmethod.com";
  const { intro, blocks } = locale === "es" ? contentEs(email) : contentEn(email);

  return (
    <Section spacing="loose">
      <Container className="max-w-3xl">
        <Eyebrow className="mb-6">
          {locale === "es" ? "Legal" : "Legal"}
        </Eyebrow>
        <h1 className="display-1 text-balance mb-6">
          {locale === "es" ? "Aviso de Privacidad" : "Privacy Notice"}
        </h1>
        <p className="lead text-pretty mb-12">{intro}</p>

        <div className="space-y-10">
          {blocks.map((b) => (
            <section key={b.h}>
              <h2 className="font-[family-name:var(--font-display)] text-xl tracking-tight mb-3">
                {b.h}
              </h2>
              <div className="space-y-3 text-[var(--color-ink-soft)] leading-relaxed">
                {b.p.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              {b.arco && <ArcoRightLinks locale={locale} />}
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
