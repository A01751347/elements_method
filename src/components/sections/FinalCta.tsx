"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Calendar, MessageSquare, Phone } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { calLink, CAL_EVENT_TYPES } from "@/shared/integrations/cal";
import { experiences, getNextExperience } from "@/data/experiences";
import { contactInfo as staticContactInfo, type ContactInfo } from "@/data/launchData";

const CTA_IMAGE = "/images/heroes/final-cta.jpg";

export function FinalCta({
  locale,
  contact,
}: {
  locale: Locale;
  contact?: ContactInfo;
}) {
  const contactInfo = contact ?? staticContactInfo;
  const next = getNextExperience();
  const experiencesBase = `/${locale}/${locale === "es" ? "retiros" : "retreats"}`;
  const nextHref = next ? `${experiencesBase}/${next.slug}` : experiencesBase;
  // Una sola regla, derivada de los datos: qué se compra y qué se solicita.
  const list = (mode: "checkout" | "apply") =>
    experiences.filter((e) => e.ctaMode === mode);
  const direct = list("checkout");
  const invite = list("apply");
  const join = (names: string[], and: string) =>
    names.length <= 1
      ? (names[0] ?? "")
      : `${names.slice(0, -1).join(", ")} ${and} ${names[names.length - 1]}`;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  return (
    <section
      ref={ref}
      className="relative min-h-[80vh] flex items-center text-[var(--color-paper)] overflow-hidden"
    >
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 -z-10 will-change-transform"
      >
        <Image
          src={CTA_IMAGE}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Bottom-weighted scrim — keeps the sky visible up top while reaching
       * ink@92% where the heading + body sit, so all text clears AAA. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-ink)]/45 via-[var(--color-ink)]/80 to-[var(--color-ink)]/92" />
      <div className="absolute inset-0 -z-10 film-grain pointer-events-none" />

      <Container className="relative py-24 md:py-32">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8"
          >
            <div className="eyebrow text-[var(--color-paper)]/95 mb-6 flex items-center gap-3">
              <span aria-hidden className="h-px w-12 bg-[var(--color-paper)]/40" />
              {locale === "es" ? "Reserva tu lugar" : "Reserve your seat"}
            </div>
            <h2 className="display-1 text-balance text-[var(--color-paper)] max-w-4xl">
              {locale === "es" ? (
                <>
                  No necesitamos más líderes con mejores frameworks. Necesitamos líderes que se{" "}
                  <span className="italic font-light text-[var(--color-paper-warm)]">
                    hayan encontrado a sí mismos
                  </span>{" "}
                  — y se hayan dado cuenta de que son suficientes.
                </>
              ) : (
                <>
                  We don&apos;t need more leaders with better frameworks. We need leaders who have{" "}
                  <span className="italic font-light text-[var(--color-paper-warm)]">
                    met themselves
                  </span>{" "}
                  — and found that they are enough.
                </>
              )}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-4 lg:pb-4 space-y-5"
          >
            <p className="text-[var(--color-paper)]/90 leading-relaxed">
              {direct.length > 0 && (
                <>
                  {locale === "es"
                    ? `${join(direct.map((e) => e.title), "y")} se reservan directamente — ${direct[0].seats} lugares.`
                    : `${join(direct.map((e) => e.title), "and")} are booked directly — ${direct[0].seats} seats.`}{" "}
                </>
              )}
              {invite.length > 0 &&
                (locale === "es"
                  ? `${join(invite.map((e) => e.title), "y")} es por invitación — ${invite[0].seats} lugares.`
                  : `${join(invite.map((e) => e.title), "and")} is by invitation — ${invite[0].seats} seats.`)}
            </p>
            <div className="flex flex-wrap gap-3">
              {next && (
                <Button href={nextHref} size="lg" variant="solidLight" trailingArrow>
                  {locale === "es"
                    ? next.ctaMode === "checkout"
                      ? `Reserva tu lugar · ${next.title}`
                      : `Solicita tu invitación · ${next.title}`
                    : next.ctaMode === "checkout"
                      ? `Reserve your seat · ${next.title}`
                      : `Request an invitation · ${next.title}`}
                </Button>
              )}
              <Button
                href={calLink(CAL_EVENT_TYPES.discoveryIndividual)}
                size="lg"
                variant="outlineLight"
              >
                {locale === "es" ? "Agendar una llamada" : "Schedule a call"}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Bottom contact rail */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 pt-8 border-t border-[var(--color-paper)]/20 grid sm:grid-cols-3 gap-6"
        >
          <ContactPill
            icon={Calendar}
            label={locale === "es" ? "Próximas inmersiones" : "Upcoming immersions"}
            value={locale === "es" ? "Calendario por confirmar" : "Calendar TBD"}
          />
          <ContactPill
            icon={Phone}
            label="WhatsApp"
            value={contactInfo.phoneDisplayMx}
            href={contactInfo.whatsappLink}
            external
          />
          <ContactPill
            icon={MessageSquare}
            label={locale === "es" ? "Contacto directo" : "Direct contact"}
            value="hello@elementsmethod.com"
            href="mailto:hello@elementsmethod.com"
          />
        </motion.div>
      </Container>
    </section>
  );
}

function ContactPill({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <div className="flex items-center gap-4 group">
      <Icon className="h-5 w-5 text-[var(--color-paper)]/85 group-hover:text-[var(--color-paper)] transition-colors" strokeWidth={1.5} />
      <div>
        <div className="text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-paper)]/85">
          {label}
        </div>
        <div className="text-[var(--color-paper)] text-sm group-hover:text-[var(--color-paper-warm)] transition-colors">
          {value}
        </div>
      </div>
    </div>
  );
  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }
  return content;
}
