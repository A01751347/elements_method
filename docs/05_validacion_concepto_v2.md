# VALIDACIÓN DE CONCEPTO · v2

# Elements Method · Plataforma Web Bilingüe

Sitio web institucional bilingüe con venta de productos, calculadora de cotización empresarial, repositorio de documentos legales personalizables, motor de formularios privados, blog con comentarios moderados y panel de administración completo.

**Preparado para:** Andrés Flores Pedroza y Ana Michelle
**Preparado por:** Santiago Serrano
**Fecha:** 1 de junio de 2026
**Versión del documento:** 2.0
**Documento padre:** Validación de Concepto v1.0 (11 de mayo de 2026)

---

**SECCIÓN 01**

## Resumen del proyecto

Elements Method es un programa de sesiones de liderazgo articulado bajo el marco simbólico de los cuatro elementos. Esta segunda validación de concepto traduce la conversación del 29 de mayo de 2026 y las respuestas posteriores al cuestionario en una plataforma digital completa: bilingüe, con venta directa de productos, generación dinámica de documentos legales, calculadora de cotización para empresas, y panel de administración robusto para los socios.

#### El proyecto en una frase

Construir un sitio web bilingüe español/inglés que sirva como la cara digital del método y como su sistema operativo: vende, cobra, factura, gestiona retiros, captura testimonios, opera el día a día, y mide su desempeño.

#### Objetivos del producto

- Comunicar con claridad la propuesta de Elements Method en español e inglés.
- Permitir la compra autónoma de cualquier producto (caminos, elementos individuales, retiros, programas corporativos).
- Capturar la aceptación formal de documentos legales antes de cada compra, con trazabilidad jurídica.
- Dar a las empresas una calculadora que les genere su cotización con el desglose completo.
- Mostrar el calendario de retiros con cupos en tiempo real.
- Equipar a los socios con un panel completo para operar el negocio sin depender del desarrollador.
- Automatizar la primera comunicación con prospectos y clientes vía ManyChat.
- Integrar newsletter, citas, analytics y todos los servicios que el negocio requiere.

#### Frente al usuario

- Sitio público bilingüe con cinco páginas institucionales más calendario de retiros, blog y testimoniales.
- Flujo de compra con aceptación previa de documentos personalizados.
- Calculadora visual de cotización empresarial.
- Chat directo vía ManyChat para conversación humana.
- Agenda de citas vía Cal.com con múltiples tipos de sesión.
- Newsletter integrado con MailChimp.

#### Operación interna

- Panel de administración con módulos para cada función del negocio.
- Validación manual de transferencias bancarias.
- Moderación de comentarios del blog.
- Aprobación de testimoniales recolectados de cuestionarios.
- Gestión de retiros con cupos y archivo histórico.
- Estadísticas del negocio con métricas clave + link directo a Google Analytics.

---

**SECCIÓN 02**

## Punto de partida y evolución

Esta es la segunda versión del concepto, construida sobre la primera. Las decisiones que se tomaron en la videollamada del 29 de mayo y en el cuestionario posterior expandieron el alcance original en varias direcciones. Documento aquí qué se mantiene y qué cambia.

#### Lo que se mantiene de la versión original

- Estilo visual y narrativa de los cuatro elementos del mockup original.
- Cinco páginas públicas con navegación coherente.
- Pasarela de pago vía Stripe.
- Panel de administración para los dos socios.
- Integración con ManyChat para conversación.
- Magic link como método de autenticación admin (sin contraseñas).

#### Lo que evoluciona en esta versión

| Aspecto | Versión 1 | Versión 2 |
|---|---|---|
| **Idiomas** | Solo español | Español e inglés |
| **Productos** | 3 caminos fijos | 3 caminos + 4 elementos individuales + retiros + programa corporativo |
| **Calendario de retiros** | No contemplado | Sección dedicada con grid expandible y cupos en tiempo real |
| **Documentos legales** | 4 documentos descargables | Repositorio editable de N documentos personalizados con datos del comprador |
| **Aceptación de documentos** | Después del pago | **Antes del pago** (obliga firma para comprar) |
| **Formularios** | URLs públicas simples | Privados con tokens únicos enviados por email |
| **Calculadora empresarial** | Formulario simple | Calculadora en tiempo real con generación de PDF de cotización |
| **Pagos** | Solo Stripe | Stripe + transferencia bancaria con validación manual |
| **Cálculo de precios** | Precio neto | Subtotal + descuentos por combinación + IVA |
| **Testimoniales** | No contemplado | Sección con 4 formatos + alimentación desde cuestionarios |
| **Logos de empresas clientes** | No contemplado | Sección dedicada con autorización auditada |
| **Blog** | Básico, sin comentarios | Bilingüe con comentarios pre-moderados y UX especial |
| **Newsletter** | Resend Audiences | MailChimp Essentials (Resend solo transaccional) |
| **Analytics** | Vercel básico | Google Analytics 4 + Google Ads + TikTok Pixel + Meta + LinkedIn |
| **Banner de cookies** | No contemplado | Custom LFPDPPP con granularidad |
| **Citas** | No contemplado | Cal.com con múltiples tipos de cita |
| **Validador de acceso QR** | Incluido | **Eliminado** (no necesario) |

