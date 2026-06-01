"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Calendar, MessageSquare } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const CTA_IMAGE =
  "https://images.unsplash.com/photo-1551632811-561732d1e306?w=2400&q=85&auto=format&fit=crop";

export function FinalCta({ locale }: { locale: Locale }) {
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

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-ink)]/40 via-[var(--color-ink)]/65 to-[var(--color-ink)]/85" />
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
            <div className="eyebrow text-[var(--color-paper)]/70 mb-6 flex items-center gap-3">
              <span aria-hidden className="h-px w-12 bg-[var(--color-paper)]/40" />
              {locale === "es" ? "Comienza" : "Begin"}
            </div>
            <h2 className="display-1 text-balance text-[var(--color-paper)] max-w-3xl">
              {locale === "es" ? (
                <>
                  El primer paso es{" "}
                  <span className="italic font-light text-[var(--color-paper-warm)]">
                    una conversación
                  </span>{" "}
                  de treinta minutos.
                </>
              ) : (
                <>
                  The first step is{" "}
                  <span className="italic font-light text-[var(--color-paper-warm)]">
                    a thirty-minute
                  </span>{" "}
                  conversation.
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
            <p className="text-[var(--color-paper)]/75 leading-relaxed">
              {locale === "es"
                ? "Sin agenda comercial. Si tiene sentido, lo construimos. Si no, te lo decimos."
                : "No sales agenda. If it makes sense, we build it. If not, we tell you."}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                href={`/${locale}/${locale === "es" ? "empresas/cotizar" : "companies/quote"}`}
                size="lg"
                trailingArrow
                className="bg-[var(--color-paper)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)]"
              >
                {locale === "es" ? "Agendar conversación" : "Schedule a call"}
              </Button>
              <Button
                href={`/${locale}/${locale === "es" ? "los-caminos" : "paths"}`}
                size="lg"
                variant="outlineLight"
              >
                {locale === "es" ? "Ver caminos" : "See paths"}
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
            label={locale === "es" ? "Agenda" : "Calendar"}
            value={locale === "es" ? "Próx. retiro · Feb 2026" : "Next retreat · Feb 2026"}
          />
          <ContactPill
            icon={MessageSquare}
            label={locale === "es" ? "Conversación" : "Conversation"}
            value="hola@elementsmethod.com"
            href="mailto:hola@elementsmethod.com"
          />
          <ContactPill
            icon={ArrowUpRight}
            label="WhatsApp"
            value={locale === "es" ? "Chat directo" : "Direct chat"}
            href="https://wa.me/525500000000"
            external
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
      <Icon className="h-5 w-5 text-[var(--color-paper)]/60 group-hover:text-[var(--color-paper)] transition-colors" strokeWidth={1.5} />
      <div>
        <div className="text-[0.7rem] tracking-[0.22em] uppercase text-[var(--color-paper)]/60">
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
