"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Scene from "@/components/canvas/Scene";
import Avatar from "@/components/canvas/Avatar";
import Content from "@/components/content";
import NightSky from "@/components/NightSky";
import JourneySection from "@/components/JourneySection"; // The component we created

export default function Home() {
  const containerRef = useRef(null);
const transitionAnimation = (nextAction) => {
  const currentAction = actions[activeName];
  if (nextAction !== currentAction) {
    nextAction.reset().fadeIn(0.5).play();
    currentAction.fadeOut(0.5);
  }
};
  // 1. Track scroll progress for the whole page
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 2. Avatar Movement: 
  // At scroll 0 (Hero): Avatar is on the right (x: 25%)
  // By scroll 0.2 (Journey): Avatar moves to the left (x: -25%)
  const avatarX = useTransform(scrollYProgress, [0, 0.2], ["-7%", "-25%"]);
  
  // 3. Avatar Scale/Fade: Slightly shrink or fade if needed
  const avatarScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <main ref={containerRef} className="relative bg-[#050816] overflow-x-hidden">
      <NightSky />

      {/* FIXED 3D SCENE LAYER */}
      <motion.div 
        style={{ x: avatarX, scale: avatarScale }}
        className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-full h-screen">
          <Scene>
            {/* You can pass scrollYProgress to Avatar to trigger Walk/Run animations inside it */}
            <Avatar modelPath="/models/wait.glb" scrollProgress={scrollYProgress} />
          </Scene>
        </div>
      </motion.div>

      {/* SECTION 1: HERO */}
      <section className="relative h-screen w-full flex items-center z-10">
        <div className="w-1/2">
           {/* Your Glassmorphism Content Component */}
          <Content onCVClick={() => console.log("CV Downloaded")} />
        </div>
        <div className="w-1/2" /> {/* Empty space where Avatar sits in Hero */}
      </section>

      {/* SECTION 2: JOURNEY */}
      <section className="relative z-10">
        <JourneySection />
      </section>

      {/* Optional: Add a Footer or Contact section here */}
    </main>
  );
}