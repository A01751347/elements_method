import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { Container } from "@/components/ui/Container";
import { Section, Eyebrow } from "@/components/ui/Section";
import { getContactInfo } from "@/modules/content/contact";
import { contactInfo as staticContact } from "@/data/launchData";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "Privacy Notice" : "Aviso de Privacidad" };
}

interface Block {
  h: string;
  p: string[];
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
          `Para ejercer estos derechos, envíe su solicitud a ${email}, indicando su nombre, los datos sobre los que desea ejercer el derecho y una descripción clara de su solicitud. Responderemos en los plazos que marca la ley.`,
        ],
      },
      {
        h: "6. Uso de cookies y tecnologías de rastreo",
        p: [
          "Nuestro sitio utiliza cookies y tecnologías similares. Las cookies de analítica y marketing solo se activan con su consentimiento a través del banner de cookies. Puede configurar sus preferencias en cualquier momento.",
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
          `To exercise these rights, send your request to ${email} with your name, the data concerned and a clear description of your request. We will respond within legal timeframes.`,
        ],
      },
      {
        h: "6. Cookies and tracking",
        p: [
          "Our site uses cookies and similar technologies. Analytics and marketing cookies only activate with your consent via the cookie banner. You can configure your preferences at any time.",
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
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
