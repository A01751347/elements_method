/**
 * Primitivas server-safe del admin (sin hooks). Ver docs/admin/PLAN_ADMIN_2026.md
 * §1.4 para el contrato de firmas y docs/marca/identidad-visual.md para cada
 * clase CSS que usan (definidas en ./admin.css, todas bajo `.admin`).
 *
 * Las primitivas con estado (dialog, pending, nav activa, migas) viven en
 * ./client.tsx porque necesitan "use client".
 */
import Link from "next/link";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TdHTMLAttributes,
  TextareaHTMLAttributes,
  ThHTMLAttributes,
} from "react";

type Tono = "ok" | "alerta" | "acento" | "neutra" | "peligro" | "invertida" | "contorno" | "contador";

/* ── Encabezados de página y ficha ───────────────────────────────────────── */

export function PageHeader({
  title,
  subtitle,
  actions,
  count,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  count?: { n: number; singular: string; plural: string };
}) {
  return (
    <header className="page-header">
      <div>
        <div className="page-header-titulo">
          <h1>{title}</h1>
          {count && <Conteo n={count.n} singular={count.singular} plural={count.plural} />}
        </div>
        {subtitle && <p className="page-header-subtitulo">{subtitle}</p>}
      </div>
      {actions && <div className="page-header-acciones">{actions}</div>}
    </header>
  );
}

export function FichaHeader({
  back,
  kicker,
  title,
  badge,
  meta,
  aside,
}: {
  back: { href: string; label: string };
  kicker?: ReactNode;
  title: ReactNode;
  badge?: ReactNode;
  meta?: ReactNode;
  aside?: { label: string; value: ReactNode };
}) {
  return (
    <>
      <Volver href={back.href}>{back.label}</Volver>
      <div className="ficha-cabecera">
        <div className="ficha-cabecera-principal">
          {kicker && <Etiqueta>{kicker}</Etiqueta>}
          <div className="ficha-cabecera-titulo">
            <h1>{title}</h1>
            {badge}
          </div>
          {meta && <p className="ficha-cabecera-meta">{meta}</p>}
        </div>
        {aside && (
          <div className="ficha-cabecera-aside">
            <Etiqueta>{aside.label}</Etiqueta>
            <div className="ficha-cabecera-total">{aside.value}</div>
          </div>
        )}
      </div>
    </>
  );
}

/* ── Etiquetas ────────────────────────────────────────────────────────────── */

export function Etiqueta({
  children,
  as = "span",
  tone = "tenue",
}: {
  children: ReactNode;
  as?: "span" | "div" | "label" | "h2";
  tone?: "tenue" | "tinta" | "peligro" | "acento";
}) {
  const Tag = as as "span";
  return <Tag className={`etiqueta${tone !== "tenue" ? ` tono-${tone}` : ""}`}>{children}</Tag>;
}

export function SeccionEtiqueta({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between mb-3">
      <h2 className="etiqueta etiqueta-seccion">{children}</h2>
      {action}
    </div>
  );
}

/* ── Cifra / CifraGrid ────────────────────────────────────────────────────── */

export function Cifra({
  label,
  value,
  note,
  tone = "neutro",
  href,
}: {
  label: string;
  value: ReactNode;
  note?: string;
  tone?: "neutro" | "ok" | "alerta" | "peligro" | "acento";
  href?: string;
}) {
  const contenido = (
    <>
      <span className="cifra-cabeza">
        <span className="etiqueta">{label}</span>
        {href && (
          <span className="cifra-flecha" aria-hidden="true">
            →
          </span>
        )}
      </span>
      <span className={`cifra-valor${tone !== "neutro" ? ` tono-${tone}` : ""}`}>{value}</span>
      {note && <span className="cifra-nota">{note}</span>}
    </>
  );
  if (href) {
    return (
      <Link href={href} className="cifra">
        {contenido}
      </Link>
    );
  }
  return <div className="cifra">{contenido}</div>;
}

