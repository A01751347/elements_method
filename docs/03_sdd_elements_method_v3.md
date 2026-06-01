# Software Design Document (SDD) · v3
## Plataforma Web Elements Method

| Campo | Valor |
|---|---|
| **Proyecto** | Plataforma web Elements Method |
| **Versión del documento** | 3.0 |
| **Fecha** | 1 de junio de 2026 |
| **Autor** | Santiago Serrano |
| **Documento padre** | SRS Elements Method v3.0 |

> **Cambios respecto a v2:** integra todas las decisiones del cuestionario de discovery del 01/06/2026. Cambios principales: arquitectura multi-idioma (next-intl), repositorio de documentos con motor de plantillas y personalización dinámica, flujo de aceptación pre-checkout, motor de formularios con tokens privados firmados, manejo explícito de IVA y descuentos por combinación, eliminación del módulo de validador QR, motor de comentarios con pre-moderación y UX fantasma, infraestructura de pixeles múltiples bajo consentimiento de cookies.

---

## 1. Resumen ejecutivo

Sistema construido como **monolito modular Next.js 15 bilingüe (ES/EN)** desplegado en Vercel, con PostgreSQL en Neon como persistencia primaria. Integra siete servicios externos (Stripe, ManyChat, MailChimp, Cal.com, Resend, Google Analytics, Vercel Blob) y soporta múltiples pixeles de tracking (GA4, Google Ads, TikTok, Meta, LinkedIn) bajo consentimiento granular de cookies.

Las decisiones de diseño priorizan: velocidad de entrega en 4 semanas, costos operativos mínimos durante el primer año, mantenibilidad por un solo desarrollador, y extensibilidad hacia fase 2 sin refactor estructural.

---

## 2. Arquitectura de alto nivel

### 2.1 Diagrama de contexto

```
                            ┌──────────────────────┐
                            │     Visitantes       │
                            │   y Compradores      │
                            │  (ES / EN selector)  │
                            └──────────┬───────────┘
                                       │ HTTPS
                                       ▼
┌──────────┐                ┌──────────────────────┐               ┌──────────┐
│  Stripe  │◀─Checkout─────┤                       ├──Webhook─────▶│ ManyChat │
│MXN/USD/  │──Webhook──────▶│                      │◀──API────────┤   Pro    │
│OXXO/SPEI │                │  Elements Method     │               └──────────┘
└──────────┘                │  (Next.js / Vercel)  │
                            │  next-intl bilingüe  │               ┌──────────┐
┌──────────┐                │                      │──Embed+API──▶│ Cal.com  │
│  Resend  │◀──Email txn───┤                       │               │  Cloud   │
│(en idioma│                │                      │               └──────────┘
│ del usr) │                │                      │
└──────────┘                │                      │               ┌──────────┐
                            │                      │──API─────────▶│MailChimp │
┌──────────┐                │                      │               │Essentials│
│  GA4 +   │◀──Tracking────┤                       │               └──────────┘
│ Google   │  (post-       │                      │
│  Ads +   │  consent)     │                      │               ┌──────────┐
│ TikTok + │                │                      │──Uploads────▶│ Vercel   │
│  Meta +  │                └──────────┬───────────┘               │  Blob    │
│LinkedIn  │                           │                           │(media+   │
└──────────┘                           │ SQL                       │ PDFs)    │
                                       ▼                           └──────────┘
                            ┌──────────────────────┐
                            │   Neon Postgres      │
                            └──────────────────────┘
                                       ▲
                                       │ Magic link auth
                          ┌──────────────────────┐
                          │   Administradores    │
                          │ (Andrés y Ana M.)    │
                          └──────────────────────┘
```

### 2.2 Cambios arquitectónicos respecto a v2

| Aspecto | v2 | v3 |
|---|---|---|
| Idioma | Solo español | Bilingüe ES/EN con next-intl, rutas prefijadas |
| Aceptación documentos | Post-pago | Pre-pago (bloquea checkout) |
| Documentos legales | 4 fijos | Repositorio CRUD ilimitado con plantillas + placeholders |
| Generación de docs | Estáticos | Dinámicos con datos del comprador (persona o empresa) |
| Formularios | Públicos por URL | Privados con tokens JWT en URL |
| Cálculo de precios | Solo subtotal | Subtotal + descuentos + IVA |
| Sistema de descuentos | Sin | Reglas por combinación de productos |
| Validador QR | Incluido | Eliminado |
| Pixeles tracking | Solo GA4 | GA4 + Google Ads + TikTok + Meta + LinkedIn |
| Comentarios blog | Sin contemplar | Pre-moderación con UX fantasma |
| Cal.com | Embed simple | Embed + API para gestión de horarios + múltiples event types |
| Videos testimoniales | YouTube embed | Self-hosted en Vercel Blob, cortos |
| Storage de PDFs legales | Estáticos | Plantillas + generación on-demand + snapshots inmutables |

