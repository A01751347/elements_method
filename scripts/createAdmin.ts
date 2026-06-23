/**
 * Pre-create an admin user row.
 *
 * Auth.js + DrizzleAdapter auto-creates the user row on first sign-in,
 * so this is *optional* — but useful when:
 *  - You want the user visible in /admin/compradores before they ever log in.
 *  - You're seeding a fresh DB and want a "first admin" present.
 *
 * Usage:
 *   pnpm db:create-admin contacto@elementsmethod.com "Contacto Elements"
 *   pnpm db:create-admin alguien@correo.com
 *
 * The script:
 *  1. Verifies the email is in ADMIN_EMAILS (else refuses — auth would block sign-in anyway).
 *  2. Upserts a row in the `users` table (idempotent).
 *  3. Marks `emailVerified = now()` so the very first magic-link click skips a step.
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../src/shared/db/client";
import { users } from "../src/shared/db/schema/auth";

function adminEmailList(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

async function main() {
  const [, , rawEmail, rawName] = process.argv;
  if (!rawEmail) {
    console.error("Usage: pnpm db:create-admin <email> [name]");
    process.exit(1);
  }
  const email = rawEmail.trim().toLowerCase();
  const name = rawName?.trim() || email.split("@")[0];

  if (!email.includes("@")) {
    console.error(`Invalid email: ${email}`);
    process.exit(1);
  }

  const allowed = adminEmailList();
  if (!allowed.includes(email)) {
    console.error(
      `\n⚠  ${email} is NOT in ADMIN_EMAILS.\n` +
        `Auth.js will refuse magic-link sign-in for this address.\n\n` +
        `Add it to .env first:\n` +
        `  ADMIN_EMAILS=${allowed.join(",")}${allowed.length ? "," : ""}${email}\n`,
    );
    process.exit(1);
  }

  const existing = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    console.log(`✓ User already exists · id=${existing[0].id} email=${existing[0].email}`);
    return;
  }

  const [created] = await db
    .insert(users)
    .values({
      email,
      name,
      emailVerified: new Date(),
    })
    .returning({ id: users.id, email: users.email });

  console.log(`✓ Created admin user · id=${created.id} email=${created.email}`);
  console.log(`\nThey can now sign in at:`);
  console.log(`  ${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/admin/signin`);
  console.log(`\nMagic link arrives via Resend (RESEND_API_KEY) to ${email}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
