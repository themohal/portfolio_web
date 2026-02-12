"use client";

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";

const projects = [
  {
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard.",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    live: "#",
    github: "#",
  },
  {
    title: "AI Chat Application",
    description:
      "Real-time chat application powered by AI with natural language processing and smart reply suggestions.",
    tags: ["React", "Node.js", "WebSocket", "OpenAI"],
    live: "#",
    github: "#",
  },
  {
    title: "Task Management Tool",
    description:
      "Collaborative project management tool with drag-and-drop boards, real-time updates, and team features.",
    tags: ["Vue.js", "Firebase", "Tailwind", "PWA"],
    live: "#",
    github: "#",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Interactive data visualization dashboard with custom charts, filters, and export capabilities.",
    tags: ["React", "D3.js", "Python", "FastAPI"],
    live: "#",
    github: "#",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-4 bg-white/[0.02]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Projects</h2>
          <div className="w-20 h-1 bg-blue-600 mb-12 rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card hover className="p-6 h-full flex flex-col">
                <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4 flex-grow">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a
                    href={project.live}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Live Demo &rarr;
                  </a>
                  <a
                    href={project.github}
                    className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    GitHub &rarr;
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
