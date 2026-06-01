"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { LangSwitcher } from "./LangSwitcher";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
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
  const isHome = pathname === base || pathname === `${base}/`;
  const inverted = isHome && !scrolled;
  const links: NavLink[] = [
    { href: `${base}/${locale === "es" ? "el-metodo" : "method"}`, label: dict.nav.method },
    { href: `${base}/${locale === "es" ? "los-caminos" : "paths"}`, label: dict.nav.paths },
    { href: `${base}/${locale === "es" ? "retiros" : "retreats"}`, label: dict.nav.retreats },
    { href: `${base}/${locale === "es" ? "quienes-somos" : "who-we-are"}`, label: dict.nav.about },
    { href: `${base}/${locale === "es" ? "empresas" : "companies"}`, label: dict.nav.companies },
    { href: `${base}/${locale === "es" ? "blog" : "journal"}`, label: dict.nav.blog },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-[var(--color-paper)]/85 backdrop-blur-md border-b border-[var(--color-line)]/60"
            : "bg-transparent border-b border-transparent",
        )}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div
            className={cn(
              "flex items-center justify-between transition-[height] duration-500",
              scrolled ? "h-16" : "h-20",
            )}
          >
            <Logo locale={locale} inverted={inverted} />

            <nav className="hidden lg:flex items-center gap-8">
              {links.map((l) => {
                const isActive =
                  pathname === l.href || pathname.startsWith(`${l.href}/`);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "relative text-[0.8125rem] tracking-wide transition-colors",
                      isActive
                        ? inverted
                          ? "text-[var(--color-paper)]"
                          : "text-[var(--color-ink)]"
                        : inverted
                          ? "text-[var(--color-paper)]/70 hover:text-[var(--color-paper)]"
                          : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
                    )}
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
              <Button
                href={`${base}/${locale === "es" ? "empresas/cotizar" : "companies/quote"}`}
                size="sm"
                variant={inverted ? "outlineLight" : "primary"}
                trailingArrow
              >
                {dict.nav.cta}
              </Button>
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
                <Button
                  href={`${base}/${locale === "es" ? "empresas/cotizar" : "companies/quote"}`}
                  variant="primary"
                  trailingArrow
                  className="self-start"
                >
                  {dict.nav.cta}
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
