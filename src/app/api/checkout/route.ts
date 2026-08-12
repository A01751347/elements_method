import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/shared/db/client";
import { orders, documentTemplates, orderDocuments } from "@/shared/db/schema";
import { createCheckoutSession } from "@/shared/integrations/stripe";
import { buildLegalDocPdf } from "@/shared/pdf/legalDoc";

export const runtime = "nodejs";

const Schema = z.object({
  retreatSlug: z.string().max(120).optional(),
  pathSlug: z.string().max(120).optional(),
  email: z.string().email(),
  name: z.string().min(2).max(160),
  amountMxn: z.number().int().positive().max(2_000_000),
  productName: z.string().min(2).max(200),
  locale: z.enum(["es", "en"]).default("es"),
  acceptedDocs: z.array(z.string().max(120)).max(20).optional(),
});

/**
 * For each accepted document, generate the personalized PDF, hash it, and store
 * an immutable acceptance record in order_documents. Best-effort per document.
 */
async function recordAcceptedDocs(
  orderId: string,
  data: z.infer<typeof Schema>,
) {
  for (const slug of data.acceptedDocs ?? []) {
    try {
      const tplRows = await db
        .select()
        .from(documentTemplates)
        .where(
          and(
            eq(documentTemplates.slug, slug),
            eq(documentTemplates.active, true),
          ),
        )
        .limit(1);
      const tpl = tplRows[0];
      if (!tpl) continue;

      const templateMarkdown =
        data.locale === "en"
          ? tpl.templateHtmlEn ?? tpl.templateHtmlEs
          : tpl.templateHtmlEs;
      const { hash } = await buildLegalDocPdf({
        name: data.locale === "en" ? tpl.nameEn ?? tpl.nameEs : tpl.nameEs,
        templateMarkdown,
        tokens: {
          PARTICIPANTE_NOMBRE: data.name,
          PARTICIPANTE_EMAIL: data.email,
          INVERSION_MXN: data.amountMxn.toLocaleString("es-MX"),
        },
      });

      await db.insert(orderDocuments).values({
        orderId,
        documentTemplateId: tpl.id,
        documentVersion: tpl.currentVersion,
        // The PDF is generated on demand from /api/documento; the hash pins the
        // exact accepted content/version.
        generatedPdfUrl: `/api/documento/${slug}`,
        generatedPdfHash: hash,
        accepted: true,
        acceptedAt: new Date(),
      });
    } catch (e) {
      console.error(`[checkout] record accepted doc ${slug} failed`, e);
    }
  }
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = Schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "VALIDATION", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const data = parsed.data;

  const session = await createCheckoutSession({
    customerEmail: data.email,
    retreatSlug: data.retreatSlug,
    pathSlug: data.pathSlug,
    successPath: data.locale === "en" ? "/en/thank-you" : "/es/gracias",
    cancelPath:
      (data.retreatSlug
        ? data.locale === "en"
          ? `/en/retreats/${data.retreatSlug}`
          : `/es/retiros/${data.retreatSlug}`
        : data.locale === "en"
          ? "/en/retreats"
          : "/es/retiros"),
    metadata: { source: "site", customer_name: data.name },
    lines: [
      {
        productName: data.productName,
        amountMxn: data.amountMxn,
      },
    ],
  });

  if (!session.ok) {
    return NextResponse.json({ ok: false, error: session.error }, { status: 500 });
  }

  // Persist a draft order — best-effort; dev DB may not be reachable.
  try {
    const ivaRate = Number(process.env.IVA_RATE ?? "0.16");
    const subtotal = data.amountMxn / (1 + ivaRate);
    const iva = data.amountMxn - subtotal;
    const folio = `EM-${new Date().toISOString().slice(2, 7).replace("-", "")}-${Math.floor(
      Math.random() * 10000,
    )
      .toString()
      .padStart(4, "0")}`;
    const inserted = await db
      .insert(orders)
      .values({
        folio,
        buyerType: "persona",
        buyerName: data.name,
        buyerEmail: data.email,
        productIds: [],
        retreatId: null,
        subtotal: subtotal.toFixed(2),
        iva: iva.toFixed(2),
        total: String(data.amountMxn),
        currency: "MXN",
        language: data.locale,
        paymentMethod: "stripe",
        stripeSessionId: session.sessionId ?? null,
        status: "pending_payment",
      })
      .returning({ id: orders.id });

    // Record accepted documents as immutable snapshots (RF-DOC-05/09).
    const orderId = inserted[0]?.id;
    if (orderId && data.acceptedDocs && data.acceptedDocs.length > 0) {
      await recordAcceptedDocs(orderId, data);
    }
  } catch (e) {
    console.error("[checkout] order draft insert failed", e);
  }

  return NextResponse.json({
    ok: true,
    url: session.url,
    sessionId: session.sessionId,
    dryRun: !!session.dryRun,
  });
}
