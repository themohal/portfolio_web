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
    <section id="contact" className="py-24 px-4 bg-white/[0.02]">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Get in Touch</h2>
          <div className="w-20 h-1 bg-blue-600 mb-8 rounded-full" />
          <p className="text-gray-400 mb-8">
            Have a project in mind or just want to chat? Feel free to reach out.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="space-y-5"
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
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1.5">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Your message..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>
          <Button type="submit" size="lg" disabled={status === "loading"}>
            {status === "loading" ? "Sending..." : "Send Message"}
          </Button>

          {status === "success" && (
            <p className="text-green-400 text-sm">Message sent successfully!</p>
          )}
          {status === "error" && (
            <p className="text-red-400 text-sm">Failed to send message. Please try again.</p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
