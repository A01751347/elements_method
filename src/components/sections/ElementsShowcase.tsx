"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Droplets,
  Flame,
  Wind,
  Mountain,
  Atom,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import {
  fourElements as staticFourElements,
  elementImages,
  onlyElements,
  type ElementKey,
  type ElementInfo,
} from "@/data/content";
import { getNextExperience, isEarlyAccessActive } from "@/data/experiences";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// The legacy `eter` key is the Núcleo — never rendered in this section.
const ICONS: Record<ElementKey, LucideIcon> = {
  agua: Droplets,
  fuego: Flame,
  aire: Wind,
  tierra: Mountain,
  eter: Atom,
};

/** Curva y tiempos compartidos: la cortina abre antes que su contenido. */
const CURTAIN = "cubic-bezier(0.22, 1, 0.36, 1)";
const OPEN_MS = 640;
const DELAY = { image: 100, title: 180, body: 250, cta: 310 };

/**
 * Elements Showcase — cortinas.
 *
 * Cuatro franjas que forman una sola pieza continua: la activa se abre y las
 * otras tres se recogen hacia los lados sin desaparecer nunca. La apertura
 * anima `flex-grow`; la imagen contramueve al abrirse (se revela algo que ya
 * estaba detrás) y el texto entra escalonado, después de la cortina.
 *
 * Escritorio: hover o foco. Móvil: tap, con las franjas en horizontal.
 * Siempre hay un panel abierto.
 */
