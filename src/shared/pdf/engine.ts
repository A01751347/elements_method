import "server-only";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import crypto from "node:crypto";

/**
 * Minimal typographic PDF builder on top of pdf-lib.
 *
 * pdf-lib has no layout engine, so this wraps the primitives we need for
 * receipts and legal documents: A4 pages with margins, auto-wrapping text,
 * headings, key/value rows, a totals table, and automatic page breaks. Colors
 * and spacing mirror the brand (ink on paper, gold accents) without trying to
 * be a pixel-perfect copy of the website.
 */

const A4 = { width: 595.28, height: 841.89 };
const MARGIN = 56;
const INK = rgb(0.17, 0.17, 0.16);
const INK_SOFT = rgb(0.35, 0.34, 0.32);
const MUTED = rgb(0.55, 0.54, 0.5);
const GOLD = rgb(0.72, 0.55, 0.23);
const LINE = rgb(0.85, 0.83, 0.79);

export interface PdfMeta {
  title: string;
  subtitle?: string;
}

export class PdfBuilder {
  private doc!: PDFDocument;
  private page!: PDFPage;
  private font!: PDFFont;
  private bold!: PDFFont;
  private y = 0;

  static async create(meta: PdfMeta): Promise<PdfBuilder> {
    const b = new PdfBuilder();
    b.doc = await PDFDocument.create();
    b.doc.setTitle(meta.title);
    b.doc.setProducer("Elements Method");
    b.font = await b.doc.embedFont(StandardFonts.Helvetica);
    b.bold = await b.doc.embedFont(StandardFonts.HelveticaBold);
    b.newPage();
    b.header(meta);
    return b;
  }

  private newPage() {
    this.page = this.doc.addPage([A4.width, A4.height]);
    this.y = A4.height - MARGIN;
  }

  /** Ensure `needed` vertical space; add a page if we would overflow. */
  private ensure(needed: number) {
    if (this.y - needed < MARGIN) this.newPage();
  }

  private header(meta: PdfMeta) {
    this.page.drawText("ELEMENTS METHOD", {
      x: MARGIN,
      y: this.y,
      size: 10,
      font: this.bold,
      color: GOLD,
    });
    this.y -= 26;
    this.page.drawText(toWinAnsi(meta.title), {
      x: MARGIN,
      y: this.y,
      size: 20,
      font: this.bold,
      color: INK,
    });
    this.y -= 20;
    if (meta.subtitle) {
      this.page.drawText(toWinAnsi(meta.subtitle), {
        x: MARGIN,
        y: this.y,
        size: 10,
        font: this.font,
        color: MUTED,
      });
      this.y -= 18;
    }
    this.divider();
  }

  divider() {
    this.ensure(16);
    this.y -= 6;
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: A4.width - MARGIN, y: this.y },
      thickness: 0.75,
      color: LINE,
    });
    this.y -= 14;
  }

  heading(text: string) {
    this.ensure(30);
    this.y -= 8;
    this.page.drawText(toWinAnsi(text), {
      x: MARGIN,
      y: this.y,
      size: 12,
      font: this.bold,
      color: INK,
    });
    this.y -= 18;
  }

  /** Split a string into lines that fit the content width at `size`. */
  private wrap(text: string, font: PDFFont, size: number): string[] {
    const maxWidth = A4.width - MARGIN * 2;
    const out: string[] = [];
    for (const rawLine of toWinAnsi(text).split("\n")) {
      if (rawLine.trim() === "") {
        out.push("");
        continue;
      }
      let line = "";
      for (const word of rawLine.split(/\s+/)) {
        const candidate = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
          out.push(line);
          line = word;
        } else {
          line = candidate;
        }
      }
      if (line) out.push(line);
    }
    return out;
  }

  paragraph(text: string, opts: { size?: number; color?: typeof INK } = {}) {
    const size = opts.size ?? 10.5;
    const color = opts.color ?? INK_SOFT;
    const lineHeight = size * 1.5;
    for (const line of this.wrap(text, this.font, size)) {
      this.ensure(lineHeight);
      if (line !== "") {
        this.page.drawText(line, {
          x: MARGIN,
          y: this.y,
          size,
          font: this.font,
          color,
        });
      }
      this.y -= lineHeight;
    }
    this.y -= 4;
  }

  /** A label: value row (e.g. "Folio: EM-2607-0042"). */
  kv(label: string, value: string) {
    this.ensure(18);
    this.page.drawText(toWinAnsi(label), {
      x: MARGIN,
      y: this.y,
      size: 9,
      font: this.bold,
      color: MUTED,
    });
    this.page.drawText(toWinAnsi(value), {
      x: MARGIN + 150,
      y: this.y,
      size: 10.5,
      font: this.font,
      color: INK,
    });
    this.y -= 18;
  }

  /** Right-aligned totals row (amount aligned to the right margin). */
  totalRow(label: string, amount: string, opts: { bold?: boolean } = {}) {
    this.ensure(20);
    const font = opts.bold ? this.bold : this.font;
    const size = opts.bold ? 12 : 10.5;
    this.page.drawText(toWinAnsi(label), {
      x: MARGIN,
      y: this.y,
      size,
      font,
      color: opts.bold ? INK : INK_SOFT,
    });
    const safeAmount = toWinAnsi(amount);
    const amtWidth = font.widthOfTextAtSize(safeAmount, size);
    this.page.drawText(safeAmount, {
      x: A4.width - MARGIN - amtWidth,
      y: this.y,
      size,
      font,
      color: opts.bold ? INK : INK_SOFT,
    });
    this.y -= opts.bold ? 22 : 18;
  }

  footer(text: string) {
    const pages = this.doc.getPages();
    pages.forEach((p) => {
      p.drawText(toWinAnsi(text), {
        x: MARGIN,
        y: MARGIN - 24,
        size: 7.5,
        font: this.font,
        color: MUTED,
      });
    });
  }

  spacer(px = 10) {
    this.y -= px;
  }

  /** Finalize → bytes + a sha256 hash for the immutable snapshot. */
  async finish(): Promise<{ bytes: Uint8Array; hash: string }> {
    const bytes = await this.doc.save();
    const hash = crypto.createHash("sha256").update(bytes).digest("hex");
    return { bytes, hash };
  }
}

