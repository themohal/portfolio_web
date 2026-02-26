"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Post } from "@/types";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export default function AdminBlogDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    setPosts((data as Post[]) || []);
    setLoading(false);
  }

  async function deletePost(id: string) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    await supabase.from("posts").delete().eq("id", id);
    setPosts(posts.filter((p) => p.id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Blog Posts</h2>
        <Link href="/admin/blog/new">
          <Button>New Post</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts yet. Create your first one!</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg"
            >
              <div>
                <h3 className="text-white font-medium">{post.title}</h3>
                <p className="text-sm text-gray-400">
                  {formatDate(post.created_at)} &middot;{" "}
                  <span className={post.published ? "text-green-400" : "text-yellow-400"}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/blog/edit/${post.id}`}>
                  <Button variant="secondary" size="sm">Edit</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
