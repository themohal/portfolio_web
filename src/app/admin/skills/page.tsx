"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Skill } from "@/types";
import Button from "@/components/ui/Button";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchSkills() {
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("display_order", { ascending: true });

    setSkills((data as Skill[]) || []);
    setLoading(false);
  }

  async function deleteSkill(id: string) {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    await supabase.from("skills").delete().eq("id", id);
    setSkills(skills.filter((s) => s.id !== id));
  }

  // Group skills by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Skills</h2>
        <Link href="/admin/skills/new">
          <Button>New Skill</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : skills.length === 0 ? (
        <p className="text-gray-500">No skills yet. Add your first one!</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, categorySkills]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-blue-400 mb-3">{category}</h3>
              <div className="space-y-2">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">{skill.name}</span>
                        <span className="text-xs text-gray-500">{skill.proficiency}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-2 max-w-xs">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <Link href={`/admin/skills/edit/${skill.id}`}>
                        <Button variant="secondary" size="sm">Edit</Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => deleteSkill(skill.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
