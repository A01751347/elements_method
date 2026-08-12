# Integración Admin ↔ Base de datos ↔ Página principal

> Trabajo realizado: conectar el sitio público y el panel de administración a la base de datos (Neon/Postgres) para que **los cambios hechos en el admin se reflejen en la página principal**.

## Qué estaba pasando (diagnóstico)

- La **página pública** leía todo de archivos estáticos (`src/data/content.ts`, `src/data/launchData.ts`), no de la base de datos.
- El **admin** casi no escribía a la DB: los botones "Guardar / Editar / Aprobar / Marcar pagado" eran no-ops muertos, y varios "Nuevo" apuntaban a rutas 404.
- Existían queries puente (`getUpcomingRetreats`, `getPaths`) que leían de DB pero **nadie las usaba**.

Resultado: editar en el admin no cambiaba nada en el sitio.

## Qué se construyó

### 1. Capa de datos (DB como fuente de verdad)
- **Schema normalizado** para todo el contenido editorial: `src/shared/db/schema/content.ts` + `site.ts` (22 tablas: elementos+componentes, caminos, detalles de programa con bloques anidados, stats, FAQs, prácticas, fundadores+redes, secciones de home, contacto+redes, léxico, círculos, sombra, ejes) y `calendar_retreats` en `operations.ts`. Se añadió `eter` al enum de elementos.
- **Seeds** (`src/shared/db/seeds/content/*.ts`) que migran el contenido estático a la DB. Orquestados en `seed.ts`.
- **Queries de lectura** (`src/modules/content/*.ts`) que devuelven exactamente las formas que el front espera. Todas usan `safeRead(...)`: si la tabla no existe o la DB falla, **degradan al contenido estático** (el sitio nunca se rompe).

### 2. Páginas públicas → DB (con revalidación instantánea)
Leen de la DB con fallback estático y `revalidate = 60`:
`/` (home), `/los-caminos` y `/los-caminos/[slug]`, `/quienes-somos`, `/contacto`, `/retiros` (calendario + proveedores) y `/retiros/[slug]`.
Los componentes de sección aceptan un prop opcional de datos-DB con fallback a su import estático.

### 3. Admin → escritura a DB (CRUD real + revalidación)
Cada acción exige sesión de admin (`requireAdmin`) y llama `revalidatePath` sobre el admin **y las superficies públicas**, así el cambio se ve de inmediato:
- **Retiros** (`calendar_retreats`): crear / editar / eliminar + `/admin/retiros/nuevo`.
- **Locaciones** (`venues`) y **Proveedores** (`providers`): crear / editar / eliminar + `/nuevo`.
- **Productos** (editar), **Testimonios** (publicar/aprobar + nuevo), **Logos** (crear/eliminar/activar + nuevo), **Blog** (crear/editar/eliminar + nuevo + editar).
- **Comentarios** (aprobar/rechazar), **Transferencias** (marcar pagado), **Inscripciones** (cambiar estado).

### 4. Analytics & Pixeles (Meta, GA4, Google Ads, LinkedIn, GTM)
- **`/admin/analytics`** — panel para registrar todos los IDs de tracking (GA4, **Meta Pixel**, Google Ads + etiqueta de conversión, LinkedIn Insight, GTM). Editable en **runtime sin re-deploy** (tabla `site_settings`), con **fallback a variables de entorno** `NEXT_PUBLIC_*` si dejas un campo vacío.
- **Carga bajo consentimiento**: el banner de cookies carga cada pixel solo si el visitante acepta la categoría correspondiente (analítica → GA4/GTM; marketing → Meta/Google Ads/LinkedIn). Los IDs se resuelven en el server (`getTrackingConfig`) y se pasan al banner.
- **Eventos de conversión** (`src/shared/integrations/tracking.ts`): `page_view`, **`Lead`/`generate_lead`** al enviar inscripción o contacto, y **`Purchase`/`purchase`** en la página de gracias con el monto real de la orden — reflejados en GA4, Meta y Google Ads.

### Verificación
- `pnpm typecheck` → **0 errores**.
- `pnpm build` → **verde**, 138 páginas generadas, exit 0 (incluso sin las tablas nuevas, gracias a `safeRead`).

---

## ⚠️ Lo que TÚ debes correr para activarlo

El schema y el seed necesitan aplicarse a tu base de datos Neon. `drizzle-kit push` requiere una terminal interactiva, así que corre en tu terminal:

```bash
# 1. Crea las tablas nuevas en Neon (contesta las preguntas interactivas: crear tablas nuevas)
pnpm db:push

# 2. Migra el contenido de los archivos estáticos a la DB
pnpm db:seed
```

