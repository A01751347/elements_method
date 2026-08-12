import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://elementsmethod.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Never index admin, API, or token-gated flows.
        disallow: ["/admin", "/api/", "/es/firmar/", "/en/firmar/", "/es/encuesta/", "/en/encuesta/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
