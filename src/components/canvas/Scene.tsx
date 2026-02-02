"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";

// Scene.tsx
export default function Scene({ children }: { children: React.ReactNode }) {
  return (
    // Changed 'inset-0' and 'w-full' to 'right-0 w-1/2'
    <div className="fixed top-0 right-0 -z-10 h-screen w-1/2 transition-opacity duration-1000">
      <Canvas shadows camera={{ position: [0, 0, 9], fov: 65 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} />
          <Environment preset="city" /> 
          {children}
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} />
        </Suspense>
      </Canvas>
    </div>
  );
}