export function CifraGrid({ children }: { children: ReactNode }) {
  return <div className="cifra-grid">{children}</div>;
}

/* ── Tabla ────────────────────────────────────────────────────────────────── */

export function Tabla({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <div className="tabla">
      <table>
        {caption && <caption className="sr-only">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}

export function Th({
  children,
  align,
  ...rest
}: { children: ReactNode; align?: "left" | "right" } & ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={align === "right" ? "num" : undefined} {...rest}>
      {children}
    </th>
  );
}

export function Td({
  children,
  align,
  secondary,
  numeric,
  className,
  ...rest
}: {
  children?: ReactNode;
  align?: "left" | "right";
  secondary?: boolean;
  numeric?: boolean;
  className?: string;
} & TdHTMLAttributes<HTMLTableCellElement>) {
  const clases = [align === "right" || numeric ? "num" : null, secondary ? "secundario" : null, className]
    .filter(Boolean)
    .join(" ");
  return (
    <td className={clases || undefined} {...rest}>
      {children}
    </td>
  );
}

/**
 * Fila de tabla con enlace estirado a toda la fila.
 *
 * `FilaEnlace` solo pone `position: relative` en el `<tr>`; el enlace real
 * vive DENTRO del primer `Td` como `<EnlaceFila href="…">texto</EnlaceFila>`
 * — su `::after` (definido en admin.css) se estira con `inset: 0` y cubre
 * toda la fila sin romper las demás columnas. Cualquier otro control
 * interactivo (enlace, botón, form) dentro de la misma fila necesita la
 * clase `sobre-fila` (`position: relative; z-index: 1`) para quedar por
 * encima del área estirada y seguir siendo clicable.
 */
export function FilaEnlace({ children }: { children: ReactNode }) {
  return <tr className="fila-enlace">{children}</tr>;
}

export function EnlaceFila({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="fila-enlace-ancla">
      {children}
    </Link>
  );
}

/* ── Insignia ─────────────────────────────────────────────────────────────── */

export function Insignia({ children, tone }: { children: ReactNode; tone: Tono }) {
  return <span className={`insignia insignia-${tone}`}>{children}</span>;
}

/* ── Botón ────────────────────────────────────────────────────────────────── */

export function Boton({
  children,
  tone = "secundario",
  href,
  type = "button",
  disabled,
  external,
  className,
  onClick,
}: {
  children: ReactNode;
  tone?: "primario" | "secundario" | "peligro" | "texto";
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  external?: boolean;
  className?: string;
  /** Solo para botones fuera de un <form> (p. ej. "Volver a intentar" en error.tsx). */
  onClick?: () => void;
}) {
  const clases = ["boton", `boton-${tone}`, className].filter(Boolean).join(" ");
  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noreferrer" className={clases}>
          {children} ↗
        </a>
      );
    }
    return (
      <Link href={href} className={clases}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} disabled={disabled} className={clases} onClick={onClick}>
      {children}
    </button>
  );
}

/* ── Banner ───────────────────────────────────────────────────────────────── */

export function Banner({ children, tone }: { children: ReactNode; tone: "info" | "aviso" | "error" }) {
  return (
    <div className={`banner banner-${tone}`} role={tone === "error" ? "alert" : undefined}>
      {children}
    </div>
  );
}

/* ── Estado vacío / Tarjeta ───────────────────────────────────────────────── */

export function EstadoVacio({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="estado-vacio">
      <p className="estado-vacio-titulo">{title}</p>
      {body && <p className="estado-vacio-cuerpo">{body}</p>}
      {action && <div className="estado-vacio-accion">{action}</div>}
    </div>
  );
}

export function Tarjeta({
  title,
  children,
  padding = "normal",
}: {
  title?: string;
  children: ReactNode;
  padding?: "normal" | "compacta";
}) {
  return (
    <div className={`tarjeta${padding === "compacta" ? " tarjeta-compacta" : ""}`}>
      {title && <h2 className="tarjeta-titulo etiqueta etiqueta-seccion">{title}</h2>}
      {children}
    </div>
  );
}

