# Cronograma y dependencias · v2
## Plataforma Web Elements Method

| Campo | Valor |
|---|---|
| **Inversión total** | **$17,000 MXN** |
| **Duración máxima de desarrollo activo** | 4 semanas |
| **Plazo total estimado calendario** | 6 semanas (semana 0 + 4 de desarrollo + 1 de margen) |
| **Versión documento** | 2.0 |
| **Fecha** | 1 de junio de 2026 |

> **Cambios respecto a v1:** integra todas las decisiones del cuestionario, incluye fechas específicas de entrega de contenidos por parte del cliente, incorpora la carga adicional de multi-idioma y los nuevos módulos (calculadora, documentos dinámicos, comentarios moderados, pixeles de tracking, retiros con estados).

---

## 1. Resumen ejecutivo

El proyecto se ejecuta en **cinco fases temporales**:

- **Semana 0:** preparación del cliente (entrega de contenidos y activación de cuentas).
- **Semanas 1-4:** desarrollo activo.
- **Semana 5 (margen):** ajustes finales y go-live.
- **30 días post-launch:** garantía de bugs.

El plazo total depende de la diligencia del cliente entregando lo que se le pide en la semana 0 y revisando entregables semanalmente. Si la semana 0 se atrasa, todo se recorre proporcionalmente.

---

## 2. Vista de alto nivel

```
Semana 0 (Preparación cliente)     ── Entrega de contenidos + activación de cuentas
Semana 1 (Foundation + i18n)       ── Setup técnico, DB, auth, layouts bilingües
Semana 2 (Públicas + Productos)    ── 5 páginas + retiros + Stripe + pricing engine
Semana 3 (Compra + Operación)      ── Documentos, calculadora, formularios, admin
Semana 4 (Integraciones + Lanz.)   ── ManyChat, MailChimp, GA, blog, pixeles, deploy
Semana 5 (Margen)                  ── Buffer para imprevistos y revisión final
Post-launch (30 días)              ── Soporte de bugs sin costo
```

---

## 3. Semana 0 · Preparación del cliente

**Objetivo:** que cuando arranque la semana 1, no haya bloqueadores por contenido o accesos.

**Responsable:** Andrés y Ana Michelle.

**Plan diario propuesto:**

| Día | Entregables del cliente |
|---|---|
| **Lunes** | Logo en vectorial (SVG/AI), paleta de colores en hex, tipografías con licencia, compra del dominio `elementsmethod.com` |
| **Martes** | Lista de productos con precios definitivos MXN y USD, bios de Ana Michelle y Andrés (en español), fotos profesionales en alta resolución |
| **Miércoles** | Textos finales de Inicio, Quiénes Somos, Los Caminos (en español) |
| **Jueves** | Textos del Método (4 elementos × 4 sub-componentes = 16 secciones), Texto de Empresas |
| **Viernes** | Fórmula de calculadora de empresas, datos bancarios completos para transferencias, fechas/ubicaciones/precios de retiros 2026-2027 |
| **Lunes (sig.)** | Documentos legales (contrato, responsiva, NDA, autorización de imagen) **revisados por abogado**, con placeholders identificados |
| **Martes (sig.)** | Cuentas activadas: Stripe (KYC iniciado), ManyChat Pro, MailChimp Essentials, Cal.com, GA4, Google Workspace o Zoho para correos |
| **Miércoles (sig.)** | Material de testimoniales (videos cortos + fotos + citas + logos de empresas con autorización), handles oficiales de redes sociales |
| **Jueves-Viernes (sig.)** | **Traducción al inglés** de todos los textos anteriores |

**Cualquier retraso aquí extiende el calendario por el tiempo equivalente.**

Si algún elemento crítico no está listo, la semana 1 arranca con placeholders y se sustituye después, pero hay límite: sin documentos legales no se puede cerrar el módulo de documentos en semana 3, y sin fórmula de calculadora la cotización empresarial no funciona.

---

## 4. Semana 1 · Foundation + i18n

**Responsable:** desarrollador.

**Objetivo:** infraestructura técnica completa y operativa, lista para construir features sobre ella.

