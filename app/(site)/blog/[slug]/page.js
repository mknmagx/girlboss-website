import { notFound } from "next/navigation";
import { getBlogPostBySlugServer, getBlogPostsServer } from "@/lib/firebase/adminFirestore";
import BlogDetailClient from "./BlogDetailClient";

export const revalidate = 3600;

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlugServer(slug);
  if (!post) return notFound();

  const allPosts = await getBlogPostsServer();
  const publishedPosts = allPosts.filter((p) => p.published !== false);

  const postIndex = publishedPosts.findIndex((p) => p.slug === slug);
  const prevPost = postIndex > 0 ? publishedPosts[postIndex - 1] : null;
  const nextPost = postIndex < publishedPosts.length - 1 ? publishedPosts[postIndex + 1] : null;
  const related = publishedPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <BlogDetailClient
      post={post}
      related={related}
      prevPost={prevPost}
      nextPost={nextPost}
    />
  );
}
