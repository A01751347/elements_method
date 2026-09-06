# Admin de Elements Method — mapa final

> Cierre de la Fase 3 del rediseño (ver [`PLAN_ADMIN_2026.md`](./PLAN_ADMIN_2026.md) para el plan
> completo y [`../marca/identidad-visual.md`](../marca/identidad-visual.md) para el sistema visual).
> Todo el admin es **dinámico** (`export const dynamic = "force-dynamic"`, sesión + DB en cada
> request); ninguna ruta usa `generateStaticParams`. No hay placeholders de UI: cada lista y cada
> ficha lee y escribe directamente sobre Neon.

## 1. Mapa de rutas

| Ruta | Qué hace | Acciones (server actions) |
|---|---|---|
| `/admin` | Resumen del día: 4 cifras (ingresos, órdenes pagadas, inscripciones, cotizaciones), "Tu siguiente paso" (colas reales), banners de configuración faltante, órdenes por atender, próximos retiros. | — (solo lectura) |
| `/admin/pagos` | Lista de órdenes (Stripe + transferencia) con 4 cifras, filtros por estado, búsqueda, CSV. | `markOrderPaid`, `marcarPagada`, `cancelarOrden`, `registrarReembolso` |
| `/admin/pagos/[folio]` | Ficha de orden: productos, comprador, columna de trabajo con la acción pendiente (validar transferencia / marcar pagada / cancelar / reembolsar vía modal), bloque "Pago" (`columns={1}`), documentos aceptados y cuestionarios en `<Detalle>`. | igual que arriba |
| `/admin/transferencias` | Cola de comprobantes SPEI por validar, con modal de confirmación y enlace a la ficha de orden. | `marcarPagada` (vía modal) |
| `/admin/compradores` | Agregado por correo de `orders`, búsqueda. | — |
| `/admin/compradores/[email]` | Ficha: historial de órdenes, documentos aceptados, respuestas de formularios, total pagado. | — |
| `/admin/inscripciones` | Leads de Aplicar/Contacto/Empresas, filtros por `estado` y `fuente`, búsqueda. | `actualizarSeguimiento`, `archivar` |
| `/admin/inscripciones/[id]` | Ficha: mensaje completo, notas internas editables, cambio de status, `mailto:`. | `actualizarSeguimiento` |
| `/admin/empresas` | Cotizaciones (`enterprise_quotes`) con el enum real (`nueva/contactada/aceptada/cerrada`), filtros, búsqueda. | `actualizarCotizacion` |
| `/admin/empresas/[quoteNumber]` | Ficha: desglose (`breakdown`), cambio de status + notas, enlace al PDF público. | `actualizarCotizacion` |
| `/admin/empresas/calculadora` | Editor de `calculator_config` (formulario guiado en `.formulario-guiado`): base MXN/USD, mínimos, multiplicadores por modalidad, tramos por personas y descuento por volumen (filas dinámicas), vigencia. | `guardarCalculadora` |
| `/admin/retiros` | CRUD de `calendar_retreats`, filtros por estado, sin fallback a `launchData`. | (ver ficha y `/nuevo`) |
| `/admin/retiros/nuevo` | Formulario guiado (01–05) en `.formulario-guiado`, cierra con `AntesDeConfirmar`. | `createRetreat` |
| `/admin/retiros/[slug]` | Ficha con 4 cifras (cupo/vendidos/estado/fecha) y edición plegada; borrado con modal. | `updateRetreat`, `deleteRetreat` |
| `/admin/productos` | Lista con early access visible, toggle activo inline. | `alternarActivo` |
| `/admin/productos/[id]` | Edición: `earlyPriceMxn`, `earlyDeadline`, `coverImageUrl`, precios. | `updateProduct` |
| `/admin/locaciones` | Lista de sedes candidatas/confirmadas, filtros por estado. | (ver ficha y `/nueva`) |
| `/admin/locaciones/nueva` | Alta de sede. | `createVenue` |
| `/admin/locaciones/[slug]` | Ficha con edición y borrado (modal). | `updateVenue`, `deleteVenue` |
| `/admin/proveedores` | Lista de proveedores por disciplina/elemento, filtros por estado. | (ver ficha y `/nuevo`) |
| `/admin/proveedores/nuevo` | Alta de proveedor. | `createProvider` |
| `/admin/proveedores/[slug]` | Ficha con edición y borrado (modal). | `updateProvider`, `deleteProvider` |
| `/admin/documentos` | Lista de `document_templates` (nombre, aplica a, tipo de aceptación, requerido, versión, activo, PDF). | `alternarActiva` |
| `/admin/documentos/[slug]` | Edición ES/EN con tokens `{{…}}`, "Guardar como nueva versión" (`document_versions` + `currentVersion++`), historial de versiones, aceptaciones recientes. | `guardarPlantilla`, `guardarComoNuevaVersion`, `alternarActiva` |
| `/admin/formularios` | Builder de cuestionarios, tokens, respuestas, CSV. | `createForm`, `alternarActivo` |
| `/admin/formularios/[slug]` | Detalle: preguntas, respuestas. | `updateForm` |
| `/admin/formularios/[slug]/editar` | Edición del cuestionario. | `updateForm` |
| `/admin/formularios/[slug]/enviar` | Envío masivo: textarea "un correo por línea" → `POST /api/forms/mint` en serie, resultado por fila. | — (llama a la API de mint) |
| `/admin/formularios/nuevo` | Alta de cuestionario. | `createForm` |
| `/admin/blog` | Lista de posts, filtros borrador/publicado. | `deletePost` |
| `/admin/blog/[slug]` | Edición de post, "Ver pública ↗". | `updatePost`, `deletePost` |
| `/admin/blog/nuevo` | Alta de post. | `createPost` |
| `/admin/comentarios` | Moderación de comentarios del blog (join con `blog_posts`), pendientes primero, filtros. | `approveComment`, `rejectComment`, `marcarSpam` |
| `/admin/testimoniales` | Filtros (`estado=por-aprobar\|publicados\|sin-publicar`). | `toggleTestimonialPublished`, `approveTestimonial`, `rejectTestimonial`, `deleteTestimonial`, `createTestimonial` |
| `/admin/testimoniales/[id]` | Edición de testimonial. | `actualizarTestimonial` |
| `/admin/testimoniales/nuevo` | Alta manual de testimonial. | `createTestimonial` |
| `/admin/logos` | Lista de logos de empresas con vista previa. | `createLogo`, `deleteLogo`, `toggleLogoActive` |
| `/admin/logos/nuevo` | Alta de logo. | `createLogo` |
| `/admin/suscriptores` | KPIs, CSV, enlace a Mailchimp. | — |
| `/admin/analytics` | Config de `site_settings` (pixeles Meta/GA4/Ads/LinkedIn/GTM). | `saveTrackingSettings` |
| `/admin/ajustes/contacto` | Edición de `contact_info` + `contact_socials` (filas dinámicas), `revalidatePath("/", "layout")`. | `guardarContacto` |
| `/admin/ayuda` | Galería viva de componentes + glosario de estados + tabla de formatos. | — |
| `/admin/buscar` | Búsqueda global (`?q=`) agrupada: órdenes, compradores, inscripciones, cotizaciones. | — |
| `/admin/signin`, `/admin/signin/check` | Login con magic link (Auth.js + Resend). | — |

