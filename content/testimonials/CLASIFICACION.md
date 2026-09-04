# Clasificación de las recomendaciones de LinkedIn (26 recibidas)

Criterio: un testimonio sirve a la página si habla del **proceso de coaching,
mentoría o retiro** y de un **cambio concreto** en quien lo escribe. Lo demás son
referencias de su carrera corporativa: sirven como prueba de trayectoria en
/quienes-somos, pero no como testimonio del método.

## Publicados (7)

Orden del carrusel = fecha real de la recomendación, más reciente primero.

| Fecha | Autor | Rol | Dónde | Por qué entra |
|-------|-------|-----|-------|---------------|
| 2026-03-26 | **Sameer Sawaqed** | Director / Investor, Freedom Family Office & Wealthrive | home + empresas | El mejor del lote: coach facilitadora de **YPO**, nombra un **retiro** (Scottsdale) como punto de quiebre y describe el método (la pregunta correcta en el momento correcto). |
| 2025-12-13 | **Victor Ernesto M.** | Supply Chain Head, Medical Devices | home | Zona de confort, reto, cambio de perspectiva sobre sus propias capacidades. En español y de un ejecutivo en funciones. |
| 2025-06-28 | **Ricardo Alvarez** | Technology Consultant | home + empresas | Mentoría desde el rol de jefa: "vio en mí cosas que yo todavía no podía ver". Habla de desarrollo de talento, que es el argumento B2B. |
| 2025-05-14 | **Leonardo Nava** | Dirección de Inteligencia de Negocios | home | Corto y utilizable: enfoque a resultados, metas y "aprender a desaprender". |
| 2025-03-06 | **Rodrigo Rivera Del Arco** | Managing Director, México & LATAM | home + empresas | Decisión de carrera pivotal después de 25 años corporativos. Alto nivel + resultado concreto. |
| 2025-03-04 | **Alvaro Madero M.** | Presidente, DIMANOR | home | "En nueve meses cambió mi vida". Presidente de empresa, en español, altísimo impacto. |
| 2024-10-21 | **Arelis Noemí Díaz Cortijo** | Transformational Leader / Strategist | home + empresas | Jefa primero, coach después: valida las dos facetas (ejecutiva y coach) en una sola voz. |

Los textos se **recortaron, no se reescribieron** (se quitaron saludos y frases
repetidas) para que quepan en el carrusel tipográfico. Se produjo versión ES y EN
de cada uno. Quedaron con `published` + `approved_by_admin` en true; se pueden
apagar uno por uno desde `/admin/testimoniales`.

## Requiere tu decisión (1)

**José Jaime Gutiérrez Reyes** (22 abr 2025). La primera parte es un gran
testimonio ("me ayudó a abrirme de nuevo a un mundo de posibilidades… y a bajar
lo que tenía en la cabeza a un plan con fechas"). El problema es el resto: cuenta
que quiere mudarse de casa de sus papás, atraer pareja, ganar +US$10k al mes y
ser el mayor tenedor de Bitcoin de México. **No lo subí**: son datos personales de
un cliente y desvían el posicionamiento hacia manifestación/cripto. Si él
autoriza, se publica sólo el primer párrafo y queda bien.

## No publicados (18)

Recomendaciones de su etapa ejecutiva en telecom y tecnología (Centennial, Claro,
AT&T, Microsoft), fechadas entre 2013 y 2022. Hablan de su desempeño como
directora de ventas y marketing, no del método:

Amandeep Punian · Eduardo Shaw · Carlos Escobar · Chris Costello · Dario Ayala ·
Juan Antonio Diaz · Raymond Ortiz · Alexandro Santiago · Arnaldo Hernandez ·
Suzanne Siberon · Angel Moraza · Thomas Lorenzo · Victor Rivera · Nitza Santini ·
Javier Perez · Angel Rijos · Allen Van Daalen · Sharom Lovera · Saadia Popelnik

Casi todas son de una línea y genéricas ("great team player", "asset for any
company"). Ponerlas en el carrusel diluye a las siete buenas: el visitante no
está evaluando si contratarla como VP de ventas.

**Dónde sí valen:** sostienen la credencial de "25+ años liderando organizaciones
multinacionales" en /quienes-somos. Si quieres, las convierto en una banda de
logos/empresas (AT&T, Claro, Microsoft, Centennial) o en una línea de trayectoria,
que es un formato donde ese material sí funciona.

## Publicar / actualizar

```bash
pnpm testimonials:publish --dry-run
pnpm testimonials:publish
```

Los datos viven en [scripts/publishTestimonials.ts](../../scripts/publishTestimonials.ts).
Hace match por nombre del autor, así que es seguro re-ejecutarlo. Igual que con el
blog: si editas un testimonio desde el admin, trae el cambio al script o el
siguiente run lo revierte.

## Nota de superficie

`/empresas` renderiza **un solo** testimonio (`dbTestimonials[0]`, el más
reciente con la etiqueta "empresas" — hoy Sameer). Por eso los siete llevan
también la etiqueta "home", donde el carrusel sí los rota todos; si no, cuatro
quedarían guardados sin aparecer en ninguna parte. Si quieres que /empresas rote
entre los cuatro corporativos, es un cambio de una línea en esa página.
