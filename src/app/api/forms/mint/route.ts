import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { auth } from "@/shared/auth/config";
import { db } from "@/shared/db/client";
import { forms, formTokens } from "@/shared/db/schema/forms";
import {
  sendMail,
  emailLayout,
  escapeHtml,
} from "@/shared/integrations/resend";

export const runtime = "nodejs";

const Schema = z.object({
  formSlug: z.string().min(3).max(120),
  recipientEmail: z.string().email(),
  recipientName: z.string().max(160).optional(),
  retreatId: z.string().uuid().optional(),
  orderId: z.string().uuid().optional(),
  expiresInDays: z.number().int().positive().max(120).default(30),
  sendEmail: z.boolean().default(true),
  locale: z.enum(["es", "en"]).default("es"),
});

function randomToken(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `ft_${crypto.randomUUID().replace(/-/g, "")}`;
  }
  return `ft_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

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
  const { formSlug, recipientEmail, recipientName, retreatId, orderId, expiresInDays, sendEmail: doSendEmail, locale } = parsed.data;

  const formRow = await db
    .select({ id: forms.id, titleEs: forms.titleEs, titleEn: forms.titleEn })
    .from(forms)
    .where(eq(forms.slug, formSlug))
    .limit(1);
  if (formRow.length === 0) {
    return NextResponse.json({ ok: false, error: "FORM_NOT_FOUND" }, { status: 404 });
  }
  const form = formRow[0];

  const token = randomToken();
  const expiresAt = new Date(Date.now() + expiresInDays * 86400 * 1000);

  try {
    await db.insert(formTokens).values({
      formId: form.id,
      token,
      recipientEmail,
      recipientName: recipientName ?? null,
      retreatId: retreatId ?? null,
      orderId: orderId ?? null,
      expiresAt,
    });
  } catch (e) {
    console.error("[forms:mint] insert failed", e);
    return NextResponse.json({ ok: false, error: "INSERT_FAILED" }, { status: 500 });
  }

  const url = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${locale}/encuesta/${token}`;

  if (doSendEmail) {
    const title = locale === "en" ? form.titleEn ?? form.titleEs : form.titleEs;
    void sendMail({
      to: recipientEmail,
      subject:
        locale === "en"
          ? `Your survey: ${title}`
          : `Tu cuestionario: ${title}`,
      html: emailLayout({
        title,
        body:
          locale === "en"
            ? `
              <p>Hi${recipientName ? `, ${escapeHtml(recipientName)}` : ""}.</p>
              <p>Below is your personal link to the <strong>${escapeHtml(title)}</strong>. The link is one-use only and expires on ${expiresAt.toLocaleDateString("en-US")}.</p>
              <p style="margin-top:20px;"><a href="${url}" style="display:inline-block;background:#2C2C2A;color:#F5F0E8;padding:12px 20px;text-decoration:none;font-size:14px;letter-spacing:.04em;">Open survey →</a></p>
              <p style="margin-top:24px;font-size:12px;color:#5A5752;">Or copy this link: ${url}</p>
            `
            : `
              <p>Hola${recipientName ? `, ${escapeHtml(recipientName)}` : ""}.</p>
              <p>Abajo está tu enlace personal al <strong>${escapeHtml(title)}</strong>. El enlace es de un solo uso y expira el ${expiresAt.toLocaleDateString("es-MX")}.</p>
              <p style="margin-top:20px;"><a href="${url}" style="display:inline-block;background:#2C2C2A;color:#F5F0E8;padding:12px 20px;text-decoration:none;font-size:14px;letter-spacing:.04em;">Abrir cuestionario →</a></p>
              <p style="margin-top:24px;font-size:12px;color:#5A5752;">O copia este enlace: ${url}</p>
            `,
      }),
    });
  }

  return NextResponse.json({ ok: true, token, url, expiresAt });
}