**Rutas de exportación**: `GET /api/admin/ordenes/export`, `GET /api/admin/suscriptores/export` (CSV).

## 2. Contrato de primitivas (resumen)

Fuente completa: [`PLAN_ADMIN_2026.md` §1.4](./PLAN_ADMIN_2026.md). Todo vive en
`src/app/admin/_components/ui.tsx` (server-safe) y `client.tsx` ("use client": dialog, pending, nav
activa, migas). Nunca usar grises de Tailwind, `lucide-react`, `window.confirm`/`alert`, ni tamaños de
texto de Tailwind (`text-xs…text-2xl`, `font-bold`) — la escala del admin es en `px` fijos porque el
`html` público usa `rem` de 17/18px.

Novedades de esta fase de cierre:

- **`Cifra`** admite `tone="acento"` además de `neutro|ok|alerta|peligro`.
- **`DatoLista`** admite `columns={1}` además de `2|3` (columna única para bloques como "Pago" en la
  ficha de orden).
- **`.celda-secundaria`** (12px, sutil, `display: block`, `margin-top: 2px`): segunda línea dentro de
  una celda de tabla (p. ej. el correo bajo el nombre) sin teñir la celda completa — a diferencia de
  `Td secondary`, que sí tiñe toda la celda, incluido el ancla de fila.
- **`.texto-ok` `.texto-alerta` `.texto-peligro` `.texto-acento` `.texto-tenue` `.texto-sutil`**: solo
  color, para "estado como texto coloreado sin insignia" (§6.7 del doc de marca). Se combinan con
  `.celda-secundaria` o con:
- **`.texto-12` `.texto-13`**: solo tamaño de fuente.
- **`.formulario-guiado`**: contenedor grid para el formulario guiado de §6.8. Una columna por
  defecto; a partir de 1150px, `grid-template-columns: 1fr 1fr; column-gap: 40px; row-gap: 24px;
  max-width: 1200px`. Los `PasoGuiado` van como hijos directos (el orden del documento los reparte
  columna 1 / columna 2 / columna 1…); `AntesDeConfirmar` ocupa `grid-column: 1 / -1` al final.

Todas las variantes viven documentadas y renderizadas en `/admin/ayuda`.

## 3. Comandos de verificación

```bash
pnpm typecheck   # tsc --noEmit — 0 errores
pnpm lint        # next lint — 0 errores (warnings fuera de src/app/admin son de otras fases)
pnpm build       # next build — todas las rutas /admin/* deben listarse como ƒ (dinámicas)

# Smoke test sin sesión (no hay forma de probar páginas autenticadas sin crear una sesión en la DB):
pnpm start -p 3111 &
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3111/admin/signin   # → 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3111/admin          # → 307 (a /admin/signin)
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3111/admin/pagos    # → 307 (a /admin/signin)
```
