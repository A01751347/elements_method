/**
 * Legal documents — single source of truth for the four legal texts.
 *
 *   - Términos y Condiciones de Compra: the ONE adhesion contract accepted at
 *     checkout (checkbox + link) — LFPC arts. 76 Bis, 85-87.
 *   - Contrato de Participación, Acuerdo de Confidencialidad, Consentimiento
 *     Informado y Relevo: sent to participants AFTER payment is confirmed, as
 *     one-time signing links (/firmar/[token]); never shown at checkout.
 *
 * Consumed by:
 *   - src/data/launchData.ts → `legalDocs` (public /legal/[slug] pages)
 *   - src/shared/db/seeds/documents.ts → `document_templates` (checkout gate,
 *     personalized PDFs at /api/documento/[slug], confirmation emails)
 *
 * Format: lightweight markdown (#/##/### headings, "- " lists, **bold**,
 * "---" rules) — the subset both the web renderer and the PDF engine support.
 * `{{TOKENS}}` are filled from the order + env by src/shared/pdf/legalTokens.ts.
 *
 * Drafted against Mexican federal law (Código Civil Federal, Código de
 * Comercio, Ley Federal de Protección al Consumidor, LFPDPPP, Ley Federal del
 * Derecho de Autor, Ley Federal de Protección a la Propiedad Industrial).
 * Spanish is the governing text; English is a courtesy translation.
 */

export type LegalDocSlug = "terminos" | "contrato" | "nda" | "relevo";

export interface LegalDocument {
  slug: LegalDocSlug;
  /** Slug of the matching row in `document_templates`. */
  templateSlug: string;
  /**
   * `checkout`: accepted with a checkbox before paying.
   * `post-purchase`: signed by the participant after payment via /firmar links.
   */
  stage: "checkout" | "post-purchase";
  titleEs: string;
  titleEn: string;
  summaryEs: string;
  summaryEn: string;
  bodyEs: string;
  bodyEn: string;
}

/** Bump whenever the wording of any document changes materially. */
export const LEGAL_DOCS_VERSION = 2;

/** Distinct {{TOKENS}} used in a body, in order of first appearance. */
export function extractLegalTokens(body: string): string[] {
  const seen = new Set<string>();
  for (const m of body.matchAll(/\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g)) seen.add(`{{${m[1]}}}`);
  return [...seen];
}

// ────────────────────────────────────────────────────────────────────────────
// 0. TÉRMINOS Y CONDICIONES DE COMPRA (contrato de adhesión — checkout)
// ────────────────────────────────────────────────────────────────────────────

const TERMINOS_ES = `**Contrato de adhesión** · Versión 1.0 · Vigente a partir del 5 de septiembre de 2026

Los presentes Términos y Condiciones de Compra (los "Términos") constituyen el contrato de adhesión que rige la contratación en línea de los programas y experiencias de Elements Method ofrecidos en www.elementsmethod.com (el "Sitio") por **{{ORGANIZADOR_RAZON_SOCIAL}}** (el "Proveedor"), con Registro Federal de Contribuyentes {{ORGANIZADOR_RFC}}, domicilio en {{ORGANIZADOR_DOMICILIO}} y correo electrónico de contacto {{ORGANIZADOR_EMAIL}}. Se ponen a disposición del consumidor antes de la transacción en cumplimiento del artículo 76 Bis de la Ley Federal de Protección al Consumidor.

Al marcar la casilla "He leído y acepto los Términos y Condiciones" y completar la compra, la persona que la realiza (el "Comprador") manifiesta su consentimiento expreso y se obliga conforme a lo siguiente:

### 1. Objeto
La compra reserva un lugar para el Comprador en el programa o experiencia seleccionado (el "Programa"), con las características publicadas en la ficha del Programa al momento de la compra: fechas, sede, duración, contenidos y lo que incluye y no incluye. Dicha ficha forma parte integrante de estos Términos.

El Programa es una experiencia de desarrollo personal y de liderazgo. No constituye tratamiento médico, psicológico ni psiquiátrico, ni asesoría profesional de ninguna naturaleza, y no garantiza resultados específicos.

### 2. Capacidad y datos del Comprador
El Comprador declara ser mayor de edad, contar con capacidad legal para contratar y proporcionar datos verídicos y completos: nombre, correo electrónico y teléfono de contacto, y en su caso la empresa que patrocina o paga su participación. Si una persona moral cubre el pago, el Comprador declara contar con su autorización; ello no genera relación laboral ni contractual alguna entre dicha persona moral y el Proveedor distinta del pago.

### 3. Precio y formas de pago
Los precios se expresan en pesos mexicanos (MXN) e **incluyen el Impuesto al Valor Agregado**. El precio aplicable es el mostrado en el Sitio al momento de la compra; los precios de acceso anticipado o preventa están sujetos a la fecha límite publicada.

El pago puede realizarse (a) con tarjeta bancaria a través de Stripe, procesador de pagos independiente que trata los datos de la tarjeta conforme a sus propias políticas y sin que el Proveedor los almacene, o (b) mediante depósito o transferencia electrónica (SPEI) a la cuenta que el Proveedor comunique por correo electrónico, usando el folio de la compra como concepto.

**La reservación se confirma únicamente cuando el Proveedor recibe y valida el pago total.** En pagos por depósito o transferencia, el Comprador dispone de cinco (5) días hábiles a partir de la compra para realizar el pago y enviar su comprobante; transcurrido ese plazo sin pago, el Proveedor podrá liberar el lugar sin responsabilidad.

El Proveedor expedirá el Comprobante Fiscal Digital por Internet (CFDI) con los datos fiscales que el Comprador proporcione dentro del mismo mes en que se realice el pago.

### 4. Confirmación y comunicaciones
Cada compra recibe un folio único. El Proveedor enviará al correo electrónico proporcionado la confirmación de la reserva, las instrucciones de pago cuando corresponda, el comprobante y las comunicaciones del Programa. El Comprador es responsable de la exactitud de su correo y de revisar su bandeja de entrada, incluida la carpeta de correo no deseado.

### 5. Derecho de revocación
De conformidad con los artículos 51 y 56 de la Ley Federal de Protección al Consumidor, por tratarse de una contratación celebrada fuera del establecimiento del Proveedor y por medios electrónicos, el Comprador puede revocar su consentimiento sin responsabilidad alguna dentro de los cinco (5) días hábiles siguientes a la compra, mediante aviso por escrito al correo {{ORGANIZADOR_EMAIL}}. El Proveedor reembolsará la totalidad de lo pagado dentro de los quince (15) días hábiles siguientes. Si el Programa inicia dentro de ese plazo, la revocación podrá ejercerse hasta antes del inicio.

### 6. Cancelación por el Comprador
Fuera del plazo de revocación, el Comprador puede cancelar mediante aviso por escrito al correo {{ORGANIZADOR_EMAIL}}, con las siguientes consecuencias respecto de la fecha de inicio del Programa:

- Con {{DIAS_CANCELACION_TOTAL}} días naturales o más de anticipación: reembolso del {{PORCENTAJE_REEMBOLSO_TOTAL}}% de lo pagado. El porcentaje restante cubre gastos administrativos y de reservación ya erogados.
- Con al menos {{DIAS_CANCELACION_PARCIAL}} y menos de {{DIAS_CANCELACION_TOTAL}} días naturales de anticipación: reembolso del {{PORCENTAJE_REEMBOLSO_PARCIAL}}% de lo pagado.
- Con menos de {{DIAS_CANCELACION_PARCIAL}} días naturales de anticipación, o por inasistencia: no habrá reembolso, en atención a los compromisos de sede, proveedores y cupo limitado ya asumidos por el Proveedor.

En los dos primeros supuestos el Comprador puede optar, en lugar del reembolso, por aplicar el 100% de lo pagado como crédito para una edición futura del mismo Programa o de otro de valor equivalente, dentro de los doce (12) meses siguientes y sujeto a disponibilidad. En cualquier supuesto, con al menos siete (7) días naturales de anticipación, el Comprador puede ceder su lugar a otra persona que cumpla los requisitos del Programa y acepte los documentos correspondientes. Los reembolsos se realizan al mismo medio de pago dentro de los quince (15) días hábiles siguientes a la solicitud.

### 7. Cambios o cancelación por el Proveedor
El Proveedor puede realizar ajustes razonables al itinerario, facilitadores, actividades o sede por causas justificadas (condiciones climatológicas, seguridad, disponibilidad de sede o proveedores), garantizando una experiencia de calidad y valor equivalentes, sin que ello dé lugar a reembolso.

Si el Proveedor cancela el Programa o modifica sus fechas, el Comprador puede elegir entre participar en la nueva fecha u otra edición, o el reembolso íntegro de lo pagado dentro de los quince (15) días hábiles siguientes. El Proveedor no responde de gastos de traslado u otros erogados por el Comprador frente a terceros, salvo dolo o negligencia. En caso fortuito o fuerza mayor (artículo 2111 del Código Civil Federal) el Programa se reprogramará y el Comprador conservará su lugar o un crédito por la totalidad de lo pagado con vigencia de doce (12) meses; si la reprogramación no fuera posible en ese plazo, procederá el reembolso íntegro.

### 8. Documentos de participación
La compra reserva el lugar. **La participación efectiva está condicionada** a que, antes del inicio del Programa y a través de los enlaces personales que el Proveedor enviará por correo una vez confirmado el pago, la persona participante acepte electrónicamente el Contrato de Participación, el Acuerdo de Confidencialidad y el Consentimiento Informado y Relevo de Responsabilidad, y complete el formulario de salud y contacto de emergencia. Los textos íntegros de esos documentos están disponibles en la sección Legal del Sitio para su consulta previa a la compra. La negativa a aceptarlos impide la participación y se tratará como cancelación por el Comprador conforme a la cláusula 6.

### 9. Conducta, salud y riesgos
La persona participante deberá observar el reglamento de la sede, las indicaciones de seguridad y las normas de convivencia del Programa, y abstenerse de consumir alcohol o sustancias no prescritas durante el mismo. El Proveedor podrá excluir, sin reembolso, a quien incumpla gravemente o ponga en riesgo su seguridad o la de otros. Las actividades implican riesgos inherentes que se describen en el Consentimiento Informado; el Proveedor implementa medidas razonables de seguridad y responde por dolo o negligencia conforme a la ley.

### 10. Propiedad intelectual
Las marcas, nombres, metodología, materiales, contenidos y diseños del Sitio y del Programa son propiedad del Proveedor o de sus licenciantes y están protegidos por la Ley Federal del Derecho de Autor y la Ley Federal de Protección a la Propiedad Industrial. La compra no otorga licencia alguna, salvo el uso personal y no comercial de los materiales que se entreguen.

### 11. Datos personales
Los datos personales del Comprador se tratan conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y al Aviso de Privacidad disponible en {{AVISO_PRIVACIDAD_URL}}, con las finalidades de gestionar la compra, el pago, la facturación y las comunicaciones del Programa. El Comprador puede ejercer sus derechos de acceso, rectificación, cancelación y oposición conforme a dicho aviso.

### 12. Seguridad en la transacción
El Proveedor utiliza medios técnicos para garantizar la confidencialidad y seguridad de la información proporcionada por el Comprador, en términos del artículo 76 Bis de la Ley Federal de Protección al Consumidor. El Proveedor nunca solicitará datos de tarjeta por correo electrónico ni mensajería.

### 13. Aceptación electrónica y conservación
Las partes reconocen que la manifestación de la voluntad mediante la casilla de aceptación y la conclusión de la compra constituye consentimiento expreso, con plena validez y fuerza probatoria, en términos de los artículos 1803, 1811 y 1834 Bis del Código Civil Federal y 89 a 95 del Código de Comercio. El Proveedor conservará el mensaje de datos con la versión aceptada de estos Términos, la fecha y hora de aceptación y su huella digital (hash), y enviará copia al correo del Comprador.

### 14. Atención al cliente y quejas
Cualquier duda, aclaración o queja puede dirigirse a {{ORGANIZADOR_EMAIL}}; el Proveedor responderá en un plazo máximo de cinco (5) días hábiles. Lo anterior no limita el derecho del Comprador de acudir a la Procuraduría Federal del Consumidor.

### 15. Disposiciones generales
La versión de estos Términos aceptada al momento de la compra rige esa operación; las modificaciones futuras aplicarán solo a compras posteriores. Si alguna disposición fuera declarada nula, las demás conservarán su validez. En caso de discrepancia entre la versión en español y su traducción al inglés, prevalecerá la versión en español. Estos Términos se rigen por las leyes de {{LEY_APLICABLE}}; para cualquier controversia las partes se someten a los tribunales competentes de {{CIUDAD_JURISDICCION}}, sin perjuicio del derecho del Comprador de acudir a la Procuraduría Federal del Consumidor.

## Datos de la operación
- Comprador: {{PARTICIPANTE_NOMBRE}} · {{PARTICIPANTE_EMAIL}} · {{PARTICIPANTE_TELEFONO}}
- Empresa: {{PARTICIPANTE_EMPRESA}}
- Programa: {{NOMBRE_PROGRAMA}}
- Total: {{INVERSION_MXN}} MXN, IVA incluido · Forma de pago: {{FORMA_DE_PAGO}}
- Folio: {{FOLIO}} · Aceptado en {{CIUDAD_FIRMA}} el {{FECHA_FIRMA}}
`;

