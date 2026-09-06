# Identidad de marca y sistema visual (base: MyTicket MX)

> Documento maestro para replicar la estética del portal en cualquier otro sitio, documento o correo.
> En Elements Method esta identidad se aplica al **panel de administración** (`/admin`). El sitio público
> conserva su propia identidad (Cormorant + Jost + paleta elemental) y NO se toca.
>
> Adaptación de marca para el admin: wordmark **"Elements Method"** en dos tonos ("Elements" en tinta,
> "Method" en acento) y sub-marca **"LIDERAZGO · OPERACIÓN"**. Todo lo demás se replica tal cual.

---

## 1. La idea en una frase

**Una hoja de papel bien impresa.** Fondo crema, tinta casi negra, un solo acento verde azulado, y estructura
hecha con líneas finas (hairlines) en vez de cajas y sombras. Los títulos van en una serif editorial, el resto en
Inter. Todo etiquetado en versalitas espaciadas. Esquinas casi vivas (2 px). Nada brilla, nada flota.

Cinco adjetivos que la definen: **editorial, sobria, cálida, precisa, tranquila.**

Lo que NO es: no es "dashboard SaaS" (sin tarjetas flotantes, sin sombras, sin azules, sin pastillas redondas),
no es "oscura" (no hay modo oscuro; el papel es la marca), no es "juguetona" (sin emojis, sin ilustraciones,
sin gradientes).

---

## 2. Referencias visuales de origen

La estética nace en una cotización editorial y se llevó al portal cambiando una sola cosa: los títulos pasaron
de Inter a una serif.

| Elemento   | Documento (cotización)                                                  | Producto (portal / admin)                  |
| ---------- | ----------------------------------------------------------------------- | ------------------------------------------ |
| Fondo      | crema                                                                   | crema `#f4f1eb`                            |
| Titulares  | Inter, peso 600, con las últimas palabras en acento                     | Serif editorial, peso 400–500              |
| Etiquetas  | versalitas espaciadas, gris                                             | idénticas (`.etiqueta`)                    |
| Estructura | hairlines, numerales 01–07 en acento, cajas suaves de acento/alerta     | idéntica                                   |
| Marca      | nombre negro + sufijo gris claro, en Inter                              | nombre tinta + sufijo acento, en serif     |

**Regla:** en documentos (propuestas, PDF, presentaciones) el display es Inter; en producto (portal, sitios,
apps) el display es la serif. El resto del sistema es el mismo.

---

## 3. Color

Toda la paleta es tierra: cremas y grises cálidos con un solo acento frío. Nunca aparece blanco puro ni
negro puro en superficies grandes.

### 3.1 Tokens (hex exactos)

| Token             | Hex         | Uso                                                                               |
| ----------------- | ----------- | --------------------------------------------------------------------------------- |
| `papel`           | `#f4f1eb`   | Fondo de todo. Es la marca.                                                       |
| `tarjeta`         | `#faf8f4`   | Superficie "un paso arriba": tarjetas, tablas, inputs, filtros.                   |
| `sidebar`         | `#efebe3`   | Barra lateral, un paso *abajo* del papel.                                         |
| `nav-activo`      | `#e6e0d6`   | Fondo del enlace de navegación activo.                                            |
| `tinta`           | `#26231f`   | Texto principal, botones primarios, líneas fuertes.                               |
| `tenue`           | `#696359`   | Texto secundario: subtítulos, celdas de apoyo, etiquetas.                         |
| `sutil`           | `#797267`   | Texto terciario: notas, pistas, placeholders, pies.                               |
| `hair`            | `#e2dcd1`   | Hairline estándar: bordes de tarjetas, filas, separadores.                        |
| `hair-fuerte`     | `#c9c0b2`   | Hairline marcada: bordes de inputs, botones secundarios, KPIs.                    |
| `acento`          | `#43625f`   | Verde azulado. Enlaces, foco, sufijo de marca, iconos de prioridad, valores clave.|
| `acento-tinta`    | `#35504d`   | Acento oscuro: hover de botón primario, texto sobre `acento-suave`.               |
| `acento-suave`    | `#e7ece9`   | Fondo de selección, hover de fila, insignias "en proceso", banners informativos.  |
| `ok`              | `#4c6c50`   | Verde: pagado, confirmado, abierta.                                               |
| `ok-suave`        | `#e9eee6`   | Fondo de insignias ok.                                                            |
| `alerta`          | `#916128`   | Ámbar oscuro: pendiente, por confirmar, avisos.                                   |
| `alerta-suave`    | `#f4ecde`   | Fondo de banners y insignias de alerta.                                           |
| `peligro`         | `#963e34`   | Rojo ladrillo: cancelado, expirado, borrar, errores.                              |
| `peligro-suave`   | `#f4e6e2`   | Fondo de zonas de riesgo e insignias de peligro.                                  |

