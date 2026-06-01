"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Building2, Users, Calculator, FileCheck } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

const COMPANIES_IMAGE =
  "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=1600&q=85&auto=format&fit=crop";

const ITEMS = [
  { icon: Building2, labelEs: "Equipos directivos", labelEn: "Executive teams" },
  { icon: Users, labelEs: "Mandos medios", labelEn: "Middle management" },
  { icon: Calculator, labelEs: "Cotización transparente", labelEn: "Transparent quote" },
  { icon: FileCheck, labelEs: "Contrato + NDA", labelEn: "Contract + NDA" },
];

export function CompaniesCta({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  const base = `/${locale}`;
  return (
    <section className="py-24 md:py-36 bg-[var(--color-paper-warm)] paper-grain relative overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6"
          >
            <div className="relative aspect-[5/6] overflow-hidden">
              <Image
                src={COMPANIES_IMAGE}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/30 to-transparent" />

              {/* Floating quote card */}
              <div className="absolute bottom-6 left-6 right-6 md:right-auto md:max-w-sm bg-[var(--color-paper)]/95 backdrop-blur-sm p-6">
                <div className="eyebrow text-[var(--color-muted)] mb-2">
                  Caso · Femsa
                </div>
                <p className="font-[family-name:var(--font-display)] text-lg leading-snug text-balance">
                  {locale === "es"
                    ? "“Cambió la forma en que sostenemos conversaciones difíciles entre liderazgo.”"
                    : "“It changed how we hold difficult conversations among leadership.”"}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <Eyebrow className="mb-6">{dict.home.companiesEyebrow}</Eyebrow>
            <h2 className="display-2 text-balance">{dict.home.companiesTitle}</h2>
            <p className="lead mt-6 text-pretty max-w-xl">
              {dict.home.companiesLead}
            </p>

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5">
              {ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.labelEs} className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-[var(--color-moss-700)] mt-0.5 shrink-0" strokeWidth={1.5} />
                    <span className="text-sm text-[var(--color-ink)]">
                      {locale === "es" ? item.labelEs : item.labelEn}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                href={`${base}/${locale === "es" ? "empresas/cotizar" : "companies/quote"}`}
                size="lg"
                trailingArrow
              >
                {dict.home.companiesCta}
              </Button>
              <Button
                href={`${base}/${locale === "es" ? "empresas" : "companies"}`}
                size="lg"
                variant="secondary"
              >
                {locale === "es" ? "Conocer el programa" : "Learn the program"}
              </Button>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
