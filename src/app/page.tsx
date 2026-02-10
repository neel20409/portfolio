"use client";
import { useRef } from "react";
import Content from "@/components/content";
import NightSky from "@/components/NightSky";
import JourneySection from "@/components/JourneySection";
import TechSlider from "@/components/TechSlider";
import ProjectSection from "@/components/ProjectSection";
import AvatarController from "@/components/canvas/AvatarController";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <main ref={containerRef} className="relative bg-transparent overflow-x-hidden">
      <NightSky /> 

      {/* Logic-heavy 3D Avatar now abstracted */}
      <AvatarController containerRef={containerRef} />

      {/* UI Sections */}
      <section className="relative h-screen w-full flex items-center z-10">
        <div className="w-1/2 px-10 lg:px-20">
          <Content onCVClick={() => console.log("CV Downloaded")} />
        </div>
      </section>

      <section className="relative z-10">
        <JourneySection />
      </section>

      <section className="relative z-20 bg-[#050816]/60 backdrop-blur-md">
        <TechSlider />
      </section>

      <section className="relative z-10">
        <ProjectSection />
      </section>
    </main>
  );
}