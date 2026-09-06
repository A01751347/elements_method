# Plan maestro · Rehacer el panel de administración de Elements Method

> Fecha: 5 sep 2026. Autor del plan: Fable. Ejecución: agentes Sonnet por fases.
> Identidad visual de referencia: [`docs/marca/identidad-visual.md`](../marca/identidad-visual.md)
> (adaptación de MyTicket MX: papel, tinta, un acento verde azulado, serif editorial + Inter, hairlines).

Objetivo en una frase: **que el admin sea una herramienta de operación completa, honesta (nada de
placeholders ni formularios muertos) y con una sola identidad visual, la del documento de marca.**

---

## 0. Diagnóstico: qué hay hoy

Stack: Next.js 15 (App Router, RSC) · React 19 · Drizzle + Neon · Auth.js magic link (Resend) ·
Tailwind 4 · pdf-lib · Stripe (webhook nativo). 24 rutas bajo `src/app/admin/`, 52 tablas en DB.

### 0.1 Lo que funciona y se conserva (con rediseño)

| Ruta | Estado real | Decisión |
|---|---|---|
| `/admin` | KPIs reales de DB (ingresos, órdenes, leads, cotizaciones, suscriptores) + órdenes recientes + retiros | **Conservar y convertir en "Resumen"** con "Tu siguiente paso" (colas pendientes reales). |
| `/admin/pagos` | Lista de `orders` con 4 KPIs. Sin filtros, sin detalle, sin CSV | **Conservar → "Órdenes"**: filtros por estado, búsqueda, ficha por folio, acciones (marcar pagada / cancelar / reembolsar), CSV. |
| `/admin/transferencias` | Cola de SPEI real; `markOrderPaid` manda correo de confirmación | **Conservar**: confirmación en modal (nunca sin confirmar), enlace a la ficha de orden. |
| `/admin/compradores` | Agregado por email de `orders`; sin detalle | **Conservar + ficha por comprador** (órdenes, documentos aceptados, respuestas de formularios). |
| `/admin/inscripciones` | Leads con cambio de status inline. No muestra `message` ni `notes` (existen en DB) | **Conservar + ficha del lead** con mensaje, notas editables, filtros por status/fuente, búsqueda. |
| `/admin/empresas` | Lista de `enterprise_quotes`. Mapa de status **equivocado** (usa `pending/accepted`, el enum es `nueva/contactada/aceptada/cerrada`); status y notas no editables; muestra `PlaceholderNote` sin motivo | **Conservar → "Cotizaciones"**: status editable, notas, ficha, PDF; **editor de la fórmula** (`calculator_config`). |
| `/admin/retiros` | CRUD real sobre `calendar_retreats` pero con fallback a `launchData` estático, columnas "PH", `PlaceholderNote`, `placeholderFields` | **Conservar y limpiar**: DB es la única fuente; sin placeholders; ficha de retiro; formulario guiado para crear. |
| `/admin/locaciones`, `/admin/proveedores` | CRUD real con la misma maquinaria de placeholders | **Conservar y limpiar** igual. |
| `/admin/productos` | Solo editar. **No expone `earlyPriceMxn` / `earlyDeadline`**, que son los que deciden el precio en checkout. Ni `coverImageUrl` | **Conservar + completar**: early access, portada, toggle activo inline, estado visible "Early access vigente hasta…". |
| `/admin/formularios` | Builder real, tokens, respuestas, CSV. Muestra `PlaceholderNote` sin motivo. Sin envío masivo (RF-FRM-04) | **Conservar + envío masivo** (lista de correos) + limpiar. |
| `/admin/blog`, `/admin/comentarios`, `/admin/testimoniales`, `/admin/logos`, `/admin/suscriptores` | CRUD reales | **Conservar**: comentarios muestran el post; testimoniales editables (RF-ADM-14); suscriptores con CSV + enlace a Mailchimp. |
| `/admin/analytics` | Guarda `site_settings` | **Conservar**, mover a "Ajustes". |
| `/admin/signin`, `/signin/check` | Magic link | **Conservar** como "hoja de login" de la marca. |

### 0.2 Lo inútil que se elimina

