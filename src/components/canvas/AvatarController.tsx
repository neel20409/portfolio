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
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Buttery-smooth spring damping on scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 65,
    damping: 20,
    mass: 0.6,
  });

  // Smooth X position across the sections:
  // Hero (Right: 18%) -> Journey (Left: -26%) -> Projects (Right: 28%) -> Tech (Right: 22%) -> Metrics/GitHub (Left: -24%) -> DataLab/Contact (Right: 20%)
  const avatarXDesktop = useTransform(
    smoothProgress,
    [0, 0.16, 0.32, 0.48, 0.65, 0.82, 1],
    ["18%", "-26%", "28%", "22%", "-22%", "20%", "0%"]
  );

  const avatarXMobile = useTransform(
    smoothProgress,
    [0, 0.16, 0.32, 0.48, 0.65, 0.82, 1],
    ["0%", "0%", "4%", "4%", "-4%", "0%", "0%"]
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
            case "projects":
            case "tech":
            case "metrics":
            case "github":
            case "datalab":
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
    ["hero", "journey", "projects", "tech", "metrics", "github", "datalab", "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div 
      style={{ x: isMobileScreen ? avatarXMobile : avatarXDesktop, y: avatarY, scale: avatarScale }}
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