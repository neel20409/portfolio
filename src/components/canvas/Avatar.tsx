"use client";
import { useGLTF, Float, useAnimations } from "@react-three/drei"; //
import { useFrame } from "@react-three/fiber"; //
import { useRef, useEffect } from "react"; //
import * as THREE from "three"; //

export default function Avatar({ modelPath }: { modelPath: string }) {
  const group = useRef<THREE.Group>(null); //
  const { scene, animations } = useGLTF(modelPath); //
  const { actions } = useAnimations(animations, group); //

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      // Get the first available animation clip
      const firstActionName = Object.keys(actions)[0];
      const action = actions[firstActionName];
      
      action?.reset().fadeIn(0.5).play(); // Smooth transition

      return () => {
        action?.fadeOut(0.5); // Fade out old model animation
      };
    }
  }, [actions, modelPath]); // Re-run when modelPath changes

  useFrame((state) => {
    if (!group.current) return; //
    const x = state.mouse.x * 0.2; //
    const y = state.mouse.y * 0.2; //
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, y, 0.1); //
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x, 0.1); //
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.1}> {/* */}
      <primitive ref={group} object={scene} scale={6} position={[0, -6.5, 0]} rotation={[0, -0.6, 0]} /> {/* */}
    </Float>
  );
}

// Preload the run model to avoid flickering
useGLTF.preload("/models/run.glb");
useGLTF.preload("/models/wait.glb");
useGLTF.preload("/models/avatar.glb");