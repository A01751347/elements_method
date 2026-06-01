import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { paths } from "@/data/content";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { formatPriceMXN, formatPriceUSD } from "@/lib/utils";
import { ArrowUpRight, Check } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "The paths" : "Los caminos" };
}

export default async function PathsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <Section spacing="loose">
        <div className="max-w-4xl">
          <Eyebrow className="mb-6">{dict.paths.eyebrow}</Eyebrow>
          <h1 className="display-1">{dict.paths.title}</h1>
          <p className="lead mt-8 max-w-2xl">{dict.paths.lead}</p>
        </div>
      </Section>

      <Section spacing="default" contained={false}>
        <div className="border-t border-[var(--color-line)]">
          {paths.map((p, idx) => {
            const name = locale === "es" ? p.nameEs : p.nameEn;
            const short = locale === "es" ? p.shortEs : p.shortEn;
            const long = locale === "es" ? p.longEs : p.longEn;
            const includes = locale === "es" ? p.includesEs : p.includesEn;
            const modality = locale === "es" ? p.modalityEs : p.modalityEn;
            const duration = locale === "es" ? p.durationEs : p.durationEn;

            return (
              <div
                key={p.slug}
                className="border-b border-[var(--color-line)] group hover:bg-[var(--color-paper-warm)]/40 transition-colors"
              >
                <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20 grid lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-2 flex lg:flex-col items-start gap-4">
                    <span className="font-[family-name:var(--font-display)] text-5xl lg:text-6xl text-[var(--color-ink)]/15 group-hover:text-[var(--color-moss-500)]/60 transition-colors">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="lg:col-span-6">
                    <h2 className="display-2 mb-3">{name}</h2>
                    <p className="text-[var(--color-ink-soft)] text-lg italic mb-6">
                      {short}
                    </p>
                    <p className="text-[var(--color-ink-soft)] leading-relaxed max-w-xl">
                      {long}
                    </p>

                    <div className="mt-10 flex flex-wrap gap-6 text-sm">
                      <Meta
                        label={locale === "es" ? "Duración" : "Duration"}
                        value={duration}
                      />
                      <Meta
                        label={locale === "es" ? "Modalidad" : "Format"}
                        value={modality}
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="bg-[var(--color-paper)] border border-[var(--color-line)] p-8">
                      <div className="eyebrow text-[var(--color-muted)] mb-5">
                        {locale === "es" ? "Incluye" : "Includes"}
                      </div>
                      <ul className="space-y-3">
                        {includes.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-sm text-[var(--color-ink-soft)]"
                          >
                            <Check className="h-4 w-4 mt-0.5 text-[var(--color-moss-500)] shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8 pt-6 border-t border-[var(--color-line)]">
                        <div className="text-xs text-[var(--color-muted)] uppercase tracking-wide">
                          {locale === "es" ? "Inversión" : "Investment"}
                        </div>
                        <div className="mt-2 flex items-end gap-3 flex-wrap">
                          <span className="font-[family-name:var(--font-display)] text-3xl">
                            {formatPriceMXN(p.priceMxn)}
                          </span>
                          <span className="text-sm text-[var(--color-muted)]">
                            / {formatPriceUSD(p.priceUsd)}
                          </span>
                        </div>
                        <p className="mt-1 text-[0.7rem] uppercase tracking-wide text-[var(--color-muted)]">
                          {dict.common.noVat}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        <Button
                          href={`/${locale}/${locale === "es" ? "los-caminos" : "paths"}/${p.slug}`}
                          size="sm"
                          variant="primary"
                          trailingArrow
                        >
                          {dict.common.book}
                        </Button>
                        <Link
                          href="#"
                          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ink)] border-b border-[var(--color-ink)]/30 hover:border-[var(--color-ink)] pb-0.5"
                        >
                          {locale === "es" ? "Conversar" : "Talk to us"}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section spacing="default" tone="warm">
        <div className="max-w-3xl">
          <Eyebrow className="mb-4">
            {locale === "es" ? "Elementos sueltos" : "Individual elements"}
          </Eyebrow>
          <h2 className="display-2">
            {locale === "es"
              ? "¿No estás para un programa largo?"
              : "Not ready for a long program?"}
          </h2>
          <p className="lead mt-6">
            {locale === "es"
              ? "Puedes contratar cualquier elemento por separado: agua, fuego, aire o tierra. Sin compromiso anual."
              : "You can contract any element individually: water, fire, air or earth. No annual commitment."}
          </p>
          <div className="mt-8">
            <Button
              href={`/${locale}/${locale === "es" ? "el-metodo" : "method"}`}
              variant="secondary"
              trailingArrow
            >
              {locale === "es" ? "Ver los elementos" : "See the elements"}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-[var(--color-muted)] uppercase tracking-wide">
        {label}
      </div>
      <div className="mt-1 text-[var(--color-ink)]">{value}</div>
    </div>
  );
}