/* ── Formularios ──────────────────────────────────────────────────────────── */

export function Campo({
  label,
  hint,
  htmlFor,
  children,
  required,
}: {
  label: ReactNode;
  hint?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div className="campo">
      <label className="etiqueta" htmlFor={htmlFor}>
        {label}
        {required ? " *" : null}
      </label>
      {children}
      {hint && <p className="pista">{hint}</p>}
    </div>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`input${className ? ` ${className}` : ""}`} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`input${className ? ` ${className}` : ""}`} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`input${className ? ` ${className}` : ""}`} {...props}>
      {children}
    </select>
  );
}

export function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: ReactNode;
  defaultChecked?: boolean;
}) {
  return (
    <label className="campo-checkbox">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      <span>{label}</span>
    </label>
  );
}

/* ── Filtros, conteo, paginación ──────────────────────────────────────────── */

export function Filtros({
  items,
}: {
  items: { href: string; label: string; count?: number; active?: boolean }[];
}) {
  return (
    <nav className="filtros" aria-label="Filtros">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="filtro-enlace"
          aria-current={item.active ? "page" : undefined}
        >
          <span>{item.label}</span>
          {typeof item.count === "number" && <span className="filtro-conteo">{item.count}</span>}
        </Link>
      ))}
    </nav>
  );
}

export function Conteo({ n, singular, plural }: { n: number; singular: string; plural: string }) {
  return (
    <p className="conteo">
      <strong>{n}</strong> {n === 1 ? singular : plural}
    </p>
  );
}

export function Paginacion({
  page,
  pages,
  hrefFor,
}: {
  page: number;
  pages: number;
  hrefFor: (page: number) => string;
}) {
  if (pages <= 1) return null;
  const anterior = page > 1;
  const siguiente = page < pages;
  return (
    <p className="paginacion">
      {anterior ? (
        <Link href={hrefFor(page - 1)}>← Anteriores</Link>
      ) : (
        <span className="paginacion-desactivado">← Anteriores</span>
      )}
      <span>
        · Página {page} de {pages} ·
      </span>
      {siguiente ? (
        <Link href={hrefFor(page + 1)}>Siguientes →</Link>
      ) : (
        <span className="paginacion-desactivado">Siguientes →</span>
      )}
    </p>
  );
}

/* ── Detalle / DatoLista / Volver ─────────────────────────────────────────── */

export function Detalle({
  summary,
  children,
  open,
}: {
  summary: ReactNode;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details className="detalle" open={open}>
      <summary>{summary}</summary>
      <div className="detalle-contenido">{children}</div>
    </details>
  );
}

export function DatoLista({
  items,
  columns = 2,
}: {
  items: { label: string; value: ReactNode }[];
  columns?: 1 | 2 | 3;
}) {
  return (
    <dl className={`dato-lista${columns === 3 ? " columnas-3" : columns === 1 ? " columnas-1" : ""}`}>
      {items.map((item, i) => (
        <div key={i}>
          <dt className="etiqueta">{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Volver({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="volver">
      ← {children}
    </Link>
  );
}

/* ── Formulario guiado ────────────────────────────────────────────────────── */

export function PasoGuiado({
  numero,
  pregunta,
  hint,
  children,
}: {
  numero: string;
  pregunta: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="paso">
      <span className="paso-numero">{numero}</span>
      <h3 className="paso-pregunta">{pregunta}</h3>
      {hint && <p className="paso-hint">{hint}</p>}
      {children}
    </div>
  );
}

export function AntesDeConfirmar({ children, boton }: { children: ReactNode; boton: ReactNode }) {
  return (
    <div className="antes-de-confirmar">
      <Etiqueta>Antes de confirmar</Etiqueta>
      {typeof children === "string" ? <p>{children}</p> : children}
      {boton}
    </div>
  );
}
