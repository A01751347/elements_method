import { Leaf } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { lexiconEs, lexiconEn } from "@/data/content";
import { Container } from "@/components/ui/Container";

export function NatureLexicon({ locale }: { locale: Locale }) {
  const words = locale === "es" ? lexiconEs : lexiconEn;
  const items = [...words, ...words, ...words];

  return (
    <section className="py-20 md:py-28 bg-[var(--color-ink)] text-[var(--color-paper)] relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(184,196,168,0.4) 0%, transparent 70%)",
        }}
      />

      <Container className="relative mb-10">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-3 eyebrow text-[var(--color-paper)]/85">
            <Leaf className="h-3.5 w-3.5" strokeWidth={1.5} />
            {locale === "es" ? "Léxico del método" : "Method lexicon"}
          </div>
          <p className="text-[var(--color-paper)]/85 text-sm max-w-md text-pretty">
            {locale === "es"
              ? "Los cinco elementos y las seis fases del Protocolo de Desconexión — el vocabulario operativo del método."
              : "The five elements and the six phases of the Disconnection Protocol — the method's operating vocabulary."}
          </p>
        </div>
      </Container>

      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--color-ink)] to-transparent z-10 pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--color-ink)] to-transparent z-10 pointer-events-none"
        />

        <div className="marquee-pause">
          <div className="marquee-track marquee-track-slow">
            {items.map((w, idx) => (
              <span
                key={`${w}-${idx}`}
                className="shrink-0 inline-flex items-center gap-6 px-8"
              >
                <span className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,5vw,4.5rem)] italic font-light text-[var(--color-paper)]/95 whitespace-nowrap leading-none">
                  {w.toLowerCase()}
                </span>
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-[var(--color-paper)]/40 shrink-0"
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
