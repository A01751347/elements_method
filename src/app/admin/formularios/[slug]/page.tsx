import { notFound } from "next/navigation";
import Link from "next/link";
import { eq, desc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { forms, formResponses, formTokens } from "@/shared/db/schema/forms";
import {
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  AdminTable,
  EmptyState,
  PlaceholderNote,
  StatusPill,
  Td,
  Th,
} from "../../_components/admin-ui";

async function loadForm(slug: string) {
  try {
    const [f] = await db.select().from(forms).where(eq(forms.slug, slug)).limit(1);
    if (!f) return null;
    const responses = await db
      .select({
        id: formResponses.id,
        respondentEmail: formResponses.respondentEmail,
        respondentName: formResponses.respondentName,
        answers: formResponses.answers,
        shareablePhrase: formResponses.shareablePhrase,
        createdAt: formResponses.createdAt,
      })
      .from(formResponses)
      .where(eq(formResponses.formId, f.id))
      .orderBy(desc(formResponses.createdAt))
      .limit(50);
    const tokens = await db
      .select({
        id: formTokens.id,
        recipientEmail: formTokens.recipientEmail,
        recipientName: formTokens.recipientName,
        expiresAt: formTokens.expiresAt,
        usedAt: formTokens.usedAt,
        sentAt: formTokens.sentAt,
      })
      .from(formTokens)
      .where(eq(formTokens.formId, f.id))
      .orderBy(desc(formTokens.sentAt))
      .limit(50);
    return { form: f, responses, tokens };
  } catch (e) {
    console.error("[admin/forms detail] DB read failed", e);
    return null;
  }
}

export default async function AdminFormDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await loadForm(slug);
  if (!data) notFound();
  const { form: f, responses, tokens } = data;
  const fields = Array.isArray(f.fields) ? (f.fields as { key: string; labelEs: string; type: string }[]) : [];

  return (
    <>
      <AdminPageHeader
        title={f.titleEs}
        subtitle={`Slug ${f.slug} · ${f.category ?? "—"}`}
        action={
          <div className="flex gap-2">
            <AdminSecondaryButton href="/admin/formularios">← Volver</AdminSecondaryButton>
            <AdminSecondaryButton href={`/admin/formularios/${f.slug}/editar`}>
              Editar
            </AdminSecondaryButton>
            <a
              href={`/api/forms/${f.slug}/export`}
              className="inline-flex items-center gap-2 bg-white border border-zinc-300 text-zinc-700 px-3 py-1.5 text-xs hover:bg-zinc-50 transition-colors"
            >
              Exportar CSV
            </a>
            <AdminPrimaryButton href={`/admin/formularios/${f.slug}/enviar`}>
              Enviar
            </AdminPrimaryButton>
          </div>
        }
      />
      <PlaceholderNote />

      {/* FIELDS */}
      <section className="rounded-lg border border-zinc-200 bg-white p-5 mb-6">
        <h2 className="text-sm font-medium mb-3">
          Campos del cuestionario ({fields.length})
        </h2>
        <ol className="text-sm divide-y divide-zinc-100">
          {fields.map((field, i) => (
            <li key={field.key} className="py-2.5 flex items-baseline gap-4">
              <span className="text-zinc-400 tabular-nums w-6">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-xs text-zinc-500 w-40">{field.key}</span>
              <span className="flex-1">{field.labelEs}</span>
              <StatusPill status={field.type} variant="neutral" />
            </li>
          ))}
        </ol>
      </section>

      {/* RESPONSES */}
      <section className="rounded-lg border border-zinc-200 bg-white p-5 mb-6">
        <h2 className="text-sm font-medium mb-4">Respuestas ({responses.length})</h2>
        {responses.length === 0 ? (
          <EmptyState
            title="Sin respuestas todavía"
            body="Cuando los participantes contesten su cuestionario verás cada respuesta aquí."
          />
        ) : (
          <div className="divide-y divide-zinc-100">
            {responses.map((r) => (
              <details key={r.id} className="py-3 group">
                <summary className="flex items-center justify-between cursor-pointer hover:bg-zinc-50 px-2 -mx-2 py-1.5 rounded text-sm">
                  <span className="flex items-center gap-3">
                    <span className="font-medium">{r.respondentName ?? "—"}</span>
                    <span className="text-xs text-zinc-500">{r.respondentEmail}</span>
                  </span>
                  <span className="text-xs text-zinc-500 tabular-nums">
                    {new Date(r.createdAt).toLocaleString("es-MX")}
                  </span>
                </summary>
                <div className="mt-3 pl-4 border-l-2 border-amber-300 space-y-3">
                  {Object.entries((r.answers as Record<string, unknown>) ?? {}).map(([k, v]) => (
                    <div key={k}>
                      <div className="text-[0.65rem] uppercase tracking-[0.16em] text-zinc-500 mb-1">
                        {k}
                      </div>
                      <div className="text-sm text-zinc-900 whitespace-pre-wrap">
                        {Array.isArray(v) ? v.join(", ") : String(v)}
                      </div>
                    </div>
                  ))}
                  {r.shareablePhrase && (
                    <div className="mt-3 italic text-sm text-amber-900 bg-amber-50 p-3 border-l-2 border-amber-500">
                      <span className="text-[0.65rem] uppercase tracking-[0.16em] block mb-1">
                        Frase shareable
                      </span>
                      “{r.shareablePhrase}”
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        )}
      </section>

      {/* TOKENS */}
      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-medium mb-4">Tokens emitidos ({tokens.length})</h2>
        {tokens.length === 0 ? (
          <EmptyState
            title="Sin enlaces enviados"
            body="Genera un enlace de un solo uso desde el botón Enviar."
            action={
              <AdminPrimaryButton href={`/admin/formularios/${f.slug}/enviar`}>
                Enviar un cuestionario
              </AdminPrimaryButton>
            }
          />
        ) : (
          <AdminTable>
            <thead>
              <tr>
                <Th>Destinatario</Th>
                <Th>Email</Th>
                <Th>Enviado</Th>
                <Th>Expira</Th>
                <Th>Usado</Th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((t) => (
                <tr key={t.id}>
                  <Td>{t.recipientName ?? "—"}</Td>
                  <Td className="text-xs">{t.recipientEmail}</Td>
                  <Td className="text-xs">{new Date(t.sentAt).toLocaleDateString("es-MX")}</Td>
                  <Td className="text-xs">{new Date(t.expiresAt).toLocaleDateString("es-MX")}</Td>
                  <Td>
                    {t.usedAt ? (
                      <StatusPill status="Respondido" variant="green" />
                    ) : new Date(t.expiresAt) < new Date() ? (
                      <StatusPill status="Expirado" variant="red" />
                    ) : (
                      <StatusPill status="Pendiente" variant="amber" />
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        )}
      </section>
    </>
  );
}