| Qué | Por qué |
|---|---|
| `/admin/calendario` | Lee solo `launchData` estático (los 9 retiros placeholder ya retirados), no está en la nav, no escribe nada. |
| `_components/AdminStub.tsx` | Sin ningún import. |
| `PlaceholderNote`, `PlaceholderBadge`, columnas "PH", inputs `placeholderFields` | Herencia del lanzamiento de 7 días. El admin ya escribe en DB; el banner miente ("los CRUD persisten en memoria"). Las columnas `is_placeholder`/`placeholder_fields` se quedan en DB (no se cambia el schema) pero dejan de usarse en UI. |
| Fallbacks a `launchData` en retiros/locaciones/proveedores del admin | El admin debe mostrar la verdad de la DB; si está vacía, estado vacío con acción. |
| `/admin/documentos/[slug]` (formulario muerto: sin `action`, "Guardar borrador" no hace nada) y la tabla de `legalDocs` estáticos | Se rehace sobre `document_templates` (la tabla que de verdad alimenta el gate de checkout y el PDF). |
| Conteos fijos en la nav ("Retiros · 9", "Locaciones · 13", "Documentos · 3") | Inventados y desactualizados. Se sustituyen por contadores de pendientes reales. |
| Bloque `.admin-shell` en `globals.css` | Parche de legibilidad sobre grises de Tailwind. Se sustituye por la hoja del admin. |
| `lucide-react` en el admin | La marca no usa librerías de iconos; glifos de texto (→ ← ✓ ⚠ +). |
| `Section/Row/Input/Textarea/Select` duplicados en `RetreatForm`, `ProductForm`, `BlogForm`, `TestimonialForm`, `LogoForm`, `MintTokenForm` | 6 copias del mismo código. Un solo set de primitivas. |
| `_STATUS_VARIANT` muerto en compradores, `"in-contact": "blue" as never` en proveedores | Código muerto / casts sucios. |

### 0.3 Lo que falta y vale la pena construir

- Fichas (detalle) de **orden**, **comprador**, **inscripción**, **cotización**, **retiro**.
- **Acciones de orden**: marcar pagada (con correo), cancelar, reembolsar (registro), con modal de confirmación.
- **Documentos legales sobre DB**: editar plantilla, versionar (`document_versions` + `currentVersion++`), activar/desactivar, "requerido para compra", "aplica a". Ver aceptaciones por orden.
- **Editor de la fórmula de cotización** (`calculator_config`): base por sesión, multiplicadores, tramos, descuentos por volumen, vigencia.
- **Ajustes → Contacto**: editar `contact_info` + `contact_socials` (hoy solo por seed; el footer público ya lee de DB).
- **Envío masivo de cuestionarios** (textarea de correos → N tokens + correos).
- **Búsqueda global** (`/admin/buscar?q=`): folio, correo, nombre, empresa en órdenes, compradores, inscripciones, cotizaciones.
- **Exportar CSV**: órdenes y suscriptores.
- `loading.tsx`, `error.tsx`, `not-found.tsx` del admin con la marca.

### 0.4 Fuera de alcance (deliberado)

- Editor TipTap para blog (RF-ADM-13): se mantiene textarea; añadir dependencia queda para después.
- Conversaciones ManyChat (RF-ADM-09) y citas Cal.com: no hay integración de datos aún.
- Descuentos por combinación (`product_combinations`): sin UI de checkout que los use.
- Membresías: descartado por el cliente.
- Cambios de schema: **ninguno**. Todo se construye sobre las tablas/columnas existentes.
- Sitio público: no se toca (salvo `globals.css` para quitar `.admin-shell`).

---

## 1. Sistema visual del admin (contrato)

Todo agente construye contra este contrato. Fuente: `docs/marca/identidad-visual.md`.

### 1.1 Archivos

```
src/app/admin/admin.css               ← tokens + base + componentes (scoped a .admin)
src/app/admin/_components/ui.tsx      ← primitivas server-safe
src/app/admin/_components/client.tsx  ← primitivas con estado (dialog, pending, nav activa, migas)
src/app/admin/_components/icons.tsx   ← 8 iconos SVG propios (buscar, salir, flecha, menu, cerrar, listo, aviso, mas)
src/app/admin/_lib/format.ts          ← mxn, fechaCorta, fechaLarga, fechaHora, fechaCompleta, hora
src/app/admin/_lib/status.ts          ← mapas de estado → {label, tone} para orden, lead, cotización, retiro, sede, proveedor, comentario, token, mailchimp
src/app/admin/layout.tsx              ← shell: sidebar + barra superior + pie; carga Inter con next/font
src/app/admin/loading.tsx · error.tsx · not-found.tsx
```