---

## 3. Stack tecnológico

| Capa | Tecnología | Versión | Justificación |
|---|---|---|---|
| Framework | Next.js | 15.x | App Router, RSC, Server Actions, deploy Vercel |
| Lenguaje | TypeScript | 5.x | Tipado estricto |
| Estilos | Tailwind CSS | 4.x | Velocidad |
| Componentes | shadcn/ui | latest | Accesibles, sin lock-in |
| **i18n** | **next-intl** | **3.x** | **Soporte nativo App Router, rutas prefijadas, tipos seguros** |
| ORM | Drizzle ORM | latest | Liviano, type-safe |
| Base de datos | PostgreSQL (Neon) | 16 | Tier gratuito 0.5 GB |
| Auth | Auth.js | 5.x | Magic links |
| Pagos | Stripe Checkout | latest | MXN/USD/OXXO/SPEI |
| Email transaccional | Resend | latest | Magic links, comprobantes |
| Email marketing | MailChimp | API v3 | Newsletter, automations |
| **Templating PDF** | **@react-pdf/renderer + plantillas con vars** | **4.x** | **Generación dinámica de documentos personalizados** |
| Animaciones | Framer Motion | latest | Animaciones modernas (cuatro elementos, hover-expand de retiros) |
| Rich text | TipTap | 2.x | Editor del blog |
| Validación | Zod | 3.x | Schema sharing |
| XLSX | exceljs | 4.x | Export de respuestas |
| JWT | jose | 5.x | Firma de tokens de formulario |
| Storage | Vercel Blob | latest | Imágenes, videos cortos, PDFs |
| Citas | Cal.com Cloud | API + embed | Bidireccional |
| Conversaciones | ManyChat Pro | webhooks | Embed + sincronización |
| **Cookie consent** | **Custom** | **propio** | **Banner LFPDPPP, granular, sin proveedor externo** |
| Analytics | Google Analytics 4 | gtag.js | Bajo consentimiento |
| Tracking ads | Google Ads + Meta + TikTok + LinkedIn | scripts | Bajo consentimiento |
| Hosting | Vercel Hobby | latest | Tier gratuito al inicio |

---

## 4. Modelo de datos

### 4.1 Diagrama entidad-relación

```
products ─┬─◀─ orders ──┬─◀── order_documents
          │       │
          │       ├──◀── form_responses (vía token)
          │       │
          │       └──◀── bank_transfers

product_combinations (descuentos) ◀── orders

retreats ──────────────(FK opcional)──▶ orders
retreats ◀── retreat_testimonials

document_templates ──◀── document_snapshots
                   └─◀── order_documents

forms ──◀── form_tokens ──▶ form_responses

calculator_config (key-value)

enterprise_quotes

conversations ──(0:1)──▶ orders

subscribers (espejo MailChimp)

blog_posts (bilingüe)
   └─◀── blog_comments (con moderación)

testimonials ─(opcional FK)──▶ form_responses

client_logos

cal_event_types (mirror de Cal.com)

admin_users

translations (key-value por idioma para UI)
```

### 4.2 Esquema Drizzle (resumen de tablas críticas nuevas)

#### products
```ts
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  type: productTypeEnum('type').notNull(), // camino, elemento, retiro_inmersivo, programa_corporativo
  name_es: text('name_es').notNull(),
  name_en: text('name_en'),
  description_es: text('description_es').notNull(),
  description_en: text('description_en'),
  includes_es: text('includes_es').notNull(),
  includes_en: text('includes_en'),
  duration: text('duration'),
  modality: text('modality'),
  price_mxn: decimal('price_mxn', { precision: 10, scale: 2 }).notNull(),
  price_usd: decimal('price_usd', { precision: 10, scale: 2 }),
  stripe_price_id_mxn: text('stripe_price_id_mxn'),
  stripe_price_id_usd: text('stripe_price_id_usd'),
  element: elementEnum('element'), // null si no es elemento individual
  cover_image_url: text('cover_image_url'),
  active: boolean('active').default(true).notNull(),
  sort_order: integer('sort_order').default(0),
});
```

#### product_combinations (descuentos)
```ts
export const productCombinations = pgTable('product_combinations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(), // "4 elementos juntos"
  required_product_ids: integer('required_product_ids').array().notNull(),
  discount_type: text('discount_type').notNull(), // 'percentage' | 'fixed_amount'
  discount_value: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),
  active: boolean('active').default(true),
});
```

