"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Scene from "./Scene";
import Avatar from "./Avatar";

export default function AvatarController() {
  const [currentModel, setCurrentModel] = useState("/models/wait.glb");

  // 1. Setup Scroll-based positioning
  const { scrollYProgress } = useScroll();

  // Movement Logic: 
  // - Hero: Center (0%)
  // - Journey: Far Left (-45%)
  // - Tech: Back to Center or slightly right (0%)
  // - Projects: Far Right (40%)
  const avatarX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.6, 0.75, 1],
    ["0%", "-45%", "-20%", "10%", "0%"]
  );
const verticalPosition: [number, number, number] = 
  currentModel === "/models/waitlay.glb" ? [0, -4.5, 0] : [0, -6.5, 0];
  // 2. Setup Intersection Observer for Animations
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
              setCurrentModel("/models/run.glb"); // Pose for timeline
              break;
            case "tech":
              setCurrentModel("/models/cigrette.glb"); // Waving at skills
              break;
            case "projects":
              setCurrentModel("/models/cigrette.glb"); // Action pose
              break;
            case "contact":
              setCurrentModel("/models/waitlay.glb"); // Relaxed pose
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
    // We apply the dynamic X movement to this motion.div
    <motion.div 
      style={{ x: avatarX }}
      className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none transition-all duration-700 ease-out"
    >
      <div className="w-full h-screen">
        <Scene>
          <AnimatePresence mode="wait">
            <motion.group
              key={currentModel}
              // Apply the vertical offset here
             
            >
             <Avatar modelPath={currentModel} position={verticalPosition} />
            </motion.group>
          </AnimatePresence>
        </Scene>
      </div>
    </motion.div>
  );
}