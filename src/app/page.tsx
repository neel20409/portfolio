"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring, useVelocity } from "framer-motion";
import Scene from "@/components/canvas/Scene";
import Avatar from "@/components/canvas/Avatar";
import Content from "@/components/content";
import NightSky from "@/components/NightSky";
import JourneySection from "@/components/JourneySection";
import TechSlider from "@/components/TechSlider";
import ProjectSection from "@/components/ProjectSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  const containerRef = useRef(null);
  const [currentModel, setCurrentModel] = useState("/models/wait.glb");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. IMPROVED ANIMATION LOGIC: Use velocity for more natural "Running"
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 100, damping: 30 });
// src/app/page.tsx

// 1. STRICT MODEL LOGIC
useMotionValueEvent(scrollYProgress, "change", (latest) => {
  if (latest >= 0.85) {
    // Contact Section (End)
    if (currentModel !== "/models/waitlay.glb") setCurrentModel("/models/waitlay.glb");
  } else if (latest >= 0.6) {
    // Project Section
    if (currentModel !== "/models/kick.glb") setCurrentModel("/models/kick.glb");
  } else if (latest >= 0.25) {
    // Journey Section
    if (currentModel !== "/models/run.glb") setCurrentModel("/models/run.glb");
  } else {
    // Hero Section (Start)
    if (currentModel !== "/models/wait.glb") setCurrentModel("/models/wait.glb");
  }
});

// 2. POSITIONING & SCALE (Fixes clipping for waitlay.glb)
const avatarX = useTransform(
  scrollYProgress,
  [0, 0.01, 0.5, 0.7, 0.9, 1],
  ["-0%", "-48%", "-48%", "25%", "15%", "0%"]
);

const avatarScale = useTransform(
  scrollYProgress,
  [0, 0.8, 0.9, 1],
  [1, 1, 0.55, 0.55] // Significantly shrink the laying model to fit
);

const avatarY = useTransform(
  scrollYProgress,
  [0.85, 1],
  [0, 1.2] // Lifts the avatar up so the laying pose stays visible on screen
);

const avatarRotateY = useTransform(
  scrollYProgress,
  [0, 0.2, 0.6, 0.85, 1],
  [0, 0, 0.8, 0.8, 0] // Rotates to face the content/projects appropriately
);
  return (
    <main ref={containerRef} className="relative bg-transparent overflow-x-hidden">
      <NightSky /> 

      {/* PERSISTENT AVATAR CONTAINER */}
      <motion.div 
        style={{ x: avatarX, scale: avatarScale }}
        className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-full h-screen">

<Scene>
  <motion.group 
    style={{ 
      rotationY: avatarRotateY,
      y: avatarY // Apply the vertical lift here
    }}
  >
     <Avatar modelPath={currentModel} />
  </motion.group>
</Scene>
        </div>
      </motion.div>

      {/* SECTIONS */}
      <section className="relative h-screen w-full flex items-center z-10">
        <div className="w-1/2 px-10 lg:px-20">
          <Content onCVClick={() => console.log("CV Downloaded")} />
        </div>
      </section>

      <section className="relative z-10">
        <JourneySection />
      </section>

      {/* TechSlider: Higher Z-index and Background 
          This creates a 'tunnel' effect where the avatar runs BEHIND the logos
      */}
      <section className="relative z-20 bg-[#050816]/60 backdrop-blur-md">
        <TechSlider />
      </section>

      <section className="relative z-10">
        <ProjectSection />
      </section>
      
    <section className="relative z-10">
        <ContactSection />
      </section>
      
    </main>
  );
}