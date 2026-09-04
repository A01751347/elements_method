# content/blog

Fuente de verdad editorial de los artículos del blog. Cada artículo son dos
archivos hermanos:

- `<slug>.es.md` — canónico. Frontmatter completo (metadata) + cuerpo en español.
- `<slug>.en.md` — frontmatter reducido (title / excerpt / metaDescription) + cuerpo en inglés.

Frontmatter del archivo `.es.md`:

| Clave | Obligatoria | Va a la columna |
|-------|-------------|-----------------|
| `slug` | sí (igual al nombre del archivo) | `slug` |
| `title` | sí | `title_es` |
| `excerpt` | recomendada (se ve en la tarjeta del listado) | `excerpt_es` |
| `metaDescription` | recomendada (SEO) | `meta_description_es` |
| `author` | no (default: Ana Michelle Concepción Esterrich) | `author` |
| `cover` | no | `cover_image_url` |
| `status` | `published` \| `draft` (default `draft`) | `status` |
| `publishedAt` | `YYYY-MM-DD` | `published_at` |
| `element`, `locale` | informativos, no se guardan | — |

El cuerpo se guarda en `content_es` / `content_en` como `{ "text": "..." }`, el
mismo formato que escribe el admin. Se renderiza con `src/components/ui/Markdown.tsx`,
que soporta encabezados, listas, citas, tablas, negritas/cursivas, enlaces,
imágenes, código y separadores (`---`).

## Publicar

```bash
pnpm blog:publish --dry-run    # muestra qué crearía / actualizaría
pnpm blog:publish              # hace upsert por slug en blog_posts
pnpm blog:publish --only=<slug>
```

Es idempotente. `published_at` sólo se estampa la primera vez que el post pasa a
`published`; después la BD manda, igual que en el admin.

**Ojo:** el script sobrescribe el contenido del post en la BD. Si un artículo se
edita desde `/admin/blog`, hay que traer ese cambio al `.md` o el siguiente
`blog:publish` lo revierte.

Clasificación del material original y criterios: [CLASIFICACION.md](./CLASIFICACION.md).
