import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import {
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  OG_IMAGE_SIZE,
  metadataBaseUrl,
} from "@/lib/seo";

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

/**
 * Verificación de propiedad para Search Console / Bing Webmaster. Solo se
 * emite la etiqueta si la env var existe; una vez verificado el dominio se
 * puede dejar (Google la re-comprueba periódicamente).
 */
function siteVerification(): Metadata["verification"] {
  const google = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  const bing = process.env.BING_SITE_VERIFICATION?.trim();
  if (!google && !bing) return undefined;
  return {
    ...(google ? { google } : {}),
    ...(bing ? { other: { "msvalidate.01": bing } } : {}),
  };
}

/**
 * Metadata base para todo el sitio. Cada página pública la especializa con
 * `pageMetadata()` (src/lib/seo.ts): canonical, hreflang, OG y noindex.
 * Favicon / apple-icon / manifest salen de los archivos convención en
 * src/app (icon.png, apple-icon.png, favicon.ico, manifest.ts).
 */
export const metadata: Metadata = {
  metadataBase: metadataBaseUrl(),
  applicationName: SITE_NAME,
  title: {
    default: SITE_TITLE.es,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION.es,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "es_MX",
    images: [{ url: DEFAULT_OG_IMAGE, ...OG_IMAGE_SIZE, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: siteVerification(),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f0e8",
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
