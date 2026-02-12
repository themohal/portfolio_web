"use client";

import { motion } from "framer-motion";

export default function About() {
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
            <div className="w-64 h-64 mx-auto md:mx-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
              <span className="text-6xl">👨‍💻</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="text-gray-300 leading-relaxed">
              I&apos;m a passionate full-stack developer with a love for building beautiful,
              performant web applications. With expertise spanning modern frontend frameworks
              and robust backend systems, I bring ideas to life through clean code and
              thoughtful design.
            </p>
            <p className="text-gray-300 leading-relaxed">
              When I&apos;m not coding, you can find me exploring new technologies,
              contributing to open source, or writing about software development on my blog.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">3+</p>
                <p className="text-sm text-gray-400">Years Exp.</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">20+</p>
                <p className="text-sm text-gray-400">Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">10+</p>
                <p className="text-sm text-gray-400">Technologies</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
