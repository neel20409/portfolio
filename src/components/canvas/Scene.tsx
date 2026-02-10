"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";

/**
 * Scene Component
 * This acts as the global 3D viewport for the portfolio.
 * It is positioned fixed to the right side of the screen so the avatar 
 * stays visible while the user scrolls through the content on the left.
 */
// src/components/canvas/Scene.tsx
export default function Scene({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-0 left-1/4 -z-10 h-screen w-full transition-opacity duration-1000 pointer-events-none">
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 10], fov: 65 }} // Move camera back slightly
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} />
          <Environment preset="city" /> 
          {children}
          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.4} 
            scale={20} // Wide shadow for the laying body
            blur={2} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
}