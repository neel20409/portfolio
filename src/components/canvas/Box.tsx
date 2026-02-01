// src/components/canvas/Box.tsx
"use client";

import { useState } from "react";

export function AnimatedBox() {
  const [hovered, setHover] = useState(false);

  return (
    <mesh
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      scale={hovered ? 1.5 : 1}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}