### 1.2 Tokens CSS (en `.admin`, nombres exactos)

`--papel --tarjeta --sidebar --nav-activo --tinta --tenue --sutil --hair --hair-fuerte --acento --acento-tinta
--acento-suave --ok --ok-suave --alerta --alerta-suave --peligro --peligro-suave --font-editorial --font-sans --radio: 2px`.

Base dentro de `.admin`: `background: var(--papel); color: var(--tinta); font: 14px/1.5 var(--font-sans);
font-feature-settings: 'cv11','ss01'; -webkit-font-smoothing: antialiased`. Los `h1..h3` en serif con
`text-wrap: balance`. `:focus-visible` con acento 3 px / offset 3 px. `::selection` acento-suave.
`prefers-reduced-motion` apaga transiciones. Radio 2 px en todo. **Sin sombras** salvo el modal.

Nota de integración: `globals.css` fija `html { font-size: 17px/18px }` y fuentes Cormorant/Jost para el
sitio público. El admin usa **px** en su hoja y sobrescribe la familia bajo `.admin`, así el público no cambia.

### 1.3 Clases CSS públicas (usarlas; no inventar grises de Tailwind)

`.etiqueta` `.etiqueta-seccion` `.tarjeta` `.cifra` `.cifra-grid` `.tabla` `.fila-enlace` `.insignia`
(+ `.insignia-ok .insignia-alerta .insignia-acento .insignia-neutra .insignia-peligro .insignia-invertida
.insignia-contorno .insignia-contador`) `.boton` (+ `.boton-primario .boton-secundario .boton-peligro
.boton-texto`) `.girito` `.banner` (+ `.banner-info .banner-aviso .banner-error`) `.estado-vacio` `.campo`
`.pista` `.input` `.filtros` `.filtro-enlace` `.conteo` `.paginacion` `.detalle` `.volver` `.ficha-cabecera`
`.ficha-columnas` `.ficha-trabajo` `.renglon-destacado` `.paso` `.paso-numero` `.modal` `.migas` `.marca`
`.marca-nombre` `.marca-sub` `.marca-icono` `.nav-grupo` `.nav-enlace` `.opcion-tarjeta` `.chip` `.esqueleto`.

Tailwind se usa **solo para layout** (`flex grid gap-* mb-* max-w-*`), nunca para color ni tamaño de texto.
Prohibido en el admin: `zinc-*`, `emerald-*`, `amber-*`, `blue-*`, `red-*`, `bg-white`, `rounded-lg/xl`,
`shadow-*`, `lucide-react`, `window.confirm`, `alert`.

### 1.4 Primitivas React (firmas)

