"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { Post } from "@/types";
import { formatDate } from "@/lib/utils";

export default function BlogCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card hover className="overflow-hidden">
          {post.cover_image && (
            <div className="relative w-full h-48">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-2">{formatDate(post.created_at)}</p>
            <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
            {post.excerpt && (
              <p className="text-gray-400 text-sm line-clamp-2">{post.excerpt}</p>
            )}
            <span className="inline-block mt-4 text-sm text-blue-400 hover:text-blue-300">
              Read more &rarr;
            </span>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
