"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import About from "@/components/home/About";
import Projects from "@/components/home/Projects";
import Skills from "@/components/home/Skills";
import Contact from "@/components/home/Contact";
import Footer from "@/components/layout/Footer";

const HeroScene = dynamic(() => import("@/components/home/HeroScene"), {
  ssr: false,
  loading: () => (
    <section className="h-screen w-full flex items-center justify-center bg-gray-950">
      <div className="text-gray-400 animate-pulse">Loading...</div>
    </section>
  ),
});

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroScene />
      <About />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </main>
  );
}
