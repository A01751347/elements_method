/**
 * Carga en la tabla `testimonials` los testimonios de LinkedIn que sirven para
 * la página.
 *
 * Criterio de selección (ver content/testimonials/CLASIFICACION.md): entra sólo
 * quien habla del **proceso de coaching, mentoría o retiro** y de un cambio
 * concreto. Las recomendaciones de su carrera corporativa (Claro, AT&T,
 * Microsoft, 2013–2019) quedan fuera: son evidencia de trayectoria para
 * /quienes-somos, no testimonios del método.
 *
 * `publishedAt` usa la fecha real de la recomendación en LinkedIn, así el orden
 * del carrusel (más reciente primero) es honesto.
 *
 * Nota sobre `displayLocations`: /empresas renderiza sólo `dbTestimonials[0]`,
 * así que los siete llevan "home" —donde el carrusel los rota todos— y los
 * cuatro con ángulo corporativo llevan además "empresas".
 *
 * Idempotente: hace match por `author_name`; actualiza si ya existe.
 *
 * Uso:
 *   pnpm testimonials:publish --dry-run
 *   pnpm testimonials:publish
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { testimonials } from "@/shared/db/schema/testimonials";

interface Seed {
  authorName: string;
  authorRole: string;
  companyName: string | null;
  quoteEs: string;
  quoteEn: string;
  /** Dónde se muestra. null = en cualquier superficie que pida testimonios. */
  displayLocations: string[] | null;
  /** Fecha de la recomendación original en LinkedIn (YYYY-MM-DD). */
  recommendedOn: string;
}