| Tarea | Días | Depende de cliente |
|---|---|---|
| Setup repo Next.js 15 + TypeScript + Tailwind + Drizzle | 0.5 | No |
| Configuración de **next-intl** con rutas `/es/` y `/en/` | 0.5 | No |
| Schema completo de base de datos (33 tablas) | 0.5 | No |
| Conexión Neon + migraciones | 0.5 | No |
| Auth.js v5 con magic links vía Resend | 0.5 | Resend API key |
| Layout público base bilingüe con paleta y tipografías del cliente | 1 | Paleta + tipografías + logo |
| Layout admin base | 0.5 | No |
| Selector de idioma + persistencia en cookie | 0.5 | No |
| Pricing engine (subtotal + descuentos + IVA) | 0.5 | No |
| Deploy inicial en Vercel preview | 0.5 | No |

**Entregable fin de semana 1:** sitio vacío bilingüe, login admin funcional, base de datos con todas las tablas, deploy en Vercel preview accesible para el cliente.

**Revisión del cliente:** ninguna formal (es plomería técnica). Se comparte preview deployment para validar paleta y tipografías.

---

## 5. Semana 2 · Páginas públicas + productos + retiros + Stripe

**Responsable:** desarrollador.

**Objetivo:** sitio público completo con productos comprables vía Stripe (modo test).

| Tarea | Días | Depende de cliente |
|---|---|---|
| Página **Inicio** con animaciones modernas de los 4 elementos | 1 | Textos + imágenes |
| Página **Quiénes Somos** con bios bilingües | 0.5 | Bios + fotos (ES + EN) |
| Página **Los Caminos** con CRUD de productos | 1 | Lista productos + precios |
| Página **El Método** con 4 elementos × 4 secciones (contenido estático) | 1 | 16 textos (ES + EN) |
| Página **Empresas** con pitch y CTAs | 0.5 | Texto pitch (ES + EN) |
| Calendario de **retiros** con grid 4 módulos hover-expand | 1 | Fechas + ubicaciones + precios |
| Estados de cupos (abierto / X cupos / cerrado) | 0.5 | No |
| Productos en Stripe (caminos + elementos + retiros) | 0.5 | Cuenta Stripe activa |
| Stripe Checkout integrado con MXN y USD | 0.5 | No |
| Sistema de **descuentos** por combinación | 0.5 | Reglas del cliente |
| Cálculo y display de **IVA** en página de producto | 0.5 | No |

**Entregable fin de semana 2:** las 5 páginas públicas con contenido real bilingüe, productos vendibles en Stripe modo test, flujo de compra básico (sin documentos aún) funcionando.

**Revisión del cliente:** sesión 60 min revisando preview deployment. Feedback por escrito en 48 hrs.

**Riesgo:** si los textos no están listos, se trabaja con lorem ipsum y se sustituye después; el contenido del método es el más crítico por su densidad.

---

## 6. Semana 3 · Documentos + calculadora + formularios + admin

**Responsable:** desarrollador.

**Objetivo:** flujo de compra completo end-to-end + módulos operativos del admin.

| Tarea | Días | Depende de cliente |
|---|---|---|
| Panel admin: dashboard + compradores + productos + retiros | 1 | No (datos de prueba) |
| Panel admin: pagos + módulo transferencias pendientes | 0.5 | No |
| **Repositorio de documentos legales** con CRUD + plantillas con placeholders | 1 | Plantillas revisadas |
| Motor de generación dinámica de PDFs personalizados | 1 | No |
| **Flujo de aceptación pre-checkout** clip-a-clip + upload de firmados | 0.5 | No |
| Motor de **formularios privados con tokens JWT** + builder admin | 1 | No |
| Generación masiva de tokens + envío por email | 0.5 | No |
| Export XLSX de respuestas | 0.5 | No |
| Calculadora de empresas con fórmula editable | 1 | **Fórmula del cliente** |
| Generación PDF de cotización empresarial | 0.5 | Logo + datos bancarios |

**Entregable fin de semana 3:** admin completamente operativo, flujo de compra con documentos legales funcionando (Stripe + transferencia), formularios creables y exportables, calculadora generando PDFs correctos.

**Revisión del cliente:** sesión 90 min de capacitación inicial en el panel admin. Feedback en 48 hrs.

**Riesgo crítico:** sin fórmula de calculadora ni PDFs legales en mitad de semana 3, estos módulos quedan incompletos al lanzar.

