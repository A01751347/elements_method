import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { subscribers } from "@/shared/db/schema/integrations";
import {
  Boton,
  Campo,
  Cifra,
  CifraGrid,
  Conteo,
  EstadoVacio,
  Filtros,
  Input,
  Insignia,
  PageHeader,
  Tabla,
  Td,
  Th,
} from "../_components/ui";
import { MAILCHIMP_STATUS, estado } from "../_lib/status";
import { fechaCorta } from "../_lib/format";

export const dynamic = "force-dynamic";

/** Deep link to this workspace's Mailchimp audience, using the datacenter
 * prefix when it's configured (see src/shared/integrations/mailchimp.ts). */
function mailchimpAdminUrl(): string {
  const prefix = process.env.MAILCHIMP_SERVER_PREFIX;
  return prefix ? `https://${prefix}.admin.mailchimp.com/lists/` : "https://admin.mailchimp.com/";
}

function hrefFor(estadoFiltro?: string, q?: string): string {
  const params = new URLSearchParams();
  if (estadoFiltro) params.set("estado", estadoFiltro);
  if (q) params.set("q", q);
  const qs = params.toString();
  return `/admin/suscriptores${qs ? `?${qs}` : ""}`;
}

async function loadSubscribers(estadoFiltro?: string, q?: string) {
  try {
    const condiciones = [];
    if (estadoFiltro) condiciones.push(eq(subscribers.mailchimpStatus, estadoFiltro));
    if (q) {
      const like = `%${q}%`;
      condiciones.push(or(ilike(subscribers.email, like), ilike(subscribers.name, like)));
    }
    const where = condiciones.length > 0 ? and(...condiciones) : undefined;

    const rows = await db
      .select()
      .from(subscribers)
      .where(where)
      .orderBy(desc(subscribers.createdAt))
      .limit(300);

    const [stats] = await db
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
        subscribed: sql<number>`sum(case when ${subscribers.mailchimpStatus} = 'subscribed' then 1 else 0 end)`.mapWith(
          Number,
        ),
        pending: sql<number>`sum(case when ${subscribers.mailchimpStatus} = 'pending' then 1 else 0 end)`.mapWith(
          Number,
        ),
        unsubscribed: sql<number>`sum(case when ${subscribers.mailchimpStatus} = 'unsubscribed' then 1 else 0 end)`.mapWith(
          Number,
        ),
        cleaned: sql<number>`sum(case when ${subscribers.mailchimpStatus} = 'cleaned' then 1 else 0 end)`.mapWith(
          Number,
        ),
      })
      .from(subscribers);

    return { rows, stats };
  } catch (e) {
    console.error("[admin/suscriptores] DB read failed", e);
    return {
      rows: [],
      stats: { total: 0, subscribed: 0, pending: 0, unsubscribed: 0, cleaned: 0 },
    };
  }
}

export default async function AdminSubscribersPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; q?: string }>;
}) {
  const { estado: estadoFiltro, q } = await searchParams;
  const { rows: list, stats } = await loadSubscribers(estadoFiltro, q);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Suscriptores"
        subtitle="Newsletter. Se sincronizan con Mailchimp."
        actions={
          <>
            <Boton tone="secundario" href="/api/admin/suscriptores/export" external>
              Exportar CSV
            </Boton>
            <Boton tone="secundario" href={mailchimpAdminUrl()} external>
              Abrir Mailchimp
            </Boton>
          </>
        }
      />

      <CifraGrid>
        <Cifra label="Total" value={stats.total} />
        <Cifra label="Suscritos" value={stats.subscribed} tone="ok" note="Confirmados en Mailchimp" />
        <Cifra label="Pendientes" value={stats.pending} tone="alerta" note="Sin sincronizar todavía" />
        <Cifra label="Bajas" value={stats.unsubscribed} note="Dadas de baja en Mailchimp" />
      </CifraGrid>

      <Filtros
        items={[
          { href: hrefFor(undefined, q), label: "Todos", count: stats.total, active: !estadoFiltro },
          {
            href: hrefFor("subscribed", q),
            label: "Suscritos",
            count: stats.subscribed,
            active: estadoFiltro === "subscribed",
          },
          {
            href: hrefFor("pending", q),
            label: "Pendientes",
            count: stats.pending,
            active: estadoFiltro === "pending",
          },
          {
            href: hrefFor("unsubscribed", q),
            label: "Bajas",
            count: stats.unsubscribed,
            active: estadoFiltro === "unsubscribed",
          },
          {
            href: hrefFor("cleaned", q),
            label: "Limpiados",
            count: stats.cleaned,
            active: estadoFiltro === "cleaned",
          },
        ]}
      />

      <form action="/admin/suscriptores" method="get" className="flex items-end gap-3">
        {estadoFiltro && <input type="hidden" name="estado" value={estadoFiltro} />}
        <Campo label="Buscar" htmlFor="q">
          <Input id="q" type="search" name="q" defaultValue={q ?? ""} placeholder="Correo o nombre…" />
        </Campo>
        <Boton tone="secundario" type="submit">
          Buscar
        </Boton>
      </form>

      <Conteo n={list.length} singular="suscriptor encontrado" plural="suscriptores encontrados" />

      {list.length === 0 ? (
        <EstadoVacio
          title="Todavía no hay suscriptores."
          body="Cuando alguien se suscriba desde el pie de página, aparecerá aquí sincronizado con Mailchimp."
        />
      ) : (
        <Tabla>
          <thead>
            <tr>
              <Th>Fecha</Th>
              <Th>Correo</Th>
              <Th>Nombre</Th>
              <Th>Teléfono</Th>
              <Th>Fuente</Th>
              <Th>Idioma</Th>
              <Th>Mailchimp</Th>
              <Th>Sincronizado</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => {
              const e = estado(MAILCHIMP_STATUS, s.mailchimpStatus);
              return (
                <tr key={s.id}>
                  <Td>{fechaCorta(s.createdAt)}</Td>
                  <Td>
                    <a href={`mailto:${s.email}`}>{s.email}</a>
                  </Td>
                  <Td>{s.name ?? "—"}</Td>
                  <Td>{s.phone ?? "—"}</Td>
                  <Td>{s.source ? <Insignia tone="contorno">{s.source}</Insignia> : "—"}</Td>
                  <Td>{s.language ?? "—"}</Td>
                  <Td>
                    <Insignia tone={e.tone}>{e.label}</Insignia>
                  </Td>
                  <Td>{s.mailchimpSyncedAt ? fechaCorta(s.mailchimpSyncedAt) : "—"}</Td>
                </tr>
              );
            })}
          </tbody>
        </Tabla>
      )}
    </div>
  );
}
