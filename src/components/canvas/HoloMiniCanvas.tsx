"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import CanvasErrorBoundary from "./CanvasErrorBoundary";

function MorphingShape({ activeIndex }: { activeIndex: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 1.2;
      meshRef.current.rotation.x += delta * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 1.5;
    }
  });

  // Colors based on discipline
  const colors = ["#38bdf8", "#34d399", "#c084fc"];
  const currentColor = colors[activeIndex] || "#38bdf8";

  return (
    <Float speed={2.5} rotationIntensity={0.8} floatIntensity={0.6}>
      <group ref={meshRef}>
        {activeIndex === 0 && (
          // Web: Floating 3D Geometric Matrix Cube
          <group>
            <mesh>
              <boxGeometry args={[1.5, 1.1, 0.2]} />
              <meshBasicMaterial wireframe color={currentColor} transparent opacity={0.85} />
            </mesh>
            <mesh position={[0, -0.7, 0]}>
              <cylinderGeometry args={[0.35, 0.5, 0.2, 12]} />
              <meshBasicMaterial wireframe color={currentColor} transparent opacity={0.6} />
            </mesh>
          </group>
        )}

        {activeIndex === 1 && (
          // Mobile: Floating 3D Phone Wireframe
          <group>
            <mesh>
              <boxGeometry args={[0.9, 1.8, 0.15]} />
              <meshBasicMaterial wireframe color={currentColor} transparent opacity={0.85} />
            </mesh>
            <mesh position={[0, 0.7, 0.08]}>
              <boxGeometry args={[0.3, 0.06, 0.02]} />
              <meshBasicMaterial color={currentColor} />
            </mesh>
          </group>
        )}

        {activeIndex === 2 && (
          // 3D / AI: Quantum 3D Icosahedron & Ring
          <group>
            <mesh>
              <icosahedronGeometry args={[0.9, 1]} />
              <meshBasicMaterial wireframe color={currentColor} transparent opacity={0.9} />
            </mesh>
            <mesh ref={ringRef}>
              <torusGeometry args={[1.3, 0.03, 12, 48]} />
              <meshBasicMaterial color={currentColor} transparent opacity={0.7} />
            </mesh>
          </group>
        )}
      </group>
    </Float>
  );
}

export default function HoloMiniCanvas({ activeIndex }: { activeIndex: number }) {
  return (
    <CanvasErrorBoundary>
      <div className="h-20 w-20 pointer-events-none">
        <Canvas
          camera={{ position: [0, 0, 3.2], fov: 45 }}
          gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        >
          <ambientLight intensity={1.2} />
          <MorphingShape activeIndex={activeIndex} />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}