```tsx
// ui.tsx (server-safe, sin hooks)
PageHeader({ title, subtitle?, actions?, count?: {n, singular, plural} })
FichaHeader({ back: {href,label}, kicker?, title, badge?, meta?, aside?: {label, value} })
Etiqueta({ children, as?: 'span'|'div'|'label'|'h2', tone?: 'tenue'|'tinta'|'peligro'|'acento' })
SeccionEtiqueta({ children, action?: ReactNode })            // h2.etiqueta-seccion + enlace "Ver todas →"
Cifra({ label, value, note?, tone?: 'neutro'|'ok'|'alerta'|'peligro', href? })
CifraGrid({ children })
Tabla({ children, caption? })  Th({ children, align?: 'left'|'right' })  Td({ children, align?, secondary?, numeric? })
FilaEnlace({ href, children })                                // <tr> con enlace estirado
Insignia({ children, tone: 'ok'|'alerta'|'acento'|'neutra'|'peligro'|'invertida'|'contorno'|'contador' })
Boton({ children, tone?: 'primario'|'secundario'|'peligro'|'texto', href?, type?, disabled?, external? })
Banner({ children, tone: 'info'|'aviso'|'error' })
EstadoVacio({ title, body?, action? })
Tarjeta({ title?, children, padding?: 'normal'|'compacta' })
Campo({ label, hint?, htmlFor?, children, required? })
Input(props de <input>)  Textarea(props)  Select(props)  Checkbox({ name, label, defaultChecked? })
Filtros({ items: {href,label,count?,active}[] })
Conteo({ n, singular, plural })                               // "6 órdenes encontradas"
Paginacion({ page, pages, hrefFor(page) })
Detalle({ summary, children, open? })                          // <details> con +/− en acento
DatoLista({ items: {label, value}[], columns?: 2|3 })          // <dl> etiqueta/valor
Volver({ href, children })                                     // "← Órdenes"
PasoGuiado({ numero: '01', pregunta, hint?, children })
AntesDeConfirmar({ children, boton })                          // etiqueta + párrafo + botón primario

// client.tsx
BotonPendiente({ children, pendingLabel, tone? })              // useFormStatus: desactiva + girito + texto de espera
ConfirmarAccion({ trigger, title, body, confirmLabel, pendingLabel, action, tone?: 'tinta'|'peligro', hidden?: {name,value}[] })
   // <dialog> nativo; dentro un <form action={action}> con los hidden; foco inicial en Cancelar
NavEnlace({ href, children, count? })                          // usePathname → aria-current
Migas()                                                        // usePathname → Inicio / Sección / Detalle
MenuMovil({ children })                                        // <details> "Menú"
```

Las server actions que se disparan desde `ConfirmarAccion` deben tener firma `(fd: FormData) => Promise<void>`
(o estar `bind`eadas antes). Sin `redirect` cuando la acción es inline (solo `revalidatePath`).

### 1.5 Navegación

```
[Elements Method]            ← "Elements" tinta · "Method" acento
LIDERAZGO · OPERACIÓN
[ + Nuevo retiro ]           ← botón negro 44 px

OPERACIÓN
  Resumen                /admin
  Órdenes                /admin/pagos
  Transferencias · n     /admin/transferencias        (n = por validar)
  Compradores            /admin/compradores
  Inscripciones · n      /admin/inscripciones         (n = nuevas)
  Cotizaciones · n       /admin/empresas              (n = nuevas)
CATÁLOGO
  Retiros                /admin/retiros
  Productos              /admin/productos
  Locaciones             /admin/locaciones
  Proveedores            /admin/proveedores
  Documentos             /admin/documentos
  Formularios            /admin/formularios
CONTENIDO
  Blog                   /admin/blog
  Comentarios · n        /admin/comentarios           (n = pendientes)
  Testimoniales · n      /admin/testimoniales         (n = sin aprobar)
  Logos                  /admin/logos
  Suscriptores           /admin/suscriptores
AJUSTES
  Analytics              /admin/analytics
  Contacto               /admin/ajustes/contacto
  Ayuda                  /admin/ayuda

[avatar inicial] correo@…     [salir]
```

Barra superior: migas + búsqueda global (`GET /admin/buscar?q=`). Pie: "Elements Method · Operación" /
"Horarios de Ciudad de México". Los contadores se calculan en el layout con `Promise.all` y degradan a 0.

---

## 2. Fases y agentes (todos Sonnet)

Regla de oro: **cada agente es dueño de directorios disjuntos**. Nadie toca archivos de otro. Nadie corre
`db:push`, `db:seed` ni scripts que muten la DB. Nadie hace commit. Al terminar, cada agente corre
`pnpm typecheck` y arregla lo suyo.

### Fase 1 · Fundación (1 agente, secuencial)

Dueño de: `src/app/admin/admin.css`, `src/app/admin/_components/**` (nuevos), `src/app/admin/_lib/**`,
`src/app/admin/layout.tsx`, `src/app/admin/loading.tsx`, `error.tsx`, `not-found.tsx`,
`src/app/admin/signin/**`, `src/app/admin/ayuda/page.tsx`, `src/app/globals.css` (solo quitar `.admin-shell`),
borrar `src/app/admin/calendario/` y `_components/AdminStub.tsx`.

Entrega: el contrato de §1 completo y funcionando, un `/admin/ayuda` que sirve de **galería viva de
componentes** (cada primitiva con su variante, más el glosario de estados) y el login con la marca.
No toca las páginas de dominio (siguen importando `admin-ui.tsx`/`form.tsx` viejos hasta la Fase 2).

