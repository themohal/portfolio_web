"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Skill } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface SkillEditorProps {
  skill?: Skill;
}

export default function SkillEditor({ skill }: SkillEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = !!skill;

  const [category, setCategory] = useState(skill?.category || "");
  const [name, setName] = useState(skill?.name || "");
  const [proficiency, setProficiency] = useState(skill?.proficiency || 80);
  const [displayOrder, setDisplayOrder] = useState(skill?.display_order || 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [existingCategories, setExistingCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from("skills").select("category");
      if (data) {
        const unique = [...new Set(data.map((d: { category: string }) => d.category))];
        setExistingCategories(unique);
      }
    }
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!category.trim() || !name.trim()) {
      setError("Category and name are required");
      return;
    }

    setSaving(true);
    setError("");

    const skillData = {
      category: category.trim(),
      name: name.trim(),
      proficiency,
      display_order: displayOrder,
    };

    if (isEditing) {
      const { error: updateError } = await supabase
        .from("skills")
        .update(skillData)
        .eq("id", skill.id);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("skills")
        .insert(skillData);

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/skills");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Frontend, Backend, Tools & DevOps"
          list="category-suggestions"
          required
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <datalist id="category-suggestions">
          {existingCategories.map((cat) => (
            <option key={cat} value={cat} />
          ))}
        </datalist>
      </div>

      <Input
        id="name"
        label="Skill Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. React / Next.js"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Proficiency: {proficiency}%
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={proficiency}
          onChange={(e) => setProficiency(parseInt(e.target.value))}
          className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      <Input
        id="displayOrder"
        label="Display Order"
        type="number"
        value={displayOrder.toString()}
        onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
      />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEditing ? "Update Skill" : "Create Skill"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/admin/skills")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
