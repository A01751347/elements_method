import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/shared/db/client";
import { blogPosts, blogComments } from "@/shared/db/schema";

export const runtime = "nodejs";

const Schema = z.object({
  postSlug: z.string().min(1).max(200),
  authorName: z.string().min(2).max(120),
  authorEmail: z.string().email(),
  content: z.string().min(2).max(4000),
  sessionId: z.string().min(1).max(120),
  honeypot: z.string().optional(),
});

/**
 * POST /api/comentarios — submit a blog comment.
 *
 * Pre-moderation with "ghost UX": the comment is stored as `pending` and is NOT
 * shown to the public until an admin approves it, BUT the response echoes it
 * back so the author sees their own comment appear immediately (via sessionId).
 * The admin moderation UI already exists (/admin/comentarios).
 */
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
  if (data.honeypot && data.honeypot.length > 0) {
    return NextResponse.json({ ok: true, ghost: true });
  }

  const postRows = await db
    .select({ id: blogPosts.id })
    .from(blogPosts)
    .where(eq(blogPosts.slug, data.postSlug))
    .limit(1);
  const post = postRows[0];
  if (!post) {
    return NextResponse.json({ ok: false, error: "POST_NOT_FOUND" }, { status: 404 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = req.headers.get("user-agent") ?? null;

  const inserted = await db
    .insert(blogComments)
    .values({
      postId: post.id,
      authorName: data.authorName,
      authorEmail: data.authorEmail,
      content: data.content,
      status: "pending",
      sessionId: data.sessionId,
      ipAddress: ip,
      userAgent,
    })
    .returning({ id: blogComments.id, createdAt: blogComments.createdAt });

  return NextResponse.json({
    ok: true,
    comment: {
      id: inserted[0]?.id,
      authorName: data.authorName,
      content: data.content,
      createdAt: inserted[0]?.createdAt,
      pending: true,
    },
  });
}

/**
 * GET /api/comentarios?postSlug=…&sessionId=… — approved comments for a post,
 * PLUS the caller's own pending comments (ghost UX) matched by sessionId.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const postSlug = url.searchParams.get("postSlug");
  const sessionId = url.searchParams.get("sessionId");
  if (!postSlug) {
    return NextResponse.json({ ok: false, error: "MISSING_SLUG" }, { status: 400 });
  }

  const postRows = await db
    .select({ id: blogPosts.id })
    .from(blogPosts)
    .where(eq(blogPosts.slug, postSlug))
    .limit(1);
  const post = postRows[0];
  if (!post) {
    return NextResponse.json({ ok: true, comments: [] });
  }

  const rows = await db
    .select()
    .from(blogComments)
    .where(eq(blogComments.postId, post.id))
    .orderBy(desc(blogComments.createdAt));

  const visible = rows.filter(
    (c) =>
      c.status === "approved" ||
      (sessionId && c.sessionId === sessionId && c.status === "pending"),
  );

  return NextResponse.json({
    ok: true,
    comments: visible.map((c) => ({
      id: c.id,
      authorName: c.authorName,
      content: c.content,
      createdAt: c.createdAt,
      pending: c.status === "pending",
    })),
  });
}
