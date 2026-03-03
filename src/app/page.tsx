"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import About from "@/components/home/About";
import Projects from "@/components/home/Projects";
import Skills from "@/components/home/Skills";
import Contact from "@/components/home/Contact";
import Footer from "@/components/layout/Footer";
import VideoShowreel from "@/components/home/VideoShowreel";
import CircuitDivider from "@/components/ui/CircuitDivider";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ParticleTrail from "@/components/ui/ParticleTrail";
import CustomCursor from "@/components/ui/CustomCursor";

const HeroScene = dynamic(() => import("@/components/home/HeroScene"), {
  ssr: false,
  loading: () => (
    <section className="h-screen w-full flex items-center justify-center bg-gray-950">
      <div className="text-gray-400 animate-pulse font-mono text-sm">INITIALIZING...</div>
    </section>
  ),
});

export default function Home() {
  return (
    <main className="min-h-screen">
      <CustomCursor />
      <ParticleTrail />
      <ScrollProgress />
      <Navbar />
      <HeroScene />
      <CircuitDivider />
      <VideoShowreel />
      <CircuitDivider />
      <About />
      <CircuitDivider />
      <Projects />
      <CircuitDivider />
      <Skills />
      <CircuitDivider />
      <Contact />
      <Footer />
    </main>
  );
}