#### orders
```ts
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  folio: text('folio').notNull().unique(), // EM-MMAA-XXXX
  buyer_type: text('buyer_type').notNull(), // 'persona' | 'empresa'
  buyer_name: text('buyer_name').notNull(),
  buyer_email: text('buyer_email').notNull(),
  buyer_phone: text('buyer_phone'),
  buyer_company: text('buyer_company'), // solo si empresa
  buyer_rfc: text('buyer_rfc'),
  buyer_address: text('buyer_address'),
  product_ids: integer('product_ids').array().notNull(), // permite multi-producto
  retreat_id: uuid('retreat_id').references(() => retreats.id),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  discount: decimal('discount', { precision: 10, scale: 2 }).default('0').notNull(),
  iva: decimal('iva', { precision: 10, scale: 2 }).notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  currency: currencyEnum('currency').notNull(),
  language: text('language').notNull(), // 'es' | 'en'
  payment_method: paymentMethodEnum('payment_method').notNull(), // 'stripe' | 'transferencia'
  stripe_session_id: text('stripe_session_id').unique(),
  transfer_proof_url: text('transfer_proof_url'),
  transfer_validated_at: timestamp('transfer_validated_at'),
  transfer_validated_by: text('transfer_validated_by'),
  status: orderStatusEnum('status').default('pending_documents').notNull(),
  paid_at: timestamp('paid_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
```

**Estados de orden:**
- `pending_documents` — cliente debe aceptar documentos
- `pending_payment` — documentos OK, esperando pago
- `pending_transfer_validation` — pagó por transferencia, esperando validación admin
- `paid` — confirmado
- `refunded` — reembolsado
- `cancelled` — abandonado o cancelado

#### document_templates
```ts
export const documentTemplates = pgTable('document_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(), // 'contrato', 'nda', etc.
  name_es: text('name_es').notNull(),
  name_en: text('name_en'),
  template_html_es: text('template_html_es').notNull(), // con placeholders {{buyer_name}}
  template_html_en: text('template_html_en'),
  required_for_purchase: boolean('required_for_purchase').default(true),
  acceptance_type: text('acceptance_type').notNull(), // 'check_only' | 'signature_upload'
  applies_to: text('applies_to').notNull(), // 'persona' | 'empresa' | 'ambos'
  current_version: integer('current_version').default(1).notNull(),
  active: boolean('active').default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const documentVersions = pgTable('document_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  template_id: uuid('template_id').references(() => documentTemplates.id).notNull(),
  version_number: integer('version_number').notNull(),
  template_html_es: text('template_html_es').notNull(),
  template_html_en: text('template_html_en'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
```

#### order_documents (snapshot inmutable de aceptación)
```ts
export const orderDocuments = pgTable('order_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  order_id: uuid('order_id').references(() => orders.id).notNull(),
  document_template_id: uuid('document_template_id').references(() => documentTemplates.id).notNull(),
  document_version: integer('document_version').notNull(),
  generated_pdf_url: text('generated_pdf_url').notNull(), // PDF generado con datos del buyer
  generated_pdf_hash: text('generated_pdf_hash').notNull(), // SHA-256
  accepted: boolean('accepted').default(false).notNull(),
  accepted_at: timestamp('accepted_at'),
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  signed_pdf_url: text('signed_pdf_url'), // si tipo es signature_upload
  signed_pdf_hash: text('signed_pdf_hash'),
});
```

#### forms
```ts
export const forms = pgTable('forms', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title_es: text('title_es').notNull(),
  title_en: text('title_en'),
  description_es: text('description_es'),
  description_en: text('description_en'),
  fields: jsonb('fields').notNull(), // array de definiciones de campo
  category: text('category'), // 'inicio', 'durante', 'cierre', 'custom'
  is_anonymous: boolean('is_anonymous').default(false),
  active: boolean('active').default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
```

#### form_tokens
```ts
export const formTokens = pgTable('form_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  form_id: uuid('form_id').references(() => forms.id).notNull(),
  token: text('token').notNull().unique(), // JWT firmado
  recipient_email: text('recipient_email').notNull(),
  recipient_name: text('recipient_name'),
  order_id: uuid('order_id').references(() => orders.id),
  retreat_id: uuid('retreat_id').references(() => retreats.id),
  expires_at: timestamp('expires_at').notNull(),
  used_at: timestamp('used_at'),
  sent_at: timestamp('sent_at').defaultNow().notNull(),
});
```

#### blog_posts (bilingüe)
```ts
export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  title_es: text('title_es').notNull(),
  title_en: text('title_en'),
  excerpt_es: text('excerpt_es'),
  excerpt_en: text('excerpt_en'),
  content_es: jsonb('content_es').notNull(), // TipTap JSON
  content_en: jsonb('content_en'),
  cover_image_url: text('cover_image_url'),
  author: text('author'),
  meta_description_es: text('meta_description_es'),
  meta_description_en: text('meta_description_en'),
  status: text('status').default('draft').notNull(),
  published_at: timestamp('published_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
```