### Fase 2 · Dominios (5 agentes en paralelo)

| Agente | Directorios | Trabajo |
|---|---|---|
| **A · Órdenes y compradores** | `admin/pagos/**`, `admin/transferencias/**`, `admin/compradores/**`, `api/admin/ordenes/export/route.ts` | Órdenes: filtros (todas/pagadas/pendientes/por validar/canceladas), búsqueda `?q=`, conteo, tabla con fila-enlace, CSV. Ficha `/admin/pagos/[folio]`: cabecera de ficha, productos (renglón destacado), comprador en 3 columnas, columna de trabajo con "ACCIÓN PENDIENTE" (validar transferencia / marcar pagada / cancelar / reembolsar via modal), "PAGO" (método, Stripe session, comprobante SPEI presignado), `<details>` Documentos aceptados (`order_documents` + `document_templates`) y Cuestionarios (`form_tokens`/`form_responses` por `orderId`). Transferencias: modal de confirmación, enlace a la ficha. Compradores: búsqueda, ficha `/admin/compradores/[email]` (historial, documentos, formularios, total). |
| **B · Operación de retiros** | `admin/retiros/**`, `admin/locaciones/**`, `admin/proveedores/**`, `admin/inscripciones/**` | Quitar placeholders y fallbacks estáticos. Retiros: lista con filtros por status, ficha `/admin/retiros/[slug]` (patrón 9.4: cabecera, 4 cifras cupo/vendidos/estado/fecha, edición plegada), `/nuevo` como formulario guiado 01–05 con "ANTES DE CONFIRMAR", borrar con modal. Locaciones y proveedores: listas + fichas con edición y borrado con modal, filtros por estado. Inscripciones: filtros status/fuente, búsqueda, ficha `/admin/inscripciones/[id]` con mensaje completo, notas editables (`notes`), cambio de status, `mailto:`. |
| **C · Catálogo** | `admin/productos/**`, `admin/documentos/**`, `admin/formularios/**` | Productos: lista con early access visible ("$5,900 hasta 6 sep"), toggle activo inline, ficha/edición con `earlyPriceMxn`, `earlyDeadline` (datetime-local), `coverImageUrl`, validación de precio. Documentos: **rehacer sobre `document_templates`**: lista (nombre, aplica a, tipo de aceptación, requerido, versión, activo, PDF), ficha `/admin/documentos/[slug]` con edición de plantillas ES/EN (markdown con tokens `{{…}}`, mostrar tokens detectados), flags, botón "Guardar como nueva versión" (inserta en `document_versions` y sube `currentVersion`), historial de versiones en `<details>`, aceptaciones recientes (`order_documents` join `orders`). Formularios: restyle del builder (client) sobre las clases del admin, quitar `PlaceholderNote`, envío masivo en `/enviar` (textarea "un correo por línea", llama a `/api/forms/mint` en serie y muestra resultado por fila con banner, nunca toast). |
| **D · Contenido** | `admin/blog/**`, `admin/comentarios/**`, `admin/testimoniales/**`, `admin/logos/**`, `admin/suscriptores/**`, `api/admin/suscriptores/export/route.ts` | Blog: lista con filtros borrador/publicado, formulario con las primitivas, borrar con modal, "Ver pública ↗". Comentarios: join con `blog_posts` para mostrar el post, filtros, acciones aprobar/rechazar/spam (status `spam` existe), pendientes primero. Testimoniales: filtros (pendientes/publicados), **edición** `/admin/testimoniales/[id]` (RF-ADM-14), aprobar/rechazar con modal en el rechazo. Logos: lista con vista previa, borrar con modal. Suscriptores: KPIs como cifras, CSV, enlace "Abrir Mailchimp ↗". |
| **E · Resumen, cotizaciones y ajustes** | `admin/page.tsx`, `admin/empresas/**`, `admin/analytics/**`, `admin/ajustes/**`, `admin/buscar/**` | Resumen (patrón 9.1): fecha completa como subtítulo, 4 cifras (ingresos del mes con nota del año, órdenes pagadas con pendientes, leads nuevos, cotizaciones nuevas), "TU SIGUIENTE PASO" con prioridades reales (transferencias por validar, comentarios pendientes, testimoniales sin aprobar, leads sin contactar), banners (datos bancarios sin configurar, Stripe sin llaves), "ÓRDENES POR ATENDER" y "PRÓXIMOS RETIROS" (por `startDate` ≥ hoy). Cotizaciones: **corregir mapa de status** al enum real, filtros por status, ficha `/admin/empresas/[quoteNumber]` con desglose (`breakdown`), cambio de status + notas, PDF ↗; página `/admin/empresas/calculadora` que edita `calculator_config` (base MXN/USD, mínimos, multiplicadores por modalidad, tramos de personas, descuentos por volumen, vigencia) con filas dinámicas y "ANTES DE CONFIRMAR". Analytics: mismo contenido con `Campo`/`pista` y estado "activo por env". `/admin/ajustes/contacto`: editar `contact_info` + `contact_socials` (filas dinámicas) con `revalidatePath("/", "layout")`. `/admin/buscar`: resultados agrupados (órdenes, compradores, inscripciones, cotizaciones) con `ILIKE`. |

