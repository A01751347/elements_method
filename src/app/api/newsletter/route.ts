import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { subscribers } from "@/shared/db/schema/integrations";
import { subscribeToMailchimp } from "@/shared/integrations/mailchimp";
import { sendAll, emailLayout, escapeHtml, appUrl } from "@/shared/integrations/resend";

export const runtime = "nodejs";

const Schema = z.object({
  email: z.string().email().max(200),
  firstName: z.string().max(80).optional(),
  phone: z.string().max(40).optional(),
  source: z.string().max(40).optional(),
  locale: z.enum(["es", "en"]).default("es"),
  honeypot: z.string().max(200).optional(),
});

/** Welcome note — what they just signed up to receive. */
function welcomeEmail(email: string, firstName: string | undefined, locale: "es" | "en") {
  const es = locale === "es";
  const hi = firstName ? `${es ? "Hola" : "Hi"} ${escapeHtml(firstName)},` : es ? "Hola," : "Hi,";
  return {
    to: email,
    subject: es
      ? "Bienvenida a la nota mensual — Elements Method"
      : "Welcome to the monthly note — Elements Method",
    html: emailLayout({
      title: es ? "Estás dentro." : "You're in.",
      preheader: es
        ? "Una nota al mes: casos, estudios y práctica."
        : "One note a month: cases, research and practice.",
      body: `
        <p>${hi}</p>
        <p>${
          es
            ? "Gracias por suscribirte. Una vez al mes te escribimos con casos de nuestras inmersiones, los estudios que sostienen la metodología y artículos de neurociencia, PNL y psicología aplicados al liderazgo."
            : "Thanks for subscribing. Once a month we write with cases from our immersions, the research behind the methodology, and articles on neuroscience, NLP and psychology applied to leadership."
        }</p>
        <p style="margin-top:18px;">
          <a href="${appUrl()}/${locale}/${es ? "blog" : "journal"}"
             style="display:inline-block;background:#2C2C2A;color:#F5F0E8;padding:12px 20px;text-decoration:none;font-size:14px;letter-spacing:.04em;">
            ${es ? "Leer el journal" : "Read the journal"}
          </a>
        </p>
        <p style="margin-top:24px;font-style:italic;color:#5A5752;">${
          es
            ? "La naturaleza no gestiona. La naturaleza lidera."
            : "Nature doesn't manage. Nature leads."
        }</p>
      `,
    }),
  };
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
  if (parsed.data.honeypot) {
    return NextResponse.json({ ok: true, accepted: false });
  }

  const { firstName, phone, source, locale } = parsed.data;
  const email = parsed.data.email.trim().toLowerCase();

  // Two separate flags: `stored` says the row actually persisted, `isNew` says
  // this address had not opted in before. The welcome email needs both — a
  // failed write previously left isNew=true and re-sent the welcome on every
  // retry.
  let isNew = false;
  let stored = false;
  try {
    const [existing] = await db
      .select({ id: subscribers.id, unsubscribedAt: subscribers.unsubscribedAt })
      .from(subscribers)
      .where(eq(subscribers.email, email))
      .limit(1);

    if (!existing) {
      await db.insert(subscribers).values({
        email,
        name: firstName ?? null,
        phone: phone ?? null,
        source: source ?? "footer",
        language: locale,
        mailchimpStatus: "pending",
      });
      isNew = true;
      stored = true;
    } else {
      // Someone signing up again is opting back in — clear the opt-out stamp
      // and top up whatever they gave us this time.
      await db
        .update(subscribers)
        .set({
          ...(phone ? { phone } : {}),
          ...(firstName ? { name: firstName } : {}),
          ...(existing.unsubscribedAt ? { unsubscribedAt: null } : {}),
          language: locale,
        })
        .where(eq(subscribers.email, email));
      isNew = Boolean(existing.unsubscribedAt);
      stored = true;
    }
  } catch (e) {
    // Surfacing this matters: a silent failure here is how the `phone` column
    // drift went unnoticed while every signup was being dropped.
    console.error("[newsletter] DB upsert failed", e);
    return NextResponse.json({ ok: false, error: "SUBSCRIBE_FAILED" }, { status: 500 });
  }

  const mc = await subscribeToMailchimp({
    email,
    firstName,
    phone,
    source: source ?? "footer",
    locale,
    tags: source ? [source] : undefined,
  });

  if (mc.ok) {
    try {
      await db
        .update(subscribers)
        .set({ mailchimpStatus: mc.status, mailchimpSyncedAt: new Date() })
        .where(eq(subscribers.email, email));
    } catch {
      /* best-effort */
    }
  } else {
    console.error(`[newsletter] mailchimp sync failed for ${email}: ${mc.error}`);
  }

  if (stored && isNew) {
    await sendAll([welcomeEmail(email, firstName, locale)]);
  }

  return NextResponse.json({ ok: true, status: mc.status });
}
