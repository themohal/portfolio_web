"use client";

import Link from "next/link";
import BlogEditor from "@/components/admin/BlogEditor";

export default function NewBlogPostPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/admin/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
        &larr; Back to Blog Posts
      </Link>
      <h1 className="text-2xl font-bold text-white mt-4 mb-8">New Blog Post</h1>
      <BlogEditor />
    </div>
  );
}
