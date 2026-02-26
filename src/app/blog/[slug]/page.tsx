import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Post } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import BlogContentClient from "./BlogContentClient";
import type { Metadata } from "next";

export const revalidate = 60;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio.example.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, cover_image")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) return { title: "Post Not Found" };

  const ogImage = post.cover_image || `${BASE_URL}/blog/${slug}/opengraph-image`;

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      url: `${BASE_URL}/blog/${slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch current post + all published posts + author settings in parallel
  const [postRes, allPostsRes, settingsRes] = await Promise.all([
    supabase.from("posts").select("*").eq("slug", slug).eq("published", true).single(),
    supabase.from("posts").select("id,title,slug,excerpt,cover_image,created_at").eq("published", true).order("created_at", { ascending: false }),
    supabase.from("site_settings").select("key,value").in("key", ["hero_title", "about_photo"]),
  ]);

  if (!postRes.data) notFound();

  const post = postRes.data as Post;
  const allPosts = (allPostsRes.data as Pick<Post, "id" | "title" | "slug" | "excerpt" | "cover_image" | "created_at">[]) || [];

  // Adjacent posts
  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  // Author info from settings
  let authorName = "Muhammad Farjad Ali Raza";
  let authorPhoto = "";
  if (settingsRes.data) {
    for (const s of settingsRes.data) {
      if (s.key === "hero_title" && typeof s.value === "string") authorName = s.value;
      if (s.key === "about_photo" && typeof s.value === "string") authorPhoto = s.value;
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Sticky navbar */}
      <nav className="sticky top-0 z-10 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Blog
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            Portfolio
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Meta */}
        <div className="mb-6">
          <p className="text-sm text-blue-400 font-medium mb-3">{formatDate(post.created_at)}</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-gray-400 leading-relaxed border-l-2 border-white/10 pl-4">
              {post.excerpt}
            </p>
          )}
        </div>

        {/* Cover image */}
        {post.cover_image && (
          <div className="relative w-full h-64 md:h-[420px] mb-12 rounded-2xl overflow-hidden border border-white/10">
            <Image src={post.cover_image} alt={post.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 to-transparent" />
          </div>
        )}

        {!post.cover_image && (
          <div className="w-full h-px bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-transparent mb-12" />
        )}

        {/* Content — read time, TOC, share, back-to-top all live here */}
        <BlogContentClient content={post.content} postTitle={post.title} />

        {/* Author card */}
        <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
            {authorPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={authorPhoto} alt={authorName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl">👨‍💻</span>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Written by</p>
            <p className="text-white font-semibold">{authorName}</p>
            <Link href="/" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              View portfolio →
            </Link>
          </div>
        </div>

        {/* Prev / Next navigation */}
        {(prevPost || nextPost) && (
          <div className="mt-10 grid grid-cols-2 gap-4">
            <div>
              {prevPost && (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group flex flex-col gap-1 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all h-full"
                >
                  <span className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Previous
                  </span>
                  <span className="text-sm text-white font-medium leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">
                    {prevPost.title}
                  </span>
                </Link>
              )}
            </div>
            <div>
              {nextPost && (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group flex flex-col gap-1 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all text-right h-full"
                >
                  <span className="flex items-center justify-end gap-1 text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                    Next
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                  <span className="text-sm text-white font-medium leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">
                    {nextPost.title}
                  </span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Bottom back link */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to all posts
          </Link>
        </div>
      </article>
    </div>
  );
}
