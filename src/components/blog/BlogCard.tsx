"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Post } from "@/types";
import { formatDate } from "@/lib/utils";

export default function BlogCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300">
          {post.cover_image ? (
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
            </div>
          ) : (
            <div className="w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600" />
          )}

          <div className="p-6">
            <p className="text-xs text-gray-500 mb-3 font-medium">{formatDate(post.created_at)}</p>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors leading-snug">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{post.excerpt}</p>
            )}
            <div className="mt-4 flex items-center gap-1.5 text-sm text-blue-400 group-hover:gap-2.5 transition-all">
              <span>Read more</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
