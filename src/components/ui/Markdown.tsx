import type { ReactNode } from "react";

/**
 * Markdown renderer propio de Elements Method — sin dependencias.
 *
 * Traduce el subset de Markdown que produce el CMS (encabezados, negritas,
 * cursivas, código, citas, listas, enlaces, imágenes, tablas, separadores y
 * bloques de código) a la tipografía y paleta oficiales del sitio:
 * Cormorant para títulos, Jost para cuerpo, Oro como acento.
 */

/* ─── Inline ──────────────────────────────────────────────────────────── */

const INLINE_RE =
  /(!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\))|(\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\))|(`([^`]+)`)|(\*\*\*([^*]+)\*\*\*)|(\*\*([^*]+)\*\*)|(\*([^*\s][^*]*)\*)|(_([^_\s][^_]*)_)/g;

function parseInline(text: string, keyPrefix = "i"): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(INLINE_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) nodes.push(text.slice(last, idx));
    const key = `${keyPrefix}-${k++}`;

    if (m[1]) {
      // Imagen inline ![alt](src)
      nodes.push(
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={key}
          src={m[3]}
          alt={m[2]}
          className="my-8 w-full object-cover"
          loading="lazy"
        />,
      );
    } else if (m[4]) {
      // Enlace [texto](url)
      const href = m[6];
      const external = /^https?:\/\//.test(href);
      nodes.push(
        <a
          key={key}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="text-[var(--color-ink)] underline decoration-[var(--color-gold)] decoration-1 underline-offset-4 transition-colors hover:text-[var(--color-gold-deep)] hover:decoration-[var(--color-gold-deep)]"
        >
          {parseInline(m[5], key)}
        </a>,
      );
    } else if (m[7]) {
      // Código inline
      nodes.push(
        <code
          key={key}
          className="rounded-[2px] border border-[var(--color-line)] bg-[var(--color-paper-warm)] px-1.5 py-0.5 font-mono text-[0.85em] text-[var(--color-fire-ink)]"
        >
          {m[8]}
        </code>,
      );
    } else if (m[9]) {
      // ***negrita cursiva***
      nodes.push(
        <strong key={key} className="font-medium text-[var(--color-ink)]">
          <em>{parseInline(m[10], key)}</em>
        </strong>,
      );
    } else if (m[11]) {
      // **negrita**
      nodes.push(
        <strong key={key} className="font-medium text-[var(--color-ink)]">
          {parseInline(m[12], key)}
        </strong>,
      );
    } else if (m[13] || m[15]) {
      // *cursiva* / _cursiva_
      nodes.push(<em key={key}>{parseInline(m[14] ?? m[16], key)}</em>);
    }
    last = idx + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/* ─── Bloques ─────────────────────────────────────────────────────────── */

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; lines: string[] }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[]; start: number }
  | { type: "code"; lang: string; code: string }
  | { type: "hr" }
  | { type: "table"; header: string[]; rows: string[][] };

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

function parseBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Bloque de código ```lang
    const fence = trimmed.match(/^```(\S*)\s*$/);
    if (fence) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++; // cierre
      blocks.push({ type: "code", lang: fence[1] ?? "", code: buf.join("\n") });
      continue;
    }

    // Encabezado
    const heading = trimmed.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2] });
      i++;
      continue;
    }

    // Separador
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Cita
    if (trimmed.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        buf.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", lines: buf });
      continue;
    }

    // Lista sin orden
    if (/^[-*+]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*+]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Lista numerada
    const olStart = trimmed.match(/^(\d+)[.)]\s+/);
    if (olStart) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items, start: parseInt(olStart[1], 10) });
      continue;
    }

    // Tabla | a | b | con separador |---|---|
    if (
      trimmed.includes("|") &&
      i + 1 < lines.length &&
      /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]) &&
      lines[i + 1].includes("-")
    ) {
      const header = splitRow(trimmed);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      blocks.push({ type: "table", header, rows });
      continue;
    }

    // Párrafo — acumula hasta línea vacía u otro bloque
    const buf: string[] = [trimmed];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,6}\s|>|```|[-*+]\s|\d+[.)]\s|(-{3,}|\*{3,}|_{3,})$)/.test(lines[i].trim())
    ) {
      buf.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "paragraph", text: buf.join(" ") });
  }

  return blocks;
}

/* ─── Render ──────────────────────────────────────────────────────────── */

const HEADING_STYLES: Record<number, string> = {
  1: "font-[var(--font-display)] text-[clamp(1.9rem,3.2vw,2.6rem)] leading-[1.12] mt-14 mb-5",
  2: "font-[var(--font-display)] text-[clamp(1.6rem,2.6vw,2.15rem)] leading-[1.15] mt-14 mb-5",
  3: "font-[var(--font-display)] text-[clamp(1.35rem,2.1vw,1.7rem)] leading-[1.2] mt-12 mb-4",
};

