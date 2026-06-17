"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { faqs } from "@/data/content";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

export function FAQ({ locale }: { locale: Locale }) {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section className="py-24 md:py-36 bg-[var(--color-paper-warm)] paper-grain">
      <Container>
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <Eyebrow className="mb-6">
                {locale === "es" ? "Preguntas" : "Questions"}
              </Eyebrow>
              <h2 className="display-2 text-balance">
                {locale === "es"
                  ? "Lo que suelen preguntarnos."
                  : "What people usually ask us."}
              </h2>
              <p className="lead mt-6 text-pretty">
                {locale === "es"
                  ? "Si tu duda no aparece aquí, escríbenos. Respondemos rápido y sin guion."
                  : "If your question isn't here, write to us. We reply quickly and without a script."}
              </p>
              <a
                href="mailto:hello@elementsmethod.com"
                className="mt-6 inline-block text-sm text-[var(--color-ink)] border-b border-[var(--color-ink)]/30 pb-1 hover:border-[var(--color-ink)] transition-colors"
              >
                hello@elementsmethod.com
              </a>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="border-t border-[var(--color-line)]">
              {faqs.map((faq, idx) => {
                const isOpen = open === idx;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="border-b border-[var(--color-line)]"
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full py-7 md:py-8 flex items-start justify-between gap-6 text-left group cursor-pointer"
                    >
                      <span
                        className={cn(
                          "font-[family-name:var(--font-display)] text-xl md:text-[1.65rem] leading-snug transition-colors pr-2",
                          isOpen
                            ? "text-[var(--color-moss-700)]"
                            : "text-[var(--color-ink)] group-hover:text-[var(--color-moss-700)]",
                        )}
                      >
                        {locale === "es" ? faq.qEs : faq.qEn}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 h-9 w-9 inline-flex items-center justify-center rounded-full border transition-all",
                          isOpen
                            ? "bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]"
                            : "border-[var(--color-line)] text-[var(--color-ink)] group-hover:border-[var(--color-ink)]",
                        )}
                      >
                        {isOpen ? (
                          <Minus className="h-4 w-4" strokeWidth={1.5} />
                        ) : (
                          <Plus className="h-4 w-4" strokeWidth={1.5} />
                        )}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                            opacity: { duration: 0.3 },
                          }}
                          className="overflow-hidden"
                        >
                          <p className="pb-8 md:pb-10 pr-16 text-[var(--color-ink-soft)] leading-relaxed text-pretty max-w-2xl">
                            {locale === "es" ? faq.aEs : faq.aEn}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