/** Los textos están recortados —no reescritos— para tamaño de carrusel. */
const seeds: Seed[] = [
  {
    authorName: "Sameer Sawaqed",
    authorRole: "Director | Investor | Podcast Host",
    companyName: "Freedom Family Office & Wealthrive",
    quoteEs:
      "Trabajar con Michelle como mi coach facilitadora en YPO ha sido una de las experiencias de mayor impacto en mi trayectoria de liderazgo. El retiro de Scottsdale que facilitó fue un punto de quiebre para mí: tiene el don de hacer la pregunta correcta en el momento correcto, empujándote más allá de las respuestas cómodas hacia un verdadero autodescubrimiento. No te deja salir por la puerta fácil, y eso es exactamente lo que hace un gran coach.",
    quoteEn:
      "Working with Michelle as my YPO facilitator coach has been one of the most impactful experiences in my leadership journey. The Scottsdale retreat she facilitated was a turning point for me: she has a gift for asking the right questions at the right moment, pushing you past comfortable answers and into real self-discovery. She doesn't let you off the hook, and that's exactly what great coaching looks like.",
    displayLocations: ["home", "empresas"],
    recommendedOn: "2026-03-26",
  },
  {
    authorName: "Victor Ernesto M.",
    authorRole: "Supply Chain Head | Medical Devices & Healthcare",
    companyName: null,
    quoteEs:
      "Fuiste una coach increíble. Siempre me impulsaste a salir de mi zona de confort, a retarme y a ver mis capacidades desde una perspectiva diferente. Tu acompañamiento, apoyo y retroalimentación hicieron una gran diferencia, tanto personal como profesional.",
    quoteEn:
      "You were an incredible coach. You always pushed me out of my comfort zone, to challenge myself and to see my own capabilities from a different perspective. Your guidance, support and feedback made a great difference, both personally and professionally.",
    displayLocations: ["home"],
    recommendedOn: "2025-12-13",
  },
  {
    authorName: "Ricardo Alvarez",
    authorRole: "Technology Consultant | Songwriter & Producer",
    companyName: null,
    quoteEs:
      "Fue capaz de ver en mí cosas que yo todavía no podía ver, y me colocó con destreza en situaciones donde podía crecer, aprender y entender mejor mi propio potencial. Su compromiso con el crecimiento continuo y con los estándares altos la convierten en una fuente única de perspectiva y mentoría.",
    quoteEn:
      "She was able to see things in myself that I was not yet able to see, and skillfully placed me in situations where I could grow, learn and better understand my own potential. Her commitment to continuous growth and to high standards makes her a unique source from which to receive perspective and mentorship.",
    displayLocations: ["home", "empresas"],
    recommendedOn: "2025-06-28",
  },
  {
    authorName: "Leonardo Nava",
    authorRole: "Dirección de Inteligencia de Negocios",
    companyName: null,
    quoteEs:
      "Me ayudó mucho en el enfoque a resultados, la fijación de metas y el propósito durante el coaching. ¡Aprender a desaprender!",
    quoteEn:
      "The coaching helped me enormously with results focus, goal setting and purpose. Learning to unlearn!",
    displayLocations: ["home"],
    recommendedOn: "2025-05-14",
  },
  {
    authorName: "Rodrigo Rivera Del Arco",
    authorRole: "Managing Director | México & LATAM",
    companyName: null,
    quoteEs:
      "Me guio en una decisión decisiva de mi carrera: pasar a la consultoría después de 25 años en el mundo corporativo. Su enfoque centrado en la persona conecta con tu motivador interno y permite alcanzar resultados extraordinarios a través de la excelencia operativa y el liderazgo transformador.",
    quoteEn:
      "She guided me through a pivotal decision in my career: transitioning into consulting after 25 years in corporate settings. Her human-centered approach connects with your inner motivator, enabling individuals to achieve extraordinary results through operational excellence and transformative leadership.",
    displayLocations: ["home", "empresas"],
    recommendedOn: "2025-03-06",
  },
  {
    authorName: "Alvaro Madero M.",
    authorRole: "Presidente",
    companyName: "DIMANOR",
    quoteEs:
      "La mejor coach que puede haber. En nueve meses cambió mi vida: cambié yo y cambió mi futuro. En lo personal y en lo profesional, un gran cambio para bien.",
    quoteEn:
      "The best coach there could be. In nine months she changed my life: I changed, and my future changed. Personally and professionally, a great change for the better.",
    displayLocations: ["home"],
    recommendedOn: "2025-03-04",
  },
  {
    authorName: "Arelis Noemí Díaz Cortijo",
    authorRole: "Transformational Leader | Strategist",
    companyName: null,
    quoteEs:
      "Tuve el privilegio de trabajar con Ana Michelle, cuyo liderazgo y mentoría marcaron profundamente mi carrera. Primero como mi jefa y después como mi coach, me dio oportunidades y una guía incomparables. Su visión estratégica y su apoyo constante fueron determinantes para mi crecimiento.",
    quoteEn:
      "I had the privilege of working with Ana Michelle, whose leadership and mentorship profoundly shaped my career. As my boss and later my coach, she provided me with unparalleled opportunities and guidance. Her strategic insights and unwavering support were instrumental to my growth.",
    displayLocations: ["home", "empresas"],
    recommendedOn: "2024-10-21",
  },
];

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  console.log(
    `→ ${seeds.length} testimonio(s)${dryRun ? " (dry-run, sin escribir)" : ""}\n`,
  );

  for (const s of seeds) {
    const values = {
      // Sin foto: el carrusel es tipográfico a propósito.
      type: "quote_only" as const,
      authorName: s.authorName,
      authorRole: s.authorRole,
      companyName: s.companyName,
      quoteEs: s.quoteEs,
      quoteEn: s.quoteEn,
      displayLocations: s.displayLocations,
      // getTestimonials() exige published + approvedByAdmin para mostrarlos.
      approvedByAdmin: true,
      published: true,
      publishedAt: new Date(`${s.recommendedOn}T12:00:00Z`),
    };

    const [existing] = await db
      .select({ id: testimonials.id })
      .from(testimonials)
      .where(eq(testimonials.authorName, s.authorName))
      .limit(1);

    if (dryRun) {
      console.log(
        `  ${existing ? "actualizaría" : "crearía  "}  ${s.authorName.padEnd(26)} ${(s.displayLocations ?? ["*"]).join("+")}`,
      );
      continue;
    }

    if (existing) {
      await db.update(testimonials).set(values).where(eq(testimonials.id, existing.id));
      console.log(`  ✓ actualizado  ${s.authorName}`);
    } else {
      await db.insert(testimonials).values(values);
      console.log(`  ✓ creado       ${s.authorName}`);
    }
  }

  console.log("\nListo.");
}

main().catch((err) => {
  console.error("\n✗ Error publicando testimonios:", err);
  process.exit(1);
});