Después de esto: edita cualquier cosa en `/admin` (ej. un retiro, un proveedor, un testimonio) y aparecerá en la página pública correspondiente.

---

## Huecos de conexión cerrados (sesión de auditoría)

Tras auditar toda la cadena admin→DB→público, se cerraron estos huecos donde un cambio de admin NO se reflejaba:
- **Testimonios**: nueva query `getTestimonials()`; home y `/empresas` ahora los leen de DB. Publicar/aprobar un testimonio ya aparece en público. (Verificado end-to-end en vivo.)
- **Blog**: nueva query `getBlogPosts()` + `getBlogPostBySlug()`; la página `/blog` lista posts publicados reales, y se crearon las páginas de detalle `/blog/[slug]` y `/journal/[slug]`. Antes era un placeholder "Coming soon".
- **Logos**: query `getLogos()` lista (el componente marquee no se renderiza aún en ninguna página).
- **Contacto global**: `Footer` (aparece en todas las páginas, vía layout) y `FinalCta` (home) ahora leen `contactInfo` de DB con fallback.
- **Locaciones**: la acción de admin ahora revalida las rutas públicas de retiros.

Nota: el seed escribió `framework='ECOS'` para Éter, pero el contenido estático lo tiene como `null` (sin acrónimo). Como el público lee de DB, mostrará "ECOS". Si debe ser sin acrónimo, corregir con un `db:seed` o editando la fila.

## Bloqueantes cerrados (sesión de pagos)

- **🔒 Seguridad del webhook de Stripe — ARREGLADO.** `src/app/api/stripe/webhook/route.ts` ahora verifica la firma HMAC-SHA256 de forma nativa (sin lib `stripe`), replicando `constructEvent`: rechaza firmas falsas, requests sin firma, replays (>5 min) y bodies manipulados. Verificado con 5 pruebas unitarias. Cuando `STRIPE_WEBHOOK_SECRET` está configurado, la firma es obligatoria; sin secret (dev) acepta JSON sin firma.
- **💳 Botón de compra real — CABLEADO en Los Caminos.** `/los-caminos/[slug]` ahora muestra `<CheckoutButton>` con el precio real de la tabla `products` (Raíces=$130k, Corriente=$50k, Fuente=$120k). Los caminos sin producto (Brújula, Oneness) mantienen el flujo "Aplicar/Discovery". Mapeo slug programa→producto en `src/modules/content/pathPricing.ts`. El checkout usa el Stripe Price ID si existe, o el monto de la DB. Verificado en vivo.
  - *Retiros* se dejaron con "Aplicar ahora" a propósito (su flujo es Aplicar→Discovery→Pago, y no tienen precio numérico).

## Integraciones que aún faltan (del cronograma / PLACEHOLDERS.md)

Estas NO son de código — dependen de datos/cuentas del cliente (siguen pendientes, no las toca este trabajo):

| Falta | Por qué |
|---|---|
| Editor de admin para el **contenido editorial profundo** (texto de los 5 elementos, detalles largos de programa, FAQs, stats, fundadores) | Fuera del alcance elegido; hoy se lee de DB pero se edita re-corriendo `pnpm db:seed`. La infraestructura (tablas + queries) ya existe. |
| **`/el-metodo`** aún lee de estático | Es client component (`"use client"`); requiere separar en server-wrapper + presenter para leer de DB. Su contenido es seed-editable. |
| Pegar los IDs reales en **/admin/analytics** (GA4, Meta Pixel, Google Ads, LinkedIn) | El sistema ya está listo; solo faltan los IDs de las cuentas del cliente. Mientras tanto los pixeles no cargan (no rompen nada). |
| Crear productos en **Stripe** + capturar Price IDs | Sin esto el checkout cobra montos calculados. |
| Configurar **webhook de Stripe** al dominio prod | Sin esto los pagos no marcan la orden como `paid` automáticamente. |
| Crear **event types en Cal.com** | Sin esto `<CalEmbed>` cae al fallback de link. |
| `MAILCHIMP_LIST_ID` real | Sin esto el newsletter solo persiste local. |
| **Vercel Blob token** para comprobantes de transferencia | Sin esto no se suben de verdad. |
| `FORM_SIGNING_SECRET`, `ADMIN_EMAILS` reales en prod | Firma de docs y acceso admin. |
| Contenido real: sedes confirmadas, docs legales revisados por abogado, precios, teléfono/WhatsApp reales | Ver `PLACEHOLDERS.md`. |

### Bloqueantes duros — funcionalidad que NO existe en código (hay que construirla)

Según la auditoría del SRS v3 (RF-*) contra la implementación:

