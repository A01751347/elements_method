# PLACEHOLDERS — datos no reales del sitio Elements Method

> **Snapshot generado el 2026-06-23 para el lanzamiento de 7 días.**
> Lista de cada campo del sitio cuyo valor es placeholder / no confirmado.
> **TODO lo que aparezca aquí debe reemplazarse antes del retiro inaugural (1 oct 2026)** o explícitamente confirmarse como definitivo.

## Totales

| Categoría | Placeholders | Ubicación admin | Surface público |
|---|---:|---|---|
| Calendario de retiros | **43** | `/admin/retiros` | `/retiros` + `/retiros/[slug]` |
| Proveedores | **32** | `/admin/proveedores` | `/retiros` (sección proveedores) |
| Locaciones | **28** | `/admin/locaciones` | (interno) |
| Documentos legales | **58** (tokens `{{...}}`) | `/admin/documentos` | `/legal/[slug]` |
| Membresías | **6** | `/admin/membresias` | `/membresia` |
| Contacto | **6** | (manual: `launchData.ts`) | footer, FinalCta, retiro detail |
| **TOTAL** | **173** | | |

---

## 1. Calendario de retiros (9 retiros)

**Archivo de origen**: [src/data/launchData.ts](src/data/launchData.ts) → `calendarRetreats`
**Tabla DB**: `retreats` (seed via `seeds/operations.ts → calendarRetreatSeeds`)
**Admin**: [/admin/retiros](src/app/admin/retiros/page.tsx)

Por retiro, los campos placeholder son: `venue`, `seatsLeft`, `investment`. Específicamente:

| # | Slug | Fechas (asumidas) | Sede | Cupo disp. | Inversión |
|---:|---|---|---|---:|---|
| 1 | `octubre-2026` | 2026-10-01 → 2026-10-03 | **Por confirmar** (tentativa, cotizaciones abiertas) | 8 (estimado) | TBD |
| 2 | `noviembre-2026` | 2026-11-12 → 2026-11-14 | Por confirmar | 12 (estimado) | TBD |
| 3 | `diciembre-2026` | 2026-12-10 → 2026-12-12 | Por confirmar | 14 (estimado) | TBD |
| 4 | `enero-2027` | 2027-01-28 → 2027-01-30 | Por confirmar | 15 (estimado) | TBD |
| 5 | `febrero-2027` | 2027-02-18 → 2027-02-20 | Por confirmar | 15 (estimado) | TBD |
| 6 | `marzo-2027` | 2027-03-18 → 2027-03-20 | Por confirmar | 15 (estimado) | TBD |
| 7 | `junio-2027` | 2027-06-17 → 2027-06-19 | Por confirmar | 15 (estimado) | TBD |
| 8 | `julio-2027` | 2027-07-15 → 2027-07-17 | Por confirmar | 15 (estimado) | TBD |
| 9 | `octubre-2027` | 2027-10-07 → 2027-10-09 | Por confirmar | 15 (estimado) | TBD |

**Notas**:
- Las **fechas exactas** (jueves-sábado) son **plausibles pero no confirmadas** — los meses sí son verbatim del work plan; los días específicos son una elección de "fin de semana ideal" del workflow.
- El **mapeo elemento↔retiro** es una sugerencia narrativa (Oct → Tierra, Ene → Fuego, Mar → Agua en el mar, etc.) — debe validarse con la fundadora.
- Los temas en ES son verbatim del work plan; las traducciones EN son interpretación natural.

---

## 2. Proveedores (16 disciplinas)

**Archivo**: `launchData.ts → providersInventory` · **Tabla**: `providers` · **Admin**: `/admin/proveedores`

Todos los proveedores tienen `providerName: "Proveedor por confirmar"` y `providerContact: "Pendiente"`. Status real:

| Disciplina | Elemento | Status | Notas |
|---|---|---|---|
| Caballos | Tierra | **in-contact** | Mencionado prominente en work plan |
| Cuencos Tibetanos | Aire | researching | |
| Breathwork | Aire | researching | |
| Baños de Gong | Aire | researching | |
| Yoga | Tierra | researching | |
| Caminar en Fuego | Fuego | researching | |
| Chamán y Temazcal | Fuego | **pending** | |
| DMR | Éter | researching | |
| Paddle Yoga | Agua | researching | |
| Audífonos Terapia Sonora | Aire | researching | |
| HeartMath | Agua | researching | Validar acceso a certificación |
| Forest Bathing | Tierra | researching | |
| Meditaciones | Éter | researching | |
| Quiropráctico | Tierra | researching | |
| Terapias Luz Infrarroja | Fuego | researching | |
| Reconexión Energética | Éter | researching | |

