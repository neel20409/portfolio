"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";

export default function Scene({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 -z-10 h-screen w-full bg-[#050505]">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 65 }}>
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