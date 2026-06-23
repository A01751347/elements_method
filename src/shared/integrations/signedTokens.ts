/**
 * Signed JWT-style tokens for one-off document-signing links + form access.
 * Uses `jose` (already in deps) so we don't pull in another crypto lib.
 *
 * Token payload: { orderDocId, expiresAt }
 * Signature: HS256 with FORM_SIGNING_SECRET.
 */
import "server-only";
import { SignJWT, jwtVerify } from "jose";

const secretText = process.env.FORM_SIGNING_SECRET || "dev-secret-replace-me";
const key = new TextEncoder().encode(secretText);

export interface SignTokenPayload {
  orderDocId: string;
  email: string;
  expiresInSec?: number;
}

export async function signToken({
  orderDocId,
  email,
  expiresInSec = 60 * 60 * 24 * 14, // 14 days
}: SignTokenPayload): Promise<string> {
  return await new SignJWT({ orderDocId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${expiresInSec}s`)
    .sign(key);
}

export async function verifyToken(
  token: string,
): Promise<
  | { ok: true; orderDocId: string; email: string }
  | { ok: false; error: string }
> {
  try {
    const { payload } = await jwtVerify(token, key);
    if (!payload.orderDocId || !payload.email) {
      return { ok: false, error: "INVALID_PAYLOAD" };
    }
    return {
      ok: true,
      orderDocId: String(payload.orderDocId),
      email: String(payload.email),
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "VERIFY_FAILED",
    };
  }
}
