import { notFound } from "next/navigation";
import Image from "next/image";
import { AlertTriangle, FileText, Printer } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LOGO_OPAQUE } from "@/components/brand/Logo";
import { legalDocs, findLegalDoc, contactInfo } from "@/data/launchData";
import { PrintButton } from "./PrintButton";

export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const doc = findLegalDoc(slug);
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
  const doc = findLegalDoc(slug);
  if (!doc) notFound();

  const titleKey = locale === "es" ? "titleEs" : "titleEn";
  const summaryKey = locale === "es" ? "summaryEs" : "summaryEn";
  const bodyKey = locale === "es" ? "bodyEs" : "bodyEn";

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
            <div>{doc.titleEs}</div>
            <div style={{ marginTop: 4, fontFamily: "monospace" }}>{doc.slug.toUpperCase()}</div>
            <div style={{ marginTop: 4 }}>{contactInfo.addressLabelEs}</div>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="print:hidden -mt-20 pt-36 md:pt-44 pb-12 bg-[var(--color-paper-warm)]">
        <Container>
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <Eyebrow className="mb-6 flex items-center gap-3">
                <FileText className="h-3.5 w-3.5" strokeWidth={1.5} />
                {locale === "es" ? "Documentos legales" : "Legal documents"}
              </Eyebrow>
              <h1 className="display-2 text-balance">{doc[titleKey]}</h1>
              <p className="lead mt-6 text-pretty max-w-2xl">{doc[summaryKey]}</p>
            </div>
            <div className="lg:col-span-5 lg:pt-2 space-y-4">
              <div className="border-l-2 border-amber-500 bg-amber-50 px-5 py-4 text-sm text-amber-900 flex gap-3">
                <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" strokeWidth={1.5} />
                <div>
                  <div className="font-medium mb-1">
                    {locale === "es"
                      ? "Documento en borrador"
                      : "Draft document"}
                  </div>
                  <p className="leading-relaxed">
                    {locale === "es"
                      ? "Pendiente revisión legal. No usar como base de firma."
                      : "Pending legal review. Do not use as basis for signature."}
                  </p>
                </div>
              </div>
              <PrintButton
                label={
                  locale === "es" ? "Imprimir / Guardar PDF" : "Print / Save PDF"
                }
              />
            </div>
          </div>
        </Container>
      </section>

      {/* OTHER LEGAL DOCS NAV */}
      <Section spacing="tight" tone="warm" className="print:hidden">
        <div className="flex flex-wrap gap-2">
          {legalDocs.map((d) => {
            const active = d.slug === doc.slug;
            return (
              <Button
                key={d.slug}
                href={`/${locale}/legal/${d.slug}`}
                size="sm"
                variant={active ? "primary" : "secondary"}
              >
                {d[titleKey]}
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
            <LegalMarkdown body={doc[bodyKey]} />
          </article>
          <div className="lg:col-span-2 print:hidden">
            <div className="sticky top-28 text-xs text-[var(--color-muted)] space-y-3">
              <div>
                <div className="uppercase tracking-[0.18em] mb-1">
                  {locale === "es" ? "Tokens placeholder" : "Placeholder tokens"}
                </div>
                <div className="text-[var(--color-ink-soft)] tabular-nums">
                  {doc.placeholderFields.length}
                </div>
              </div>
              <div className="pt-3 border-t border-[var(--color-line)]">
                {doc.placeholderFields.map((f) => (
                  <div
                    key={f}
                    className="font-mono text-[0.7rem] text-[var(--color-ink-soft)] break-all"
                  >
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

/**
 * Minimal markdown renderer for the legal doc body. Supports the small subset
 * used by the workflow output: headings (#, ##, ###), blockquotes (>),
 * unordered lists (-), bold (**), inline code (`), and paragraphs.
 *
 * Intentionally no third-party MD lib — these docs are short skeletons.
 */
function LegalMarkdown({ body }: { body: string }) {
  const lines = body.split("\n");
  const out: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let key = 0;

  const flushList = () => {
    if (!listBuffer.length) return;
    out.push(
      <ul key={key++} className="list-disc pl-6 space-y-1">
        {listBuffer.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: inlineMd(item) }} />
        ))}
      </ul>,
    );
    listBuffer = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    if (line.startsWith("- ")) {
      listBuffer.push(line.slice(2));
      continue;
    }
    flushList();
    if (line.startsWith("> ")) {
      out.push(
        <blockquote
          key={key++}
          className="border-l-4 border-amber-500 bg-amber-50 not-italic px-5 py-3 text-amber-900 text-sm"
          dangerouslySetInnerHTML={{ __html: inlineMd(line.slice(2)) }}
        />,
      );
    } else if (line.startsWith("### ")) {
      out.push(
        <h3 key={key++} className="text-lg" dangerouslySetInnerHTML={{ __html: inlineMd(line.slice(4)) }} />,
      );
    } else if (line.startsWith("## ")) {
      out.push(
        <h2 key={key++} className="text-2xl" dangerouslySetInnerHTML={{ __html: inlineMd(line.slice(3)) }} />,
      );
    } else if (line.startsWith("# ")) {
      out.push(
        <h1 key={key++} className="text-3xl" dangerouslySetInnerHTML={{ __html: inlineMd(line.slice(2)) }} />,
      );
    } else if (line === "---") {
      out.push(<hr key={key++} />);
    } else {
      out.push(<p key={key++} dangerouslySetInnerHTML={{ __html: inlineMd(line) }} />);
    }
  }
  flushList();
  return <>{out}</>;
}

function inlineMd(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, '<code class="font-mono text-sm bg-amber-50 text-amber-900 px-1.5 py-0.5">$1</code>')
    .replace(/\{\{([A-Z_]+)\}\}/g, '<span class="font-mono text-xs bg-amber-100 text-amber-900 px-1.5 py-0.5">{{$1}}</span>');
}
