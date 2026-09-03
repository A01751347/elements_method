import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, AlertCircle, Download } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { eq } from "drizzle-orm";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { contactInfo } from "@/data/launchData";
import { db } from "@/shared/db/client";
import { orders } from "@/shared/db/schema";
import { safeRead } from "@/modules/content/safe";
import { PurchaseTracker } from "@/components/integrations/PurchaseTracker";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title:
      locale === "en"
        ? "Thank you · Elements Method"
        : "Gracias · Elements Method",
  };
}

export default async function ThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string; dryrun?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  if (!isLocale(locale)) notFound();

  const isDryRun = sp.dryrun === "1";

  // Resolve the paid order (if any) so we can fire the Purchase conversion event
  // with the real amount. Degrades safely when the order/table isn't there.
  const order = sp.session_id
    ? await safeRead(undefined, async () => {
        const rows = await db
          .select({
            total: orders.total,
            currency: orders.currency,
            folio: orders.folio,
          })
          .from(orders)
          .where(eq(orders.stripeSessionId, sp.session_id!))
          .limit(1);
        return rows[0];
      })
    : undefined;

  return (
    <>
      {order && (
        <PurchaseTracker
          value={Number(order.total)}
          currency={order.currency}
          transactionId={order.folio}
        />
      )}
      <section className="-mt-20 pt-36 md:pt-44 pb-12 bg-[var(--color-paper-warm)] paper-grain">
        <Container>
          <div className="max-w-3xl">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-emerald-100 mb-8">
              <Check className="h-7 w-7 text-emerald-700" strokeWidth={2} />
            </div>
            <h1 className="display-1 text-balance">
              {locale === "es"
                ? "Recibido. Te escribimos en menos de 24 horas."
                : "Received. We'll write to you within 24 hours."}
            </h1>
            <p className="lead mt-6 text-pretty">
              {locale === "es"
                ? "Tu reserva fue procesada. Un miembro del equipo te enviará un correo con los siguientes pasos — incluyendo confirmación de sede, itinerario detallado y los documentos a firmar."
                : "Your reservation was processed. A team member will email you with the next steps — including venue confirmation, detailed itinerary, and documents to sign."}
            </p>

            {isDryRun && (
              <div className="mt-8 border-l-4 border-amber-500 bg-amber-50 px-5 py-4 text-sm text-amber-900 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" strokeWidth={1.5} />
                <div>
                  <div className="font-medium mb-1">Modo demo</div>
                  <p>
                    El pago se simuló porque <code className="font-mono bg-amber-100 px-1">STRIPE_SECRET_KEY</code>{" "}
                    aún no está cableada con la cuenta real. La orden fue persistida en la base de datos como{" "}
                    <code className="font-mono bg-amber-100 px-1">pending_payment</code>.
                  </p>
                </div>
              </div>
            )}

            {order && (
              <div className="mt-8">
                <a
                  href={`/api/comprobante/${order.folio}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[var(--color-ink)] text-[var(--color-paper)] px-5 py-3 text-sm tracking-wide hover:bg-[var(--color-ink)]/90 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  {locale === "es" ? "Descargar comprobante (PDF)" : "Download receipt (PDF)"}
                </a>
                <p className="mt-3 text-xs text-[var(--color-muted)] font-mono">
                  {locale === "es" ? "Folio" : "Reference"}: {order.folio}
                </p>
              </div>
            )}

            {!order && sp.session_id && (
              <p className="mt-4 text-xs text-[var(--color-muted)] font-mono">
                Referencia: {sp.session_id}
              </p>
            )}
          </div>
        </Container>
      </section>

      <Section spacing="default">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <h2 className="display-3 mb-6">
              {locale === "es" ? "Qué sigue" : "What's next"}
            </h2>
            <ol className="space-y-6 text-[var(--color-ink-soft)] leading-relaxed">
              <Step
                n={1}
                title={locale === "es" ? "Email de confirmación" : "Confirmation email"}
                body={
                  locale === "es"
                    ? "Recibirás un email con el resumen de tu reserva, el folio interno y los documentos que necesitamos que firmes (Contrato, NDA y Relevo)."
                    : "You'll receive an email with your reservation summary, internal folio, and the documents to sign (Agreement, NDA, Release)."
                }
              />
              <Step
                n={2}
                title={locale === "es" ? "Conversación de bienvenida" : "Welcome call"}
                body={
                  locale === "es"
                    ? "Agendamos una llamada de 30 minutos antes del retiro para conocer tu contexto y aterrizar tu intención. Sin esto, no abrimos cupo."
                    : "We schedule a 30-minute call before the retreat to understand your context and ground your intention. Without this, we don't open seats."
                }
              />
              <Step
                n={3}
                title={locale === "es" ? "Logística + sede confirmada" : "Logistics + confirmed venue"}
                body={
                  locale === "es"
                    ? "60 días antes del retiro confirmamos sede, itinerario detallado y todos los proveedores que estarán presentes."
                    : "60 days before the retreat we confirm venue, detailed itinerary and all the providers present."
                }
              />
            </ol>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                href={`/${locale}/${locale === "es" ? "retiros" : "retreats"}`}
                variant="primary"
                trailingArrow
              >
                {locale === "es" ? "Ver calendario" : "See calendar"}
              </Button>
              <Button
                href={`/${locale}/${locale === "es" ? "el-metodo" : "method"}`}
                variant="secondary"
              >
                {locale === "es" ? "Conocer el método" : "Learn the method"}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-[var(--color-line)] bg-[var(--color-paper-warm)] p-6">
              <div className="eyebrow text-[var(--color-muted)] mb-4">
                {locale === "es" ? "Contacto directo" : "Direct contact"}
              </div>
              <div className="space-y-3 text-sm">
                <a
                  href={`tel:${contactInfo.phoneE164}`}
                  className="block hover:text-[var(--color-gold-deep)]"
                >
                  {contactInfo.phoneDisplayMx}
                </a>
                <a
                  href={contactInfo.whatsappLink}
                  className="block hover:text-[var(--color-gold-deep)]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
                <a
                  href="mailto:hello@elementsmethod.com"
                  className="block hover:text-[var(--color-gold-deep)]"
                >
                  hello@elementsmethod.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="grid grid-cols-[60px_1fr] gap-5">
      <span className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-gold-deep)] tabular-nums leading-none">
        {String(n).padStart(2, "0")}
      </span>
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-xl mb-1">{title}</h3>
        <p className="text-sm text-[var(--color-ink-soft)]">{body}</p>
      </div>
    </li>
  );
}