#### blog_comments (moderación)
```ts
export const blogComments = pgTable('blog_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  post_id: uuid('post_id').references(() => blogPosts.id).notNull(),
  author_name: text('author_name').notNull(),
  author_email: text('author_email').notNull(),
  content: text('content').notNull(),
  status: commentStatusEnum('status').default('pending').notNull(), // 'pending' | 'approved' | 'rejected' | 'spam'
  session_id: text('session_id').notNull(), // cookie/fingerprint del autor para UX fantasma
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  moderated_at: timestamp('moderated_at'),
  moderated_by: text('moderated_by'),
});
```

#### retreats
```ts
export const retreats = pgTable('retreats', {
  id: uuid('id').primaryKey().defaultRandom(),
  product_id: integer('product_id').references(() => products.id),
  name_es: text('name_es').notNull(),
  name_en: text('name_en'),
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date').notNull(),
  location: text('location'),
  modality: text('modality').notNull(),
  elements_covered: text('elements_covered').array().notNull(),
  description_es: text('description_es'),
  description_en: text('description_en'),
  image_url: text('image_url'),
  price_mxn: decimal('price_mxn', { precision: 10, scale: 2 }).notNull(),
  price_usd: decimal('price_usd', { precision: 10, scale: 2 }),
  capacity: integer('capacity').notNull(),
  low_seats_threshold: integer('low_seats_threshold').default(10), // cuando mostrar X cupos
  active: boolean('active').default(true),
});
```

#### testimonials
```ts
export const testimonials = pgTable('testimonials', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: testimonialTypeEnum('type').notNull(), // video, photo_quote, quote_only, company_logo
  author_name: text('author_name'),
  author_role: text('author_role'),
  company_name: text('company_name'),
  quote_es: text('quote_es'),
  quote_en: text('quote_en'),
  video_url: text('video_url'), // Vercel Blob
  photo_url: text('photo_url'),
  source_form_response_id: uuid('source_form_response_id').references(() => formResponses.id),
  retreat_id: uuid('retreat_id').references(() => retreats.id),
  display_locations: text('display_locations').array(), // ['homepage_hero', 'caminos_page', 'footer']
  approved_by_admin: boolean('approved_by_admin').default(false),
  published: boolean('published').default(false),
  published_at: timestamp('published_at'),
});
```

#### enterprise_quotes y calculator_config como en v2.

### 4.3 Tablas auxiliares

- `subscribers` (espejo MailChimp) sin cambios respecto a v2.
- `conversations` (espejo ManyChat) sin cambios.
- `document_downloads` (descargas independientes auditadas) sin cambios.
- `admin_users` sin cambios.
- `cal_event_types` nueva, espejo de tipos de cita configurados en Cal.com.
- `client_logos` con campo `usage_authorization_url` (PDF de permiso explícito).
- `translations` opcional para cadenas de UI que no quepan en archivos JSON estáticos.

### 4.4 Índices clave

| Tabla | Índice | Razón |
|---|---|---|
| `orders` | `(buyer_email)` | Búsqueda y vinculación |
| `orders` | `(folio)` unique | Lookup desde URL pública |
| `orders` | `(status, payment_method)` | Filtrar transferencias pendientes |
| `retreats` | `(start_date, active)` | Listado de próximos retiros |
| `form_tokens` | `(token)` unique | Validación de acceso |
| `form_tokens` | `(recipient_email, form_id)` | Evitar duplicados |
| `order_documents` | `(order_id)` | Ver qué firmó un comprador |
| `blog_comments` | `(post_id, status)` | Listado por artículo y cola de moderación |
| `blog_comments` | `(session_id)` | UX fantasma de comentarios propios |
| `testimonials` | `(published, display_locations)` | Vista pública |

---

## 5. Diseño de componentes

### 5.1 Estructura modular

```
src/
├── i18n/
│   ├── config.ts              # locales soportados
│   ├── messages/
│   │   ├── es.json            # textos UI español
│   │   └── en.json            # textos UI inglés
│   └── routing.ts             # navegación bilingüe
│
├── modules/
│   ├── products/              # caminos, elementos, programa corporativo, descuentos
│   ├── retreats/              # calendario de retiros con estados
│   ├── checkout/              # flujo: docs → pago → comprobante
│   ├── documents/             # templates, generación, aceptación, snapshots
│   ├── forms/                 # builder + tokens + renderer + export
│   ├── enterprise/            # calculadora + cotización
│   ├── testimonials/          # CRUD + revisión desde forms
│   ├── conversations/         # ManyChat webhook
│   ├── newsletter/            # MailChimp integration
│   ├── blog/                  # CMS bilingüe + comentarios moderados
│   ├── calendar/              # Cal.com integration + admin de horarios
│   ├── analytics/             # GA4 + pixeles + consent banner
│   ├── auth/                  # magic links
│   └── admin/                 # panel general
└── shared/                    # UI, utils, db, infra, pricing engine
```

