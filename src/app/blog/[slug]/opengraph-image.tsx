import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 86400;

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  const title = post?.title || "Blog Post";
  const excerpt = post?.excerpt || "Read this article on my portfolio blog.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "64px",
          background: "linear-gradient(135deg, #030712 0%, #0f172a 50%, #1e1b4b 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(79,70,229,0.3) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Top label */}
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 64,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ width: 32, height: 3, background: "#4f46e5", borderRadius: 2 }} />
          <span style={{ color: "#818cf8", fontSize: 18, fontWeight: 600, letterSpacing: "0.1em" }}>
            PORTFOLIO · BLOG
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: title.length > 60 ? 52 : 64,
            fontWeight: 800,
            color: "#f9fafb",
            lineHeight: 1.15,
            margin: "0 0 24px 0",
            maxWidth: 900,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>

        {/* Excerpt */}
        {excerpt && (
          <p
            style={{
              fontSize: 24,
              color: "#9ca3af",
              lineHeight: 1.5,
              margin: "0 0 48px 0",
              maxWidth: 800,
            }}
          >
            {excerpt.length > 120 ? excerpt.slice(0, 120) + "…" : excerpt}
          </p>
        )}

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            paddingTop: 32,
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            👨‍💻
          </div>
          <span style={{ color: "#e5e7eb", fontSize: 20, fontWeight: 600 }}>
            Muhammad Farjad Ali Raza
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
