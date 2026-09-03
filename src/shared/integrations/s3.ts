/**
 * AWS S3 — presigned URLs signed natively with `node:crypto`.
 *
 * No `@aws-sdk/*` dependency: the SDK pulls several MB into every serverless
 * function and all we need is SigV4 query signing, which is a stable, fully
 * specified algorithm. Same reasoning as the Stripe webhook verifier.
 *
 * Two operations:
 *   - `presignUpload`  → browser PUTs the file straight to S3 (no proxying
 *                        through our function, so no 4.5 MB body limit).
 *   - `presignDownload`→ short-lived GET so the admin can open a proof even
 *                        when the bucket blocks public reads.
 *
 * Degrades honestly: with no credentials `isConfigured()` is false and callers
 * surface "upload unavailable" instead of inventing a URL.
 */
import "server-only";
import crypto from "node:crypto";

const REGION = process.env.S3_REGION || "us-east-2";
const BUCKET = process.env.S3_BUCKET || "elements-method-images";
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const SERVICE = "s3";
const ALGORITHM = "AWS4-HMAC-SHA256";

export const S3_BUCKET = BUCKET;
export const S3_REGION = REGION;
export const S3_HOST = `${BUCKET}.s3.${REGION}.amazonaws.com`;

/** True only when both credentials are present. */
export function isConfigured(): boolean {
  return Boolean(ACCESS_KEY && SECRET_KEY);
}

/** RFC 3986 encoding — S3 requires `!'()*` escaped too, and `/` kept in paths. */
function uriEncode(value: string, keepSlashes = false): string {
  const encoded = encodeURIComponent(value).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
  return keepSlashes ? encoded.replace(/%2F/g, "/") : encoded;
}

function hmac(key: crypto.BinaryLike, data: string): Buffer {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest();
}

function sha256Hex(data: string): string {
  return crypto.createHash("sha256").update(data, "utf8").digest("hex");
}

/** kSigning = HMAC(HMAC(HMAC(HMAC("AWS4"+secret, date), region), service), "aws4_request") */
function signingKey(secret: string, date: string): Buffer {
  return hmac(hmac(hmac(hmac(`AWS4${secret}`, date), REGION), SERVICE), "aws4_request");
}

/** Split an ISO timestamp into the two formats SigV4 needs. */
function stamps(now: Date): { amzDate: string; date: string } {
  const amzDate = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return { amzDate, date: amzDate.slice(0, 8) };
}

/**
 * Build a presigned URL for `method` on `key`, valid for `expiresIn` seconds.
 *
 * Only `host` is signed, so the caller is free to send whatever Content-Type it
 * likes — S3 stores it without it having to match the signature.
 */
function presign(
  method: "PUT" | "GET",
  key: string,
  expiresIn: number,
  now: Date = new Date(),
): string {
  if (!ACCESS_KEY || !SECRET_KEY) {
    throw new Error("S3 credentials are not configured");
  }
  const { amzDate, date } = stamps(now);
  const scope = `${date}/${REGION}/${SERVICE}/aws4_request`;

  // Query params must be sorted by key, each component URI-encoded.
  const params: [string, string][] = [
    ["X-Amz-Algorithm", ALGORITHM],
    ["X-Amz-Credential", `${ACCESS_KEY}/${scope}`],
    ["X-Amz-Date", amzDate],
    ["X-Amz-Expires", String(expiresIn)],
    ["X-Amz-SignedHeaders", "host"],
  ];
  const canonicalQuery = params
    .map(([k, v]) => [uriEncode(k), uriEncode(v)] as const)
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const canonicalUri = `/${uriEncode(key, true)}`;
  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQuery,
    `host:${S3_HOST}\n`,
    "host",
    "UNSIGNED-PAYLOAD",
  ].join("\n");

  const stringToSign = [
    ALGORITHM,
    amzDate,
    scope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const signature = crypto
    .createHmac("sha256", signingKey(SECRET_KEY, date))
    .update(stringToSign, "utf8")
    .digest("hex");

  return `https://${S3_HOST}${canonicalUri}?${canonicalQuery}&X-Amz-Signature=${signature}`;
}

/** Canonical (unsigned) object URL — what we persist on the order. */
export function objectUrl(key: string): string {
  return `https://${S3_HOST}/${uriEncode(key, true)}`;
}

/**
 * Recover the object key from a canonical URL produced by `objectUrl`.
 * Returns null for anything not on our bucket — callers use this to reject
 * attacker-supplied URLs pointing somewhere else.
 */
export function keyFromUrl(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" || parsed.hostname !== S3_HOST) return null;
  const key = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
  return key.length > 0 ? key : null;
}

/** Presigned PUT — 5 minutes is plenty for a browser upload. */
export function presignUpload(key: string, expiresIn = 300): string {
  return presign("PUT", key, expiresIn);
}

/** Presigned GET — short-lived read for the admin. */
export function presignDownload(key: string, expiresIn = 300): string {
  return presign("GET", key, expiresIn);
}
