import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { Container } from "@/components/ui/Container";
import { Section, Eyebrow } from "@/components/ui/Section";
import { getCalculatorConfig } from "@/shared/pricing/enterprise";
import { QuoteCalculator } from "@/components/forms/QuoteCalculator";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Get a quote" : "Cotiza tu programa",
  };
}

export default async function QuotePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const config = await getCalculatorConfig();

  return (
    <Section spacing="loose">
      <Container className="max-w-5xl">
        <div className="mb-12 max-w-2xl">
          <Eyebrow className="mb-6">
            {locale === "es" ? "Cotización empresarial" : "Enterprise quote"}
          </Eyebrow>
          <h1 className="display-1 text-balance mb-6">
            {locale === "es"
              ? "Estima la inversión de tu programa."
              : "Estimate your program's investment."}
          </h1>
          <p className="lead text-pretty">
            {locale === "es"
              ? "Ajusta el número de participantes, sesiones y modalidad para ver un estimado en tiempo real. Solicita la cotización formal y te la enviamos en PDF."
              : "Adjust the number of participants, sessions and modality to see a live estimate. Request the formal quote and we'll send it as a PDF."}
          </p>
        </div>

        <QuoteCalculator locale={locale} config={config} />
      </Container>
    </Section>
  );
}
