# SEO e indexación en Google — Elements Method

Todo lo que el sitio expone a los buscadores y los pasos para darlo de alta.
Actualizado: 5 de septiembre de 2026.

## 1. Qué genera el sitio automáticamente

| URL | Origen | Qué contiene |
| --- | --- | --- |
| `/robots.txt` | `src/app/robots.ts` | Permite todo salvo `/admin`, `/api/`, `/firmar/*`, `/encuesta/*`. Apunta al sitemap. |
| `/sitemap.xml` | `src/app/sitemap.ts` | Todas las páginas públicas en ES y EN con `hreflang` (es · en · x-default). Experiencias y artículos salen de la BD; se regenera cada hora. |
| `/manifest.webmanifest` | `src/app/manifest.ts` | Nombre, colores e iconos de la app. |
| `/favicon.ico`, `/icon.png`, `/apple-icon.png` | `src/app/favicon.ico`, `icon.png`, `apple-icon.png` | Favicon (16/32/48), icono 512 y Apple touch icon 180. |
| `/icons/*.png` | `public/icons/` | Iconos 192/512 y maskable para el manifest. |
| `/images/og/elements-method.jpg` | `public/images/og/` | Imagen Open Graph por defecto (1200×630) para compartir en redes. |
| `/{locale}/blog/rss.xml` | ruta existente | Feed RSS del blog (enlazado desde `<head>` en /blog y /journal). |

En cada página pública (`src/lib/seo.ts` → `pageMetadata()`):

- `<title>` con plantilla `Página · Elements Method`, `<meta name="description">` bilingüe.
- `<link rel="canonical">` y `<link rel="alternate" hreflang="es|en|x-default">`.
- Open Graph y Twitter Card (título, descripción, imagen, `og:locale`).
- `noindex, nofollow` en flujos privados: gracias, transferencia, firmar, encuesta y todo `/admin`.

Datos estructurados (schema.org, `src/lib/structuredData.ts`):

- `Organization` + `WebSite` en todas las páginas (logo, redes, contacto).
- `Event` en cada Executive Experience / retiro (fechas, sede, precio, disponibilidad, facilitadores).
- `BlogPosting` en cada artículo (autor, fechas, portada).
- `BreadcrumbList` en detalles de experiencia y artículo.

Avisos legales indexables: `/privacidad` (Aviso de Privacidad LFPDPPP), `/legal/terminos`
(contrato de adhesión), `/legal/contrato`, `/legal/nda`, `/legal/relevo`. El aviso de
cookies (`CookieBanner`) no bloquea el contenido, así que Googlebot ve la página completa.

## 2. Variables de entorno en producción

| Variable | Valor en producción | Para qué |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | `https://elementsmethod.com` | Origen canónico: canonical, hreflang, sitemap, robots, OG, JSON-LD. **Sin esto, las URLs saldrían con localhost.** |
| `GOOGLE_SITE_VERIFICATION` | código de Search Console | Emite `<meta name="google-site-verification">`. Opcional si se verifica por DNS. |
| `BING_SITE_VERIFICATION` | código de Bing Webmaster | Emite `<meta name="msvalidate.01">`. Opcional. |

Después de cambiar cualquiera de ellas hay que volver a desplegar.

## 3. Alta en Google Search Console (una sola vez)

1. Entrar a <https://search.google.com/search-console> con la cuenta de Google de la empresa.
2. **Añadir propiedad → Dominio** (`elementsmethod.com`). Google entrega un registro TXT.
   Pegarlo en el DNS del dominio (Vercel Domains, Cloudflare, GoDaddy…) y pulsar *Verificar*.
   Este método cubre `www`, sin `www`, `http` y `https` de una vez.
   - Alternativa sin tocar DNS: *Prefijo de URL* → método *Etiqueta HTML* → copiar solo el valor
     de `content="…"` en `GOOGLE_SITE_VERIFICATION`, desplegar y verificar.
3. En **Sitemaps** escribir `sitemap.xml` y enviar. Debe quedar en estado *Correcto* con ~60 URLs.
4. En **Inspección de URL** pegar `https://elementsmethod.com/es` → *Solicitar indexación*.
   Repetir con `/en`, `/es/retiros` y las tres experiencias. El resto Google lo descubre
   por el sitemap y los enlaces internos.
5. En **Configuración → Segmentación internacional** no hace falta nada: hreflang ya está en
   cada página y en el sitemap.

## 4. Bing y otros

