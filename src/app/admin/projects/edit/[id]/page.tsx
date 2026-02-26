"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/types";
import ProjectEditor from "@/components/admin/ProjectEditor";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      const supabase = createClient();
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setProject(data as Project);
      }
      setLoading(false);
    }

    fetchProject();
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/admin/projects" className="text-sm text-gray-400 hover:text-white transition-colors">
        &larr; Back to Projects
      </Link>
      <h1 className="text-2xl font-bold text-white mt-4 mb-8">Edit Project</h1>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : project ? (
        <ProjectEditor project={project} />
      ) : (
        <p className="text-red-400">Project not found</p>
      )}
    </div>
  );
}