**Descripciones ES/EN**: redactadas por el workflow basándose en el elemento + nombre de la disciplina. No están pre-aprobadas por la fundadora.

---

## 3. Locaciones (13 sedes)

**Archivo**: `launchData.ts → venuesInventory` · **Tabla**: `venues` · **Admin**: `/admin/locaciones`

Datos provienen del archivo `Locaciones_.xlsx` del work plan. Status real:

| # | Sede | Ciudad | Estado | Notas |
|---:|---|---|---|---|
| 1 | Bosque Geométrico (Aurora) | Tepoztlán | researching | cabaña 2 pers · $1,800-$4,800 |
| 2 | Soulspring | Cuernavaca | researching | Jesús Hernández |
| 3 | Casa Suna | Los Cabos | researching | Air b&b |
| 4 | Casa Juana | Tepoztlán | researching | 12 camas · $30,000/noche |
| 5 | Casa Etérea | San Miguel | researching | $15,000 / 2 noches min |
| 6 | Villa Alpina | TBD | researching | @_villalpina_ |
| 7 | Estación San Miguel Chapultepec | CDMX | **cotizacion-en-proceso** | 40-100 personas |
| 8 | Espacio Florecer | Desierto Leones | **sin-respuesta** | |
| 9 | Krasiba | TBD | researching | Bosque + caballos, sin hospedaje |
| 10 | El Santuario | Valle de Bravo | **cotizacion-en-proceso** | Ariana Ramírez |
| 11 | KHUNGI | Valle de Bravo | **available-2027** | 19 cabañas · $2,750-$4,250 pp |
| 12 | Aldea Pachamama | Popocatépetl | researching | |
| 13 | Hacienda San Gabriel | Cuernavaca | researching | haciendasangabriel.com |

**Crítico**: Para el retiro inaugural (Oct 1-3, 2026) ninguna sede está **confirmed**. Las dos cotizaciones abiertas son **El Santuario** y **Estación San Miguel Chapultepec**.

---

## 4. Documentos legales (3 docs, 58 tokens)

**Archivo**: `launchData.ts → legalDocs` · **Tabla**: `document_templates` (existente) · **Admin**: `/admin/documentos`

Los 3 documentos son **borradores generados por el workflow** y deben pasar revisión legal antes de uso. Cada uno empieza con un callout de advertencia visible en la página pública.

### Contrato de Participación (`/legal/contrato`)
Tokens `{{...}}`:
`{{PARTICIPANTE_NOMBRE}}`, `{{PARTICIPANTE_RFC}}`, `{{PARTICIPANTE_DIRECCION}}`, `{{PARTICIPANTE_EMAIL}}`, `{{PARTICIPANTE_TELEFONO}}`, `{{FECHA_RETIRO}}`, `{{NOMBRE_RETIRO}}`, `{{VENUE}}`, `{{INVERSION_MXN}}`, `{{FORMA_DE_PAGO}}`, `{{FECHA_LIMITE_PAGO}}`, `{{POLITICA_CANCELACION}}`, `{{COORDINADOR_ELEMENTS}}`, `{{COORDINADOR_TELEFONO}}`, `{{LEY_APLICABLE}}`, `{{JURISDICCION}}`, `{{FECHA_FIRMA}}`, `{{LUGAR_FIRMA}}`, `{{REPRESENTANTE_NOMBRE}}`, `{{REPRESENTANTE_CARGO}}`, `{{REPRESENTANTE_RFC}}`, `{{EMPRESA_RAZON_SOCIAL}}`, `{{EMPRESA_DIRECCION_FISCAL}}`, `{{NUM_CONTRATO}}`, `{{VERSION_CONTRATO}}`.

### NDA (`/legal/nda`)
Tokens: 15 placeholders (partes, fecha, jurisdicción, duración del NDA).

### Relevo de Responsabilidades (`/legal/relevo`)
Tokens: 18 placeholders (incluyen actividades específicas, póliza de seguro, contacto de emergencia).

