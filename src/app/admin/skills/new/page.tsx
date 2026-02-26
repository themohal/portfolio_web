"use client";

import Link from "next/link";
import SkillEditor from "@/components/admin/SkillEditor";

export default function NewSkillPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/admin/skills" className="text-sm text-gray-400 hover:text-white transition-colors">
        &larr; Back to Skills
      </Link>
      <h1 className="text-2xl font-bold text-white mt-4 mb-8">New Skill</h1>
      <SkillEditor />
    </div>
  );
}