const TERMINOS_EN = `**Adhesion contract** · Version 1.0 · In force from September 5, 2026

These Purchase Terms and Conditions (the "Terms") are the adhesion contract governing the online purchase of Elements Method programs and experiences offered at www.elementsmethod.com (the "Site") by **{{ORGANIZADOR_RAZON_SOCIAL}}** (the "Provider"), Mexican tax ID (RFC) {{ORGANIZADOR_RFC}}, address {{ORGANIZADOR_DOMICILIO}}, contact email {{ORGANIZADOR_EMAIL}}. They are made available to the consumer before the transaction in compliance with Article 76 Bis of the Mexican Federal Consumer Protection Law. This English text is a courtesy translation; the Spanish version governs.

By ticking the "I have read and accept the Terms and Conditions" box and completing the purchase, the person making it (the "Buyer") gives their express consent and agrees to the following:

### 1. Purpose
The purchase reserves a seat for the Buyer in the selected program or experience (the "Program"), with the characteristics published on the Program page at the time of purchase: dates, venue, duration, contents and what is and is not included. That page forms an integral part of these Terms.

The Program is a personal development and leadership experience. It is not medical, psychological or psychiatric treatment, nor professional advice of any kind, and it does not guarantee specific results.

### 2. Capacity and Buyer details
The Buyer declares that they are of legal age, have legal capacity to contract and provide true and complete details: name, email and contact phone, and where applicable the company sponsoring or paying for their participation. If a legal entity pays, the Buyer declares having its authorization; this creates no employment or contractual relationship between that entity and the Provider other than payment.

### 3. Price and payment methods
Prices are expressed in Mexican pesos (MXN) and **include Value Added Tax**. The applicable price is the one shown on the Site at the time of purchase; early-access or presale prices are subject to the published deadline.

Payment may be made (a) by bank card through Stripe, an independent payment processor that handles card data under its own policies without the Provider storing it, or (b) by bank deposit or electronic transfer (SPEI) to the account the Provider communicates by email, using the purchase folio as the concept.

**The reservation is confirmed only when the Provider receives and validates full payment.** For deposits or transfers, the Buyer has five (5) business days from purchase to pay and send proof of payment; after that period without payment the Provider may release the seat without liability.

The Provider shall issue the Mexican electronic tax receipt (CFDI) with the tax details the Buyer provides within the same month of payment.

### 4. Confirmation and communications
Each purchase receives a unique folio. The Provider shall send to the email provided the reservation confirmation, payment instructions where applicable, the receipt and Program communications. The Buyer is responsible for the accuracy of their email and for checking their inbox, including the spam folder.

### 5. Right of withdrawal
Pursuant to Articles 51 and 56 of the Mexican Federal Consumer Protection Law, as this contract is concluded away from the Provider's premises and by electronic means, the Buyer may withdraw their consent without any liability within five (5) business days after purchase, by written notice to {{ORGANIZADOR_EMAIL}}. The Provider shall refund the full amount paid within fifteen (15) business days. If the Program starts within that period, withdrawal may be exercised until the Program begins.

### 6. Cancellation by the Buyer
After the withdrawal period, the Buyer may cancel by written notice to {{ORGANIZADOR_EMAIL}}, with the following consequences relative to the Program start date:

- {{DIAS_CANCELACION_TOTAL}} calendar days or more in advance: refund of {{PORCENTAJE_REEMBOLSO_TOTAL}}% of the amount paid. The remaining percentage covers administrative and booking costs already incurred.
- At least {{DIAS_CANCELACION_PARCIAL}} and fewer than {{DIAS_CANCELACION_TOTAL}} calendar days in advance: refund of {{PORCENTAJE_REEMBOLSO_PARCIAL}}% of the amount paid.
- Fewer than {{DIAS_CANCELACION_PARCIAL}} calendar days in advance, or no-show: no refund, given the venue, provider and limited-capacity commitments already undertaken by the Provider.

In the first two cases the Buyer may choose, instead of a refund, to apply 100% of the amount paid as credit toward a future edition of the same Program or another of equivalent value, within the following twelve (12) months and subject to availability. In any case, with at least seven (7) calendar days' notice, the Buyer may transfer their seat to another person who meets the Program requirements and accepts the corresponding documents. Refunds are made to the original payment method within fifteen (15) business days of the request.

### 7. Changes or cancellation by the Provider
The Provider may make reasonable adjustments to the itinerary, facilitators, activities or venue for justified causes (weather, safety, venue or provider availability), ensuring an experience of equivalent quality and value, without this giving rise to a refund.

If the Provider cancels the Program or changes its dates, the Buyer may choose between attending the new date or another edition, or a full refund within fifteen (15) business days. The Provider is not liable for travel or other expenses incurred by the Buyer with third parties, except in cases of willful misconduct or negligence. In the event of force majeure (Article 2111 of the Mexican Federal Civil Code) the Program shall be rescheduled and the Buyer shall keep their seat or a credit for the full amount paid valid for twelve (12) months; if rescheduling is not possible within that period, a full refund shall apply.

### 8. Participation documents
The purchase reserves the seat. **Actual participation is conditional** on the participant, before the Program starts and through the personal links the Provider will email once payment is confirmed, electronically accepting the Participation Agreement, the Confidentiality Agreement and the Informed Consent and Release of Liability, and completing the health and emergency-contact form. The full texts of those documents are available in the Legal section of the Site for review before purchase. Refusal to accept them prevents participation and shall be treated as a cancellation by the Buyer under Clause 6.

### 9. Conduct, health and risks
The participant shall observe the venue's rules, safety instructions and the Program's community guidelines, and refrain from consuming alcohol or non-prescribed substances during the Program. The Provider may exclude, without refund, anyone who seriously breaches these obligations or endangers their own safety or that of others. The activities involve inherent risks described in the Informed Consent; the Provider implements reasonable safety measures and is liable for willful misconduct or negligence as provided by law.

### 10. Intellectual property
The trademarks, names, methodology, materials, contents and designs of the Site and the Program are the property of the Provider or its licensors and are protected by the Mexican Federal Copyright Law and the Federal Law for the Protection of Industrial Property. The purchase grants no license, other than personal, non-commercial use of the materials delivered.

### 11. Personal data
The Buyer's personal data are processed under the Mexican Federal Law on the Protection of Personal Data Held by Private Parties and the Privacy Notice available at {{AVISO_PRIVACIDAD_URL}}, for the purposes of managing the purchase, payment, invoicing and Program communications. The Buyer may exercise their rights of access, rectification, cancellation and objection as set out in that notice.

### 12. Transaction security
The Provider uses technical means to ensure the confidentiality and security of the information provided by the Buyer, under Article 76 Bis of the Mexican Federal Consumer Protection Law. The Provider will never request card details by email or messaging.

### 13. Electronic acceptance and record keeping
The parties acknowledge that the expression of will through the acceptance box and the completion of the purchase constitutes express consent, with full validity and evidentiary force, under Articles 1803, 1811 and 1834 Bis of the Mexican Federal Civil Code and Articles 89 to 95 of the Mexican Commercial Code. The Provider shall keep the data message with the accepted version of these Terms, the date and time of acceptance and its digital fingerprint (hash), and shall send a copy to the Buyer's email.

### 14. Customer service and complaints
Any question, clarification or complaint may be addressed to {{ORGANIZADOR_EMAIL}}; the Provider shall respond within a maximum of five (5) business days. This does not limit the Buyer's right to resort to the Federal Consumer Protection Agency (PROFECO).

### 15. General provisions
The version of these Terms accepted at the time of purchase governs that transaction; future amendments apply only to later purchases. If any provision is declared void, the remaining provisions shall remain in force. In case of discrepancy between the Spanish version and its English translation, the Spanish version shall prevail. These Terms are governed by the laws of {{LEY_APLICABLE}}; for any dispute the parties submit to the competent courts of {{CIUDAD_JURISDICCION}}, without prejudice to the Buyer's right to resort to PROFECO.

## Transaction details
- Buyer: {{PARTICIPANTE_NOMBRE}} · {{PARTICIPANTE_EMAIL}} · {{PARTICIPANTE_TELEFONO}}
- Company: {{PARTICIPANTE_EMPRESA}}
- Program: {{NOMBRE_PROGRAMA}}
- Total: {{INVERSION_MXN}} MXN, VAT included · Payment method: {{FORMA_DE_PAGO}}
- Folio: {{FOLIO}} · Accepted in {{CIUDAD_FIRMA}} on {{FECHA_FIRMA}}
`;

