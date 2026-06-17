"use client";

import * as React from "react";
import Link from "next/link";
import { Instagram, Linkedin, Send, Check } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/Container";
import { LangSwitcher } from "./LangSwitcher";
import { LogoMark } from "@/components/brand/Logo";

export function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  const base = `/${locale}`;
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  function onSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  }

  const exploreLinks = [
    { href: `${base}`, label: dict.nav.home },
    { href: `${base}/${locale === "es" ? "el-metodo" : "method"}`, label: dict.nav.method },
    { href: `${base}/${locale === "es" ? "los-caminos" : "paths"}`, label: dict.nav.paths },
    { href: `${base}/${locale === "es" ? "quienes-somos" : "who-we-are"}`, label: dict.nav.about },
    { href: `${base}/${locale === "es" ? "blog" : "journal"}`, label: dict.nav.blog },
  ];

  const programLinks = [
    { href: `${base}/${locale === "es" ? "los-caminos" : "paths"}`, label: locale === "es" ? "Raíces" : "Roots" },
    { href: `${base}/${locale === "es" ? "los-caminos" : "paths"}`, label: locale === "es" ? "Corriente" : "Current" },
    { href: `${base}/${locale === "es" ? "los-caminos" : "paths"}`, label: locale === "es" ? "Fuente" : "Source" },
    { href: `${base}/${locale === "es" ? "empresas" : "companies"}`, label: "Origin" },
    { href: `${base}/${locale === "es" ? "retiros" : "retreats"}`, label: dict.nav.retreats },
  ];

  return (
    <footer className="bg-[var(--color-ink)] text-[var(--color-paper)]">
      <Container className="pt-24 pb-12">
        {/* Top: newsletter band */}
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-[1.1fr_1fr] pb-16 border-b border-[var(--color-paper)]/10">
          <div>
            <div className="eyebrow text-[var(--color-paper)]/60 mb-4 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-[var(--color-paper)]/30" />
              {dict.footer.newsletterTitle}
            </div>
            <h2 className="display-2 text-[var(--color-paper)] max-w-xl">
              {locale === "es"
                ? "Una nota mensual. Sin ruido."
                : "A monthly note. No noise."}
            </h2>
            <p className="mt-5 text-[var(--color-paper)]/70 max-w-md leading-relaxed">
              {dict.footer.newsletterCopy}
            </p>
          </div>

          <form
            onSubmit={onSubscribe}
            className="self-end flex flex-col gap-3"
            aria-label={dict.footer.newsletterTitle}
          >
            <label htmlFor="footer-email" className="sr-only">
              {dict.common.enterEmail}
            </label>
            <div className="flex items-center gap-2 border-b border-[var(--color-paper)]/30 focus-within:border-[var(--color-paper)] transition-colors">
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={dict.common.enterEmail}
                className="flex-1 bg-transparent py-3 text-[var(--color-paper)] placeholder:text-[var(--color-paper)]/40 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-[var(--color-paper)] hover:text-[var(--color-paper)]/80 transition-colors text-sm tracking-wide uppercase py-3"
              >
                {subscribed ? (
                  <>
                    <Check className="h-4 w-4" />
                    {locale === "es" ? "Listo" : "Done"}
                  </>
                ) : (
                  <>
                    {dict.common.subscribe}
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
            <p className="text-[0.75rem] text-[var(--color-paper)]/50">
              {locale === "es"
                ? "Al suscribirte aceptas nuestro aviso de privacidad."
                : "By subscribing you accept our privacy notice."}
            </p>
          </form>
        </div>

        {/* Middle: nav columns */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 pt-16 pb-12">
          <div>
            <Link
              href={base}
              className="inline-flex items-center gap-2.5 text-[var(--color-paper)]"
            >
              <LogoMark inverted />
              <span className="font-[family-name:var(--font-display)] text-[1.0625rem] tracking-tight">
                Elements <span className="italic font-light">Method</span>
              </span>
            </Link>
            <p className="mt-5 text-sm text-[var(--color-paper)]/60 leading-relaxed max-w-xs">
              {dict.footer.tagline}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[var(--color-paper)]/60 hover:text-[var(--color-paper)] transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-[var(--color-paper)]/60 hover:text-[var(--color-paper)] transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <FooterCol title={dict.footer.nav.explore} links={exploreLinks} />
          <FooterCol title={dict.footer.nav.services} links={programLinks} />

          <div>
            <h3 className="eyebrow text-[var(--color-paper)]/60 mb-5">
              {dict.footer.nav.legal}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href={`${base}/${locale === "es" ? "privacidad" : "privacy"}`}
                  className="text-[var(--color-paper)]/70 hover:text-[var(--color-paper)] transition-colors"
                >
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="text-[var(--color-paper)]/70 hover:text-[var(--color-paper)] transition-colors text-left"
                  onClick={() => {
                    document.cookie =
                      "em_cookie_consent=; path=/; max-age=0";
                    window.location.reload();
                  }}
                >
                  {dict.footer.cookies}
                </button>
              </li>
              <li>
                <a
                  href="mailto:hello@elementsmethod.com"
                  className="text-[var(--color-paper)]/70 hover:text-[var(--color-paper)] transition-colors"
                >
                  hello@elementsmethod.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-8 border-t border-[var(--color-paper)]/10 text-xs text-[var(--color-paper)]/50">
          <p>
            © {new Date().getFullYear()} Elements Method · {dict.footer.rights}
          </p>
          <LangSwitcher currentLocale={locale} inverted />
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="eyebrow text-[var(--color-paper)]/60 mb-5">{title}</h3>
      <ul className="space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-[var(--color-paper)]/70 hover:text-[var(--color-paper)] transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
