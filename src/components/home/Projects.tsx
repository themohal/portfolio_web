"use client";

import { useEffect, useState, useRef, MouseEvent as ReactMouseEvent } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface ProjectDisplay {
  id: string;
  title: string;
  description: string;
  tags: string[];
  live_url: string | null;
  github_url: string | null;
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  function handleMouseMove(e: ReactMouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  }

  function handleMouseLeave() {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlare({ x: 50, y: 50, opacity: 0 });
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
      }}
      className="relative"
    >
      {children}
      {/* Glare overlay */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
        }}
      />
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<ProjectDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("projects")
          .select("*")
          .order("display_order", { ascending: true });

        setProjects((data as ProjectDisplay[]) || []);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading || projects.length === 0) return null;

  return (
    <section id="projects" className="py-24 px-4 bg-white/[0.02] tech-grid-bg">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-blue-500 font-mono text-sm tracking-wider opacity-60">02.</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white neon-text">Projects</h2>
          </div>
          <div className="w-20 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-transparent mb-12 neon-glow rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              viewport={{ once: true }}
            >
              <TiltCard>
                <div className="holo-card group p-6 h-full flex flex-col rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all duration-500 backdrop-blur-sm hover:bg-white/[0.07]">
                  {/* Project header with tech indicator */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:animate-pulse" />
                      <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
                        {project.title}
                      </h3>
                    </div>
                    <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 flex-grow leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="tech-tag px-3 py-1 text-xs font-mono bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-2 border-t border-white/5">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5 group/link"
                      >
                        <span className="w-1 h-1 rounded-full bg-green-500" />
                        Live Demo
                        <span className="group-hover/link:translate-x-0.5 transition-transform">&rarr;</span>
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-gray-300 transition-colors flex items-center gap-1.5 group/link"
                      >
                        GitHub
                        <span className="group-hover/link:translate-x-0.5 transition-transform">&rarr;</span>
                      </a>
                    )}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
