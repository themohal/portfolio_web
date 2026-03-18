"use client";

import { useState } from "react";
import BlogCard from "@/components/blog/BlogCard";
import { Post } from "@/types";

const POSTS_PER_PAGE = 9;

export default function BlogListClient({ posts }: { posts: Post[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  if (posts.length === 0) {
    return (
      <div className="text-center py-24 border border-white/10 rounded-xl bg-white/5">
        <div className="text-4xl mb-4">✍️</div>
        <p className="text-white font-semibold text-lg mb-1">No posts yet</p>
        <p className="text-gray-500 text-sm">Check back soon — something is being written.</p>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPosts.map((post, index) => (
          <BlogCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-10 h-10 text-sm rounded-lg border transition-all ${
                currentPage === page
                  ? "bg-blue-600 border-blue-500 text-white font-semibold"
                  : "border-white/10 text-gray-400 hover:text-white hover:border-white/20"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