---

## 7. Semana 4 · Integraciones + blog + analytics + lanzamiento

**Responsable:** desarrollador + cliente.

**Objetivo:** todas las integraciones operando + sitio live en dominio del cliente.

| Tarea | Días | Depende de cliente |
|---|---|---|
| Integración **ManyChat** (webhook bidireccional + mensajes contextuales) | 1 | Cuenta ManyChat Pro |
| Integración **MailChimp** (suscripción + automations triggers) | 0.5 | Cuenta MailChimp |
| Integración **Cal.com** (embed + múltiples tipos de cita + API horarios) | 1 | Cuenta Cal.com configurada |
| **Google Analytics 4 + Google Ads + TikTok Pixel + Meta + LinkedIn** | 1 | IDs respectivos |
| **Banner de cookies** custom con granularidad | 0.5 | No |
| **CMS de blog bilingüe** con TipTap + subida de imágenes | 1 | No |
| **Sistema de comentarios** con pre-moderación y UX fantasma | 0.5 | No |
| **Suscripción al blog** vía MailChimp broadcast | 0.5 | No |
| Sección de **testimoniales** con todos los formatos + self-hosting de videos | 1 | Material de testimoniales |
| **Logos de empresas clientes** | 0.5 | Logos + autorizaciones |
| **Aviso de privacidad** con plantilla LFPDPPP | 0.5 | Datos fiscales empresa |
| Switch Stripe a modo live + compra real de prueba | 0.5 | Stripe KYC completo |
| Configuración DNS dominio | 0.5 | Acceso al registrador |
| Configuración correos: hola, ventas, contacto, andres, anamichelle (Zoho Free) | 0.5 | Acceso al DNS |
| Capacitación final con ambos socios | 0.5 | Disponibilidad |

**Entregable fin de semana 4:** sitio live bajo dominio del cliente, todas las integraciones operando, primera compra real procesada, capacitación realizada.

**Revisión del cliente:** continua durante la semana, con check-in diario los últimos 3 días.

**Riesgo:** KYC de Stripe puede tardar 1-3 días con bancos mexicanos. Si no está completo, go-live se retrasa.

---

## 8. Semana 5 · Margen y go-live formal

**Buffer de una semana para:**

- Ajustes finales de copy y diseño
- Pruebas integrales en producción
- Capacitación adicional si se requiere
- Configuración fina de pixeles y conversiones
- Documentación operativa entregable
- Sesión formal de cierre del proyecto

Si las 4 semanas anteriores fluyeron sin retrasos, esta semana se usa para pulir y cerrar limpio. Si hubo retrasos, esta semana absorbe parte de ellos.

---

## 9. Post-launch · Garantía de 30 días

- Corrección sin costo de bugs detectados durante 30 días naturales desde el go-live.
- Cambios fuera del alcance descrito en el SRS v3 se cotizan aparte.
- Soporte vía WhatsApp y email.
- Cambios después del día 31 se cotizan por hora o por proyecto según volumen.

---

## 10. Diagrama de dependencias críticas

```
[Logo + paleta]              ──► [Semana 1: Layouts]
[Textos páginas ES]          ──► [Semana 2: Públicas]
[Textos páginas EN]          ──► [Semana 2-4: Traducción incremental]
[Productos + precios]        ──► [Semana 2: Stripe products]
[Reglas de descuento]        ──► [Semana 2: Sistema de descuentos]
[Fechas de retiros]          ──► [Semana 2: Calendario]
[PDFs legales + abogado]     ──► [Semana 3: Repositorio documentos]
[Fórmula calculadora]        ──► [Semana 3: Calculadora]
[Datos bancarios]            ──► [Semana 3: Generación PDFs]
[Cuenta ManyChat Pro]        ──► [Semana 4: Integración ManyChat]
[Cuenta MailChimp]           ──► [Semana 4: Newsletter]
[Cuenta Cal.com]             ──► [Semana 4: Citas]
[Cuentas GA4 + Ads + Pixeles]──► [Semana 4: Tracking]
[Material testimoniales]     ──► [Semana 4: Sección testimoniales]
[Logos + autorizaciones]     ──► [Semana 4: Carrusel logos]
[Stripe KYC completo]        ──► [Semana 4: Modo live + go-live]
[Dominio + DNS]              ──► [Semana 4: Go-live]
```

