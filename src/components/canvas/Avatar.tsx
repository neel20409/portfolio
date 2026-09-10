"use client";
import { useGLTF, Float, useAnimations } from "@react-three/drei"; //
import { useFrame } from "@react-three/fiber"; //
import { useRef, useEffect } from "react"; //
import * as THREE from "three"; //

export default function Avatar({ 
  modelPath, 
  position = [0, -6.5, 0]
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

// Preload models for instant seamless transitions
useGLTF.preload("/models/wait.glb");
useGLTF.preload("/models/run.glb");
useGLTF.preload("/models/cigrette.glb");
useGLTF.preload("/models/waitlay.glb");
useGLTF.preload("/models/jump.glb");
useGLTF.preload("/models/avatar2.glb");