### 5.2 Pricing engine (nuevo en v3)

Lógica central de cálculo de precios, descuentos, IVA. Usada en: vista pública de productos, checkout, calculadora de empresas, generación de PDFs.

```ts
// src/shared/pricing/calculate.ts

interface PriceCalculation {
  subtotal: number;
  discount: { amount: number; rule: string | null };
  iva: number;
  total: number;
  currency: 'MXN' | 'USD';
  breakdown: LineItem[];
}

function calculateOrderTotal(
  productIds: number[],
  currency: 'MXN' | 'USD',
  promoCode?: string
): PriceCalculation {
  // 1. Cargar productos
  // 2. Sumar subtotales
  // 3. Buscar combinaciones aplicables (product_combinations)
  // 4. Aplicar mejor descuento posible
  // 5. Calcular IVA (16%) sobre (subtotal - descuento)
  // 6. Retornar desglose
}
```

### 5.3 Flujo de compra completo

```
[1] Usuario en página de producto / retiro
       │
       ▼
[2] Click "Comprar"
       │
       ▼
[3] /checkout/[orderId]/datos
    Captura datos del comprador:
    - Persona vs Empresa (toggle)
    - Si empresa: razón social, RFC, dirección
    - Idioma de los documentos (auto-detecta del navegador)
       │
       ▼
[4] /checkout/[orderId]/documentos
    Sistema carga documents donde required_for_purchase=true 
    y applies_to coincide con buyer_type
       │
       ▼
    Para cada documento:
       - Genera PDF on-the-fly con plantilla + datos del buyer
       - Sube a Vercel Blob
       - Calcula hash SHA-256
       - Inserta en order_documents (accepted=false)
       - Renderiza preview/descarga
       - Renderiza checkbox o upload según acceptance_type
       │
       ▼
    Cliente revisa, firma si aplica, marca check
       │
       ▼
    UPDATE order_documents SET accepted=true, accepted_at=now(), ip, ua
       │
       ▼
    Cuando todos los required están accepted:
       Habilita botón "Continuar al pago"
       │
       ▼
[5] /checkout/[orderId]/pago
    Muestra resumen: subtotal, descuentos, IVA, total
    Dos botones:
       ├── "Pagar con tarjeta/OXXO/SPEI" → Stripe Checkout
       │       │
       │       ▼
       │   Stripe Hosted Checkout
       │       │
       │       ▼
       │   Webhook checkout.session.completed
       │       │
       │       ▼
       │   status=paid, genera comprobante, emails
       │
       └── "Pagar por transferencia"
              │
              ▼
           Muestra datos bancarios completos
           Cliente realiza transferencia externamente
              │
              ▼
           Sube comprobante (PDF/JPG/PNG)
              │
              ▼
           status=pending_transfer_validation
              │
              ▼
           Admin recibe notificación
              │
              ▼
           Admin valida en panel
              │
              ▼
           status=paid, genera comprobante, emails
```

### 5.4 Motor de formularios con tokens privados

```
Admin en /admin/formularios/[id]/enviar
       │
       ▼
Selecciona destinatarios:
   - Por retiro (todos los compradores)
   - Lista manual (CSV de emails)
   - Individual
       │
       ▼
Sistema genera form_tokens (JWT firmados):
   - Payload: { formId, recipientEmail, exp, jti }
   - Firma con FORM_SIGNING_SECRET
   - INSERT en form_tokens
       │
       ▼
Para cada destinatario:
   - Envía email vía Resend con link único
   - Link: https://elementsmethod.com/es/formulario/[JWT]
       │
       ▼
Destinatario abre link
       │
       ▼
Sistema valida JWT (firma + expiración)
       │
       ├── Inválido → 404
       ├── Ya usado → mensaje "ya respondiste"
       └── Válido → renderiza formulario
              │
              ▼
           Submit
              │
              ▼
           INSERT form_response
           UPDATE form_token SET used_at=now()
```

### 5.5 Motor de comentarios con UX fantasma

```
Visitante lee /blog/[slug] (sesión con cookie único)
       │
       ▼
Escribe comentario
       │
       ▼
POST /api/blog/[postId]/comments
   Body: { name, email, content }
   Cookie: session_id
       │
       ▼
INSERT blog_comment con:
   - session_id (de cookie)
   - status='pending'
       │
       ▼
Admin recibe notificación opcional
       │
       ▼
GET /blog/[slug]/comments para mostrar comentarios:
   SELECT * FROM blog_comments
   WHERE post_id = ?
     AND (status='approved' OR session_id=?)
   ORDER BY created_at
       │
       ▼
El autor ve su comentario (matchea session_id)
Los demás solo ven los aprobados
       │
       ▼
Admin en /admin/comentarios:
   Cola de pending
   Botones: Aprobar / Rechazar / Spam
```

