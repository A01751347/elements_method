/**
 * Placeholder legal documents. Replaced by client once their abogado delivers
 * the real templates (per cronograma Semana 0, P-04).
 *
 * Template engine uses {{placeholder}} syntax. Supported placeholders today:
 *   {{buyer_name}}, {{buyer_email}}, {{buyer_phone}}, {{buyer_company}},
 *   {{buyer_rfc}}, {{buyer_address}}, {{order_folio}}, {{order_date}},
 *   {{product_names}}, {{total_amount}}, {{currency}}, {{language}}
 */

import type { DocumentTemplate } from "../schema/documents";

type DocumentSeed = Pick<
  DocumentTemplate,
  | "slug"
  | "nameEs"
  | "nameEn"
  | "templateHtmlEs"
  | "templateHtmlEn"
  | "requiredForPurchase"
  | "acceptanceType"
  | "appliesTo"
>;

const PLACEHOLDER_NOTE_ES = `
<p style="background:#fffae6;border-left:3px solid #d4a017;padding:12px;font-size:13px;">
  Plantilla provisional. El texto definitivo lo entrega el abogado del cliente
  antes del go-live. Los placeholders <code>{{...}}</code> se rellenan
  automáticamente con los datos del comprador.
</p>`;

const PLACEHOLDER_NOTE_EN = `
<p style="background:#fffae6;border-left:3px solid #d4a017;padding:12px;font-size:13px;">
  Provisional template. The client's lawyer delivers the definitive text before
  go-live. <code>{{...}}</code> placeholders are filled in automatically from the
  buyer's order data.
</p>`;

