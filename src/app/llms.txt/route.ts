import { getBlogPosts } from "@/modules/content/blog";
import { experiences } from "@/data/experiences";
import { SEO_LANDINGS } from "@/data/seoLandings";
import {
  SITE_NAME,
  SITE_URL,
  SITE_DEFINITION,
  absoluteUrl,
  localePath,
  ROUTES,
  retreatRoute,
  blogPostRoute,
} from "@/lib/seo";

export const revalidate = 3600;

/**
 * GET /llms.txt — resumen del sitio en Markdown para rastreadores de modelos
 * de IA (convención llms.txt): qué es Elements Method, qué ofrece y dónde
 * está cada cosa. Bilingüe: primero español (idioma base), luego inglés.
 */
export async function GET() {
  const posts = await getBlogPosts();
  const line = (label: string, path: string) => `- [${label}](${absoluteUrl(path)})`;

  const md = `# ${SITE_NAME}

> ${SITE_DEFINITION.es}

> ${SITE_DEFINITION.en}

Sitio: ${SITE_URL} · Idiomas: español (/es) e inglés (/en) · Sede: Ciudad de México, México.

## Qué ofrece / What we offer

${SEO_LANDINGS.map((l) => `- [${l.title.es}](${absoluteUrl(localePath("es", l.route))}) · [${l.title.en}](${absoluteUrl(localePath("en", l.route))})\n  ${l.definition.en}`).join("\n")}

## Executive Experiences 2026 (retiros abiertos / open-enrollment retreats)

${experiences
  .slice()
  .sort((a, b) => a.startDateIso.localeCompare(b.startDateIso))
  .map(
    (e) =>
      `- ${e.title} — ${e.dateLabel.en} · ${e.location.en} · ${e.duration.en}. ${e.lead.en} [ES](${absoluteUrl(localePath("es", retreatRoute(e.slug)))}) · [EN](${absoluteUrl(localePath("en", retreatRoute(e.slug)))})`,
  )
  .join("\n")}

## El método / The method

- Cuatro elementos: Tierra (identidad, estabilidad y dirección), Fuego (acción, energía y transformación), Agua (inteligencia emocional, adaptabilidad y conexión), Aire (pensamiento estratégico, perspectiva y visión); integrados en el Núcleo, el propio líder.
- Herramientas: neurociencia aplicada, programación neurolingüística (PNL), coaching ejecutivo, frameworks estratégicos y técnicas de regulación interna (breathwork, meditación, journaling).
- Cada inmersión sigue un arco de seis fases: liberación, encuentro, metodología, reflexión, diálogo e integración.
- Programas corporativos diseñados a la medida tras un discovery con RH y dirección: diagnóstico, inmersión en la naturaleza e integración. Presencial, virtual o híbrido. Grupos desde 4 personas. Facilitación en español e inglés.
${line("El Método (ES)", localePath("es", ROUTES.method))} · ${line("The Method (EN)", localePath("en", ROUTES.method))}

## Páginas clave / Key pages

${line("Organizaciones (ES)", localePath("es", ROUTES.companies))}
${line("Organizations (EN)", localePath("en", ROUTES.companies))}
${line("Cotizar un programa / Get a quote", localePath("es", ROUTES.quote))}
${line("Calendario de experiencias / Retreats calendar", localePath("es", ROUTES.retreats))}
${line("Quiénes somos / Who we are", localePath("es", ROUTES.about))}
${line("Test: descubre tu elemento dominante", localePath("es", ROUTES.test))}
${line("Contacto / Contact", localePath("es", ROUTES.contact))}
${line("Aviso de privacidad / Privacy notice", localePath("es", ROUTES.privacy))}

## Artículos / Articles

${posts.length ? posts.map((p) => `- [${p.titleEs}](${absoluteUrl(localePath("es", blogPostRoute(p.slug)))}) · [${p.titleEn}](${absoluteUrl(localePath("en", blogPostRoute(p.slug)))})`).join("\n") : "- (ver /es/blog)"}

## Recursos para rastreadores / Crawler resources

- Sitemap: ${SITE_URL}/sitemap.xml
- RSS: ${SITE_URL}/es/blog/rss.xml
`;

  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
