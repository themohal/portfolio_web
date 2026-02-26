"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const defaultLinks = {
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
};

export default function Footer() {
  const [links, setLinks] = useState(defaultLinks);

  useEffect(() => {
    async function fetchLinks() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("site_settings")
          .select("key, value")
          .in("key", ["social_github", "social_linkedin", "social_twitter"]);

        if (data) {
          const updated = { ...defaultLinks };
          for (const setting of data) {
            if (setting.key === "social_github" && typeof setting.value === "string") {
              updated.github = setting.value;
            }
            if (setting.key === "social_linkedin" && typeof setting.value === "string") {
              updated.linkedin = setting.value;
            }
            if (setting.key === "social_twitter" && typeof setting.value === "string") {
              updated.twitter = setting.value;
            }
          }
          setLinks(updated);
        }
      } catch {
        // Keep defaults
      }
    }

    fetchLinks();
  }, []);

  return (
    <footer className="border-t border-white/10 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Twitter
            </a>
            <Link
              href="/admin/login"
              className="text-gray-600 hover:text-gray-400 transition-colors text-xs"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