export const documentSeeds: DocumentSeed[] = [
  {
    slug: "contrato-servicios",
    nameEs: "Contrato de servicios",
    nameEn: "Services agreement",
    templateHtmlEs: `${PLACEHOLDER_NOTE_ES}
<h1>Contrato de prestación de servicios</h1>
<p>Entre <strong>Elements Method</strong> y <strong>{{buyer_name}}</strong>
  ({{buyer_email}}, {{buyer_phone}})
  {{buyer_company}}
  con fecha <strong>{{order_date}}</strong> y folio <strong>{{order_folio}}</strong>.</p>
<h2>Objeto</h2>
<p>Elements Method presta los servicios correspondientes al producto contratado:
  <strong>{{product_names}}</strong>, por un total de <strong>{{total_amount}} {{currency}}</strong>
  (más IVA).</p>
<h2>Condiciones</h2>
<p>Las condiciones específicas, calendarios y entregables se rigen por el material
  de programa entregado al participante. El presente contrato será sustituido por
  el texto definitivo revisado por el abogado del cliente.</p>
`,
    templateHtmlEn: `${PLACEHOLDER_NOTE_EN}
<h1>Services agreement</h1>
<p>Between <strong>Elements Method</strong> and <strong>{{buyer_name}}</strong>
  ({{buyer_email}}, {{buyer_phone}})
  {{buyer_company}}
  dated <strong>{{order_date}}</strong> with folio <strong>{{order_folio}}</strong>.</p>
<h2>Object</h2>
<p>Elements Method delivers the services for the contracted product:
  <strong>{{product_names}}</strong>, for a total of <strong>{{total_amount}} {{currency}}</strong>
  (plus VAT).</p>
<h2>Conditions</h2>
<p>Specific conditions, schedules and deliverables are governed by the program
  materials given to the participant. This agreement will be replaced by the
  definitive text reviewed by the client's lawyer.</p>
`,
    requiredForPurchase: true,
    acceptanceType: "check_only",
    appliesTo: "ambos",
  },
  {
    slug: "responsiva",
    nameEs: "Responsiva de responsabilidad",
    nameEn: "Liability release",
    templateHtmlEs: `${PLACEHOLDER_NOTE_ES}
<h1>Responsiva de responsabilidad</h1>
<p>El abajo firmante, <strong>{{buyer_name}}</strong>, manifiesta su conformidad
  con participar en la actividad <strong>{{product_names}}</strong> programada en
  fecha referida en el folio <strong>{{order_folio}}</strong>.</p>
<p>El participante reconoce los riesgos inherentes a las actividades en la naturaleza,
  declara encontrarse en condiciones físicas adecuadas y libera a Elements Method
  de responsabilidad por cualquier eventualidad que no derive de negligencia comprobable.</p>
<p>Email de contacto: <strong>{{buyer_email}}</strong>.</p>
`,
    templateHtmlEn: `${PLACEHOLDER_NOTE_EN}
<h1>Liability release</h1>
<p>The undersigned, <strong>{{buyer_name}}</strong>, agrees to participate in the
  activity <strong>{{product_names}}</strong> scheduled per folio
  <strong>{{order_folio}}</strong>.</p>
<p>The participant acknowledges the inherent risks of nature-based activities,
  confirms adequate physical condition, and releases Elements Method from
  responsibility for any eventuality not arising from demonstrable negligence.</p>
<p>Contact email: <strong>{{buyer_email}}</strong>.</p>
`,
    requiredForPurchase: true,
    acceptanceType: "check_only",
    appliesTo: "persona",
  },
  {
    slug: "nda",
    nameEs: "Acuerdo de confidencialidad (NDA)",
    nameEn: "Non-disclosure agreement (NDA)",
    templateHtmlEs: `${PLACEHOLDER_NOTE_ES}
<h1>Acuerdo de confidencialidad</h1>
<p>Entre <strong>Elements Method</strong> y <strong>{{buyer_name}}</strong>
  ({{buyer_company}}, {{buyer_email}}), con fecha <strong>{{order_date}}</strong>.</p>
<h2>Información confidencial</h2>
<p>Todo material de programa, framework, dinámica grupal, identidad de otros
  participantes y conversaciones sostenidas durante las sesiones son confidenciales.</p>
<p>El participante se compromete a no divulgar dicha información a terceros sin
  autorización expresa por escrito de Elements Method.</p>
`,
    templateHtmlEn: `${PLACEHOLDER_NOTE_EN}
<h1>Non-disclosure agreement</h1>
<p>Between <strong>Elements Method</strong> and <strong>{{buyer_name}}</strong>
  ({{buyer_company}}, {{buyer_email}}), dated <strong>{{order_date}}</strong>.</p>
<h2>Confidential information</h2>
<p>All program materials, frameworks, group dynamics, identity of other
  participants, and conversations held during sessions are confidential.</p>
<p>The participant agrees not to disclose said information to third parties
  without express written authorization from Elements Method.</p>
`,
    requiredForPurchase: true,
    acceptanceType: "check_only",
    appliesTo: "ambos",
  },
  {
    slug: "autorizacion-imagen",
    nameEs: "Autorización de uso de imagen",
    nameEn: "Image use authorization",
    templateHtmlEs: `${PLACEHOLDER_NOTE_ES}
<h1>Autorización de uso de imagen</h1>
<p><strong>{{buyer_name}}</strong> ({{buyer_email}}) autoriza a
  <strong>Elements Method</strong> el uso de fotografías y video tomados durante
  la actividad <strong>{{product_names}}</strong> con fines de comunicación
  institucional, redes sociales y materiales promocionales del programa.</p>
<p>Esta autorización es revocable por escrito en cualquier momento.</p>
`,
    templateHtmlEn: `${PLACEHOLDER_NOTE_EN}
<h1>Image use authorization</h1>
<p><strong>{{buyer_name}}</strong> ({{buyer_email}}) authorizes
  <strong>Elements Method</strong> to use photographs and video taken during the
  activity <strong>{{product_names}}</strong> for institutional communication,
  social media, and promotional materials of the program.</p>
<p>This authorization is revocable in writing at any time.</p>
`,
    requiredForPurchase: false,
    acceptanceType: "check_only",
    appliesTo: "persona",
  },
];
