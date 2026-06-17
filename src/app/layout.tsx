import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

/**
 * Official typography from elements-master document.docx:
 *   - Cormorant Garamond · Títulos · Light (300) + Regular (400)
 *   - Jost · Cuerpo · ExtraLight (200) + Light (300)
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["200", "300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://elementsmethod.com"),
  title: {
    default: "Elements Method · Leadership Immersion Programs",
    template: "%s · Elements Method",
  },
  description:
    "La naturaleza no gestiona. La naturaleza lidera. Programas de inmersión de liderazgo anclados en la sabiduría del Agua, el Fuego, el Aire y la Tierra.",
  openGraph: {
    type: "website",
    siteName: "Elements Method",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}
