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
      <nav className="border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
            Portfolio
          </Link>
          <Link href="/blog" className="text-sm text-blue-400">
            Blog
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-white mb-2">Blog</h1>
        <p className="text-gray-400 mb-12">Thoughts, tutorials, and insights on software development.</p>

        <BlogListClient posts={(posts as Post[]) || []} />
      </div>
    </div>
  );
}
