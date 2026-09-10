"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";

/**
 * Scene Component
 * This acts as the global 3D viewport for the portfolio.
 * It is positioned fixed to the right side of the screen so the avatar 
 * stays visible while the user scrolls through the content on the left.
 */
// src/components/canvas/Scene.tsx
export default function Scene({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 h-screen w-full pointer-events-none">
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 10], fov: 58 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.4} />
          <directionalLight position={[6, 8, 5]} intensity={2.0} castShadow />
          <pointLight position={[-6, 2, -2]} color="#38bdf8" intensity={1.8} />
          <pointLight position={[6, -4, 2]} color="#c084fc" intensity={1.2} />
          <Environment preset="city" /> 
          {children}
          <ContactShadows 
            position={[0, -3.35, 0]} 
            opacity={0.5} 
            scale={16} 
            blur={1.8} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
}