"use client";
import { useGLTF, Float, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function Avatar({ modelPath }: { modelPath: string }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(modelPath);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      // Play the first animation of the current model
      const action = actions[Object.keys(actions)[0]];
      action?.reset().fadeIn(0.5).play();

      return () => {
        action?.fadeOut(0.5);
      };
    }
  }, [actions, modelPath]);

  useFrame((state) => {
    if (!group.current) return;
    // Keep cursor tracking active
    const x = state.mouse.x * 0.2;
    const y = state.mouse.y * 0.2;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, y, 0.1);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x, 0.1);
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.1}>
      <primitive ref={group} object={scene} scale={6} position={[1, -6.7, 1]} />
    </Float>
  );
}

useGLTF.preload("/models/jump.glb");
useGLTF.preload("/models/avatar.glb");
useGLTF.preload("/models/avatar2.glb");
useGLTF.preload("/models/wait.glb");