Tonos que solo viven en correo (HTML de email, sin variables):

| Uso                 | Hex         |
| ------------------- | ----------- |
| Tinta de correo     | `#21201d`   |
| Cuerpo de correo    | `#54504a`   |
| Etiquetas de correo | `#6b675f`   |
| Pie y firma         | `#9a958b`   |
| Hairline de correo  | `#e4dfd6`   |

### 3.2 Reglas de color

1. **Un acento.** El verde azulado es el único color "de marca". Nunca dos acentos en una pantalla.
2. **Los semánticos van en pares:** color fuerte para texto y borde, versión `-suave` para fondo. Nunca
   texto blanco sobre `alerta`, `ok` o `peligro`; el texto siempre es el tono fuerte sobre el suave.
3. **Relleno = estado, contorno = categoría.** Una insignia con fondo dice en qué estado va algo
   (Pagado, Capturada). Una insignia con solo borde dice de qué tipo es (Stripe, Transferencia).
4. **Tinta invertida = terminado.** El único uso de fondo `tinta` con texto `papel` fuera de botones es el
   estado final ("Entregada", rol "admin"). Significa "cerrado, no hay nada que hacer".
5. **El foco es acento:** `outline: 3px solid #43625f; outline-offset: 3px`. Los inputs enfocados suman
   `box-shadow: 0 0 0 3px #43625f14` (acento al 8 %).
6. **Sin gradientes, sin transparencias decorativas.** Las únicas alfas: `acento-suave/40` para hover de
   fila, `peligro-suave/30` para selección de borrado, `tinta/45` para el fondo del modal.

---

## 4. Tipografía

### 4.1 Familias

```css
--font-editorial: 'Iowan Old Style', 'Baskerville', 'Palatino Linotype', 'Book Antiqua', Georgia, serif;
--font-sans: 'Inter', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;
```

- **Serif editorial** (display). No se descarga: se usa la pila del sistema, con Iowan Old Style en macOS e
  iOS, Baskerville en el resto, Georgia como red. Es deliberado: un serif "de libro", no de lujo.
- **Inter** (todo lo demás). Cargada con `next/font` (`subsets: ['latin']`) o desde Google Fonts. Con
  `font-feature-settings: 'cv11', 'ss01'` en el `body` (la *a* de un piso y dígitos abiertos).
- `-webkit-font-smoothing: antialiased` en el body.

### 4.2 Escala (px)

| Rol                                            | Familia | Tamaño | Peso    | Tracking                             | Interlínea     |
| ---------------------------------------------- | ------- | ------ | ------- | ------------------------------------ | -------------- |
| Marca (wordmark)                               | serif   | 28     | 500     | −0.055em                             | 1              |
| Título de login (tagline)                      | serif   | 40     | 400     | −0.04em                              | 1.1            |
| H1 de página                                   | serif   | 36     | 500     | −0.035em                             | 1.1            |
| H1 de ficha (folio, obra)                      | serif   | 38     | 400     | −0.035em                             | 1              |
| Cifra grande (KPI)                             | serif   | 34     | 500     | −0.03em, `tabular-nums`              | 1.1            |
| Total de ficha                                 | serif   | 32     | 400     | `tabular-nums`                       | 1.1            |
| Título de boleto / renglón destacado           | serif   | 25     | 400     | —                                    | 1.2            |
| Título de paso (formulario guiado)             | serif   | 23     | 400     | —                                    | 1.2            |
| Título de paso plegable                        | serif   | 21     | 400     | —                                    | 1.2            |
| Número de paso ("01")                          | serif   | 20     | 400     | —                                    | color `sutil`  |
| Cuerpo                                         | Inter   | 14     | 400     | —                                    | 1.65 en `<p>`  |
| Cuerpo denso (tablas, nav, subtítulos)         | Inter   | 13     | 400     | —                                    | 1.5            |
| Auxiliar (pistas, notas, insignias)            | Inter   | 12     | 400/500 | —                                    | 1.5            |
| Encabezado de tabla                            | Inter   | 11     | 600     | —                                    | 1              |
| Nota de KPI, pie de página                     | Inter   | 11     | 400     | —                                    | 1.5            |
| **Etiqueta** (`.etiqueta`)                     | Inter   | 10     | 500     | +0.10em, MAYÚSCULAS                  | 1.5            |
| Etiqueta de sección (`h2.etiqueta`)            | Inter   | 11     | 500     | +0.10em, MAYÚSCULAS, color `tinta`   | 1.5            |
| Título de grupo de nav                         | Inter   | 10     | 600     | +0.11em, MAYÚSCULAS                  | 1              |
| Sub-marca ("LIDERAZGO · OPERACIÓN")            | Inter   | 9      | 400     | +0.16em, MAYÚSCULAS                  | 1              |

