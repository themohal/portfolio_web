"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
    <section id="about" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">About Me</h2>
          <div className="w-20 h-1 bg-blue-600 mb-8 rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-64 h-64 mx-auto md:mx-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center overflow-hidden">
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
              <p key={i} className="text-gray-300 leading-relaxed">
                {text}
              </p>
            ))}
            <div className="flex gap-4 pt-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
