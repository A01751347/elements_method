import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale } from "@/i18n/config";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { InscriptionForm } from "@/components/forms/InscriptionForm";
import { calendarRetreats, findRetreatBySlug, contactInfo } from "@/data/launchData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "Apply · Elements Method" : "Aplicar · Elements Method" };
}

export default async function ApplyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ retreat?: string; path?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  if (!isLocale(locale)) notFound();

  const retreat = sp.retreat ? findRetreatBySlug(sp.retreat) : null;
  const pathSlug = sp.path ?? undefined;
  const localeKey = locale === "es" ? "Es" : "En";

  return (
    <>
      <section className="-mt-20 pt-36 md:pt-44 pb-12 bg-[var(--color-paper-warm)] paper-grain">
        <Container>
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <Eyebrow className="mb-6 flex items-center gap-3">
                <span aria-hidden className="h-px w-10 bg-[var(--color-line)]" />
                {locale === "es" ? "Aplicación" : "Application"}
              </Eyebrow>
              <h1 className="display-1 text-balance max-w-[16ch]">
                {locale === "es"
                  ? "Cuéntanos qué necesitas."
                  : "Tell us what you need."}
              </h1>
              <p className="lead mt-6 text-pretty max-w-2xl">
                {locale === "es"
                  ? "Empezamos por una conversación. Este cuestionario nos permite entender a cuántas personas acompañaríamos, qué temas de liderazgo les interesan y en qué formato — para responderte con una propuesta real, no con un folleto. Leemos cada respuesta y contestamos personalmente en menos de 48 horas."
                  : "We begin with a conversation. This questionnaire lets us understand how many people we'd be working with, which leadership topics matter to them and in what format — so we can reply with a real proposal, not a brochure. We read every response and answer personally within 48 hours."}
              </p>
            </div>

            {retreat && (
              <div className="lg:col-span-5">
                <div className="border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
                  <div className="eyebrow text-[var(--color-muted)] mb-3">
                    {locale === "es" ? "Aplicas a" : "Applying to"}
                  </div>
                  <div className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)] mb-2">
                    {retreat[`theme${localeKey}`]}
                  </div>
                  <div className="text-sm text-[var(--color-ink-soft)] mb-1">
                    {retreat[`dateLabel${localeKey}`]}
                  </div>
                  <div className="text-xs text-[var(--color-muted)] uppercase tracking-[0.18em]">
                    {retreat[`venueLabel${localeKey}`]}
                  </div>
                  <Link
                    href={`/${locale}/${locale === "es" ? "retiros" : "retreats"}/${retreat.slug}`}
                    className="mt-4 inline-block text-xs text-[var(--color-gold-deep)] hover:underline"
                  >
                    {locale === "es" ? "← Ver detalle del retiro" : "← View retreat detail"}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>

      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <h2 className="display-3 mb-6">
              {locale === "es" ? "Tu aplicación" : "Your application"}
            </h2>
            <div className="text-sm text-[var(--color-ink-soft)] leading-relaxed space-y-4 max-w-md">
              <p>
                {locale === "es"
                  ? "Lee tu aplicación una persona, no un sistema. Los campos opcionales nos ayudan a preparar mejor la conversación."
                  : "Your application is read by a person, not a system. The optional fields help us prepare a better conversation."}
              </p>
              <p>
                {locale === "es"
                  ? "Cupo limitado a 15 participantes por retiro."
                  : "Capacity capped at 15 participants per retreat."}
              </p>
              <p className="pt-4 border-t border-[var(--color-line)]">
                {locale === "es" ? "¿Prefieres escribirnos directamente?" : "Prefer to write directly?"}
                <br />
                <a href="mailto:hello@elementsmethod.com" className="text-[var(--color-gold-deep)] hover:underline">
                  hello@elementsmethod.com
                </a>
                <br />
                <a href={contactInfo.whatsappLink} className="text-[var(--color-gold-deep)] hover:underline">
                  WhatsApp · {contactInfo.phoneDisplayMx}
                </a>
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <InscriptionForm
              locale={locale}
              source="apply"
              retreatSlug={retreat?.slug}
              pathSlug={pathSlug}
              showOrganization
              questionnaire
              submitLabel={locale === "es" ? "Enviar solicitud" : "Send request"}
            />
          </div>
        </div>
      </Section>

      {!retreat && (
        <Section spacing="default" tone="warm">
          <div className="mb-8">
            <Eyebrow className="mb-4">
              {locale === "es" ? "Calendario abierto" : "Open calendar"}
            </Eyebrow>
            <h2 className="display-3 text-balance">
              {locale === "es"
                ? "¿A cuál retiro quieres aplicar?"
                : "Which retreat are you applying to?"}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
            {calendarRetreats.slice(0, 6).map((r) => (
              <Link
                key={r.slug}
                href={`/${locale}/${locale === "es" ? "aplicar" : "apply"}?retreat=${r.slug}`}
                className="group bg-[var(--color-paper)] p-6 hover:bg-[var(--color-paper-warm)] transition-colors"
              >
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] mb-3">
                  {r[`dateLabel${localeKey}`]}
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-xl tracking-tight group-hover:text-[var(--color-gold-deep)] transition-colors">
                  {r[`theme${localeKey}`]}
                </h3>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
