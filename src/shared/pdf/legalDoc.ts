import "server-only";
import { PdfBuilder, fillTokens, templateToBlocks } from "./engine";

export interface LegalDocInput {
  /** Document display name, e.g. "Contrato de Participación". */
  name: string;
  /** Markdown template body with {{TOKEN}} placeholders. */
  templateMarkdown: string;
  /** Token → value map to fill the placeholders. */
  tokens: Record<string, string | number | null | undefined>;
  /** Reference shown in header/footer (folio or doc id). */
  reference?: string;
}

/**
 * Build a personalized legal-document PDF: fills {{TOKEN}} placeholders with the
 * buyer's data, then renders the markdown as headings + paragraphs. Returns
 * bytes + sha256 hash so the accepted version can be snapshotted immutably in
 * order_documents.generatedPdfHash.
 */
export async function buildLegalDocPdf(
  input: LegalDocInput,
): Promise<{ bytes: Uint8Array; hash: string }> {
  const filled = fillTokens(input.templateMarkdown, input.tokens);
  const blocks = templateToBlocks(filled);

  const pdf = await PdfBuilder.create({
    title: input.name,
    subtitle: input.reference ? `Ref: ${input.reference}` : undefined,
  });

  for (const block of blocks) {
    if (block.type === "heading") {
      pdf.heading(block.text);
    } else if (block.text.trim() !== "") {
      pdf.paragraph(block.text);
    } else {
      pdf.spacer(6);
    }
  }

  pdf.footer(
    `Elements Method · ${input.name}${input.reference ? ` · ${input.reference}` : ""} · ${new Date().getFullYear()}`,
  );
  return pdf.finish();
}
