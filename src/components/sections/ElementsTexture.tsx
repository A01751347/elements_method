import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { fourElements, type ElementKey } from "@/data/content";
import { Container } from "@/components/ui/Container";

const DETAILS: Record<Exclude<ElementKey, "eter">, string> = {
  tierra: "/images/details/tierra.jpg",
  fuego: "/images/details/fuego.jpg",
  agua: "/images/details/agua.jpg",
  aire: "/images/details/aire.jpg",
};

/**
 * Banda de texturas — cuatro macros, uno por elemento.
 *
 * Va entre dos secciones largas de texto y hace dos cosas a la vez: corta el
 * muro tipográfico y repite los cuatro elementos en el idioma más físico que
 * tiene la marca — tierra agrietada, brasa, agua en círculos, semilla al
 * viento. Sin gente, sin promesa: materia.
 */
export function ElementsTexture({ locale }: { locale: Locale }) {
  const es = locale === "es";

  return (
    <section className="bg-[var(--color-paper-warm)] py-16 md:py-20 paper-grain">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {fourElements.map((el) => (
            <figure
              key={el.key}
              className="group relative aspect-square overflow-hidden bg-[var(--color-paper)]"
            >
              <Image
                src={DETAILS[el.key as Exclude<ElementKey, "eter">]}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
              />
              {/* Pie sobre tinta: el nombre siempre legible, la textura entera. */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--color-ink)] to-transparent"
              />
              <figcaption className="absolute bottom-4 left-4 right-4 flex items-baseline gap-2 text-[var(--color-paper)]">
                <span className="text-[0.6rem] tracking-[0.24em] opacity-80">
                  0{fourElements.indexOf(el) + 1}
                </span>
                <span className="font-[family-name:var(--font-display)] text-xl">
                  {es ? el.nameEs : el.nameEn}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