/**
 * Replace {{TOKEN}} placeholders in a template with real values. Unknown tokens
 * are left visible (wrapped in ‹…›) so a missing value is obvious in the output
 * rather than silently blank.
 */
export function fillTokens(
  template: string,
  values: Record<string, string | number | null | undefined>,
): string {
  return template.replace(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g, (_m, key: string) => {
    const v = values[key];
    if (v === undefined || v === null || v === "") return `‹${key}›`;
    return String(v);
  });
}

/** Strip lightweight markdown (headings, bold, blockquotes) to plain text
 *  lines the PDF paragraph renderer can lay out. Keeps structure readable. */
export function markdownToBlocks(
  md: string,
): { type: "heading" | "para"; text: string }[] {
  const blocks: { type: "heading" | "para"; text: string }[] = [];
  for (const rawLine of md.split("\n")) {
    const line = rawLine.replace(/\*\*(.+?)\*\*/g, "$1").replace(/^>\s?/, "");
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      blocks.push({ type: "heading", text: heading[2].trim() });
    } else if (line.trim() === "") {
      // paragraph break — represented by starting a new para block
      if (blocks.length && blocks[blocks.length - 1].text !== "")
        blocks.push({ type: "para", text: "" });
    } else {
      const last = blocks[blocks.length - 1];
      if (last && last.type === "para" && last.text !== "") {
        last.text += "\n" + line;
      } else {
        blocks.push({ type: "para", text: line });
      }
    }
  }
  return blocks.filter((b) => b.text !== "" || b.type === "para");
}

/**
 * Helvetica estándar solo codifica WinAnsi: un carácter fuera de esa tabla
 * (una flecha, un guion largo raro, un emoji pegado por el abogado) hace que
 * pdf-lib lance y el documento devuelva 500. Se traduce lo traducible y el
 * resto cae a un espacio.
 */
const WIN_ANSI_MAP: Record<string, string> = {
  "\u2018": "'", "\u2019": "'", "\u201A": ",", "\u201C": '"', "\u201D": '"',
  "\u201E": '"', "\u2013": "-", "\u2014": "\u2014", "\u2026": "...",
  "\u2022": "\u2022", "\u00A0": " ", "\u2192": "->", "\u2190": "<-",
  "\u2264": "<=", "\u2265": ">=", "\u00D7": "x", "\u2713": "-", "\u2714": "-",
  "\u200B": "", "\uFEFF": "", "\u2039": "<", "\u203A": ">",
};

export function toWinAnsi(text: string): string {
  let out = "";
  for (const char of text) {
    const mapped = WIN_ANSI_MAP[char];
    if (mapped !== undefined) {
      out += mapped;
      continue;
    }
    const code = char.codePointAt(0) ?? 0;
    // ASCII imprimible, salto de línea y Latin-1 pasan tal cual.
    out += code === 10 || (code >= 32 && code <= 126) || (code >= 160 && code <= 255)
      ? char
      : " ";
  }
  return out;
}

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  aacute: "\u00E1", eacute: "\u00E9", iacute: "\u00ED", oacute: "\u00F3",
  uacute: "\u00FA", ntilde: "\u00F1", Ntilde: "\u00D1", uuml: "\u00FC",
  Aacute: "\u00C1", Eacute: "\u00C9", Iacute: "\u00CD", Oacute: "\u00D3",
  Uacute: "\u00DA", laquo: "\u00AB", raquo: "\u00BB", hellip: "...",
  mdash: "\u2014", ndash: "-", rsquo: "'", lsquo: "'", ldquo: '"', rdquo: '"',
  deg: "\u00B0", middot: "\u00B7", euro: "\u20AC", copy: "\u00A9", reg: "\u00AE",
};

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_m, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_m, n: string) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-zA-Z]+);/g, (m, name: string) => ENTITIES[name] ?? m);
}

/**
 * Convierte el HTML de una plantilla legal en los bloques que sabe pintar el
 * renderizador. Las plantillas se guardan como HTML (`template_html_es`), pero
 * el PDF las trataba como markdown: cada <p>, <h1> y <strong> salía impreso
 * como texto en el documento que descarga el comprador.
 */
export function htmlToBlocks(
  html: string,
): { type: "heading" | "para"; text: string }[] {
  let s = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "");

  s = s
    .replace(/<li[^>]*>/gi, "\n\u2022 ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<h([1-6])[^>]*>/gi, (_m, n: string) => `\n\n${"#".repeat(Number(n))} `)
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<\/(p|div|section|article|ul|ol|table|tr|blockquote)>/gi, "\n\n")
    .replace(/<(p|div|section|article|ul|ol|table|tr|blockquote)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "");

  s = decodeEntities(s)
    .split("\n")
    .map((line) => line.replace(/[ \t\u00A0]+/g, " ").trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return markdownToBlocks(s);
}

/** Una plantilla viene en HTML o en markdown; se detecta y se usa la correcta. */
export function templateToBlocks(
  body: string,
): { type: "heading" | "para"; text: string }[] {
  const looksHtml = /<\/?(p|h[1-6]|ul|ol|li|br|div|strong|em|span|table)\b/i.test(body);
  return looksHtml ? htmlToBlocks(body) : markdownToBlocks(body);
}
