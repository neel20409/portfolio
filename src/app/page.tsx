// src/app/page.tsx
"use client";
import { useRef, useEffect, useState } from "react";
import Content from "@/components/content";
import NightSky from "@/components/NightSky";
import JourneySection from "@/components/JourneySection";
import TechSlider from "@/components/TechSlider";
import ProjectSection from "@/components/ProjectSection";
import ContactSection from "@/components/ContactSection";
import AvatarController from "@/components/canvas/AvatarController";
import SocialModal from "@/components/SocialModel"; // Ensure this component is created

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <main ref={containerRef} className="relative bg-transparent overflow-x-hidden">
      <NightSky /> 
      <AvatarController containerRef={containerRef} />

      {/* FIXED GLOBAL FOOTER UI */}
      <div className="fixed bottom-10 left-0 w-full px-10 flex justify-between items-end z-50 pointer-events-none">
        <div className="flex-1" /> 
        <button 
          onClick={() => setIsModalOpen(true)}
          className="pointer-events-auto flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-bold shadow-xl hover:bg-gray-200 transition-all hover:scale-105 active:scale-95"
        >
          CONNECT <span>+</span>
        </button>
        <div className="flex-1 flex justify-end">
          <a href="/cv.pdf" download="Neel_Bhatt_CV.pdf" className="pointer-events-auto text-gray-400 hover:text-white transition-colors text-sm font-medium">
            CV ↓
          </a>
        </div>
      </div>

      <SocialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* SECTIONS */}
      <section id="hero" className="relative h-screen w-full flex items-center z-10">
        <div className="w-1/2 px-10 lg:px-20">
          <Content onCVClick={() => console.log("CV Downloaded")} />
        </div>
      </section>

      <section id="journey" className="relative z-10"><JourneySection /></section>
      <section id="tech" className="relative z-20 bg-[#050816]/60 backdrop-blur-md"><TechSlider /></section>
      <section id="projects" className="relative z-10"><ProjectSection /></section>
      <section id="contact" className="relative z-10"><ContactSection /></section>
    </main>
  );
}