---

**SECCIÓN 03**

## Audiencias y experiencia

El sistema sirve a cinco audiencias distintas. Cada una tiene un recorrido diferente y necesidades específicas.

#### Visitante curioso

Llega sin contexto desde redes, búsqueda o recomendación. Quiere entender qué es Elements Method. La página de inicio le da en 30 segundos una idea clara: los cuatro elementos, los caminos disponibles, los próximos retiros, testimoniales de quienes ya pasaron. Si le interesa profundizar, navega a "El Método" y conoce la filosofía. Si está listo para algo concreto, va a "Los Caminos" o al chat.

#### Comprador individual

Decidido a contratar uno de los caminos o un elemento individual. Necesita ver claramente el precio (con leyenda "no incluye IVA"), qué incluye, modalidad, próximas fechas. Da clic en comprar, captura sus datos, acepta los documentos legales uno por uno (cada uno generado con sus datos personales), elige método de pago (tarjeta vía Stripe o transferencia bancaria), y recibe su comprobante.

#### Comprador empresa

Tiene un equipo y busca un programa a la medida. Navega a la página de Empresas, conversa por chat con Andrés o Ana Michelle, luego va a la calculadora `/empresas/cotizar`. Llena los datos de su organización, ve el costo en tiempo real conforme ajusta personas y modalidad, recibe su cotización en PDF con desglose completo. Si decide proceder, acepta documentos personalizados con datos de su empresa (razón social, RFC, dirección), y paga (Stripe o transferencia).

#### Visitante internacional

Llega y el sitio detecta su idioma (inglés). Si prefiere, cambia con el selector. Todas las páginas, productos, documentos legales y comprobantes se le presentan en inglés. Paga en USD si así lo elige.

#### Administrador (Andrés y Ana Michelle)

Operan el negocio desde el panel admin. Acceden vía magic link a su email. Desde ahí: editan productos y precios, gestionan retiros, validan transferencias bancarias, exportan respuestas de cuestionarios, suben nuevos documentos legales, moderan comentarios del blog, aprueban testimoniales, publican artículos. Ven sus métricas en el dashboard y abren Google Analytics con un click cuando necesitan profundizar.

---

**SECCIÓN 04**

## Arquitectura del sitio

El sitio se estructura en tres capas: páginas públicas bilingües, pantallas transaccionales para el flujo de compra, y panel privado para la operación.

#### Páginas públicas (en español e inglés)

| # | Página | Propósito |
|---|---|---|
| 01 | **Inicio** | Propuesta de valor, los cuatro elementos con animaciones, calendario de retiros con grid expandible, testimoniales destacados, logos de empresas clientes, CTA empresas |
| 02 | **Quiénes Somos** | Bios independientes de Ana Michelle y Andrés con foto, rol, manifiesto y redes sociales personales |
| 03 | **Los Caminos** | Detalle de los tres caminos contratables (Raíces, Corriente, Fuente) con descripción, qué incluye, precios MXN/USD, botón de compra |
| 04 | **El Método** | Los cuatro elementos en profundidad, cada uno con cuatro sub-secciones (en la naturaleza, en ti, metodología, experiencia fisiológica) |
| 05 | **Empresas** | Pitch B2B con CTA al chat y a la calculadora de cotización |

#### Páginas secundarias

| Página | Propósito |
|---|---|
| **Retiros** | Calendario completo de próximos retiros con estados de cupos |
| **Retiros pasados** | Archivo histórico con testimoniales asociados |
| **Blog** | Listado de artículos bilingües |
| **Empresas/Cotizar** | Calculadora visual con generación de PDF |
| **Privacidad** | Aviso conforme a LFPDPPP |

#### Pantallas transaccionales

El flujo de compra ocurre en pantallas dedicadas que llevan al usuario paso a paso:

1. **Datos del comprador** — persona o empresa, captura de información
2. **Aceptación de documentos** — uno por uno, con preview personalizado y checkbox
3. **Pago** — elección entre Stripe o transferencia, resumen con IVA
4. **Confirmación** — descarga del comprobante, mensaje de bienvenida

#### Pantallas auxiliares

| Pantalla | Función |
|---|---|
| `/comprobante/[folio]` | Re-descarga del comprobante con verificación por email |
| `/formulario/[token]` | Acceso a formulario privado vía link único |
| `/login` | Solicitud de magic link admin |

#### Panel privado (admin)

| Módulo | Función |
|---|---|
| **Dashboard** | Métricas del negocio + link a Google Analytics |
| **Compradores** | Búsqueda, filtros, historial por comprador |
| **Productos** | CRUD de caminos, elementos y descuentos por combinación |
| **Retiros** | Calendario, cupos, testimoniales asociados |
| **Pagos** | Transacciones Stripe + transferencias, IVA, export CSV |
| **Transferencias pendientes** | Validación manual de comprobantes subidos |
| **Empresas** | Cotizaciones recibidas, edición de fórmula de calculadora |
| **Formularios** | Builder, generación de tokens, respuestas, export XLSX |
| **Documentos legales** | Plantillas, versionado, vista de aceptaciones |
| **Blog** | Editor TipTap bilingüe + moderación de comentarios |
| **Testimoniales** | Aprobación de frases del cuestionario + creación manual |
| **Logos empresas** | Subida y gestión de logos |
| **Suscriptores** | Espejo de MailChimp |
| **Conversaciones** | Espejo de ManyChat |
| **Citas (Cal.com)** | Horarios disponibles y citas agendadas |
| **Comentarios** | Cola de moderación del blog |

