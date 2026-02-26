import { createClient } from "@/lib/supabase/server";
import { Post } from "@/types";
import BlogListClient from "./BlogListClient";
import Link from "next/link";

export const revalidate = 60;

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="mb-2 flex items-center gap-2">
          <span className="w-8 h-1 bg-blue-600 rounded-full inline-block" />
          <span className="text-blue-400 text-sm font-medium uppercase tracking-widest">Writing</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog</h1>
        <p className="text-gray-400 text-lg max-w-xl">
          Thoughts, tutorials, and insights on software development.
        </p>
      </div>

      {/* Posts */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <BlogListClient posts={(posts as Post[]) || []} />
      </div>
    </div>
  );
}