Móvil (≤767 px): H1 30, cifra 26, marca 23 (≤480), inputs a 16 px para evitar el zoom de iOS.

### 4.3 Reglas tipográficas

- **Pesos permitidos: 400, 500, 600.** El 700 solo existe en el wordmark de correo. Nunca 800/900.
- **Display en serif con tracking negativo; etiquetas en Inter con tracking positivo.** Ese contraste
  (apretado arriba, aireado abajo) es la firma tipográfica.
- **Ninguna sección empieza con un título bold en sans.** Empieza con una etiqueta en versalitas
  (`ÓRDENES POR ATENDER`, `CLIENTE`, `ACCIÓN PENDIENTE`).
- **Números siempre `tabular-nums`** cuando hay más de uno alineado (tablas, cifras, totales).
- **`text-wrap: balance`** en h1, h2, h3.
- Los títulos de página son sustantivos cortos ("Órdenes", "Catálogo", "Resumen del día"); los de paso
  son preguntas en segunda persona ("¿Cómo se llama el retiro?").

---

## 5. Forma, línea y espacio

### 5.1 Radio

**2 px en todo.** Los cuatro tokens de radio (`sm`, `md`, `lg`, `xl`) valen 2 px, así que hasta las clases
`rounded-xl` heredadas rinden casi vivas. Únicas excepciones: círculos (avatar 34 px, numerales de
checklist 24 px, numerales de receta 20 px, spinner).

### 5.2 Hairlines: la estructura son líneas, no cajas

| Dónde                                    | Línea                                                                       |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| Debajo del encabezado de página          | `1px solid tinta` (la única línea negra por página)                         |
| Debajo del encabezado de ficha           | `1px solid tinta`                                                           |
| Separadores de sección y filas de tabla  | `1px solid hair`                                                            |
| Arriba de cada KPI (`.cifra`)            | `1px solid hair-fuerte` (sin caja, sin fondo)                               |
| Columna de trabajo en una ficha          | `border-left: 1px solid hair-fuerte; padding-left: 28px`                    |
| Paso plegable                            | `border-top: 1px solid hair-fuerte`; abierto → `acento`                     |
| Estado vacío                             | `1px dashed hair-fuerte`                                                    |
| Renglón destacado (boleto)               | `1px solid hair-fuerte` + `border-left: 3px solid acento`                   |
| Nav activo                               | `box-shadow: inset 2px 0 acento` (barra izquierda de 2 px)                  |
| Modal                                    | barra superior de 2 px (`tinta`, o `peligro` si la acción es de riesgo)     |
| Error / No existe                        | `border-top: 2px solid peligro` / `tinta`                                   |
| Hoja de login                            | `border-top: 2px solid tinta; border-bottom: 1px solid tinta`               |
| Formulario de alta (catálogo)            | `1px dashed hair-fuerte` con padding 20                                     |

**Cuándo sí hay caja (`.tarjeta`)**: cuando el contenido es un grupo funcional aparte (formulario lateral,
panel de secciones, tarjeta de sistema). `border: 1px solid hair; background: tarjeta; padding: 22px`.
Nunca sombra, nunca fondo blanco.

### 5.3 Sombras

Una sola en todo el sistema, la del modal: `0 24px 60px -24px rgba(33,32,29,.45)`, con fondo
`tinta` al 45 % y `backdrop-filter: blur(3px)`.

### 5.4 Escala de espacio

