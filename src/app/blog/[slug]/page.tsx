import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Post } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import BlogContentClient from "./BlogContentClient";

export const revalidate = 60;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) notFound();

  const typedPost = post as Post;

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
            &larr; Back to Blog
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-sm text-gray-500 mb-4">{formatDate(typedPost.created_at)}</p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{typedPost.title}</h1>
        {typedPost.excerpt && (
          <p className="text-xl text-gray-400 mb-8">{typedPost.excerpt}</p>
        )}

        {typedPost.cover_image && (
          <div className="relative w-full h-64 md:h-96 mb-12 rounded-xl overflow-hidden">
            <Image
              src={typedPost.cover_image}
              alt={typedPost.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <BlogContentClient content={typedPost.content} />
      </article>
    </div>
  );
}
