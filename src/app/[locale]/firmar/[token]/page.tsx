import { notFound } from "next/navigation";
import { eq, inArray } from "drizzle-orm";
import { FileText, ShieldCheck, Check } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { pageMetadata, signRoute } from "@/lib/seo";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { LegalMarkdown } from "@/components/legal/LegalMarkdown";
import { db } from "@/shared/db/client";
import { documentTemplates, orderDocuments, orders, products } from "@/shared/db/schema";
import { verifyToken } from "@/shared/integrations/signedTokens";
import { fillTokens } from "@/shared/pdf/engine";
import { legalDocTokens } from "@/shared/pdf/legalTokens";
import { safeRead } from "@/modules/content/safe";
import { SignForm } from "./SignForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  if (!isLocale(locale)) return {};
  // Enlace de firma de un solo uso: nunca se indexa (robots.txt también lo bloquea).
  return pageMetadata({
    locale,
    route: signRoute(token),
    title: locale === "en" ? "Sign document" : "Firmar documento",
    description:
      locale === "en"
        ? "Sign your Elements Method participation documents."
        : "Firma tus documentos de participación de Elements Method.",
    noIndex: true,
  });
}

/**
 * The document behind a signing link: the order_documents row, its template
 * and the order whose data fills the tokens. The token's email must match the
 * order's buyer so a forwarded link can't be signed by someone else.
 */
async function loadSigningDoc(orderDocId: string, email: string, lang: "es" | "en") {
  return safeRead(undefined, async () => {
    const [row] = await db
      .select({
        orderDoc: orderDocuments,
        template: documentTemplates,
        order: orders,
      })
      .from(orderDocuments)
      .innerJoin(documentTemplates, eq(documentTemplates.id, orderDocuments.documentTemplateId))
      .innerJoin(orders, eq(orders.id, orderDocuments.orderId))
      .where(eq(orderDocuments.id, orderDocId))
      .limit(1);
    if (!row || row.order.buyerEmail.toLowerCase() !== email.toLowerCase()) return undefined;

    let productNames = "";
    if (row.order.productIds.length > 0) {
      const rows = await db
        .select({ nameEs: products.nameEs, nameEn: products.nameEn })
        .from(products)
        .where(inArray(products.id, row.order.productIds));
      productNames = rows
        .map((p) => (lang === "en" ? p.nameEn ?? p.nameEs : p.nameEs))
        .join(", ");
    }
    const template =
      lang === "en"
        ? row.template.templateHtmlEn ?? row.template.templateHtmlEs
        : row.template.templateHtmlEs;
    return {
      accepted: row.orderDoc.accepted,
      acceptedAt: row.orderDoc.acceptedAt,
      slug: row.template.slug,
      name: lang === "en" ? row.template.nameEn ?? row.template.nameEs : row.template.nameEs,
      folio: row.order.folio,
      body: fillTokens(
        template,
        legalDocTokens({ order: row.order, lang, productNames }),
      ),
    };
  });
}

export default async function SignDocPage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>;
}) {
  const { locale, token } = await params;
  if (!isLocale(locale)) notFound();
  const es = locale === "es";

  const verified = await verifyToken(token);
  const doc = verified.ok
    ? await loadSigningDoc(verified.orderDocId, verified.email, locale)
    : undefined;

  return (
    <>
      <section className="-mt-20 pt-32 md:pt-36 pb-8 bg-[var(--color-paper-warm)] paper-grain">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow className="mb-4 flex items-center gap-3">
              <FileText className="h-3.5 w-3.5" strokeWidth={1.5} />
              {es ? "Firma de documento" : "Sign document"}
              {doc && <span className="text-[var(--color-muted)]">· Folio {doc.folio}</span>}
            </Eyebrow>
            <h1 className="display-3 text-balance">
              {doc ? doc.name : es ? "Aceptación digital." : "Digital acceptance."}
            </h1>
            <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-[var(--color-ink-soft)] text-pretty">
              {es
                ? "Lee el documento completo. Tu aceptación queda registrada con fecha, hora, IP y tu nombre como firma, y recibes copia por correo."
                : "Read the full document. Your acceptance is recorded with date, time, IP and your name as signature, and you receive a copy by email."}
            </p>
          </div>
        </Container>
      </section>

      <Section spacing="default">
        {!verified.ok || !doc ? (
          <div className="max-w-2xl">
            <div className="border border-red-200 bg-red-50 p-6 text-red-900">
              <h2 className="font-[family-name:var(--font-display)] text-2xl mb-2">
                {es ? "Enlace inválido o expirado" : "Invalid or expired link"}
              </h2>
              <p className="text-sm leading-relaxed">
                {es ? "Solicita un nuevo enlace de firma a " : "Request a new signing link from "}
                <a href="mailto:hello@elementsmethod.com" className="underline underline-offset-2">
                  hello@elementsmethod.com
                </a>
                .
              </p>
              {!verified.ok && (
                <p className="mt-4 text-xs font-mono text-red-700">Code: {verified.error}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <article className="border border-[var(--color-line)] bg-[var(--color-paper)] p-6 md:p-8 max-h-[70vh] overflow-y-auto prose prose-zinc max-w-none prose-headings:font-[family-name:var(--font-display)] prose-headings:tracking-tight prose-p:text-[var(--color-ink-soft)] prose-p:leading-relaxed prose-li:text-[var(--color-ink-soft)] text-sm">
                <LegalMarkdown body={doc.body} />
              </article>
              <p className="mt-3 text-xs text-[var(--color-muted)]">
                <a
                  href={`/api/documento/${encodeURIComponent(doc.slug)}?folio=${encodeURIComponent(doc.folio)}&lang=${locale}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-[var(--color-ink)]"
                >
                  {es ? "Descargar en PDF" : "Download as PDF"}
                </a>
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="border border-[var(--color-line)] bg-[var(--color-paper-warm)] p-6 sticky top-28">
                <div className="flex items-center gap-3 mb-5">
                  <ShieldCheck className="h-5 w-5 text-[var(--color-gold-deep)]" strokeWidth={1.5} />
                  <div className="eyebrow text-[var(--color-muted)]">
                    {es ? "Tu firma" : "Your signature"}
                  </div>
                </div>
                {doc.accepted ? (
                  <div className="border border-emerald-200 bg-emerald-50 p-5" role="status">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 mt-0.5 text-emerald-700 shrink-0" />
                      <div>
                        <h3 className="font-[family-name:var(--font-display)] text-lg text-emerald-900 mb-1">
                          {es ? "Ya está firmado." : "Already signed."}
                        </h3>
                        <p className="text-sm text-emerald-800 leading-relaxed">
                          {es ? "Aceptado el " : "Accepted on "}
                          {doc.acceptedAt
                            ? new Date(doc.acceptedAt).toLocaleDateString(es ? "es-MX" : "en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "—"}
                          {es ? " con " : " with "}
                          {verified.email}.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-[var(--color-ink-soft)] mb-5">
                      {es
                        ? `Firmas como ${verified.email}. La IP y el navegador se guardan junto con tu aceptación.`
                        : `Signing as ${verified.email}. IP and browser are recorded with your acceptance.`}
                    </p>
                    <SignForm locale={locale} token={token} email={verified.email} />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
