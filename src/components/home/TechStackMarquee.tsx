"use client";

import { motion } from "framer-motion";

const techStack = [
  { name: "React", icon: "⚛️" },
  { name: "Next.js", icon: "▲" },
  { name: "TypeScript", icon: "TS" },
  { name: "Node.js", icon: "⬢" },
  { name: "Tailwind CSS", icon: "🎨" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Supabase", icon: "⚡" },
  { name: "Three.js", icon: "🔺" },
  { name: "Python", icon: "🐍" },
  { name: "Docker", icon: "🐳" },
  { name: "Git", icon: "📦" },
  { name: "Figma", icon: "🎯" },
  { name: "GraphQL", icon: "◈" },
  { name: "Redis", icon: "🔴" },
  { name: "AWS", icon: "☁️" },
  { name: "MongoDB", icon: "🍃" },
];

// Duplicate for seamless loop
const doubledStack = [...techStack, ...techStack];

export default function TechStackMarquee() {
  return (
    <section className="py-16 overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-gray-600">
          Tech Stack
        </span>
      </motion.div>

      {/* Row 1 - scrolls left */}
      <div className="flex mb-4">
        <motion.div
          className="flex gap-4 shrink-0"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {doubledStack.map((tech, i) => (
            <div
              key={`row1-${i}`}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg border border-white/5 bg-white/[0.02] hover:border-blue-500/30 hover:bg-white/[0.05] transition-all duration-300 shrink-0 group"
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-300">{tech.icon}</span>
              <span className="text-sm text-gray-400 group-hover:text-blue-300 transition-colors duration-300 font-mono whitespace-nowrap">
                {tech.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Row 2 - scrolls right */}
      <div className="flex">
        <motion.div
          className="flex gap-4 shrink-0"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          {[...doubledStack].reverse().map((tech, i) => (
            <div
              key={`row2-${i}`}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg border border-white/5 bg-white/[0.02] hover:border-purple-500/30 hover:bg-white/[0.05] transition-all duration-300 shrink-0 group"
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-300">{tech.icon}</span>
              <span className="text-sm text-gray-400 group-hover:text-purple-300 transition-colors duration-300 font-mono whitespace-nowrap">
                {tech.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