// ────────────────────────────────────────────────────────────────────────────
// 1. CONTRATO DE PARTICIPACIÓN
// ────────────────────────────────────────────────────────────────────────────

const CONTRATO_ES = `**Folio {{FOLIO}}** · Versión 2.0 · Fecha de aceptación: {{FECHA_FIRMA}}

Contrato de prestación de servicios que celebran, por una parte, **{{ORGANIZADOR_RAZON_SOCIAL}}** (el "Organizador") y, por la otra, **{{PARTICIPANTE_NOMBRE}}** (el "Participante"), al tenor de las siguientes declaraciones y cláusulas.

## Declaraciones

**I. Declara el Organizador**, por conducto de su representante {{ORGANIZADOR_REPRESENTANTE}}: (a) que está legalmente constituido conforme a las leyes de {{LEY_APLICABLE}}, con Registro Federal de Contribuyentes {{ORGANIZADOR_RFC}} y domicilio para efectos de este Contrato en {{ORGANIZADOR_DOMICILIO}}; (b) que cuenta con la capacidad, experiencia y recursos necesarios para prestar los servicios objeto de este Contrato; y (c) que su correo electrónico para notificaciones es {{ORGANIZADOR_EMAIL}}.

**II. Declara el Participante**: (a) que es mayor de edad y cuenta con plena capacidad jurídica para obligarse; (b) que sus datos de contacto son el correo electrónico {{PARTICIPANTE_EMAIL}} y el teléfono {{PARTICIPANTE_TELEFONO}}; (c) que participa por su propia voluntad y en su beneficio personal; (d) que la persona moral {{PARTICIPANTE_EMPRESA}}, en su caso, cubre total o parcialmente la contraprestación por cuenta del Participante, sin que ello genere entre dicha persona moral y el Organizador relación contractual alguna distinta del pago, ni relación laboral entre el Participante y el Organizador; y (e) que la información proporcionada al momento de la compra es verídica y completa.

**III. Declaran ambas partes** que se reconocen mutuamente la personalidad con la que comparecen, que en la celebración de este Contrato no existe error, dolo, mala fe, violencia ni lesión, y que están conformes en sujetarse a las siguientes:

## Cláusulas

### Primera. Objeto
El Organizador se obliga a prestar al Participante los servicios de facilitación, formación y acompañamiento correspondientes al programa **{{NOMBRE_PROGRAMA}}** (el "Programa"), conforme a la descripción, duración, fechas, sede y contenidos publicados en la ficha del Programa vigente al momento de la contratación, misma que el Participante declara conocer y que forma parte integrante de este Contrato como Anexo A.

El Programa es una experiencia de desarrollo personal y de liderazgo. No constituye tratamiento médico, psicológico ni psiquiátrico, ni asesoría profesional de ninguna naturaleza, y no garantiza resultados específicos, los cuales dependen de la participación y circunstancias de cada persona.

### Segunda. Servicios incluidos y no incluidos
Los servicios incluidos son exclusivamente los enunciados en el Anexo A (por ejemplo, facilitación de sesiones, materiales y, en su caso, hospedaje y alimentación durante los días del Programa). Salvo mención expresa en el Anexo A, no se incluyen traslados hacia y desde la sede, seguros, gastos personales, consumos extraordinarios ni servicios no descritos.

### Tercera. Contraprestación y forma de pago
La contraprestación total por el Programa es de **{{INVERSION_MXN}} pesos mexicanos (MXN), Impuesto al Valor Agregado incluido**, pagadera mediante {{FORMA_DE_PAGO}}.

La reservación del lugar se confirma únicamente cuando el Organizador recibe y valida el pago total. Tratándose de depósito o transferencia, el Participante deberá realizar el pago dentro de los cinco (5) días hábiles siguientes a la aceptación de este Contrato y remitir su comprobante; transcurrido dicho plazo sin pago, el Organizador podrá liberar el lugar sin responsabilidad.

El Organizador expedirá el Comprobante Fiscal Digital por Internet (CFDI) que corresponda con los datos fiscales que el Participante proporcione dentro del mismo mes en que se realice el pago, conforme a las disposiciones fiscales aplicables.

### Cuarta. Derecho de revocación
De conformidad con los artículos 51 y 56 de la Ley Federal de Protección al Consumidor, por tratarse de una contratación celebrada fuera del establecimiento del Organizador y a través de medios electrónicos, el Participante podrá revocar su consentimiento sin responsabilidad alguna dentro de los cinco (5) días hábiles siguientes a la aceptación de este Contrato, mediante aviso por escrito al correo {{ORGANIZADOR_EMAIL}}. En tal caso el Organizador reembolsará la totalidad de lo pagado dentro de los quince (15) días hábiles siguientes. Si el Programa inicia dentro de dicho plazo, el derecho de revocación podrá ejercerse hasta antes del inicio del Programa.

### Quinta. Cancelación por el Participante
Fuera del plazo de revocación, el Participante podrá cancelar su participación mediante aviso por escrito al correo {{ORGANIZADOR_EMAIL}}, con las siguientes consecuencias, computadas respecto de la fecha de inicio del Programa indicada en el Anexo A:

- Con {{DIAS_CANCELACION_TOTAL}} días naturales o más de anticipación: reembolso del {{PORCENTAJE_REEMBOLSO_TOTAL}}% de la contraprestación pagada. El porcentaje restante cubre gastos administrativos y de reservación ya erogados.
- Con al menos {{DIAS_CANCELACION_PARCIAL}} y menos de {{DIAS_CANCELACION_TOTAL}} días naturales de anticipación: reembolso del {{PORCENTAJE_REEMBOLSO_PARCIAL}}% de la contraprestación pagada.
- Con menos de {{DIAS_CANCELACION_PARCIAL}} días naturales de anticipación, o por inasistencia: no habrá reembolso, en atención a los compromisos de sede, proveedores y cupo limitado ya asumidos por el Organizador.

En los dos primeros supuestos, el Participante podrá optar, en lugar del reembolso, por aplicar el 100% de lo pagado como crédito para una edición futura del mismo Programa o de otro de valor equivalente, dentro de los doce (12) meses siguientes y sujeto a disponibilidad. En cualquier supuesto, y con al menos siete (7) días naturales de anticipación, el Participante podrá ceder su lugar a otra persona que cumpla los requisitos del Programa y acepte los documentos correspondientes. Los reembolsos se realizan al mismo medio de pago dentro de los quince (15) días hábiles siguientes a la solicitud.

### Sexta. Cambios o cancelación por el Organizador
El Organizador podrá realizar ajustes razonables al itinerario, facilitadores, actividades o sede del Programa por causas justificadas (condiciones climatológicas, seguridad, disponibilidad de la sede o de proveedores), garantizando una experiencia de calidad y valor equivalentes, lo que no dará lugar a reembolso.

Si el Organizador cancela el Programa o modifica sus fechas, el Participante podrá elegir entre (i) participar en la nueva fecha o en otra edición, o (ii) el reembolso íntegro de lo pagado dentro de los quince (15) días hábiles siguientes. El Organizador no responderá por gastos de traslado u otros erogados por el Participante frente a terceros, salvo dolo o negligencia.

### Séptima. Caso fortuito y fuerza mayor
Ninguna de las partes será responsable por el incumplimiento derivado de caso fortuito o fuerza mayor, en términos del artículo 2111 del Código Civil Federal, incluidos fenómenos naturales, contingencias sanitarias y actos de autoridad. En tal caso el Organizador reprogramará el Programa y el Participante conservará su lugar, o bien un crédito por la totalidad de lo pagado con vigencia de doce (12) meses. Si la reprogramación no fuera posible dentro de ese plazo, procederá el reembolso íntegro.

### Octava. Obligaciones del Participante
- Proporcionar información veraz y completar, antes del inicio, el formulario de salud y contacto de emergencia y los demás documentos que el Organizador le solicite, incluidos el Acuerdo de Confidencialidad y el Consentimiento Informado y Relevo de Responsabilidad.
- Presentarse puntualmente en la sede en las fechas y horarios indicados y permanecer durante el Programa, salvo causa justificada.
- Cumplir el reglamento interno de la sede, las indicaciones de seguridad de los facilitadores y las normas de convivencia del Programa, y tratar con respeto a facilitadores, personal, proveedores y demás participantes.
- Abstenerse de consumir bebidas alcohólicas, estupefacientes o sustancias psicotrópicas no prescritas durante el Programa, y de portar armas.
- Responder de los daños que cause a la sede, su equipo, terceros u otros participantes, en términos del artículo 1910 del Código Civil Federal.
- No grabar, fotografiar ni difundir sesiones, contenidos o la identidad de otros participantes sin autorización expresa.

### Novena. Conducta y exclusión
El Organizador podrá dar por terminada la participación de quien incumpla gravemente sus obligaciones, ponga en riesgo su seguridad o la de otros, altere la convivencia o se encuentre bajo los efectos de sustancias prohibidas. En tal caso no procederá reembolso y los gastos de retorno anticipado correrán por cuenta del Participante, sin perjuicio de las acciones legales que correspondan.

### Décima. Salud y riesgos
El Participante reconoce que el Programa incluye actividades al aire libre y prácticas físicas, emocionales y contemplativas que implican riesgos inherentes, los cuales conoce y acepta en los términos del Consentimiento Informado y Relevo de Responsabilidad que suscribe por separado. El Organizador implementará medidas razonables de seguridad y responderá por los daños que le sean imputables por dolo o negligencia conforme a la ley. Ninguna disposición de este Contrato se interpretará como renuncia a los derechos irrenunciables del Participante.

### Décima Primera. Confidencialidad y datos personales
Las partes se obligan a la confidencialidad en los términos del Acuerdo de Confidencialidad que forma parte de la documentación del Programa. Los datos personales del Participante se tratan conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y al Aviso de Privacidad disponible en {{AVISO_PRIVACIDAD_URL}}, donde el Participante puede ejercer sus derechos de acceso, rectificación, cancelación y oposición.

### Décima Segunda. Propiedad intelectual
La metodología Elements Method, sus marcas, nombres, frameworks, materiales, contenidos, grabaciones y diseños son propiedad exclusiva del Organizador o de sus licenciantes y están protegidos por la Ley Federal del Derecho de Autor y la Ley Federal de Protección a la Propiedad Industrial. Este Contrato no otorga al Participante licencia ni derecho alguno sobre ellos, salvo el uso personal y no comercial de los materiales que se le entreguen. Queda prohibida su reproducción, distribución, comunicación pública, transformación o utilización para diseñar o impartir programas propios o de terceros.

### Décima Tercera. Uso de imagen
La captación y el uso de la imagen, voz o testimonio del Participante requieren su autorización expresa y separada, en términos del artículo 87 de la Ley Federal del Derecho de Autor. Dicha autorización es voluntaria y no condiciona la participación en el Programa.

### Décima Cuarta. Ausencia de relación laboral
Este Contrato es de naturaleza civil. No genera relación laboral, de subordinación, sociedad o asociación entre las partes, ni entre el Organizador y la persona moral que, en su caso, cubra la contraprestación.

### Décima Quinta. Aceptación electrónica
Las partes reconocen que este Contrato se celebra por medios electrónicos y que la manifestación de la voluntad del Participante mediante la acción de marcar la casilla "He leído y acepto" y completar la compra constituye consentimiento expreso, en términos de los artículos 1803, 1811 y 1834 Bis del Código Civil Federal y 89 a 95 del Código de Comercio, con plena validez y fuerza probatoria. El Organizador conservará el mensaje de datos con la versión aceptada, la fecha y hora de aceptación y la huella digital (hash) del documento, y enviará copia al correo del Participante.

### Décima Sexta. Notificaciones
Toda notificación se realizará por escrito a los correos electrónicos señalados en las Declaraciones y surtirá efectos el día hábil siguiente a su envío. Cualquier cambio de datos de contacto deberá notificarse a la otra parte.

### Décima Séptima. Disposiciones generales
Este Contrato, junto con su Anexo A, el Acuerdo de Confidencialidad y el Consentimiento Informado y Relevo de Responsabilidad, constituye el acuerdo íntegro entre las partes y sustituye cualquier comunicación previa. Solo podrá modificarse por escrito con el consentimiento de ambas. Si alguna cláusula fuera declarada nula, las demás conservarán su validez. El Participante no podrá ceder sus derechos u obligaciones salvo lo previsto en la Cláusula Quinta. Los encabezados son únicamente de referencia. En caso de discrepancia entre la versión en español y su traducción al inglés, prevalecerá la versión en español.

### Décima Octava. Legislación aplicable y jurisdicción
Este Contrato se rige por las leyes de {{LEY_APLICABLE}}, en particular el Código Civil Federal, el Código de Comercio y la Ley Federal de Protección al Consumidor. Para cualquier controversia, las partes se someten a la competencia de los tribunales de {{CIUDAD_JURISDICCION}}, renunciando al fuero que pudiera corresponderles por razón de su domicilio presente o futuro, sin perjuicio del derecho del Participante de acudir a la Procuraduría Federal del Consumidor.

## Aceptación
Leído que fue por las partes y enteradas de su contenido y alcance legal, lo aceptan en {{CIUDAD_FIRMA}}, el {{FECHA_FIRMA}}.

**El Organizador**: {{ORGANIZADOR_RAZON_SOCIAL}}, representado por {{ORGANIZADOR_REPRESENTANTE}}.

**El Participante**: {{PARTICIPANTE_NOMBRE}} · {{PARTICIPANTE_EMAIL}} · Folio {{FOLIO}} · Orden del {{FECHA_ORDEN}}.
`;

