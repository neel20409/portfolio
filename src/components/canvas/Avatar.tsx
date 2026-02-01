"use client";
import { useGLTF, Float } from "@react-three/drei";
import { motion } from "framer-motion-3d"; // Ensure npm install framer-motion-3d

export default function Avatar() {
  const { scene } = useGLTF("/models/avatar.glb");

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <motion.primitive 
        object={scene} 
        scale={2.2} // Increased scale to make sure it's visible
        position={[0, -1.5, 0]}
        initial={{ opacity: 0, y: 1 }}
        animate={{ opacity: 1, y: -1.5 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </Float>
  );
}

useGLTF.preload("/models/avatar.glb");