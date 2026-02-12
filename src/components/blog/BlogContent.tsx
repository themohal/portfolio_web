"use client";

import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import { useMemo } from "react";

interface BlogContentProps {
  content: Record<string, unknown>;
}

export default function BlogContent({ content }: BlogContentProps) {
  const html = useMemo(() => {
    try {
      return generateHTML(content as Parameters<typeof generateHTML>[0], [
        StarterKit,
        ImageExtension,
        LinkExtension.configure({ openOnClick: false }),
      ]);
    } catch {
      return "<p>Unable to render content.</p>";
    }
  }, [content]);

  return (
    <div
      className="prose-blog"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
