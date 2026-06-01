import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { clientLogos } from "@/data/content";
import { Container } from "@/components/ui/Container";

export function LogosMarquee({
  locale: _locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  // Repeat array to ensure seamless loop
  const items = [...clientLogos, ...clientLogos, ...clientLogos];

  return (
    <section className="py-16 md:py-20 bg-[var(--color-paper)] border-y border-[var(--color-line)] relative overflow-hidden">
      <Container className="mb-10">
        <p className="eyebrow text-center md:text-left">
          {dict.home.logosEyebrow}
        </p>
      </Container>

      <div className="marquee-pause relative">
        {/* Edge fade masks */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--color-paper)] to-transparent z-10 pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--color-paper)] to-transparent z-10 pointer-events-none"
        />

        <div className="marquee-track" aria-hidden>
          {items.map((logo, idx) => (
            <div
              key={`${logo.name}-${idx}`}
              className="shrink-0 px-10 md:px-16 flex items-center"
            >
              <span className="font-[family-name:var(--font-display)] text-3xl md:text-4xl tracking-[0.18em] text-[var(--color-ink)]/40 hover:text-[var(--color-ink)] transition-colors duration-500 whitespace-nowrap">
                {logo.name.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        <span className="sr-only">
          {clientLogos.map((l) => l.name).join(", ")}
        </span>
      </div>
    </section>
  );
}
