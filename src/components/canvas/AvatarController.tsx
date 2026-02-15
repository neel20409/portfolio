"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Scene from "./Scene";
import Avatar from "./Avatar";
import { useThree } from "@react-three/fiber";

// This creates a 3D-compatible motion component without needing framer-motion-3d
const MotionGroup = motion.create("group" as any);

export default function AvatarController() {
  const [currentModel, setCurrentModel] = useState("/models/wait.glb");

  const { scrollYProgress } = useScroll();

  const { viewport } = useThree();
  
  // UPDATE: Calculate scale based on viewport width (approx 1 on desktop, 0.6 on mobile)
  const responsiveScale = Math.min(viewport.width / 12, 1);
  const isMobile = viewport.width < 6;
  
  // Update your motion logic to use viewport-relative values
  // Instead of fixed percentages, we use viewport.width units
  const avatarX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.6, 0.75, 1],
    [0, -viewport.width * 0.3, viewport.width * 0.1, -viewport.width * 0.05, 0]
  );

  // UPDATE: Adjust vertical position so it sits higher on mobile
  const verticalPosition: [number, number, number] = 
    currentModel === "/models/waitlay.glb" 
      ? [0, isMobile ? -3.5 : -4.5, 0] 
      : [0, isMobile ? -4.5 : -6.5, 0];

  useEffect(() => {
    const observerOptions = { threshold: 0.5 };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          switch (entry.target.id) {
            case "hero":
              setCurrentModel("/models/wait.glb");
              break;
            case "journey":
              setCurrentModel("/models/run.glb");
              break;
            case "tech":
              setCurrentModel("/models/cigrette.glb");
              break;
            case "projects":
              setCurrentModel("/models/cigrette.glb");
              break;
            case "contact":
              setCurrentModel("/models/waitlay.glb");
              break;
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    ["hero", "journey", "tech", "projects", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div 
      style={{ x: avatarX }}
      className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none transition-all duration-700 ease-out"
    >
      <div className="w-full h-screen">
        <Scene>
          <AnimatePresence mode="wait">
            {/* Using MotionGroup ensures it stays a Three.js Group and doesn't become hgroup */}
            <MotionGroup
              key={currentModel}
              initial={{ scale: 0 }}
              animate={{ scale: responsiveScale }}
              transition={{ duration: 0.5 }}
            >
              <Avatar modelPath={currentModel} position={verticalPosition} />
            </MotionGroup>
          </AnimatePresence>
        </Scene>
      </div>
    </motion.div>
  );
}