"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { calLink, CAL_EVENT_TYPES } from "@/shared/integrations/cal";
import {
  experiences,
  getNextExperience,
  isEarlyAccessActive,
} from "@/data/experiences";
import { type ContactInfo } from "@/data/launchData";

const CTA_IMAGE = "/images/heroes/final-cta.jpg";

/** Fecha corta para la fila: "22 SEP", "16–18 OCT". */
function shortDate(startIso: string, locale: Locale) {
  const d = new Date(`${startIso}T12:00:00-06:00`);
  const month = d
    .toLocaleDateString(locale === "es" ? "es-MX" : "en-US", { month: "short" })
    .replace(".", "")
    .toUpperCase();
  return { day: String(d.getDate()), month };
}

/**
 * Cierre del home.
 *
 * Antes era un manifiesto a 80vh con tres pastillas de contacto que repetían
 * el footer que viene justo debajo — largo y sin nada que hacer. Ahora cierra
 * con lo único que importa a esta altura de la página: las tres fechas reales,
 * con precio y modo de acceso, en filas que se pueden leer de un vistazo.
 */
export function FinalCta({
  locale,
  contact: _contact,
}: {
  locale: Locale;
  contact?: ContactInfo;
}) {
  const es = locale === "es";
  const next = getNextExperience();
  const experiencesBase = `/${locale}/${es ? "retiros" : "retreats"}`;
  const nextHref = next ? `${experiencesBase}/${next.slug}` : experiencesBase;

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const mxn = (n: number) => `$${n.toLocaleString("es-MX")}`;

  return (
    <section
      ref={ref}
      className="relative py-20 md:py-24 text-[var(--color-paper)] overflow-hidden"
    >
      <motion.div style={{ y }} className="absolute inset-0 -z-10 will-change-transform">
        <Image src={CTA_IMAGE} alt="" fill sizes="100vw" className="object-cover" />
      </motion.div>
      {/* Tinta casi plena: el texto de esta sección es todo el contenido. */}
      <div className="absolute inset-0 -z-10 bg-[var(--color-ink)]/88" />
      <div className="absolute inset-0 -z-10 film-grain pointer-events-none" />

      <Container className="relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Izquierda: la idea, en una sola frase */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="eyebrow text-[var(--color-paper)]/95 mb-6 flex items-center gap-3">
              <span aria-hidden className="h-px w-10 bg-[var(--color-paper)]/40" />
              {es ? "Reserva tu lugar" : "Reserve your seat"}
            </div>
            <h2 className="display-2 text-balance text-[var(--color-paper)]">
              {es ? (
                <>
                  Tu próxima etapa{" "}
                  <span className="italic font-light text-[var(--color-paper-warm)]">
                    ya tiene fecha
                  </span>
                  .
                </>
              ) : (
                <>
                  Your next season{" "}
                  <span className="italic font-light text-[var(--color-paper-warm)]">
                    already has a date
                  </span>
                  .
                </>
              )}
            </h2>
            <p className="mt-6 text-[var(--color-paper)]/90 leading-relaxed max-w-md">
              {es
                ? "Tres experiencias en 2026, grupos pequeños y una sola condición: llegar dispuesto a mirarte. Elige la tuya."
                : "Three experiences in 2026, small groups and a single condition: come willing to look at yourself. Choose yours."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {next && (
                <Button href={nextHref} size="md" variant="solidLight" trailingArrow>
                  {next.ctaMode === "checkout"
                    ? es
                      ? `Reserva tu lugar · ${next.title}`
                      : `Reserve your seat · ${next.title}`
                    : es
                      ? `Solicita tu invitación · ${next.title}`
                      : `Request an invitation · ${next.title}`}
                </Button>
              )}
              <Button
                href={calLink(CAL_EVENT_TYPES.discoveryIndividual)}
                size="md"
                variant="outlineLight"
              >
                {es ? "Agendar una llamada" : "Schedule a call"}
              </Button>
            </div>
          </motion.div>

          {/* Derecha: las tres fechas, escaneables */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="lg:col-span-7 border-t border-[var(--color-paper)]/20"
          >
            {experiences.map((e) => {
              const { day, month } = shortDate(e.startDateIso, locale);
              const early = isEarlyAccessActive(e);
              const price =
                e.priceMxn == null
                  ? es
                    ? "Por invitación"
                    : "By invitation"
                  : early && e.earlyPriceMxn != null
                    ? mxn(e.earlyPriceMxn)
                    : mxn(e.priceMxn);

              return (
                <Link
                  key={e.slug}
                  href={`${experiencesBase}/${e.slug}`}
                  className="group grid grid-cols-[68px_1fr_auto] items-center gap-5 py-6 border-b border-[var(--color-paper)]/20 hover:bg-[var(--color-paper)]/[0.06] transition-colors"
                >
                  <div className="text-center">
                    <div className="font-[family-name:var(--font-display)] text-3xl leading-none tabular-nums">
                      {day}
                    </div>
                    <div className="mt-1 text-[0.6rem] tracking-[0.22em] text-[var(--color-paper)]/75">
                      {month}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="font-[family-name:var(--font-display)] text-xl md:text-2xl leading-tight">
                      {e.title}
                    </div>
                    <div className="mt-1 text-sm text-[var(--color-paper)]/80 truncate">
                      {es ? e.duration.es : e.duration.en} ·{" "}
                      {es ? e.location.es : e.location.en} ·{" "}
                      {es ? `${e.seats} lugares` : `${e.seats} seats`}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="font-[family-name:var(--font-display)] text-lg">
                        {price}
                      </div>
                      {early && e.priceMxn != null && (
                        <div className="text-[0.6rem] tracking-[0.14em] uppercase text-[var(--color-gold-soft)]">
                          {es ? "Early access" : "Early access"}
                        </div>
                      )}
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-[var(--color-paper)]/70 group-hover:text-[var(--color-paper)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </Link>
              );
            })}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