const CONTRATO_EN = `**Folio {{FOLIO}}** · Version 2.0 · Acceptance date: {{FECHA_FIRMA}}

Services agreement entered into by **{{ORGANIZADOR_RAZON_SOCIAL}}** (the "Organizer") and **{{PARTICIPANTE_NOMBRE}}** (the "Participant"), under the following recitals and clauses. This English text is a courtesy translation; the Spanish version governs.

## Recitals

**I. The Organizer declares**, through its representative {{ORGANIZADOR_REPRESENTANTE}}: (a) that it is legally organized under the laws of {{LEY_APLICABLE}}, with Mexican tax ID (RFC) {{ORGANIZADOR_RFC}} and address for purposes of this Agreement at {{ORGANIZADOR_DOMICILIO}}; (b) that it has the capacity, experience and resources required to render the services covered by this Agreement; and (c) that its email address for notices is {{ORGANIZADOR_EMAIL}}.

**II. The Participant declares**: (a) that they are of legal age and have full legal capacity to be bound; (b) that their contact details are the email {{PARTICIPANTE_EMAIL}} and the phone {{PARTICIPANTE_TELEFONO}}; (c) that they take part voluntarily and for their own personal benefit; (d) that the legal entity {{PARTICIPANTE_EMPRESA}}, where applicable, pays all or part of the fee on the Participant's behalf, without this creating any contractual relationship between such entity and the Organizer other than payment, nor any employment relationship between the Participant and the Organizer; and (e) that the information provided at purchase is true and complete.

**III. Both parties declare** that they acknowledge each other's capacity, that this Agreement is entered into free of error, fraud, bad faith, duress or unfair advantage, and that they agree to be bound by the following:

## Clauses

### First. Purpose
The Organizer shall render to the Participant the facilitation, training and guidance services corresponding to the program **{{NOMBRE_PROGRAMA}}** (the "Program"), in accordance with the description, duration, dates, venue and contents published in the Program page in force at the time of purchase, which the Participant acknowledges and which forms part of this Agreement as Annex A.

The Program is a personal development and leadership experience. It is not medical, psychological or psychiatric treatment, nor professional advice of any kind, and it does not guarantee specific results, which depend on each person's participation and circumstances.

### Second. Services included and excluded
The included services are exclusively those listed in Annex A (for example, session facilitation, materials and, where stated, lodging and meals during the Program days). Unless expressly stated in Annex A, transportation to and from the venue, insurance, personal expenses, extraordinary consumption and any service not described are not included.

### Third. Fee and payment
The total fee for the Program is **{{INVERSION_MXN}} Mexican pesos (MXN), Value Added Tax included**, payable by {{FORMA_DE_PAGO}}.

The seat is confirmed only once the Organizer receives and validates full payment. For bank deposits or transfers, the Participant shall pay within five (5) business days after accepting this Agreement and send proof of payment; after that period without payment the Organizer may release the seat without liability.

The Organizer shall issue the applicable Mexican electronic tax receipt (CFDI) with the tax details the Participant provides within the same month of payment, in accordance with applicable tax provisions.

### Fourth. Right of withdrawal
Pursuant to Articles 51 and 56 of the Mexican Federal Consumer Protection Law, as this Agreement is concluded away from the Organizer's premises and through electronic means, the Participant may withdraw their consent without any liability within five (5) business days after accepting this Agreement, by written notice to {{ORGANIZADOR_EMAIL}}. The Organizer shall then refund the full amount paid within fifteen (15) business days. If the Program starts within that period, the right of withdrawal may be exercised until the Program begins.

### Fifth. Cancellation by the Participant
After the withdrawal period, the Participant may cancel by written notice to {{ORGANIZADOR_EMAIL}}, with the following consequences, counted from the Program start date stated in Annex A:

- {{DIAS_CANCELACION_TOTAL}} calendar days or more in advance: refund of {{PORCENTAJE_REEMBOLSO_TOTAL}}% of the fee paid. The remaining percentage covers administrative and booking costs already incurred.
- At least {{DIAS_CANCELACION_PARCIAL}} and fewer than {{DIAS_CANCELACION_TOTAL}} calendar days in advance: refund of {{PORCENTAJE_REEMBOLSO_PARCIAL}}% of the fee paid.
- Fewer than {{DIAS_CANCELACION_PARCIAL}} calendar days in advance, or no-show: no refund, given the venue, provider and limited-capacity commitments already undertaken by the Organizer.

In the first two cases the Participant may choose, instead of a refund, to apply 100% of the amount paid as credit toward a future edition of the same Program or another of equivalent value, within the following twelve (12) months and subject to availability. In any case, with at least seven (7) calendar days' notice, the Participant may transfer their seat to another person who meets the Program requirements and accepts the corresponding documents. Refunds are made to the original payment method within fifteen (15) business days of the request.

### Sixth. Changes or cancellation by the Organizer
The Organizer may make reasonable adjustments to the itinerary, facilitators, activities or venue for justified causes (weather, safety, venue or provider availability), ensuring an experience of equivalent quality and value; this shall not give rise to a refund.

If the Organizer cancels the Program or changes its dates, the Participant may choose between (i) attending the new date or another edition, or (ii) a full refund within fifteen (15) business days. The Organizer shall not be liable for travel or other expenses incurred by the Participant with third parties, except in cases of willful misconduct or negligence.

### Seventh. Force majeure
Neither party shall be liable for non-performance caused by acts of God or force majeure under Article 2111 of the Mexican Federal Civil Code, including natural events, health emergencies and acts of authority. In such case the Organizer shall reschedule the Program and the Participant shall keep their seat, or a credit for the full amount paid valid for twelve (12) months. If rescheduling is not possible within that period, a full refund shall apply.

### Eighth. Participant obligations
- Provide truthful information and complete, before the start, the health and emergency-contact form and any other documents the Organizer requests, including the Confidentiality Agreement and the Informed Consent and Release of Liability.
- Arrive punctually at the venue on the stated dates and times and remain for the duration of the Program, except for justified cause.
- Comply with the venue's internal rules, the facilitators' safety instructions and the Program's community guidelines, and treat facilitators, staff, providers and fellow participants with respect.
- Refrain from consuming alcohol, narcotics or non-prescribed psychotropic substances during the Program, and from carrying weapons.
- Be liable for damage caused to the venue, its equipment, third parties or other participants, under Article 1910 of the Mexican Federal Civil Code.
- Not record, photograph or disseminate sessions, contents or the identity of other participants without express authorization.

### Ninth. Conduct and exclusion
The Organizer may terminate the participation of anyone who seriously breaches their obligations, endangers their own safety or that of others, disrupts the group or is under the influence of prohibited substances. In such case no refund shall apply and early return expenses shall be borne by the Participant, without prejudice to any applicable legal action.

### Tenth. Health and risks
The Participant acknowledges that the Program includes outdoor activities and physical, emotional and contemplative practices involving inherent risks, which they know and accept under the Informed Consent and Release of Liability signed separately. The Organizer shall implement reasonable safety measures and shall be liable for damages attributable to its willful misconduct or negligence as provided by law. Nothing in this Agreement shall be construed as a waiver of the Participant's non-waivable rights.

### Eleventh. Confidentiality and personal data
The parties undertake confidentiality under the Confidentiality Agreement that forms part of the Program documentation. The Participant's personal data are processed under the Mexican Federal Law on the Protection of Personal Data Held by Private Parties and the Privacy Notice available at {{AVISO_PRIVACIDAD_URL}}, where the Participant may exercise their rights of access, rectification, cancellation and objection.

### Twelfth. Intellectual property
The Elements Method methodology, its trademarks, names, frameworks, materials, contents, recordings and designs are the exclusive property of the Organizer or its licensors and are protected by the Mexican Federal Copyright Law and the Federal Law for the Protection of Industrial Property. This Agreement grants the Participant no license or right over them, other than personal, non-commercial use of the materials delivered. Their reproduction, distribution, public communication, transformation or use to design or deliver programs of their own or of third parties is prohibited.

### Thirteenth. Use of image
Capturing and using the Participant's image, voice or testimonial requires their express, separate authorization under Article 87 of the Mexican Federal Copyright Law. Such authorization is voluntary and is not a condition of participation.

### Fourteenth. No employment relationship
This Agreement is civil in nature. It creates no employment, subordination, partnership or association relationship between the parties, nor between the Organizer and any legal entity that pays the fee.

### Fifteenth. Electronic acceptance
The parties acknowledge that this Agreement is concluded by electronic means and that the Participant's expression of will by ticking the "I have read and accept" box and completing the purchase constitutes express consent under Articles 1803, 1811 and 1834 Bis of the Mexican Federal Civil Code and Articles 89 to 95 of the Mexican Commercial Code, with full validity and evidentiary force. The Organizer shall keep the data message with the accepted version, the date and time of acceptance and the document's digital fingerprint (hash), and shall send a copy to the Participant's email.

### Sixteenth. Notices
All notices shall be in writing to the email addresses stated in the Recitals and shall take effect on the business day following dispatch. Any change of contact details must be notified to the other party.

### Seventeenth. General provisions
This Agreement, together with Annex A, the Confidentiality Agreement and the Informed Consent and Release of Liability, constitutes the entire agreement between the parties and supersedes any prior communication. It may only be amended in writing with the consent of both parties. If any clause is declared void, the remaining clauses shall remain in force. The Participant may not assign their rights or obligations except as provided in the Fifth Clause. Headings are for reference only. In case of discrepancy between the Spanish version and its English translation, the Spanish version shall prevail.

### Eighteenth. Governing law and jurisdiction
This Agreement is governed by the laws of {{LEY_APLICABLE}}, in particular the Federal Civil Code, the Commercial Code and the Federal Consumer Protection Law. For any dispute the parties submit to the jurisdiction of the courts of {{CIUDAD_JURISDICCION}}, waiving any other venue to which they may be entitled by reason of their present or future domicile, without prejudice to the Participant's right to resort to the Federal Consumer Protection Agency (PROFECO).

## Acceptance
Having read this Agreement and understood its content and legal scope, the parties accept it in {{CIUDAD_FIRMA}}, on {{FECHA_FIRMA}}.

**The Organizer**: {{ORGANIZADOR_RAZON_SOCIAL}}, represented by {{ORGANIZADOR_REPRESENTANTE}}.

**The Participant**: {{PARTICIPANTE_NOMBRE}} · {{PARTICIPANTE_EMAIL}} · Folio {{FOLIO}} · Order dated {{FECHA_ORDEN}}.
`;

