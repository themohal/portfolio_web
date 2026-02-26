"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Skill } from "@/types";
import SkillEditor from "@/components/admin/SkillEditor";

export default function EditSkillPage() {
  const { id } = useParams<{ id: string }>();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkill() {
      const supabase = createClient();
      const { data } = await supabase
        .from("skills")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setSkill(data as Skill);
      }
      setLoading(false);
    }

    fetchSkill();
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/admin/skills" className="text-sm text-gray-400 hover:text-white transition-colors">
        &larr; Back to Skills
      </Link>
      <h1 className="text-2xl font-bold text-white mt-4 mb-8">Edit Skill</h1>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : skill ? (
        <SkillEditor skill={skill} />
      ) : (
        <p className="text-red-400">Skill not found</p>
      )}
    </div>
  );
}