function renderBlock(block: Block, key: number): ReactNode {
  switch (block.type) {
    case "heading": {
      const inline = parseInline(block.text, `h${key}`);
      if (block.level <= 3) {
        const Tag = block.level === 1 ? "h2" : block.level === 2 ? "h2" : "h3";
        return (
          <Tag key={key} className={`${HEADING_STYLES[block.level]} text-[var(--color-ink)]`}>
            {inline}
          </Tag>
        );
      }
      // h4+ — etiqueta tipo eyebrow con acento dorado
      return (
        <h4
          key={key}
          className="eyebrow mt-10 mb-4 flex items-center gap-3 text-[var(--color-gold-deep)]"
        >
          <span aria-hidden className="h-px w-6 bg-[var(--color-gold)]" />
          {inline}
        </h4>
      );
    }

    case "paragraph":
      return (
        <p key={key} className="my-5 leading-[1.75] text-[var(--color-ink-soft)]">
          {parseInline(block.text, `p${key}`)}
        </p>
      );

    case "quote":
      return (
        <blockquote
          key={key}
          className="relative my-10 border-l-2 border-[var(--color-gold)] bg-[var(--color-paper-warm)]/60 py-5 pl-7 pr-6"
        >
          <span
            aria-hidden
            className="absolute -left-[5px] top-5 h-2 w-2 rotate-45 bg-[var(--color-gold)]"
          />
          {block.lines
            .join("\n")
            .split(/\n\s*\n/)
            .filter((p) => p.trim())
            .map((p, j) => (
              <p
                key={j}
                className="font-[var(--font-display)] text-[1.25rem] italic leading-[1.5] text-[var(--color-ink)]"
              >
                {parseInline(p.replace(/\n/g, " "), `q${key}-${j}`)}
              </p>
            ))}
        </blockquote>
      );

    case "ul":
      return (
        <ul key={key} className="my-6 space-y-2.5">
          {block.items.map((item, j) => (
            <li key={j} className="flex gap-3.5 leading-[1.7] text-[var(--color-ink-soft)]">
              <span
                aria-hidden
                className="mt-[0.62em] h-1.5 w-1.5 shrink-0 rotate-45 bg-[var(--color-gold)]"
              />
              <span>{parseInline(item, `ul${key}-${j}`)}</span>
            </li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol key={key} className="my-6 space-y-2.5">
          {block.items.map((item, j) => (
            <li key={j} className="flex gap-3.5 leading-[1.7] text-[var(--color-ink-soft)]">
              <span
                aria-hidden
                className="w-6 shrink-0 text-right font-[var(--font-display)] text-[1.05rem] tabular-nums text-[var(--color-gold-deep)]"
              >
                {block.start + j}.
              </span>
              <span>{parseInline(item, `ol${key}-${j}`)}</span>
            </li>
          ))}
        </ol>
      );

    case "code":
      return (
        <figure key={key} className="my-8 overflow-hidden">
          {block.lang && block.lang !== "text" && (
            <figcaption className="border-b border-[var(--color-gold)]/25 bg-[var(--color-ink)] px-5 pt-3 pb-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-gold)]">
              {block.lang}
            </figcaption>
          )}
          <pre className="overflow-x-auto bg-[var(--color-ink)] p-5 text-[0.875rem] leading-[1.7] text-[var(--color-paper)]">
            <code className="font-mono">{block.code}</code>
          </pre>
        </figure>
      );

    case "hr":
      return (
        <div key={key} aria-hidden className="my-12 flex items-center gap-4">
          <span className="rule-fade h-px flex-1" />
          <span className="h-1.5 w-1.5 rotate-45 bg-[var(--color-gold)]" />
          <span className="rule-fade h-px flex-1" />
        </div>
      );

    case "table":
      return (
        <div key={key} className="my-8 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--color-gold)]/40">
                {block.header.map((cell, j) => (
                  <th
                    key={j}
                    className="px-4 py-3 font-sans text-[0.75rem] font-medium uppercase tracking-[0.14em] text-[var(--color-ink)]"
                  >
                    {parseInline(cell, `th${key}-${j}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-b border-[var(--color-line)]">
                  {row.map((cell, c) => (
                    <td key={c} className="px-4 py-3 align-top text-[0.95rem] text-[var(--color-ink-soft)]">
                      {parseInline(cell, `td${key}-${r}-${c}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export function Markdown({ content, className }: { content: string; className?: string }) {
  const blocks = parseBlocks(content);
  return (
    <div className={className}>{blocks.map((block, i) => renderBlock(block, i))}</div>
  );
}
