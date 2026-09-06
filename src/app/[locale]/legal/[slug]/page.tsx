import { notFound } from "next/navigation";
import Image from "next/image";
import { FileText, PenLine, ShoppingBag } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LOGO_OPAQUE } from "@/components/brand/Logo";
import { LegalMarkdown } from "@/components/legal/LegalMarkdown";
import { contactInfo } from "@/data/launchData";
import { LEGAL_DOCUMENTS, findLegalDocument, LEGAL_DOCS_VERSION } from "@/data/legalDocuments";
import { fillTokens } from "@/shared/pdf/engine";
import { legalDocTokens } from "@/shared/pdf/legalTokens";
import { PrintButton } from "./PrintButton";

export function generateStaticParams() {
  return LEGAL_DOCUMENTS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const doc = findLegalDocument(slug);
  if (!doc) return { title: "Legal" };
  return {
    title:
      locale === "en"
        ? `${doc.titleEn} — Elements Method`
        : `${doc.titleEs} — Elements Method`,
  };
}

export default async function LegalDocPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const doc = findLegalDocument(slug);
  if (!doc) notFound();
  const es = locale === "es";

  // Public copy: organizer + policy tokens from env, buyer/order tokens shown
  // as bracketed labels — the personalized copy goes to each buyer by email.
  const body = fillTokens(
    es ? doc.bodyEs : doc.bodyEn,
    legalDocTokens({ lang: locale, placeholders: "labels" }),
  );
  const isCheckout = doc.stage === "checkout";

  return (
    <>
      {/* PRINT-ONLY HEADER — visible when user prints / saves to PDF */}
      <div className="hidden print:block">
        <div style={{ borderBottom: "1px solid #2C2C2A", marginBottom: 28, paddingBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Image src={LOGO_OPAQUE} alt="Elements Method" width={64} height={64} />
            <div>
              <div style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 22, color: "#2C2C2A", fontWeight: 500 }}>
                Elements Method
              </div>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#5A5752", marginTop: 2 }}>
                Leadership Immersion Programs
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: 10, color: "#5A5752" }}>
            <div>{es ? doc.titleEs : doc.titleEn}</div>
            <div style={{ marginTop: 4, fontFamily: "monospace" }}>{doc.slug.toUpperCase()}</div>
            <div style={{ marginTop: 4 }}>{contactInfo.addressLabelEs}</div>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="print:hidden -mt-20 pt-32 md:pt-36 pb-10 bg-[var(--color-paper-warm)]">
        <Container>
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <Eyebrow className="mb-4 flex items-center gap-3">
                <FileText className="h-3.5 w-3.5" strokeWidth={1.5} />
                {es ? "Documentos legales" : "Legal documents"}
              </Eyebrow>
              <h1 className="display-3 text-balance">{es ? doc.titleEs : doc.titleEn}</h1>
              <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-[var(--color-ink-soft)] text-pretty">
                {es ? doc.summaryEs : doc.summaryEn}
              </p>
            </div>
            <div className="lg:col-span-5 lg:pt-2 space-y-4">
              <div className="border border-[var(--color-line)] bg-[var(--color-paper)] px-5 py-4 text-sm text-[var(--color-ink-soft)] flex gap-3">
                {isCheckout ? (
                  <ShoppingBag className="h-5 w-5 mt-0.5 shrink-0" strokeWidth={1.5} />
                ) : (
                  <PenLine className="h-5 w-5 mt-0.5 shrink-0" strokeWidth={1.5} />
                )}
                <div>
                  <div className="font-medium mb-1 text-[var(--color-ink)]">
                    {isCheckout
                      ? es ? "Se acepta al comprar" : "Accepted at purchase"
                      : es ? "Se firma después del pago" : "Signed after payment"}
                  </div>
                  <p className="leading-relaxed">
                    {isCheckout
                      ? es
                        ? "Es el contrato de adhesión que aceptas con la casilla al momento de la compra. Recibes por correo tu copia con los datos de tu orden."
                        : "This is the adhesion contract you accept with the checkbox at purchase. You receive your copy with your order details by email."
                      : es
                        ? "Una vez confirmado tu pago recibes por correo un enlace personal para leerlo con tus datos y firmarlo electrónicamente antes del programa."
                        : "Once your payment is confirmed you receive a personal link by email to read it with your details and sign it electronically before the program."}
                  </p>
                  <p className="mt-2 text-xs text-[var(--color-muted)]">
                    {es ? `Versión ${LEGAL_DOCS_VERSION}.0` : `Version ${LEGAL_DOCS_VERSION}.0`}
                    {" · "}
                    {es
                      ? "Los datos entre corchetes se completan con los de tu orden."
                      : "Bracketed fields are filled with your order details."}
                  </p>
                </div>
              </div>
              <PrintButton label={es ? "Imprimir / Guardar PDF" : "Print / Save PDF"} />
            </div>
          </div>
        </Container>
      </section>

      {/* OTHER LEGAL DOCS NAV */}
      <Section spacing="tight" tone="warm" className="print:hidden">
        <div className="flex flex-wrap gap-2">
          {LEGAL_DOCUMENTS.map((d) => {
            const active = d.slug === doc.slug;
            return (
              <Button
                key={d.slug}
                href={`/${locale}/legal/${d.slug}`}
                size="sm"
                variant={active ? "primary" : "secondary"}
              >
                {es ? d.titleEs : d.titleEn}
              </Button>
            );
          })}
        </div>
      </Section>

      {/* BODY */}
      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-2 print:hidden">
            <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
              {doc.slug.toUpperCase()}
            </div>
          </div>
          <article className="lg:col-span-8 print:col-span-12 prose prose-zinc max-w-none prose-headings:font-[family-name:var(--font-display)] prose-headings:tracking-tight prose-p:text-[var(--color-ink-soft)] prose-p:leading-relaxed prose-li:text-[var(--color-ink-soft)]">
            <LegalMarkdown body={body} />
          </article>
        </div>
      </Section>
    </>
  );
}
