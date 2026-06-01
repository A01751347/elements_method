import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://elementsmethod.com"),
  title: {
    default: "Elements Method · Liderazgo desde los cuatro elementos",
    template: "%s · Elements Method",
  },
  description:
    "Programa de liderazgo experiencial articulado en los cuatro elementos. Coaching ejecutivo, inmersiones y retiros para personas y equipos.",
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
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
