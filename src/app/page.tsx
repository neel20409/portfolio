"use client";
import { useRef, useEffect } from "react";
import Content from "@/components/content";
import NightSky from "@/components/NightSky";
import JourneySection from "@/components/JourneySection";
import TechSlider from "@/components/TechSlider";
import ProjectSection from "@/components/ProjectSection";
import ContactSection from "@/components/ContactSection";
import AvatarController from "@/components/canvas/AvatarController";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Force the browser to ignore previous scroll position on reload
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Immediately scroll to the top of the page
    window.scrollTo(0, 0);
  }, []);

  return (
    <main ref={containerRef} className="relative bg-transparent overflow-x-hidden">
      <NightSky /> 

      {/* Logic-heavy 3D Avatar abstracted and using IntersectionObserver */}
      <AvatarController />

      {/* UI Sections with IDs for the AvatarController to track */}
      <section id="hero" className="relative h-screen w-full flex items-center z-10">
        <div className="w-1/2 px-10 lg:px-20">
          <Content onCVClick={() => console.log("CV Downloaded")} />
        </div>
      </section>

      <section id="journey" className="relative z-10">
        <JourneySection />
      </section>

      <section id="tech" className="relative z-20 bg-[#050816]/60 backdrop-blur-md">
        <TechSlider />
      </section>

      <section id="projects" className="relative z-10">
        <ProjectSection />
      </section>

      <section id="contact" className="relative z-10">
        <ContactSection />
      </section>
    </main>
  );
}