// ────────────────────────────────────────────────────────────────────────────
// 2. ACUERDO DE CONFIDENCIALIDAD (NDA)
// ────────────────────────────────────────────────────────────────────────────

const NDA_ES = `**Folio {{FOLIO}}** · Versión 2.0 · Fecha de aceptación: {{FECHA_FIRMA}}

Acuerdo que celebran **{{ORGANIZADOR_RAZON_SOCIAL}}** (el "Organizador"), con Registro Federal de Contribuyentes {{ORGANIZADOR_RFC}} y domicilio en {{ORGANIZADOR_DOMICILIO}}, y **{{PARTICIPANTE_NOMBRE}}** (el "Participante"), con correo electrónico {{PARTICIPANTE_EMAIL}}, con motivo de la participación de este último en el programa **{{NOMBRE_PROGRAMA}}** (el "Programa"). Conjuntamente, las "Partes".

## Antecedentes
El Programa se desarrolla en un entorno de confianza en el que los participantes comparten experiencias personales y en el que el Organizador aplica una metodología propia. La protección de lo que ahí se comparte es condición esencial del Programa, por lo que las Partes convienen lo siguiente:

## Cláusulas

### Primera. Información Confidencial
Para efectos de este Acuerdo se considera "Información Confidencial":

- **La Metodología**: el método Elements Method y sus componentes, incluidos frameworks, protocolos, secuencias, dinámicas, guiones de sesión, manuales, cuadernos de trabajo, grabaciones, presentaciones, herramientas de diagnóstico y cualquier material entregado o mostrado durante el Programa, así como la información comercial, operativa y de proveedores del Organizador, con independencia de que esté marcada como confidencial. Dicha información constituye secreto industrial en términos de los artículos 163 a 169 de la Ley Federal de Protección a la Propiedad Industrial.
- **La Información Personal de Terceros**: la identidad, participación, historias, vivencias, opiniones, estado de salud, situación personal o profesional y cualquier manifestación de otros participantes, facilitadores o colaboradores, expresada o conocida durante el Programa.
- **La Información del Participante**: los datos personales y las manifestaciones personales que el Participante comparta con el Organizador o sus facilitadores durante el Programa.

### Segunda. Obligaciones del Participante
El Participante se obliga a:

- Guardar estricta confidencialidad sobre la Metodología y la Información Personal de Terceros, y a no divulgarla, publicarla, comentarla ni transmitirla a terceros por ningún medio, incluidas redes sociales y aplicaciones de mensajería.
- Utilizar la Metodología y los materiales exclusivamente para su desarrollo personal, sin reproducirlos, adaptarlos, comercializarlos ni emplearlos para diseñar o impartir programas, talleres, cursos o servicios propios o de terceros.
- No realizar grabaciones de audio o video, fotografías ni capturas de las sesiones, materiales o participantes sin autorización expresa y por escrito del Organizador.
- No identificar, mencionar ni referir a otros participantes, ni relacionarlos con el Programa, sin su consentimiento previo. El Participante podrá compartir su propia experiencia, siempre que no revele Información Confidencial.
- Devolver o destruir, a solicitud del Organizador, los materiales que le hubieran sido facilitados en préstamo.

### Tercera. Obligaciones del Organizador
El Organizador se obliga a:

- Tratar la Información del Participante con confidencialidad, limitando su acceso a los facilitadores y colaboradores que la requieran para la prestación del Programa, quienes están sujetos a obligaciones equivalentes.
- Tratar los datos personales del Participante conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y al Aviso de Privacidad disponible en {{AVISO_PRIVACIDAD_URL}}.
- No difundir la imagen, voz, nombre ni testimonio del Participante sin su autorización expresa y separada.

### Cuarta. Excepciones
No se considerará Información Confidencial aquella que: (i) sea o llegue a ser del dominio público sin incumplimiento de este Acuerdo; (ii) la parte receptora demuestre haber conocido lícitamente con anterioridad; (iii) sea recibida legítimamente de un tercero sin obligación de confidencialidad; o (iv) deba revelarse por mandato de ley o de autoridad competente, en cuyo caso la parte obligada avisará a la otra, de ser legalmente posible, y limitará la revelación a lo estrictamente requerido.

### Quinta. Vigencia
Las obligaciones relativas a la Metodología y a la información comercial del Organizador permanecerán vigentes durante el Programa y por {{VIGENCIA_CONFIDENCIALIDAD_ANIOS}} años posteriores a su conclusión, o mientras la información conserve el carácter de secreto industrial, lo que ocurra después. Las obligaciones relativas a la Información Personal de Terceros y a la Información del Participante tendrán vigencia indefinida.

### Sexta. Propiedad intelectual
Este Acuerdo no transfiere ni licencia derecho alguno de propiedad intelectual o industrial. La Metodología y los materiales son propiedad exclusiva del Organizador o de sus licenciantes y están protegidos por la Ley Federal del Derecho de Autor y la Ley Federal de Protección a la Propiedad Industrial.

### Séptima. Incumplimiento
El incumplimiento de este Acuerdo facultará a la parte afectada para exigir el cese inmediato de la conducta, solicitar las medidas provisionales que procedan y reclamar el pago de los daños y perjuicios ocasionados, en términos de los artículos 2104 a 2110 del Código Civil Federal, sin perjuicio de las acciones civiles, administrativas o penales que correspondan. El incumplimiento grave por parte del Participante será, además, causa de exclusión del Programa en términos del Contrato de Participación.

### Octava. Aceptación electrónica
La manifestación de la voluntad del Participante mediante la acción de marcar la casilla "He leído y acepto" constituye consentimiento expreso en términos de los artículos 1803 y 1834 Bis del Código Civil Federal y 89 a 95 del Código de Comercio. El Organizador conservará el mensaje de datos con la versión aceptada, la fecha y hora de aceptación y la huella digital (hash) del documento, y enviará copia al Participante.

### Novena. Disposiciones generales
Este Acuerdo complementa al Contrato de Participación y subsistirá a su terminación. Si alguna cláusula fuera declarada nula, las demás conservarán su validez. Solo podrá modificarse por escrito. En caso de discrepancia entre la versión en español y su traducción al inglés, prevalecerá la versión en español.

### Décima. Legislación aplicable y jurisdicción
Este Acuerdo se rige por las leyes de {{LEY_APLICABLE}}. Para cualquier controversia, las Partes se someten a los tribunales competentes de {{CIUDAD_JURISDICCION}}, renunciando al fuero que pudiera corresponderles por razón de su domicilio presente o futuro, sin perjuicio de los derechos irrenunciables del Participante como consumidor.

## Aceptación
Aceptado en {{CIUDAD_FIRMA}}, el {{FECHA_FIRMA}}.

**El Organizador**: {{ORGANIZADOR_RAZON_SOCIAL}}, representado por {{ORGANIZADOR_REPRESENTANTE}}.

**El Participante**: {{PARTICIPANTE_NOMBRE}} · {{PARTICIPANTE_EMAIL}} · Folio {{FOLIO}}.
`;

