"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send message");
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="py-24 px-4 bg-white/[0.02] tech-grid-bg">
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-blue-500 font-mono text-sm tracking-wider opacity-60">04.</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white neon-text">Get in Touch</h2>
          </div>
          <div className="w-20 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-transparent mb-8 neon-glow rounded-full" />
          <p className="text-gray-400 mb-8 font-mono text-sm">
            <span className="text-blue-500/60">// </span>
            Have a project in mind or just want to chat? Feel free to reach out.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="space-y-5 p-6 rounded-xl border border-white/5 bg-white/[0.02] tech-border"
        >
          <Input
            id="name"
            label="Name"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1.5 font-mono">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Your message..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              className="tech-input w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="tech-btn w-full px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
          >
            {status === "loading" ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Transmitting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Message
              </>
            )}
          </button>

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-green-400 text-sm font-mono"
            >
              <span className="w-2 h-2 rounded-full bg-green-500" />
              MSG.TRANSMITTED_SUCCESSFULLY
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-400 text-sm font-mono"
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              ERR.TRANSMISSION_FAILED — RETRY
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
}
