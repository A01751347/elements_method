import { notFound } from "next/navigation";
import { Banknote, AlertCircle } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { TransferProofForm, BankRow } from "./TransferProofForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title:
      locale === "en"
        ? "Bank transfer · Elements Method"
        : "Transferencia · Elements Method",
  };
}

export default async function TransferPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const bank = {
    name: process.env.BANK_NAME || "[BANCO POR CONFIGURAR]",
    beneficiary: process.env.BANK_BENEFICIARY || "[BENEFICIARIO POR CONFIGURAR]",
    clabe: process.env.BANK_CLABE || "[CLABE POR CONFIGURAR]",
    account: process.env.BANK_ACCOUNT_NUMBER || "[CUENTA POR CONFIGURAR]",
  };
  const hasRealBank = !!process.env.BANK_NAME;

  return (
    <>
      <section className="-mt-20 pt-36 md:pt-44 pb-12 bg-[var(--color-paper-warm)] paper-grain">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow className="mb-6 flex items-center gap-3">
              <Banknote className="h-3.5 w-3.5" strokeWidth={1.5} />
              {locale === "es" ? "Pago por transferencia" : "Bank transfer"}
            </Eyebrow>
            <h1 className="display-1 text-balance">
              {locale === "es"
                ? "Tres pasos para validar tu pago."
                : "Three steps to validate your payment."}
            </h1>
            <p className="lead mt-6 text-pretty">
              {locale === "es"
                ? "Si prefieres SPEI o depósito, transfiere a los datos abajo y sube tu comprobante. Validamos en menos de 24 horas hábiles."
                : "If you prefer SPEI or deposit, transfer to the details below and upload your proof. We validate within 24 business hours."}
            </p>
          </div>
        </Container>
      </section>

      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6">
            <h2 className="display-3 mb-6">
              {locale === "es" ? "Datos bancarios" : "Bank details"}
            </h2>
            {!hasRealBank && (
              <div className="mb-6 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex items-start gap-3">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                  {locale === "es"
                    ? "Datos bancarios pendientes de configurar. Reemplazar las variables BANK_* en .env antes del lanzamiento."
                    : "Bank details pending configuration. Replace BANK_* env vars before launch."}
                </p>
              </div>
            )}
            <dl className="border border-[var(--color-line)] bg-[var(--color-paper)] divide-y divide-[var(--color-line)]">
              <BankRow label={locale === "es" ? "Banco" : "Bank"} value={bank.name} />
              <BankRow
                label={locale === "es" ? "Beneficiario" : "Beneficiary"}
                value={bank.beneficiary}
              />
              <BankRow label="CLABE" value={bank.clabe} copyable />
              <BankRow
                label={locale === "es" ? "Cuenta" : "Account"}
                value={bank.account}
                copyable
              />
            </dl>
            <p className="mt-4 text-xs text-[var(--color-muted)] leading-relaxed">
              {locale === "es"
                ? "Concepto / referencia: tu folio (formato EM-XXXX-XXXX) — sin esto no podemos vincular el pago a tu orden."
                : "Concept / reference: your folio (format EM-XXXX-XXXX) — without this we cannot link payment to your order."}
            </p>
          </div>

          <div className="lg:col-span-6">
            <h2 className="display-3 mb-6">
              {locale === "es" ? "Sube tu comprobante" : "Upload your proof"}
            </h2>
            <TransferProofForm locale={locale} />
          </div>
        </div>
      </Section>
    </>
  );
}