const NDA_EN = `**Folio {{FOLIO}}** · Version 2.0 · Acceptance date: {{FECHA_FIRMA}}

Agreement entered into by **{{ORGANIZADOR_RAZON_SOCIAL}}** (the "Organizer"), with Mexican tax ID (RFC) {{ORGANIZADOR_RFC}} and address at {{ORGANIZADOR_DOMICILIO}}, and **{{PARTICIPANTE_NOMBRE}}** (the "Participant"), email {{PARTICIPANTE_EMAIL}}, in connection with the latter's participation in the program **{{NOMBRE_PROGRAMA}}** (the "Program"). Jointly, the "Parties". This English text is a courtesy translation; the Spanish version governs.

## Background
The Program takes place in an environment of trust in which participants share personal experiences and in which the Organizer applies a proprietary methodology. Protecting what is shared there is an essential condition of the Program, so the Parties agree as follows:

## Clauses

### First. Confidential Information
For purposes of this Agreement, "Confidential Information" means:

- **The Methodology**: the Elements Method and its components, including frameworks, protocols, sequences, dynamics, session scripts, manuals, workbooks, recordings, presentations, diagnostic tools and any material delivered or shown during the Program, as well as the Organizer's commercial, operational and supplier information, whether or not marked as confidential. Such information constitutes a trade secret under Articles 163 to 169 of the Mexican Federal Law for the Protection of Industrial Property.
- **Third-Party Personal Information**: the identity, participation, stories, experiences, opinions, health status, personal or professional situation and any statement of other participants, facilitators or collaborators, expressed or learned during the Program.
- **Participant Information**: the personal data and personal statements the Participant shares with the Organizer or its facilitators during the Program.

### Second. Participant obligations
The Participant undertakes to:

- Keep the Methodology and Third-Party Personal Information strictly confidential, and not disclose, publish, discuss or transmit it to third parties by any means, including social media and messaging applications.
- Use the Methodology and materials exclusively for their personal development, without reproducing, adapting, commercializing or using them to design or deliver programs, workshops, courses or services of their own or of third parties.
- Not make audio or video recordings, photographs or screenshots of sessions, materials or participants without the Organizer's express written authorization.
- Not identify, mention or refer to other participants, nor link them to the Program, without their prior consent. The Participant may share their own experience, provided they do not reveal Confidential Information.
- Return or destroy, at the Organizer's request, any materials provided on loan.

### Third. Organizer obligations
The Organizer undertakes to:

- Treat Participant Information confidentially, limiting access to the facilitators and collaborators who need it to deliver the Program, who are bound by equivalent obligations.
- Process the Participant's personal data under the Mexican Federal Law on the Protection of Personal Data Held by Private Parties and the Privacy Notice available at {{AVISO_PRIVACIDAD_URL}}.
- Not disseminate the Participant's image, voice, name or testimonial without their express, separate authorization.

### Fourth. Exceptions
Confidential Information does not include information that: (i) is or becomes public without breach of this Agreement; (ii) the receiving party can show it lawfully knew beforehand; (iii) is lawfully received from a third party without a confidentiality obligation; or (iv) must be disclosed by law or order of a competent authority, in which case the obliged party shall notify the other, where legally possible, and limit disclosure to what is strictly required.

### Fifth. Term
Obligations regarding the Methodology and the Organizer's commercial information remain in force during the Program and for {{VIGENCIA_CONFIDENCIALIDAD_ANIOS}} years after its conclusion, or for as long as the information remains a trade secret, whichever is later. Obligations regarding Third-Party Personal Information and Participant Information are indefinite.

### Sixth. Intellectual property
This Agreement neither transfers nor licenses any intellectual or industrial property right. The Methodology and materials are the exclusive property of the Organizer or its licensors and are protected by the Mexican Federal Copyright Law and the Federal Law for the Protection of Industrial Property.

### Seventh. Breach
Breach of this Agreement entitles the affected party to demand the immediate cessation of the conduct, request any applicable provisional measures and claim compensation for damages under Articles 2104 to 2110 of the Mexican Federal Civil Code, without prejudice to any applicable civil, administrative or criminal action. A serious breach by the Participant is also grounds for exclusion from the Program under the Participation Agreement.

### Eighth. Electronic acceptance
The Participant's expression of will by ticking the "I have read and accept" box constitutes express consent under Articles 1803 and 1834 Bis of the Mexican Federal Civil Code and Articles 89 to 95 of the Mexican Commercial Code. The Organizer shall keep the data message with the accepted version, the date and time of acceptance and the document's digital fingerprint (hash), and shall send a copy to the Participant.

### Ninth. General provisions
This Agreement supplements the Participation Agreement and survives its termination. If any clause is declared void, the remaining clauses shall remain in force. It may only be amended in writing. In case of discrepancy between the Spanish version and its English translation, the Spanish version shall prevail.

### Tenth. Governing law and jurisdiction
This Agreement is governed by the laws of {{LEY_APLICABLE}}. For any dispute the Parties submit to the competent courts of {{CIUDAD_JURISDICCION}}, waiving any other venue to which they may be entitled by reason of their present or future domicile, without prejudice to the Participant's non-waivable rights as a consumer.

## Acceptance
Accepted in {{CIUDAD_FIRMA}}, on {{FECHA_FIRMA}}.

**The Organizer**: {{ORGANIZADOR_RAZON_SOCIAL}}, represented by {{ORGANIZADOR_REPRESENTANTE}}.

**The Participant**: {{PARTICIPANTE_NOMBRE}} · {{PARTICIPANTE_EMAIL}} · Folio {{FOLIO}}.
`;

