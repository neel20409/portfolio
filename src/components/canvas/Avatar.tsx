"use client";
import { useGLTF, Float, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function Avatar({ 
  modelPath, 
  position = [0, -3.3, 0]
}: { 
  modelPath: string; 
  position?: [number, number, number] 
}) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstActionName = Object.keys(actions)[0];
      const action = actions[firstActionName];
      
      action?.reset().fadeIn(0.6).play();

      return () => {
        action?.fadeOut(0.6);
      };
    }
  }, [actions, modelPath]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const targetX = state.mouse.y * 0.15;
    const targetY = -0.6 + state.mouse.x * 0.25;

    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 4, delta);
  });

  return (
    <Float speed={1.0} rotationIntensity={0.25} floatIntensity={0.12}>
      <primitive ref={group} object={scene} scale={3.65} position={position} />
    </Float>
  );
}

// 1. Critical Path: Only preload the Hero model immediately for lightning-fast First Contentful Paint
useGLTF.preload("/models/wait.glb");

// 2. Progressive Deferred Preloading: Stagger subsequent models in background idle time
if (typeof window !== "undefined") {
  const scheduleDeferredPreload = () => {
    // Stagger downloads so they never congest mobile bandwidth during initial load
    setTimeout(() => {
      useGLTF.preload("/models/run.glb");
    }, 1500);

    setTimeout(() => {
      useGLTF.preload("/models/cigrette.glb");
    }, 3000);

    setTimeout(() => {
      useGLTF.preload("/models/waitlay.glb");
    }, 4500);
  };

  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(scheduleDeferredPreload, { timeout: 2000 });
  } else {
    setTimeout(scheduleDeferredPreload, 1500);
  }
}