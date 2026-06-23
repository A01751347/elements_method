import { desc } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/shared/db/client";
import { blogPosts } from "@/shared/db/schema/blog";
import {
  AdminPageHeader,
  AdminTable,
  AdminPrimaryButton,
  EmptyState,
  StatusPill,
  Td,
  Th,
} from "../_components/admin-ui";

const STATUS_VARIANT: Record<string, "green" | "amber" | "neutral"> = {
  published: "green",
  draft: "amber",
  archived: "neutral",
};

async function loadPosts() {
  try {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.updatedAt)).limit(100);
  } catch (e) {
    console.error("[admin/blog] DB read failed", e);
    return [];
  }
}

export default async function AdminBlogPage() {
  const posts = await loadPosts();

  return (
    <>
      <AdminPageHeader
        title="Blog"
        subtitle="Notas del campo — publicaciones bilingües con flujo editorial."
        count={posts.length}
        action={
          <AdminPrimaryButton href="/admin/blog/nuevo">+ Nuevo post</AdminPrimaryButton>
        }
      />

      {posts.length === 0 ? (
        <EmptyState
          title="Sin posts publicados"
          body="El work plan menciona cadencia bi-semanal. Crea el primer post o conecta tu CMS preferido."
        />
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <Th>Slug</Th>
              <Th>Título</Th>
              <Th>Status</Th>
              <Th>Última edición</Th>
              <Th className="text-right">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50">
                <Td className="font-mono text-xs">{p.slug}</Td>
                <Td className="font-medium">{p.titleEs}</Td>
                <Td>
                  <StatusPill
                    status={p.status}
                    variant={STATUS_VARIANT[p.status] ?? "neutral"}
                  />
                </Td>
                <Td className="text-xs">{new Date(p.updatedAt).toLocaleDateString("es-MX")}</Td>
                <Td className="text-right">
                  <Link
                    href={`/admin/blog/${p.slug}`}
                    className="bg-white border border-zinc-300 px-3 py-1.5 text-xs hover:bg-zinc-50"
                  >
                    Editar
                  </Link>
                </Td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </>
  );
}

export const dynamic = "force-dynamic";
