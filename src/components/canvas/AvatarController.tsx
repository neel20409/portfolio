"use client";
import { useState, useMemo } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring, useVelocity } from "framer-motion";
import Scene from "./Scene";
import Avatar from "./Avatar";

export default function AvatarController({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const [currentModel, setCurrentModel] = useState("/models/wait.glb");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track velocity to detect any scroll movement (up or down)
  const scrollVelocity = useVelocity(scrollYProgress);
  
  // Create a smoothed velocity value to prevent flickering during rapid direction changes
  const smoothVelocity = useSpring(scrollVelocity, { 
    stiffness: 100, 
    damping: 30 
  });

 // Inside src/components/canvas/AvatarController.tsx

useMotionValueEvent(scrollYProgress, "change", (latest) => {
  const velocity = Math.abs(smoothVelocity.get());
  
  const isProjectSection = latest >= 0.7 && latest < 0.9;
  const isContactSection = latest >= 0.9; // New range for the bottom of the page

  if (isContactSection) {
    // Transition to a "Hi" or "Waiting" pose when at the contact form
    if (currentModel !== "/models/hiavatar.glb") {
      setCurrentModel("/models/hiavatar.glb"); 
    }
  } else if (isProjectSection) {
    if (currentModel !== "/models/kick.glb") {
      setCurrentModel("/models/kick.glb");
    }
  } else if (velocity > 0.0001) {
    if (currentModel !== "/models/run.glb") {
      setCurrentModel("/models/run.glb");
    }
  } else {
    if (currentModel !== "/models/wait.glb") {
      setCurrentModel("/models/wait.glb");
    }
  }
});
  // Smooth position mapping as the user scrolls
  const avatarX = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.7, 1], 
    ["-7%", "-48%", "-48%", "5%", "5%"] 
  );

  const avatarScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.6], 
    [1, 1, 1, 0.8] 
  );

  // Slight rotation based on scroll position to look more natural during transitions
  const avatarRotateY = useTransform(
    scrollYProgress,
    [0.6, 0.7, 0.9],
    [0, -0.5, 0]
  );

  return (
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
  );
}