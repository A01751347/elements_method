# Elements Method — Resumen de últimos cambios

**Fecha:** 12 de agosto de 2026
**Producción:** https://elements-method.vercel.app/
**Estado:** cambios listos en el repositorio, pendientes de commit + deploy. Al publicarse, todos los links de abajo quedan activos en producción.

---

## ⭐ Lo más reciente: Encuestas → Testimoniales → Página principal

El flujo estrella de esta entrega. Los testimoniales ya no se capturan a mano: nacen de las encuestas que responden los participantes y tú solo decides cuáles se publican.

**Cómo funciona, de punta a punta:**

1. **Creas el formulario que quieras** en `/admin/formularios` con el nuevo constructor de cuestionarios: agregas, reordenas y eliminas preguntas; cada una con su tipo (texto corto/largo, opción única/múltiple, escala, NPS 0–10, fecha, email, número, rating), texto en español e inglés, y si es obligatoria.
2. **Marcas una pregunta de texto como "✨ Testimonial"** — por ejemplo: *"Una frase que resume tu experiencia"*. El sistema te sugiere agregar la pregunta de autorización ("Sí con mi nombre / Sí anónimo / No") para respetar el consentimiento del participante.
3. **Envías la encuesta** desde el admin: cada participante recibe un enlace personal de un solo uso (`/es/encuesta/[token]`).
4. **El participante responde.** Si escribió su frase testimonial y autorizó publicarla, esta llega automáticamente a `/admin/testimoniales` como **pendiente** (si eligió "anónimo", se guarda sin su nombre; si eligió "No", no se crea nada).
5. **Tú apruebas.** En el admin ves la frase completa, su origen (Encuesta o Manual) y con un clic en **"Aceptar y publicar"** aparece directo en el carrusel de la página principal (español e inglés). También puedes rechazarla o despublicarla después sin perderla.

**Dónde probarlo:**

| Paso | Link |
|---|---|
| Crear formulario | https://elements-method.vercel.app/admin/formularios/nuevo |
| Lista y envío de encuestas | https://elements-method.vercel.app/admin/formularios |
| Moderar testimoniales | https://elements-method.vercel.app/admin/testimoniales |
| Ver resultado (carrusel) | https://elements-method.vercel.app/es |

---

## Todo lo demás incluido en esta entrega

### 1. Sitio público conectado a base de datos real (Neon)
Todo el contenido dejó de estar "hardcodeado": página principal, retiros, caminos, empresas, blog, quiénes somos, contacto y footer leen de la base de datos, con textos administrables. Lo que edites en el admin se refleja en el sitio.

- Home: https://elements-method.vercel.app/es
- Retiros: https://elements-method.vercel.app/es/retiros
- Los caminos: https://elements-method.vercel.app/es/los-caminos
- Empresas: https://elements-method.vercel.app/es/empresas

### 2. Panel de administración con CRUD completo
Antes varias secciones eran solo lectura; ahora puedes **crear y editar** desde el admin:

- **Retiros** (crear/editar fechas, precios, cupos) — `/admin/retiros`
- **Productos y precios** — `/admin/productos`
- **Locaciones** — `/admin/locaciones`
- **Proveedores** — `/admin/proveedores`
- **Logos de clientes** — `/admin/logos`
- **Testimoniales** (aprobar/publicar/crear manual) — `/admin/testimoniales`
- **Formularios/encuestas** (crear/editar preguntas) — `/admin/formularios`
- **Blog** (crear/editar entradas) — `/admin/blog`
- **Inscripciones, pagos y transferencias** (gestión y conciliación) — `/admin/inscripciones`, `/admin/pagos`, `/admin/transferencias`
- **Comentarios** (moderación) — `/admin/comentarios`
- **Dashboard real** con métricas desde la base de datos — `/admin`

### 3. Blog / Journal completo
Entradas individuales con página propia, versión bilingüe (`/es/blog/[slug]` · `/en/journal/[slug]`), sección de comentarios moderados y feed RSS.

- Blog: https://elements-method.vercel.app/es/blog
- RSS: https://elements-method.vercel.app/es/blog/rss.xml

### 4. Cotizador para empresas
Calculadora interactiva de cotización para retiros corporativos: número de personas, duración, opciones — genera precio al momento y envía la solicitud (con PDF de cotización por correo).

- Español: https://elements-method.vercel.app/es/empresas/cotizar
- Inglés: https://elements-method.vercel.app/en/companies/cotizar

### 5. Motor de PDFs
- **Comprobantes de pago** generados automáticamente tras cada compra (`/api/comprobante`).
- **Documentos legales** (acuerdos, formatos) con descarga controlada (`/api/documento`).
- **Cotizaciones empresariales** en PDF.

### 6. Pagos y checkout
Mejoras al flujo de Stripe (checkout + webhook): registro de compradores, tracking de conversión de compra y comprobante automático. Pago por transferencia con conciliación manual en el admin.

### 7. Analytics y marketing
Panel `/admin/analytics` para configurar Meta Pixel, Google Analytics 4, Google Ads, LinkedIn y GTM **sin tocar código**, con eventos de conversión conectados (inscripción, compra, cotización).

### 8. SEO y legal
- `robots.txt` y `sitemap.xml` automáticos.
- Páginas de **privacidad** en español e inglés: https://elements-method.vercel.app/es/privacidad · https://elements-method.vercel.app/en/privacy
- Banner de cookies con consentimiento.

### 9. Exportación de datos
Respuestas de cualquier encuesta exportables a **CSV** desde el detalle del formulario en el admin.

---

## Guion sugerido para la demo con el cliente

1. Entrar a `/admin/formularios/nuevo` → crear una encuesta "Cierre Retiro Demo" con 3 preguntas, una marcada como Testimonial + la de autorización.
2. Enviarla a un correo propio desde "Enviar" → abrir el enlace personal y responder.
3. Ir a `/admin/testimoniales` → mostrar la frase pendiente → "Aceptar y publicar".
4. Abrir https://elements-method.vercel.app/es → la frase aparece en el carrusel de testimoniales.
5. Cerrar con el cotizador de empresas y el dashboard del admin.

> **Nota:** el acceso a `/admin` requiere sesión de administrador. Los cambios de contenido en el sitio público se reflejan de inmediato (revalidación automática, máximo 60 segundos en la home).
