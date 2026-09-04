import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { Container } from "@/components/ui/Container";
import { ElementTest } from "@/components/forms/ElementTest";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const es = locale !== "en";
  return {
    title: es
      ? "Descubre tu elemento dominante · Elements Method"
      : "Find your dominant element · Elements Method",
    description: es
      ? "Nueve situaciones de liderazgo real. Al final sabes desde qué elemento lideras hoy, cuál te respalda y cuál te falta trabajar."
      : "Nine real leadership situations. At the end you know which element you lead from today, which one backs you up and which one you still have to work.",
  };
}

/**
 * El test que el hero prometía desde el principio. Cumple tres funciones a la
 * vez: hace verdadera la promesa del home, captura correos segmentados por
 * elemento y entrega al visitante en la landing de la experiencia más próxima.
 */
export default async function ElementTestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const es = locale === "es";

  return (
    <>
      <section className="relative min-h-[92svh] flex items-end overflow-hidden -mt-20 pt-32 md:pt-40 text-[var(--color-paper)]">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/heroes/test.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-ink)]/45 via-[var(--color-ink)]/65 to-[var(--color-ink)]" />
        <div className="absolute inset-0 -z-10 film-grain" />

        <Container className="relative pb-12 md:pb-14">
          <div className="eyebrow text-[var(--color-paper)]/95 mb-6 flex items-center gap-3">
            <span aria-hidden className="h-px w-12 bg-[var(--color-paper)]/40" />
            {es ? "9 preguntas · 3 minutos" : "9 questions · 3 minutes"}
          </div>
          <h1 className="display-hero text-balance text-[var(--color-paper)]">
            {es ? (
              <>
                Descubre tu{" "}
                <span className="italic font-light text-[var(--color-paper-warm)]">
                  elemento dominante
                </span>
                .
              </>
            ) : (
              <>
                Find your{" "}
                <span className="italic font-light text-[var(--color-paper-warm)]">
                  dominant element
                </span>
                .
              </>
            )}
          </h1>
          <p className="lead mt-7 max-w-xl text-[var(--color-paper)]/95">
            {es
              ? "Tierra, Fuego, Agua y Aire son cuatro maneras de liderar. Casi todos vivimos apoyados en una y descuidando otra. Nueve situaciones reales bastan para ver cuál es la tuya — y cuál te está faltando."
              : "Earth, Fire, Water and Air are four ways of leading. Most of us lean on one and neglect another. Nine real situations are enough to see which is yours — and which one you're missing."}
          </p>
        </Container>
      </section>

      <ElementTest locale={locale} />
    </>
  );
}