| # | Falta | Requisito | Notas |
|---|---|---|---|
| 1 | **Motor de PDF** — ✅ **comprobantes + docs legales HECHOS** · cotización empresarial pendiente (depende de #3) | RF-CMP-08, RF-DOC-03, RF-EMP-04 | Se instaló `pdf-lib` (ligero, serverless). `GET /api/comprobante/[folio]` genera comprobante con desglose de IVA; `GET /api/documento/[slug]?folio=` genera doc legal con tokens `{{...}}` rellenados. Verificado en vivo (200 · application/pdf). Cableado en gracias + admin/pagos + admin/documentos. Falta: cotización empresarial PDF (necesita la calculadora #3) y guardar el hash en `order_documents` al aceptar. |
| 2 | **ManyChat completo** (widget + webhooks bidireccionales + vinculación conversación-orden) | RF-CHT-01→05, RF-ADM-09 | Solo existe la tabla `conversations` vacía. Sin widget, sin API. **Pendiente** (requiere cuenta ManyChat). |
| 3 | ~~**Calculadora empresarial pública**~~ ✅ HECHO | RF-EMP-01→06 | `/empresas/cotizar` con calculadora en vivo (motor `pricing/enterprise.ts` leyendo `calculator_config`), `POST /api/cotizar` guarda en `enterprise_quotes` + notifica, PDF en `/api/cotizacion/[number]`. Verificado en vivo ($292,320). |
| 4 | ~~**Export de respuestas**~~ ✅ HECHO (CSV) | RF-FRM-08, RF-ADM-10 | `GET /api/forms/[slug]/export` (auth admin) → CSV con BOM UTF-8. Botón "Exportar CSV" en `/admin/formularios/[slug]`. Excel/Sheets lo abren nativo. |
| 5 | ~~**Comentarios públicos**~~ ✅ HECHO | RF-BLG-10 | `POST/GET /api/comentarios` con pre-moderación + UX fantasma (el autor ve su comentario pending por sessionId). `<CommentsSection>` en `/blog/[slug]`. La moderación admin ya existía. |
| 6 | ~~**Gate de aceptación de documentos pre-checkout**~~ ✅ HECHO | RF-CMP-02, RF-DOC-05/09 | `CheckoutButton` ahora muestra los docs `required_for_purchase` con checkboxes clip-a-clip antes de pagar; al comprar guarda snapshot inmutable (hash del PDF) en `order_documents`. |
| 7 | ~~**Botón de compra real** en Los Caminos~~ ✅ HECHO | RF-PUB-03 | Cableado en `/los-caminos/[slug]` con precio real de DB. Retiros siguen apply-first a propósito. |
| 8 | ~~**`/privacidad` (LFPDPPP)**, **sitemap.xml**, **robots.txt**, **RSS**~~ ✅ HECHO | RF-PUB-09, RF-ANL-08, RF-BLG-11 | `/privacidad` (+`/privacy`) plantilla LFPDPPP con derechos ARCO; `app/sitemap.ts` (rutas + retiros/caminos/blog dinámicos); `app/robots.ts`; RSS en `/[locale]/blog/rss.xml`. |
| 9 | ~~**Dashboard admin con KPIs de negocio**~~ ✅ HECHO | RF-ADM-03 | Reescrito: ingresos año/mes/histórico, órdenes pagadas/pendientes, tasa de conversión, cotizaciones, leads nuevos, suscriptores (todo live desde DB) + órdenes recientes + link a GA. |
| ~~10~~ | ~~Membresías~~ — **DESCARTADO por decisión del cliente** | — | No se construirá. |

### Pendientes que dependen del cliente (no de código)
- **ManyChat** (#2): requiere cuenta + construcción del widget/webhooks.
- **Cal.com**: el código funciona (`CalEmbed` con fallback), pero TODAS las env vars de Cal están vacías (`CAL_API_KEY`, `NEXT_PUBLIC_CAL_USERNAME`, etc.). Usa el username default `elementsmethod`. **Para que funcione de verdad:** crear el workspace en Cal.com con ese username y los event types (`empresas`, `exploracion-individual`, `diagnostico`), o poner `NEXT_PUBLIC_CAL_USERNAME` con el username real. No se pudo verificar que el workspace exista sin credenciales.
- **Tokens legales de PDF**: env opcionales `LEGAL_ORG_NAME/ADDRESS/RFC/REP`, `LEGAL_JURISDICTION`, `LEGAL_CITY` para rellenar los documentos; sin ellas los tokens de organización salen como `‹TOKEN›`.

### ✅ Riesgo de seguridad RESUELTO
El webhook de Stripe **ahora verifica la firma HMAC-SHA256** de forma nativa (sin lib `stripe`). Rechaza firmas falsas, requests sin firma, replays y bodies manipulados. Ya es seguro activar pagos reales (falta poner `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` reales).
