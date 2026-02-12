"use client";
import { useRef, useEffect } from "react"; // Added useEffect
import Content from "@/components/content";
import NightSky from "@/components/NightSky";
import JourneySection from "@/components/JourneySection";
import TechSlider from "@/components/TechSlider";
import ProjectSection from "@/components/ProjectSection";
import ContactSection from "@/components/ContactSection"; // Added ContactSection
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

      {/* Logic-heavy 3D Avatar abstracted into its own component */}
      <AvatarController containerRef={containerRef} />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center z-10">
        <div className="w-1/2 px-10 lg:px-20">
          <Content onCVClick={() => console.log("CV Downloaded")} />
        </div>
      </section>

      {/* Journey Section */}
      <section className="relative z-10">
        <JourneySection />
      </section>

      {/* Tech Slider */}
      <section className="relative z-20 bg-[#050816]/60 backdrop-blur-md">
        <TechSlider />
      </section>

      {/* Project Section */}
      <section className="relative z-10">
        <ProjectSection />
      </section>

      {/* Contact Section */}
      <section className="relative z-10">
        <ContactSection />
      </section>
    </main>
  );
}