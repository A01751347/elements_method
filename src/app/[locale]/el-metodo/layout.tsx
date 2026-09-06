import { isLocale } from "@/i18n/config";
import { pageMetadata, ROUTES } from "@/lib/seo";

/**
 * La página de El Método es un client component ("use client") y no puede
 * exportar metadata; este layout la aporta. /method re-exporta este layout.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata({
    locale,
    route: ROUTES.method,
    title: locale === "en" ? "The Elements Method" : "El Método Elements",
    description:
      locale === "en"
        ? "A leadership method built on four elements: Water, Fire, Air and Earth. Neuroscience, coaching and nature for leaders who want to lead from their true nature."
        : "Un método de liderazgo basado en cuatro elementos: Agua, Fuego, Aire y Tierra. Neurociencia, coaching y naturaleza para líderes que quieren liderar desde su verdadera naturaleza.",
    image: "/images/heroes/metodo.jpg",
  });
}

export default function MethodLayout({ children }: { children: React.ReactNode }) {
  return children;
}