- Bing Webmaster Tools (<https://www.bing.com/webmasters>): *Importar desde Google Search Console*
  trae el sitio y el sitemap sin pasos extra. Bing alimenta también a DuckDuckGo y ChatGPT Search.
- Google Business Profile (<https://business.google.com>): perfil de empresa con el mismo nombre,
  sitio web, teléfono y redes que el JSON-LD `Organization`. Ayuda a que aparezca el panel de
  conocimiento al buscar "Elements Method".

## 5. Dominio: un solo canónico

Elegir un único origen (`https://elementsmethod.com`) y redirigir permanentemente todo lo demás:

- `http://` → `https://` (Vercel lo hace solo).
- `www.elementsmethod.com` → `elementsmethod.com` (en Vercel: *Domains* → añadir `www` y marcar
  *Redirect to elementsmethod.com*, 308).

Si se prefiere `www` como canónico, invertir la redirección **y** poner `NEXT_PUBLIC_APP_URL=https://www.elementsmethod.com`.

## 6. Comprobaciones tras el deploy

```bash
curl -s https://elementsmethod.com/robots.txt
curl -s https://elementsmethod.com/sitemap.xml | head -40
curl -s https://elementsmethod.com/es | grep -o '<link rel="canonical"[^>]*>'
```

- Resultados enriquecidos (Event, BlogPosting, Breadcrumb): <https://search.google.com/test/rich-results>
- Validador schema.org: <https://validator.schema.org>
- Vista previa al compartir: <https://www.opengraph.xyz> o el *Post Inspector* de LinkedIn.
- Rendimiento y Core Web Vitals: <https://pagespeed.web.dev>

## 7. Qué esperar

- Google suele rastrear el home en 1–3 días tras enviar el sitemap; indexar el sitio completo
  puede tardar 1–4 semanas. *Solicitar indexación* acelera las páginas clave.
- El informe **Páginas** de Search Console muestra qué se indexó y por qué se excluyó algo
  (las páginas `noindex` aparecerán como *Excluidas por la etiqueta noindex*: es lo esperado).
- Cada artículo nuevo publicado desde el admin entra al sitemap en menos de una hora.

## 8. Mantenimiento

- Nueva página pública → añadir su par de rutas en `ROUTES` (`src/lib/seo.ts`), su entrada en
  `STATIC` (`src/app/sitemap.ts`) y usar `pageMetadata()` en su `generateMetadata`.
- Nueva ruta privada o con token → `noIndex: true` en `pageMetadata()` y, si lleva token,
  añadirla a `disallow` en `src/app/robots.ts`.
- Cambiar la imagen OG por defecto → sustituir `public/images/og/elements-method.jpg` (1200×630).

## 9. Aparecer en respuestas de IA (ChatGPT, Perplexity, Copilot, Gemini)

Los motores de respuesta citan páginas que (a) pueden rastrear, (b) responden una pregunta
concreta con frases claras y (c) aparecen mencionadas en otros sitios. El código cubre (a) y (b);
(c) es trabajo externo.

**Lo que ya hace el sitio**

- `robots.txt` permite explícitamente GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
  PerplexityBot, Bingbot, Google-Extended y otros.
- `/llms.txt`: resumen en Markdown de qué es Elements Method, servicios, experiencias 2026,
  método y artículos, con enlaces. Se regenera cada hora.
- Seis landings por intención de búsqueda (`src/data/seoLandings.ts`, ruta
  `src/app/[locale]/[landing]/page.tsx`), cada una con una **definición extraíble** («Elements
  Method es una empresa de retiros corporativos en México que…»), secciones, FAQ visible y
  JSON-LD `Service` + `FAQPage` + `BreadcrumbList`:

  | ES | EN |
  | --- | --- |
  | `/es/mejores-retiros-corporativos-mexico` (pilar) | `/en/best-corporate-retreats-mexico` |
  | `/es/retiros-corporativos` | `/en/corporate-retreats` |
  | `/es/retiros-ejecutivos` | `/en/executive-retreats` |
  | `/es/retiros-de-liderazgo` | `/en/leadership-retreats` |
  | `/es/retiros-team-building` | `/en/team-building-retreats` |
  | `/es/offsites-empresariales-mexico` | `/en/company-offsites-mexico` |

  Están enlazadas desde `/empresas` («Explora por tipo de retiro»), el footer, el sitemap y entre sí.
- `Organization` JSON-LD con `description` extraíble (`SITE_DEFINITION` en `src/lib/seo.ts`),
  `knowsAbout` y `hasOfferCatalog` con los seis servicios. `FAQPage` en el home.
- Cinco artículos SEO en `content/blog/` (ideas de retiros, cómo planear, ejecutivo vs offsite vs
  team building, 5 errores, cuánto cuesta). Publicar **uno por uno** para no sobrescribir posts
  editados desde el admin: `pnpm blog:publish --only=<slug>`.

**Lo que hay que hacer fuera del código (lo que más pesa)**

1. Menciones y enlaces: aparecer en listas «top corporate retreat companies in Mexico», blogs de
   negocios, revistas de eventos, directorios corporativos y medios locales. Ofrecer artículos
   invitados con la definición de marca tal cual.
2. LinkedIn: publicar desde la página de empresa y los perfiles de los fundadores, reutilizando
   los artículos (por ejemplo «5 errores al planear un retiro corporativo») con enlace al sitio.
3. Google Business Profile con la misma descripción y enlaces.
4. Bing Webmaster Tools (importa desde Search Console): Copilot y ChatGPT usan el índice de Bing.
5. Añadir nuevas landings solo en `src/data/seoLandings.ts`; la ruta, el sitemap, el footer, el
   cambio de idioma y el JSON-LD se actualizan solos.

Validar cada landing en <https://search.google.com/test/rich-results> (Service, FAQPage,
Breadcrumb) y comprobar `curl https://elementsmethod.com/llms.txt` tras el deploy.
