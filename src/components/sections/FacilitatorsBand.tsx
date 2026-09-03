import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { founders as staticFounders, type FounderInfo } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";

/**
 * Facilitators band — who is actually in the room.
 *
 * The brand has few written testimonials, so the strongest available proof is
 * the pair of people who facilitate every immersion: real names, real faces,
 * real track record. This sits right before the testimonial so the visitor
 * meets someone before being asked to trust a quote.
 */
export function FacilitatorsBand({
  locale,
  founders: foundersProp,
}: {
  locale: Locale;
  founders?: FounderInfo[];
}) {
  const founders =
    foundersProp && foundersProp.length > 0 ? foundersProp : staticFounders;
  if (founders.length === 0) return null;

  const es = locale === "es";

  return (
    <section className="py-24 md:py-32 bg-[var(--color-paper)]">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-end mb-14">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6">
              {es ? "Quién facilita" : "Who facilitates"}
            </Eyebrow>
            <h2 className="display-2 text-balance">
              {es
                ? "No es un método sin cara. Son ellos, en la sala, contigo."
                : "This isn't a faceless method. It's them, in the room, with you."}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="lead text-pretty">
              {es
                ? "Más de 26 años combinados acompañando líderes en organizaciones globales — coaching ejecutivo certificado, PNL, neurociencia, psicología, práctica somática y terapia de bosque. Cada experiencia la facilitan los dos."
                : "More than 26 combined years working with leaders in global organizations — certified executive coaching, NLP, neuroscience, psychology, somatic practice and forest therapy. Both of them facilitate every experience."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {founders.slice(0, 2).map((f) => (
            <article
              key={f.slug}
              className="bg-[var(--color-paper)] p-7 md:p-9 flex flex-col sm:flex-row gap-7"
            >
              <div className="relative h-32 w-32 sm:h-36 sm:w-36 shrink-0 overflow-hidden bg-[var(--color-paper-warm)]">
                <Image
                  src={f.image}
                  alt={f.name}
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-[family-name:var(--font-display)] text-2xl leading-tight">
                  {f.name}
                </h3>
                <div className="mt-2 text-[0.7rem] tracking-[0.16em] uppercase text-[var(--color-muted)]">
                  {es ? f.roleEs : f.roleEn}
                </div>
                <p className="mt-5 text-[var(--color-ink-soft)] leading-relaxed italic">
                  “{es ? f.quoteEs : f.quoteEn}”
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href={`/${locale}/${es ? "quienes-somos" : "who-we-are"}`}
            className="group inline-flex items-center gap-2 text-sm text-[var(--color-ink)] border-b border-[var(--color-ink)]/30 pb-1 hover:border-[var(--color-ink)] transition-colors"
          >
            {es ? "Conocer su trayectoria completa" : "Read their full background"}
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
