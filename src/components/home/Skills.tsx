"use client";

import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "Frontend",
    skills: [
      { name: "React / Next.js", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Tailwind CSS", level: 92 },
      { name: "Three.js", level: 75 },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", level: 88 },
      { name: "Python", level: 82 },
      { name: "PostgreSQL", level: 85 },
      { name: "REST / GraphQL", level: 87 },
    ],
  },
  {
    title: "Tools & DevOps",
    skills: [
      { name: "Git / GitHub", level: 93 },
      { name: "Docker", level: 78 },
      { name: "CI/CD", level: 80 },
      { name: "AWS / Vercel", level: 82 },
    ],
  },
];

export default function Skills() {
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
