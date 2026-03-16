import { getBlogPostsServer } from "@/lib/firebase/adminFirestore";
import BlogListClient from "./BlogListClient";

export const revalidate = 3600;

export default async function BlogPage() {
  const allPosts = await getBlogPostsServer();
  const publishedPosts = allPosts.filter((p) => p.published !== false);

  return <BlogListClient posts={publishedPosts} />;
}
