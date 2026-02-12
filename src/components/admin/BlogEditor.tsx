"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Post } from "@/types";
import { slugify } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface BlogEditorProps {
  post?: Post;
}

export default function BlogEditor({ post }: BlogEditorProps) {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [coverImage, setCoverImage] = useState(post?.cover_image || "");
  const [published, setPublished] = useState(post?.published || false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
    ],
    content: post?.content || { type: "doc", content: [{ type: "paragraph" }] },
    editorProps: {
      attributes: {
        class: "tiptap text-gray-300 px-4 py-3",
      },
    },
  });

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!post) {
      setSlug(slugify(value));
    }
  }

  const uploadImage = useCallback(
    async (file: File) => {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("blog-images")
        .upload(fileName, file);

      if (error) {
        alert("Failed to upload image: " + error.message);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    },
    [supabase]
  );

  async function handleImageUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      setUploadingImage(true);
      const url = await uploadImage(file);
      if (url && editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
      setUploadingImage(false);
    };
    input.click();
  }

  async function handleCoverImageUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const url = await uploadImage(file);
      if (url) setCoverImage(url);
    };
    input.click();
  }

  function handleAddLink() {
    const url = prompt("Enter URL:");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }

  async function handleSave() {
    if (!editor || !title || !slug) {
      alert("Title and slug are required");
      return;
    }

    setSaving(true);
    const content = editor.getJSON();

    if (post) {
      const { error } = await supabase
        .from("posts")
        .update({
          title,
          slug,
          content,
          excerpt: excerpt || null,
          cover_image: coverImage || null,
          published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id);

      if (error) {
        alert("Failed to update post");
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("posts")
        .insert({
          title,
          slug,
          content,
          excerpt: excerpt || null,
          cover_image: coverImage || null,
          published,
        })
        .select()
        .single();

      if (error) {
        alert("Failed to create post: " + error.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Input
        id="title"
        label="Title"
        placeholder="Post title"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
      />
      <Input
        id="slug"
        label="Slug"
        placeholder="post-slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />
      <Input
        id="excerpt"
        label="Excerpt"
        placeholder="Brief description..."
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Cover Image</label>
        <div className="flex items-center gap-3">
          <Input
            id="cover-image"
            placeholder="Cover image URL"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
          <Button variant="secondary" size="sm" onClick={handleCoverImageUpload}>
            Upload
          </Button>
        </div>
        {coverImage && (
          <div className="mt-2 relative w-full h-40 rounded-lg overflow-hidden bg-white/5">
            <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setCoverImage("")}
              className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-black/80"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Editor toolbar */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Content</label>
        <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
          <div className="flex flex-wrap gap-1 p-2 border-b border-white/10 bg-white/5">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`px-2 py-1 text-xs rounded cursor-pointer ${
                editor?.isActive("bold") ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/10"
              }`}
            >
              B
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`px-2 py-1 text-xs rounded italic cursor-pointer ${
                editor?.isActive("italic") ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/10"
              }`}
            >
              I
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-2 py-1 text-xs rounded cursor-pointer ${
                editor?.isActive("heading", { level: 2 }) ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/10"
              }`}
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`px-2 py-1 text-xs rounded cursor-pointer ${
                editor?.isActive("heading", { level: 3 }) ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/10"
              }`}
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`px-2 py-1 text-xs rounded cursor-pointer ${
                editor?.isActive("bulletList") ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/10"
              }`}
            >
              List
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`px-2 py-1 text-xs rounded cursor-pointer ${
                editor?.isActive("orderedList") ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/10"
              }`}
            >
              1. List
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={`px-2 py-1 text-xs rounded cursor-pointer ${
                editor?.isActive("blockquote") ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/10"
              }`}
            >
              Quote
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              className={`px-2 py-1 text-xs rounded cursor-pointer ${
                editor?.isActive("codeBlock") ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/10"
              }`}
            >
              Code
            </button>
            <button
              type="button"
              onClick={handleAddLink}
              className="px-2 py-1 text-xs rounded text-gray-400 hover:bg-white/10 cursor-pointer"
            >
              Link
            </button>
            <button
              type="button"
              onClick={handleImageUpload}
              disabled={uploadingImage}
              className="px-2 py-1 text-xs rounded text-gray-400 hover:bg-white/10 cursor-pointer disabled:opacity-50"
            >
              {uploadingImage ? "Uploading..." : "Image"}
            </button>
          </div>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Publish toggle & save */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm text-gray-300">Publish</span>
        </label>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => router.push("/admin/blog")}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : post ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </div>
    </div>
  );
}
