import { notFound } from "next/navigation";
import { locales, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { getTrackingConfig } from "@/shared/integrations/siteConfig";
import { getContactInfo } from "@/modules/content/contact";

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

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main className="pt-20">{children}</main>
      <Footer locale={locale} dict={dict} contact={contact ?? undefined} />
      <CookieBanner locale={locale} dict={dict} tracking={tracking} />
    </>
  );
}
