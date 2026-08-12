import { desc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { blogComments } from "@/shared/db/schema/blog";
import {
  AdminPageHeader,
  AdminTable,
  EmptyState,
  StatusPill,
  Td,
  Th,
} from "../_components/admin-ui";
import { approveComment, rejectComment } from "./actions";

const STATUS_VARIANT: Record<string, "green" | "amber" | "red"> = {
  approved: "green",
  pending: "amber",
  rejected: "red",
};

async function loadComments() {
  try {
    return await db
      .select()
      .from(blogComments)
      .orderBy(desc(blogComments.createdAt))
      .limit(100);
  } catch (e) {
    console.error("[admin/comentarios] DB read failed", e);
    return [];
  }
}

export default async function AdminCommentsPage() {
  const list = await loadComments();
  const pending = list.filter((c) => c.status === "pending").length;

  return (
    <>
      <AdminPageHeader
        title="Comentarios"
        subtitle="Moderación de comentarios en posts del blog."
        count={list.length}
      />
      {pending > 0 && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>{pending}</strong> comentarios esperando moderación.
        </div>
      )}

      {list.length === 0 ? (
        <EmptyState
          title="Sin comentarios"
          body="El sistema de comentarios está activo en la DB pero ningún post permite todavía comentarios públicos."
        />
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <Th>Fecha</Th>
              <Th>Autor</Th>
              <Th>Contenido</Th>
              <Th>Status</Th>
              <Th className="text-right">Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-50">
                <Td className="text-xs">{new Date(c.createdAt).toLocaleDateString("es-MX")}</Td>
                <Td>
                  <div className="font-medium">{c.authorName}</div>
                  <div className="text-xs text-zinc-500">{c.authorEmail}</div>
                </Td>
                <Td className="text-sm max-w-md line-clamp-3">{c.content}</Td>
                <Td>
                  <StatusPill
                    status={c.status}
                    variant={STATUS_VARIANT[c.status] ?? "neutral"}
                  />
                </Td>
                <Td className="text-right whitespace-nowrap">
                  <form action={approveComment.bind(null, c.id)} className="inline">
                    <button
                      type="submit"
                      className="bg-emerald-600 text-white px-2 py-1 text-xs hover:bg-emerald-700 mr-1"
                    >
                      Aprobar
                    </button>
                  </form>
                  <form action={rejectComment.bind(null, c.id)} className="inline">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-2 py-1 text-xs hover:bg-red-700"
                    >
                      Rechazar
                    </button>
                  </form>
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