---

**SECCIÓN 05**

## Los cuatro elementos y los caminos

#### Los cuatro elementos como marco narrativo

La narrativa central del método. Cada elemento tiene cuatro componentes que se desarrollan en la página "El Método":

##### Agua

| Componente | Contenido |
|---|---|
| **En la naturaleza** | Cualidad: claridad, flujo, profundidad. Comportamiento natural del agua |
| **En ti** | Lo que representa para la persona: escucha profunda, adaptabilidad |
| **Metodología** | Frameworks que se trabajan para conectar con este elemento como líder |
| **Experiencia fisiológica** | Actividades corporales: cascada, contrast therapy, inmersión |

##### Fuego

| Componente | Contenido |
|---|---|
| **En la naturaleza** | Visión, coraje, activación. Energía transformadora |
| **En ti** | Inspiración, movimiento hacia lo que importa |
| **Metodología** | Frameworks de activación y propósito |
| **Experiencia fisiológica** | Actividades de movimiento, fuego, sauna |

##### Aire

| Componente | Contenido |
|---|---|
| **En la naturaleza** | Perspectiva, comunicación, libertad |
| **En ti** | Visión del panorama, comunicación precisa, espacio |
| **Metodología** | Frameworks de comunicación ejecutiva y claridad |
| **Experiencia fisiológica** | Respiración, breathwork, altura |

##### Tierra

| Componente | Contenido |
|---|---|
| **En la naturaleza** | Arraigo, confianza, raíces |
| **En ti** | Anclaje, confianza duradera, entornos donde florecer |
| **Metodología** | Frameworks de fundamento personal y estructura |
| **Experiencia fisiológica** | Caminata, contacto con tierra, ceremonias |

El contenido es **estático**: se construye una vez y para modificarlo en el futuro se requiere al desarrollador. Visualmente la página es **moderna con animaciones sutiles** que mantienen el look ejecutivo cercano a naturaleza.

#### Los productos contratables

**Caminos grupales:**

| Producto | Descripción |
|---|---|
| **Raíces** | Programa de inmersión de cuatro meses. Una inmersión presencial mensual, dos sesiones de coaching individual al mes, una sesión grupal virtual mensual. Recorrido por los cuatro elementos. Acceso a comunidad |
| **Corriente** | Intensivo grupal acelerado. Dos inmersiones presenciales por mes, dos sesiones de coaching mensuales, integración acelerada |
| **Fuente** | Inmersión total individual. Programa diseñado a la medida con mapeo de liderazgo 1:1 e integración de retiro ejecutivo |

**Elementos individuales:**

Cada elemento (Agua, Fuego, Aire, Tierra) es contratable por separado para quienes quieran trabajar un elemento específico sin compromiso anual. La persona puede entrar en cualquier momento del año, en cualquier orden.

**Retiros inmersivos:**

Sesiones presenciales de varios días que cubren los cuatro elementos en una sola experiencia. Calendarizados a lo largo del año en ubicaciones específicas (Tepoztlán, costa, etc.). Aparecen en el calendario público con sus fechas, cupos y precio.

**Programa corporativo:**

Cotización a la medida vía calculadora. No tiene precio fijo en la tienda; se genera por la calculadora según número de personas, sesiones y modalidad.

#### Descuentos por combinación

El sistema soporta reglas de descuento configurables desde el admin. Por ejemplo:

- "Comprar los 4 elementos individuales en una sola transacción = 15% off"
- "Camino + Retiro inmersivo = 10% off"

Las reglas las definen los socios desde el panel sin intervención del desarrollador.

#### Tratamiento de IVA

Los precios mostrados públicamente son **sin IVA**, con leyenda explícita. El IVA (16%) se agrega al final del cálculo, después de descuentos. El comprobante muestra el desglose: subtotal, descuento aplicado, IVA, total.

---

**SECCIÓN 06**

## Multi-idioma · español e inglés

Una de las decisiones más importantes de esta versión es que el sitio opera en dos idiomas.

#### Comportamiento del selector

- En primera visita, el sistema detecta el idioma del navegador y muestra el contenido apropiado.
- El visitante puede cambiar manualmente desde un selector visible en header y footer.
- La preferencia se guarda por 12 meses en cookie.
- La URL siempre refleja el idioma activo (`/es/...` y `/en/...`).

#### Qué se traduce

| Elemento | Traducción |
|---|---|
| Páginas públicas | Cada texto, título, botón |
| Productos | Nombre, descripción, qué incluye |
| Retiros | Nombre, descripción, ubicación |
| Blog | Cada artículo con versión en ambos idiomas |
| Testimoniales | Cita y rol |
| Documentos legales | Plantilla completa en ambos idiomas |
| Emails transaccionales | Plantillas separadas según idioma del usuario |
| PDFs (comprobantes, cotizaciones) | Generados en el idioma del comprador |
| Meta tags SEO | `hreflang`, sitemap multilenguaje |