### 5.6 Generación dinámica de PDFs legales

```ts
// src/modules/documents/generate.ts

interface PdfGenerationContext {
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string;
  company_name?: string;
  rfc?: string;
  address?: string;
  order_folio: string;
  order_date: string;
  product_names: string[];
  total_amount: string;
  currency: string;
  language: 'es' | 'en';
}

async function generateDocumentPdf(
  template: DocumentTemplate,
  context: PdfGenerationContext
): Promise<{ url: string; hash: string }> {
  const htmlContent = template.language === 'es' 
    ? template.template_html_es 
    : template.template_html_en;
  
  const filledHtml = renderTemplate(htmlContent, context);
  const pdfBuffer = await renderToPdf(filledHtml);
  const hash = sha256(pdfBuffer);
  const url = await uploadToVercelBlob(pdfBuffer, `documents/${context.order_folio}/${template.slug}.pdf`);
  
  return { url, hash };
}
```

---

## 6. Arquitectura i18n

### 6.1 Estructura de rutas

```
/                              → redirect a /es o /en según preferencia
/es                            → home español
/es/quienes-somos
/es/los-caminos
/es/el-metodo
/es/empresas
/es/empresas/cotizar
/es/retiros
/es/retiros-pasados
/es/blog
/es/blog/[slug]
/es/comprobante/[folio]
/es/formulario/[token]
/es/checkout/[orderId]/datos
/es/checkout/[orderId]/documentos
/es/checkout/[orderId]/pago
/es/gracias
/es/privacidad

/en                            → mismas rutas equivalentes en inglés
/en/who-we-are
/en/paths
/en/method
/en/companies
...

/admin                         → solo en español, no requiere traducción
/admin/*
```

### 6.2 Carga de mensajes

```ts
// src/i18n/config.ts
export const locales = ['es', 'en'] as const;
export const defaultLocale = 'es';

// src/i18n/messages/es.json (extracto)
{
  "nav": {
    "home": "Inicio",
    "about": "Quiénes Somos",
    "paths": "Los Caminos",
    "method": "El Método",
    "companies": "Empresas",
    "blog": "Blog"
  },
  "buttons": {
    "buy": "Comprar",
    "learn_more": "Conocer más",
    "request_quote": "Solicitar cotización"
  },
  "checkout": {
    "documents_required": "Debes aceptar los siguientes documentos antes de continuar",
    "subtotal": "Subtotal",
    "discount": "Descuento",
    "iva": "IVA (16%)",
    "total": "Total"
  }
  // ...
}
```

### 6.3 Detección y persistencia de idioma

1. **Primera visita:** detectar `Accept-Language` del navegador. Redirigir al idioma adecuado.
2. **Después:** preferencia en cookie `NEXT_LOCALE` (12 meses).
3. **Selector:** cambia cookie + redirige a equivalente del idioma destino.

### 6.4 Contenido dinámico

- Productos, retiros, blog, testimoniales: columnas separadas por idioma (`name_es`, `name_en`).
- Documentos legales: plantillas separadas por idioma.
- Emails transaccionales: plantillas separadas por idioma.

---

## 7. Interfaces

### 7.1 Endpoints internos (nuevos en v3)

| Endpoint | Método | Propósito |
|---|---|---|
| `/api/i18n/switch` | POST | Cambia cookie de idioma |
| `/api/checkout/[orderId]/documents/generate` | POST | Genera PDFs personalizados pre-checkout |
| `/api/checkout/[orderId]/documents/accept` | POST | Registra aceptación |
| `/api/checkout/[orderId]/documents/upload-signed` | POST | Sube firmado |
| `/api/pricing/calculate` | POST | Calcula desglose con descuentos + IVA |
| `/api/transfers/upload-proof` | POST | Comprobante de transferencia |
| `/api/admin/transfers/[id]/validate` | POST | Admin valida transferencia |
| `/api/admin/document-templates` | CRUD | Repositorio de plantillas |
| `/api/admin/discounts` | CRUD | Combinaciones de productos |
| `/api/admin/form-tokens/generate` | POST | Generación masiva de tokens |
| `/api/forms/[token]/submit` | POST | Submit con validación de token |
| `/api/admin/cal/event-types` | CRUD | Tipos de cita en Cal.com |
| `/api/admin/cal/availability` | PUT | Actualizar horarios disponibles |
| `/api/blog/[postId]/comments` | GET/POST | Listar/crear comentario |
| `/api/admin/comments/[id]/moderate` | POST | Aprobar/rechazar/spam |
| `/api/admin/testimonials/from-response/[id]` | POST | Promocionar respuesta a testimonial |
| `/api/cookies/consent` | POST | Guardar preferencia de cookies |

