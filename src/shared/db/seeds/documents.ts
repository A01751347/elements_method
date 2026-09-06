/**
 * Legal document templates seeded into `document_templates`.
 *
 * The three documents every buyer accepts at checkout (contrato / NDA /
 * relevo) come from src/data/legalDocuments.ts — the same source the public
 * /legal/[slug] pages render — so the text a buyer reads on the site is the
 * text pinned (with its hash) in order_documents when they accept it.
 *
 * Bodies are lightweight markdown with {{TOKENS}}; see
 * src/shared/pdf/legalTokens.ts for the full token list and defaults.
 */

import type { DocumentTemplate } from "../schema/documents";
import { LEGAL_DOCUMENTS, LEGAL_DOCS_VERSION } from "../../../data/legalDocuments";

export type DocumentSeed = Pick<
  DocumentTemplate,
  | "slug"
  | "nameEs"
  | "nameEn"
  | "templateHtmlEs"
  | "templateHtmlEn"
  | "requiredForPurchase"
  | "acceptanceType"
  | "appliesTo"
> & {
  /** Version to stamp on the row; the seed snapshots it into document_versions. */
  currentVersion?: number;
};

const APPLIES: Record<string, DocumentSeed["appliesTo"]> = {
  terminos: "ambos",
  contrato: "ambos",
  nda: "ambos",
  relevo: "persona",
};

/**
 * Only the Terms are `requiredForPurchase` (the checkout checkbox). The
 * contrato / NDA / relevo are `signature_upload`: /api/checkout attaches them
 * to the order as pending and the payment-confirmation email carries one-time
 * /firmar links for the participant to sign them.
 */
const coreDocuments: DocumentSeed[] = LEGAL_DOCUMENTS.map((d) => ({
  slug: d.templateSlug,
  nameEs: d.titleEs,
  nameEn: d.titleEn,
  templateHtmlEs: d.bodyEs,
  templateHtmlEn: d.bodyEn,
  requiredForPurchase: d.stage === "checkout",
  acceptanceType: d.stage === "checkout" ? "check_only" : "signature_upload",
  appliesTo: APPLIES[d.slug] ?? "ambos",
  currentVersion: LEGAL_DOCS_VERSION,
}));

export const documentSeeds: DocumentSeed[] = [
  ...coreDocuments,
  {
    slug: "autorizacion-imagen",
    nameEs: "Autorización de uso de imagen",
    nameEn: "Image use authorization",
    templateHtmlEs: `# Autorización de uso de imagen

**{{PARTICIPANTE_NOMBRE}}** ({{PARTICIPANTE_EMAIL}}) autoriza a **{{ORGANIZADOR_RAZON_SOCIAL}}**, en términos del artículo 87 de la Ley Federal del Derecho de Autor, a captar y utilizar su imagen, voz y testimonio obtenidos durante el programa **{{NOMBRE_PROGRAMA}}**, con fines de comunicación institucional, redes sociales y materiales promocionales del programa, sin contraprestación y sin límite territorial.

Esta autorización es voluntaria, no condiciona la participación en el programa y puede revocarse en cualquier momento mediante aviso por escrito al correo {{ORGANIZADOR_EMAIL}}, sin efectos retroactivos sobre materiales ya publicados.

Aceptado en {{CIUDAD_FIRMA}}, el {{FECHA_FIRMA}}. Folio {{FOLIO}}.
`,
    templateHtmlEn: `# Image use authorization

**{{PARTICIPANTE_NOMBRE}}** ({{PARTICIPANTE_EMAIL}}) authorizes **{{ORGANIZADOR_RAZON_SOCIAL}}**, under Article 87 of the Mexican Federal Copyright Law, to capture and use their image, voice and testimonial obtained during the program **{{NOMBRE_PROGRAMA}}**, for institutional communication, social media and promotional materials of the program, without compensation and without territorial limit.

This authorization is voluntary, is not a condition of participation and may be revoked at any time by written notice to {{ORGANIZADOR_EMAIL}}, without retroactive effect on materials already published.

Accepted in {{CIUDAD_FIRMA}}, on {{FECHA_FIRMA}}. Folio {{FOLIO}}.
`,
    requiredForPurchase: false,
    acceptanceType: "check_only",
    appliesTo: "persona",
    currentVersion: LEGAL_DOCS_VERSION,
  },
];
