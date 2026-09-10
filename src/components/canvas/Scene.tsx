"use client";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { Suspense, useEffect, useState, useCallback } from "react";
import CanvasErrorBoundary from "./CanvasErrorBoundary";

function ModelLoaderFallback() {
  return (
    <mesh position={[0, -0.5, 0]}>
      <sphereGeometry args={[0.25, 16, 16]} />
      <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.3} />
    </mesh>
  );
}

/**
 * Scene Component
 * Resilient, zero-CDN-dependent 3D viewport for the portfolio.
 * Includes WebGL context restoration and Error Boundary protection.
 */
export default function Scene({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreated = useCallback(({ gl }: { gl: any }) => {
    if (gl?.domElement) {
      // Prevent browser from permanently killing WebGL context on tab switch or memory pressure
      gl.domElement.addEventListener(
        "webglcontextlost",
        (event: Event) => {
          event.preventDefault();
          console.warn("WebGL Context Lost — preventing crash and waiting for restore.");
        },
        false
      );

      gl.domElement.addEventListener(
        "webglcontextrestored",
        () => {
          console.log("WebGL Context Restored successfully.");
        },
        false
      );
    }
  }, []);

  if (!mounted) return null;

  return (
    <CanvasErrorBoundary>
      <div className="fixed inset-0 -z-10 h-screen w-full pointer-events-none">
        <Canvas 
          shadows 
          camera={{ position: [0, 0, 10], fov: 58 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
          }}
          onCreated={handleCreated}
        >
          <Suspense fallback={<ModelLoaderFallback />}>
            {/* Self-contained high-end multi-point studio lighting (100% offline & CDN-independent) */}
            <ambientLight intensity={1.5} />
            <hemisphereLight groundColor="#050816" color="#38bdf8" intensity={1.2} />
            <directionalLight position={[6, 8, 5]} intensity={2.2} castShadow />
            <directionalLight position={[-6, -2, -3]} intensity={1.0} color="#38bdf8" />
            <pointLight position={[-6, 2, -2]} color="#38bdf8" intensity={2.2} />
            <pointLight position={[6, -4, 2]} color="#c084fc" intensity={1.6} />
            <pointLight position={[0, 4, 3]} color="#ffffff" intensity={1.2} />

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
    </CanvasErrorBoundary>
  );
}