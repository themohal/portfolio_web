"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Post, ContactMessage } from "@/types";
import { timeAgo } from "@/lib/utils";

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  totalProjects: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    totalProjects: 0,
    unreadMessages: 0,
  });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      const supabase = createClient();

      const [postsRes, projectsRes, messagesRes] = await Promise.all([
        supabase.from("posts").select("*").order("created_at", { ascending: false }),
        supabase.from("projects").select("id"),
        supabase.from("messages").select("*").order("created_at", { ascending: false }),
      ]);

      const posts = (postsRes.data as Post[]) || [];
      const messages = (messagesRes.data as ContactMessage[]) || [];

      setStats({
        totalPosts: posts.length,
        publishedPosts: posts.filter((p) => p.published).length,
        totalProjects: projectsRes.data?.length || 0,
        unreadMessages: messages.filter((m) => !m.is_read).length,
      });

      setRecentPosts(posts.slice(0, 5));
      setRecentMessages(messages.slice(0, 5));
      setLoading(false);
    }

    fetchDashboard();
  }, []);

  const statCards = [
    {
      label: "Total Posts",
      value: stats.totalPosts,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      color: "text-blue-400 bg-blue-500/10",
    },
    {
      label: "Published",
      value: stats.publishedPosts,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-green-400 bg-green-500/10",
    },
    {
      label: "Projects",
      value: stats.totalProjects,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      color: "text-purple-400 bg-purple-500/10",
    },
    {
      label: "Unread Messages",
      value: stats.unreadMessages,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: "text-amber-400 bg-amber-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-white mb-8">Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="p-4 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm"
          >
            <div className={`inline-flex p-2 rounded-lg mb-3 ${card.color}`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-sm text-gray-400">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Posts</h3>
            <Link href="/admin/blog" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              View all
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <p className="text-gray-500 text-sm">No posts yet.</p>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{post.title}</p>
                    <p className="text-xs text-gray-500">{timeAgo(post.created_at)}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                      post.published
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Messages</h3>
            <Link href="/admin/messages" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              View all
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-gray-500 text-sm">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  {!msg.is_read && (
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white font-medium truncate">{msg.name}</p>
                      <span className="text-xs text-gray-500 flex-shrink-0">{timeAgo(msg.created_at)}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
