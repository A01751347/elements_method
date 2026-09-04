/**
 * Portada de un artículo.
 *
 * Las once entradas sembradas apuntan a fotos que ya se usan como portada de
 * página (`/images/heroes/home.jpg`, `/images/elements/agua.jpg`…), así que el
 * blog repetía imágenes que el visitante acaba de ver en el resto del sitio.
 * Cuando la portada es una de esas, se sustituye por una del juego propio del
 * blog — texturas y frameworks, que no abren ninguna página — elegida de forma
 * estable a partir del slug para que un artículo conserve siempre la suya.
 *
 * Una subida real desde el admin (Vercel Blob, un dominio externo, cualquier
 * ruta fuera de heroes/elements) manda y no se toca.
 */
const RECYCLED = /^\/images\/(heroes|elements)\//;

const BLOG_SET = [
  "/images/details/tierra.jpg",
  "/images/modules/roots.jpg",
  "/images/details/fuego.jpg",
  "/images/modules/ignite.jpg",
  "/images/details/agua.jpg",
  "/images/modules/flow.jpg",
  "/images/details/aire.jpg",
  "/images/modules/clear.jpg",
];

export function blogCover(post: {
  slug: string;
  coverImageUrl?: string | null;
}): string {
  const url = post.coverImageUrl;
  if (url && !RECYCLED.test(url)) return url;

  let hash = 0;
  for (const char of post.slug) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return BLOG_SET[hash % BLOG_SET.length];
}