#### Quién provee qué

- **Yo (desarrollador)** entrego la infraestructura completa: rutas bilingües, selector, persistencia, generación de PDFs por idioma, SEO multilenguaje.
- **Ustedes (cliente)** proveen los textos en ambos idiomas. Si la traducción profesional la quieren gestionar conmigo, eso se cotiza aparte.

---

**SECCIÓN 07**

## Alcance funcional

#### Frente público

| Capacidad | Detalle |
|---|---|
| Sitio bilingüe completo | Cinco páginas institucionales más calendario, blog, testimoniales, archivo de retiros pasados, privacidad |
| Responsive | Optimizado desde móvil 360px hasta escritorio amplio |
| SEO bilingüe | Meta tags por página por idioma, sitemap multilenguaje, Open Graph |
| Calendario de retiros | Grid de 4 módulos que se expanden al hover, cupos en tiempo real con tres estados (abierto / X cupos / cerrado) |
| Testimoniales | Cuatro formatos: video corto self-hosted, foto + cita, cita destacada, logo de empresa |
| Animaciones modernas | En presentación de los cuatro elementos, manteniendo estilo ejecutivo cercano a naturaleza |
| Banner de cookies | Custom, conforme a LFPDPPP, con granularidad (analytics vs marketing) |

#### Compra de productos

| Capacidad | Detalle |
|---|---|
| Pasarela Stripe | Tarjeta, OXXO, SPEI en MXN y USD |
| Pago por transferencia | Datos bancarios completos, upload de comprobante, validación manual por admin |
| Cálculo automático de IVA | Subtotal + descuentos + IVA 16% mostrados explícitamente |
| Descuentos por combinación | Reglas configurables por el admin |
| Comprobante PDF | Generado automáticamente con desglose completo, sin QR |
| Email transaccional | Confirmación con PDF adjunto vía Resend |
| Vista de re-descarga | `/comprobante/[folio]` con verificación por email |
| Manejo de pagos pendientes | OXXO/SPEI esperan confirmación antes de emitir comprobante |
| Manejo de reembolsos | Notificación automática al cliente, status actualizado |

#### Documentos legales

| Capacidad | Detalle |
|---|---|
| Repositorio editable | Los socios pueden subir y administrar cualquier número de documentos |
| Plantillas con placeholders | Cada documento es una plantilla con variables (`{{buyer_name}}`, `{{company_name}}`, etc.) |
| Generación dinámica | Al momento de la aceptación, se genera el PDF con los datos del comprador |
| Personalización por tipo | Para personas se usan datos personales, para empresas se usan datos corporativos |
| Aceptación previa al pago | El sistema bloquea el checkout hasta que se aceptan todos los documentos requeridos |
| Tipos de aceptación | Solo checkbox o firma + upload, configurable por documento |
| Auditoría completa | Cada aceptación registra hash del PDF firmado, IP, user-agent, timestamp |
| Versionado con snapshot | Si se actualiza una plantilla, las aceptaciones previas mantienen la versión que firmaron |

#### Calculadora y cotización para empresas

| Capacidad | Detalle |
|---|---|
| Formulario interactivo | Empresa, contacto, personas, sesiones, modalidad |
| Cálculo en tiempo real | Costo estimado actualizado conforme el usuario llena |
| Fórmula editable | Variables, multiplicadores y descuentos editables desde admin |
| PDF de cotización | Logo, datos de la empresa, número de cotización, desglose, qué incluye, vigencia 30 días |
| Selección de método de pago | Stripe o transferencia, con datos bancarios visibles si elige transferencia |
| Envío automático | PDF al cliente y a los correos operativos |
| Registro en admin | Status: nueva, contactada, aceptada, cerrada. Notas internas |

#### Motor de formularios privados

| Capacidad | Detalle |
|---|---|
| Builder en admin | Campos personalizables: texto, párrafo, opción única, múltiple, escala, NPS, fecha, email, número, rating |
| Formularios por defecto | Cuestionario de inicio de experiencia, durante, de cierre, plus cuantos creen los admins |
| Acceso privado | Cada respuesta requiere un token único firmado, enviado por email |
| Generación masiva de tokens | Para enviar a todos los participantes de un retiro de una vez |
| Tokens single-use con expiración | Configurable por formulario |
| Vinculación con compradores | Si el email matchea una orden, la respuesta se vincula |
| Export XLSX | Filtros por fecha y por retiro |
| Frase compartible | Campo especial en cuestionario de cierre que alimenta testimoniales |

#### Comunicación · ManyChat + Cal.com

| Capacidad | Detalle |
|---|---|
| Widget de WhatsApp | Embebido en todas las páginas, con mensajes contextuales por origen |
| Webhook entrante | Las conversaciones se replican al panel admin |
| Webhook saliente | Compra exitosa dispara mensaje de bienvenida con tags por producto |
| Cal.com embebido | En páginas relevantes (Empresas, Quiénes Somos, cada Camino) |
| Múltiples tipos de cita | Sesión informativa empresas, exploración individual, diagnóstico, etc. |
| Horarios desde admin | Andrés y Ana Michelle configuran disponibilidad desde el panel |
| Integración LinkedIn | Cal.com sincronizado con LinkedIn para agendamiento directo |

