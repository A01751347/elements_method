"use client";

import * as React from "react";
import Link from "next/link";
import { Instagram, Linkedin, Send, Check, Phone, MessageCircle, Mail } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { Container } from "@/components/ui/Container";
import { LangSwitcher } from "./LangSwitcher";
import { LogoMark } from "@/components/brand/Logo";
import {
  contactInfo as staticContactInfo,
  hasRealContact,
  type ContactInfo,
} from "@/data/launchData";
import { experiences } from "@/data/experiences";

export function Footer({
  locale,
  dict,
  contact,
}: {
  locale: Locale;
  dict: Dict;
  contact?: ContactInfo;
}) {
  const contactInfo = contact ?? staticContactInfo;
  const base = `/${locale}`;
  const [email, setEmail] = React.useState("");
  // Optional phone — so we can also reach subscribers about upcoming events
  // (client feedback #40).
  const [phone, setPhone] = React.useState("");
  const [state, setState] = React.useState<"idle" | "sending" | "subscribed" | "error">(
    "idle",
  );

  async function onSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone: phone.trim() || undefined,
          source: "footer",
          locale,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setState("subscribed");
      setEmail("");
      setPhone("");
      setTimeout(() => setState("idle"), 5000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 5000);
    }
  }
  const subscribed = state === "subscribed";

  const exploreLinks = [
    { href: `${base}`, label: dict.nav.home },
    { href: `${base}/${locale === "es" ? "el-metodo" : "method"}`, label: dict.nav.method },
    { href: `${base}/${locale === "es" ? "retiros" : "retreats"}`, label: dict.nav.retreats },
    { href: `${base}/${locale === "es" ? "quienes-somos" : "who-we-are"}`, label: dict.nav.about },
    { href: `${base}/${locale === "es" ? "blog" : "journal"}`, label: dict.nav.blog },
  ];

  const retreatsBase = `${base}/${locale === "es" ? "retiros" : "retreats"}`;
  // Las tres Executive Experiences 2026, en orden de calendario. Cada link va a
  // su landing en /retiros/[slug], que es donde vive el checkout.
  const programLinks = [
    ...experiences.map((e) => ({ href: `${retreatsBase}/${e.slug}`, label: e.title })),
    {
      href: retreatsBase,
      label: locale === "es" ? "Calendario" : "Calendar",
    },
    {
      href: `${base}/${locale === "es" ? "empresas" : "companies"}`,
      label: locale === "es" ? "A la medida" : "Bespoke",
    },
  ];

  return (
    <footer className="bg-[var(--color-ink)] text-[var(--color-paper)] print:hidden">
      <Container className="pt-24 pb-12">
        {/* Top: newsletter band */}
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-[1.1fr_1fr] pb-16 border-b border-[var(--color-paper)]/10">
          <div>
            <div className="eyebrow text-[var(--color-paper)]/85 mb-4 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-[var(--color-paper)]/30" />
              {dict.footer.newsletterTitle}
            </div>
            <h2 className="display-2 text-[var(--color-paper)] max-w-xl">
              {locale === "es"
                ? "Una nota mensual. Sin ruido."
                : "A monthly note. No noise."}
            </h2>
            <p className="mt-5 text-[var(--color-paper)]/90 max-w-md leading-relaxed">
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
                disabled={state === "sending"}
                className="inline-flex items-center gap-2 text-[var(--color-paper)] hover:text-[var(--color-paper)]/95 disabled:opacity-50 transition-colors text-sm tracking-wide uppercase py-3"
              >
                {subscribed ? (
                  <>
                    <Check className="h-4 w-4" />
                    {locale === "es" ? "Listo" : "Done"}
                  </>
                ) : state === "sending" ? (
                  <>{locale === "es" ? "Enviando…" : "Sending…"}</>
                ) : state === "error" ? (
                  <>{locale === "es" ? "Reintentar" : "Retry"}</>
                ) : (
                  <>
                    {dict.common.subscribe}
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
            <label htmlFor="footer-phone" className="sr-only">
              {locale === "es" ? "Teléfono (opcional)" : "Phone (optional)"}
            </label>
            <input
              id="footer-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={
                locale === "es"
                  ? "Teléfono (opcional) — para avisarte de eventos"
                  : "Phone (optional) — so we can tell you about events"
              }
              className="w-full border-b border-[var(--color-paper)]/30 bg-transparent py-3 text-[var(--color-paper)] placeholder:text-[var(--color-paper)]/40 focus:border-[var(--color-paper)] focus:outline-none transition-colors"
            />
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
            <p className="mt-5 text-sm text-[var(--color-paper)]/85 leading-relaxed max-w-xs">
              {dict.footer.tagline}
            </p>
            <div className="mt-6 flex items-center gap-4">
              {contactInfo.socialHandles.map((s) => {
                const Icon = s.name.toLowerCase() === "linkedin" ? Linkedin : Instagram;
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="text-[var(--color-paper)]/85 hover:text-[var(--color-paper)] transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            {/* Direct contact rail — phone + WhatsApp + email */}
            <div className="mt-8 space-y-2.5 text-sm">
              {/* El teléfono semilla ("+52 55 0000 0000") no se publica: un
               *  número falso hace más daño que su ausencia. */}
              {hasRealContact(contactInfo, "phoneDisplayMx") && (
                <a
                  href={`tel:${contactInfo.phoneE164}`}
                  className="flex items-center gap-3 text-[var(--color-paper)]/90 hover:text-[var(--color-paper)] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {contactInfo.phoneDisplayMx}
                </a>
              )}
              {hasRealContact(contactInfo, "whatsappLink") && (
                <a
                  href={contactInfo.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[var(--color-paper)]/90 hover:text-[var(--color-paper)] transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
                  WhatsApp
                </a>
              )}
              <a
                href="mailto:hello@elementsmethod.com"
                className="flex items-center gap-3 text-[var(--color-paper)]/90 hover:text-[var(--color-paper)] transition-colors"
              >
                <Mail className="h-3.5 w-3.5" strokeWidth={1.5} />
                hello@elementsmethod.com
              </a>
            </div>
          </div>

          <FooterCol title={dict.footer.nav.explore} links={exploreLinks} />
          <FooterCol title={dict.footer.nav.services} links={programLinks} />

          <div>
            <h3 className="eyebrow text-[var(--color-paper)]/85 mb-5">
              {dict.footer.nav.legal}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href={`${base}/${locale === "es" ? "privacidad" : "privacy"}`}
                  className="text-[var(--color-paper)]/90 hover:text-[var(--color-paper)] transition-colors"
                >
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="text-[var(--color-paper)]/90 hover:text-[var(--color-paper)] transition-colors text-left"
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
                <Link
                  href={`${base}/legal/contrato`}
                  className="text-[var(--color-paper)]/90 hover:text-[var(--color-paper)] transition-colors"
                >
                  {locale === "es" ? "Contrato" : "Agreement"}
                </Link>
              </li>
              <li>
                <Link
                  href={`${base}/legal/nda`}
                  className="text-[var(--color-paper)]/90 hover:text-[var(--color-paper)] transition-colors"
                >
                  NDA
                </Link>
              </li>
              <li>
                <Link
                  href={`${base}/legal/relevo`}
                  className="text-[var(--color-paper)]/90 hover:text-[var(--color-paper)] transition-colors"
                >
                  {locale === "es" ? "Relevo" : "Release"}
                </Link>
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
      <h3 className="eyebrow text-[var(--color-paper)]/85 mb-5">{title}</h3>
      <ul className="space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-[var(--color-paper)]/90 hover:text-[var(--color-paper)] transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