| Medida                      | Valor                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------- |
| Ancho de sidebar            | 204 px (194 entre 768 y 1100)                                                      |
| Contenido: padding          | 26 / 36 / 36 px (top / lados / bottom); ≥1600: 40 / 48 / 56; móvil: 24 / 16 / 36   |
| Ancho máximo de contenido   | 1560 px                                                                            |
| Barra superior              | min-height 60, padding 12 × 36                                                     |
| Encabezado de página        | margin-bottom 24, padding-bottom 18                                                |
| Separación entre secciones  | 32 / 40 / 48 px                                                                    |
| Gap de grids                | 12–20 px                                                                           |
| Tarjeta                     | padding 22 (16 en paneles laterales)                                               |
| Tabla                       | th 13 × 16; td 15 × 16; móvil 12                                                   |
| Filtros (pestañas)          | gap 6, min-height 36, padding 7 × 12                                               |
| Botones                     | min-height 40, padding 8 × 16                                                      |
| Inputs                      | min-height 42, padding 10 × 12                                                     |
| Enlaces de nav              | min-height 44, padding 10 × 12, gap 11                                             |
| Formulario guiado           | max-width 850 a una columna; a ≥1150 px, dos columnas de 1200 px, gap 24 × 40      |
| Ficha (orden)               | columnas `1.6fr / minmax(300px, 1fr)`, gap 32, padding vertical 26                 |
| Login                       | hoja de 440 px, padding 30 × 8 × 24                                                |

Ancho completo: el contenido ocupa toda la pantalla (no hay `max-w-6xl`). La densidad se logra con
espacio vertical, no con columnas estrechas.

---

## 6. Componentes

### 6.1 Marca (lockup)

```
Elements Method        ← serif 28/500/−0.055em; "Method" en acento
LIDERAZGO · OPERACIÓN  ← Inter 9/400/+0.16em, tenue, 5 px debajo
```

- El wordmark siempre es **dos tonos**: la primera palabra en tinta, la segunda en acento. Nunca ambas del
  mismo color.
- La sub-marca describe el producto y cambia por proyecto. Siempre versalitas con punto medio.
- No hay isotipo en la interfaz. Si hace falta un ícono (favicon, avatar), es un cuadro de 38 px con radio
  2 px, fondo acento y la inicial en papel (`.marca-icono`).

### 6.2 Etiqueta (`.etiqueta`)

El componente más repetido. 10 px, 500, mayúsculas, +0.10em, color tenue. Se usa para: nombre de campo,
encabezado de sección (variante 11 px tinta), rótulo de KPI, título del modal, "PARA:", "ANTES DE
CONFIRMAR". Regla: **si dudas cómo titular un bloque, es una etiqueta.**

### 6.3 Encabezado de página

```
[H1 serif 36]                                  [acciones: botón primario, secundario]
[subtítulo 13 px tenue, max 720 px]
──────────────────────────── 1px tinta ────────────────────────────
```

En fichas (orden, retiro): el H1 crece a 38/400, a su lado una insignia de contorno, debajo una línea
meta de 12 px, y a la derecha el total en serif 32 con etiqueta arriba.

### 6.4 Botones

| Tono       | Estilo                                        | Hover               |
| ---------- | --------------------------------------------- | ------------------- |
| Primario   | fondo tinta, texto papel                      | fondo acento-tinta  |
| Secundario | borde hair-fuerte, fondo tarjeta, texto tinta | borde tinta         |
| Peligro    | borde peligro, texto peligro, sin fondo       | fondo peligro-suave |
| Texto      | texto acento, sin caja                        | subrayado           |

Base: `inline-flex; gap 8px; min-height 40; padding 8 16; border-radius 2; font 14/500; transition-colors`.
Deshabilitado: `opacity .45; cursor not-allowed`. **Mientras corre:** se desactiva, muestra un spinner de
14 px (borde de 2 px, color actual, cuarto transparente) y cambia su texto por el de espera
("Enviando el correo…"). Nunca `window.confirm`: toda confirmación abre el modal.

Copy: el botón nombra la acción con su objeto ("Avisar por correo", "Crear retiro y publicarlo").
El de confirmación repite la decisión ("Sí, cancelar el pago"). El de creación lleva "+" ("+ Nuevo retiro").

### 6.5 Insignias

`display inline-block; padding 2 8; radius 2; font 12/500; white-space nowrap`.

| Estado de pago      | Estilo                      |
| ------------------- | --------------------------- |
| Pagado              | ok-suave / ok               |
| Pendiente de pago   | alerta-suave / alerta       |
| Comprobante enviado | acento-suave / acento-tinta |
| Cancelado           | hair / tenue                |
| Expirado            | peligro-suave / peligro     |

