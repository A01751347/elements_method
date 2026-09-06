import { notFound } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { forms, formResponses, formTokens } from "@/shared/db/schema/forms";
import {
  FichaHeader,
  Insignia,
  Etiqueta,
  SeccionEtiqueta,
  Detalle,
  DatoLista,
  Tabla,
  Th,
  Td,
  EstadoVacio,
  Boton,
} from "../../_components/ui";
import { ConfirmarAccion } from "../../_components/client";
import { fechaHora, fechaCorta } from "../../_lib/format";
import { TOKEN_STATE, estado } from "../../_lib/status";
import { FORM_CATEGORY_LABEL } from "../labels";
import { alternarActivo } from "../actions";
import type { BuilderField } from "../FormBuilder";

export const dynamic = "force-dynamic";

async function loadFormDetail(slug: string) {
  try {
    const [f] = await db.select().from(forms).where(eq(forms.slug, slug)).limit(1);
    if (!f) return null;
    const responses = await db
      .select()
      .from(formResponses)
      .where(eq(formResponses.formId, f.id))
      .orderBy(desc(formResponses.createdAt))
      .limit(50);
    const tokens = await db
      .select()
      .from(formTokens)
      .where(eq(formTokens.formId, f.id))
      .orderBy(desc(formTokens.sentAt))
      .limit(50);
    return { form: f, responses, tokens };
  } catch (e) {
    console.error("[admin/formularios detalle] DB read failed", e);
    return null;
  }
}

function tokenState(t: { usedAt: Date | null; expiresAt: Date }): keyof typeof TOKEN_STATE {
  if (t.usedAt) return "respondido";
  if (new Date(t.expiresAt) < new Date()) return "expirado";
  return "pendiente";
}

export default async function AdminFormDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await loadFormDetail(slug);
  if (!data) notFound();
  const { form, responses, tokens } = data;

  const fields = (Array.isArray(form.fields) ? form.fields : []) as BuilderField[];
  const answerCount = fields.filter((f) => f.type !== "section").length;
  const fieldByKey = new Map(fields.map((f) => [f.key, f]));

  return (
    <div className="flex flex-col gap-8">
      <FichaHeader
        back={{ href: "/admin/formularios", label: "Formularios" }}
        kicker={`Formulario · ${FORM_CATEGORY_LABEL[form.category ?? "custom"] ?? form.category}`}
        title={form.titleEs}
        badge={<Insignia tone={form.active ? "ok" : "neutra"}>{form.active ? "Activo" : "Inactivo"}</Insignia>}
        meta={`${form.slug} · ${form.isAnonymous ? "Anónimo" : "Nominal"} · ${answerCount} preguntas`}
        aside={{ label: "Respuestas", value: responses.length }}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Boton tone="secundario" href={`/admin/formularios/${form.slug}/editar`}>
          Editar
        </Boton>
        <Boton tone="secundario" href={`/api/forms/${form.slug}/export`} external>
          Exportar CSV
        </Boton>
        <Boton tone="primario" href={`/admin/formularios/${form.slug}/enviar`}>
          Enviar
        </Boton>
        <ConfirmarAccion
          trigger={form.active ? "Desactivar" : "Activar"}
          title={form.active ? "Desactivar este formulario" : "Activar este formulario"}
          body={
            form.active
              ? "El formulario deja de poder enviarse a nuevos participantes. Los enlaces y respuestas existentes no cambian."
              : "El formulario vuelve a estar disponible para enviarse."
          }
          confirmLabel={form.active ? "Sí, desactivar" : "Sí, activar"}
          pendingLabel="Guardando…"
          action={alternarActivo}
          tone={form.active ? "peligro" : "tinta"}
          hidden={[
            { name: "id", value: form.id },
            { name: "next", value: String(!form.active) },
          ]}
        />
      </div>

      <section className="flex flex-col gap-4">
        <SeccionEtiqueta>Preguntas</SeccionEtiqueta>
        <ol className="flex flex-col gap-3">
          {fields.map((field, i) => (
            <li key={field.key || i} className="flex items-baseline gap-4">
              <span className="pista" style={{ minWidth: 20 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <code className="pista" style={{ minWidth: 170 }}>
                {field.key}
              </code>
              <span
                className="flex-1"
                style={field.type === "section" ? { fontStyle: "italic", color: "var(--sutil)" } : undefined}
              >
                {field.labelEs}
              </span>
              <Insignia tone="contorno">{field.type}</Insignia>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-4">
        <SeccionEtiqueta>Respuestas</SeccionEtiqueta>
        {responses.length === 0 ? (
          <EstadoVacio title="Todavía no hay respuestas." />
        ) : (
          <div className="flex flex-col gap-3">
            {responses.map((r) => (
              <Detalle
                key={r.id}
                summary={`${r.respondentName ?? "—"} · ${r.respondentEmail ?? "—"} · ${fechaHora(r.createdAt)}`}
              >
                <DatoLista
                  items={Object.entries((r.answers as Record<string, unknown>) ?? {}).map(([k, v]) => ({
                    label: fieldByKey.get(k)?.labelEs ?? k,
                    value: Array.isArray(v) ? v.join(", ") : String(v ?? "—"),
                  }))}
                />
                {r.shareablePhrase && (
                  <div className="renglon-destacado mt-3">
                    <Etiqueta>Frase testimonial</Etiqueta>
                    <p className="mt-1">“{r.shareablePhrase}”</p>
                  </div>
                )}
              </Detalle>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <SeccionEtiqueta>Enlaces enviados</SeccionEtiqueta>
        {tokens.length === 0 ? (
          <EstadoVacio
            title="Sin enlaces enviados todavía."
            body="Genera un enlace de un solo uso desde el botón Enviar."
            action={
              <Boton tone="secundario" href={`/admin/formularios/${form.slug}/enviar`}>
                Enviar un cuestionario
              </Boton>
            }
          />
        ) : (
          <Tabla>
            <thead>
              <tr>
                <Th>Destinatario</Th>
                <Th>Correo</Th>
                <Th>Enviado</Th>
                <Th>Expira</Th>
                <Th>Estado</Th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((t) => {
                const st = tokenState(t);
                const stInfo = estado(TOKEN_STATE, st);
                return (
                  <tr key={t.id}>
                    <Td>{t.recipientName ?? "—"}</Td>
                    <Td secondary>{t.recipientEmail}</Td>
                    <Td secondary>{fechaCorta(t.sentAt)}</Td>
                    <Td secondary>{fechaCorta(t.expiresAt)}</Td>
                    <Td>
                      <Insignia tone={stInfo.tone}>{stInfo.label}</Insignia>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Tabla>
        )}
      </section>
    </div>
  );
}