Todos los agentes de Fase 2:
- Sustituyen imports de `admin-ui.tsx` / `form.tsx` por `ui.tsx` / `client.tsx`. No borran los viejos (lo hace la Fase 3).
- Cada página: `PageHeader` (sustantivo) → filtros/etiquetas de sección → contenido. Estados vacíos con frase completa y acción.
- Cada mutación: `requireAdmin()`, validación mínima, `revalidatePath` de admin **y** público, modal para acciones irreversibles, `BotonPendiente` con texto de espera.
- Formatos con `_lib/format.ts`; estados con `_lib/status.ts`.
- Cero `zinc-*`, cero lucide, cero `rounded-lg`, cero `bg-white`.

### Fase 3 · Cierre (1 agente)

- Borrar `_components/admin-ui.tsx`, `_components/form.tsx` y cualquier import residual.
- `grep` de anti-patrones en `src/app/admin` (lista en §1.3) y corregir.
- `pnpm typecheck`, `pnpm lint`, `pnpm build`. Corregir hasta verde.
- Revisar que cada ruta de la nav exista y que ninguna ruta huérfana quede fuera.
- Actualizar `PLACEHOLDERS.md` (sección de admin) y añadir `docs/admin/README.md` con el mapa final de rutas.

---

## 3. Criterios de aceptación

1. `pnpm typecheck` y `pnpm build` en verde.
2. Ninguna página del admin muestra "placeholder", "PH", ni lee de `launchData` para listas.
3. Ningún formulario sin `action`. Ninguna acción irreversible sin modal. Ningún botón que se pueda pulsar dos veces.
4. Toda lista tiene: filtros o pestañas, línea de conteo, estado vacío con acción.
5. Toda entidad operativa (orden, comprador, inscripción, cotización, retiro, documento, testimonial) tiene ficha.
6. `grep -rE "zinc-|emerald-|amber-|blue-|red-|bg-white|rounded-(lg|xl)|shadow-|lucide-react|window\.confirm" src/app/admin` devuelve 0 líneas.
7. Login, error, no-existe y loading con la marca.
8. Fuentes: Inter (next/font) + serif del sistema dentro de `.admin`; el sitio público no cambia de tipografía ni de color.

---

## 4. Riesgos y decisiones

- **Fuentes**: el documento pide Inter + serif del sistema. Se aplica solo dentro de `.admin`; el público
  mantiene Cormorant/Jost. Inter se carga en `admin/layout.tsx` con `next/font/google` y su variable
  `--font-inter` se usa dentro de `--font-sans` del admin.
- **Sin cambios de schema**: todo lo nuevo usa columnas existentes (`inscriptions.notes`, `enterprise_quotes.status/notes`,
  `document_versions`, `contact_info`, `calculator_config`). Si un agente cree necesitar una columna, lo
  documenta en su reporte y no la crea.
- **Correos** al marcar pagada: se reutiliza `sendPaymentConfirmation` existente. No se rediseñan las plantillas
  de correo en esta iteración (sección 10 del doc de marca queda como siguiente paso).
- **`/admin/pagos` conserva la ruta** aunque el título sea "Órdenes", para no romper enlaces guardados.
- **Rutas dinámicas y `force-dynamic`**: todas las páginas del admin son dinámicas (leen DB con sesión).
