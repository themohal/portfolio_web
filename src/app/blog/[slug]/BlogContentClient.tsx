"use client";

import { useEffect, useRef, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-white/5">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-6 z-40 p-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all backdrop-blur-sm cursor-pointer shadow-lg"
      aria-label="Back to top"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}

function TableOfContents({
  headings,
  contentRef,
}: {
  headings: Heading[];
  contentRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!contentRef.current) return;
    const els = contentRef.current.querySelectorAll("h1, h2, h3");
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0% 0% -70% 0%", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings, contentRef]);

  if (headings.length < 2) return null;

  function scrollToHeading(id: string) {
    if (!contentRef.current) return;
    const el = contentRef.current.querySelector(`#${CSS.escape(id)}`);
    if (el) {
      const top =
        el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveId(id);
    }
  }

  return (
    <aside className="hidden xl:block fixed top-32 left-[max(1rem,calc(50%-42rem))] w-52 text-sm">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
        On this page
      </p>
      <nav className="space-y-1.5">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToHeading(h.id);
            }}
            className={`block transition-colors leading-snug cursor-pointer ${
              h.level === 3 ? "pl-3" : ""
            } ${
              activeId === h.id
                ? "text-blue-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}

function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm text-gray-500">Share:</span>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Twitter
      </a>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        LinkedIn
      </a>
      <button
        onClick={copyLink}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
      >
        {copied ? (
          <>
            <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-400">Copied!</span>
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy link
          </>
        )}
      </button>
    </div>
  );
}

function extractHeadings(html: string): Heading[] {
  if (typeof window === "undefined") return [];
  const div = document.createElement("div");
  div.innerHTML = html;
  const els = div.querySelectorAll("h1, h2, h3");
  const headings: Heading[] = [];
  els.forEach((el) => {
    const text = el.textContent || "";
    const id = slugifyHeading(text);
    el.id = id;
    headings.push({ id, text, level: parseInt(el.tagName[1]) });
  });
  return headings;
}

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogContentClient({
  content,
  postTitle,
}: {
  content: Record<string, unknown>;
  postTitle: string;
}) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [readTime, setReadTime] = useState(0);
  const [postUrl, setPostUrl] = useState("");
  const [html, setHtml] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  // Generate HTML client-side only, then inject heading IDs
  useEffect(() => {
    const { generateHTML } = require("@tiptap/react");
    const StarterKit = require("@tiptap/starter-kit").default;
    const ImageExtension = require("@tiptap/extension-image").default;
    const LinkExtension = require("@tiptap/extension-link").default;

    let rendered = "";
    try {
      rendered = generateHTML(content as Parameters<typeof import("@tiptap/react").generateHTML>[0], [
        StarterKit,
        ImageExtension,
        LinkExtension.configure({ openOnClick: false }),
      ]);
    } catch {
      rendered = "<p>Unable to render content.</p>";
    }

    setHtml(rendered);
    setPostUrl(window.location.href);
    setReadTime(estimateReadTime(rendered));
    setHeadings(extractHeadings(rendered));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Inject IDs after content is rendered in the DOM
  useEffect(() => {
    if (!html || !contentRef.current) return;
    const els = contentRef.current.querySelectorAll("h1, h2, h3");
    els.forEach((el) => {
      const text = el.textContent || "";
      el.id = slugifyHeading(text);
      (el as HTMLElement).style.scrollMarginTop = "100px";
    });
  }, [html]);

  if (!html) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-1/4" />
        <div className="h-4 bg-white/5 rounded w-full" />
        <div className="h-4 bg-white/5 rounded w-full" />
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-4 bg-white/5 rounded w-full" />
        <div className="h-4 bg-white/5 rounded w-5/6" />
      </div>
    );
  }

  return (
    <>
      <ReadingProgressBar />
      <TableOfContents headings={headings} contentRef={contentRef} />

      {readTime > 0 && (
        <p className="text-xs text-gray-500 mb-8 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {readTime} min read
        </p>
      )}

      <div
        ref={contentRef}
        className="prose-blog"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Share section */}
      <div className="mt-12 pt-6 border-t border-white/10">
        <ShareButtons title={postTitle} url={postUrl} />
      </div>

      <BackToTopButton />
    </>
  );
}
