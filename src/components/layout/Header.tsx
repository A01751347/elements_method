"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  CalendarDays,
  CalendarClock,
  ChevronDown,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { LangSwitcher } from "./LangSwitcher";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { calLink, CAL_ENTERPRISE_PARAMS, CAL_EVENT_TYPES } from "@/shared/integrations/cal";
import {
  getNextExperience,
  isEarlyAccessActive,
} from "@/data/experiences";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
}

export function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  const pathname = usePathname() || "";
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [ctaOpen, setCtaOpen] = React.useState(false);
  const ctaRef = React.useRef<HTMLDivElement>(null);

  // The CTA is a small menu, not a redirect: next experience, full calendar,
  // or a cal.com call — close it on outside click and on navigation.
  React.useEffect(() => {
    if (!ctaOpen) return;
    function onPointerDown(ev: MouseEvent | TouchEvent) {
      if (ctaRef.current && !ctaRef.current.contains(ev.target as Node)) {
        setCtaOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [ctaOpen]);

  React.useEffect(() => {
    setCtaOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const base = `/${locale}`;
  // Routes whose first viewport is a dark hero image (paper text required).
  // Keep in sync as new dark-hero pages are added — see the `bg-gradient-to-b
  // from-[var(--color-ink)]` pattern in each page's HERO section.
  const DARK_HERO_PATHS = [
    "",
    "/el-metodo",
    "/method",
    "/los-caminos",
    "/paths",
    "/retiros",
    "/retreats",
    "/quienes-somos",
    "/who-we-are",
    "/empresas",
    "/companies",
    "/blog",
    "/journal",
  ];
  const subPath = pathname.replace(/^\/(es|en)/, "") || "";
  const hasDarkHero = DARK_HERO_PATHS.some((p) => {
    if (p === "") return subPath === "" || subPath === "/";
    return subPath === p || subPath.startsWith(`${p}/`);
  });
  const inverted = hasDarkHero && !scrolled;
  const links: NavLink[] = [
    { href: `${base}/${locale === "es" ? "el-metodo" : "method"}`, label: dict.nav.method },
    { href: `${base}/${locale === "es" ? "los-caminos" : "paths"}`, label: dict.nav.paths },
    { href: `${base}/${locale === "es" ? "retiros" : "retreats"}`, label: dict.nav.retreats },
    { href: `${base}/${locale === "es" ? "quienes-somos" : "who-we-are"}`, label: dict.nav.about },
    { href: `${base}/${locale === "es" ? "empresas" : "companies"}`, label: dict.nav.companies },
    { href: `${base}/${locale === "es" ? "blog" : "journal"}`, label: dict.nav.blog },
  ];

  const next = getNextExperience();
  const nextEarly = next ? isEarlyAccessActive(next) : false;
  const calendarHref = `${base}/${locale === "es" ? "retiros" : "retreats"}`;
  const scheduleHref = `${base}/${locale === "es" ? "agendar" : "schedule"}`;
  const nextHref = next ? `${calendarHref}/${next.slug}` : calendarHref;

  return (
    <>
      {/* The header is ALWAYS a visible band (client feedback #1: "el logo no se
       *  ve… debe haber una franja arriba porque no se ven ninguno de los
       *  títulos"). Three states, all of them a real surface:
       *    · over a dark hero  → translucent ink band + blur
       *    · scrolled          → paper band + hairline
       *    · light page at top → paper band, slightly lighter               */}
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500 print:hidden",
          scrolled
            ? "bg-[var(--color-paper)]/92 backdrop-blur-md border-b border-[var(--color-line)]/60"
            : inverted
              ? "bg-[var(--color-ink)]/55 backdrop-blur-md border-b border-[var(--color-paper)]/15"
              : "bg-[var(--color-paper)]/80 backdrop-blur-md border-b border-[var(--color-line)]/40",
        )}
      >
        {/* Extra top-edge scrim over dark heroes — softens the seam between the
         *  band and a bright sky so the band doesn't read as a hard bar. */}
        {inverted && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--color-ink)]/35 to-transparent"
          />
        )}
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div
            className={cn(
              // gap-10/gap-14 guarantees a minimum gutter between the wordmark
              // and the first nav link — `justify-between` alone let them touch
              // at ~1265px wide (client feedback #6).
              "flex items-center justify-between gap-10 xl:gap-14 transition-[height] duration-500",
              scrolled ? "h-16" : "h-20",
            )}
          >
            <Logo locale={locale} inverted={inverted} size="lg" className="shrink-0" />

            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {links.map((l) => {
                const isActive =
                  pathname === l.href || pathname.startsWith(`${l.href}/`);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "relative text-[0.875rem] tracking-wide font-medium transition-colors drop-shadow-sm",
                      isActive
                        ? inverted
                          ? "text-[var(--color-paper)]"
                          : "text-[var(--color-ink)]"
                        : inverted
                          ? "text-[var(--color-paper)] hover:text-[var(--color-paper)]"
                          : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]",
                    )}
                    style={
                      inverted
                        ? { textShadow: "0 1px 2px rgba(0,0,0,0.35)" }
                        : undefined
                    }
                  >
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className={cn(
                          "absolute left-0 right-0 -bottom-1 h-px",
                          inverted ? "bg-[var(--color-paper)]" : "bg-[var(--color-moss-700)]",
                        )}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-5">
              <LangSwitcher currentLocale={locale} inverted={inverted} />
              <div ref={ctaRef} className="relative">
                <Button
                  type="button"
                  onClick={() => setCtaOpen((v) => !v)}
                  aria-expanded={ctaOpen}
                  aria-haspopup="menu"
                  size="sm"
                  variant={inverted ? "outlineLight" : "primary"}
                >
                  {dict.nav.cta}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      ctaOpen && "rotate-180",
                    )}
                  />
                </Button>

                <AnimatePresence>
                  {ctaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18 }}
                      role="menu"
                      className="absolute right-0 top-full mt-3 w-80 bg-[var(--color-paper)] border border-[var(--color-line)] shadow-xl"
                    >
                      {next && (
                        <Link
                          href={nextHref}
                          role="menuitem"
                          className="block p-5 border-b border-[var(--color-line)] hover:bg-[var(--color-paper-warm)] transition-colors"
                        >
                          <div className="flex items-center gap-2 text-[0.6rem] tracking-[0.22em] uppercase text-[var(--color-gold-deep)] font-medium mb-2">
                            <Sparkles className="h-3 w-3" strokeWidth={1.5} />
                            {locale === "es"
                              ? "Próxima experiencia"
                              : "Next experience"}
                          </div>
                          <div className="font-[family-name:var(--font-display)] text-lg text-[var(--color-ink)] leading-tight">
                            {next.title}
                          </div>
                          <div className="mt-1 text-xs text-[var(--color-ink-soft)]">
                            {locale === "es"
                              ? next.dateLabel.es
                              : next.dateLabel.en}
                          </div>
                          {nextEarly && next.earlyLabel && (
                            <div className="mt-2 inline-block bg-[var(--color-gold)]/15 text-[var(--color-gold-deep)] px-2 py-1 text-[0.6rem] tracking-[0.14em] uppercase font-medium">
                              {locale === "es"
                                ? next.earlyLabel.es
                                : next.earlyLabel.en}
                            </div>
                          )}
                        </Link>
                      )}
                      <Link
                        href={calendarHref}
                        role="menuitem"
                        className="flex items-center gap-3 px-5 py-3.5 text-sm text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)] transition-colors"
                      >
                        <CalendarDays className="h-4 w-4 text-[var(--color-muted)]" strokeWidth={1.5} />
                        {locale === "es"
                          ? "Ver calendario de experiencias"
                          : "View experience calendar"}
                      </Link>
                      <Link
                        href={scheduleHref}
                        role="menuitem"
                        className="flex items-center gap-3 px-5 py-3.5 text-sm text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)] transition-colors"
                      >
                        <CalendarClock className="h-4 w-4 text-[var(--color-muted)]" strokeWidth={1.5} />
                        {locale === "es"
                          ? "Agendar una llamada"
                          : "Schedule a call"}
                      </Link>
                      <a
                        href={calLink(CAL_EVENT_TYPES.discoveryEnterprise, CAL_ENTERPRISE_PARAMS)}
                        role="menuitem"
                        className="flex items-center gap-3 px-5 py-3.5 text-sm text-[var(--color-ink-soft)] border-t border-[var(--color-line)] hover:bg-[var(--color-paper-warm)] transition-colors"
                      >
                        <Building2 className="h-4 w-4 text-[var(--color-muted)]" strokeWidth={1.5} />
                        {locale === "es"
                          ? "Cotizar para mi organización"
                          : "Quote for my organization"}
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              className={cn(
                "lg:hidden inline-flex h-10 w-10 items-center justify-center",
                inverted ? "text-[var(--color-paper)]" : "text-[var(--color-ink)]",
              )}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden bg-[var(--color-paper)] pt-20"
          >
            <nav className="container-page flex flex-col gap-1 pt-8 pb-12">
              {links.map((l, idx) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + idx * 0.04 }}
                >
                  <Link
                    href={l.href}
                    className="group flex items-center justify-between border-b border-[var(--color-line)] py-5"
                  >
                    <span className="font-[family-name:var(--font-display)] text-2xl">
                      {l.label}
                    </span>
                    <span className="text-[var(--color-muted)] group-hover:text-[var(--color-ink)]">
                      →
                    </span>
                  </Link>
                </motion.div>
              ))}

              <div className="mt-10 flex flex-col gap-6">
                <LangSwitcher currentLocale={locale} />
                {next && (
                  <Button
                    href={nextHref}
                    variant="primary"
                    trailingArrow
                    className="self-start"
                  >
                    {locale === "es"
                      ? `Reservar · ${next.title}`
                      : `Reserve · ${next.title}`}
                  </Button>
                )}
                <div className="flex flex-col gap-3 text-sm">
                  <Link
                    href={calendarHref}
                    className="inline-flex items-center gap-3 text-[var(--color-ink)]"
                  >
                    <CalendarDays className="h-4 w-4 text-[var(--color-muted)]" strokeWidth={1.5} />
                    {locale === "es"
                      ? "Ver calendario de experiencias"
                      : "View experience calendar"}
                  </Link>
                  <Link
                    href={scheduleHref}
                    className="inline-flex items-center gap-3 text-[var(--color-ink)]"
                  >
                    <CalendarClock className="h-4 w-4 text-[var(--color-muted)]" strokeWidth={1.5} />
                    {locale === "es" ? "Agendar una llamada" : "Schedule a call"}
                  </Link>
                  <a
                    href={calLink(CAL_EVENT_TYPES.discoveryEnterprise, CAL_ENTERPRISE_PARAMS)}
                    className="inline-flex items-center gap-3 text-[var(--color-ink-soft)]"
                  >
                    <Building2 className="h-4 w-4 text-[var(--color-muted)]" strokeWidth={1.5} />
                    {locale === "es"
                      ? "Cotizar para mi organización"
                      : "Quote for my organization"}
                  </a>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