// ────────────────────────────────────────────────────────────────────────────
// 3. CONSENTIMIENTO INFORMADO Y RELEVO DE RESPONSABILIDAD
// ────────────────────────────────────────────────────────────────────────────

const RELEVO_ES = `**Folio {{FOLIO}}** · Versión 2.0 · Fecha de aceptación: {{FECHA_FIRMA}}

Yo, **{{PARTICIPANTE_NOMBRE}}**, con correo electrónico {{PARTICIPANTE_EMAIL}} y teléfono {{PARTICIPANTE_TELEFONO}}, en relación con mi participación en el programa **{{NOMBRE_PROGRAMA}}** (el "Programa") organizado por **{{ORGANIZADOR_RAZON_SOCIAL}}** (el "Organizador"), manifiesto libremente lo siguiente:

## 1. Naturaleza del Programa
Entiendo que el Programa es una experiencia inmersiva de desarrollo personal y liderazgo que puede incluir, entre otras, las siguientes actividades: caminatas y recorridos en entornos naturales; ejercicios físicos de intensidad moderada; prácticas de respiración y contemplación; inmersión en agua fría; temazcal u otras prácticas de calor; contacto con animales, incluidos caballos; fogatas; dinámicas grupales de reflexión y diálogo con carga emocional; y pernocta en sedes rurales. Entiendo que estas actividades se realizan al aire libre y están sujetas a las condiciones del terreno, del clima y del entorno.

Entiendo que el Programa **no es un tratamiento médico, psicológico ni psiquiátrico**, no sustituye la atención de profesionales de la salud, no tiene carácter religioso y no garantiza resultados específicos. Los facilitadores no ejercen funciones de diagnóstico ni terapia.

## 2. Participación voluntaria y derecho a abstenerme
Participo de manera libre y voluntaria. Sé que **puedo abstenerme de realizar cualquier actividad, o interrumpirla en cualquier momento, sin penalización alguna**, y que es mi responsabilidad informarlo a los facilitadores. Me comprometo a seguir las indicaciones de seguridad, a no exceder mis propios límites y a avisar de inmediato cualquier malestar.

## 3. Declaración de salud
Declaro que me encuentro en condiciones físicas y emocionales adecuadas para participar. Me comprometo a completar con veracidad, antes del inicio, el formulario de salud y contacto de emergencia que el Organizador me proporcione, y a informar cualquier condición relevante, incluidas: padecimientos cardiovasculares o respiratorios, hipertensión, epilepsia, diabetes, embarazo o lactancia, lesiones, cirugías recientes, alergias, condiciones de salud mental, tratamientos o medicamentos actuales, y cualquier otra que pueda verse afectada por las actividades descritas. Entiendo que el Organizador puede recomendarme no realizar determinadas actividades con base en dicha información, y que la omisión o falsedad de la misma es de mi exclusiva responsabilidad.

Otorgo mi **consentimiento expreso** para que el Organizador trate los datos de salud que le proporcione, considerados datos personales sensibles conforme al artículo 9 de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, con la única finalidad de velar por mi seguridad durante el Programa y conforme al Aviso de Privacidad disponible en {{AVISO_PRIVACIDAD_URL}}.

## 4. Riesgos inherentes
Reconozco que, aun con las medidas razonables de seguridad que implementa el Organizador, las actividades descritas conllevan **riesgos inherentes** que no pueden eliminarse por completo, tales como: caídas, torceduras, golpes o lesiones musculares; picaduras o mordeduras de insectos o animales; reacciones alérgicas; exposición al sol, frío, lluvia o altitud; mareos o malestar por el calor del temazcal o el agua fría; reacciones emocionales intensas; y, en casos extremos, lesiones graves. Declaro conocer y comprender estos riesgos y **asumo los riesgos inherentes** a las actividades en las que decida participar voluntariamente.

## 5. Emergencias
En caso de emergencia, autorizo al Organizador y a sus facilitadores a solicitar y facilitar la atención médica que resulte necesaria, incluido el traslado a un centro de salud, y a contactar a la persona que designe como contacto de emergencia. Entiendo que los gastos médicos, de traslado y de hospitalización correrán por mi cuenta o por la de mi seguro, y que el Organizador me informará antes del inicio si el Programa cuenta con póliza de accidentes y sus condiciones. **Se me recomienda contar con seguro de gastos médicos propio.**

## 6. Alcance del relevo de responsabilidad
En la medida en que lo permite la ley, libero al Organizador, a sus socios, facilitadores y colaboradores, a la sede y a los proveedores del Programa de cualquier reclamación por daños que deriven **exclusivamente de los riesgos inherentes** aquí descritos, de mi propia conducta, de mi decisión de participar en una actividad, o de la omisión o falsedad de la información de salud que yo proporcione.

Este relevo **no exime ni limita la responsabilidad** del Organizador o de sus prestadores por dolo, culpa o negligencia, ni por el incumplimiento de sus obligaciones, en términos de los artículos 1910, 2106 y demás aplicables del Código Civil Federal y del artículo 90 de la Ley Federal de Protección al Consumidor. Nada de lo aquí manifestado se interpretará como renuncia a mis derechos irrenunciables como consumidor.

## 7. Responsabilidad por mis actos
Me obligo a responder de los daños que cause a la sede, sus instalaciones y equipo, a terceros o a otros participantes por mi conducta, en términos del artículo 1910 del Código Civil Federal. Soy responsable de mis objetos personales.

## 8. Sustancias y conducta
Me comprometo a no consumir bebidas alcohólicas, estupefacientes ni sustancias psicotrópicas no prescritas durante el Programa, a no portar armas y a observar las normas de convivencia y el reglamento de la sede. Entiendo que el incumplimiento puede dar lugar a mi exclusión del Programa conforme al Contrato de Participación.

## 9. Imagen
Entiendo que cualquier captación o uso de mi imagen, voz o testimonio requiere mi autorización expresa y separada, la cual es voluntaria y no condiciona mi participación.

## 10. Aceptación electrónica, legislación y jurisdicción
Reconozco que marcar la casilla "He leído y acepto" constituye mi consentimiento expreso en términos de los artículos 1803 y 1834 Bis del Código Civil Federal y 89 a 95 del Código de Comercio, y que el Organizador conservará el mensaje de datos con la versión aceptada, la fecha y hora de aceptación y la huella digital (hash) del documento. Este documento se rige por las leyes de {{LEY_APLICABLE}}; para cualquier controversia me someto a los tribunales competentes de {{CIUDAD_JURISDICCION}}, sin perjuicio de mi derecho de acudir a la Procuraduría Federal del Consumidor. En caso de discrepancia entre la versión en español y su traducción al inglés, prevalecerá la versión en español.

## Aceptación
He leído este documento en su totalidad, comprendo su contenido y alcance, he tenido oportunidad de formular preguntas y lo acepto libremente en {{CIUDAD_FIRMA}}, el {{FECHA_FIRMA}}.

**{{PARTICIPANTE_NOMBRE}}** · {{PARTICIPANTE_EMAIL}} · Folio {{FOLIO}} · Orden del {{FECHA_ORDEN}}.
`;

