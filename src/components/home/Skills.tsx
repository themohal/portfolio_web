"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface SkillCategory {
  title: string;
  skills: { name: string; level: number }[];
}

export default function Skills() {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("skills")
          .select("*")
          .order("display_order", { ascending: true });

        if (data && data.length > 0) {
          const grouped: Record<string, { name: string; level: number }[]> = {};
          for (const skill of data) {
            if (!grouped[skill.category]) grouped[skill.category] = [];
            grouped[skill.category].push({ name: skill.name, level: skill.proficiency });
          }
          setSkillCategories(
            Object.entries(grouped).map(([title, skills]) => ({ title, skills }))
          );
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, []);

  if (loading || skillCategories.length === 0) return null;

  return (
    <section id="skills" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Skills</h2>
          <div className="w-20 h-1 bg-blue-600 mb-12 rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: catIndex * 0.15 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-blue-400 mb-4">{category.title}</h3>
              {category.skills.map((skill, skillIndex) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{skill.name}</span>
                    <span className="text-gray-500">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: catIndex * 0.15 + skillIndex * 0.1 }}
                      viewport={{ once: true }}
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