#### Newsletter (MailChimp) + Email transaccional (Resend)

| Capacidad | Detalle |
|---|---|
| Suscripción | Formulario en footer y página Empresas |
| Sync automático con MailChimp | Cada suscripción crea contacto vía API |
| Automatizaciones | Welcome, post-compra, follow-up, secuencia de continuidad de cursos |
| Plantillas | Diseñadas por los socios en MailChimp |
| Frases destacadas | Cuestionarios alimentan contenido para newsletters |
| Email transaccional separado | Magic links, comprobantes, tokens de formulario vía Resend |

#### Blog bilingüe con comentarios moderados

| Capacidad | Detalle |
|---|---|
| Editor TipTap | Encabezados, negritas, listas, links, imágenes, citas |
| Versión por idioma | Cada artículo se crea en español y en inglés (campos independientes) |
| Sin categorías | Listado cronológico simple |
| Botones de compartir | Redes sociales con un click |
| Suscripción al blog | Email automático cuando se publica nuevo artículo |
| Comentarios con pre-moderación | Cualquier visitante puede comentar |
| UX fantasma | El autor del comentario lo ve como publicado, pero otros no hasta que admin lo apruebe |
| Cola de moderación en admin | Aprobar, rechazar, marcar como spam |
| RSS feed | En ambos idiomas |

#### Analytics y tracking

| Capacidad | Detalle |
|---|---|
| Google Analytics 4 | Páginas vistas, eventos, conversiones |
| Google Ads | Tracking de conversiones de campañas |
| TikTok Pixel | Para campañas de TikTok |
| Meta Pixel | Para Facebook/Instagram (ID lo provee Andrés cuando esté listo) |
| LinkedIn Insight Tag | Opcional, para campañas B2B en LinkedIn |
| Carga condicional | Sin consentimiento de cookies, no se cargan scripts de tracking |
| Dashboard interno | Métricas clave del negocio, link directo a Google Analytics |

---

**SECCIÓN 08**

## Panel de administración

El panel privado es la herramienta operativa de los socios. Desde una sola interfaz operan todo el negocio sin depender del desarrollador para tareas regulares.

#### Acceso

V�a **magic link**: el admin ingresa su email, recibe un enlace en su correo que lo autentica sin contraseña. Cualquier email no whitelisted es rechazado. Los enlaces expiran en 15 minutos.

#### Capacidades por módulo

**Dashboard:** ingresos del mes y año, compras por camino, tasa de conversión, origen de tráfico, suscriptores nuevos, cotizaciones recibidas, citas agendadas, link directo a GA.

**Compradores:** búsqueda por nombre o email, filtros por status, detalle por comprador con todo su historial (compras, documentos aceptados, formularios respondidos).

**Productos:** CRUD completo de caminos, elementos individuales y programa corporativo. Sincronización automática con Stripe al cambiar precios. Edición de reglas de descuento por combinación.

**Retiros:** calendario completo, gestión de cupos, configuración del umbral para mostrar "X cupos restantes", asociación de testimoniales para retiros pasados.

**Pagos:** tabla de transacciones (Stripe + transferencias), totales bruto, comisión, IVA, neto. Export CSV.

**Transferencias pendientes:** lista de pagos por transferencia esperando validación. Vista del comprobante subido. Botón de aprobar o rechazar.

**Empresas:** lista de cotizaciones recibidas. Detalle por cotización. Cambio de status (nueva, contactada, aceptada, cerrada). Notas internas. Edición de la fórmula de calculadora.

**Formularios:** builder con campos personalizables. Lista de formularios existentes. Generación masiva de tokens por retiro. Vista de respuestas con export XLSX.

**Documentos legales:** repositorio completo. Subir, editar, archivar plantillas. Configurar placeholders. Versionado. Vista de aceptaciones por comprador con descarga de PDFs firmados subidos.

**Blog:** editor TipTap bilingüe. Subida de imágenes. Status borrador/publicado. Cola separada de comentarios pendientes de moderación.

**Testimoniales:** creación manual. Revisión de "frases compartibles" recolectadas de cuestionarios con un click para promocionar a testimonial.

**Logos de empresas clientes:** subida con autorización adjunta. Configuración de visibilidad y orden.

**Suscriptores:** vista local del espejo de MailChimp. Link directo a MailChimp para crear campañas.

**Conversaciones:** espejo de hilos de ManyChat. Link "abrir en ManyChat" para responder desde la plataforma original.

**Citas:** configuración de horarios disponibles (sincroniza con Cal.com vía API). Vista de citas agendadas con datos del prospecto.

**Comentarios:** cola dedicada de comentarios pendientes con acciones rápidas.

---

**SECCIÓN 09**

## Recorridos del usuario

#### Compra individual

