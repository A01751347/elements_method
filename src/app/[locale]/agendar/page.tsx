import { notFound } from "next/navigation";
import { CalendarClock } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { CalEmbed } from "@/components/integrations/CalEmbed";
import { CAL_EVENT_TYPES } from "@/shared/integrations/cal";
import { contactInfo } from "@/data/launchData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title:
      locale === "en"
        ? "Schedule · Elements Method"
        : "Agendar · Elements Method",
  };
}

export default async function ScheduleDiscoveryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  if (!isLocale(locale)) notFound();

  // Dos eventos vivos en Cal: el individual (30min) y empresas. Los slugs
  // salen de CAL_EVENT_TYPES, que se puede reapuntar por variable de entorno
  // cuando exista un evento propio de diagnóstico en la cuenta.
  const type = sp.type === "empresa" ? "enterprise" : "diagnostic";

  const eventType =
    type === "enterprise"
      ? CAL_EVENT_TYPES.discoveryEnterprise
      : CAL_EVENT_TYPES.diagnostic;

  const titles = {
    enterprise: {
      es: "Discovery para organizaciones",
      en: "Organization discovery",
    },
    diagnostic: {
      es: "Diagnóstico de liderazgo",
      en: "Leadership diagnostic",
    },
  } as const;

  return (
    <>
      <section className="-mt-20 pt-36 md:pt-44 pb-8 bg-[var(--color-paper-warm)] paper-grain">
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <Eyebrow className="mb-6 flex items-center gap-3">
                <CalendarClock className="h-3.5 w-3.5" strokeWidth={1.5} />
                {locale === "es" ? "Agenda directa" : "Direct schedule"}
              </Eyebrow>
              <h1 className="display-1 text-balance">
                {titles[type][locale]}
              </h1>
              <p className="lead mt-6 max-w-2xl text-pretty">
                {locale === "es"
                  ? "30 minutos. Sin compromiso. Te respondemos si encajamos — y si no, te lo decimos honestamente."
                  : "30 minutes. No commitment. We tell you honestly whether we're a fit."}
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="flex flex-wrap gap-2">
                <TypeChip
                  active={type === "diagnostic"}
                  href={`/${locale}/${locale === "es" ? "agendar" : "schedule"}`}
                  label={locale === "es" ? "Diagnóstico individual" : "Individual diagnostic"}
                />
                <TypeChip
                  active={type === "enterprise"}
                  href={`/${locale}/${locale === "es" ? "agendar" : "schedule"}?type=empresa`}
                  label={locale === "es" ? "Empresas" : "Enterprise"}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <CalEmbed
              eventType={eventType}
              fallbackLabel={
                locale === "es"
                  ? "Si el calendario no carga aquí, continúa en una nueva pestaña:"
                  : "If the calendar doesn't load here, continue in a new tab:"
              }
            />
          </div>
          <div className="lg:col-span-4">
            <div className="border border-[var(--color-line)] bg-[var(--color-paper-warm)] p-5 text-sm space-y-4">
              <h3 className="font-medium text-[var(--color-ink)]">
                {locale === "es" ? "Contacto directo" : "Direct contact"}
              </h3>
              <div className="space-y-2 text-[var(--color-ink-soft)]">
                <a
                  href={contactInfo.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-[var(--color-gold-deep)]"
                >
                  WhatsApp · {contactInfo.phoneDisplayMx}
                </a>
                <a
                  href="mailto:hello@elementsmethod.com"
                  className="block hover:text-[var(--color-gold-deep)]"
                >
                  hello@elementsmethod.com
                </a>
              </div>
              <p className="pt-4 border-t border-[var(--color-line)] text-xs text-[var(--color-muted)] leading-relaxed">
                {locale === "es"
                  ? "Si prefieres dejar tu información primero, llena el formulario en /aplicar."
                  : "If you'd rather leave your info first, fill the form at /apply."}
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function TypeChip({
  active,
  href,
  label,
}: {
  active: boolean;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className={`px-4 py-2 text-xs uppercase tracking-[0.18em] border transition-colors ${
        active
          ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
          : "border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)]"
      }`}
    >
      {label}
    </a>
  );
}
