"use client";

import BlogCard from "@/components/blog/BlogCard";
import { Post } from "@/types";

export default function BlogListClient({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No posts yet. Check back soon!</p>
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
