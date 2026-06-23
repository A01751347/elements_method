import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

/**
 * Typography. Doc maestro spec'd ExtraLight (200) + Light (300) for body —
 * in practice that's unreadable at small sizes and on screen. Bumped to
 * Regular (400) + Medium (500) for body, kept Light (300) only for the
 * largest display headlines.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  // 300 kept ONLY for stylistic italic emphasis in display headlines.
  // Body + non-italic headings use 500/600 to stay legible on screen.
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["400", "500", "600"],
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
  icons: {
    icon: [
      { url: "/images/elements/elements_logo_nobg.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/images/elements/elements_logo.jpeg",
    shortcut: "/images/elements/elements_logo_nobg.png",
  },
  openGraph: {
    type: "website",
    siteName: "Elements Method",
    images: [
      {
        url: "/images/elements/elements_logo.jpeg",
        width: 1024,
        height: 1024,
        alt: "Elements Method",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elements Method · Leadership Immersion Programs",
    description:
      "La naturaleza no gestiona. La naturaleza lidera.",
    images: ["/images/elements/elements_logo.jpeg"],
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