---

## 11. Lo que necesito del cliente · checklist consolidado

### Antes de arrancar (semana 0)

**Identidad visual:**
- [ ] Logo en formato vectorial (SVG, AI o EPS)
- [ ] Paleta de colores en hex
- [ ] Tipografías definitivas con licencia comercial
- [ ] Imágenes para hero y secciones de páginas

**Contenidos en español:**
- [ ] Textos finales de Inicio
- [ ] Bios de Ana Michelle y Andrés
- [ ] Textos finales de Los Caminos (3 caminos completos)
- [ ] Textos finales de El Método (16 sub-componentes)
- [ ] Textos finales de Empresas
- [ ] Pitch B2B para empresas
- [ ] Aviso de privacidad (plantilla provista, ustedes la afinan)

**Contenidos en inglés:**
- [ ] Traducción completa de todos los textos anteriores
- [ ] Bios traducidas
- [ ] Descripciones de productos traducidas

**Datos comerciales:**
- [ ] Lista de productos con precios MXN y USD
- [ ] Fechas, ubicaciones, modalidades, cupos y precios de retiros 2026-2027
- [ ] Precio del retiro inmersivo de 3 días
- [ ] Reglas de descuento por combinación (ej. 4 elementos = X% off)
- [ ] Fórmula de calculadora empresarial (variables y valores)
- [ ] Mínimos de personas/sesiones para cotización
- [ ] Datos bancarios para transferencias (banco, CLABE, beneficiario)
- [ ] Datos fiscales de la empresa (RFC, dirección, régimen)

**Documentos legales:**
- [ ] Contrato de servicios (PDF, revisado por abogado, con placeholders identificados)
- [ ] Responsiva de responsabilidad
- [ ] Autorización de uso de imagen y grabación
- [ ] NDA / acuerdo de confidencialidad
- [ ] (Más documentos si los requieren — el sistema es repositorio abierto)

**Cuentas externas:**
- [ ] Stripe activa con KYC iniciado
- [ ] ManyChat Pro
- [ ] MailChimp Essentials
- [ ] Cal.com Free (o Plus si necesitan más event types)
- [ ] Google Analytics 4 (propiedad creada)
- [ ] Google Ads (si harán campañas)
- [ ] TikTok Pixel ID
- [ ] Meta Pixel ID (cuando Andrés lo provea)
- [ ] Dominio `elementsmethod.com` comprado con acceso al DNS
- [ ] Zoho Mail Free (o equivalente) para los 5 correos operativos

**Material para testimoniales:**
- [ ] Videos cortos (30-60s, comprimidos)
- [ ] Fotos + citas de participantes
- [ ] Logos de empresas con autorización por escrito
- [ ] Handles oficiales de Instagram, TikTok, LinkedIn

### Durante el desarrollo

- [ ] Disponibilidad para revisión semanal de 60 min
- [ ] Feedback consolidado por escrito en máximo 48 horas
- [ ] Disponibilidad de chat para dudas rápidas

### Antes del lanzamiento

- [ ] Preguntas pendientes resueltas (ver lista en SRS v3 sección 7)
- [ ] Confirmación de funcionalidad básica del panel admin tras capacitación
- [ ] Decisión sobre formato de capacitación final (videollamada grabada o presencial)

### Después del lanzamiento

- [ ] Operación del CMS y panel admin
- [ ] Reportar bugs durante 30 días de garantía por escrito
- [ ] Contador del cliente operando emisión de CFDI manual

---

## 12. Esquema de pagos

Inversión total: **$17,000 MXN**.

Tres opciones, abiertas a ajustar:

### Opción A · Por hitos (recomendada)

| Momento | Monto | Hito |
|---|---|---|
| Al firmar | $5,000 MXN | Arranque, acceso a Vercel y repo |
| Fin de semana 2 | $5,000 MXN | Páginas públicas + Stripe operando |
| Al lanzamiento | $7,000 MXN | Go-live en dominio del cliente |

### Opción B · 50/50 tradicional

| Momento | Monto |
|---|---|
| Al firmar | $8,500 MXN |
| Al lanzamiento | $8,500 MXN |

