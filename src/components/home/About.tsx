"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const defaultParagraphs = [
  "I'm a passionate full-stack developer with a love for building beautiful, performant web applications. With expertise spanning modern frontend frameworks and robust backend systems, I bring ideas to life through clean code and thoughtful design.",
  "When I'm not coding, you can find me exploring new technologies, contributing to open source, or writing about software development on my blog.",
];

const defaultStats = [
  { label: "Years Exp.", value: "3+" },
  { label: "Projects", value: "20+" },
  { label: "Technologies", value: "10+" },
];

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    const numericMatch = value.match(/^(\d+)/);
    if (!numericMatch) {
      setDisplay(value);
      return;
    }

    const target = parseInt(numericMatch[1]);
    const suffix = value.slice(numericMatch[1].length);
    const duration = 1500;
    const steps = 30;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setDisplay(Math.floor(current) + suffix);
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{display}</span>;
}

export default function About() {
  const [paragraphs, setParagraphs] = useState(defaultParagraphs);
  const [stats, setStats] = useState(defaultStats);
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("site_settings")
          .select("key, value")
          .in("key", ["about_text", "about_stats", "about_photo"]);

        if (data) {
          for (const setting of data) {
            if (setting.key === "about_text" && Array.isArray(setting.value)) {
              setParagraphs(setting.value);
            }
            if (setting.key === "about_stats" && Array.isArray(setting.value)) {
              setStats(setting.value);
            }
            if (setting.key === "about_photo" && typeof setting.value === "string" && setting.value) {
              setPhoto(setting.value);
            }
          }
        }
      } catch {
        // Keep defaults
      }
    }

    fetchSettings();
  }, []);

  return (
    <section id="about" className="py-24 px-4 tech-grid-bg">
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-blue-500 font-mono text-sm tracking-wider opacity-60">01.</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white neon-text">About Me</h2>
          </div>
          <div className="w-20 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-transparent mb-8 neon-glow rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="tech-photo-frame w-64 h-64 mx-auto md:mx-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center overflow-hidden tech-border">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl">&#x1F468;&#x200D;&#x1F4BB;</span>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {paragraphs.map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
                viewport={{ once: true }}
                className="text-gray-300 leading-relaxed"
              >
                {text}
              </motion.p>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex gap-6 pt-6"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center px-4 py-3 rounded-lg bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all duration-300"
                >
                  <p className="text-2xl font-bold stat-value">
                    <AnimatedCounter value={stat.value} />
                  </p>
                  <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
