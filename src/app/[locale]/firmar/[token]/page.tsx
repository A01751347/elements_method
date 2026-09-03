import { notFound } from "next/navigation";
import { FileText, ShieldCheck } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { verifyToken } from "@/shared/integrations/signedTokens";
import { legalDocs } from "@/data/launchData";
import { SignForm } from "./SignForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title:
      locale === "en"
        ? "Sign document · Elements Method"
        : "Firmar documento · Elements Method",
  };
}

export default async function SignDocPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  if (!isLocale(locale)) notFound();

  const verified = await verifyToken(token);

  return (
    <>
      <section className="-mt-20 pt-36 md:pt-44 pb-8 bg-[var(--color-paper-warm)] paper-grain">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <FileText className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Firma de documento" : "Sign document"}
            </Eyebrow>
            <h1 className="display-2 text-balance">
              {locale === "es" ? "Aceptación digital." : "Digital acceptance."}
            </h1>
            <p className="lead mt-5 text-pretty">
              {locale === "es"
                ? "Lee el documento abajo. Tu aceptación queda registrada con marca de tiempo, IP y firma. Recibirás copia por email."
                : "Read the document below. Your acceptance is recorded with timestamp, IP and signature. You'll receive a copy by email."}
            </p>
          </div>
        </Container>
      </section>

      <Section spacing="default">
        {!verified.ok ? (
          <div className="max-w-2xl">
            <div className="border border-red-200 bg-red-50 p-6 text-red-900">
              <h2 className="font-[family-name:var(--font-display)] text-2xl mb-2">
                {locale === "es" ? "Enlace inválido o expirado" : "Invalid or expired link"}
              </h2>
              <p className="text-sm leading-relaxed">
                {locale === "es"
                  ? "Solicita un nuevo enlace de firma a "
                  : "Request a new signing link from "}
                <a
                  href="mailto:hello@elementsmethod.com"
                  className="underline underline-offset-2"
                >
                  hello@elementsmethod.com
                </a>
                .
              </p>
              <p className="mt-4 text-xs font-mono text-red-700">
                Code: {verified.error}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <div className="border border-[var(--color-line)] bg-[var(--color-paper)] p-6 max-h-[640px] overflow-y-auto text-sm leading-relaxed">
                {/* In production, fetch from `document_templates` by the order
                 * doc's templateId. For now we render the first legal skeleton
                 * as a preview — same renderer used at /legal/[slug]. */}
                <h2 className="font-[family-name:var(--font-display)] text-xl mb-4">
                  {legalDocs[0].titleEs}
                </h2>
                <div className="prose prose-zinc max-w-none text-sm">
                  {legalDocs[0].bodyEs.split("\n").map((line, i) => (
                    <p key={i} className="mb-3">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="border border-[var(--color-line)] bg-[var(--color-paper-warm)] p-6 sticky top-28">
                <div className="flex items-center gap-3 mb-5">
                  <ShieldCheck
                    className="h-5 w-5 text-[var(--color-gold-deep)]"
                    strokeWidth={1.5}
                  />
                  <div className="eyebrow text-[var(--color-muted)]">
                    {locale === "es" ? "Tu firma" : "Your signature"}
                  </div>
                </div>
                <p className="text-sm text-[var(--color-ink-soft)] mb-5">
                  {locale === "es"
                    ? `Firmas como ${verified.email}. El registro de IP y user agent del navegador se guardará junto con tu aceptación.`
                    : `Signing as ${verified.email}. IP and browser user-agent will be recorded with your acceptance.`}
                </p>
                <SignForm locale={locale} token={token} email={verified.email} />
              </div>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
