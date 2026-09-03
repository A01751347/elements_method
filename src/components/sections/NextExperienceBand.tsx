import Link from "next/link";
import { Sparkles, CalendarDays, MapPin, Users } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getNextExperience, isEarlyAccessActive } from "@/data/experiences";

/**
 * Next-experience band — the offer, stated in full, right under the hero.
 *
 * One line the visitor can read in four seconds: what, when, where, how many
 * seats, how much, and one button that goes straight to the landing where the
 * checkout lives. Used on the home page and on /el-metodo.
 */
export function NextExperienceBand({ locale }: { locale: Locale }) {
  const next = getNextExperience();
  if (!next) return null;

  const es = locale === "es";
  const early = isEarlyAccessActive(next);
  const base = `/${locale}/${es ? "retiros" : "retreats"}`;
  const mxn = (n: number) => `$${n.toLocaleString("es-MX")} MXN`;

  const price =
    next.priceMxn == null
      ? es
        ? "Por invitación"
        : "By invitation"
      : early && next.earlyPriceMxn != null
        ? `${mxn(next.earlyPriceMxn)}`
        : mxn(next.priceMxn);

  return (
    <section className="bg-[var(--color-ink)] text-[var(--color-paper)] border-t border-[var(--color-paper)]/10">
      <Container className="py-7 md:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="h-4 w-4 text-[var(--color-gold-soft)]" strokeWidth={1.5} />
              <span className="text-[0.65rem] tracking-[0.22em] uppercase font-medium text-[var(--color-gold-soft)]">
                {es ? "Próxima experiencia" : "Next experience"}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <Link
                href={`${base}/${next.slug}`}
                className="font-[family-name:var(--font-display)] text-2xl md:text-3xl hover:text-[var(--color-gold-soft)] transition-colors"
              >
                {next.title}
              </Link>
              <span className="text-[var(--color-paper)]/85 italic">
                {es ? next.tagline.es : next.tagline.en}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--color-paper)]/85">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[var(--color-paper)]/60" strokeWidth={1.5} />
                {es ? next.dateLabel.es : next.dateLabel.en}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[var(--color-paper)]/60" strokeWidth={1.5} />
                {es ? next.location.es : next.location.en}
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-[var(--color-paper)]/60" strokeWidth={1.5} />
                {es ? `${next.seats} lugares` : `${next.seats} seats`}
              </span>
            </div>
          </div>

          <div className="shrink-0 lg:text-right">
            <div className="font-[family-name:var(--font-display)] text-3xl">
              {price}
              {early && next.earlyPriceMxn != null && next.priceMxn != null && (
                <span className="ml-3 text-base text-[var(--color-paper)]/50 line-through">
                  {mxn(next.priceMxn)}
                </span>
              )}
            </div>
            {early && next.earlyLabel && (
              <div className="mt-2 inline-block bg-[var(--color-gold)]/20 text-[var(--color-gold-soft)] px-2 py-1 text-[0.6rem] tracking-[0.14em] uppercase font-medium">
                {es ? next.earlyLabel.es : next.earlyLabel.en}
              </div>
            )}
            <div className="mt-4">
              <Button
                href={`${base}/${next.slug}`}
                size="md"
                variant="solidLight"
                trailingArrow
                className="w-full lg:w-auto"
              >
                {next.ctaMode === "checkout"
                  ? es
                    ? "Reserva tu lugar"
                    : "Reserve your seat"
                  : es
                    ? "Solicita tu invitación"
                    : "Request an invitation"}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
