import { notFound } from "next/navigation";
import { Banknote, AlertCircle, Check, Mail, Clock } from "lucide-react";
import { eq } from "drizzle-orm";
import { isLocale } from "@/i18n/config";
import { pageMetadata, ROUTES } from "@/lib/seo";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { db } from "@/shared/db/client";
import { orders, products } from "@/shared/db/schema";
import { safeRead } from "@/modules/content/safe";
import { getBankDetails } from "@/shared/payments/bank";
import { TransferProofForm, BankRow } from "./TransferProofForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  // Instrucciones de pago de una orden concreta: nunca se indexa.
  return pageMetadata({
    locale,
    route: ROUTES.transfer,
    title: locale === "en" ? "Bank transfer" : "Transferencia",
    description:
      locale === "en"
        ? "Bank transfer instructions for your Elements Method order."
        : "Instrucciones de pago por transferencia para tu orden de Elements Method.",
    noIndex: true,
  });
}

interface OrderSummary {
  folio: string;
  buyerName: string;
  buyerEmail: string;
  total: string;
  currency: string;
  status: string;
  productName: string | null;
}

/**
 * Resolve the order the buyer was redirected with. Both folio and email must
 * match — the same rule the proof-upload API enforces — so a guessed folio
 * alone never reveals who bought what.
 */
async function loadOrder(
  folio: string,
  email: string,
  locale: "es" | "en",
): Promise<OrderSummary | undefined> {
  return safeRead(undefined, async () => {
    const [o] = await db
      .select({
        folio: orders.folio,
        buyerName: orders.buyerName,
        buyerEmail: orders.buyerEmail,
        total: orders.total,
        currency: orders.currency,
        status: orders.status,
        productIds: orders.productIds,
      })
      .from(orders)
      .where(eq(orders.folio, folio))
      .limit(1);
    if (!o || o.buyerEmail.toLowerCase() !== email.toLowerCase()) return undefined;

    let productName: string | null = null;
    const productId = o.productIds[0];
    if (productId != null) {
      const [p] = await db
        .select({ nameEs: products.nameEs, nameEn: products.nameEn })
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);
      if (p) productName = locale === "en" ? p.nameEn ?? p.nameEs : p.nameEs;
    }
    return { ...o, productName };
  });
}

const money = (amount: string, currency: string) =>
  `$${Number(amount).toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currency}`;