### 7.2 Webhooks externos

- **Stripe:** `/api/webhooks/stripe`
- **ManyChat:** `/api/webhooks/manychat`
- **MailChimp:** `/api/webhooks/mailchimp` (unsubscribes)
- **Cal.com:** `/api/webhooks/cal` (booking created/cancelled)

---

## 8. Seguridad

### 8.1 Cambios y refuerzos respecto a v2

**Tokens de formulario:**
- JWT firmados con HS256 y `FORM_SIGNING_SECRET`
- Payload: `{ formId, recipientEmail, jti, exp }`
- Verificación antes de cualquier lookup
- Single-use: `used_at` en BD invalida tokens

**Upload de comprobantes y firmados:**
- Validación de magic bytes (no solo extensión)
- Límite 5 MB
- Antivirus en Vercel Blob (built-in)

**Generación dinámica de PDFs:**
- Plantillas validadas para evitar inyección (escape de placeholders)
- Sin ejecución de scripts en plantillas HTML

**Comentarios del blog:**
- Rate limiting (1 comentario por sesión cada 30 segundos)
- Validación de email
- Honeypot anti-bots
- Detección básica de spam (links múltiples, palabras clave)

**Pixeles bajo consentimiento:**
- Sin cookie de consent: pixeles no se cargan
- Categorías granulares: analytics vs marketing
- Re-prompt anual

**Cal.com API:**
- API key en variable de entorno server-only
- Sincronización idempotente

---

## 9. Performance

### 9.1 Estrategias

| Aspecto | Estrategia |
|---|---|
| **i18n** | Carga incremental: solo mensajes de la página actual |
| **Pixeles** | Carga diferida solo tras consentimiento |
| **Videos testimoniales** | Lazy load, póster estático, autoplay sin audio |
| **Imágenes** | `next/image` con AVIF/WebP automático |
| **Cálculo de precios** | Memoizado por combinación de productos |
| **PDFs de documentos** | Cacheados 24h en Vercel Blob por (template_version + buyer_hash) |
| **Listado de retiros** | `revalidate: 60` |
| **DB queries** | Connection pooling de Neon, índices apropiados |

### 9.2 Umbrales de upgrade

| Servicio | Tier free hasta | Siguiente plan |
|---|---|---|
| Vercel Hobby | 100 GB transferencia/mes | Pro $20/mes |
| Neon Free | 0.5 GB DB | Launch $19/mes |
| Resend Free | 3,000 emails/mes | Pro $20/mes |
| Vercel Blob | 1 GB storage | Cobro por GB |
| MailChimp Essentials | 500 contactos | Standard $20/mes |
| Cal.com | Free 1 user | Pro $15/mes/user |

---

## 10. Preparación para Fase 2

La arquitectura v3 deja explícitamente preparados los siguientes hooks para fase 2:

| Feature fase 2 | Hook arquitectónico en v1 |
|---|---|
| **Cuentas de usuario** | `orders.buyer_email` indexado; al crear cuentas, se vinculan automáticamente compras pasadas por email |
| **Área de miembros** | Carpeta `src/app/(members)/` reservada; middleware preparado para múltiples roles |
| **Tracking de progreso** | Tabla `orders` con `product_ids` permite reconstruir qué elementos tomó cada email |
| **Conocer participantes** | Tabla `retreats` ya vinculada a `orders`; agregar `participant_visibility` boolean por orden (opt-in) |
| **Suscripción recurrente** | Stripe soporta nativo; agregar `products.recurrence` field y webhook handler de subscriptions |
| **Comunidad** | Idealmente externa (Circle, Discord); botón "Unirse" como CTA, sin construir foro propio |
| **Programa de lealtad** | Tabla `loyalty_points` con triggers por evento; UI opcional |
| **Firma electrónica NOM-151** | Módulo `documents` ya soporta `signature_upload`; cambiar a integración con DocuSign/Mifiel |
| **Cursos en video integrados** | Vercel Blob/Vimeo + tabla `member_resources` con FK a orders |

---

## 11. Decisiones de diseño (actualización v3)

### 11.1 next-intl en lugar de next-i18next o react-intl

next-intl tiene soporte nativo de App Router de Next 15, mientras next-i18next sigue principalmente alineado a Pages Router. react-intl es más bajo nivel y requiere más infraestructura propia.

### 11.2 Documentos como plantillas con placeholders

Las plantillas viven como HTML con `{{placeholders}}`, no como PDFs estáticos. Esto permite:
- Personalización por persona/empresa con un solo motor
- Versionado limpio (cambiar texto sin re-subir PDF)
- Generación dinámica solo cuando se necesita

