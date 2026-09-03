import { notFound } from "next/navigation";
import { eq, and, gt, isNull } from "drizzle-orm";
import { ClipboardList, AlertCircle } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { db } from "@/shared/db/client";
import { forms, formTokens } from "@/shared/db/schema/forms";
import { SurveyRenderer, type SurveyDefinition, type FormField } from "@/components/forms/SurveyRenderer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title:
      locale === "en"
        ? "Survey · Elements Method"
        : "Encuesta · Elements Method",
  };
}

async function loadFormByToken(token: string) {
  try {
    const rows = await db
      .select({
        formId: forms.id,
        slug: forms.slug,
        titleEs: forms.titleEs,
        titleEn: forms.titleEn,
        descriptionEs: forms.descriptionEs,
        descriptionEn: forms.descriptionEn,
        fields: forms.fields,
        recipientName: formTokens.recipientName,
        recipientEmail: formTokens.recipientEmail,
        expiresAt: formTokens.expiresAt,
        usedAt: formTokens.usedAt,
      })
      .from(formTokens)
      .innerJoin(forms, eq(forms.id, formTokens.formId))
      .where(
        and(
          eq(formTokens.token, token),
          gt(formTokens.expiresAt, new Date()),
          isNull(formTokens.usedAt),
        ),
      )
      .limit(1);
    return rows[0] ?? null;
  } catch (e) {
    console.error("[encuesta] DB read failed", e);
    return null;
  }
}

export default async function SurveyPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  if (!isLocale(locale)) notFound();

  const row = await loadFormByToken(token);

  return (
    <>
      <section className="-mt-20 pt-36 md:pt-44 pb-8 bg-[var(--color-paper-warm)] paper-grain">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <ClipboardList className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Cuestionario" : "Survey"}
            </Eyebrow>
            {row ? (
              <p className="text-sm text-[var(--color-ink-soft)]">
                {locale === "es"
                  ? `Hola${row.recipientName ? `, ${row.recipientName}` : ""}. Esta es tu copia personal.`
                  : `Hello${row.recipientName ? `, ${row.recipientName}` : ""}. This is your personal copy.`}
              </p>
            ) : null}
          </div>
        </Container>
      </section>

      <Section spacing="default">
        {!row ? (
          <div className="max-w-2xl">
            <div className="border border-amber-300 bg-amber-50 p-6 text-amber-900">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="h-5 w-5 mt-0.5" strokeWidth={1.5} />
                <h2 className="font-[family-name:var(--font-display)] text-2xl">
                  {locale === "es" ? "Enlace inválido o ya usado" : "Invalid or already used link"}
                </h2>
              </div>
              <p className="text-sm leading-relaxed">
                {locale === "es"
                  ? "Este enlace expiró, ya se usó o no existe. Cada cuestionario se envía con un enlace de un solo uso."
                  : "This link is expired, already used, or doesn't exist. Each survey is sent with a single-use link."}
              </p>
              <p className="text-sm leading-relaxed mt-3">
                {locale === "es"
                  ? "Si crees que es un error, escríbenos a "
                  : "If you think this is a mistake, email us at "}
                <a
                  href="mailto:hello@elementsmethod.com"
                  className="underline underline-offset-2"
                >
                  hello@elementsmethod.com
                </a>
                .
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl">
            <SurveyRenderer
              form={{
                id: row.formId,
                slug: row.slug,
                titleEs: row.titleEs,
                titleEn: row.titleEn ?? row.titleEs,
                descriptionEs: row.descriptionEs,
                descriptionEn: row.descriptionEn,
                fields: row.fields as FormField[],
              } satisfies SurveyDefinition}
              token={token}
              locale={locale}
            />
          </div>
        )}
      </Section>
    </>
  );
}
