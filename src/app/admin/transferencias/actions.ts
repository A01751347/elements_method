/**
 * La mutación de "validar transferencia / marcar como pagada" es la misma que
 * usa la ficha de orden (`/admin/pagos/[folio]`), así que su lógica vive en
 * `pagos/actions.ts` y aquí solo se reexporta — evita mantener dos copias del
 * mismo `requireAdmin` + `sendPaymentConfirmation` + guardia de doble clic.
 */
export { markOrderPaid, marcarPagada } from "../pagos/actions";
