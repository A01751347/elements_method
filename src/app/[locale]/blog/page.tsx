import Image from "next/image";
import { notFound } from "next/navigation";
import { BookOpen, Mail } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "en" ? "Articles" : "Artículos" };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden -mt-20 pt-20 text-[var(--color-paper)]">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/heroes/blog.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-ink)]/40 via-[var(--color-ink)]/55 to-[var(--color-ink)]" />
        <div className="absolute inset-0 -z-10 film-grain" />

        <Container className="relative pb-16 md:pb-24">
          <div className="eyebrow text-[var(--color-paper)]/95 mb-8 flex items-center gap-3">
            <span aria-hidden className="h-px w-12 bg-[var(--color-paper)]/40" />
            {dict.blog.eyebrow}
          </div>
          <h1 className="display-1 text-balance text-[var(--color-paper)] max-w-[16ch]">
            {dict.blog.title}
          </h1>
        </Container>
      </section>

      {/* PLACEHOLDER — content TBD */}
      <Section spacing="loose" tone="warm" className="paper-grain">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <BookOpen className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Próximamente" : "Coming soon"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {locale === "es"
                ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                : "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
            </h2>
            <p className="lead mt-8 max-w-2xl text-pretty">
              {locale === "es"
                ? "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Contenido editorial por publicar."
                : "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Editorial content pending."}
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[var(--color-paper)] border border-[var(--color-line)] p-8">
              <div className="flex items-center gap-3 eyebrow text-[var(--color-muted)] mb-4">
                <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                {locale === "es" ? "Mantente al tanto" : "Stay tuned"}
              </div>
              <p className="text-[var(--color-ink-soft)] mb-6 text-sm leading-relaxed">
                {locale === "es"
                  ? "Para información sobre próximos módulos y publicaciones."
                  : "For information about upcoming modules and publications."}
              </p>
              <Button
                href="mailto:hello@elementsmethod.com"
                trailingArrow
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
