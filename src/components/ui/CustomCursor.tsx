"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Only show custom cursor on desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    function handleMouseMove(e: MouseEvent) {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    }

    function handleMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("input") ||
        target.closest("textarea");
      setIsHovering(!!isInteractive);
    }

    function handleMouseDown() {
      setIsClicking(true);
    }

    function handleMouseUp() {
      setIsClicking(false);
    }

    function handleMouseLeave() {
      setIsVisible(false);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Hide default cursor
    document.body.style.cursor = "none";
    const style = document.createElement("style");
    style.id = "custom-cursor-style";
    style.textContent = "a, button, input, textarea, [role='button'] { cursor: none !important; }";
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.body.style.cursor = "";
      const el = document.getElementById("custom-cursor-style");
      if (el) el.remove();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        animate={{
          x: position.x - 20,
          y: position.y - 20,
          scale: isHovering ? 1.5 : isClicking ? 0.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
      >
        <div
          className={`w-10 h-10 rounded-full border transition-all duration-200 ${
            isHovering
              ? "border-blue-400/60 bg-blue-500/10"
              : "border-blue-500/30"
          }`}
          style={{
            boxShadow: isHovering
              ? "0 0 15px rgba(59, 130, 246, 0.3), inset 0 0 15px rgba(59, 130, 246, 0.1)"
              : "0 0 8px rgba(59, 130, 246, 0.15)",
          }}
        />
      </motion.div>

      {/* Center dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10001]"
        animate={{
          x: position.x - 3,
          y: position.y - 3,
          scale: isClicking ? 2 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
            isHovering ? "bg-blue-400" : "bg-blue-500"
          }`}
          style={{
            boxShadow: "0 0 6px rgba(59, 130, 246, 0.8)",
          }}
        />
      </motion.div>

      {/* Crosshair lines (subtle) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        animate={{
          x: position.x,
          y: position.y,
          opacity: isHovering ? 0 : 0.15,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="absolute -top-4 left-0 w-px h-2.5 bg-blue-500 -translate-x-1/2" />
        <div className="absolute top-1.5 left-0 w-px h-2.5 bg-blue-500 -translate-x-1/2" />
        <div className="absolute top-0 -left-4 h-px w-2.5 bg-blue-500 -translate-y-1/2" />
        <div className="absolute top-0 left-1.5 h-px w-2.5 bg-blue-500 -translate-y-1/2" />
      </motion.div>
    </>
  );
}
