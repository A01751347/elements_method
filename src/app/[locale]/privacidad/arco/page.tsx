import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { pageMetadata, ROUTES, localePath } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Section, Eyebrow } from "@/components/ui/Section";
import { ArcoRequestForm } from "@/components/forms/ArcoRequestForm";
import { getContactInfo } from "@/modules/content/contact";
import { contactInfo as staticContact } from "@/data/launchData";
import {
  ARCO_RIGHTS,
  ARCO_RESPONSE_BUSINESS_DAYS,
  ARCO_EXECUTION_BUSINESS_DAYS,
  ARCO_IDENTITY_BUSINESS_DAYS,
  type ArcoRight,
} from "@/data/arco";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({
    locale,
    route: ROUTES.arco,
    title: locale === "en" ? "Exercise your ARCO rights" : "Ejerce tus derechos ARCO",
    description:
      locale === "en"
        ? "Access, rectify, cancel or object to the use of your personal data, or withdraw your consent. Submit your request online and get a reference number and legal response deadline."
        : "Accede, rectifica, cancela u oponte al uso de tus datos personales, o revoca tu consentimiento. Envía tu solicitud en línea y recibe folio y fecha límite legal de respuesta.",
  });
}

/**
 * Página de derechos ARCO: explica el proceso y aloja el formulario. El
 * derecho puede venir preseleccionado por `?derecho=` (botones del aviso de
 * privacidad y del footer).
 */
export default async function ArcoPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ derecho?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { derecho } = await searchParams;
  const initialRight = (ARCO_RIGHTS as readonly string[]).includes(derecho ?? "")
    ? (derecho as ArcoRight)
    : undefined;

  const contact = (await getContactInfo()) ?? staticContact;
  const emailGeneral = (contact as { emailGeneral?: string | null }).emailGeneral;
  const email =
    typeof emailGeneral === "string" && emailGeneral.length > 0
      ? emailGeneral
      : "hola@elementsmethod.com";

  const es = locale === "es";
  const privacyHref = localePath(locale, ROUTES.privacy);

  const pasos = es
    ? [
        {
          t: "Envías tu solicitud",
          p: "Eliges el derecho, nos dices quién eres y qué necesitas. Recibes un folio y un acuse por correo al instante.",
        },
        {
          t: "Acreditamos tu identidad",
          p: `Te pedimos por correo una identificación oficial (y, si representas a alguien, el documento que lo acredite). Tienes ${ARCO_IDENTITY_BUSINESS_DAYS} días hábiles para enviarla.`,
        },
        {
          t: "Te respondemos",
          p: `En máximo ${ARCO_RESPONSE_BUSINESS_DAYS} días hábiles desde que recibimos la solicitud. Si procede, se hace efectiva en los ${ARCO_EXECUTION_BUSINESS_DAYS} días hábiles siguientes.`,
        },
      ]
    : [
        {
          t: "You submit your request",
          p: "Choose the right, tell us who you are and what you need. You get a reference number and an acknowledgement by email right away.",
        },
        {
          t: "We verify your identity",
          p: `We ask you by email for an official ID (and, if you act on someone's behalf, proof of that authority). You have ${ARCO_IDENTITY_BUSINESS_DAYS} business days to send it.`,
        },
        {
          t: "We respond",
          p: `Within ${ARCO_RESPONSE_BUSINESS_DAYS} business days of receiving the request. If granted, it takes effect within the following ${ARCO_EXECUTION_BUSINESS_DAYS} business days.`,
        },
      ];

  return (
    <Section spacing="loose">
      <Container className="max-w-6xl">
        <div className="max-w-3xl">
          <Eyebrow className="mb-6">{es ? "Legal · Datos personales" : "Legal · Personal data"}</Eyebrow>
          <h1 className="display-1 text-balance mb-6">
            {es ? "Ejerce tus derechos ARCO" : "Exercise your ARCO rights"}
          </h1>
          <p className="lead text-pretty">
            {es
              ? "La Ley Federal de Protección de Datos Personales en Posesión de los Particulares te da derecho a acceder, rectificar, cancelar u oponerte al uso de tus datos, y a revocar tu consentimiento. Elige el derecho que quieres ejercer y cuéntanos qué necesitas: es gratuito y no requiere abogado."
              : "Mexico's Federal Law on Protection of Personal Data Held by Private Parties gives you the right to access, rectify, cancel or object to the use of your data, and to withdraw your consent. Choose the right you want to exercise and tell us what you need: it's free and requires no lawyer."}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 mt-14 md:mt-20">
          <aside className="lg:col-span-4">
            <h2 className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-6">
              {es ? "Cómo funciona" : "How it works"}
            </h2>
            <ol className="space-y-6">
              {pasos.map((paso, i) => (
                <li key={paso.t} className="flex gap-4">
                  <span
                    className="font-[family-name:var(--font-display)] text-2xl leading-none text-[var(--color-gold-deep)] shrink-0 w-8"
                    aria-hidden
                  >
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg tracking-tight mb-1">
                      {paso.t}
                    </h3>
                    <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">{paso.p}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 pt-8 border-t border-[var(--color-line)] space-y-4 text-sm text-[var(--color-ink-soft)] leading-relaxed">
              <p>
                {es ? "También puedes enviar tu solicitud por correo a " : "You can also send your request by email to "}
                <a href={`mailto:${email}`} className="text-[var(--color-ink)] underline underline-offset-4">
                  {email}
                </a>
                {es
                  ? ", indicando tu nombre, el derecho que ejerces y una descripción clara."
                  : ", stating your name, the right you're exercising and a clear description."}
              </p>
              <p>
                {es
                  ? "Si no estás conforme con nuestra respuesta, puedes acudir a la autoridad garante en materia de datos personales (Secretaría Anticorrupción y Buen Gobierno, antes INAI)."
                  : "If you disagree with our response, you may turn to Mexico's data protection authority (Secretaría Anticorrupción y Buen Gobierno, formerly INAI)."}
              </p>
              <p>
                <Link href={privacyHref} className="text-[var(--color-ink)] underline underline-offset-4">
                  {es ? "Leer el Aviso de Privacidad completo" : "Read the full Privacy Notice"}
                </Link>
              </p>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <ArcoRequestForm locale={locale} initialRight={initialRight} privacyHref={privacyHref} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
