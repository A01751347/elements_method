# Derechos ARCO — flujo completo

Cómo un titular ejerce sus derechos de Acceso, Rectificación, Cancelación y Oposición
(y la revocación del consentimiento) y cómo los atiende el equipo. Marco legal: LFPDPPP.
Actualizado: 6 de septiembre de 2026.

## Sitio público

| Dónde | Qué hay |
| --- | --- |
| `/es/privacidad/arco` · `/en/privacy/arco` | Página con los cinco botones (A · R · C · O · +), explicación del proceso y formulario. `?derecho=acceso` preselecciona un derecho. |
| Aviso de privacidad, sección 5 | Los mismos cinco botones enlazan a la página con el derecho preseleccionado. |
| Footer → Legal | Enlace «Derechos ARCO». |
| `POST /api/arco` | Recibe la solicitud, guarda la fila, avisa al equipo y manda el acuse al titular. |

Al enviar, el titular recibe en pantalla y por correo: **folio** (`ARCO-AAMMDD-XXXXX`), **fecha
límite de respuesta** (20 días hábiles) y la instrucción de responder al correo con su
identificación oficial.

Si la base de datos no responde, la solicitud no se pierde: el correo al equipo sale igual con
todos los datos y el titular recibe su acuse (`stored: false` en la respuesta de la API).

## Admin

`/admin/arco` (grupo Operación, con contador de abiertas en la nav):

- Lista con filtros por estado y derecho, búsqueda por folio/nombre/correo, y cifras de
  abiertas, por vencer (≤ 5 días hábiles), vencidas y cerradas.
- Ficha `/admin/arco/[id]`:
  - **Seguimiento**: estado + notas internas (bitácora ante la autoridad).
  - **Identidad**: «Pedir identificación» manda el requerimiento por correo y suspende el plazo;
    «Marcar identidad acreditada» pasa la solicitud a «en proceso».
  - **Responder al titular**: sentido (procedente / improcedente) + texto. Se envía por correo y
    cierra la solicitud; si procede, calcula la fecha límite para hacerla efectiva (15 d.h.).
- El resumen de `/admin` muestra las abiertas como prioridad urgente y la búsqueda global
  encuentra folios ARCO.

Estados: `nueva` → `identidad_pendiente` → `en_proceso` → `resuelta` | `rechazada`.

## Plazos (días hábiles, festivos LFT art. 74 excluidos)

| Plazo | Días | Quién |
| --- | --- | --- |
| Responder al titular | 20 desde la recepción | Elements Method |
| Hacer efectiva la respuesta | 15 desde la respuesta | Elements Method |
| Requerir información / identificación | 5 desde la recepción | Elements Method |
| Entregar lo requerido | 10 desde el requerimiento (suspende el plazo de 20) | Titular |

El cálculo vive en `src/data/arco.ts` (`addBusinessDays`, `businessDaysUntil`).

## Puesta en marcha

1. Crear la tabla: `pnpm db:arco` (crea únicamente `arco_requests`, definida en
   `src/shared/db/schema/privacy.ts`, con `CREATE TABLE IF NOT EXISTS`; no toca nada más).
   `pnpm db:push` también la crearía, pero sincroniza todo el esquema. **Nunca** usar
   `pnpm db:seed` para esto: vuelve a insertar productos, sedes, proveedores y contenido.
2. Correos: usan `RESEND_API_KEY`, `RESEND_FROM_TRANSACTIONAL` y `OPS_EMAIL` ya existentes. Sin
   API key se registran en consola (dry-run).
3. El correo público de contacto que aparece en la página sale de Ajustes → Contacto
   («Correo general»); si está vacío, `hola@elementsmethod.com`.

## Archivos

- `src/data/arco.ts` — derechos, etiquetas ES/EN, estados, plazos, folio.
- `src/shared/db/schema/privacy.ts` — tabla `arco_requests`.
- `src/app/api/arco/route.ts` — API pública.
- `src/shared/integrations/arcoEmails.ts` — acuse, aviso interno, requerimiento de identidad, respuesta.
- `src/components/forms/ArcoRequestForm.tsx` — formulario con los botones.
- `src/components/legal/ArcoRightLinks.tsx` — botones dentro del aviso de privacidad.
- `src/app/[locale]/privacidad/arco/page.tsx` — página pública (+ alias `privacy/arco`).
- `src/app/admin/arco/` — lista, ficha y acciones.