export function ElementsShowcase({
  locale,
  dict,
  elements: elementsProp,
}: {
  locale: Locale;
  dict: Dict;
  elements?: ElementInfo[];
}) {
  // Four elements. The Núcleo is the leader who integrates them, not a fifth
  // panel in the curtain (client feedback #7 #21).
  const shown =
    elementsProp && elementsProp.length > 0
      ? onlyElements(elementsProp)
      : staticFourElements;
  const [active, setActive] = React.useState<ElementKey>(
    shown[0]?.key ?? "tierra",
  );

  // Ruta de venta directa: el panel abierto cierra con la experiencia próxima.
  const next = getNextExperience();
  const nextEarly = next ? isEarlyAccessActive(next) : false;
  const experiencesBase = `/${locale}/${locale === "es" ? "retiros" : "retreats"}`;
  const nextHref = next ? `${experiencesBase}/${next.slug}` : experiencesBase;
  const es = locale === "es";

  return (
    <section className="bg-[var(--color-paper-warm)] py-24 md:py-36 relative paper-grain overflow-hidden">
      <Container className="relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-end mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6">{dict.home.elementsEyebrow}</Eyebrow>
            <h2 className="display-2 text-balance">{dict.home.elementsTitle}</h2>
          </div>
          <div className="lg:col-span-5">
            <p className="lead text-pretty">{dict.home.elementsLead}</p>
          </div>
        </div>

        {/* La pieza: cuatro cortinas, una sola caja */}
        <div className="flex flex-col md:flex-row gap-px bg-[var(--color-ink)] border border-[var(--color-ink)] h-[760px] md:h-[700px] lg:h-[800px]">
          {shown.map((el, idx) => {
            const isActive = active === el.key;
            const Icon = ICONS[el.key];
            const name = es ? el.nameEs : el.nameEn;
            const quality = es ? el.qualityEs : el.qualityEn;

            return (
              <article
                key={el.key}
                onMouseEnter={() => setActive(el.key)}
                aria-current={isActive ? "true" : undefined}
                className="group relative overflow-hidden bg-[var(--color-ink)] min-h-[58px] md:min-h-0"
                style={{
                  flexGrow: isActive ? 9 : 1,
                  flexBasis: 0,
                  transition: `flex-grow ${OPEN_MS}ms ${CURTAIN}`,
                }}
              >
                {/* Fondo: contramovimiento al abrir */}
                <Image
                  src={elementImages[el.key]}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className={cn(
                    "object-cover motion-reduce:transition-none",
                    isActive
                      ? "scale-100 translate-x-0"
                      : "scale-[1.14] md:translate-x-4",
                  )}
                  style={{
                    transition: `transform 900ms ${CURTAIN}`,
                    transitionDelay: `${isActive ? DELAY.image : 0}ms`,
                  }}
                />

                {/* Contraste en dos capas, no una sola tinta de color:
                 *  (a) el color del elemento solo como tinte multiplicado,
                 *  (b) tinta pura donde vive el texto — abierto en degradado
                 *      hacia el pie, cerrado plano porque el nombre va al
                 *      centro. Así el texto siempre cae sobre tinta, nunca
                 *      sobre foto ni sobre un lavado de color. */}
                <div
                  aria-hidden
                  className="absolute inset-0 mix-blend-multiply transition-opacity duration-700 motion-reduce:transition-none"
                  style={{
                    background: el.accent,
                    opacity: isActive ? 0.34 : 0.55,
                  }}
                />
                <div
                  aria-hidden
                  className={cn(
                    "absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none",
                    isActive
                      ? "bg-gradient-to-t from-[var(--color-ink)] from-30% via-[var(--color-ink)]/80 to-[var(--color-ink)]/30"
                      : "bg-[var(--color-ink)]/78",
                  )}
                />

                {/* Cerrado: número + nombre en vertical */}
                <div
                  className={cn(
                    "absolute inset-0 z-10 flex items-center justify-between md:flex-col px-5 py-5 md:py-8 text-[var(--color-paper)] transition-opacity duration-300 motion-reduce:transition-none",
                    isActive ? "opacity-0 pointer-events-none" : "opacity-100",
                  )}
                >
                  <span className="text-[0.7rem] tracking-[0.24em] tabular-nums text-[var(--color-paper)]/85">
                    0{idx + 1}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-2xl md:text-[1.75rem] tracking-tight text-[var(--color-paper)] md:[writing-mode:vertical-rl] md:rotate-180 whitespace-nowrap">
                    {name}
                  </span>
                  <Icon
                    className={cn("h-5 w-5 text-[var(--color-paper)]/85", el.animClass)}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Abierto: el contenido entra detrás de la cortina */}
                <div
                  className={cn(
                    "absolute inset-0 z-10 flex flex-col justify-end p-7 md:p-10 lg:p-14 text-[var(--color-paper)]",
                    !isActive && "pointer-events-none",
                  )}
                >
                  <div
                    className="absolute top-7 md:top-10 lg:top-14 left-7 md:left-10 lg:left-14 flex items-center gap-4 transition-all duration-500 motion-reduce:transition-none"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateY(0)" : "translateY(-8px)",
                      transitionDelay: `${isActive ? DELAY.title : 0}ms`,
                    }}
                  >
                    <span className="text-[0.7rem] tracking-[0.24em] tabular-nums text-[var(--color-paper)]/75">
                      0{idx + 1}
                    </span>
                    <span aria-hidden className="h-px w-10 bg-[var(--color-paper)]/35" />
                    {el.framework && (
                      <span className="text-[0.65rem] tracking-[0.24em] uppercase text-[var(--color-paper)]/85">
                        {el.framework}
                      </span>
                    )}
                    <Icon
                      className={cn("h-4 w-4 text-[var(--color-paper)]/85", el.animClass)}
                      strokeWidth={1.5}
                    />
                  </div>

                  <div
                    className="min-w-0 transition-all duration-500 motion-reduce:transition-none"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateY(0)" : "translateY(14px)",
                      transitionDelay: `${isActive ? DELAY.title : 0}ms`,
                    }}
                  >
                    <h3 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl lg:text-6xl leading-[0.95] tracking-tight whitespace-nowrap text-[var(--color-paper)]">
                      {name}
                    </h3>
                    <p
                      className="mt-3 text-lg md:text-xl italic truncate"
                      style={{ color: el.accentSoft }}
                    >
                      {quality}
                    </p>
                  </div>

                  <div
                    className="mt-7 max-w-[62ch] space-y-4 transition-all duration-500 motion-reduce:transition-none"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateY(0)" : "translateY(14px)",
                      transitionDelay: `${isActive ? DELAY.body : 0}ms`,
                    }}
                  >
                    <p className="text-[1.02rem] leading-relaxed text-[var(--color-paper)] line-clamp-4 md:line-clamp-5">
                      {es ? el.natureEs : el.natureEn}
                    </p>
                    <p className="hidden md:block text-[0.95rem] leading-relaxed text-[var(--color-paper)]/80 line-clamp-3">
                      {es ? el.cultivaEs : el.cultivaEn}
                    </p>
                  </div>

                  <div
                    className="mt-7 pt-6 border-t border-[var(--color-paper)]/20 flex flex-wrap items-center gap-x-6 gap-y-3 transition-all duration-500 motion-reduce:transition-none"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateY(0)" : "translateY(14px)",
                      transitionDelay: `${isActive ? DELAY.cta : 0}ms`,
                    }}
                  >
                    {next ? (
                      <>
                        <Button
                          href={nextHref}
                          size="sm"
                          variant="solidLight"
                          trailingArrow
                          tabIndex={isActive ? undefined : -1}
                        >
                          {next.ctaMode === "checkout"
                            ? es
                              ? `Reserva tu lugar · ${next.title}`
                              : `Reserve your seat · ${next.title}`
                            : es
                              ? `Solicita tu invitación · ${next.title}`
                              : `Request an invitation · ${next.title}`}
                        </Button>
                        <span className="text-[0.72rem] tracking-[0.14em] uppercase text-[var(--color-paper)]/90">
                          {es ? next.dateLabel.es : next.dateLabel.en}
                          {nextEarly && next.earlyLabel && (
                            <span className="ml-3 inline-block bg-[var(--color-gold)]/25 text-[var(--color-gold-soft)] px-2 py-1 text-[0.6rem]">
                              {es ? next.earlyLabel.es : next.earlyLabel.en}
                            </span>
                          )}
                        </span>
                      </>
                    ) : (
                      <Button
                        href={experiencesBase}
                        size="sm"
                        variant="solidLight"
                        trailingArrow
                        tabIndex={isActive ? undefined : -1}
                      >
                        {es ? "Ver experiencias" : "See experiences"}
                      </Button>
                    )}
                    <Link
                      href={`/${locale}/${es ? "el-metodo" : "method"}`}
                      tabIndex={isActive ? undefined : -1}
                      className="group/link inline-flex items-center gap-2 text-sm text-[var(--color-paper)] border-b border-[var(--color-paper)]/40 pb-0.5 hover:border-[var(--color-paper)] transition-colors"
                    >
                      {es ? `${name} a fondo` : `${name} in depth`}
                      <ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Zona de activación: cubre la franja cerrada (tap y teclado)
                 *  y se retira al abrir para no tapar los enlaces de dentro. */}
                <button
                  type="button"
                  onClick={() => setActive(el.key)}
                  onFocus={() => setActive(el.key)}
                  aria-label={`${name} — ${quality}`}
                  tabIndex={isActive ? -1 : 0}
                  className={cn(
                    "absolute inset-0 z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[var(--color-paper)]",
                    isActive && "pointer-events-none",
                  )}
                />
              </article>
            );
          })}
        </div>

        {/* Índice bajo la pieza: los cuatro siguen alcanzables sin hover */}
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2">
          {shown.map((el, idx) => (
            <button
              key={el.key}
              type="button"
              onClick={() => setActive(el.key)}
              onMouseEnter={() => setActive(el.key)}
              className={cn(
                "text-[0.72rem] tracking-[0.2em] uppercase transition-colors",
                active === el.key
                  ? "text-[var(--color-ink)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
              )}
            >
              <span className="tabular-nums">0{idx + 1}</span>{" "}
              {es ? el.nameEs : el.nameEn}
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
