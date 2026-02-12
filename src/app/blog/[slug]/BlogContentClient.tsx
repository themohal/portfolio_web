"use client";

import BlogContent from "@/components/blog/BlogContent";

export default function BlogContentClient({
  content,
}: {
  content: Record<string, unknown>;
}) {
  return <BlogContent content={content} />;
}