1. Llega al sitio desde recomendación, redes o búsqueda.
2. Sitio detecta su idioma (español o inglés) y muestra la versión correcta.
3. Lee la propuesta en Inicio y ve los próximos retiros.
4. Profundiza en El Método si quiere entender la filosofía.
5. Decide un Camino y le da clic a "Comprar".
6. Captura sus datos (persona física).
7. Se le presentan los documentos legales uno por uno, cada uno generado con su nombre y datos. Los lee, acepta o sube firmado si se requiere.
8. Llega al resumen: subtotal, descuento si aplica, IVA, total.
9. Elige método: tarjeta vía Stripe Checkout, o transferencia bancaria con datos completos visibles.
10. Si paga por Stripe: recibe comprobante inmediatamente. Si paga por transferencia: sube el comprobante y espera validación.
11. Recibe su comprobante PDF por email en su idioma.
12. Es contactado por ManyChat con mensaje de bienvenida y siguientes pasos.

#### Cotización para empresas

1. Llega buscando formación para su equipo.
2. Navega a la página de Empresas.
3. Conversa por chat con Andrés o Ana Michelle (calificación inicial).
4. ManyChat le dirige a `/empresas/cotizar`.
5. Llena el formulario con los datos de su organización.
6. La calculadora le muestra el costo en tiempo real conforme ajusta.
7. Al enviar, recibe PDF de cotización con desglose completo y opción de pago (Stripe o transferencia).
8. Si decide proceder: acepta documentos personalizados con datos de su empresa (RFC, razón social, dirección).
9. Paga vía Stripe o transferencia.
10. Recibe comprobante.

#### Día de la sesión / retiro

Sin QR ya que no se requiere validador automatizado.

1. Antes del retiro, los socios consultan el panel admin para ver el listado de asistentes.
2. Imprimen o consultan desde celular durante la entrada.
3. Validan manualmente con la lista o desde el módulo de Retiros.
4. Después del retiro, los socios pueden enviar el formulario de cierre vía generación masiva de tokens.
5. Las respuestas llegan al panel. Las frases compartibles se revisan y promueven a testimoniales.

#### Visitante internacional pagando en USD

1. Llega y el sitio detecta inglés.
2. Ve los productos con precio en USD (cambiable a MXN).
3. Acepta documentos en inglés.
4. Paga en USD vía Stripe.
5. Recibe comprobante en inglés.

---

**SECCIÓN 10**

## Identidad y experiencia visual

#### Punto de partida

El mockup HTML original define la dirección visual: paleta sobria, tipografía limpia, los cuatro elementos como eje narrativo. Esta versión expande pero respeta el espíritu original.

#### Principios visuales para v2

| Principio | Aplicación |
|---|---|
| **Ejecutivo cercano a naturaleza** | Sobriedad y profesionalismo sin sentirse corporativo frío |
| **Animaciones modernas pero discretas** | Movimiento sutil en los cuatro elementos (no excesivo), hover-expand de retiros |
| **Bilingüe sin disrupciones** | El cambio de idioma no altera la composición visual |
| **Mobile-first** | Cada decisión visual prioriza el móvil primero |
| **Densidad equilibrada** | Generosa en móvil, ordenada en desktop |
| **Sin estética genérica de plantilla** | Decisiones tipográficas y de espaciado distintivas, heredadas del mockup |

#### Componentes visuales clave

- **Grid de retiros**: cuatro módulos visibles. Al hacer hover sobre uno, se expande y muestra detalle (fecha, ubicación, cupos, botón). Los otros tres se comprimen para acomodar.
- **Sección de los cuatro elementos**: bloques con animación sutil característica por elemento (Agua fluye, Fuego parpadea, Aire respira, Tierra reposa).
- **Testimoniales rotativos**: distintos formatos en distintas secciones del sitio.
- **Banner de cookies**: discreto, fijo en parte inferior, con opciones granulares en un solo clic.
- **Selector de idioma**: visible pero no protagonista, en header y footer.

---

**SECCIÓN 11**

## Fases y entregas

El proyecto se ejecuta en cuatro semanas de desarrollo activo, precedidas por una semana de preparación del cliente y seguidas por una semana de margen.

#### Plan de trabajo

| Fase | Duración | Objetivo |
|---|---|---|
| **Semana 0** | 5-7 días | Cliente entrega contenidos y activa cuentas externas |
| **Semana 1** | 5 días | Foundation técnica + i18n + auth + layouts bilingües |
| **Semana 2** | 5 días | Páginas públicas + productos + retiros + Stripe |
| **Semana 3** | 5 días | Documentos + calculadora + formularios + admin |
| **Semana 4** | 5 días | ManyChat + MailChimp + Cal.com + analytics + blog + go-live |
| **Semana 5** | 5 días | Margen para ajustes finales y cierre formal |
| **Post-launch** | 30 días | Garantía de bugs sin costo |

#### Lo que se entrega al cierre

- Sitio en línea bajo `https://elementsmethod.com`
- Versión bilingüe operativa (español completo, inglés con textos provistos por cliente)
- Panel admin accesible para los dos socios vía magic link
- Stripe, MailChimp, ManyChat, Cal.com, Resend, Google Analytics configurados y operando
- Pixeles de tracking activados (GA4, Google Ads, TikTok, Meta cuando se provea)
- Repositorio de documentos legales con plantillas activas
- Banner de cookies y aviso de privacidad publicados
- Manual de operación del panel admin
- Sesión de capacitación con ambos socios
- Periodo de soporte de 30 días arrancando