### Opción C · Cuatro pagos mensuales

| Mes | Monto |
|---|---|
| Mes 1 (firma) | $4,250 MXN |
| Mes 2 | $4,250 MXN |
| Mes 3 | $4,250 MXN |
| Mes 4 (cierre) | $4,250 MXN |

---

## 13. Riesgos identificados y mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Stripe KYC se atrasa | Media | Alto (retrasa go-live) | Iniciar KYC el día 1 de semana 0; usar modo test durante todo el desarrollo |
| Documentos legales sin revisión legal | Alta | Alto (bloquea módulo) | Empezar módulo con plantillas demo; sustituir al recibir |
| Fórmula de calculadora no definida | Alta | Medio (módulo bloqueado) | Acordar fórmula simple inicial; refinable después desde admin |
| Traducciones al inglés incompletas | Alta | Medio (versión EN no lanza) | Lanzar primero en ES; agregar EN cuando esté listo |
| Cliente tarda en revisar | Media | Medio | Cláusula de retraso = extensión equivalente |
| Cambios de scope durante desarrollo | Alta | Alto | Cambios post-firma cotizados aparte |
| ManyChat Pro con configuración incompleta | Media | Medio (Andrés responsable de flows) | Liberar integración aunque flows no estén; Andrés los completa después |
| Videos testimoniales pesados | Media | Bajo (storage) | Estipular máximo 60s, comprimir antes de subir |
| Meta Pixel ID no provisto a tiempo | Baja | Bajo | Infraestructura lista; activar cuando llegue ID |

---

## 14. Comunicación durante el proyecto

| Canal | Uso |
|---|---|
| **WhatsApp** | Coordinación rápida, dudas puntuales |
| **Google Drive** | Documentos compartidos del proyecto |
| **Google Docs** | Feedback estructurado de revisiones |
| **Videollamada (Meet/Zoom)** | Revisiones formales semanales (60-90 min) |
| **Email** | Entregables formales con enlaces a preview |
| **Vercel preview links** | Validación de cambios en tiempo real |

---

## 15. Criterios de aceptación final

El proyecto se considera entregado cuando se cumplen TODOS los siguientes:

- [ ] El sitio está accesible bajo `https://elementsmethod.com`
- [ ] Las cinco páginas públicas están vivas con contenido real en español
- [ ] La versión en inglés está disponible en `/en/` (al menos con textos básicos)
- [ ] El calendario de retiros muestra retiros activos con estados de cupos
- [ ] Se procesó al menos una compra real en modo live de Stripe
- [ ] Se procesó al menos una compra de prueba por transferencia bancaria
- [ ] El comprobante PDF se genera correctamente con desglose de IVA
- [ ] El comprador puede aceptar los documentos legales clip-a-clip antes del checkout
- [ ] Los documentos se generan dinámicamente con datos del comprador
- [ ] El admin puede operar el panel: editar productos, ver pagos, validar transferencias, exportar respuestas, crear formularios, moderar comentarios
- [ ] La calculadora de empresas genera PDFs correctos
- [ ] ManyChat, MailChimp, Cal.com están integrados y operando
- [ ] Google Analytics, Google Ads, TikTok Pixel registran visitas (bajo consentimiento)
- [ ] El banner de cookies funciona con granularidad correcta
- [ ] El aviso de privacidad está publicado
- [ ] El blog publica artículos y los comentarios se moderan
- [ ] Se entregó manual de operación del panel admin
- [ ] Se realizó capacitación con ambos socios
- [ ] Se transfirieron todos los accesos y credenciales
- [ ] Inició el periodo de soporte de 30 días

---

## 16. Documentos del proyecto

| Documento | Versión actual | Propósito |
|---|---|---|
| **SRS** | v3.0 | Especificación de requerimientos (qué hace el sistema) |
| **SDD** | v3.0 | Diseño técnico (cómo lo hace) |
| **Cronograma** | v2.0 (este) | Plan de trabajo y dependencias |
| **Preguntas de discovery** | v1.0 (respondido) | Decisiones del cliente sobre alcance |

---

**Este cronograma sustituye a v1. Cualquier modificación de alcance posterior a la firma se cotiza por separado y puede afectar las fechas aquí propuestas.**