---

## 5. Membresías de continuidad (3 tiers)

**Archivo**: `launchData.ts → subscriptionTiers` · **Tabla**: `subscription_tiers` · **Admin**: `/admin/membresias` · **Surface**: `/membresia`

Los 3 tiers son una propuesta del workflow basada en el hint "Programas de continuidad / Modalidad de suscripción / Proceso de inscripción" del work plan. Los nombres (Campo / Núcleo / Círculo) y la estructura **deben validarse con la fundadora**.

| Tier | Cadencia (placeholder) | Precio MXN (placeholder) | Precio USD (placeholder) |
|---|---|---|---|
| Campo | Mensual | `$X,XXX MXN/mes` | `$XXX USD/month` |
| Núcleo | Mensual + 1 retiro/año | `$X,XXX MXN/mes` | `$XXX USD/month` |
| Círculo | Anual premium | `$X,XXX MXN/mes` | `$XXX USD/month` |

---

## 6. Contacto (6 campos)

**Archivo**: `launchData.ts → contactInfo` · **Surface**: footer, FinalCta, retreat detail CTA

| Campo | Valor placeholder |
|---|---|
| `phoneDisplayMx` | `+52 55 0000 0000` |
| `phoneE164` | `+525500000000` |
| `whatsappLink` | `https://wa.me/525500000000?...` |
| `addressLabelEs/En` | `Ciudad de México · México` |
| `socialHandles[].url` | Handles `@elementsmethod` con URLs no verificadas |

---

## 7. Otros placeholders fuera del workflow

- **Hero images**: las páginas usan imágenes locales bajo `/public/images/heroes/*` cuando existen. Las páginas que aún cargan de Unsplash:
  - `/quienes-somos` → `photo-1518173946687-a4c8892bbd9f`
  - `/empresas` → `photo-1573164574572-cb89e39749b4`
  - `/el-metodo` hero → `photo-1465056836041-7f43ac27dcb5`
  - Element backgrounds en `content.ts → elementImages`
- **Bio de Ana Michelle Concepción**: el texto narrativo es real (extraído del doc maestro); la **fotografía** es un placeholder decorativo SVG.
- **Inscripciones**: La tabla `inscriptions` existe vacía; los formularios públicos aún no la pueblan (server action pendiente).
- **Logo de marca**: el SVG `LogoMark` es decorativo (compass de 4 arcos cardinal + punto dorado central). El logo oficial pendiente del diseñador.
- **Newsletter subscription**: el form en el footer es decorativo — no envía a Mailchimp/Resend todavía.
- **Cal.com event types**: `discoveryIndividual` y otros referencian un workspace de Cal.com no aprovisionado.

---

## Cómo seguir el avance

1. **Vista al día**: `/admin` dashboard muestra los KPIs en vivo: retiros abiertos, locaciones pendientes, proveedores pendientes, total de placeholders.
2. **Por entidad**: cada página de detalle (`/admin/retiros/[slug]`, etc.) lista los `placeholderFields` específicos de esa entidad y permite ediarlos (los handlers de form están listos para conectarse a server actions).
3. **Eliminación de placeholders**:
   - Cuando reemplaces un valor placeholder, **elimina el field** del array `placeholderFields` en `launchData.ts`.
   - Re-corre `pnpm db:seed` para sincronizar la DB.
   - El badge "PH" en las tablas admin desaparece automáticamente cuando el array queda vacío.

---

## Riesgos críticos antes de Oct 1, 2026

| Riesgo | Mitigación |
|---|---|
| Sede del retiro inaugural sin confirmar | Decisión binaria entre El Santuario VdB y Estación San Miguel Chapultepec — ambas con cotización abierta |
| Documentos legales en borrador | Necesitan abogad@ corporativ@ mexican@ que firme la versión final antes de que primer participante aplique |
| Stock de proveedores 15/16 sin contrato | Caballos y Chamán/Temazcal son los más urgentes (mencionados explícitamente en el work plan) |
| Teléfono y WhatsApp falsos en producción | Reemplazar por línea operativa antes de activar campañas pagadas en `/retiros/octubre-2026` |
| Precios de retiros + membresías sin definir | Bloquea conversión del flujo Apply → Discovery → Pago |

---

## 8. Integraciones cableadas (sesión Jun 23)