| Estado operativo      | Estilo                      |
| --------------------- | --------------------------- |
| Capturada             | hair / tenue                |
| En proceso            | alerta-suave / alerta       |
| Asignada              | acento-suave / acento-tinta |
| Confirmada            | ok-suave / ok               |
| Entregada / cerrada   | tinta / papel (invertida)   |

Origen / categoría (Stripe, Transferencia, Manual, Encuesta): solo borde hair-fuerte, texto tenue.
Contador (pendientes): fondo acento, texto papel.

La lógica cromática del ciclo: gris → ámbar → verde-azul → verde → negro. "Lo que falta" siempre es ámbar.

### 6.6 Cifra (KPI)

```
──────── 1px hair-fuerte ────────
ETIQUETA                    →      ← si es enlace, flecha a la derecha en sutil
34                                 ← serif 34/500, tabular; tono ok/alerta/peligro si aplica
Nota de 11 px en sutil
```

Sin caja. Cuatro en fila a ≥1280, dos en fila abajo. Si es enlace, en hover la línea superior se vuelve
acento.

### 6.7 Tabla

- Envoltorio con `border: 1px solid hair; radius 2`. Fondo `tarjeta`.
- `th`: fondo papel, 11/600 tenue, alineado a la izquierda (a la derecha para números).
- `td`: 13 px, padding 15 × 16, hairline inferior; la última fila sin línea.
- Hover de fila: fondo `acento-suave` (o al 40 %). Toda la fila es clicable con un enlace estirado
  (`after:absolute after:inset-0`).
- Segunda línea en una celda (correo bajo el nombre): 12 px sutil.
- Números a la derecha y `tabular-nums`. Estado de venta como texto de 12 px coloreado ("abierta" ok,
  "cerrada" tenue, "parcial" alerta), no como insignia.
- En móvil la tabla se vuelve tarjetas: folio en acento 12/600, total 14/600, nombre, insignias, y una
  hairline con origen y fecha.

### 6.8 Formularios

- **Campo** = etiqueta arriba (`.etiqueta`, margen 4) + control. **Pista** debajo: 12 px sutil, interlínea relajada.
- Input/select/textarea: `border 1px hair-fuerte; background tarjeta; padding 10 12; font 14; radius 2`.
  Foco: borde acento + anillo de 3 px acento al 8 %. Placeholder en sutil, sin opacidad reducida.
- **Opción-tarjeta (radio con explicación)**: `label` con borde hair y fondo papel, padding 10 × 12;
  título 14/500 y explicación 12 tenue; con `:has(:checked)` → borde acento y fondo acento-suave al 40 %.
- **Chips seleccionables**: borde hair-fuerte y texto tenue; seleccionado → fondo tinta, texto papel.
- **Formulario guiado**: pasos numerados "01", "02" en serif 20 sutil + pregunta en serif 23, hairline
  debajo; a la izquierda los inputs, a la derecha (en pantallas anchas) el siguiente paso. Cierra con
  la etiqueta `ANTES DE CONFIRMAR`, un párrafo que dice exactamente qué va a pasar y el botón primario.
- **Filas dinámicas**: tres columnas `1.4fr 1fr 1fr`, encabezados en etiqueta, "+ Agregar" como enlace de
  12 px en acento.

### 6.9 Filtros y pestañas (`.filtro-enlace`)

Botones de 36 px con borde hair, fondo tarjeta, 12 px tenue; activo → borde y texto acento, fondo
acento-suave, peso 600. El conteo va al final en 12 px al 60 %. Gap de 6 px. Nunca subrayado tipo tab.

### 6.10 Estados vacíos (`.estado-vacio`)

Caja punteada (hair-fuerte), fondo tarjeta, centrado, padding 24. Título 14/500 con punto final
("Hoy no hay retiros programados."), explicación 14 tenue de máximo 448 px, y una acción secundaria.
Siempre dice qué es, por qué está vacío y qué hacer.

### 6.11 Banners

`border 1px + fondo suave + texto fuerte` del mismo tono, padding 12 × 16, 14 px:

- informativo/resultado: acento
- aviso: alerta ("Los datos bancarios no están configurados…")
- error inline (login): `border-left: 2px peligro` + fondo peligro-suave
  Sin iconos gráficos: solo glifos de texto (⚠ ✉ ✓ ✎ ↗ →).