const RELEVO_EN = `**Folio {{FOLIO}}** · Version 2.0 · Acceptance date: {{FECHA_FIRMA}}

I, **{{PARTICIPANTE_NOMBRE}}**, email {{PARTICIPANTE_EMAIL}} and phone {{PARTICIPANTE_TELEFONO}}, in connection with my participation in the program **{{NOMBRE_PROGRAMA}}** (the "Program") organized by **{{ORGANIZADOR_RAZON_SOCIAL}}** (the "Organizer"), freely state the following. This English text is a courtesy translation; the Spanish version governs.

## 1. Nature of the Program
I understand that the Program is an immersive personal development and leadership experience that may include, among others, the following activities: hikes and walks in natural settings; physical exercise of moderate intensity; breathing and contemplative practices; cold-water immersion; temazcal (sweat lodge) or other heat practices; contact with animals, including horses; bonfires; group reflection and dialogue dynamics of an emotional nature; and overnight stays at rural venues. I understand that these activities take place outdoors and are subject to terrain, weather and environmental conditions.

I understand that the Program **is not medical, psychological or psychiatric treatment**, does not replace care by health professionals, is not religious in nature and does not guarantee specific results. Facilitators do not perform diagnostic or therapeutic functions.

## 2. Voluntary participation and right to abstain
I take part freely and voluntarily. I know that **I may abstain from any activity, or stop it at any time, without any penalty**, and that it is my responsibility to inform the facilitators. I undertake to follow safety instructions, not to exceed my own limits and to report any discomfort immediately.

## 3. Health declaration
I declare that I am in adequate physical and emotional condition to participate. I undertake to truthfully complete, before the start, the health and emergency-contact form provided by the Organizer, and to disclose any relevant condition, including: cardiovascular or respiratory conditions, hypertension, epilepsy, diabetes, pregnancy or breastfeeding, injuries, recent surgery, allergies, mental health conditions, current treatments or medication, and any other condition that may be affected by the activities described. I understand that the Organizer may advise me not to perform certain activities based on that information, and that any omission or falsehood in it is my sole responsibility.

I give my **express consent** for the Organizer to process the health data I provide, which are sensitive personal data under Article 9 of the Mexican Federal Law on the Protection of Personal Data Held by Private Parties, for the sole purpose of looking after my safety during the Program and in accordance with the Privacy Notice available at {{AVISO_PRIVACIDAD_URL}}.

## 4. Inherent risks
I acknowledge that, even with the reasonable safety measures implemented by the Organizer, the activities described carry **inherent risks** that cannot be fully eliminated, such as: falls, sprains, blows or muscle injuries; insect or animal bites and stings; allergic reactions; exposure to sun, cold, rain or altitude; dizziness or discomfort from the heat of the temazcal or from cold water; intense emotional reactions; and, in extreme cases, serious injury. I declare that I know and understand these risks and **I assume the inherent risks** of the activities in which I voluntarily choose to take part.

## 5. Emergencies
In case of emergency, I authorize the Organizer and its facilitators to request and facilitate any necessary medical care, including transport to a health facility, and to contact the person I designate as emergency contact. I understand that medical, transport and hospitalization expenses shall be borne by me or my insurance, and that the Organizer will inform me before the start whether the Program has an accident insurance policy and its terms. **I am advised to have my own medical insurance.**

## 6. Scope of the release
To the extent permitted by law, I release the Organizer, its partners, facilitators and collaborators, the venue and the Program's providers from any claim for damages arising **exclusively from the inherent risks** described here, from my own conduct, from my decision to take part in an activity, or from any omission or falsehood in the health information I provide.

This release **does not exempt or limit the liability** of the Organizer or its providers for willful misconduct, fault or negligence, nor for breach of their obligations, under Articles 1910, 2106 and other applicable provisions of the Mexican Federal Civil Code and Article 90 of the Mexican Federal Consumer Protection Law. Nothing stated here shall be construed as a waiver of my non-waivable rights as a consumer.

## 7. Liability for my acts
I undertake to be liable for damage I cause to the venue, its facilities and equipment, to third parties or to other participants through my conduct, under Article 1910 of the Mexican Federal Civil Code. I am responsible for my personal belongings.

## 8. Substances and conduct
I undertake not to consume alcohol, narcotics or non-prescribed psychotropic substances during the Program, not to carry weapons and to observe the community guidelines and the venue's rules. I understand that a breach may lead to my exclusion from the Program under the Participation Agreement.

## 9. Image
I understand that any capture or use of my image, voice or testimonial requires my express, separate authorization, which is voluntary and is not a condition of my participation.

## 10. Electronic acceptance, governing law and jurisdiction
I acknowledge that ticking the "I have read and accept" box constitutes my express consent under Articles 1803 and 1834 Bis of the Mexican Federal Civil Code and Articles 89 to 95 of the Mexican Commercial Code, and that the Organizer shall keep the data message with the accepted version, the date and time of acceptance and the document's digital fingerprint (hash). This document is governed by the laws of {{LEY_APLICABLE}}; for any dispute I submit to the competent courts of {{CIUDAD_JURISDICCION}}, without prejudice to my right to resort to the Federal Consumer Protection Agency (PROFECO). In case of discrepancy between the Spanish version and its English translation, the Spanish version shall prevail.

## Acceptance
I have read this document in full, I understand its content and scope, I have had the opportunity to ask questions, and I freely accept it in {{CIUDAD_FIRMA}}, on {{FECHA_FIRMA}}.

**{{PARTICIPANTE_NOMBRE}}** · {{PARTICIPANTE_EMAIL}} · Folio {{FOLIO}} · Order dated {{FECHA_ORDEN}}.
`;

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    slug: "terminos",
    templateSlug: "terminos-compra",
    stage: "checkout",
    titleEs: "Términos y Condiciones de Compra",
    titleEn: "Purchase Terms and Conditions",
    summaryEs:
      "Contrato de adhesión que se acepta al comprar: precio con IVA, formas de pago, confirmación de la reserva, derecho de revocación (LFPC), cancelaciones, documentos de participación y aceptación electrónica.",
    summaryEn:
      "Adhesion contract accepted at purchase: VAT-inclusive price, payment methods, reservation confirmation, statutory right of withdrawal, cancellations, participation documents and electronic acceptance.",
    bodyEs: TERMINOS_ES,
    bodyEn: TERMINOS_EN,
  },
  {
    slug: "contrato",
    stage: "post-purchase",
    templateSlug: "contrato-servicios",
    titleEs: "Contrato de Participación",
    titleEn: "Participation Agreement",
    summaryEs:
      "Regula la prestación del programa: objeto, inversión con IVA incluido, derecho de revocación (LFPC), cancelaciones y reembolsos, obligaciones de las partes, propiedad intelectual, aceptación electrónica y jurisdicción.",
    summaryEn:
      "Governs delivery of the program: purpose, VAT-inclusive fee, statutory right of withdrawal, cancellations and refunds, obligations of the parties, intellectual property, electronic acceptance and jurisdiction.",
    bodyEs: CONTRATO_ES,
    bodyEn: CONTRATO_EN,
  },
  {
    slug: "nda",
    stage: "post-purchase",
    templateSlug: "nda",
    titleEs: "Acuerdo de Confidencialidad",
    titleEn: "Confidentiality Agreement",
    summaryEs:
      "Protege la metodología Elements Method como secreto industrial y lo que otros participantes comparten en el círculo. Obligaciones recíprocas, excepciones, vigencia de cinco años y remedios conforme al Código Civil Federal.",
    summaryEn:
      "Protects the Elements Method methodology as a trade secret and what other participants share in the circle. Mutual obligations, exceptions, five-year term and remedies under the Federal Civil Code.",
    bodyEs: NDA_ES,
    bodyEn: NDA_EN,
  },
  {
    slug: "relevo",
    stage: "post-purchase",
    templateSlug: "responsiva",
    titleEs: "Consentimiento Informado y Relevo de Responsabilidad",
    titleEn: "Informed Consent and Release of Liability",
    summaryEs:
      "Consentimiento informado sobre la naturaleza y los riesgos inherentes de las actividades, declaración de salud con consentimiento para datos sensibles (LFPDPPP), autorización de atención médica y relevo limitado a lo que permite la ley.",
    summaryEn:
      "Informed consent on the nature and inherent risks of the activities, health declaration with consent for sensitive data, medical-care authorization and a release limited to what Mexican law allows.",
    bodyEs: RELEVO_ES,
    bodyEn: RELEVO_EN,
  },
];

export const findLegalDocument = (slug: string) =>
  LEGAL_DOCUMENTS.find((d) => d.slug === slug);
