# Software Requirements Specification (SRS) · v3

## Plataforma Web Elements Method

| Campo                            | Valor                                                     |
| -------------------------------- | --------------------------------------------------------- |
| **Proyecto**               | Plataforma web Elements Method                            |
| **Versión del documento** | 2.0                                                       |
| **Fecha**                  | 1 de junio de 2026                                        |
| **Autor**                  | Santiago Serrano                                          |
| **Cliente**                | Andrés Flores Pedroza y Ana Michelle                     |
| **Inversión total**       | **$16,000 MXN**                                     |
| **Duración estimada**     | Hasta 4 semanas de desarrollo desde entrega de contenidos |

> **Cambios respecto a v1:** integra todas las respuestas del cuestionario de discovery del 1 de junio de 2026. Cambios principales: aceptación de documentos antes del checkout, repositorio de documentos con personalización dinámica, formularios privados con tokens únicos, manejo de IVA, sistema de descuentos por combinación, multi-idioma español/inglés, comentarios con pre-moderación, eliminación del validador QR, retiros con estados open/X cupos/closed.

---

## Tabla de contenido

1. [Introducción](#1-introducción)
2. [Descripción general](#2-descripción-general)
3. [Requerimientos funcionales](#3-requerimientos-funcionales)
4. [Requerimientos no funcionales](#4-requerimientos-no-funcionales)
5. [Requerimientos de interfaz](#5-requerimientos-de-interfaz)
6. [Restricciones y supuestos](#6-restricciones-y-supuestos)
7. [Pendientes del cliente](#7-pendientes-del-cliente)
8. [Fuera de alcance · fase 2 con cotización separada](#8-fuera-de-alcance--fase-2-con-cotización-separada)

---

## 1. Introducción

### 1.1 Propósito

Documento de especificación de requerimientos del sistema Elements Method. Define qué debe hacer la plataforma (no cómo lo hace; el "cómo" vive en el SDD). Sirve como contrato técnico entre cliente y desarrollador, y como referencia para verificación de entrega.

### 1.2 Alcance

Plataforma web bilingüe (español e inglés) para Elements Method, programa de sesiones de liderazgo. Incluye:

- Sitio público con cinco páginas institucionales más calendario de retiros, blog y testimoniales
- Venta de productos vía Stripe (tarjeta, OXXO, SPEI) en MXN y USD
- Pago alterno por transferencia bancaria con validación manual
- Cálculo y desglose de IVA sobre todos los precios
- Sistema de descuentos por combinación de productos
- Generación automática de comprobantes PDF
- Repositorio editable de documentos legales con personalización dinámica
- Flujo de aceptación de documentos previo al checkout
- Panel de administración para los dos socios
- Motor de formularios privados con tokens únicos por participante
- Calculadora de cotización empresarial con generación de PDF
- Blog con comentarios pre-moderados y suscripción por email
- Integraciones con ManyChat, Cal.com, MailChimp, Resend, Google Analytics, Google Ads, Banner de cookies y aviso de privacidad LFPDPPP

### 1.3 Definiciones y acrónimos

| Término                        | Definición                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Camino**                | Paquete contratable (Raíces, Corriente, Fuente)                                                  |
| **Elemento**              | Unidad temática (Agua, Fuego, Aire, Tierra)                                                      |
| **Retiro inmersivo**      | Sesión presencial multi-día que cubre los cuatro elementos                                      |
| **Comprobante**           | PDF de confirmación de compra                                                                    |
| **Folio**                 | Identificador legible único de cada orden, formato `EM-MMAA-XXXX`                              |
| **Responsiva**            | Documento de liberación de responsabilidad personal                                              |
| **NDA**                   | Acuerdo de confidencialidad                                                                       |
| **Token de formulario**   | Hash firmado en URL que identifica univocamente la asignación de un formulario a un participante |
| **Snapshot de documento** | Captura inmutable del PDF y su contenido al momento de aceptación                                |
| **i18n**                  | Internacionalización (soporte multi-idioma)                                                      |
| **LFPDPPP**               | Ley Federal de Protección de Datos Personales en Posesión de los Particulares                   |
| **IVA**                   | Impuesto al Valor Agregado (16% en México)                                                       |

### 1.4 Referencias

- Validación de Concepto entregada 11/05/2026
- Cotización entregada 12/05/2026
- SDD v3 (documento técnico hermano)

---

## 2. Descripción general

### 2.1 Perspectiva del producto

Aplicación web monolítica modular construida sobre Next.js 15, hospedada en Vercel, con PostgreSQL en Neon como persistencia primaria. Soporta dos idiomas (español por defecto, inglés como alternativa). Integra siete servicios externos vía SDKs y webhooks firmados.

### 2.2 Usuarios del sistema

| Tipo                           | Descripción                           | Permisos                                                                                                  |
| ------------------------------ | -------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Visitante**            | Sin autenticación                     | Navegar, conversar por chat, agendar citas, suscribirse a newsletter, llenar calculadora de empresas      |
| **Comprador individual** | Persona que adquiere un producto       | Aceptar documentos, completar compra, recibir comprobante, recibir formularios privados                   |
| **Comprador empresa**    | Organización que adquiere cotización | Recibir cotización PDF, aceptar documentos con datos de empresa, completar pago (Stripe o transferencia) |
| **Administrador**        | Andrés y Ana Michelle                 | Acceso total al panel admin vía magic link                                                               |

### 2.3 Funciones principales

A nivel macro:

1. **Comunicación pública** — presentar el método, los productos, retiros y testimoniales
2. **Captación** — chat, citas, formulario de empresas, suscripción a newsletter
3. **Venta** — flujo: aceptación de documentos → checkout (Stripe o transferencia) → comprobante
4. **Operación** — panel admin para gestión de todo el negocio
5. **Análisis** — métricas internas + GA4 + pixeles de ads
6. **Contenido editorial** — blog con comentarios moderados
7. **Internacionalización** — todo el contenido en español e inglés

### 2.4 Idiomas soportados

| Idioma                  | Código | Default | Cobertura                                    |
| ----------------------- | ------- | ------- | -------------------------------------------- |
| Español (México)      | `es`  | Sí     | Total                                        |
| Inglés (Internacional) | `en`  | No      | Total, con contenido provisto por el cliente |

El sistema renderiza español por defecto. El cambio a inglés es manual mediante un selector visible. La URL refleja el idioma activo (`/es/...` y `/en/...`).

---

## 3. Requerimientos funcionales

Convención: **RF-[módulo]-[número]**.

### 3.1 RF-I18N · Internacionalización

**RF-I18N-01.** El sistema debe operar en dos idiomas: español (default) e inglés.

**RF-I18N-02.** Todas las páginas públicas deben tener URLs prefijadas con el código de idioma (`/es/`, `/en/`).

**RF-I18N-03.** El sistema debe ofrecer un selector de idioma visible en header y footer.

**RF-I18N-04.** El selector debe preservar la página actual al cambiar de idioma (si existe traducción) o redirigir a inicio del idioma destino (si no existe).

**RF-I18N-05.** El sistema debe persistir la preferencia de idioma del visitante en cookie por 12 meses.

**RF-I18N-06.** Los emails transaccionales deben enviarse en el idioma del usuario al momento de la acción que los disparó.

**RF-I18N-07.** Los PDFs (comprobantes, cotizaciones, documentos legales) deben generarse en el idioma del comprador.

**RF-I18N-08.** El CMS de blog debe permitir crear cada artículo con versión en ambos idiomas (campo independiente por idioma).

**RF-I18N-09.** SEO debe ser bilingüe: cada página con `hreflang`, sitemap multilenguaje, meta tags por idioma.

**RF-I18N-10.** El contenido textual (excepto blog generado por admin) viene como archivos de traducción provistos por el cliente en formato estándar (JSON o YAML).

---

### 3.2 RF-PUB · Sitio público

**RF-PUB-01.** El sistema debe presentar una **página de inicio** con: propuesta de valor, presentación visual de los cuatro elementos con animaciones modernas (manteniendo estilo ejecutivo cercano a naturaleza), vista de los próximos retiros en formato grid de 4 módulos que expanden al hover, vista resumida de los caminos contratables, sección de testimoniales (formato mixto), logos de empresas clientes, llamado a la acción para empresas.

**RF-PUB-02.** El sistema debe presentar una página **Quiénes Somos** con bios independientes de Ana Michelle y Andrés (foto, nombre, rol, manifiesto, redes sociales personales).

**RF-PUB-03.** El sistema debe presentar una página **Los Caminos** con detalle de los tres caminos principales (Raíces, Corriente, Fuente). Cada uno: nombre, descripción larga, qué incluye, modalidad, duración, precio MXN y USD (con leyenda "no incluye IVA"), botón de compra.

**RF-PUB-04.** El sistema debe presentar una página **El Método** con los cuatro elementos en detalle. Por cada elemento, cuatro secciones de contenido **estático**:

1. El elemento en la naturaleza
2. El elemento en la persona
3. Metodología de liderazgo
4. Experiencia fisiológica

**RF-PUB-05.** El sistema debe presentar una página **Empresas** con pitch B2B, CTA al chat de ManyChat y CTA a la calculadora en `/empresas/cotizar`.

**RF-PUB-06.** El sistema debe presentar una sección dedicada de **calendario de retiros** con grid de 4 módulos que se expanden al hover. Cada módulo muestra próximo retiro de su categoría con: fecha, ubicación, modalidad, precio, estado de cupos.

**RF-PUB-07.** El sistema debe presentar testimoniales en cuatro formatos: video corto self-hosted, foto + cita + nombre + empresa, cita destacada sin foto, logo de empresa cliente. **Diferentes secciones del sitio muestran diferentes formatos** (no todos en todos lados).

**RF-PUB-08.** El sistema debe presentar `/blog` (listado) y `/blog/[slug]` (artículo individual), con botones de compartir en redes sociales y formulario de suscripción.

**RF-PUB-09.** El sistema debe presentar `/privacidad` con aviso conforme a LFPDPPP, generado a partir de plantilla estándar.

**RF-PUB-10.** El sistema debe presentar `/retiros-pasados` como archivo histórico de retiros completados, con testimoniales asociados.

**RF-PUB-11.** El sistema debe mostrar enlaces a redes sociales en footer y en otra sección del sitio (a definir según diseño).

**RF-PUB-12.** Todas las páginas deben ser responsive desde viewports de 360px.

**RF-PUB-13.** Toda página pública debe disponer de versión equivalente en inglés bajo prefijo `/en/`.

---

### 3.3 RF-RTR · Retiros y calendario

**RF-RTR-01.** El admin puede crear, editar, archivar retiros con campos: nombre, fecha de inicio, fecha de fin, ubicación, modalidad, elementos cubiertos, descripción, imagen, precio MXN, precio USD, cupo total.

**RF-RTR-02.** El sistema debe mostrar tres estados de un retiro en el sitio público:

- **Abierto** (al inicio de venta, sin mostrar cupos)
- **X cupos disponibles** (cuando se cruza un umbral configurable, ej. quedan 10 o menos)
- **Cerrado** (cuando se alcanza el cupo total)

**RF-RTR-03.** El sistema calcula cupos vendidos en tiempo real como suma de órdenes con status `paid` para ese retiro.

**RF-RTR-04.** Los retiros pasados se mueven automáticamente al archivo `/retiros-pasados` después de su fecha de fin.

**RF-RTR-05.** Cada retiro archivado puede tener testimoniales asociados manualmente desde el panel admin.

**RF-RTR-06.** Los retiros se renderean en el grid de 4 módulos con animación de expansión al hover.

---

### 3.4 RF-PRD · Productos y descuentos

**RF-PRD-01.** El sistema soporta los siguientes tipos de productos:

- 3 caminos: Raíces, Corriente, Fuente
- 4 elementos individuales: Agua, Fuego, Aire, Tierra
- Retiros inmersivos (de la tabla `retreats`)
- Programas corporativos (cotización a la medida)

**RF-PRD-02.** Cada producto tiene precio en MXN y USD, ambos almacenados.

**RF-PRD-03.** El sistema soporta **descuentos por combinación**, configurables desde admin: por ejemplo "comprar los 4 elementos individuales = 15% off sobre el total".

**RF-PRD-04.** Los descuentos se calculan al momento del checkout, antes de cobrar IVA.

**RF-PRD-05.** Los precios mostrados públicamente son **sin IVA**, con leyenda explícita "no incluye IVA".

**RF-PRD-06.** El sistema **no** soporta meses sin intereses en v1.

**RF-PRD-07.** Los precios son visibles públicamente sin requerir contacto previo.

---

### 3.5 RF-CMP · Compra, IVA y comprobantes

**RF-CMP-01.** El sistema debe permitir iniciar la compra de cualquier producto activo desde su página de detalle o desde el calendario de retiros.

**RF-CMP-02.** **El flujo de compra obliga aceptación previa de documentos legales** antes de llegar a la pasarela de pago. Si no se aceptan todos los documentos requeridos, el checkout no se habilita.

**RF-CMP-03.** El sistema debe calcular y mostrar antes del checkout: subtotal, descuentos aplicados, IVA (16%), total.

**RF-CMP-04.** El sistema debe procesar pagos vía Stripe Checkout aceptando tarjeta, OXXO, SPEI, en MXN y USD.

**RF-CMP-05.** El sistema debe ofrecer **pago por transferencia bancaria** como alternativa, mostrando datos bancarios completos (banco, CLABE, beneficiario, referencia con folio sugerido).

**RF-CMP-06.** Para transferencias, el sistema debe permitir al comprador **subir el comprobante** de pago. La orden queda en estado `pendiente_transferencia` hasta validación manual por admin.

**RF-CMP-07.** Al confirmarse un pago (Stripe webhook o validación manual de transferencia), el sistema debe:

- Generar folio único legible formato `EM-MMAA-XXXX`
- Generar comprobante PDF (sin QR)
- Enviar email transaccional con PDF adjunto
- Disparar evento a ManyChat para mensaje de bienvenida
- Sincronizar comprador con MailChimp si aplica

**RF-CMP-08.** El comprobante PDF debe incluir: logo, nombre del comprador, producto adquirido, fecha, folio, subtotal, descuentos, IVA, total, moneda, método de pago. Mismo formato para Stripe y para transferencia.

**RF-CMP-09.** El sistema debe permitir re-descarga del comprobante en `/comprobante/[folio]` previa verificación por email.

**RF-CMP-10.** El sistema debe manejar pagos pendientes (OXXO, SPEI) esperando confirmación antes de emitir comprobante.

**RF-CMP-11.** El sistema debe registrar reembolsos reportados por Stripe y notificar al comprador.

**RF-CMP-12.** La emisión de CFDI sigue siendo manual y la realiza el contador del cliente (fuera de alcance digital).

---

### 3.6 RF-DOC · Documentos legales (repositorio + personalización + aceptación)

**RF-DOC-01.** El sistema debe ofrecer un **repositorio de documentos legales** en el panel admin, donde Andrés y Ana Michelle pueden crear, editar, archivar y versionar cualquier número de documentos (no limitado a 4).

**RF-DOC-02.** Cada documento tiene:

- Slug único (ej. `contrato-servicios`, `responsiva`, `nda`, `autorizacion-imagen`)
- Nombre público
- Versión actual y historial
- Tipo: `requerido_para_compra` o `informativo`
- Plantilla de contenido con placeholders (ej. `{{buyer_name}}`, `{{company_name}}`, `{{fecha}}`, `{{folio}}`)
- Tipo de aceptación: `solo_check` o `firma_subida`
- Aplica a: `persona`, `empresa`, o `ambos`
- Idioma: `es`, `en`, o ambos

**RF-DOC-03.** Los documentos se generan dinámicamente en formato PDF con los datos del comprador (persona o empresa) en el momento de la aceptación.

**RF-DOC-04.** Para empresas se usan datos de empresa; para personas se usan datos personales. Los placeholders se rellenan automáticamente desde la información de la orden.

**RF-DOC-05.** El flujo de aceptación clip-a-clip sucede **antes del checkout**: tras seleccionar producto, el sistema presenta uno a uno todos los documentos `requerido_para_compra` aplicables al tipo de comprador.

**RF-DOC-06.** Para cada documento mostrado:

- Vista previa o descarga del PDF generado con los datos del comprador
- Checkbox "He leído y acepto este documento"
- Si tipo es `firma_subida`: campo de upload obligatorio para el PDF firmado

**RF-DOC-07.** El sistema registra cada aceptación en una tabla auditada con: documento, versión, hash del PDF aceptado, datos del comprador, IP, user-agent, timestamp.

**RF-DOC-08.** Si en el futuro el admin actualiza un documento, las aceptaciones pasadas mantienen la versión exacta que firmaron (snapshot inmutable).

**RF-DOC-09.** Sin aceptación completa, el sistema no permite avanzar al checkout.

**RF-DOC-10.** El panel admin debe permitir ver, por cada comprador, qué documentos aceptó, qué versión, cuándo, y descargar las copias subidas si las hubo.

**RF-DOC-11.** Adicionalmente, el sistema mantiene auditoría de descargas independientes (alguien descarga un documento sin completar compra).

---

### 3.7 RF-FRM · Motor de formularios privados

**RF-FRM-01.** El sistema permite al admin crear formularios con campos completamente personalizables: texto corto, texto largo, opción única, opción múltiple, escala numérica, NPS, fecha, email, número, rating de estrellas.

**RF-FRM-02.** Cada formulario tiene metadatos: título, descripción, idioma, anónimo o nominal (la primera pregunta puede ser "tu nombre").

**RF-FRM-03.** Los formularios **no son accesibles públicamente**. Cada respuesta requiere un **token único** firmado en la URL, generado por el admin y enviado al participante por email.

**RF-FRM-04.** El admin debe poder generar tokens en masa para enviar a participantes de un retiro: el sistema envía email automático con link único a cada uno.

**RF-FRM-05.** Cada token tiene fecha de expiración configurable y se invalida tras una respuesta exitosa.

**RF-FRM-06.** Por defecto el sistema crea varios formularios: cuestionario de inicio de experiencia, cuestionario durante experiencia, cuestionario de cierre. El admin puede crear cuantos más quiera (para actividades, encuestas puntuales, etc.).

**RF-FRM-07.** Las respuestas se almacenan en base de datos y se vinculan al comprador cuando el token está asociado a una orden.

**RF-FRM-08.** El admin debe poder exportar todas las respuestas de un formulario a XLSX con filtros por fecha y por retiro.

**RF-FRM-09.** El cuestionario de cierre debe poder configurarse con un campo "frase compartible públicamente" que sirve como fuente para testimoniales.

**RF-FRM-10.** No se envían notificaciones por email cuando alguien responde un formulario (revisión por demanda desde el panel).

---

### 3.8 RF-EMP · Calculadora y cotización empresarial

**RF-EMP-01.** El sistema presenta en `/empresas/cotizar` un formulario con: nombre de la empresa, contacto, email, teléfono, número de personas, número de sesiones, modalidad (presencial / virtual / híbrido).

**RF-EMP-02.** El sistema calcula y muestra el costo estimado en tiempo real conforme se llena el formulario, en MXN y USD.

**RF-EMP-03.** La fórmula es editable desde el panel admin (variables, multiplicadores, descuentos por volumen).

**RF-EMP-04.** Al enviar, el sistema genera un PDF de cotización con: logo, datos de la empresa, número de cotización, desglose completo del cálculo, qué incluye el programa, términos comerciales, vigencia 30 días, sección con selector visual de método de pago (Stripe vs transferencia), datos bancarios si elige transferencia.

**RF-EMP-05.** El PDF se envía por email al cliente y a los correos operativos.

**RF-EMP-06.** Las cotizaciones quedan registradas en el panel admin con status: nueva, contactada, aceptada, cerrada.

**RF-EMP-07.** Si la empresa acepta y procede al pago, el flujo continúa: aceptación de documentos legales (versión empresa) → checkout (Stripe o transferencia).

---

### 3.9 RF-ADM · Panel de administración

**RF-ADM-01.** Acceso por **magic link**: el admin ingresa su email, recibe enlace temporal que lo autentica sin contraseña.

**RF-ADM-02.** Solo emails whitelisted pueden iniciar sesión. Los enlaces expiran en 15 minutos.

**RF-ADM-03.** **Dashboard** con: ingresos del mes y año, compras por camino, tasa de conversión, origen de tráfico, top páginas, suscriptores nuevos, cotizaciones recibidas, citas agendadas. Link directo a Google Analytics (no embebido).

**RF-ADM-04.** Módulo **compradores** con búsqueda por nombre/email, filtros por status, detalle por comprador con su historial completo, documentos aceptados, formularios respondidos.

**RF-ADM-05.** Módulo **productos** con CRUD de los tres caminos, cuatro elementos individuales, programa corporativo, y configuración de descuentos por combinación.

**RF-ADM-06.** Módulo **retiros** con CRUD de retiros calendarizados, gestión de cupos, asociación de testimoniales para retiros pasados.

**RF-ADM-07.** Módulo **pagos** con tabla de transacciones Stripe + transferencias, totales bruto/comisión/neto/IVA, export CSV.

**RF-ADM-08.** Módulo **transferencias pendientes** para validar manualmente comprobantes subidos.

**RF-ADM-09.** Módulo **conversaciones** con espejo de ManyChat y link "abrir en ManyChat".

**RF-ADM-10.** Módulo **formularios** con builder, generación masiva de tokens, vista de respuestas, export XLSX.

**RF-ADM-11.** Módulo **empresas** con cotizaciones, status, edición de fórmula de calculadora.

**RF-ADM-12.** Módulo **documentos legales** con CRUD de plantillas, edición de placeholders, versionado, vista de aceptaciones por comprador, descarga de PDFs firmados subidos.

**RF-ADM-13.** Módulo **blog** con editor TipTap, soporte bilingüe por artículo, subida de imágenes, status borrador/publicado, **moderación de comentarios pendientes**.

**RF-ADM-14.** Módulo **testimoniales** con creación manual y **revisión de frases recolectadas** de cuestionarios. El admin lee, edita si quiere, decide qué publicar.

**RF-ADM-15.** Módulo **logos de empresas clientes** para subir/gestionar logos visibles en homepage.

**RF-ADM-16.** Módulo **suscriptores** con conteo, vista local, link a MailChimp para campañas.

**RF-ADM-17.** Módulo **calendario** con configuración de horarios disponibles de Cal.com (vía API) y vista de citas agendadas.

**RF-ADM-18.** Módulo **comentarios** del blog con cola de moderación: lista de pendientes, aprobar, rechazar, marcar como spam.

---

### 3.10 RF-CHT · Integración ManyChat

**RF-CHT-01.** Widget oficial de ManyChat embebido en todas las páginas públicas.

**RF-CHT-02.** Mensaje contextual distinto según página: Empresas con pitch B2B, Caminos con resolución de dudas, etc.

**RF-CHT-03.** Webhook entrante: el sistema replica conversaciones de ManyChat en su base de datos para reporting y vinculación con compras.

**RF-CHT-04.** Webhook saliente: al concretarse compra, se dispara flujo de bienvenida en ManyChat con tags según producto.

**RF-CHT-05.** Vinculación automática conversación-orden cuando coincide email o teléfono.

---

### 3.11 RF-CAL · Integración Cal.com

**RF-CAL-01.** Widget de Cal.com embebido en páginas relevantes (Empresas, Quiénes Somos, página de cada Camino).

**RF-CAL-02.** Una sola cuenta Cal.com a nombre de Elements Method, no por socio.

**RF-CAL-03.** Múltiples tipos de cita configurables: sesión informativa empresas, llamada de exploración individual, diagnóstico, etc.

**RF-CAL-04.** El admin configura horarios disponibles desde el panel (que sincroniza con Cal.com vía API) o directamente desde Cal.com con link rápido de acceso.

**RF-CAL-05.** Las reservas se sincronizan al destino de calendario definido (por confirmar con cliente: Google Calendar empresarial, personales, o ambos).

**RF-CAL-06.** Cal.com integrado con LinkedIn para que prospects puedan agendar directo desde sus perfiles.

---

### 3.12 RF-NWS · Newsletter y email (MailChimp + Resend)

**RF-NWS-01.** Emails **transaccionales** vía **Resend**: magic links, comprobantes, confirmaciones, tokens de formulario.

**RF-NWS-02.** Emails **marketing y newsletter** vía **MailChimp** (plan Essentials ~$13 USD/mes a cargo del cliente).

**RF-NWS-03.** Formulario de suscripción en footer y página Empresas.

**RF-NWS-04.** Al suscribirse, contacto se crea en MailChimp vía API y se guarda localmente.

**RF-NWS-05.** Automatizaciones configuradas: welcome email al suscribirse, email post-compra con bienvenida al programa, follow-up si abrió pero no respondió, secuencia de continuidad cuando alguien completa un módulo y existen siguientes.

**RF-NWS-06.** Las plantillas las diseñan Andrés y Ana Michelle dentro de MailChimp; el sistema solo dispara los triggers vía API.

**RF-NWS-07.** Frases destacadas de cuestionarios pueden usarse como contenido en newsletters.

---

### 3.13 RF-BLG · Blog y CMS

**RF-BLG-01.** El admin puede crear, editar, publicar, despublicar artículos desde el panel.

**RF-BLG-02.** Editor TipTap con: encabezados, negritas, cursivas, listas, links, imágenes, citas, código inline.

**RF-BLG-03.** Cada artículo soporta versión en español e inglés (campos independientes).

**RF-BLG-04.** Sin categorías. Listado cronológico simple.

**RF-BLG-05.** Imágenes subidas a Vercel Blob.

**RF-BLG-06.** Cada artículo incluye: título, slug, excerpt, contenido, imagen de portada, autor, fecha, meta descripción SEO.

**RF-BLG-07.** Artículos publicados visibles en `/blog` y `/blog/[slug]` (más sus equivalentes en `/en/`).

**RF-BLG-08.** Botones de compartir en redes sociales en cada artículo.

**RF-BLG-09.** Formulario de suscripción al blog: cuando se publica nuevo artículo, MailChimp envía broadcast a la lista.

**RF-BLG-10.** **Comentarios con pre-moderación + UX fantasma**:

- Cualquier visitante (con nombre y email) puede comentar
- El comentario entra a cola de moderación
- **El propio autor del comentario lo ve como "publicado"** (persistido por cookie/sesión)
- Otros visitantes no lo ven hasta que admin lo apruebe
- Admin tiene cola en panel para aprobar, rechazar o marcar como spam

**RF-BLG-11.** RSS feed en `/blog/feed.xml` y `/en/blog/feed.xml`.

---

### 3.14 RF-ANL · Analytics, SEO y pixeles

**RF-ANL-01.** Integración Google Analytics 4: páginas vistas, eventos de conversión (compras), origen de tráfico.

**RF-ANL-02.** Integración Google Ads para tracking de conversiones de campañas.

**RF-ANL-05.** Soporte opcional para LinkedIn Insight Tag.

**RF-ANL-06.** Banner de consentimiento de cookies (custom, no proveedor externo). Sin consentimiento, no se cargan scripts de tracking.

**RF-ANL-07.** Cada página con meta tags únicos por idioma: title, description, Open Graph, Twitter Cards, hreflang.

**RF-ANL-08.** Generación automática de `sitemap.xml` (con ambos idiomas) y `robots.txt`.

**RF-ANL-09.** Keywords iniciales (a refinar): "retiros de liderazgo CDMX", "coaching ejecutivo cuatro elementos", "programa de liderazgo experiencial", "retiros corporativos México", "metodología liderazgo personal", "desarrollo ejecutivo Tepoztlán".

---

## 4. Requerimientos no funcionales

### 4.1 Performance

**RNF-PERF-01.** Páginas públicas cargan en menos de 2.5 segundos en redes 4G.

**RNF-PERF-02.** Lighthouse Performance ≥ 90 en páginas públicas.

**RNF-PERF-03.** Generación de comprobante PDF post-pago: menos de 3 segundos.

**RNF-PERF-04.** Generación de documento legal personalizado: menos de 2 segundos.

**RNF-PERF-05.** Búsquedas en panel admin: menos de 1 segundo para tablas de hasta 10,000 registros.

**RNF-PERF-06.** Video self-hosted en homepage debe lazy-loadear (no descarga hasta que entra a viewport).

### 4.2 Disponibilidad

**RNF-DISP-01.** Disponibilidad ≥ 99.5% mensual (heredada de Vercel + Neon).

**RNF-DISP-02.** El sistema sigue aceptando pagos aunque el panel admin esté inaccesible.

### 4.3 Escalabilidad

**RNF-ESC-01.** Arquitectura soporta hasta 5,000 visitas únicas/mes sin upgrade de tier.

**RNF-ESC-02.** Base de datos hasta 0.5 GB en tier gratuito Neon.

**RNF-ESC-03.** Storage de videos: máximo 100 videos cortos (~10 MB cada uno) dentro del tier gratuito de Vercel Blob (1 GB).

**RNF-ESC-04.** Migración a tiers pagos sin cambios de código.

### 4.4 Seguridad

**RNF-SEG-01.** Datos de tarjeta nunca tocan el servidor del sistema.

**RNF-SEG-02.** Magic links expiran en 15 minutos.

**RNF-SEG-03.** Solo emails whitelisted ingresan al admin.

**RNF-SEG-04.** Tokens de formulario firmados con JWT y secret server-only, con expiración configurable.

**RNF-SEG-05.** Webhooks (Stripe, ManyChat, MailChimp) verifican firma antes de procesar.

**RNF-SEG-06.** Validación con Zod en toda entrada de usuario (cliente y servidor).

**RNF-SEG-07.** Variables de entorno para todas las API keys.

**RNF-SEG-08.** HTTPS en todo el sitio.

**RNF-SEG-09.** Headers de seguridad: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.

**RNF-SEG-10.** Upload de comprobantes de transferencia: validación de tipo (PDF/JPG/PNG) y tamaño (< 5 MB).

### 4.5 Privacidad y cumplimiento legal

**RNF-PRIV-01.** Cumplimiento LFPDPPP: aviso de privacidad accesible, consentimiento explícito, derechos ARCO.

**RNF-PRIV-02.** Almacenamiento mínimo de datos personales necesarios.

**RNF-PRIV-03.** Banner de cookies con granularidad: estrictamente necesarias, analytics, marketing.

**RNF-PRIV-04.** Aceptación de documentos legales con valor probatorio razonable (snapshot inmutable, hash, IP, UA, timestamp).

**RNF-PRIV-05.** Email de contacto para derechos ARCO: `help@elementsmethod.com` (a confirmar dominio).

### 4.6 Accesibilidad

**RNF-ACC-01.** WCAG 2.1 nivel AA.

**RNF-ACC-02.** Contraste mínimo 4.5:1 texto normal, 3:1 texto grande.

**RNF-ACC-03.** Navegación completa por teclado con focus visible.

**RNF-ACC-04.** Imágenes con `alt` significativo o vacío si decorativas.

**RNF-ACC-05.** Formularios con labels asociados.

**RNF-ACC-06.** Animaciones respetan `prefers-reduced-motion`.

### 4.7 Compatibilidad

**RNF-COMP-01.** Últimas 2 versiones de Chrome, Safari, Firefox, Edge.

**RNF-COMP-02.** Responsive desde 360px hasta 1920px.

**RNF-COMP-03.** Funcionalidad crítica (compra) preservada con JavaScript deshabilitado donde sea factible.

### 4.8 Internacionalización

**RNF-I18N-01.** Sistema arquitectónicamente listo para soportar idiomas adicionales sin refactor (solo agregar archivos de traducción).

**RNF-I18N-02.** Fechas, monedas y números formateados según locale.

**RNF-I18N-03.** Detección automática de idioma del navegador en primera visita; redirección al idioma adecuado.

### 4.9 Mantenibilidad

**RNF-MNT-01.** Código fuente versionado en GitHub.

**RNF-MNT-02.** Documentación operativa entregada.

**RNF-MNT-03.** Estructura modular por dominio.

**RNF-MNT-04.** Variables de entorno documentadas en `.env.example`.

### 4.10 Operación

**RNF-OP-01.** Deploys automáticos desde `main` a producción.

**RNF-OP-02.** Preview deployments por PR.

**RNF-OP-03.** Logs accesibles desde Vercel.

**RNF-OP-04.** Respaldos automáticos diarios de DB (Neon).

---

## 5. Requerimientos de interfaz

### 5.1 Interfaces de usuario

| Interfaz                            | Descripción                                                  |
| ----------------------------------- | ------------------------------------------------------------- |
| **Sitio público bilingüe**  | Páginas accesibles sin autenticación, en español e inglés |
| **Checkout Stripe**           | Pasarela hosted                                               |
| **Panel admin**               | Interfaz autenticada para socios                              |
| **Formularios privados**      | `/formulario/[token]` accesible con token válido           |
| **Comprobantes**              | `/comprobante/[folio]` con verificación por email          |
| **Documentos personalizados** | Generados en tiempo real con datos del comprador              |
| **Chat ManyChat**             | Widget embebido global                                        |
| **Calendario Cal.com**        | Widget embebido en páginas relevantes                        |

### 5.2 Interfaces con sistemas externos

| Sistema                      | Tipo             | Dirección                                             |
| ---------------------------- | ---------------- | ------------------------------------------------------ |
| **Stripe**             | SDK + webhooks   | Bidireccional                                          |
| **ManyChat**           | API + webhooks   | Bidireccional                                          |
| **MailChimp**          | API REST         | Saliente principal, webhook entrante para unsubscribes |
| **Cal.com**            | API REST + embed | Bidireccional                                          |
| **Resend**             | API REST         | Saliente                                               |
| **Google Analytics 4** | gtag.js          | Saliente                                               |
| **Google Ads**         | gtag conversion  | Saliente                                               |
|                              |                  |                                                        |
|                              |                  |                                                        |
|                              |                  |                                                        |
| **Vercel Blob**        | SDK              | Bidireccional                                          |

### 5.3 Bases de datos y almacenamiento

| Sistema                     | Función                                                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **PostgreSQL (Neon)** | Persistencia primaria, gestionada con Drizzle ORM                                                                                           |
| **Vercel Blob**       | Imágenes de blog, retiros, testimoniales (fotos + videos cortos), logos, PDFs subidos (comprobantes de transferencia, documentos firmados) |

---

## 6. Restricciones y supuestos

### 6.1 Técnicas

- Stack fijo: Next.js 15, TypeScript, Drizzle ORM, PostgreSQL en Neon.
- Hospedaje en Vercel Hobby al inicio.
- Pasarela de pago fija en Stripe.
- Operación inicial dentro de tiers gratuitos.

### 6.2 De tiempo

- 4 semanas de desarrollo máximo.
- Dependiente de entrega de contenidos y accesos por parte del cliente (ver sección 7).

### 6.3 De presupuesto

- Inversión total: $16,000 MXN.
- Cliente cubre directamente: dominio, ManyChat Pro, MailChimp Essentials, comisiones Stripe, suscripción a Cal.com si aplica.

### 6.4 Legales

- Cumplimiento LFPDPPP.
- Aceptación con valor probatorio razonable (sin firma electrónica NOM-151 en v1).
- Emisión de CFDI manual por contador del cliente.

### 6.5 Multi-idioma

- El sistema provee la infraestructura técnica completa para operar en español e inglés.
- **El contenido de la versión en inglés (traducciones de páginas, descripciones de productos, plantillas de emails y PDFs) lo provee el cliente.**
- Si el cliente requiere traducción profesional gestionada por el desarrollador, se cotiza aparte.

### 6.6 Supuestos

- Los socios revisan entregables parciales en plazos razonables (48-72 horas).
- La cuenta Stripe estará KYC-verificada antes del go-live.
- Los documentos legales los entrega el cliente ya revisados por su abogado, con placeholders documentados para los datos dinámicos.
- El cliente opera el panel admin tras la capacitación de cierre.

---

## 7. Pendientes del cliente

Items que el cliente debe resolver antes o durante el desarrollo. Su retraso bloquea fases específicas:

| ID   | Pendiente                                                                   | Bloquea                         |
| ---- | --------------------------------------------------------------------------- | ------------------------------- |
| P-01 | Dónde van las reservas de Cal.com (Google Calendar empresarial o personal) | Semana 4 (integración Cal.com) |
| P-02 | Fórmula exacta de la calculadora de empresas                               | Semana 3 (módulo Empresas)     |
| P-03 | Mínimos de personas y sesiones para cotización                            | Semana 3                        |
| P-04 | Documentos legales redactados y revisados por abogado                       | Semana 3 (módulo Documentos)   |
| P-05 | Fechas, precios y ubicaciones de retiros 2026-2027                          | Semana 2 (calendario)           |
| P-06 | Precio del retiro inmersivo de 3 días                                      | Semana 2                        |
| P-07 | Cantidad y especificaciones de logos de empresa al lanzamiento              | Semana 4                        |
| P-08 | Handles oficiales de Instagram, TikTok, LinkedIn                            | Semana 2                        |
| P-09 | FAQs para configuración de ManyChat                                        | Semana 4                        |
| P-10 | Temas y línea editorial del blog                                           | Post-launch                     |
| P-11 | Formato preferido de capacitación final                                    | Cierre                          |
| P-12 | Confirmación de Meta Pixel ID si se usará                                 | Semana 4                        |
| P-13 | Lista completa de redacciones para versión en inglés                      | Antes de lanzar EN              |

---

## 8. Fuera de alcance · fase 2 con cotización separada

Las siguientes funcionalidades quedan fuera de v1 y se cotizan como proyecto separado cuando llegue el momento. La arquitectura de v1 deja hooks razonables para soportarlas sin refactor mayor:

- **Área de miembros**: portal autenticado para participantes con contenido post-retiro.
- **Cursos en video**: integración con Vimeo, reproductor con tracking de progreso.
- **Comunidad**: grupos por elemento, sesiones mensuales virtuales, foros internos.
- **Botón "conocer participantes del retiro"**: visibilidad opt-in de asistentes con nombre y empresa.
- **Suscripción recurrente**: modelo de pago mensual para acceso a frameworks/contenidos continuos.
- **Tracking de progreso por participante**: gamificación, badges, elementos desbloqueados.
- **Firma electrónica NOM-151**: integración con DocuSign o Mifiel certificado.
- **Programa de lealtad y puntos**.
- **Sistema de referidos** con códigos de descuento.
- **Emisión automática de CFDI 4.0** vía PAC certificado.
- **App móvil nativa**.
- **Traducción profesional** gestionada por el desarrollador.
- **Página personal de Ana Michelle**: proyecto completamente separado, cotización aparte, diseño distinto, posterior al lanzamiento de Elements Method.

---

**Fin del documento.**
