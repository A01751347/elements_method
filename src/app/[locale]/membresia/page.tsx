import { notFound } from "next/navigation";
import { Check, Infinity as InfinityIcon, ArrowRight } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { subscriptionTiers, subscriptionFlow, contactInfo } from "@/data/launchData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title:
      locale === "en"
        ? "Membership · Elements Method"
        : "Membresía · Elements Method",
  };
}

export default async function MembershipPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      {/* HERO */}
      <section className="-mt-20 pt-32 pb-20 bg-[var(--color-paper-warm)] paper-grain">
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <Eyebrow className="mb-6 flex items-center gap-3">
                <InfinityIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
                {locale === "es" ? "Programas de continuidad" : "Continuity programs"}
              </Eyebrow>
              <h1 className="display-1 text-balance">
                {locale === "es"
                  ? "El trabajo no termina con el retiro. Empieza ahí."
                  : "The work does not end with the retreat. It begins there."}
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="lead text-pretty">
                {locale === "es"
                  ? "Tres membresías para sostener la integración entre inmersiones. Práctica continua, círculos virtuales y acceso a las inmersiones presenciales del calendario."
                  : "Three memberships to sustain integration between immersions. Continuous practice, virtual circles, and access to the calendar's in-person immersions."}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* TIERS */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {subscriptionTiers.map((tier, idx) => {
            const localeKey = locale === "es" ? "Es" : "En";
            const highlight = idx === 1; // middle tier highlighted as recommended
            return (
              <article
                key={tier.slug}
                className={`p-8 md:p-10 flex flex-col ${
                  highlight
                    ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                    : "bg-[var(--color-paper)]"
                }`}
              >
                <div className="flex items-baseline justify-between mb-6">
                  <div
                    className={`text-xs uppercase tracking-[0.22em] ${
                      highlight ? "text-[var(--color-gold-soft)]" : "text-[var(--color-muted)]"
                    }`}
                  >
                    {String(idx + 1).padStart(2, "0")} ·{" "}
                    {locale === "es" ? "Membresía" : "Membership"}
                  </div>
                  {highlight && (
                    <span className="text-[0.65rem] uppercase tracking-[0.18em] bg-[var(--color-gold-soft)] text-[var(--color-ink)] px-2 py-0.5">
                      {locale === "es" ? "Recomendado" : "Recommended"}
                    </span>
                  )}
                </div>

                <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight mb-2">
                  {tier[`name${localeKey}`]}
                </h2>
                <p
                  className={`italic mb-6 ${
                    highlight ? "text-[var(--color-paper)]/95" : "text-[var(--color-ink-soft)]"
                  }`}
                >
                  {tier[`tagline${localeKey}`]}
                </p>

                <div
                  className={`mb-6 pb-6 border-b ${
                    highlight ? "border-[var(--color-paper)]/15" : "border-[var(--color-line)]"
                  }`}
                >
                  <div className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
                    {tier.priceLabelMxn}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      highlight ? "text-[var(--color-paper)]/85" : "text-[var(--color-muted)]"
                    }`}
                  >
                    {tier.priceLabelEn} · {tier[`cadence${localeKey}`]}
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier[`includes${localeKey}`].map((item) => (
                    <li
                      key={item}
                      className={`flex items-start gap-3 text-sm leading-relaxed ${
                        highlight
                          ? "text-[var(--color-paper)]/90"
                          : "text-[var(--color-ink-soft)]"
                      }`}
                    >
                      <Check
                        className={`h-4 w-4 mt-0.5 shrink-0 ${
                          highlight
                            ? "text-[var(--color-gold-soft)]"
                            : "text-[var(--color-gold-deep)]"
                        }`}
                        strokeWidth={2}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  href={contactInfo.whatsappLink}
                  size="sm"
                  variant={highlight ? "solidLight" : "primary"}
                  trailingArrow
                  className="w-full"
                >
                  {locale === "es" ? "Aplicar" : "Apply"}
                </Button>
              </article>
            );
          })}
        </div>
      </Section>

      {/* FLOW */}
      <Section spacing="default" tone="warm">
        <div className="grid lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-6">
              {locale === "es" ? "Proceso de inscripción" : "Subscription flow"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Cuatro pasos. Una conversación primero."
                : "Four steps. One conversation first."}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:pt-3">
            <p className="lead text-pretty">
              {locale === "es"
                ? "No vendemos suscripciones desde un formulario. Cada membresía empieza con una conversación de discovery para asegurar que el programa y el momento sean los correctos."
                : "We don't sell subscriptions from a form. Each membership begins with a discovery conversation to make sure the program and the timing are right."}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {subscriptionFlow.map((step) => {
            const localeKey = locale === "es" ? "Es" : "En";
            return (
              <div
                key={step.stepNumber}
                className="bg-[var(--color-paper)] p-7 min-h-[220px] flex flex-col"
              >
                <div className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-gold-deep)] tabular-nums leading-none mb-5">
                  {String(step.stepNumber).padStart(2, "0")}
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-lg mb-2">
                  {step[`title${localeKey}`]}
                </h3>
                <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                  {step[`body${localeKey}`]}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* CTA */}
      <Section spacing="default" tone="ink">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Eyebrow inverted className="mb-6">
              {locale === "es" ? "Próximo paso" : "Next step"}
            </Eyebrow>
            <h2 className="display-2 text-[var(--color-paper)] text-balance">
              {locale === "es"
                ? "Empezamos por entender en qué momento estás."
                : "We start by understanding where you are."}
            </h2>
            <p className="lead mt-6 text-[var(--color-paper)]/90 text-pretty max-w-2xl">
              {locale === "es"
                ? "Agenda una conversación de 30 minutos. Sin compromiso. Si la membresía no es para ti ahora, te lo diremos."
                : "Schedule a 30-minute conversation. No commitment. If membership isn't right for you now, we'll say so."}
            </p>
          </div>
          <div className="lg:col-span-5 lg:pt-2">
            <div className="space-y-3">
              <Button
                href={contactInfo.whatsappLink}
                size="lg"
                trailingArrow
                className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)] w-full justify-between"
              >
                {locale === "es" ? "Agendar discovery" : "Schedule discovery"}
              </Button>
              <Button
                href="mailto:hello@elementsmethod.com?subject=Membresia"
                size="lg"
                variant="outlineLight"
                className="w-full"
              >
                hello@elementsmethod.com
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
