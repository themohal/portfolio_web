"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export default function ParticleTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let mouse = { x: 0, y: 0 };
    let particles: Particle[] = [];
    let lastMouse = { x: 0, y: 0 };

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function handleMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    window.addEventListener("mousemove", handleMouseMove);

    function spawnParticles() {
      const dx = mouse.x - lastMouse.x;
      const dy = mouse.y - lastMouse.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 2) {
        const count = Math.min(Math.floor(speed / 5), 4);
        for (let i = 0; i < count; i++) {
          particles.push({
            x: mouse.x + (Math.random() - 0.5) * 4,
            y: mouse.y + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            life: 1,
            maxLife: 40 + Math.random() * 30,
            size: 1.5 + Math.random() * 2,
            hue: 210 + Math.random() * 60, // blue to purple range
          });
        }
      }

      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      spawnParticles();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const progress = p.life / p.maxLife;
        const alpha = 1 - progress;

        if (progress >= 1) {
          particles.splice(i, 1);
          continue;
        }

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha * 0.6})`;
        ctx!.fill();

        // Glow effect
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * 2 * (1 - progress * 0.3), 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha * 0.15})`;
        ctx!.fill();
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
