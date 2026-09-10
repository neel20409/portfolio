"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import Scene from "./Scene";
import Avatar from "./Avatar";
import { useThree } from "@react-three/fiber";

/**
 * 3D ONLY COMPONENT
 * Sits inside <Scene> (Canvas) so R3F hooks (useThree) work smoothly.
 */
function AvatarWrapper({ currentModel }: { currentModel: string }) {
  const { viewport } = useThree();
  
  // Responsive Scale: Balanced for mobile and large desktop monitors
  const isMobile = viewport.width < 6;
  const responsiveScale = isMobile ? Math.min(viewport.width / 5.5, 0.9) : 1.0;

  // Calibrated vertical alignment matching 3.65 model scale
  const verticalPosition: [number, number, number] = 
    currentModel === "/models/waitlay.glb" 
      ? [0, isMobile ? -1.4 : -1.8, 0] 
      : currentModel === "/models/run.glb"
      ? [0, isMobile ? -2.4 : -3.3, 0]
      : [0, isMobile ? -2.4 : -3.3, 0];

  return (
    <group scale={responsiveScale}>
      <Avatar modelPath={currentModel} position={verticalPosition} />
    </group>
  );
}

/**
 * MAIN CONTROLLER
 * Smooth spring-damped scroll mapping and intersection detection.
 */
export default function AvatarController() {
  const [currentModel, setCurrentModel] = useState("/models/wait.glb");
  const { scrollYProgress } = useScroll();

  // Buttery-smooth spring damping on scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 65,
    damping: 20,
    mass: 0.6,
  });

  // Smooth X position across the sections:
  // 0.00 (Hero): Stands at +6% (balances left glass card & right HUD)
  // 0.25 (Journey): Moves to -28% (left side while timeline steps scroll on right)
  // 0.50 (Tech Slider): Moves smoothly to +28% (clear right side)
  // 0.70 (Projects): Stays at +28% (right side while projects display strictly on left)
  // 0.88 (Contact): Moves to +22% (right side next to contact form)
  // 1.00 (End): Settles at +22%
  const avatarX = useTransform(
    smoothProgress,
    [0, 0.18, 0.35, 0.50, 0.72, 0.88, 1],
    ["6%", "-10%", "-28%", "28%", "28%", "22%", "22%"]
  );

  // Subtle Y vertical breathing float on scroll
  const avatarY = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["0%", "-2%", "1%", "-1%", "0%"]
  );

  // Subtle scale dynamics on scroll
  const avatarScale = useTransform(
    smoothProgress,
    [0, 0.25, 0.55, 0.85, 1],
    [1, 0.98, 1.02, 1.0, 1.02]
  );

  useEffect(() => {
    const observerOptions = { threshold: 0.35 };
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
      style={{ x: avatarX, y: avatarY, scale: avatarScale }}
      className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none"
    >
      <div className="w-full h-screen">
        <Scene>
          <AnimatePresence mode="wait">
            <AvatarWrapper key={currentModel} currentModel={currentModel} />
          </AnimatePresence>
        </Scene>
      </div>
    </motion.div>
  );
}