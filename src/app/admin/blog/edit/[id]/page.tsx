"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Post } from "@/types";
import BlogEditor from "@/components/admin/BlogEditor";

export default function EditBlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const supabase = createClient();

      const { data: postData } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (postData) {
        setPost(postData as Post);
      }

      setLoading(false);
    }

    fetchPost();
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/admin/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
        &larr; Back to Blog Posts
      </Link>
      <h1 className="text-2xl font-bold text-white mt-4 mb-8">Edit Blog Post</h1>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : post ? (
        <BlogEditor post={post} />
      ) : (
        <p className="text-red-400">Post not found</p>
      )}
    </div>
  );
}