Todas las integraciones siguen el patrón **fail-soft**: si la env var está vacía, el código loguea un dry-run en stdout en vez de romper. Esto permite probar UI completa sin credenciales reales.

| # | Integración | Endpoint | UI | Estado |
|---|---|---|---|---|
| 1 | Inscripciones (Apply + Contact) | `POST /api/inscriptions` | `/aplicar?retreat=`, `/contacto` | ✅ **Wired** — DB insert + Resend ops + auto-reply |
| 2 | Newsletter | `POST /api/newsletter` | Footer + form embeds | ✅ **Wired** — DB upsert + Mailchimp idempotente |
| 3 | Stripe Checkout | `POST /api/checkout` | `<CheckoutButton/>` en retiro detail | ✅ **Wired** — sesión + orden draft + dry-run sin SK |
| 4 | Stripe Webhook | `POST /api/stripe/webhook` | — | ✅ **Wired** — `checkout.session.completed` + email confirmación |
| 5 | Bank transfer (SPEI) | `POST /api/transferencias` | `/transferencia` con BankRow + upload | ✅ **Wired** — usa `BANK_*` env, persiste comprobante |
| 6 | Cookie consent | `POST /api/consent` | `<CookieBanner/>` con 3 categorías | ✅ **Wired** — DB persist + pixel loader GA/Google Ads/LinkedIn |
| 7 | Document signing | `POST /api/sign` | `/firmar/[token]` con renderer + signature | ✅ **Wired** — JWT con `FORM_SIGNING_SECRET` + IP/UA |
| 8 | Cal.com embed | — | `<CalEmbed eventType="…"/>` | ✅ **Wired** — script lazy + fallback a URL pública |
| 9 | Auth.js + Resend magic link | `/api/auth/[...nextauth]` | `/admin/signin` | ✅ **Pre-existía** — desbloquea con env real |

**Lo que SÍ requiere acción humana antes de Oct 1:**

| Acción | Por qué |
|---|---|
| Crear los 3 productos en Stripe (Roots, Current, Source) y capturar los Price IDs en `products.stripePriceIdMxn` | Sin esto el checkout cobra montos calculados, no usa el catálogo Stripe |
| Configurar el webhook endpoint en Stripe Dashboard apuntando a `https://elementsmethod.com/api/stripe/webhook` | Sin esto los pagos completados no marcan la orden como `paid` |
| Crear los event types en Cal.com workspace `elementsmethod` con slugs `exploracion-individual`, `empresas`, `diagnostico` | Sin esto `<CalEmbed>` cae al fallback de link externo |
| Crear lista en Mailchimp y poner `MAILCHIMP_LIST_ID` real | Sin esto el newsletter sólo persiste en DB local, no llega a Mailchimp |
| Provisionar Vercel Blob token y reemplazar el `placeholder.blob` URL en `TransferProofForm.tsx` | Sin esto los comprobantes de transferencia no se suben de verdad |
| Generar `FORM_SIGNING_SECRET` con `openssl rand -base64 32` | Sin esto los tokens de firma usan `"dev-secret-replace-me"` (inválidos en prod) |
| Validar admin emails reales en `ADMIN_EMAILS` (separados por coma) | Sin esto nadie puede entrar al admin |

## Riesgos críticos antes de Oct 1, 2026

| Riesgo | Mitigación |
|---|---|
| Sede del retiro inaugural sin confirmar | Decisión binaria entre El Santuario VdB y Estación San Miguel Chapultepec — ambas con cotización abierta |
| Documentos legales en borrador | Necesitan abogad@ corporativ@ mexican@ que firme la versión final antes de que primer participante aplique |
| Stock de proveedores 15/16 sin contrato | Caballos y Chamán/Temazcal son los más urgentes (mencionados explícitamente en el work plan) |
| Teléfono y WhatsApp falsos en producción | Reemplazar por línea operativa antes de activar campañas pagadas en `/retiros/octubre-2026` |
| Precios de retiros + membresías sin definir | Bloquea conversión del flujo Apply → Discovery → Pago |
| Stripe sin productos creados | Bloquea checkout real (hoy corre en dry-run) |
| Cal.com sin event types creados | Bloquea agenda inline (hoy cae al fallback de link externo) |

---

*Generado por workflow `wf_f6a48fe7-264` · 2026-06-23. Integraciones wired Jun 23.*
