"""
Auto Blog Post Generator
========================
Uses OpenAI GPT-4o to research latest technology news from internet according to 
the current date and generate 1 blog post and pushes everything to Supabase.

Topics: AI, IoT, Cloud, Blockchain, Cybersecurity, Quantum Computing, Quantum AI

Usage:
    pip install openai supabase python-dotenv requests
    python scripts/generate_blog_posts.py
"""

import os
import re
import json
import random
import time
import uuid
import requests
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI
from supabase import create_client, Client

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

TOPICS = [
    "Artificial Intelligence",
    "Internet of Things (IoT)",
    "Cloud Computing",
    "Blockchain",
    "Cybersecurity",
    "Quantum Computing",
    "Quantum AI",
    "Software Development Thoughts",
    "Software Development Tutorials",
    "Software Development Insights",
]

CURRENT_DATE= datetime.now().date()

# ---------------------------------------------------------------------------
# Load environment variables from .env.local
# ---------------------------------------------------------------------------

env_path = Path(__file__).resolve().parent.parent / ".env.local"
load_dotenv(dotenv_path=env_path)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not OPENAI_API_KEY:
    raise SystemExit("OPENAI_API_KEY is missing from .env.local")
if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise SystemExit("Supabase credentials are missing from .env.local")

openai_client = OpenAI(api_key=OPENAI_API_KEY)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def slugify(text: str) -> str:
    """Convert text to a URL-friendly slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


def text_to_tiptap_json(markdown_text: str) -> dict:
    """
    Convert structured text (from GPT) into Tiptap-compatible JSON.
    Handles headings (##, ###), bold (**text**), bullet lists (- item),
    ordered lists (1. item), blockquotes (> text), code blocks (```),
    and regular paragraphs.
    """
    lines = markdown_text.strip().split("\n")
    doc_content = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # --- Code block ---
        if line.strip().startswith("```"):
            code_lines = []
            lang = line.strip().lstrip("`").strip()
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            i += 1  # skip closing ```
            doc_content.append({
                "type": "codeBlock",
                "attrs": {"language": lang if lang else None},
                "content": [{"type": "text", "text": "\n".join(code_lines)}],
            })
            continue

        # --- Empty line ---
        if not line.strip():
            i += 1
            continue

        # --- Heading ---
        heading_match = re.match(r"^(#{2,3})\s+(.+)$", line)
        if heading_match:
            level = len(heading_match.group(1))
            doc_content.append({
                "type": "heading",
                "attrs": {"level": level},
                "content": parse_inline(heading_match.group(2)),
            })
            i += 1
            continue

        # --- Blockquote ---
        if line.strip().startswith("> "):
            quote_text = line.strip()[2:]
            doc_content.append({
                "type": "blockquote",
                "content": [{
                    "type": "paragraph",
                    "content": parse_inline(quote_text),
                }],
            })
            i += 1
            continue

        # --- Bullet list ---
        if re.match(r"^\s*[-*]\s+", line):
            items = []
            while i < len(lines) and re.match(r"^\s*[-*]\s+", lines[i]):
                item_text = re.sub(r"^\s*[-*]\s+", "", lines[i])
                items.append({
                    "type": "listItem",
                    "content": [{"type": "paragraph", "content": parse_inline(item_text)}],
                })
                i += 1
            doc_content.append({"type": "bulletList", "content": items})
            continue

        # --- Ordered list ---
        if re.match(r"^\s*\d+\.\s+", line):
            items = []
            while i < len(lines) and re.match(r"^\s*\d+\.\s+", lines[i]):
                item_text = re.sub(r"^\s*\d+\.\s+", "", lines[i])
                items.append({
                    "type": "listItem",
                    "content": [{"type": "paragraph", "content": parse_inline(item_text)}],
                })
                i += 1
            doc_content.append({"type": "orderedList", "attrs": {"start": 1}, "content": items})
            continue

        # --- Regular paragraph ---
        doc_content.append({
            "type": "paragraph",
            "content": parse_inline(line),
        })
        i += 1

    return {"type": "doc", "content": doc_content}


def parse_inline(text: str) -> list:
    """Parse inline markdown (links, bold, italic) into Tiptap marks."""
    result = []

    # First pass: split on markdown links [text](url)
    link_pattern = r"(\[[^\]]+\]\([^)]+\))"
    segments = re.split(link_pattern, text)

    for segment in segments:
        link_match = re.match(r"^\[([^\]]+)\]\(([^)]+)\)$", segment)
        if link_match:
            link_text = link_match.group(1)
            link_url = link_match.group(2)
            result.append({
                "type": "text",
                "text": link_text,
                "marks": [{"type": "link", "attrs": {"href": link_url, "target": "_blank"}}],
            })
        elif segment:
            # Second pass: handle bold and italic
            bold_parts = re.split(r"(\*\*[^*]+\*\*)", segment)
            for part in bold_parts:
                if part.startswith("**") and part.endswith("**"):
                    result.append({"type": "text", "text": part[2:-2], "marks": [{"type": "bold"}]})
                elif part:
                    italic_parts = re.split(r"(\*[^*]+\*)", part)
                    for ip in italic_parts:
                        if ip.startswith("*") and ip.endswith("*") and len(ip) > 2:
                            result.append({"type": "text", "text": ip[1:-1], "marks": [{"type": "italic"}]})
                        elif ip:
                            result.append({"type": "text", "text": ip})

    return result if result else [{"type": "text", "text": text}]


# ---------------------------------------------------------------------------
# OpenAI: Generate blog post content
# ---------------------------------------------------------------------------

def research_latest_news(topic: str) -> str:
    """Use GPT-4o with web search to find the latest news about a topic."""
    today = datetime.now().strftime("%B %d, %Y")
    print(f"  [Research] Searching latest news about {topic} (as of {today})...")

    is_dev_topic = "Software Development" in topic
    if is_dev_topic:
        search_input = (
            f"Search the internet for the latest {topic.replace('Software Development ', '').lower()} "
            f"about software development as of {today} ({CURRENT_DATE}). "
            f"Find 5-8 recent blog posts, articles, or discussions about modern software development "
            f"practices, new frameworks, developer tools, best practices, coding patterns, "
            f"architecture decisions, and developer experience improvements. "
            f"For each item include: the headline, source, date, and a brief summary. "
            f"Focus on practical, actionable content that developers can learn from."
        )
    else:
        search_input = (
            f"Search the internet for the latest news, breakthroughs, and developments "
            f"in {topic} as of {today} ({CURRENT_DATE}). "
            f"Find 5-8 specific recent news stories, announcements, product launches, "
            f"research papers, or industry developments from the past few weeks/months. "
            f"For each item include: the headline, source, date, and a brief summary. "
            f"Focus on the most impactful and newsworthy developments."
        )

    response = openai_client.responses.create(
        model="gpt-4o",
        tools=[{"type": "web_search_preview"}],
        input=search_input,
    )

    news_summary = response.output_text
    print(f"  [Research] Found latest news ({len(news_summary)} chars)")
    return news_summary


def generate_blog_post(topic: str, existing_titles: list[str] | None = None) -> dict:
    """Research latest news via web search, then write a blog post based on real findings."""
    # Step 1: Research real current news
    news = research_latest_news(topic)

    # Step 2: Write blog post based on the researched news
    today = datetime.now().strftime("%B %d, %Y")
    print(f"  [GPT] Writing blog post based on researched news...")

    # Build a list of existing titles so GPT avoids similar content
    avoid_section = ""
    if existing_titles:
        titles_list = "\n".join(f"- {t}" for t in existing_titles)
        avoid_section = (
            f"\n\nIMPORTANT - The following blog posts ALREADY EXIST on the blog. "
            f"You MUST write about DIFFERENT aspects, angles, or news items. "
            f"Do NOT repeat similar titles, topics, or content:\n{titles_list}\n"
        )

    system_prompt = (
        "You are a senior technology writer for a professional developer portfolio blog. "
        "Write engaging, informative, and well-structured blog posts based on REAL recent news provided to you. "
        "Use markdown formatting: ## for main sections, ### for subsections, **bold** for emphasis, "
        "bullet lists with - , and > for key quotes/insights. "
        "Reference specific companies, products, dates, and statistics from the news. "
        "Write in a professional yet approachable tone. "
        "Every post you write must have a UNIQUE angle — never rehash the same story twice."
    )

    user_prompt = (
        f"Today's date is {today}. Based on the following REAL latest news and developments "
        f"about **{topic}**, write a comprehensive blog post.\n\n"
        f"--- RESEARCHED NEWS ---\n{news}\n--- END NEWS ---\n\n"
        f"{avoid_section}"
        f"Requirements:\n"
        f"- Title MUST be unique and different from any existing posts listed above\n"
        f"- Title should be catchy, SEO-friendly, and reference {CURRENT_DATE}\n"
        f"- Start directly with an engaging introduction (no title in the body)\n"
        f"- Include 4-5 main sections with ## headings based on the actual news\n"
        f"- Reference specific companies, dates, statistics, and announcements from the news\n"
        f"- Each section should have 2-3 paragraphs\n"
        f"- End with a 'What This Means' or 'Looking Ahead' section\n"
        f"- Total length: 800-1200 words\n\n"
        f"Return your response as JSON with exactly these keys:\n"
        f'{{"title": "...", "excerpt": "...(max 160 chars)...", "body": "...(markdown content)..."}}'
    )

    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
        max_tokens=4000,
    )

    result = json.loads(response.choices[0].message.content)
    return {
        "title": result["title"],
        "excerpt": result["excerpt"][:160],
        "body": result["body"],
    }


# ---------------------------------------------------------------------------
# Image search: Fetch a relevant image from the internet (free)
# ---------------------------------------------------------------------------

# Map topics to good search keywords for finding tech images
TOPIC_SEARCH_TERMS = {
    "Artificial Intelligence": "artificial intelligence technology",
    "Internet of Things (IoT)": "IoT smart devices technology",
    "Cloud Computing": "cloud computing servers",
    "Blockchain": "blockchain digital technology",
    "Cybersecurity": "cybersecurity digital protection",
    "Quantum Computing": "quantum computing technology",
    "Quantum AI": "quantum computer artificial intelligence",
    "Software Development Thoughts": "software developer coding laptop",
    "Software Development Tutorials": "programming code tutorial",
    "Software Development Insights": "software engineering team",
}


def fetch_cover_image_url(topic: str, used_image_urls: set[str]) -> str | None:
    """Search Pexels for a unique image not already used by existing posts."""
    print(f"  [Image] Searching for unique image: {topic}...")

    pexels_key = os.getenv("PEXELS_API_KEY", "")

    if pexels_key:
        try:
            query = TOPIC_SEARCH_TERMS.get(topic, topic)
            # Randomize the page to get different results each run
            page = random.randint(1, 10)
            resp = requests.get(
                "https://api.pexels.com/v1/search",
                headers={"Authorization": pexels_key},
                params={"query": query, "per_page": 40, "orientation": "landscape", "page": page},
                timeout=15,
            )
            if resp.status_code == 200:
                photos = resp.json().get("photos", [])
                # Filter out already-used images
                unused = [p for p in photos if p["src"]["landscape"] not in used_image_urls]
                if not unused:
                    unused = photos  # fallback if all filtered out
                if unused:
                    photo = random.choice(unused)
                    image_url = photo["src"]["landscape"]
                    print(f"  [Image] Found on Pexels (page {page}): {photo['photographer']} -> {image_url}")
                    return image_url
        except Exception as e:
            print(f"  [WARN] Pexels search failed: {e}")

    print("  [WARN] No image found. Set PEXELS_API_KEY in .env.local")
    return None


def insert_post(title: str, slug: str, content: dict, excerpt: str, cover_image: str | None) -> bool:
    """Insert a blog post into the Supabase posts table."""
    print(f"  [Supabase] Inserting post: {slug}...")

    now = datetime.now(timezone.utc).isoformat()
    data = {
        "title": title,
        "slug": slug,
        "content": content,
        "excerpt": excerpt,
        "cover_image": cover_image,
        "published": True,
        "created_at": now,
        "updated_at": now,
    }

    try:
        result = supabase.table("posts").insert(data).execute()
        if result.data:
            print(f"  [OK] Post created: {title}")
            return True
        else:
            print(f"  [ERROR] Failed to insert post: {title}")
            return False
    except Exception as e:
        print(f"  [ERROR] Insert failed: {e}")
        return False


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    # Pick one random topic
    topic = random.choice(TOPICS)

    print("=" * 60)
    print(f"  Blog Post Generator - {CURRENT_DATE} Tech Trends")
    print("=" * 60)
    print(f"  Selected topic: {topic}")
    print(f"  Supabase: {SUPABASE_URL}")
    print("=" * 60)

    # Fetch only recent posts (last 20) to check for duplicates without growing cost
    existing = (
        supabase.table("posts")
        .select("slug, title, cover_image")
        .order("created_at", desc=True)
        .limit(20)
        .execute()
    )
    existing_slugs = {row["slug"] for row in (existing.data or [])}
    recent_titles = [row["title"] for row in (existing.data or [])]
    used_image_urls = {row["cover_image"] for row in (existing.data or []) if row.get("cover_image")}

    # Generate blog post content (GPT sees only last 20 titles to stay cost-efficient)
    post = generate_blog_post(topic, recent_titles)
    slug = slugify(post["title"])

    # If slug collision, append a short random suffix
    if slug in existing_slugs:
        slug = f"{slug}-{uuid.uuid4().hex[:6]}"
        print(f"  [INFO] Slug adjusted to avoid duplicate: {slug}")

    # Convert markdown body to Tiptap JSON
    tiptap_content = text_to_tiptap_json(post["body"])

    # Fetch a unique cover image URL from Pexels
    cover_url = fetch_cover_image_url(topic, used_image_urls)

    # Insert into Supabase
    success = insert_post(
        title=post["title"],
        slug=slug,
        content=tiptap_content,
        excerpt=post["excerpt"],
        cover_image=cover_url,
    )

    print("\n" + "=" * 60)
    if success:
        print(f"  Done! Post published: {post['title']}")
    else:
        print("  Failed to create post.")
    print("=" * 60)


if __name__ == "__main__":
    main()