### 11.3 Tokens JWT firmados para formularios privados

En lugar de UUIDs en URL con lookup en BD, JWT permite verificar validez antes de tocar la BD. Single-use vía `used_at`.

### 11.4 IVA como columna explícita en orders

Aunque podríamos calcularlo siempre on-the-fly, almacenarlo evita drift si el porcentaje cambia y simplifica reportes financieros.

### 11.5 Descuentos por combinación como reglas declarativas

`product_combinations` permite al admin crear reglas como "comprar A+B+C+D = 15% off" sin tocar código.

### 11.6 Comentarios con session_id para UX fantasma

El "trick" de mostrar al autor su comentario como publicado mientras está pendiente requiere identificar al autor sin obligar autenticación. Cookie + session_id en BD lo logra de manera simple.

### 11.7 Self-hosting de videos testimoniales

Vercel Blob como storage. Videos cortos (~30-60s) comprimidos. Aceptable hasta ~100 videos en tier gratuito. Alternativa futura: migrar a Mux o Cloudflare Stream cuando crezca.

### 11.8 Cookie consent custom en lugar de Cookiebot/Iubenda

Para reducir costos recurrentes y mantener control total del look. LFPDPPP no requiere proveedor certificado.

### 11.9 Eliminación del módulo QR

El cliente confirmó que no necesita validación de acceso por QR. Los socios pueden verificar asistentes con lista impresa o consultando el panel admin desde el celular. Esto reduce complejidad y elimina el módulo `tickets` por completo.

### 11.10 Múltiples tipos de cita en Cal.com (no uno genérico)

El cliente quiere diferenciar entre "sesión informativa empresas", "llamada de exploración individual", "diagnóstico". Cal.com soporta esto nativamente.

---

## 12. Variables de entorno (actualización v3)

```bash
# App
NEXT_PUBLIC_APP_URL=https://elementsmethod.com
NODE_ENV=production
NEXT_PUBLIC_DEFAULT_LOCALE=es

# Database (Neon)
DATABASE_URL=

# Auth.js
AUTH_SECRET=
AUTH_RESEND_KEY=
AUTH_EMAIL_FROM=hola@elementsmethod.com

# Resend (transaccional)
RESEND_API_KEY=
RESEND_FROM_TRANSACTIONAL=hola@elementsmethod.com

# MailChimp (marketing)
MAILCHIMP_API_KEY=
MAILCHIMP_SERVER_PREFIX=us21
MAILCHIMP_LIST_ID=
MAILCHIMP_WEBHOOK_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Form tokens
FORM_SIGNING_SECRET=

# ManyChat
MANYCHAT_API_KEY=
MANYCHAT_WEBHOOK_SECRET=

# Cal.com
CAL_API_KEY=
CAL_WEBHOOK_SECRET=
NEXT_PUBLIC_CAL_USERNAME=elementsmethod

# Vercel Blob
BLOB_READ_WRITE_TOKEN=

# Datos bancarios (mostrados al cliente)
BANK_NAME=
BANK_CLABE=
BANK_BENEFICIARY=
BANK_ACCOUNT_NUMBER=

# Pixeles tracking
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_GOOGLE_ADS_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=

# Admin
ADMIN_EMAILS=

# Configuración de IVA
IVA_RATE=0.16
```

---

## 13. Apéndices

### A. Mapeo SRS → SDD

| Requerimiento SRS | Módulo SDD |
|---|---|
| RF-I18N-* | `src/i18n/`, todos los componentes UI bilingües |
| RF-PUB-* | `modules/products`, `modules/retreats`, `modules/testimonials` |
| RF-RTR-* | `modules/retreats` |
| RF-PRD-* | `modules/products`, `shared/pricing` |
| RF-CMP-* | `modules/checkout`, `shared/pricing` |
| RF-DOC-* | `modules/documents` |
| RF-FRM-* | `modules/forms` |
| RF-EMP-* | `modules/enterprise` |
| RF-ADM-* | `modules/admin` |
| RF-CHT-* | `modules/conversations` |
| RF-CAL-* | `modules/calendar` |
| RF-NWS-* | `modules/newsletter` |
| RF-BLG-* | `modules/blog` |
| RF-ANL-* | `modules/analytics` |

### B. Decisiones técnicas pendientes de confirmar

Lo que requiere respuesta del cliente para cerrar el diseño:

- **P-01:** dónde van las reservas de Cal.com (afecta cómo se sincroniza)
- **P-02:** fórmula exacta de calculadora (afecta `pricing/calculate.ts`)
- **P-04:** documentos legales con placeholders documentados (afecta plantillas)
- **P-13:** estrategia de traducción al inglés (afecta volumen de trabajo del cliente)

---

**Fin del documento.**
