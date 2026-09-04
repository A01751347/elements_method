/**
 * Publica los artículos de content/blog/*.md en la tabla blog_posts.
 *
 * Los archivos Markdown son la fuente de verdad editorial: cada artículo vive
 * en dos archivos hermanos, <slug>.es.md (canónico, con toda la metadata) y
 * <slug>.en.md (título, excerpt y meta description en inglés). El cuerpo se
 * guarda en las columnas jsonb content_es / content_en con el wrapper { text }
 * que usa el admin (src/app/admin/blog/actions.ts).
 *
 * Idempotente: hace upsert por slug. `published_at` sólo se estampa la primera
 * vez que el post pasa a "published", igual que en el admin.
 *
 * Uso:
 *   pnpm blog:publish              # escribe en la BD
 *   pnpm blog:publish --dry-run    # sólo reporta lo que haría
 *   pnpm blog:publish --only=slug  # un solo artículo
 */
import "dotenv/config";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { blogPosts } from "@/shared/db/schema/blog";

const BLOG_DIR = join(process.cwd(), "content", "blog");
const DEFAULT_AUTHOR = "Ana Michelle Concepción Esterrich";

interface Front {
  [key: string]: string;
}

/** Frontmatter YAML mínimo: `clave: valor` con comillas opcionales. */
function parseFile(raw: string): { front: Front; body: string } {
  const text = raw.replace(/\r\n/g, "\n");
  if (!text.startsWith("---\n")) {
    throw new Error("El archivo no empieza con frontmatter (---)");
  }
  const end = text.indexOf("\n---", 3);
  if (end === -1) throw new Error("Frontmatter sin cierre (---)");

  const front: Front = {};
  for (const line of text.slice(4, end).split("\n")) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const sep = line.indexOf(":");
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    let value = line.slice(sep + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    front[key] = value;
  }

  return { front, body: text.slice(end + 4).trim() };
}

function read(slug: string, locale: "es" | "en") {
  const path = join(BLOG_DIR, `${slug}.${locale}.md`);
  return parseFile(readFileSync(path, "utf8"));
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const only = process.argv
    .find((a) => a.startsWith("--only="))
    ?.slice("--only=".length);

  const slugs = [
    ...new Set(
      readdirSync(BLOG_DIR)
        .filter((f) => f.endsWith(".es.md"))
        .map((f) => f.replace(/\.es\.md$/, "")),
    ),
  ]
    .filter((s) => !only || s === only)
    .sort();

  if (slugs.length === 0) {
    console.log("No hay artículos que publicar.");
    return;
  }

  console.log(
    `→ ${slugs.length} artículo(s)${dryRun ? " (dry-run, sin escribir)" : ""}\n`,
  );

  for (const slug of slugs) {
    const es = read(slug, "es");
    let en: { front: Front; body: string } | null = null;
    try {
      en = read(slug, "en");
    } catch {
      en = null; // sólo español: la página cae al texto ES
    }

    if (es.front.slug !== slug) {
      throw new Error(`${slug}: el slug del frontmatter no coincide con el nombre del archivo`);
    }
    if (!es.front.title || !es.body) {
      throw new Error(`${slug}: falta título o cuerpo en español`);
    }

    const status = es.front.status === "published" ? "published" : "draft";
    const [existing] = await db
      .select({ id: blogPosts.id, publishedAt: blogPosts.publishedAt })
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    // publishedAt: respeta el del frontmatter, conserva el que ya tenga la BD.
    const publishedAt =
      status === "published"
        ? (existing?.publishedAt ??
          (es.front.publishedAt ? new Date(`${es.front.publishedAt}T12:00:00Z`) : new Date()))
        : null;

    const values = {
      slug,
      titleEs: es.front.title,
      titleEn: en?.front.title ?? null,
      excerptEs: es.front.excerpt ?? null,
      excerptEn: en?.front.excerpt ?? null,
      contentEs: { text: es.body },
      contentEn: en ? { text: en.body } : null,
      coverImageUrl: es.front.cover ?? null,
      author: es.front.author ?? DEFAULT_AUTHOR,
      metaDescriptionEs: es.front.metaDescription ?? null,
      metaDescriptionEn: en?.front.metaDescription ?? null,
      status: status as "draft" | "published",
      publishedAt,
    };

    if (dryRun) {
      console.log(
        `  ${existing ? "actualizaría" : "crearía  "}  ${slug}  [${status}]  «${values.titleEs}»`,
      );
      continue;
    }

    await db
      .insert(blogPosts)
      .values(values)
      .onConflictDoUpdate({
        target: blogPosts.slug,
        set: { ...values, updatedAt: new Date() },
      });

    console.log(`  ✓ ${existing ? "actualizado" : "creado    "}  ${slug}  [${status}]`);
  }

  console.log("\nListo.");
}

main().catch((err) => {
  console.error("\n✗ Error publicando artículos:", err);
  process.exit(1);
});
