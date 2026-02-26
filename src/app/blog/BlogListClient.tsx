"use client";

import BlogCard from "@/components/blog/BlogCard";
import { Post } from "@/types";

export default function BlogListClient({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-24 border border-white/10 rounded-xl bg-white/5">
        <div className="text-4xl mb-4">✍️</div>
        <p className="text-white font-semibold text-lg mb-1">No posts yet</p>
        <p className="text-gray-500 text-sm">Check back soon — something is being written.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <BlogCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}
