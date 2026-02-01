"use client";
import { useGLTF, Float } from "@react-three/drei";
import { motion } from "motion/react"; 

export default function Avatar() {
  const { scene } = useGLTF("/models/avatar.glb");

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.1}>
      <motion.primitive 
        object={scene} 
        scale={5.5} 
        position={[0, -9, 0]}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1.5 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
    </Float>
  );
}

useGLTF.preload("/models/avatar.glb");