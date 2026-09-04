import { notFound } from "next/navigation";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { InscriptionForm } from "@/components/forms/InscriptionForm";
import { contactInfo as staticContactInfo, hasRealContact } from "@/data/launchData";
import { getContactInfo } from "@/modules/content/contact";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title:
      locale === "en"
        ? "Contact · Elements Method"
        : "Contacto · Elements Method",
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const contactInfo = (await getContactInfo()) ?? staticContactInfo;

  return (
    <>
      <section className="-mt-20 pt-36 md:pt-44 pb-12 bg-[var(--color-paper-warm)] paper-grain">
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <Eyebrow className="mb-6">
                {locale === "es" ? "Contacto" : "Contact"}
              </Eyebrow>
              <h1 className="display-1 text-balance">
                {locale === "es"
                  ? "Una conversación abierta."
                  : "An open conversation."}
              </h1>
              <p className="lead mt-6 max-w-2xl text-pretty">
                {locale === "es"
                  ? "Escríbenos sobre lo que sea relevante — una pregunta del método, una propuesta organizacional, una conversación de prensa."
                  : "Write to us about anything relevant — a method question, an organizational proposal, a press conversation."}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-6">
            <ContactItem
              icon={Mail}
              label="Email"
              value="hello@elementsmethod.com"
              href="mailto:hello@elementsmethod.com"
            />
            <ContactItem
              icon={Phone}
              label={locale === "es" ? "Teléfono" : "Phone"}
              value={contactInfo.phoneDisplayMx}
              href={`tel:${contactInfo.phoneE164}`}
            />
            {hasRealContact(contactInfo, "whatsappLink") && (
              <ContactItem
                icon={MessageCircle}
                label="WhatsApp"
                value={locale === "es" ? "Conversación directa" : "Direct chat"}
                href={contactInfo.whatsappLink}
                external
              />
            )}
            <ContactItem
              icon={MapPin}
              label={locale === "es" ? "Sede operativa" : "Base"}
              value={locale === "es" ? contactInfo.addressLabelEs : contactInfo.addressLabelEn}
            />

            <div className="pt-8 mt-8 border-t border-[var(--color-line)] text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] space-y-2">
              {contactInfo.socialHandles.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-[var(--color-ink)] transition-colors"
                >
                  {s.name} · {s.handle}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] mb-6">
              {locale === "es" ? "Escríbenos" : "Write to us"}
            </div>
            <InscriptionForm
              locale={locale}
              source="contact"
              showOrganization
              submitLabel={locale === "es" ? "Enviar mensaje" : "Send message"}
            />
          </div>
        </div>
      </Section>
    </>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    href ? (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="block group"
      >
        {children}
      </a>
    ) : (
      <div>{children}</div>
    );
  return (
    <Wrapper>
      <div className="flex items-start gap-4">
        <Icon
          className="h-5 w-5 mt-0.5 text-[var(--color-gold-deep)] shrink-0"
          strokeWidth={1.5}
        />
        <div>
          <div className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-1">
            {label}
          </div>
          <div
            className={
              href
                ? "text-[var(--color-ink)] group-hover:text-[var(--color-gold-deep)] transition-colors"
                : "text-[var(--color-ink-soft)]"
            }
          >
            {value}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
