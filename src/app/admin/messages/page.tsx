"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ContactMessage } from "@/types";
import { formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";

type FilterTab = "all" | "unread" | "read";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    setMessages((data as ContactMessage[]) || []);
    setLoading(false);
  }

  async function toggleRead(msg: ContactMessage) {
    const newStatus = !msg.is_read;
    await supabase.from("messages").update({ is_read: newStatus }).eq("id", msg.id);
    setMessages(messages.map((m) => (m.id === msg.id ? { ...m, is_read: newStatus } : m)));
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message?")) return;
    await supabase.from("messages").delete().eq("id", id);
    setMessages(messages.filter((m) => m.id !== id));
  }

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.is_read;
    if (filter === "read") return m.is_read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: `All (${messages.length})` },
    { key: "unread", label: `Unread (${unreadCount})` },
    { key: "read", label: `Read (${messages.length - unreadCount})` },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-white mb-8">Messages</h2>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 bg-white/5 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
              filter === tab.key
                ? "bg-blue-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">
          {filter === "all" ? "No messages yet." : `No ${filter} messages.`}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white/5 border rounded-lg overflow-hidden transition-all ${
                !msg.is_read
                  ? "border-l-4 border-l-blue-500 border-t-white/10 border-r-white/10 border-b-white/10"
                  : "border-white/10"
              }`}
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium truncate ${!msg.is_read ? "text-white" : "text-gray-300"}`}>
                        {msg.name}
                      </h3>
                      {!msg.is_read && (
                        <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{msg.email}</p>
                    {expandedId !== msg.id && (
                      <p className="text-sm text-gray-400 mt-1 truncate">{msg.message}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-500">{formatDate(msg.created_at)}</span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        expandedId === msg.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {expandedId === msg.id && (
                <div className="px-4 pb-4 border-t border-white/5">
                  <p className="text-gray-300 text-sm whitespace-pre-wrap mt-3">{msg.message}</p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); toggleRead(msg); }}
                    >
                      Mark as {msg.is_read ? "Unread" : "Read"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}
                    >
                      Delete
                    </Button>
                    <a
                      href={`mailto:${msg.email}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Reply
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
