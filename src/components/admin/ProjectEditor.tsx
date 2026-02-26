"use client";

import { useState, FormEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface ProjectEditorProps {
  project?: Project;
}

export default function ProjectEditor({ project }: ProjectEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = !!project;

  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.description || "");
  const [tags, setTags] = useState<string[]>(project?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [liveUrl, setLiveUrl] = useState(project?.live_url || "");
  const [githubUrl, setGithubUrl] = useState(project?.github_url || "");
  const [coverImage, setCoverImage] = useState(project?.cover_image || "");
  const [displayOrder, setDisplayOrder] = useState(project?.display_order || 0);
  const [featured, setFeatured] = useState(project?.featured || false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,/g, "");
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(fileName, file);

    if (uploadError) {
      setError("Failed to upload image: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName);

    setCoverImage(urlData.publicUrl);
    setUploading(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError("");

    const projectData = {
      title: title.trim(),
      description: description.trim(),
      tags,
      live_url: liveUrl.trim() || null,
      github_url: githubUrl.trim() || null,
      cover_image: coverImage || null,
      display_order: displayOrder,
      featured,
      updated_at: new Date().toISOString(),
    };

    if (isEditing) {
      const { error: updateError } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", project.id);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("projects")
        .insert(projectData);

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/projects");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        id="title"
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Project title"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the project..."
          rows={4}
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
        />
      </div>

      {/* Tags input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Tags</label>
        <div className="flex flex-wrap gap-2 p-2.5 bg-white/5 border border-white/10 rounded-lg min-h-[42px]">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full border border-blue-500/20"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-400 transition-colors cursor-pointer"
              >
                &times;
              </button>
            </span>
          ))}
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={tags.length === 0 ? "Type and press Enter to add tags..." : ""}
            className="flex-1 min-w-[120px] bg-transparent text-white placeholder-gray-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="liveUrl"
          label="Live URL"
          value={liveUrl}
          onChange={(e) => setLiveUrl(e.target.value)}
          placeholder="https://example.com"
        />
        <Input
          id="githubUrl"
          label="GitHub URL"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/..."
        />
      </div>

      {/* Cover Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Cover Image</label>
        {coverImage && (
          <div className="mb-2 relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt="Cover" className="h-32 rounded-lg object-cover" />
            <button
              type="button"
              onClick={() => setCoverImage("")}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors cursor-pointer"
            >
              &times;
            </button>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="block text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer cursor-pointer"
        />
        {uploading && <p className="text-sm text-gray-400 mt-1">Uploading...</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="displayOrder"
          label="Display Order"
          type="number"
          value={displayOrder.toString()}
          onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
        />
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Featured</label>
          <button
            type="button"
            onClick={() => setFeatured(!featured)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              featured ? "bg-blue-600" : "bg-white/10"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                featured ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/admin/projects")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
