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
export default function Scene({ children }: { children: React.ReactNode }) {
  return (
    <div 
      /* LAYOUT SETTINGS:
         - 'fixed top-0 right-0': Keeps the 3D canvas pinned to the right side.
         - 'w-1/2': Occupies only half the screen width to leave room for text.
         - '-z-10': Places the 3D scene behind the UI text (Journey Cards).
         - 'pointer-events-none': Crucial so that the 3D layer doesn't block 
           mouse clicks on buttons or links in your 'Content' or 'Journey' sections.
      */
      className="fixed top-0 right-0 -z-10 h-screen w-1/2 transition-opacity duration-1000 pointer-events-none"
    >
      <Canvas 
        shadows 
        /* CAMERA SETTINGS:
           - position: [0, 0, 9] moves the camera further back so the 
             avatar fits better in the narrower 1/2 screen width.
        */
        camera={{ position: [0, 0, 9], fov: 65 }}
      >
        {/* Suspense handles the loading state of the 3D model */}
        <Suspense fallback={null}>
          {/* Global lighting */}
          <ambientLight intensity={1.5} />
          
          {/* Environment provides realistic reflections on the model */}
          <Environment preset="city" /> 

          {/* This is where the Avatar component will be rendered */}
          {children}

          {/* Ground Shadow:
              - position: [0, -1.5, 0] ensures the shadow is right under the avatar's feet.
          */}
          <ContactShadows 
            position={[1, -1.5, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
}