### 6.12 Modal

`<dialog>` nativo, 34 rem máximo, borde hair-fuerte, fondo papel, barra superior de 2 px (tinta o peligro),
padding 24 × 20 × 24. Título en `.etiqueta` (en peligro si aplica), primer párrafo en tinta y el resto en
tenue, hairline y botonera alineada a la derecha: "Cancelar" (secundario) y la acción (primario o peligro).
Entra en 160 ms con 6 px de desplazamiento y escala .99. Foco inicial en "Cancelar".

### 6.13 Navegación

- **Sidebar** 204 px, fondo `#efebe3`, hairline derecha, sticky, alto 100dvh.
- Arriba: marca (padding 30 20 26), después el botón negro de acción principal (44 px, 13/600, con "+").
- Grupos con título en versalitas (`OPERACIÓN`, `CATÁLOGO`, `CONTENIDO`, `AJUSTES`); enlaces 13 px tenue,
  hover fondo papel + acento-tinta; activo fondo `#e6e0d6`, 600, barra izquierda de 2 px acento.
- Abajo, pegado: usuario con avatar circular de 34 px (borde hair, fondo papel, inicial en acento) y
  botón de salir solo con icono.
- **Barra superior**: miga de pan "Inicio / Sección / Detalle" (13 px, sección activa en tinta 500) y
  búsqueda global de 350 px (borde hair, fondo papel, 12 px).
- **Pie**: 11 px sutil, dos extremos ("Elements Method · Operación" / "Horarios de Ciudad de México").
- Móvil: la sidebar se vuelve cabecera; la nav vive en un `<details>` "Menú".

### 6.14 Iconos

Set propio de trazos en `viewBox 0 0 24 24`, `stroke 1.7`, extremos y uniones redondos, sin relleno,
20 px por defecto (17 en la búsqueda, 15–16 junto a texto). Se usan poco: prioridades del día, búsqueda,
flechas de KPI y salir. **La flecha "→" en texto es el afordance principal de "ir a".** Los botones no
llevan icono, salvo el "+". No se usan librerías de iconos (nada de lucide) en el admin.

### 6.15 Carga y espera

- **Armazón** (`loading.tsx`): barras `bg-hair` (y `hair/60`, `hair/70`) con `animate-pulse`, mismo
  esqueleto que la página (encabezado + 4 cifras + tabla). Aparece en menos de 90 ms.
- **Girito**: spinner de 14 px, borde 2 px, `border-right-color: transparent`, opacidad 70 %.
- **Enlaces** muestran el girito de 12 px mientras navegan.

---

## 7. Movimiento

Casi nulo y siempre funcional.

| Qué                            | Duración / curva                                                                    |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| Cambios de color (hover, foco) | 150 ms                                                                              |
| Entrada de modal               | 160 ms ease-out, `translateY(6px) scale(.99)` → identidad; fondo aparece en 160 ms  |
| Chevron de paso plegable       | rota 90° al abrir (sin transición)                                                  |
| Esqueleto                      | `animate-pulse`                                                                     |
| Spinner                        | `animate-spin`                                                                      |

`prefers-reduced-motion: reduce` apaga todo (animaciones, transiciones y scroll suave).

---

## 8. Voz y redacción

Español de México, de tú, en el idioma del oficio (retiro, sede, cupo, folio, orden, comprobante,
cotización, inscripción). Se escribe como habla una persona que sabe operar el negocio, no como un sistema.

### 8.1 Reglas

1. **Explica antes del botón.** Cada acción importante lleva una o dos frases de qué va a pasar.
2. **Los títulos de página son sustantivos; los pasos, preguntas.** "Órdenes" / "¿Quién compra?".
3. **Los estados vacíos son frases completas con punto.** "Nada pendiente por validar."
4. **Los estados se nombran en participio o sustantivo, en singular femenino (la orden):**
   Pendiente de pago, Comprobante enviado, Pagada, Cancelada, Reembolsada.
5. **Las esperas terminan en puntos suspensivos y describen el trabajo:** "Guardando el retiro…".
6. **Las confirmaciones dicen la consecuencia real:** "La orden queda pagada y el comprador recibe su
   comprobante por correo."
7. **Las cifras nunca van solas:** cada KPI lleva una nota que dice qué cuenta.
8. **Nada de "clic aquí", "submit", "OK", "éxito".** Sí: "Guardar", "Entrar al panel".
9. **Errores sin culpa y con salida:** "Algo falló" / "No pudimos completar la solicitud. Vuelve a
   cargar esta página…".