---

**SECCIÓN 12**

## Entregables y supuestos

#### Lo que entrega Santiago

- Sitio web completo en producción bajo el dominio del cliente
- Código fuente versionado en repositorio Git del cliente
- Configuración de Stripe lista para recibir pagos reales
- Configuración de MailChimp conectada vía API
- Configuración de Cal.com integrada vía API y embed
- Configuración de ManyChat conectada por webhooks
- Configuración de Google Analytics y pixeles bajo consentimiento
- Panel de administración funcional con todos los módulos
- Repositorio de documentos legales con plantillas configurables
- Generación dinámica de comprobantes y cotizaciones en PDF
- Motor de formularios privados con generación masiva de tokens
- Calculadora de cotización empresarial con fórmula editable
- Soporte estructural completo para multi-idioma
- Banner de cookies LFPDPPP-compliant
- Manual de operación del panel
- Periodo de soporte post-launch de 30 días

#### Lo que entregan Andrés y Ana Michelle

**Identidad visual:**
- Logo en formato vectorial (SVG/AI)
- Paleta de colores en hex
- Tipografías definitivas con licencia comercial
- Imágenes para secciones visuales

**Contenidos en español:**
- Textos finales de las cinco páginas públicas
- Bios de los socios
- Textos de los cuatro elementos (16 sub-secciones)
- Pitch B2B para empresas

**Contenidos en inglés:**
- Traducción completa de todos los textos anteriores

**Datos comerciales:**
- Lista de productos con precios MXN y USD
- Fechas, ubicaciones, precios de retiros 2026-2027
- Reglas de descuento por combinación
- Fórmula de calculadora empresarial
- Datos bancarios para transferencias
- Datos fiscales de la empresa

**Documentos legales (revisados por abogado):**
- Contrato de servicios
- Responsiva de responsabilidad
- Autorización de uso de imagen y grabación
- NDA
- Cuantos documentos adicionales requieran (repositorio abierto)

**Material para testimoniales:**
- Videos cortos (máximo 60s, comprimidos)
- Fotos + citas
- Logos de empresas con autorización por escrito

**Cuentas externas:**
- Stripe activa con KYC iniciado
- ManyChat Pro
- MailChimp Essentials
- Cal.com
- Google Analytics 4
- Google Ads (si harán campañas)
- TikTok Pixel ID
- Meta Pixel ID (cuando esté listo)
- Dominio elementsmethod.com comprado con acceso DNS
- Servicio de email para correos operativos (Zoho Free o similar)

#### Supuestos del alcance

- El diseño parte del mockup HTML original. Se expande y se pule, manteniendo la dirección visual.
- Los textos en inglés los provee el cliente; el desarrollador entrega la infraestructura.
- Si se requiere traducción profesional gestionada por el desarrollador, se cotiza aparte.
- Los documentos legales se entregan ya revisados por abogado, con los placeholders identificados.
- La emisión de CFDI queda fuera de alcance: la realiza el contador del cliente.
- Los videos de testimoniales se comprometen a ser cortos (máximo 60s) para no exceder límites de storage.
- El cliente revisará entregables parciales en plazos razonables (48-72 horas).

#### Fuera de alcance · diferido a fase 2 con cotización separada

- Área de miembros con cursos en video, progreso y certificados
- Comunidad / grupos por elemento / sesiones mensuales
- Botón "conocer participantes del retiro"
- Suscripción recurrente (modelo de pago mensual)
- Tracking de progreso por participante
- Firma electrónica con validez NOM-151 (DocuSign / Mifiel)
- Programa de lealtad y puntos
- Sistema de afiliados o referidos
- Emisión automática de CFDI 4.0
- App móvil nativa
- Traducción profesional gestionada por el desarrollador
- Página personal de Ana Michelle (proyecto completamente separado)

---

**SECCIÓN 13**

## Stack y operación

#### Elecciones técnicas

La elección técnica privilegia velocidad de desarrollo, mantenibilidad por un solo desarrollador, y costos operativos bajos al inicio.

| Componente | Tecnología |
|---|---|
| Frontend y backend | Next.js 15 con TypeScript |
| Internacionalización | next-intl |
| Hospedaje | Vercel |
| Base de datos | PostgreSQL en Neon |
| Pagos | Stripe (tarjeta, OXXO, SPEI, MXN, USD) |
| Generación de PDF | React PDF con plantillas y placeholders |
| Email transaccional | Resend |
| Email marketing | MailChimp |
| Citas | Cal.com Cloud |
| Conversaciones | ManyChat Pro |
| Almacenamiento de archivos | Vercel Blob |
| Editor de blog | TipTap |
| Estilos | Tailwind CSS 4 |
| Componentes UI | shadcn/ui |
| Animaciones | Framer Motion |

#### Servicios externos a contratar (por el cliente)

