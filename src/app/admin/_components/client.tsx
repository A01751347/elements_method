"use client";

/**
 * Primitivas del admin que necesitan estado del cliente: botón con
 * useFormStatus, el modal de confirmación (<dialog> nativo), la navegación
 * activa (usePathname) y las migas de pan.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useRef, type ReactNode } from "react";
import { IconoBuscar } from "./icons";

/* ── BotonPendiente ───────────────────────────────────────────────────────── */

export function BotonPendiente({
  children,
  pendingLabel,
  tone = "primario",
  className,
}: {
  children: ReactNode;
  pendingLabel: string;
  tone?: "primario" | "secundario" | "peligro" | "texto";
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={`boton boton-${tone}${className ? ` ${className}` : ""}`}
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? (
        <>
          <span className="girito" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

/* ── ConfirmarAccion ──────────────────────────────────────────────────────── */

export function ConfirmarAccion({
  trigger,
  title,
  body,
  confirmLabel,
  pendingLabel,
  action,
  tone = "tinta",
  hidden = [],
  size = "normal",
}: {
  trigger: ReactNode;
  title: string;
  body: ReactNode;
  confirmLabel: string;
  pendingLabel: string;
  action: (fd: FormData) => void | Promise<void>;
  tone?: "tinta" | "peligro";
  hidden?: { name: string; value: string }[];
  size?: "normal" | "chico";
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerClase = [
    "boton",
    tone === "peligro" ? "boton-peligro" : "boton-secundario",
    size === "chico" ? "boton-chico" : null,
  ]
    .filter(Boolean)
    .join(" ");

  const parrafos = typeof body === "string" ? body.split("\n").filter(Boolean) : null;

  return (
    <>
      <button type="button" className={triggerClase} onClick={() => dialogRef.current?.showModal()}>
        {trigger}
      </button>
      <dialog ref={dialogRef} className={`modal${tone === "peligro" ? " modal-peligro" : ""}`}>
        <span className={`etiqueta modal-titulo${tone === "peligro" ? " tono-peligro" : ""}`}>{title}</span>
        <div className="modal-cuerpo">{parrafos ? parrafos.map((p, i) => <p key={i}>{p}</p>) : body}</div>
        <div className="modal-acciones">
          <button
            type="button"
            className="boton boton-secundario"
            autoFocus
            onClick={() => dialogRef.current?.close()}
          >
            Cancelar
          </button>
          <form
            action={async (fd: FormData) => {
              await action(fd);
              dialogRef.current?.close();
            }}
          >
            {hidden.map((h) => (
              <input key={h.name} type="hidden" name={h.name} value={h.value} />
            ))}
            <BotonPendiente tone={tone === "peligro" ? "peligro" : "primario"} pendingLabel={pendingLabel}>
              {confirmLabel}
            </BotonPendiente>
          </form>
        </div>
      </dialog>
    </>
  );
}

/* ── Navegación activa ────────────────────────────────────────────────────── */

export function NavEnlace({
  href,
  children,
  count,
}: {
  href: string;
  children: ReactNode;
  count?: number;
}) {
  const pathname = usePathname();
  const activo = pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));
  return (
    <Link href={href} className="nav-enlace" aria-current={activo ? "page" : undefined}>
      <span className="nav-enlace-etiqueta">{children}</span>
      {typeof count === "number" && count > 0 && (
        <span className="insignia insignia-contador">{count}</span>
      )}
    </Link>
  );
}

/* ── Migas de pan ─────────────────────────────────────────────────────────── */

const SECCIONES: Record<string, string> = {
  pagos: "Órdenes",
  transferencias: "Transferencias",
  compradores: "Compradores",
  inscripciones: "Inscripciones",
  empresas: "Cotizaciones",
  arco: "Derechos ARCO",
  retiros: "Retiros",
  productos: "Productos",
  locaciones: "Locaciones",
  proveedores: "Proveedores",
  documentos: "Documentos",
  formularios: "Formularios",
  blog: "Blog",
  comentarios: "Comentarios",
  testimoniales: "Testimoniales",
  logos: "Logos",
  suscriptores: "Suscriptores",
  analytics: "Tráfico",
  pixels: "Pixels y etiquetas",
  ajustes: "Ajustes",
  ayuda: "Ayuda",
  buscar: "Búsqueda",
};

const DETALLES: Record<string, string> = {
  nuevo: "Nuevo",
  nueva: "Nueva",
  editar: "Editar",
  enviar: "Enviar",
  calculadora: "Calculadora",
  contacto: "Contacto",
};

export function Migas() {
  const pathname = usePathname();
  const segmentos = pathname.split("/").filter(Boolean); // ["admin", ...]
  const seccionSlug = segmentos[1];
  const detalleSlug = segmentos[2];

  const items: { label: string; href?: string }[] = [{ label: "Inicio", href: "/admin" }];

  if (seccionSlug) {
    const label = SECCIONES[seccionSlug] ?? seccionSlug;
    const tieneDetalle = Boolean(detalleSlug);
    items.push({ label, href: tieneDetalle ? `/admin/${seccionSlug}` : undefined });
  }

  if (detalleSlug) {
    items.push({ label: DETALLES[detalleSlug] ?? "Detalle" });
  }

  return (
    <nav className="migas" aria-label="Miga de pan">
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          {i > 0 && (
            <span className="migas-separador" aria-hidden="true">
              /
            </span>
          )}
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span className="migas-actual">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ── Menú móvil ───────────────────────────────────────────────────────────── */

export function MenuMovil({ children }: { children: ReactNode }) {
  return (
    <details className="menu-movil">
      <summary>Menú</summary>
      {children}
    </details>
  );
}

/* ── Búsqueda global ──────────────────────────────────────────────────────── */

export function BusquedaGlobal() {
  return (
    <form action="/admin/buscar" method="get" className="busqueda" role="search">
      <IconoBuscar size={17} />
      <input
        type="search"
        name="q"
        placeholder="Buscar folio, correo, nombre…"
        aria-label="Búsqueda global"
      />
    </form>
  );
}