export default async function TransferPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ folio?: string; email?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  if (!isLocale(locale)) notFound();
  const es = locale === "es";

  const folio = (sp.folio ?? "").trim();
  const email = (sp.email ?? "").trim();
  const order = folio && email ? await loadOrder(folio, email, locale) : undefined;

  const bank = getBankDetails();
  const isPaid = order?.status === "paid";
  const isValidating = order?.status === "pending_transfer_validation";

  // ── Copy per state ────────────────────────────────────────────────────
  let headline: string;
  let lead: string;
  if (order && isPaid) {
    headline = es ? "Tu pago ya está confirmado." : "Your payment is confirmed.";
    lead = es
      ? "No necesitas hacer nada más. Revisa tu correo: ahí está tu comprobante y los siguientes pasos."
      : "Nothing else to do. Check your inbox for your receipt and next steps.";
  } else if (order && isValidating) {
    headline = es ? "Recibimos tu comprobante." : "We received your proof.";
    lead = es
      ? "Lo validamos en menos de 24 horas hábiles y te enviamos la confirmación por correo."
      : "We validate it within 24 business hours and email you the confirmation.";
  } else if (order && bank.configured) {
    headline = es
      ? "Ya casi. Completa tu depósito para confirmar tu lugar."
      : "Almost there. Complete your deposit to confirm your seat.";
    lead = es
      ? "Transfiere a la cuenta de abajo usando tu folio como concepto y sube tu comprobante. También te enviamos estos datos por correo."
      : "Transfer to the account below using your folio as the concept and upload your proof. We also emailed you these details.";
  } else if (order) {
    headline = es
      ? "Reserva registrada. Te contactamos por correo."
      : "Reservation registered. We'll be in touch by email.";
    lead = es
      ? "En breve recibirás en tu correo los datos y la liga para realizar tu depósito. Cuando lo hagas, regresa aquí para subir tu comprobante."
      : "You'll shortly receive the details and link to make your deposit by email. Once done, come back here to upload your proof.";
  } else {
    headline = es
      ? "Tres pasos para validar tu pago."
      : "Three steps to validate your payment.";
    lead = es
      ? "Si prefieres SPEI o depósito, transfiere a los datos abajo y sube tu comprobante. Validamos en menos de 24 horas hábiles."
      : "If you prefer SPEI or deposit, transfer to the details below and upload your proof. We validate within 24 business hours.";
  }

  return (
    <>
      <section className="-mt-20 pt-32 md:pt-36 pb-10 bg-[var(--color-paper-warm)] paper-grain">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow className="mb-4 flex items-center gap-3">
              <Banknote className="h-3.5 w-3.5" strokeWidth={1.5} />
              {order
                ? es
                  ? `Reserva registrada · Folio ${order.folio}`
                  : `Reservation registered · Reference ${order.folio}`
                : es
                  ? "Pago por transferencia"
                  : "Bank transfer"}
            </Eyebrow>
            <h1 className="display-3 text-balance">{headline}</h1>
            <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed text-[var(--color-ink-soft)] text-pretty">
              {lead}
            </p>

            {order && (
              <dl className="mt-6 grid sm:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)] max-w-xl">
                <Summary
                  label={es ? "Producto" : "Product"}
                  value={order.productName ?? "—"}
                />
                <Summary
                  label={es ? "Total a depositar" : "Amount to deposit"}
                  value={money(order.total, order.currency)}
                />
                <Summary label={es ? "Folio / concepto" : "Folio / concept"} value={order.folio} mono />
              </dl>
            )}
          </div>
        </Container>
      </section>

      {!isPaid && (
        <Section spacing="default">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-6">
              <h2 className="display-3 mb-6">
                {es ? "Datos bancarios" : "Bank details"}
              </h2>

              {bank.configured ? (
                <>
                  <dl className="border border-[var(--color-line)] bg-[var(--color-paper)] divide-y divide-[var(--color-line)]">
                    <BankRow label={es ? "Banco" : "Bank"} value={bank.name} />
                    {bank.beneficiary && (
                      <BankRow
                        label={es ? "Beneficiario" : "Beneficiary"}
                        value={bank.beneficiary}
                      />
                    )}
                    <BankRow label="CLABE" value={bank.clabe} copyable />
                    {bank.account && (
                      <BankRow
                        label={es ? "Cuenta" : "Account"}
                        value={bank.account}
                        copyable
                      />
                    )}
                    {order && (
                      <BankRow
                        label={es ? "Concepto / referencia" : "Concept / reference"}
                        value={order.folio}
                        copyable
                      />
                    )}
                  </dl>
                  <p className="mt-4 text-xs text-[var(--color-muted)] leading-relaxed">
                    {es
                      ? "Concepto / referencia: tu folio (formato EM-XXXX-XXXX) — sin esto no podemos vincular el pago a tu orden."
                      : "Concept / reference: your folio (format EM-XXXX-XXXX) — without this we cannot link payment to your order."}
                  </p>
                </>
              ) : (
                <div className="border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[var(--color-paper-warm)] shrink-0">
                      <Mail className="h-4.5 w-4.5 text-[var(--color-ink)]" strokeWidth={1.5} />
                    </span>
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] text-xl mb-2">
                        {es
                          ? "Te enviamos los datos por correo"
                          : "We'll email you the details"}
                      </h3>
                      <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                        {es
                          ? "Un miembro del equipo te contactará con los datos bancarios y la liga para realizar tu depósito. Revisa tu bandeja de entrada y la carpeta de spam."
                          : "A team member will contact you with the bank details and the link to make your deposit. Check your inbox and your spam folder."}
                      </p>
                      <p className="mt-3 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                        {es
                          ? "Cuando hayas depositado, sube tu comprobante en el formulario de la derecha con tu folio y tu correo."
                          : "Once you've paid, upload your proof in the form on the right with your folio and email."}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-2 text-xs text-[var(--color-muted)]">
                        <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
                        {es
                          ? "Validamos pagos en menos de 24 horas hábiles."
                          : "We validate payments within 24 business hours."}
                      </div>
                    </div>
                  </div>
                  {process.env.NODE_ENV !== "production" && (
                    <div className="mt-6 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-xs text-amber-900 flex items-start gap-3">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <p>
                        Dev: los datos bancarios no están configurados. Llena las variables{" "}
                        <code className="font-mono">BANK_*</code> en <code className="font-mono">.env</code> para mostrarlos aquí y en el correo.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-6">
              <h2 className="display-3 mb-6">
                {isValidating
                  ? es ? "¿Subir otro comprobante?" : "Upload another proof?"
                  : es ? "Sube tu comprobante" : "Upload your proof"}
              </h2>
              {isValidating && (
                <div className="mb-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 flex items-start gap-3">
                  <Check className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>
                    {es
                      ? "Ya tenemos un comprobante para este folio. Solo sube otro si el anterior estaba incompleto."
                      : "We already have a proof for this folio. Only upload another if the previous one was incomplete."}
                  </p>
                </div>
              )}
              <TransferProofForm
                locale={locale}
                defaultFolio={order?.folio ?? ""}
                defaultEmail={order?.buyerEmail ?? ""}
              />
            </div>
          </div>
        </Section>
      )}
    </>
  );
}

function Summary({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="bg-[var(--color-paper)] px-4 py-3">
      <dt className="text-[0.6rem] uppercase tracking-[0.22em] text-[var(--color-muted)]">
        {label}
      </dt>
      <dd className={`mt-1 text-xs md:text-sm text-[var(--color-ink)] ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