| Servicio | Costo aproximado | Función |
|---|---|---|
| Dominio elementsmethod.com | ~$20 USD/año | Identidad pública |
| Stripe | Pago por uso (~3% por transacción) | Cobros |
| ManyChat Pro | ~$15 USD/mes | Chat WhatsApp |
| MailChimp Essentials | ~$13 USD/mes | Newsletter |
| Cal.com | Free al inicio | Citas |
| Vercel | Gratis al inicio (Hobby) | Hospedaje |
| Neon | Gratis al inicio (Free) | Base de datos |
| Resend | Gratis al inicio (3,000 emails/mes) | Email transaccional |
| Email operativo (Zoho Free o similar) | Gratis | 5 correos operativos |

#### Consideraciones de seguridad

- Tokens de formularios firmados con JWT, single-use, con expiración
- Acceso al panel admin protegido por magic link con expiración de 15 min
- Whitelist de emails admin
- Webhooks (Stripe, ManyChat, MailChimp, Cal.com) verificados con firma
- Información de pago manejada exclusivamente por Stripe; el sitio nunca almacena datos de tarjeta
- Datos de tarjeta en transferencias bancarias: no aplican, el cliente paga directamente desde su banco
- Subida de comprobantes y firmados validados por tipo, tamaño y antivirus
- Comentarios del blog con rate limiting y validación anti-spam
- Conexión cifrada bajo HTTPS en todo el sitio
- Headers de seguridad: CSP, X-Frame-Options, X-Content-Type-Options
- Variables de entorno para todas las API keys y secrets
- Documentos legales con snapshot inmutable (hash + versión guardadas)

#### Consideraciones de privacidad

- Aviso de privacidad conforme a LFPDPPP, con email de contacto para derechos ARCO
- Banner de cookies con granularidad: estrictamente necesarias, analytics, marketing
- Sin consentimiento, no se cargan scripts de tracking
- Almacenamiento mínimo de datos personales: solo lo necesario
- Re-prompt de consentimiento cada 12 meses

---

**SECCIÓN 14**

## Visión hacia fase 2

Lo que se construye en v1 deja explícitamente preparada la arquitectura para fase 2, que se cotizará aparte cuando llegue el momento.

#### Funcionalidades planeadas para fase 2

| Funcionalidad | Descripción |
|---|---|
| **Área de miembros** | Portal autenticado para participantes con acceso a recursos post-retiro |
| **Cursos en video integrados** | Reproductor con tracking de progreso, contenido alojado en Vimeo |
| **Comunidad** | Grupos por elemento, sesiones mensuales virtuales |
| **Botón "conocer participantes"** | Visibilidad opt-in de quiénes asisten a cada retiro |
| **Suscripción recurrente** | Pago mensual para acceso a frameworks continuos |
| **Tracking de progreso** | Gamificación, badges, elementos desbloqueados según retiros tomados |
| **Firma electrónica NOM-151** | Integración con proveedor certificado (DocuSign / Mifiel) |
| **Programa de lealtad** | Puntos por compras, beneficios escalonados |

#### Qué se prepara desde v1

- La tabla de órdenes indexada por email permite vincular compras pasadas cuando se creen cuentas de usuario.
- Estructura de carpetas reserva espacio para rutas de miembros.
- Lógica de productos soporta agregar tipo "subscription" sin refactor.
- Módulo de documentos ya soporta `signature_upload` que se reemplazará por firma electrónica.
- Datos de retiros vinculados a órdenes permiten reconstruir asistencias.

---

**SECCIÓN 15**

## Inversión y forma de pago

#### Inversión total

**$17,000 MXN**

Cubre todo el alcance descrito en este documento. No incluye los costos recurrentes del cliente (dominio, ManyChat Pro, MailChimp, Stripe, etc.) ni la traducción profesional al inglés si la requieren gestionada por el desarrollador.

#### Forma de pago

Tres opciones, ajustables según preferencia del cliente:

| Opción | Esquema |
|---|---|
| **Por hitos** | $5,000 al firmar, $5,000 al cierre de semana 2, $7,000 al lanzamiento |
| **50/50** | $8,500 al firmar, $8,500 al lanzamiento |
| **Mensual** | Cuatro pagos de $4,250 a lo largo del proyecto |

---

### Cierre

Este documento define el alcance del proyecto Elements Method v2.0: sitio público bilingüe, calendario de retiros con cupos en tiempo real, sistema completo de compra con manejo de IVA y descuentos por combinación, pasarela Stripe más opción de transferencia bancaria, repositorio editable de documentos legales con personalización dinámica, motor de formularios privados con tokens, calculadora empresarial con generación de PDF, blog bilingüe con comentarios moderados, integración con ManyChat, MailChimp, Cal.com, Resend, Google Analytics y pixeles de tracking, banner de cookies LFPDPPP, y panel de administración robusto que permite operar el negocio sin depender del desarrollador.

Sirve como referencia compartida para arrancar, para revisar avances durante el desarrollo, y como base para el diseño visual que se construirá sobre esta especificación.

---

**Santiago Serrano**
Desarrollo · Implementación · Despliegue
ssmm.serrano@gmail.com

---

**Anexos:**

- Software Requirements Specification (SRS) v3.0 — detalle técnico de requerimientos
- Software Design Document (SDD) v3.0 — diseño técnico de la arquitectura
- Cronograma y dependencias v2.0 — plan de trabajo semanal con dependencias
- Preguntas de discovery v1.0 — respuestas a decisiones de alcance
