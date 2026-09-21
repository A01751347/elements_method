import { notFound } from "next/navigation";
import { locales, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { PageTracker } from "@/components/layout/PageTracker";
import { JsonLd } from "@/components/seo/JsonLd";
import { HtmlLang } from "@/components/seo/HtmlLang";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structuredData";
import { getTrackingConfig } from "@/shared/integrations/siteConfig";
import { getContactInfo } from "@/modules/content/contact";
import { getNextExperience } from "@/data/experiences";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const [tracking, contact] = await Promise.all([
    getTrackingConfig(),
    getContactInfo(),
  ]);

  // La barra de anuncio solo existe mientras haya una experiencia por venir;
  // cuando está, el header baja 40px y <main> compensa la altura de ambos.
  const hasBar = Boolean(getNextExperience());

  return (
    <>
      {/* Entidad Organization + WebSite para Google (schema.org), en todas
       *  las páginas públicas. Los eventos y artículos añaden el suyo. */}
      <JsonLd data={[organizationJsonLd(locale, contact), websiteJsonLd(locale)]} />
      <HtmlLang locale={locale} />
      {hasBar && <AnnouncementBar locale={locale} />}
      <Header locale={locale} dict={dict} belowBar={hasBar} />
      <main className={hasBar ? "pt-[7.5rem]" : "pt-20"}>{children}</main>
      <Footer locale={locale} dict={dict} contact={contact ?? undefined} />
      <CookieBanner locale={locale} dict={dict} tracking={tracking} />
      {/* Analítica propia y agregada: no identifica, no requiere consentimiento. */}
      <PageTracker locale={locale} />
    </>
  );
}
