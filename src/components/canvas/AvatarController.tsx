"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Scene from "./Scene";
import Avatar from "./Avatar";
import { useThree } from "@react-three/fiber";

/**
 * 3D ONLY COMPONENT
 * This sits INSIDE the <Scene> (Canvas), so useThree works perfectly here.
 */
function AvatarWrapper({ currentModel }: { currentModel: string }) {
  const { viewport } = useThree();
  
  // Responsive Scale: Smaller on mobile, 1 on desktop
  const responsiveScale = Math.min(viewport.width / 12, 1);
  const isMobile = viewport.width < 6;

  // Adjust vertical position based on model and screen size
  const verticalPosition: [number, number, number] = 
    currentModel === "/models/waitlay.glb" 
      ? [0, isMobile ? -3.5 : -4.5, 0] 
      : [0, isMobile ? -4.5 : -6.5, 0];

  return (
    <group scale={responsiveScale}>
      <Avatar modelPath={currentModel} position={verticalPosition} />
    </group>
  );
}

/**
 * MAIN CONTROLLER
 * This handles DOM-level logic like scroll and intersection observers.
 */
export default function AvatarController() {
  const [currentModel, setCurrentModel] = useState("/models/wait.glb");
  const { scrollYProgress } = useScroll();

  // Framer Motion useTransform is 2D/CSS based, so it's safe here.
  // We use percentages for X translation to keep it responsive.
  const avatarX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.6, 0.75, 1],
    ["0%", "-40%", "10%", "-5%", "0%"]
  );

  useEffect(() => {
    const observerOptions = { threshold: 0.5 };
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          switch (entry.target.id) {
            case "hero": setCurrentModel("/models/wait.glb"); break;
            case "journey": setCurrentModel("/models/run.glb"); break;
            case "tech":
            case "projects": setCurrentModel("/models/cigrette.glb"); break;
            case "contact": setCurrentModel("/models/waitlay.glb"); break;
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
            {/* AvatarWrapper is a child of Scene, 
              which contains the <Canvas>. 
              This is the ONLY way to use R3F hooks.
            */}
            <AvatarWrapper key={currentModel} currentModel={currentModel} />
          </AnimatePresence>
        </Scene>
      </div>
    </motion.div>
  );
}