"use client";

import { motion } from "framer-motion";

export default function CircuitDivider() {
  return (
    <div className="relative py-4 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        <svg
          viewBox="0 0 1000 60"
          className="w-full h-12 md:h-16"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
        >
          {/* Main horizontal line */}
          <motion.line
            x1="0" y1="30" x2="1000" y2="30"
            stroke="rgba(59,130,246,0.08)"
            strokeWidth="1"
          />

          {/* Animated trace - left to right */}
          <motion.line
            x1="0" y1="30" x2="1000" y2="30"
            stroke="url(#circuit-gradient)"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            viewport={{ once: true }}
          />

          {/* Circuit nodes */}
          {[100, 250, 400, 500, 600, 750, 900].map((cx, i) => (
            <motion.g key={cx}>
              {/* Node dot */}
              <motion.circle
                cx={cx} cy={30} r={3}
                fill="#3b82f6"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.12 }}
                viewport={{ once: true }}
              />
              {/* Outer glow ring */}
              <motion.circle
                cx={cx} cy={30} r={6}
                fill="none"
                stroke="rgba(59,130,246,0.3)"
                strokeWidth="0.5"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.12 }}
                viewport={{ once: true }}
              />
            </motion.g>
          ))}

          {/* Branch paths */}
          {/* Branch 1 - up */}
          <motion.path
            d="M 250 30 L 250 15 L 320 15"
            stroke="rgba(139,92,246,0.2)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          />
          <motion.circle
            cx={320} cy={15} r={2}
            fill="#8b5cf6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            transition={{ delay: 1.2 }}
            viewport={{ once: true }}
          />

          {/* Branch 2 - down */}
          <motion.path
            d="M 600 30 L 600 45 L 680 45"
            stroke="rgba(6,182,212,0.2)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          />
          <motion.circle
            cx={680} cy={45} r={2}
            fill="#06b6d4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            transition={{ delay: 1.4 }}
            viewport={{ once: true }}
          />

          {/* Branch 3 - up */}
          <motion.path
            d="M 750 30 L 750 12 L 810 12 L 810 30"
            stroke="rgba(59,130,246,0.15)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            viewport={{ once: true }}
          />

          {/* Traveling pulse */}
          <motion.circle
            cx={0} cy={30} r={2}
            fill="#3b82f6"
            initial={{ cx: 0, opacity: 0 }}
            whileInView={{ cx: 1000, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, delay: 0.5, ease: "linear" }}
            viewport={{ once: true }}
          >
          </motion.circle>

          {/* Gradient definition */}
          <defs>
            <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(59,130,246,0)" />
              <stop offset="20%" stopColor="rgba(59,130,246,0.3)" />
              <stop offset="50%" stopColor="rgba(139,92,246,0.3)" />
              <stop offset="80%" stopColor="rgba(6,182,212,0.3)" />
              <stop offset="100%" stopColor="rgba(6,182,212,0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
