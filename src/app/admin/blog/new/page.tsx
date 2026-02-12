"use client";

import Link from "next/link";
import BlogEditor from "@/components/admin/BlogEditor";

export default function NewBlogPostPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/admin/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
            &larr; Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">New Blog Post</h1>
        <BlogEditor />
      </div>
    </div>
  );
}
