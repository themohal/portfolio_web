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
    <section id="skills" className="py-24 px-4 tech-grid-bg">
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-blue-500 font-mono text-sm tracking-wider opacity-60">03.</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white neon-text">Skills</h2>
          </div>
          <div className="w-20 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-transparent mb-12 neon-glow rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: catIndex * 0.15 }}
              viewport={{ once: true }}
              className="space-y-4 p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-500/20 transition-all duration-500"
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="text-blue-500/50 font-mono text-xs">&lt;</span>
                <h3 className="text-lg font-semibold text-blue-400 font-mono">{category.title}</h3>
                <span className="text-blue-500/50 font-mono text-xs">/&gt;</span>
              </div>
              {category.skills.map((skill, skillIndex) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-300">{skill.name}</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: catIndex * 0.15 + skillIndex * 0.1 + 0.5 }}
                      viewport={{ once: true }}
                      className="text-blue-400 font-mono text-xs"
                    >
                      {skill.level}%
                    </motion.span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.2, delay: catIndex * 0.15 + skillIndex * 0.1, ease: "easeOut" }}
                      viewport={{ once: true }}
                      className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-full skill-bar-glow relative"
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
