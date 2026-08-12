import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/shared/db/client";
import { blogPosts } from "@/shared/db/schema/blog";
import { AdminPageHeader } from "../../_components/admin-ui";
import { BlogForm } from "../BlogForm";

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);
  if (!post) notFound();

  return (
    <>
      <AdminPageHeader
        title={`Post: ${post.titleEs}`}
        subtitle={`${post.status} · /${post.slug}`}
      />
      <BlogForm post={post} />
    </>
  );
}

export const dynamic = "force-dynamic";
