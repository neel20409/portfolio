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
useMotionValueEvent(scrollYProgress, "change", (latest) => {
  const velocity = Math.abs(smoothVelocity.get());

  // Define your Project Section Range
  const isProjectSection = latest >= 0.8 && latest < 1;

  if (isProjectSection) {
    // FORCE the simple model in this zone
    if (currentModel !== "/models/kick.glb") {
      setCurrentModel("/models/kick.glb");
    }
  } else if (velocity > 0.0005) {
    // RUNNING (Only outside the project section)
    if (currentModel !== "/models/run.glb") {
      setCurrentModel("/models/run.glb");
    }
  } else {
    // WAITING (Idle)
    if (currentModel !== "/models/wait.glb") {
      setCurrentModel("/models/wait.glb");
    }
  }
});

// 0.0 -> 0.2: Moves Left (Journey)
// 0.2 -> 0.5: Stays Left
// 0.5 -> 0.6: Runs to Right
// 0.6 -> 0.9: STAYS on Right (Project Section)
// 0.9 -> 1.0: Exits Screen
const avatarX = useTransform(
  scrollYProgress,
  [0, 0.2, 0.5, 0.7, 1], 
  ["-7%", "-48%", "-48%", "5%", "5%"] 
);
  // 3. SCALE & ROTATION (Optional: makes the run look better)
  const avatarScale = useTransform(
  scrollYProgress,
  [0, 0.2, 0.5, 0.6], 
  [1, 1, 1, .8] // 0.75 reduces the size by 25% only in the project zone
);
  const avatarRotateY = useTransform(
    scrollYProgress,
    [0.6, 0.7, 0.9],
    [0, -0.5, 0] // Rotates slightly toward the direction he's running
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
            <motion.group style={{ rotationY: avatarRotateY }}>
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
      
    
      
    </main>
  );
}