10. **Frase de marca (login):** "La naturaleza no gestiona. La naturaleza lidera."

### 8.2 Signos y glifos

| Signo                    | Uso                                                                       |
| ------------------------ | ------------------------------------------------------------------------- |
| `·` (punto medio)        | separador de datos en una línea: "23 ago · 19:00 · Tepoztlán"             |
| `—` (raya)               | incisos y firma: "— Elements Method"                                      |
| `« »`                    | citar nombres de estados o botones: pasan a «pagada»                      |
| `→`                      | "ir a", al final del texto de un enlace: "Ver todas →"                    |
| `←`                      | volver, al inicio: "← Órdenes"                                            |
| `✓` `✉` `⚠` `✎` `↗`      | hecho, correo enviado, aviso, tiene notas, abre en otra pestaña           |
| `+`                      | crear: "+ Nuevo retiro"                                                   |

Emojis: prohibidos en la interfaz.

### 8.3 Formatos (es-MX, zona America/Mexico_City)

| Dato                           | Formato                                                     | Ejemplo                  |
| ------------------------------ | ----------------------------------------------------------- | ------------------------ |
| Dinero                         | `Intl es-MX MXN`, sin centavos si son cero                  | `$3,560`, `$899.95`      |
| Fecha corta                    | día + mes abreviado                                         | `4 sep`                  |
| Fecha larga                    | día de la semana + día + mes                                | `sábado 29 de agosto`    |
| Fecha y hora                   | `4 sep, 23:16` (24 h)                                       |                          |
| Hora                           | `19:00`                                                     |                          |
| Fecha completa (encabezado)    | `sábado, 5 de septiembre de 2026`                           |                          |
| Folios                         | `EM-0926-0001` (orden) / `EMQ-…` (cotización)               |                          |

---

## 9. Patrones de página

### 9.1 Resumen (Hoy)

Encabezado con la fecha completa como subtítulo → 4 cifras → etiqueta "TU SIGUIENTE PASO" con dos o tres
prioridades (icono en cuadro acento-suave + título 14/600 + detalle 12 + flecha) → banners de alerta →
"ÓRDENES POR ATENDER" tabla con "Ver todas →" → "PRÓXIMOS RETIROS". Si el catálogo está vacío, arriba
una tarjeta "Primeros pasos" con checklist numerada (círculo negro = siguiente, verde ✓ = hecho).

### 9.2 Lista (Órdenes, Retiros)

Encabezado + acción → panel de filtros sin caja (solo hairline inferior) o pestañas → línea de conteo
("**6** órdenes encontradas" con el número en 600 tinta) → tabla → paginación de texto
("← Anteriores · Página 1 de 1 · Siguientes →").

### 9.3 Ficha (Orden)

Hoja de taquilla: "← Órdenes" → folio gigante + insignia + meta / total a la derecha → línea de estado
→ dos columnas: datos a la izquierda (productos con borde acento, comprador en tres columnas de
etiqueta/valor), trabajo a la derecha separado por hairline vertical ("ACCIÓN PENDIENTE" con el botón
adentro, luego "PAGO") → abajo, bajo línea negra, `<details>` de consulta ("Historial", "Documentos",
"Cambiar estado") con "+/−" en acento.

### 9.4 Ficha (Retiro)

Etiqueta con la sede → H1 con el tema → fecha en 18 px tenue → 4 cifras → dos columnas: pasos
plegables (solo el actual abierto) y a la derecha tarjetas de Sede, Cupo, Fecha y Ficha técnica, con lo
editable siempre plegado.

### 9.5 Formulario guiado (Nuevo retiro)

Pasos 01–05 en dos columnas, pistas bajo cada control, cierre "ANTES DE CONFIRMAR".

### 9.6 Ayuda

Etiquetas de sección → tarjetas numeradas de conceptos → tabla de estados → "Recetas" en tarjetas con
pasos en círculos → glosario `<dl>` en dos columnas.

### 9.7 Login

Hoja centrada de 440 px con línea negra arriba (2 px) y abajo (1 px): marca a la izquierda y
sub-marca a la derecha en la misma línea base → tagline serif 40 → campo de correo → botón primario a todo
lo ancho → nota de acceso en 12 px tenue.

### 9.8 Error y No existe

Bloque centrado de 36 rem con línea superior de 2 px, etiqueta como título ("ALGO FALLÓ" en peligro,
"NO EXISTE" en tinta), frase 18/600, explicación 14 tenue, código en `font-mono 12` dentro de una caja
hair, y dos botones.

---

## 10. Correo (HTML)

Sin serif (fuentes de sistema), sin imágenes, una sola columna.

```
fondo #f4f1eb · contenedor 560 px (680 si lleva tabla) · padding 32 20
cabecera: "Elements" 16/700 #21201d + " Method" #9a958b · border-bottom 1px #21201d · margen abajo 28
eyebrow: 12 px, mayúsculas, +0.08em, #6b675f       ("NUEVA ORDEN", "COMPROBANTE")
h1: 22/600 #21201d, interlínea 1.3
párrafo: 15 px #54504a, interlínea 1.6
tabla de datos: hairlines arriba y abajo #e4dfd6; etiqueta 12 px mayúsculas #6b675f a la izquierda,
                valor 15 px #21201d; el dato clave en 700 y #43625f
tabla de lista: th 11 px mayúsculas #6b675f con línea inferior #21201d; td 13 px con hairline #e4dfd6
pie: 12 px #9a958b, hairline superior, "Elements Method · {asunto}"
firma: "— Elements Method" (+ " · quien lo envió")
```

Asuntos con punto medio. Versión texto plano siempre incluida, con *asteriscos* para énfasis.

---

## 11. Accesibilidad (parte de la marca, no un extra)

- Foco visible en acento (3 px, offset 3 px) en todo; las `label` que contienen un input enfocado también
  se enmarcan.
- Enlace "Saltar al contenido" (negro sobre papel, aparece solo con foco).
- `aria-current="page"` en nav y pestañas; `aria-label` en botones solo con icono; `aria-busy` mientras
  corre una acción; `aria-pressed` en chips.
- Objetivos táctiles de 44 px (nav, botón principal) y 40 px (botones, resúmenes de `<details>`).
- `<dialog>`, `<details>`, `<table>`, `<dl>` nativos: todo funciona sin JavaScript.
- Contraste: tenue sobre papel 5.9:1, sutil sobre papel 4.6:1, acento sobre papel 6.3:1 (todos AA en
  texto normal).

---

## 12. Lo que la marca no hace (anti-patrones)

1. Sombras en tarjetas, botones o inputs.
2. Radios mayores a 2 px (salvo círculos).
3. Blanco `#fff` o negro `#000` como fondo o texto (se usa papel y tinta).
4. Azul de enlace, azul de foco, azul de nada.
5. Colores saturados; toda la paleta está desaturada y cálida.
6. Iconos en botones, iconos decorativos, ilustraciones, fotos de stock.
7. Títulos en negrita sans; los títulos son serif o etiquetas.
8. Toasts flotantes; los resultados se dicen en un banner en la página.
9. `window.confirm` / `alert`; siempre el modal de la casa.
10. Botones que se pueden pulsar dos veces; todo control se desactiva y lo dice mientras corre.
11. Texto en mayúsculas sin tracking; si va en mayúsculas, va espaciado.
12. Modo oscuro. El papel es la marca.

---

## 13. Cómo replicarla en otro sitio (checklist)

1. Copia la hoja de tokens (o el bloque de variables) y carga Inter.
2. Pon `background: papel; color: tinta` en el contenedor raíz con `font-feature-settings: 'cv11','ss01'`
   y antialiasing.
3. Cambia el wordmark y la sub-marca; conserva los dos tonos.
4. Estructura cada página como: encabezado (serif + subtítulo + línea negra) → etiquetas de sección →
   contenido con hairlines. Cero cajas hasta que un bloque lo pida.
5. Todo rótulo de campo, sección o KPI es `.etiqueta`.
6. Botones con los tres tonos, 40 px, radio 2, con estado "corriendo".
7. Insignias: relleno para estado, contorno para categoría, invertida para "terminado".
8. Tablas con envoltorio hair, th en papel, hover acento-suave, fila entera clicable.
9. Estados vacíos punteados con título, explicación y acción.
10. Copy: explica antes del botón, estados con nombre humano, esperas con "…", flechas → en enlaces.
11. Correo con el cascarón de la sección 10.
12. Revisa foco, `aria-current`, 44 px táctiles y `prefers-reduced-motion` antes de publicar.
